[**@universal-stores/spring**](../README.md)

***

[@universal-stores/spring](../README.md) / RAFImplementation

# Type Alias: RAFImplementation

> **RAFImplementation** = `object`

Defined in: [src/lib/spring.ts:12](https://github.com/cdellacqua/spring-store.js/blob/main/src/lib/spring.ts#L12)

Request animation frame implementation.

## Methods

### cancel()

> **cancel**(`id`): `void`

Defined in: [src/lib/spring.ts:22](https://github.com/cdellacqua/spring-store.js/blob/main/src/lib/spring.ts#L22)

Remove a callback that was previously added to the animation frame queue.

#### Parameters

##### id

`unknown`

the return value of the request method, which identifies an enqueued callback.

#### Returns

`void`

***

### request()

> **request**(`callback`): `unknown`

Defined in: [src/lib/spring.ts:17](https://github.com/cdellacqua/spring-store.js/blob/main/src/lib/spring.ts#L17)

Enqueue the passed callback for the execution on the next animation frame.

#### Parameters

##### callback

(`time`) => `void`

a function which will be called once an animation frame is available.

#### Returns

`unknown`
