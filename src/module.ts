import type { Nitro } from 'nitropack'
import type { Plugin } from "rollup"
import { presets } from './imports'
import { resolvePath } from 'mlly'
import MagicString from 'magic-string'
import { getPresetFile, isPresetEntry } from './presets'
import { normalize } from "pathe"
import type { Nuxt } from "@nuxt/schema"
import defu from 'defu'
import type { Node } from "estree-walker"
import { resolveNitroPath } from 'nitropack/kit'
import { resolveModulePath} from "exsolve"

type WithLocation<T = Node> = T & { start: number, end: number }

async function module(nitro: Nitro) {
    nitro.options.alias['#nitro-opentelemetry/init'] = await getPresetFile(nitro)

    if (isPresetEntry(nitro)) {
        nitro.options.alias['#nitro-entry-file'] = nitro.options.entry
        nitro.options.entry = await getPresetFile(nitro)
    }

    if (nitro.options.otel?.preset !== false) {
        nitro.hooks.hook('rollup:before', (nitro, rollupConfig) => {
            if (!rollupConfig.plugins) rollupConfig.plugins = [];
            const plugins = rollupConfig.plugins
            if (Array.isArray(plugins)) {
                rollupConfig.plugins = plugins.filter((plugin) => {
                    if (plugin && 'name' in plugin) {
                        // workaround for while waiting for configurable impound settings in nuxt
                        return plugin.name !== 'impound'
                    }
                    return true
                });
            }

            (rollupConfig.plugins as Plugin[]).push({
                name: 'inject-init-plugin',
                async transform(code, id) {
                    const normalizedId = normalize(id)
                    // transform nitro entry file but there's probably a better way
                    if (normalizedId.includes('runtime/entries') || this.getModuleInfo(id)?.isEntry) {
                        const s = new MagicString(code)
                        s.prepend(`import '#nitro-opentelemetry/init';`)

                        return {
                            code: s.toString(),
                            map: s.generateMap({ hires: true }),
                            moduleSideEffects: true
                        }
                    }
                    //  @todo find another way to mark it as side effect :/
                    if (normalizedId === nitro.options.alias['#nitro-opentelemetry/init']) {
                        const s = new MagicString(code)
                        return {
                            moduleSideEffects: true,
                            code: s.toString(),
                            map: s.generateMap({ hires: true }),
                        }
                    }
                },
            })
        })

        nitro.options.virtual['#nitro-otel-options'] = nitro.options.otel?.preset && typeof nitro.options.otel.preset === 'object' && 'options' in nitro.options.otel.preset ? `export default ${JSON.stringify(nitro.options.otel.preset.options || {})}` : `export default {}`;
    }

    if (nitro.options.imports) {
        nitro.options.imports.presets.push(presets)
    }

    if (nitro.options.renderer) {
        nitro.options.alias['#nitro-renderer'] = nitro.options.renderer
        nitro.options.renderer = await resolvePath('nitro-opentelemetry/runtime/renderer/renderer', {
            extensions: ['.mjs', '.ts']
        })
        nitro.options.externals = defu(nitro.options.externals, {
            inline: [nitro.options.renderer]
        })
    }

    if (nitro.options.errorHandler) {
        // nitro < 2.10
        if (typeof nitro.options.errorHandler === 'string') {
            nitro.options.alias['#nitro-error-handler'] = nitro.options.errorHandler
            nitro.options.errorHandler = await resolvePath('nitro-opentelemetry/runtime/renderer/error', {
                extensions: ['.mjs', '.ts']
            })

            nitro.options.externals = defu(nitro.options.externals, {
                inline: [nitro.options.errorHandler]
            })
        } else if (Array.isArray(nitro.options.errorHandler)) {
            // nitro >= 2.10
            nitro.hooks.hook('rollup:before',async  (nitro, rollupConfig) => {
                const errorHandlers = await Promise.all((nitro.options.errorHandler as string[]).map((path) => {
                     return resolveModulePath(resolveNitroPath(path, nitro.options), {
                        from: [
                            import.meta.url,
                            ...nitro.options.nodeModulesDirs,
                            nitro.options.rootDir
                        ],
                        extensions: ['.mjs', '.ts', '.js', '.cjs']
                     })
                }))
                ;(rollupConfig.plugins as Plugin[]).push({
                    name: 'nitro-otel:inject-error-handlers',
                    async transform(code, id) {
                        if(id.includes('prod')) {
                            console.log(id, errorHandlers.includes(normalize(id)), errorHandlers)

                        }
                        if (errorHandlers.includes(normalize(id))) {
                            const s = new MagicString(code)
                            s.prepend(`import { context } from "@opentelemetry/api";\n`)
                            const defaultExport = this.parse(code).body.find(node => node.type === 'ExportDefaultDeclaration')

                            if (defaultExport) {
                                s.overwrite((defaultExport.declaration as WithLocation).start as number, (defaultExport.declaration as WithLocation).end,
                                    `(...args) => context.with(args?.[1]?.otel?.ctx, ${code.slice((defaultExport.declaration as WithLocation).start, (defaultExport.declaration as WithLocation).end)}, undefined, ...args)`)

                                return {
                                    code: s.toString(),
                                    map: s.generateMap({ hires: true }),
                                }
                            }
                        }
                    }
                })
            })
        }
    }

    // inline utils because it uses #imports
    nitro.options.externals = defu(nitro.options.externals, {
        inline: [
            await resolvePath('nitro-opentelemetry/runtime/utils', {
                extensions: ['.mjs', '.ts']
            })
        ]
    })

    nitro.options.typescript.tsConfig = defu(nitro.options.typescript.tsConfig, {
        compilerOptions: {
            types: ['nitro-opentelemetry']
        }
    })
    nitro.options.plugins.push(await resolvePath('nitro-opentelemetry/runtime/plugin', {
        extensions: ['.mjs', '.ts']
    }))

    // explicitly mark this as undefined for rollup to stop logging warnings about it
    nitro.hooks.hook('rollup:before', (_, rollupConfig) => {
        const ogModuleCtx = rollupConfig.moduleContext
        rollupConfig.moduleContext = (_id) => {
            const id = normalize(_id)
            if (id.includes('node_modules/@opentelemetry/api')) {
                return '(undefined)'
            }
            return typeof ogModuleCtx === 'object' ? ogModuleCtx[id] : ogModuleCtx?.(id)
        }
    })
}

// Dual compatibility with Nuxt and Nitro Modules
export default async function moduleWithCompat(arg1: unknown, arg2: unknown) {
    if ((arg2 as Nuxt)?.options?.nitro) {
        (arg2 as Nuxt).hooks.hookOnce("nitro:config", (nitroConfig) => {
            nitroConfig.modules = nitroConfig.modules || [];
            nitroConfig.modules.push(module);
        });
    } else {
        await module(arg1 as Nitro);
    }
}