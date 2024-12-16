# Changelog


## v0.2.0

[compare changes](https://github.com/huang-julien/open-telemetry-nitro/compare/v0.1.1...v0.2.0)

### 🚀 Enhancements

- **presets:** Add baselime-node ([71576e5](https://github.com/huang-julien/open-telemetry-nitro/commit/71576e5))
- **preset:** Add baselime cf worker ([1f3cedf](https://github.com/huang-julien/open-telemetry-nitro/commit/1f3cedf))
- Export all types ([0ccac1b](https://github.com/huang-julien/open-telemetry-nitro/commit/0ccac1b))
- **baselime-cf-worker:** Add options ([eb7bc58](https://github.com/huang-julien/open-telemetry-nitro/commit/eb7bc58))

### 🩹 Fixes

- Add http method ([#1](https://github.com/huang-julien/open-telemetry-nitro/pull/1))
- **playground:** Fix util ([c94a1da](https://github.com/huang-julien/open-telemetry-nitro/commit/c94a1da))
- **baselime-cf-worker:** Cleanup baselime-cf-worker ([5d41ca4](https://github.com/huang-julien/open-telemetry-nitro/commit/5d41ca4))
- Add missing preset string ([43c497b](https://github.com/huang-julien/open-telemetry-nitro/commit/43c497b))

### 💅 Refactors

- Use pathe instead of path ([3a79087](https://github.com/huang-julien/open-telemetry-nitro/commit/3a79087))
- ⚠️  Rename config keyto OTEL ([41afbf7](https://github.com/huang-julien/open-telemetry-nitro/commit/41afbf7))
- Prefer otel instead of OTEL ([6d33fd5](https://github.com/huang-julien/open-telemetry-nitro/commit/6d33fd5))
- ⚠️  Change configFile to preset with interface to allow configurable presets ([55b0e13](https://github.com/huang-julien/open-telemetry-nitro/commit/55b0e13))
- Move types in types.ts ([779771a](https://github.com/huang-julien/open-telemetry-nitro/commit/779771a))

### 🏡 Chore

- Rename traced event handler ([0346b85](https://github.com/huang-julien/open-telemetry-nitro/commit/0346b85))
- Add ts-ignore ([236a3ca](https://github.com/huang-julien/open-telemetry-nitro/commit/236a3ca))
- Update README ([971bbcc](https://github.com/huang-julien/open-telemetry-nitro/commit/971bbcc))
- Update comments ([bd22ffb](https://github.com/huang-julien/open-telemetry-nitro/commit/bd22ffb))

#### ⚠️ Breaking Changes

- ⚠️  Rename config keyto OTEL ([41afbf7](https://github.com/huang-julien/open-telemetry-nitro/commit/41afbf7))
- ⚠️  Change configFile to preset with interface to allow configurable presets ([55b0e13](https://github.com/huang-julien/open-telemetry-nitro/commit/55b0e13))

### ❤️ Contributors

- Julien Huang ([@huang-julien](http://github.com/huang-julien))

## v0.1.1

[compare changes](https://github.com/huang-julien/nitro-opentelemetry/compare/v0.1.0...v0.1.1)

### 🩹 Fixes

- **azure-monitor:** Remove default instrumentation key ([8a02633](https://github.com/huang-julien/nitro-opentelemetry/commit/8a02633))

### ❤️ Contributors

- Julien Huang <julien.huang@leetchi.com>

## v0.1.0


### 🚀 Enhancements

- Move to module ([5826dd2](https://github.com/huang-julien/open-telemetry-nitro/commit/5826dd2))
- Configurable preset file ([35b0bb7](https://github.com/huang-julien/open-telemetry-nitro/commit/35b0bb7))
- Add azure-monitor ([514bc41](https://github.com/huang-julien/open-telemetry-nitro/commit/514bc41))
- Record exception ([b3b2694](https://github.com/huang-julien/open-telemetry-nitro/commit/b3b2694))

### 🩹 Fixes

- Cleanup + types ([c8fb92e](https://github.com/huang-julien/open-telemetry-nitro/commit/c8fb92e))
- Fix build and move into package ([497d180](https://github.com/huang-julien/open-telemetry-nitro/commit/497d180))
- Preset resolve ([07ff9da](https://github.com/huang-julien/open-telemetry-nitro/commit/07ff9da))
- Try use alias ([5a01cd3](https://github.com/huang-julien/open-telemetry-nitro/commit/5a01cd3))
- Workaround with `await import` ([fd331f4](https://github.com/huang-julien/open-telemetry-nitro/commit/fd331f4))
- Move again to import with moduleSideEffect ([c633012](https://github.com/huang-julien/open-telemetry-nitro/commit/c633012))
- Add missing plugin ([2e7d7c4](https://github.com/huang-julien/open-telemetry-nitro/commit/2e7d7c4))
- File path s ([58bfa14](https://github.com/huang-julien/open-telemetry-nitro/commit/58bfa14))
- Correctly mark config file as side-effect ([a9319ab](https://github.com/huang-julien/open-telemetry-nitro/commit/a9319ab))

### 💅 Refactors

- Use normalize id ([52d1c07](https://github.com/huang-julien/open-telemetry-nitro/commit/52d1c07))
- Remove new Date() ([010c88c](https://github.com/huang-julien/open-telemetry-nitro/commit/010c88c))
- Rename span name hook ([cd0b233](https://github.com/huang-julien/open-telemetry-nitro/commit/cd0b233))

### 🏡 Chore

- Install packages ([b4263d8](https://github.com/huang-julien/open-telemetry-nitro/commit/b4263d8))
- Change package name ([b978a40](https://github.com/huang-julien/open-telemetry-nitro/commit/b978a40))
- Split what the plugin should do ([941f1b8](https://github.com/huang-julien/open-telemetry-nitro/commit/941f1b8))
- Remove process.on ([8a3839e](https://github.com/huang-julien/open-telemetry-nitro/commit/8a3839e))
- Update packages ([e655031](https://github.com/huang-julien/open-telemetry-nitro/commit/e655031))
- Lint ([9a9deb2](https://github.com/huang-julien/open-telemetry-nitro/commit/9a9deb2))
- Add types in playground and remove console log in node preset ([6730040](https://github.com/huang-julien/open-telemetry-nitro/commit/6730040))
- Add consola to deps ([a3abe51](https://github.com/huang-julien/open-telemetry-nitro/commit/a3abe51))
- Update readme ([647ec64](https://github.com/huang-julien/open-telemetry-nitro/commit/647ec64))
- Update readme ([a3a551f](https://github.com/huang-julien/open-telemetry-nitro/commit/a3a551f))
- Add config and hooks ([1190d86](https://github.com/huang-julien/open-telemetry-nitro/commit/1190d86))

### ❤️ Contributors

- Julien Huang ([@huang-julien](http://github.com/huang-julien))

