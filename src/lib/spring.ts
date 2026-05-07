import {makeDerivedStore, makeStore, ReadonlyStore, Store} from 'universal-stores';

const noop = () => undefined as void;

/** Request animation frame implementation. */
export type RAFImplementation = {
	/**
	 * Enqueue the passed callback for the execution on the next animation frame.
	 * @param callback a function which will be called once an animation frame is available.
	 */
	request(callback: (time: number) => void): unknown;
	/**
	 * Remove a callback that was previously added to the animation frame queue.
	 * @param id the return value of the request method, which identifies an enqueued callback.
	 */
	cancel(id: unknown): void;
};

/**
 * A custom error that's raised when the `.skip()` method is invoked on a spring store.
 * If `.skip()` is called while the store is 'pausing', the promise returned by `.pause()`
 * will reject with this error.
 */
export class SpringStoreSkipError extends Error {
	constructor() {
		super('[spring store] physics simulation skipped');
	}
}

/**
 * A custom error that's raised when the `.pause()` method is invoked on a spring store.
 * It's used internally to stop any pending operation as soon as possible (e.g. a pending requestAnimationFrame).
 */
export class SpringStorePauseError extends Error {
	constructor() {
		super('[spring store] physics simulation skipped');
	}
}

/** All possible states of a spring store */
export type SpringStoreState = 'idle' | 'running' | 'pausing' | 'skipping' | 'paused';

/**
 * A spring store is a special kind of store that performs a physics simulation
 * to reach a set target. It can be used to perform animations and to make a UI
 * feel more natural (e.g. in a drag&drop scenario).
 */
export type SpringStore<T> = ReadonlyStore<T> & {
	/**
	 * Return the current stiffness.
	 *
	 * The stiffness is used to compute the elastic force as per Hooke's law:
	 * `elastic_force = displacement * stiffness`.
	 */
	stiffness(): number;
	/**
	 * Set a new stiffness value. If the physics simulation is
	 * running, the new value will be used immediately.
	 *
	 * The stiffness is used to compute the elastic force as per Hooke's law:
	 * `elastic_force = displacement * stiffness`.
	 */
	stiffness(newStiffness: number): number;
	/**
	 * Return the current damping.
	 *
	 * The damping is used to compute how much friction needs to be applied to slow down the spring.
	 * The friction is computed as `friction = velocity * damping`.
	 */
	damping(): number;
	/**
	 * Set a new damping value. If the physics simulation is
	 * running, the new value will be used immediately.
	 *
	 * The damping is used to compute how much friction needs to be applied to slow down the spring.
	 * The friction is computed as `friction = velocity * damping`.
	 */
	damping(newDamping: number): number;
	/**
	 * Return the current precision.
	 *
	 * The precision is a threshold used to determine if the simulation can stop.
	 * This threshold is applied to both the velocity and value of the spring. If no value in both
	 * objects is greater that the precision, the simulation stops and the spring value is set to the
	 * current target.
	 */
	precision(): number;
	/**
	 * Set a new precision value. If the physics simulation is
	 * running, the new value will be used immediately.
	 *
	 * The precision is a threshold used to determine if the simulation can stop.
	 * This threshold is applied to both the velocity and value of the spring. If no value in both
	 * objects is greater that the precision, the simulation stops and the spring value is set to the
	 * current target.
	 */
	precision(newPrecision: number): number;
	/** A store containing the current state of the spring. */
	state$: ReadonlyStore<SpringStoreState>;
	/** A store containing the velocity of the spring, expressed using the same shape as the spring value. */
	velocity$: ReadonlyStore<T>;
	/** The speed derived from the velocity using Pythagoras' Theorem. */
	speed$: ReadonlyStore<number>;
	/** Stop the simulation, even if it was paused, and set the store value to the current target. */
	skip(): Promise<void>;
	/**
	 * Pause the simulation.
	 * @throws {SpringStoreSkipError} if `.skip()` is called while the simulation is pausing or paused.
	 */
	pause(): Promise<void>;
	/** Resume a paused simulation. */
	resume(): void;
	/** Wait for the simulation to end, either because it reached the target smoothly or because `.skip()` was called. */
	idle(): Promise<void>;
	/**
	 * A store containing the target value of the spring. Changes to this store will start the physics simulation (if not already running).
	 */
	target$: Store<T>;
};

