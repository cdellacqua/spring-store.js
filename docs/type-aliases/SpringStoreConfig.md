[**@universal-stores/spring**](../README.md)

***

[@universal-stores/spring](../README.md) / SpringStoreConfig

# Type Alias: SpringStoreConfig

> **SpringStoreConfig** = `object` & `Partial`\<[`SpringConfig`](SpringConfig.md)\>

Defined in: [src/lib/spring.ts:147](https://github.com/cdellacqua/spring-store.js/blob/main/src/lib/spring.ts#L147)

Configuration options for a spring store

## Type Declaration

### dt?

> `optional` **dt?**: `number`

The time, expressed in seconds, between two consecutive simulation steps.
The sampled interval between two animation frames will be divided by dt, therefore making the physics engine
run multiple substeps or skip some steps
to keep the simulation stable on displays with different FPS.

#### Default

```ts
1/300 (~5 simulation steps each frame on a 60Hz display, ~2-3 on a 144Hz display).
```

### maxDt?

> `optional` **maxDt?**: `number`

The maximum allowed interval, expressed in seconds, between two consecutive animation frames.
The sampled interval will be capped to this value, so that the simulation will not accumulate
too many pending steps in cases where the device
is temporary hung or the user changes tab or hides the browser window (therefore pausing the animation frame queue).

#### Default

```ts
1/24 (24Hz)
```

### requestAnimationFrameImplementation?

> `optional` **requestAnimationFrameImplementation?**: [`RAFImplementation`](RAFImplementation.md)

A custom requestAnimationFrame + cancelAnimationFrame implementation.
By default, the store will use requestAnimationFrame and cancelAnimationFrame
if available in the runtime. If these functions are not available, it will
default to using setTimeout and clearTimeout emulating a 60Hz display.
