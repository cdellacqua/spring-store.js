[@universal-stores/spring](../README.md) / SpringStorePauseError

# Class: SpringStorePauseError

A custom error that's raised when the `.pause()` method is invoked on a spring store.
It's used internally to stop any pending operation as soon as possible (e.g. a pending requestAnimationFrame).

## Hierarchy

- `Error`

  ↳ **`SpringStorePauseError`**

## Table of contents

### Constructors

- [constructor](SpringStorePauseError.md#constructor)

### Properties

- [cause](SpringStorePauseError.md#cause)
- [message](SpringStorePauseError.md#message)
- [name](SpringStorePauseError.md#name)
- [stack](SpringStorePauseError.md#stack)
- [prepareStackTrace](SpringStorePauseError.md#preparestacktrace)
- [stackTraceLimit](SpringStorePauseError.md#stacktracelimit)

### Methods

- [captureStackTrace](SpringStorePauseError.md#capturestacktrace)

## Constructors

### constructor

• **new SpringStorePauseError**()

#### Overrides

Error.constructor

#### Defined in

[src/lib/spring.ts:42](https://github.com/cdellacqua/spring-store.js/blob/main/src/lib/spring.ts#L42)

## Properties

### cause

• `Optional` **cause**: `Error`

#### Inherited from

Error.cause

#### Defined in

node_modules/typescript/lib/lib.es2022.error.d.ts:26

___

### message

• **message**: `string`

#### Inherited from

Error.message

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1029

___

### name

• **name**: `string`

#### Inherited from

Error.name

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1028

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1030

___

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: `Error`, `stackTraces`: `CallSite`[]) => `any`

#### Type declaration

▸ (`err`, `stackTraces`): `any`

Optional override for formatting stack traces

**`See`**

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

##### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

##### Returns

`any`

#### Inherited from

Error.prepareStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

#### Defined in

node_modules/@types/node/globals.d.ts:13

## Methods

### captureStackTrace

▸ `Static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Create .stack property on a target object

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

Error.captureStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:4
