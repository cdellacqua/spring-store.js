[**@universal-stores/spring**](../README.md)

***

[@universal-stores/spring](../README.md) / SpringStore

# Type Alias: SpringStore\<T\>

> **SpringStore**\<`T`\> = [`ReadonlyStore`](ReadonlyStore.md)\<`T`\> & `object`

Defined in: [src/lib/spring.ts:59](https://github.com/cdellacqua/spring-store.js/blob/main/src/lib/spring.ts#L59)

A spring store is a special kind of store that performs a physics simulation
to reach a set target. It can be used to perform animations and to make a UI
feel more natural (e.g. in a drag&drop scenario).

## Type Declaration

### speed$

> **speed$**: [`ReadonlyStore`](ReadonlyStore.md)\<`number`\>

The speed derived from the velocity using Pythagoras' Theorem.

### state$

> **state$**: [`ReadonlyStore`](ReadonlyStore.md)\<[`SpringStoreState`](SpringStoreState.md)\>

A store containing the current state of the spring.

### target$

> **target$**: [`Store`](Store.md)\<`T`\>

A store containing the target value of the spring. Changes to this store will start the physics simulation (if not already running).

### velocity$

> **velocity$**: [`ReadonlyStore`](ReadonlyStore.md)\<`T`\>

A store containing the velocity of the spring, expressed using the same shape as the spring value.

### damping()

#### Call Signature

> **damping**(): `number`

Return the current damping.

The damping is used to compute how much friction needs to be applied to slow down the spring.
The friction is computed as `friction = velocity * damping`.

##### Returns

`number`

#### Call Signature

> **damping**(`newDamping`): `number`

Set a new damping value. If the physics simulation is
running, the new value will be used immediately.

The damping is used to compute how much friction needs to be applied to slow down the spring.
The friction is computed as `friction = velocity * damping`.

##### Parameters

###### newDamping

`number`

##### Returns

`number`

### idle()

> **idle**(): `Promise`\<`void`\>

Wait for the simulation to end, either because it reached the target smoothly or because `.skip()` was called.

#### Returns

`Promise`\<`void`\>

### pause()

> **pause**(): `Promise`\<`void`\>

Pause the simulation.

#### Returns

`Promise`\<`void`\>

#### Throws

if `.skip()` is called while the simulation is pausing or paused.

### precision()

#### Call Signature

> **precision**(): `number`

Return the current precision.

The precision is a threshold used to determine if the simulation can stop.
This threshold is applied to both the velocity and value of the spring. If no value in both
objects is greater that the precision, the simulation stops and the spring value is set to the
current target.

##### Returns

`number`

#### Call Signature

> **precision**(`newPrecision`): `number`

Set a new precision value. If the physics simulation is
running, the new value will be used immediately.

The precision is a threshold used to determine if the simulation can stop.
This threshold is applied to both the velocity and value of the spring. If no value in both
objects is greater that the precision, the simulation stops and the spring value is set to the
current target.

##### Parameters

###### newPrecision

`number`

##### Returns

`number`

### resume()

> **resume**(): `void`

Resume a paused simulation.

#### Returns

`void`

### skip()

> **skip**(): `Promise`\<`void`\>

Stop the simulation, even if it was paused, and set the store value to the current target.

#### Returns

`Promise`\<`void`\>

### stiffness()

#### Call Signature

> **stiffness**(): `number`

Return the current stiffness.

The stiffness is used to compute the elastic force as per Hooke's law:
`elastic_force = displacement * stiffness`.

##### Returns

`number`

#### Call Signature

> **stiffness**(`newStiffness`): `number`

Set a new stiffness value. If the physics simulation is
running, the new value will be used immediately.

The stiffness is used to compute the elastic force as per Hooke's law:
`elastic_force = displacement * stiffness`.

##### Parameters

###### newStiffness

`number`

##### Returns

`number`

## Type Parameters

### T

`T`
