# @universal-stores/spring

A spring store is a special kind of store that performs a physics simulation
to reach a set target. It can be used to perform animations and to make a UI
feel more natural (e.g. in a drag&drop scenario).

The physics simulation
is performed using `requestAnimationFrame` if available, otherwise `setTimeout` is
used as a substitute, simulating a 60Hz screen.

This package is based on [universal-stores](https://www.npmjs.com/package/universal-stores),
which are observable containers of values.

[NPM Package](https://www.npmjs.com/package/@universal-stores/spring)

`npm install @universal-stores/spring`

[Documentation](./docs/README.md)

## SpringStore

A `SpringStore<T>` is a [store](https://www.npmjs.com/package/universal-stores). In particular,
it's a `ReadonlyStore<T>` that exposes its `value` and a `subscribe` method to listen for changes.

Its value can be either a number, an array of numbers or an object whose values are numbers.

It also contains nested stores, the most important of them being `target$`, which contains (and lets you
modify) the current target the spring should reach.

As an example:

```ts
import {makeSpringStore} from '@universal-stores/spring';

const spring$ = makeSpringStore(0);
spring$.subscribe(console.log); // immediately prints 0
// Calling `.set(...)` will cause the above subscription
// to emit values ranging from 0 to 1 until the target is reached.
spring$.target$.set(1);
```

## Creating a spring

To create a spring, this library provides a `makeSpringStore` function. This function
takes one or two arguments: the initial value of the store and an optional configuration
object.

Examples:

```ts
import {makeSpringStore} from '@universal-stores/spring';

const springFromNumber$ = makeSpringStore(42);
const springFromArray$ = makeSpringStore([1, 2, 3]);
const springFromObject$ = makeSpringStore({x: 73, y: 3.14});
```

The optional configuration object can be used to customize the spring behavior, for example
by changing its bounciness and stiffness.

```ts
import {makeSpringStore} from '@universal-stores/spring';

const bouncySpring$ = makeSpringStore(42, {
	damping: 10,
	stiffness: 300,
});
```

## Customizing a spring

If you want to add custom methods to a spring and encapsulate some behaviour behind
a method, you can use the object spread syntax as shown in the following example:

```ts
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
console.log(customSpring$.content()); // 1
await customSpring$.home();
console.log(customSpring$.content()); // 0
```