/** Configuration options for the spring */
export type SpringConfig = {
	/**
	 * The stiffness is used to compute the elastic force as per Hooke's law:
	 * `elastic_force = displacement * stiffness`.
	 *
	 * @default 300
	 */
	stiffness: number;
	/**
	 * The damping is used to compute how much friction needs to be applied to slow down the spring.
	 * The friction is computed as `friction = velocity * damping`.
	 *
	 * @default 30
	 */
	damping: number;
	/**
	 * A threshold used to determine if the simulation can stop.
	 * This threshold is applied to both the velocity and the value of the spring. If no value in both
	 * objects is greater than the precision, the simulation stops and the spring value is set to the
	 * current target.
	 */
	precision: number;
};

/** Configuration options for a spring store */
export type SpringStoreConfig = {
	/**
	 * A custom requestAnimationFrame + cancelAnimationFrame implementation.
	 * By default, the store will use requestAnimationFrame and cancelAnimationFrame
	 * if available in the runtime. If these functions are not available, it will
	 * default to using setTimeout and clearTimeout emulating a 60Hz display.
	 */
	requestAnimationFrameImplementation?: RAFImplementation;
	/**
	 * The time, expressed in seconds, between two consecutive simulation steps.
	 * The sampled interval between two animation frames will be divided by dt, therefore making the physics engine
	 * run multiple substeps or skip some steps
	 * to keep the simulation stable on displays with different FPS.
	 *
	 * @default 1/300 (~5 simulation steps each frame on a 60Hz display, ~2-3 on a 144Hz display).
	 */
	dt?: number;
	/**
	 * The maximum allowed interval, expressed in seconds, between two consecutive animation frames.
	 * The sampled interval will be capped to this value, so that the simulation will not accumulate
	 * too many pending steps in cases where the device
	 * is temporary hung or the user changes tab or hides the browser window (therefore pausing the animation frame queue).
	 *
	 * @default 1/24 (24Hz)
	 */
	maxDt?: number;
} & Partial<SpringConfig>;

/**
 * Create a promisified version of requestAnimationFrame that supports cancellation through
 * an abort signal.
 * @param rafImpl a custom requestAnimationFrame + cancelAnimationFrame implementation.
 * @returns a Promisified version of requestAnimationFrame.
 */
function makeWaitAnimationFrame(rafImpl?: RAFImplementation) {
	return function waitAnimationFrame(abortSignal?: AbortSignal): Promise<number> {
		const actualRafImpl =
			rafImpl ||
			(typeof requestAnimationFrame !== 'undefined'
				? {
						request: (cb: (time: number) => void) => requestAnimationFrame(cb),
						cancel: (id: number) => cancelAnimationFrame(id),
					}
				: {
						request: (cb: (time: number) => void) => setTimeout(() => cb(performance.now()), 1000 / 60),
						cancel: (id: number) => clearTimeout(id),
					});

		let callbackId: unknown | undefined;
		const rafPromise = new Promise<number>((res, rej) => {
			if (abortSignal?.aborted) {
				rej(abortSignal.reason);
				return;
			}

			const listener = () => {
				if (callbackId !== undefined) {
					actualRafImpl.cancel(callbackId);
				}
				rej(abortSignal?.reason);
			};
			abortSignal?.addEventListener('abort', listener, {once: true});
			callbackId = actualRafImpl.request((time) => {
				abortSignal?.removeEventListener('abort', listener);
				callbackId = undefined;
				res(time);
			});
		});
		return rafPromise;
	};
}

/**
 * Create a spring store.
 * A spring store is a special kind of store that performs a physics simulation
 * to reach a set target. It can be used to perform animations and to make a UI
 * feel more natural (e.g. in a drag&drop scenario).
 *
 * Example usage
 * ```ts
 * const spring$ = makeSpringStore(0);
 * spring$.subscribe(console.log);
 * // Calling `.set(...)` will cause the above subscription
 * // to emit values until the target is reached.
 * spring$.target$.set(1);
 * ```
 *
 * @param value the initial value of the store. It can be a number, an array of numbers or an object whose values are numbers.
 * @param config an optional configuration object to customize the behavior of the store.
 * @returns a spring store.
 */
