# nitro-opentelemetry

<!-- automd:badges color=yellow -->

[![npm version](https://img.shields.io/npm/v/nitro-opentelemetry?color=yellow)](https://npmjs.com/package/nitro-opentelemetry)
[![npm downloads](https://img.shields.io/npm/dm/nitro-opentelemetry?color=yellow)](https://npmjs.com/package/nitro-opentelemetry)

<!-- /automd -->

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

<!-- /automd -->

## Config

You can configure the module with the `otel` property in your `nitro.config.ts`

- **preset**:
  - Option to configure the preset that will be used with OTEL

## Hooks

Here are the available hooks.

```ts
interface NitroRuntimeHooks {
    'otel:span:name': (context: { event: H3Event, name: undefined|string }) => void
}
```

- **otel:span:name**
    - Ran when a span is created.

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

<!-- automd:contributors license=MIT -->

Published under the [MIT](https://github.com/unjs/nitro-opentelemetry/blob/main/LICENSE) license.
Made by [community](https://github.com/unjs/nitro-opentelemetry/graphs/contributors) 💛
<br><br>
<a href="https://github.com/unjs/nitro-opentelemetry/graphs/contributors">
<img src="https://contrib.rocks/image?repo=unjs/nitro-opentelemetry" />
</a>

<!-- /automd -->

<!-- automd:with-automd -->

---

_🤖 auto updated with [automd](https://automd.unjs.io)_

<!-- /automd -->
