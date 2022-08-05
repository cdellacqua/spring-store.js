[@universal-stores/spring](../README.md) / SpringStoreSkipError

# Class: SpringStoreSkipError

A custom error that's raised when the `.skip()` method is invoked on a spring store.
If `.skip()` is called while the store is 'pausing', the promise returned by `.pause()`
will reject with this error.

## Hierarchy

- `Error`

  ↳ **`SpringStoreSkipError`**

## Table of contents

### Constructors

- [constructor](SpringStoreSkipError.md#constructor)

### Properties

- [cause](SpringStoreSkipError.md#cause)
- [message](SpringStoreSkipError.md#message)
- [name](SpringStoreSkipError.md#name)
- [stack](SpringStoreSkipError.md#stack)
- [prepareStackTrace](SpringStoreSkipError.md#preparestacktrace)
- [stackTraceLimit](SpringStoreSkipError.md#stacktracelimit)

### Methods

- [captureStackTrace](SpringStoreSkipError.md#capturestacktrace)

## Constructors

### constructor

• **new SpringStoreSkipError**()

#### Overrides

Error.constructor

#### Defined in

src/lib/spring.ts:32

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
