import {expect} from 'chai';
import {
	makeSpringStore,
	SpringStore,
	SpringStoreSkipError,
	SpringStoreState,
} from '../src/lib';

describe('spring store', () => {
	afterEach(() => {
		(
			globalThis as {
				requestAnimationFrame: unknown;
			}
		).requestAnimationFrame = undefined;
		(globalThis as {cancelAnimationFrame: unknown}).cancelAnimationFrame =
			undefined;
	});

	it('creates spring stores and checks their states while rest', () => {
		const number = 13;
		const array = [43, 21, 5];
		const object = {x: 543, y: 23, z: 43};
		const springFromNumber$ = makeSpringStore(number);
		expect(springFromNumber$.content()).to.eqls(number);
		expect(springFromNumber$.target$.content()).to.eqls(number);
		expect(springFromNumber$.speed$.content()).to.eqls(0);
		expect(springFromNumber$.velocity$.content()).to.eqls(0);
		const springFromArray$ = makeSpringStore(array);
		expect(springFromArray$.content()).to.eqls(array);
		expect(springFromArray$.target$.content()).to.eqls(array);
		expect(springFromArray$.speed$.content()).to.eqls(0);
		expect(springFromArray$.velocity$.content()).to.eqls([0, 0, 0]);
		const springFromObject$ = makeSpringStore(object);
		expect(springFromObject$.content()).to.eqls(object);
		expect(springFromObject$.target$.content()).to.eqls(object);
		expect(springFromObject$.speed$.content()).to.eqls(0);
		expect(springFromObject$.velocity$.content()).to.eqls({x: 0, y: 0, z: 0});
	});
	it('creates a spring changing the defaults', () => {
		const spring$ = makeSpringStore(0, {
			damping: 0.3,
			precision: 10,
			stiffness: 0.8,
		});
		expect(spring$.damping()).to.eq(0.3);
		expect(spring$.precision()).to.eq(10);
		expect(spring$.stiffness()).to.eq(0.8);
	});
	it('changes the spring settings after instantiation', () => {
		const spring$ = makeSpringStore(0);

		spring$.damping(0.3);
		spring$.precision(10);
		spring$.stiffness(0.8);

		expect(spring$.damping()).to.eq(0.3);
		expect(spring$.precision()).to.eq(10);
		expect(spring$.stiffness()).to.eq(0.8);
	});
	it('awaits the simulation state to become idle', async () => {
		const number = 13;
		const array = [43, 21, 5];
		const object = {x: 543, y: 23, z: 43};
		const targetNumber = 90;
		const targetArray = [12, 1, 5];
		const targetObject = {x: 143, y: 20, z: 183};
		const springFromNumber$ = makeSpringStore(number);
		const springFromArray$ = makeSpringStore(array);
		const springFromObject$ = makeSpringStore(object);
		springFromNumber$.target$.set(targetNumber);
		springFromArray$.target$.set(targetArray);
		springFromObject$.target$.set(targetObject);
		await Promise.all([
			springFromNumber$.idle(),
			springFromArray$.idle(),
			springFromObject$.idle(),
		]);
		expect(springFromNumber$.content()).to.eqls(targetNumber);
		expect(springFromArray$.content()).to.eqls(targetArray);
		expect(springFromObject$.content()).to.eqls(targetObject);
	});
	it('checks the number of active subscriptions to the spring', () => {
		const spring$ = makeSpringStore(0);
		expect(spring$.nOfSubscriptions()).to.eq(0);
		const unsubscribe = spring$.subscribe(() => undefined);
		expect(spring$.nOfSubscriptions()).to.eq(1);
		unsubscribe();
		expect(spring$.nOfSubscriptions()).to.eq(0);
	});
	it('checks that the promise returned by idle() resolves once the store has reached its target', async () => {
		const spring$ = makeSpringStore(0);
		expect(spring$.content()).to.eqls(0);
		expect(spring$.target$.content()).to.eqls(0);
		spring$.target$.set(1);
		expect(spring$.content()).to.not.eqls(1);
		await spring$.idle();
		expect(spring$.content()).to.eqls(1);
	});
	it('shows that the store will take the default requestAnimationFrame implementation if available in the global context', async () => {
		let called = false;
		(
			globalThis as {
				requestAnimationFrame: (cb: (time: number) => void) => unknown;
			}
		).requestAnimationFrame = (cb) =>
			setTimeout(() => {
				cb(performance.now());
				called = true;
			}, 1000 / 60);
		(
			globalThis as {cancelAnimationFrame: (id: number) => void}
		).cancelAnimationFrame = (id) => clearTimeout(id);
		const spring$ = makeSpringStore(0);
		spring$.target$.set(1);
		await spring$.idle();
		expect(called).to.be.true;
	});
	it('simulates a dt of 0 between two animation frames', async () => {
		let previousTimestamp = performance.now();
		let callCount = 0;
		(
			globalThis as {
				requestAnimationFrame: (cb: (time: number) => void) => unknown;
			}
		).requestAnimationFrame = (cb) => {
			callCount++;
			const currentTimestamp = performance.now();
			let id: unknown;
			if (callCount > 10 && callCount < 15) {
				id = setTimeout(() => cb(previousTimestamp), 1000 / 60);
			} else {
				id = setTimeout(() => cb(currentTimestamp), 1000 / 60);
				previousTimestamp = currentTimestamp;
			}
			return id;
		};
		(
			globalThis as {cancelAnimationFrame: (id: number) => void}
		).cancelAnimationFrame = (id) => clearTimeout(id);
		const spring$ = makeSpringStore(0);
		spring$.target$.set(1);
		await spring$.idle();
	});
	it('skips the simulation while requestAnimationFrame is pending', (done) => {
		(
			globalThis as {
				requestAnimationFrame: (cb: (time: number) => void) => unknown;
			}
		).requestAnimationFrame = (cb) => {
			setTimeout(() => {
				spring$.skip().then(done, done);
			}, 200);
			return setTimeout(() => cb(performance.now()), 500);
		};
		(
			globalThis as {cancelAnimationFrame: (id: number) => void}
		).cancelAnimationFrame = (id) => clearTimeout(id);
		const spring$ = makeSpringStore(0);
		spring$.target$.set(1);
	});
	it('checks the smooth transition towards the target', async () => {
		const spring$ = makeSpringStore(0);
		const allValues: number[] = [];
		spring$.subscribe((current) => allValues.push(current));
		spring$.target$.set(1);
		await spring$.idle();
		expect(allValues.length).to.be.greaterThan(0);
		for (let i = 0; i < allValues.length - 1; i++) {
			expect(Math.abs(allValues[i] - allValues[i + 1])).to.be.lessThan(0.5);
		}
	});
	it('pauses and resumes the store', (done) => {
		const spring$ = makeSpringStore(0);
		const states: SpringStoreState[] = [];
		spring$.state$.subscribe((state) => states.push(state));
		spring$.target$.set(1);
		const unsubscribe = spring$.subscribe((current) => {
			if (current > 0.5) {
				unsubscribe();
				spring$
					.pause()
					.then(() => {
						expect(spring$.content()).to.not.eqls(1);
						spring$.resume();
						return spring$.idle();
					})
					.then(() => {
						expect(spring$.content()).to.eqls(1);
						expect(states).to.eqls([
							'idle',
							'running',
							'pausing',
							'paused',
							'running',
							'idle',
						]);
						done();
					})
					.catch(done);
			}
		});
	});
	it('calls pause() and resume() multiple times', (done) => {
		const spring$ = makeSpringStore(0);
		const states: SpringStoreState[] = [];
		spring$.state$.subscribe((state) => states.push(state));
		spring$.target$.set(1);
		const unsubscribe = spring$.subscribe((current) => {
			if (current > 0.5) {
				unsubscribe();
				spring$.pause().catch(done);
				spring$.pause().catch(done);
				spring$.pause().catch(done);
				spring$.pause().catch(done);
				spring$.pause().catch(done);
				spring$.pause().catch(done);
				spring$
					.pause()
					.then(() => {
						expect(spring$.content()).to.not.eqls(1);
						spring$.resume();
						spring$.resume();
						spring$.resume();
						spring$.resume();
						spring$.resume();
						return spring$.idle();
					})
					.then(() => {
						expect(spring$.content()).to.eqls(1);
						expect(states).to.eqls([
							'idle',
							'running',
							'pausing',
							'paused',
							'running',
							'idle',
						]);
						done();
					})
					.catch(done);
			}
		});
	});
	it('skips to target', async () => {
		const spring$ = makeSpringStore(0);
		const states: SpringStoreState[] = [];
		const allValues: number[] = [];
		spring$.subscribe((current) => allValues.push(current));
		spring$.state$.subscribe((state) => states.push(state));
		spring$.target$.set(1);
		await spring$.skip();
		expect(spring$.content()).to.eqls(1);
		expect(allValues.length).to.be.greaterThan(0);
		for (let i = 0; i < allValues.length - 1; i++) {
			expect(
				Math.abs(allValues[i] - allValues[i + 1]),
			).to.be.greaterThanOrEqual(0.5);
		}
		expect(states).to.eqls(['idle', 'running', 'skipping', 'idle']);
	});
	it('calls skip() and pause() almost at the same time', async () => {
		const spring$ = makeSpringStore(0);
		const states: SpringStoreState[] = [];
		spring$.state$.subscribe((state) => states.push(state));
		spring$.target$.set(1);
		await Promise.race([spring$.skip(), spring$.pause()]);
		expect(spring$.content()).to.eqls(1);
		expect(states).to.eqls(['idle', 'running', 'skipping', 'idle']);
	});
	it('calls pause() and skip() almost at the same time', async () => {
		const spring$ = makeSpringStore(0);
		const states: SpringStoreState[] = [];
		spring$.state$.subscribe((state) => states.push(state));
		spring$.target$.set(1);
		let pauseErr: unknown;
		await Promise.all([
			spring$.pause().catch((err) => (pauseErr = err)),
			spring$.skip(),
		]);
		expect(spring$.content()).to.eqls(1);
		expect(states).to.eqls(['idle', 'running', 'pausing', 'skipping', 'idle']);
		expect(pauseErr).to.be.instanceOf(SpringStoreSkipError);
	});
	it('calls skip() after pause()', async () => {
		const spring$ = makeSpringStore(0);
		const states: SpringStoreState[] = [];
		spring$.state$.subscribe((state) => states.push(state));
		spring$.target$.set(1);
		await spring$.pause();
		await spring$.skip();
		expect(spring$.content()).to.eqls(1);
		expect(states).to.eqls([
			'idle',
			'running',
			'pausing',
			'paused',
			'skipping',
			'idle',
		]);
	});
	it('changes the target while the simulation is still running', async () => {
		const spring$ = makeSpringStore(0);
		spring$.target$.set(1);
		expect(spring$.state$.content()).to.eq('running');
		spring$.target$.set(2);
		expect(spring$.state$.content()).to.eq('running');
		await spring$.idle();
		expect(spring$.content()).to.eq(2);
	});
	it('tests maxDt', async () => {
		let alter = 1;
		const spring$ = makeSpringStore(0, {
			requestAnimationFrameImplementation: {
				request: (cb) =>
					setTimeout(() => {
						alter *= 2;
						cb(performance.now() + alter * 1000);
					}, 1000 / 60),
				cancel: (id) => clearTimeout(id as number),
			},
			maxDt: 1,
			damping: 10,
			stiffness: 300,
		});
		spring$.target$.set(1);
		const allValues: number[] = [];
		spring$.subscribe((current) => allValues.push(current));
		await spring$.idle();
		expect(allValues.some((v) => v >= 0 && v <= 1)).to.be.true;
		expect(allValues.length).to.be.greaterThan(10);
	});
	it('tests that the simulation remains stable even if there are some huge dt', async () => {
		let alter = 1;
		const spring$ = makeSpringStore(0, {
			requestAnimationFrameImplementation: {
				request: (cb) =>
					setTimeout(() => {
						alter *= 2;
						cb(performance.now() + alter * 1000);
					}, 1000 / 60),
				cancel: (id) => clearTimeout(id as number),
			},
			maxDt: 1000,
			damping: 100,
			stiffness: 3000,
		});
		spring$.target$.set(1);
		const allValues: number[] = [];
		spring$.subscribe((current) => allValues.push(current));
		await spring$.idle();
		expect(allValues.some((v) => v >= 0 && v <= 1)).to.be.true;
		expect(allValues.length).to.be.lessThanOrEqual(10);
	});
	it('tests that the precision can be changed after spreading a spring object', async () => {
		function makeCustomSpring(): SpringStore<number> {
			const spring$ = makeSpringStore(0);
			return {
				...spring$,
			};
		}
		const allValues: number[] = [];
		const customSpring$ = makeCustomSpring();
		customSpring$.subscribe((v) => allValues.push(v));
		customSpring$.target$.set(1);
		await customSpring$.idle();
		const nOfValuesWithDefaultPrecision = allValues.length;
		expect(customSpring$.content()).to.eq(1);
		customSpring$.target$.set(0);
		await customSpring$.idle();
		allValues.splice(0, allValues.length);
		customSpring$.precision(10);
		customSpring$.target$.set(1);
		await customSpring$.idle();
		expect(customSpring$.content()).to.eq(1);
		expect(allValues.length).to.be.lessThan(nOfValuesWithDefaultPrecision);
	});
});
