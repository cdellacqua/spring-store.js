import {expect} from 'chai';
import {makeSpringStore} from '../src/lib';

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
		expect(springFromNumber$.value).to.eqls(42);
		expect(springFromArray$.value).to.eqls([1, 2, 3]);
		expect(springFromObject$.value).to.eqls({x: 73, y: 3.14});
	});
	it('readme 3', async () => {
		const bouncySpring$ = makeSpringStore(42, {
			damping: 0.09,
			stiffness: 0.1,
		});
		bouncySpring$.target$.set(43);
		const allValues: number[] = [];
		bouncySpring$.subscribe((value) => allValues.push(value));
		await bouncySpring$.idle();
		expect(allValues.some((v) => v > 43)).to.be.true;
	});
});
