import {expect} from 'chai';
import {makeSpringStore, SpringStore} from '../src/lib';

describe('examples', () => {
	it('readme 1', async () => {
		const spring$ = makeSpringStore(0);
		const allValues: number[] = [];
		spring$.subscribe((value) => allValues.push(value));
		// Calling `.set(...)` will cause the above subscription
		// to emit values until the target is reached.
		spring$.target$.set(1);
		await spring$.idle();
		expect(allValues.length).to.be.greaterThan(0);
	});
	it('readme 2', () => {
		const springFromNumber$ = makeSpringStore(42);
		const springFromArray$ = makeSpringStore([1, 2, 3]);
		const springFromObject$ = makeSpringStore({x: 73, y: 3.14});
		expect(springFromNumber$.content()).to.eqls(42);
		expect(springFromArray$.content()).to.eqls([1, 2, 3]);
		expect(springFromObject$.content()).to.eqls({x: 73, y: 3.14});
	});
	it('readme 3', async () => {
		const bouncySpring$ = makeSpringStore(42, {
			damping: 10,
			stiffness: 300,
		});
		bouncySpring$.target$.set(43);
		const allValues: number[] = [];
		bouncySpring$.subscribe((value) => allValues.push(value));
		await bouncySpring$.idle();
		expect(allValues.some((v) => v > 43)).to.be.true;
	});
	it('object spread syntax', async () => {
		function makeCustomSpring(): SpringStore<number> & {home(): Promise<void>} {
			const spring$ = makeSpringStore(0);
			return {
				...spring$,
				home() {
					spring$.target$.set(0);
					return spring$.idle();
				},
			};
		}
		const customSpring$ = makeCustomSpring();
		customSpring$.target$.set(1);
		await customSpring$.idle();
		expect(customSpring$.content()).to.eq(1);
		await customSpring$.home();
		expect(customSpring$.content()).to.eq(0);
	});
});
