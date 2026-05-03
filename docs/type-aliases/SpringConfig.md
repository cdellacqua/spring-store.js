[**@universal-stores/spring**](../README.md)

***

[@universal-stores/spring](../README.md) / SpringConfig

# Type Alias: SpringConfig

> **SpringConfig** = `object`

Defined in: [src/lib/spring.ts:123](https://github.com/cdellacqua/spring-store.js/blob/main/src/lib/spring.ts#L123)

Configuration options for the spring

## Properties

### damping

> **damping**: `number`

Defined in: [src/lib/spring.ts:137](https://github.com/cdellacqua/spring-store.js/blob/main/src/lib/spring.ts#L137)

The damping is used to compute how much friction needs to be applied to slow down the spring.
The friction is computed as `friction = velocity * damping`.

#### Default

```ts
30
```

***

### precision

> **precision**: `number`

Defined in: [src/lib/spring.ts:144](https://github.com/cdellacqua/spring-store.js/blob/main/src/lib/spring.ts#L144)

A threshold used to determine if the simulation can stop.
This threshold is applied to both the velocity and the value of the spring. If no value in both
objects is greater than the precision, the simulation stops and the spring value is set to the
current target.

***

### stiffness

> **stiffness**: `number`

Defined in: [src/lib/spring.ts:130](https://github.com/cdellacqua/spring-store.js/blob/main/src/lib/spring.ts#L130)

The stiffness is used to compute the elastic force as per Hooke's law:
`elastic_force = displacement * stiffness`.

#### Default

```ts
300
```