export function makeSpringStore<T extends number | number[] | Record<string, number>>(
	value: T extends number ? number : T,
	config?: SpringStoreConfig,
): SpringStore<T extends number ? number : T> {
	let damping = config?.damping ?? 30;
	let stiffness = config?.stiffness ?? 300;
	let precision = config?.precision ?? 0.1;

	type WidenedT = T extends number ? number : T;

	const waitAnimationFrame = makeWaitAnimationFrame(config?.requestAnimationFrameImplementation);

	// Internal math representation. For `number` user values, a scalar; for both
	// `number[]` and `Record<string, number>` user values, a packed `number[]`
	// indexed by the captured key order. Routing object-keyed values through an
	// internal array lets the per-frame math use indexed access (V8 optimizes
	// this aggressively) instead of repeated string-keyed property lookups.
	type Internal = number | number[];
	type ValueOps = {
		zero(): Internal;
		clone(v: Internal): Internal;
		scale(v: Internal, k: number): Internal; // fresh: v * k
		scaleMut(v: Internal, k: number): Internal; // mutates v (where applicable): v *= k
		addMut(a: Internal, b: Internal): Internal; // mutates a: a += b
		subMut(a: Internal, b: Internal): Internal; // mutates a: a -= b
		sub(a: Internal, b: Internal): Internal; // fresh: a - b
		lerp(s: Internal, e: Internal, t: number): Internal; // fresh
		maxAbs(v: Internal): number;
		norm(v: Internal): number;
		toUser(v: Internal): WidenedT;
		fromUser(v: WidenedT): Internal;
	};
	function makeArrayLikeOps(length: number) {
		return {
			zero: () => new Array<number>(length).fill(0),
			clone: (v: number[]) => v.slice(),
			scale: (v: number[], k: number) => {
				const out = new Array<number>(length);
				for (let i = 0; i < length; i++) out[i] = v[i] * k;
				return out;
			},
			scaleMut: (v: number[], k: number) => {
				for (let i = 0; i < length; i++) v[i] *= k;
				return v;
			},
			addMut: (a: number[], b: number[]) => {
				for (let i = 0; i < length; i++) a[i] += b[i];
				return a;
			},
			subMut: (a: number[], b: number[]) => {
				for (let i = 0; i < length; i++) a[i] -= b[i];
				return a;
			},
			sub: (a: number[], b: number[]) => {
				const out = new Array<number>(length);
				for (let i = 0; i < length; i++) out[i] = a[i] - b[i];
				return out;
			},
			lerp: (s: number[], e: number[], t: number) => {
				const out = new Array<number>(length);
				for (let i = 0; i < length; i++) out[i] = s[i] + (e[i] - s[i]) * t;
				return out;
			},
			maxAbs: (v: number[]) => {
				let max = 0;
				for (let i = 0; i < length; i++) {
					const abs = Math.abs(v[i]);
					if (abs > max) max = abs;
				}
				return max;
			},
			norm: (v: number[]) => {
				let sum = 0;
				for (let i = 0; i < length; i++) sum += v[i] * v[i];
				return Math.sqrt(sum);
			},
		};
	}
	const valueOps = ((): ValueOps => {
		if (typeof value === 'number') {
			const ops = {
				zero: () => 0,
				clone: (v: number) => v,
				scale: (v: number, k: number) => v * k,
				scaleMut: (v: number, k: number) => v * k,
				addMut: (a: number, b: number) => a + b,
				subMut: (a: number, b: number) => a - b,
				sub: (a: number, b: number) => a - b,
				lerp: (s: number, e: number, t: number) => s + (e - s) * t,
				maxAbs: (v: number) => Math.abs(v),
				norm: (v: number) => Math.abs(v),
				toUser: (v: number) => v,
				fromUser: (v: number) => v,
			};
			return ops as unknown as ValueOps;
		}
		if (Array.isArray(value)) {
			const length = value.length;
			const ops = {
				...makeArrayLikeOps(length),
				toUser: (v: number[]) => v,
				fromUser: (v: number[]) => v.slice(),
			};
			return ops as unknown as ValueOps;
		}
		const keys = Object.keys(value);
		const length = keys.length;
		const ops = {
			...makeArrayLikeOps(length),
			toUser: (v: number[]) => {
				const o: Record<string, number> = {};
				for (let i = 0; i < length; i++) o[keys[i]] = v[i];
				return o;
			},
			fromUser: (v: Record<string, number>) => {
				const arr = new Array<number>(length);
				for (let i = 0; i < length; i++) arr[i] = v[keys[i]];
				return arr;
			},
		};
		return ops as unknown as ValueOps;
	})();

	let targetValue: Internal = valueOps.zero();
	const state$ = makeStore<SpringStoreState>('idle');

	let idlePromise: Promise<void> | undefined;
	let resumePromise: Promise<void> | undefined;
	let pausePromise: Promise<void> | undefined;
	let resolveResumePromise = noop;
	let rejectResumePromise = noop as (err?: unknown) => void;
	let resolvePausePromise = noop;
	let rejectPausePromise = noop as (err?: unknown) => void;
	let resolveIdlePromise = noop;

	// Private internal-typed velocity store. The public `velocity$` and `speed$`
	// derive from it, so neither toUser nor norm runs on a frame when nobody
	// is subscribed to them. The math loop only writes the internal value.
	const velocityInternal$ = makeStore<Internal>(valueOps.zero());
	const velocity$ = makeDerivedStore(velocityInternal$, (v) => valueOps.toUser(v));
	// speed = |velocity|
	const speed$ = makeDerivedStore(velocityInternal$, (v) => valueOps.norm(v));

	type PhysicsState = {
		velocity: Internal;
		value: Internal;
	};

	let physicsState: PhysicsState = {
		velocity: valueOps.zero(),
		value: valueOps.fromUser(value as WidenedT),
	};

	let interpolatedState: PhysicsState = {
		velocity: valueOps.zero(),
		value: valueOps.fromUser(value as WidenedT),
	};

	const current$ = makeStore(value);
	const target$ = makeStore(value);
	let firstTarget = true;
	target$.subscribe((target) => {
		targetValue = valueOps.fromUser(target as WidenedT);
		if (firstTarget) {
			firstTarget = false;
			return;
		}
		stuckWindowAccDt = 0;
		stuckWindowMaxDelta = 0;
		previousWindowMaxDelta = Infinity;
		follow().catch((err) => console.error('[spring store] unable to follow target', err));
	});
	state$.subscribe((state) => {
		if (state === 'idle') {
			resolveIdlePromise();
			idlePromise = undefined;
			resolveIdlePromise = noop;
		} else if (!idlePromise) {
			idlePromise = new Promise((res) => (resolveIdlePromise = res));
		}
	});

	function integrate(dt: number, state: PhysicsState): PhysicsState {
		// Hooke's law:
		// F = -displacement * elastic constant
		const elasticForce = valueOps.scale(remainingDelta, stiffness);
		// We are cheating a little bit here, by using a custom
		// friction that's proportional to the current velocity:
		const friction = valueOps.scale(state.velocity, damping);
		// F = m * a => a = F / m. Assuming m = 1 we get:
		const acceleration = valueOps.subMut(elasticForce, friction);
		// dv = a * dt
		const dVelocity = valueOps.scaleMut(acceleration, dt);
		// v += dv
		const velocity = valueOps.addMut(dVelocity, state.velocity);
		// dValue = v * dt
		const dValue = valueOps.scale(velocity, dt);

		return {
			// value += dv
			value: valueOps.addMut(dValue, state.value),
			velocity,
		};
	}
	function skipToTarget(): PhysicsState {
		remainingDelta = valueOps.zero();
		return {
			velocity: valueOps.zero(),
			value: valueOps.clone(targetValue),
		};
	}
	let remainingDelta = valueOps.zero();
	const dt = config?.dt || 1 / 300;
	const maxDt = config?.maxDt ?? 1 / 24;

	// Rolling-window envelope of |remainingDelta| used to detect
	// non-convergence (e.g. damping <= 0 producing perpetual oscillation).
	// Reset on every target change so that a fresh trajectory doesn't
	// inherit the previous window's peak.
	const stuckWindowDuration = 1;
	const stuckWindowDecayThreshold = 0.99;
	let stuckWindowAccDt = 0;
	let stuckWindowMaxDelta = 0;
	let previousWindowMaxDelta = Infinity;

	async function follow() {
		if (state$.content() !== 'idle') {
			return;
		}
		try {
			state$.set('running');

			let done = false;
			let previousTime: number | undefined;

			while (!done) {
				switch (state$.content()) {
					case 'skipping': {
						physicsState = skipToTarget();
						interpolatedState = physicsState;
						done = true;
						break;
					}
					case 'pausing': {
						resolvePausePromise();
						state$.set('paused');
						try {
							await resumePromise;
							state$.set('running');
						} catch (resumeErr) {
							if (resumeErr instanceof SpringStoreSkipError) {
								physicsState = skipToTarget();
								interpolatedState = physicsState;
								done = true;
								/* c8 ignore next */
							} else throw resumeErr; // This shouldn't be possible as the reject callback is always called with a SpringStoreSkipError instance
						}
						break;
					}
					case 'running': {
						previousTime = previousTime ?? (await waitAnimationFrame());
						const currentTime = await waitAnimationFrame();
						const frameDt = Math.min(maxDt, (currentTime - previousTime) / 1000 || dt);
						let remainingDt = frameDt;
						previousTime = currentTime;

						let previousState = physicsState;
						while (remainingDt > 0) {
							remainingDelta = valueOps.sub(targetValue, physicsState.value);

							previousState = physicsState;
							physicsState = integrate(dt, previousState);

							remainingDt -= dt;
						}

						const interpolationRatio = 1 + remainingDt / dt; /* negative */
						interpolatedState = {
							value: valueOps.lerp(previousState.value, physicsState.value, interpolationRatio),
							velocity: valueOps.lerp(previousState.velocity, physicsState.velocity, interpolationRatio),
						};

						const currentMaxDelta = valueOps.maxAbs(remainingDelta);

						if (!(currentMaxDelta >= precision || valueOps.maxAbs(physicsState.velocity) >= precision)) {
							physicsState = skipToTarget();
							interpolatedState = physicsState;
							done = true;
						} else {
							stuckWindowMaxDelta = Math.max(stuckWindowMaxDelta, currentMaxDelta);
							stuckWindowAccDt += frameDt;
							if (stuckWindowAccDt >= stuckWindowDuration) {
								if (stuckWindowMaxDelta >= previousWindowMaxDelta * stuckWindowDecayThreshold) {
									physicsState = skipToTarget();
									interpolatedState = physicsState;
									done = true;
								}
								previousWindowMaxDelta = stuckWindowMaxDelta;
								stuckWindowMaxDelta = 0;
								stuckWindowAccDt = 0;
							}
						}
						break;
					}
					case 'idle':
					case 'paused':
						break;
				}

				current$.set(valueOps.toUser(interpolatedState.value));
				velocityInternal$.set(interpolatedState.velocity);
			}
		} finally {
			state$.set('idle');
		}
	}

	return {
		precision(newPrecision?: number) {
			if (newPrecision !== undefined) {
				precision = newPrecision;
			}
			return precision;
		},
		damping(newDamping?: number) {
			if (newDamping !== undefined) {
				damping = newDamping;
			}
			return damping;
		},
		stiffness(newStiffness?: number) {
			if (newStiffness !== undefined) {
				stiffness = newStiffness;
			}
			return stiffness;
		},
		nOfSubscriptions: current$.nOfSubscriptions,
		content: current$.content,
		speed$,
		state$,
		subscribe: current$.subscribe,
		watch: current$.watch,
		velocity$,
		async pause() {
			if (state$.content() === 'running') {
				state$.set('pausing');
				pausePromise = new Promise<void>((res, rej) => {
					resolvePausePromise = () => {
						pausePromise = undefined;
						resolvePausePromise = noop;
						rejectPausePromise = noop;
						res();
					};
					rejectPausePromise = (err) => {
						pausePromise = undefined;
						resolvePausePromise = noop;
						rejectPausePromise = noop;
						rej(err);
					};
				});
				pausePromise.catch(noop);
				resumePromise = new Promise<void>((res, rej) => {
					resolveResumePromise = () => {
						resumePromise = undefined;
						resolveResumePromise = noop;
						rejectResumePromise = noop;
						res();
					};
					rejectResumePromise = (err) => {
						resumePromise = undefined;
						resolveResumePromise = noop;
						rejectResumePromise = noop;
						rej(err);
					};
				});
				resumePromise.catch(noop);
			}
			await pausePromise;
		},
		resume() {
			resolveResumePromise();
		},
		async skip() {
			const state = state$.content();
			if ((state === 'running' || state === 'pausing' || state === 'paused') && idlePromise) {
				state$.set('skipping');
				const skipError = new SpringStoreSkipError();
				rejectResumePromise(skipError);
				rejectPausePromise(skipError);
				await idlePromise;
			}
		},
		target$,
		async idle() {
			await idlePromise;
		},
	};
}
