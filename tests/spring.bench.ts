import {bench, describe} from 'vitest';
import {makeSpringStore, RAFImplementation} from '../src/lib/index.js';

/**
 * Synchronous-as-possible RAF impl that advances a virtual clock by a fixed
 * frame interval. Each "frame" resolves via a microtask, so the spring's
 * internal `await waitAnimationFrame()` loop progresses without real timers.
 */
function makeFakeRaf(frameMs = 1000 / 60): RAFImplementation {
	let now = 0;
	return {
		request(cb) {
			queueMicrotask(() => {
				now += frameMs;
				cb(now);
			});
			return 0;
		},
		cancel() {},
	};
}

function makeNumericObject(size: number): Record<string, number> {
	const obj: Record<string, number> = {};
	for (let i = 0; i < size; i++) {
		obj[`k${i}`] = 0;
	}
	return obj;
}

function makeNumericObjectTarget(size: number): Record<string, number> {
	const obj: Record<string, number> = {};
	for (let i = 0; i < size; i++) {
		obj[`k${i}`] = 100;
	}
	return obj;
}

function makeNumericArray(size: number): number[] {
	return new Array<number>(size).fill(0);
}

function makeNumericArrayTarget(size: number): number[] {
	return new Array<number>(size).fill(100);
}

describe('spring store — time step simulation to convergence', () => {
	bench('number', async () => {
		const spring$ = makeSpringStore(0, {
			requestAnimationFrameImplementation: makeFakeRaf(),
		});
		spring$.target$.set(100);
		await spring$.idle();
	});

	bench('object with 4 properties', async () => {
		const spring$ = makeSpringStore(makeNumericObject(4), {
			requestAnimationFrameImplementation: makeFakeRaf(),
		});
		spring$.target$.set(makeNumericObjectTarget(4));
		await spring$.idle();
	});

	bench('array with 4 items', async () => {
		const spring$ = makeSpringStore(makeNumericArray(4), {
			requestAnimationFrameImplementation: makeFakeRaf(),
		});
		spring$.target$.set(makeNumericArrayTarget(4));
		await spring$.idle();
	});

	bench('object with 20 properties', async () => {
		const spring$ = makeSpringStore(makeNumericObject(20), {
			requestAnimationFrameImplementation: makeFakeRaf(),
		});
		spring$.target$.set(makeNumericObjectTarget(20));
		await spring$.idle();
	});

	bench('array with 20 items', async () => {
		const spring$ = makeSpringStore(makeNumericArray(20), {
			requestAnimationFrameImplementation: makeFakeRaf(),
		});
		spring$.target$.set(makeNumericArrayTarget(20));
		await spring$.idle();
	});
});
