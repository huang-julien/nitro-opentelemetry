# nitro-opentelemetry

<!-- automd:badges color=yellow -->

[![npm version](https://img.shields.io/npm/v/nitro-opentelemetry?color=yellow)](https://npmjs.com/package/nitro-opentelemetry)
[![npm downloads](https://img.shields.io/npm/dm/nitro-opentelemetry?color=yellow)](https://npmjs.com/package/nitro-opentelemetry)

<!-- /automd -->

ℹ️ Opentelemetry integration is going to be built-in in a future version of nitro. This module does not reflect the future API of the official integration of nitro OTEL.

Opentelemetry integration for nitro. Without patching nitro.

This nitro module automatically create spans for request and error happening in your nitro server.

## Usage

Install package:

<!-- automd:pm-install -->

```sh
# ✨ Auto-detect
npx nypm install nitro-opentelemetry

# npm
npm install nitro-opentelemetry

# yarn
yarn add nitro-opentelemetry

# pnpm
pnpm install nitro-opentelemetry

# bun
bun install nitro-opentelemetry
```

<!-- /automd -->

Add the module:

```ts
//https://nitro.unjs.io/config
export default defineNitroConfig({
  modules: [
    'nitro-opentelemetry'
  ]
});
```

This module is also compatible with Nuxt

```ts
export default defineNuxtConfig({
  modules: [
    'nitro-opentelemetry'
  ]
})
```

<!-- /automd -->

## Build-time

### Config

You can configure the module with the `otel` property in your `nitro.config.ts`

- **preset**:
  - Option to configure the preset that will be used with OTEL

### Presets

`nitro-opentelemetry` provides a list of presets. Theses presets are files that initialize the SDK for OTEL (for example the NodeSDK).
You can provide your own by setting:

```ts
{
  name: 'custom',
  filePath: 'path_to_your_file'
}
```

on the preset option in the otel config.

## Runtime

### Span

A span is created for each event. 

It is attached to the `event` object with the `span` property. The context associated to the span is also available within `H3Event`

````ts
interface H3Event {
    otel: {
      span: Span
      ctx: Context
    }
}
````

You can manipulate this span until it ends. The span will be ended in `afterResponse` (nitro hook) with the endTime set in `beforeReponse` (nitro hook).
In case of an error, if there is an event associated to the error, the span will record the exception and end. If not, nitro-opentelemetry will create a span from the ROOT_CONTEXT and end it.

### Hooks

Here are the available hooks.

```ts
interface NitroRuntimeHooks {
    'otel:span:name': (context: { event: H3Event, name: undefined|string }) => void
    'otel:span:end': (context: { event: H3Event, span: Span }) => void
}
```

- **otel:span:name**
    - Called when a span is created.

- **otel:span:end**
    - Called before ending a `Span`. This can happen in the `afterResponse` hook or in the `error` hook.

### Utils

`defineTracedEventHandler`
- Wrap your event handler with the span assigned to your event. This avoid loosing the context for opentelemetry.
  The main renderer and error renderer doesn't need to be wrapped with `defineTracedEventHandler`

## Development

<details>

<summary>local development</summary>

- Clone this repository
- Install latest LTS version of [Node.js](https://nodejs.org/en/)
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable`
- Install dependencies using `pnpm install`
- Run interactive tests using `pnpm dev`

</details>

## License

<!-- automd:contributors license=MIT github=nitro-opentelemetry author=huang-julien -->

Published under the [MIT](https://github.com/nitro-opentelemetry/blob/main/LICENSE) license.
Made by [@huang-julien](https://github.com/huang-julien) and [community](https://github.com/nitro-opentelemetry/graphs/contributors) 💛
<br><br>
<a href="https://github.com/nitro-opentelemetry/graphs/contributors">
<img src="https://contrib.rocks/image?repo=nitro-opentelemetry" />
</a>

<!-- /automd -->

<!-- automd:with-automd -->

---

_🤖 auto updated with [automd](https://automd.unjs.io)_

<!-- /automd -->
