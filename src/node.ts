import {makeDerivedStore} from 'universal-stores';
import {makeSpringStore} from './lib';

const spring$ = makeSpringStore(1, {
	damping: 0.09,
	stiffness: 0.01,
});

const all$ = makeDerivedStore(
	[spring$, spring$.speed$, spring$.state$, spring$.target$],
	(x) => x,
);
all$.subscribe(([spring, speed, state, target]) => {
	process.stdout.write(
		'\u001b[2K\r' +
			JSON.stringify({
				spring: spring.toFixed(2),
				target: target.toFixed(2),
				speed: speed.toFixed(2),
				state,
			}),
	);
});

let target = 2;
setInterval(() => {
	spring$.target$.set(target);
	target = Math.random() * 10;
}, 4000);
