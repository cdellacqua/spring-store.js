@universal-stores/spring

# @universal-stores/spring

## Table of contents

### Classes

- [SpringStorePauseError](classes/SpringStorePauseError.md)
- [SpringStoreSkipError](classes/SpringStoreSkipError.md)

### Type Aliases

- [RAFImplementation](README.md#rafimplementation)
- [ReadonlyStore](README.md#readonlystore)
- [Setter](README.md#setter)
- [SpringConfig](README.md#springconfig)
- [SpringStore](README.md#springstore)
- [SpringStoreConfig](README.md#springstoreconfig)
- [SpringStoreState](README.md#springstorestate)
- [Store](README.md#store)
- [Subscriber](README.md#subscriber)
- [Unsubscribe](README.md#unsubscribe)
- [Update](README.md#update)
- [Updater](README.md#updater)

### Functions

- [makeSpringStore](README.md#makespringstore)

## Type Aliases

### RAFImplementation

Ƭ **RAFImplementation**: `Object`

Request animation frame implementation.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `cancel` | (`id`: `unknown`) => `void` |
| `request` | (`callback`: (`time`: `number`) => `void`) => `unknown` |

#### Defined in

[src/lib/spring.ts:13](https://github.com/cdellacqua/spring-store.js/blob/main/src/lib/spring.ts#L13)

___

### ReadonlyStore

Ƭ **ReadonlyStore**<`T`\>: `Object`

A store that can have subscribers and emit values to them. It also
provides the current value upon subscription. It's readonly in the
sense that it doesn't provide direct set/update methods, unlike [Store](README.md#store),
therefore its value can only be changed by a StartHandler (see also makeReadonlyStore).

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `content` | () => `T` |
| `nOfSubscriptions` | () => `number` |
| `subscribe` | (`subscriber`: [`Subscriber`](README.md#subscriber)<`T`\>) => [`Unsubscribe`](README.md#unsubscribe) |

#### Defined in

node_modules/universal-stores/dist/index.d.ts:33

___

### Setter

Ƭ **Setter**<`T`\>: (`newValue`: `T`) => `void`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

▸ (`newValue`): `void`

A generic setter function. Used in [Store](README.md#store)

##### Parameters

| Name | Type |
| :------ | :------ |
| `newValue` | `T` |

##### Returns

`void`

#### Defined in

node_modules/universal-stores/dist/index.d.ts:14

___

### SpringConfig

Ƭ **SpringConfig**: `Object`

Configuration options for the spring

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `damping` | `number` | The damping is used to compute how much friction needs to be applied to slow down the spring. The friction is computed as `friction = velocity * damping`.  **`Default`**  30 |
| `precision` | `number` | A threshold used to determine if the simulation can stop. This threshold is applied to both the velocity and the value of the spring. If no value in both objects is greater than the precision, the simulation stops and the spring value is set to the current target. |
| `stiffness` | `number` | The stiffness is used to compute the elastic force as per Hooke's law: `elastic_force = displacement * stiffness`.  **`Default`**  300 |

#### Defined in

[src/lib/spring.ts:134](https://github.com/cdellacqua/spring-store.js/blob/main/src/lib/spring.ts#L134)

___

### SpringStore

Ƭ **SpringStore**<`T`\>: [`ReadonlyStore`](README.md#readonlystore)<`T`\> & { `speed$`: [`ReadonlyStore`](README.md#readonlystore)<`number`\> ; `state$`: [`ReadonlyStore`](README.md#readonlystore)<[`SpringStoreState`](README.md#springstorestate)\> ; `target$`: [`Store`](README.md#store)<`T`\> ; `velocity$`: [`ReadonlyStore`](README.md#readonlystore)<`T`\> ; `damping`: () => `number`(`newDamping`: `number`) => `number` ; `idle`: () => `Promise`<`void`\> ; `pause`: () => `Promise`<`void`\> ; `precision`: () => `number`(`newPrecision`: `number`) => `number` ; `resume`: () => `void` ; `skip`: () => `Promise`<`void`\> ; `stiffness`: () => `number`(`newStiffness`: `number`) => `number`  }

A spring store is a special kind of store that performs a physics simulation
to reach a set target. It can be used to perform animations and to make a UI
feel more natural (e.g. in a drag&drop scenario).

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[src/lib/spring.ts:60](https://github.com/cdellacqua/spring-store.js/blob/main/src/lib/spring.ts#L60)

___

### SpringStoreConfig

Ƭ **SpringStoreConfig**: { `dt?`: `number` ; `maxDt?`: `number` ; `requestAnimationFrameImplementation?`: [`RAFImplementation`](README.md#rafimplementation)  } & `Partial`<[`SpringConfig`](README.md#springconfig)\>

Configuration options for a spring store

#### Defined in

[src/lib/spring.ts:159](https://github.com/cdellacqua/spring-store.js/blob/main/src/lib/spring.ts#L159)

___

### SpringStoreState

Ƭ **SpringStoreState**: ``"idle"`` \| ``"running"`` \| ``"pausing"`` \| ``"skipping"`` \| ``"paused"``

All possible states of a spring store

#### Defined in

[src/lib/spring.ts:48](https://github.com/cdellacqua/spring-store.js/blob/main/src/lib/spring.ts#L48)

___

### Store

Ƭ **Store**<`T`\>: [`ReadonlyStore`](README.md#readonlystore)<`T`\> & { `set`: (`v`: `T`) => `void` ; `update`: (`updater`: [`Updater`](README.md#updater)<`T`\>) => `void`  }

A store that can have subscribers and emit values to them. It also
provides the current value upon subscription.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

node_modules/universal-stores/dist/index.d.ts:56

___

### Subscriber

Ƭ **Subscriber**<`T`\>: (`current`: `T`) => `void`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

▸ (`current`): `void`

A generic subscriber that takes a value emitted by a signal as its only parameter.

##### Parameters

| Name | Type |
| :------ | :------ |
| `current` | `T` |

##### Returns

`void`

#### Defined in

node_modules/@cdellacqua/signals/dist/index.d.ts:2

___

### Unsubscribe

Ƭ **Unsubscribe**: () => `void`

#### Type declaration

▸ (): `void`

A function that's used to unsubscribe a subscriber from a signal.

##### Returns

`void`

#### Defined in

node_modules/@cdellacqua/signals/dist/index.d.ts:4

___

### Update

Ƭ **Update**<`T`\>: (`updater`: (`current`: `T`) => `T`) => `void`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

▸ (`updater`): `void`

A generic update function. Used in [Store](README.md#store)

##### Parameters

| Name | Type |
| :------ | :------ |
| `updater` | (`current`: `T`) => `T` |

##### Returns

`void`

#### Defined in

node_modules/universal-stores/dist/index.d.ts:20

___

### Updater

Ƭ **Updater**<`T`\>: (`current`: `T`) => `T`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

▸ (`current`): `T`

A generic updater function. Used in [Store](README.md#store)

##### Parameters

| Name | Type |
| :------ | :------ |
| `current` | `T` |

##### Returns

`T`

#### Defined in

node_modules/universal-stores/dist/index.d.ts:18

## Functions

### makeSpringStore

▸ **makeSpringStore**<`T`\>(`value`, `config?`): [`SpringStore`](README.md#springstore)<`T` extends `number` ? `number` : `T`\>

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

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `number` \| `number`[] \| `Record`<`string`, `number`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `T` extends `number` ? `number` : `T` | the initial value of the store. It can be a number, an array of numbers or an object whose values are numbers. |
| `config?` | [`SpringStoreConfig`](README.md#springstoreconfig) | an optional configuration object to customize the behavior of the store. |

#### Returns

[`SpringStore`](README.md#springstore)<`T` extends `number` ? `number` : `T`\>

a spring store.

#### Defined in

[src/lib/spring.ts:247](https://github.com/cdellacqua/spring-store.js/blob/main/src/lib/spring.ts#L247)
