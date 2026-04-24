[**@universal-stores/spring**](../README.md)

***

[@universal-stores/spring](../README.md) / makeSpringStore

# Function: makeSpringStore()

> **makeSpringStore**\<`T`\>(`value`, `config?`): [`SpringStore`](../type-aliases/SpringStore.md)\<`T` *extends* `number` ? `number` : `T`\>

Defined in: [src/lib/spring.ts:252](https://github.com/cdellacqua/spring-store.js/blob/main/src/lib/spring.ts#L252)

Create a spring store.
A spring store is a special kind of store that performs a physics simulation
to reach a set target. It can be used to perform animations and to make a UI
feel more natural (e.g. in a drag&drop scenario).

Example usage
```ts
const spring$ = makeSpringStore(0);
spring$.subscribe(console.log);
// Calling `.set(...)` will cause the above subscription
// to emit values until the target is reached.
spring$.target$.set(1);
```

## Type Parameters

### T

`T` *extends* `number` \| `Record`\<`string`, `number`\> \| `number`[]

## Parameters

### value

`T` *extends* `number` ? `number` : `T`

the initial value of the store. It can be a number, an array of numbers or an object whose values are numbers.

### config?

[`SpringStoreConfig`](../type-aliases/SpringStoreConfig.md)

an optional configuration object to customize the behavior of the store.

## Returns

[`SpringStore`](../type-aliases/SpringStore.md)\<`T` *extends* `number` ? `number` : `T`\>

a spring store.
