import type { Span } from "@opentelemetry/api";
import type { H3Event } from "h3"

declare module 'h3' {
    interface H3EventContext {
        span: Span
    }
}

type presets = 'node' | 'node-cluster' | 'nitro-dev' | 'node-server' | 'azure-monitor' | 'baselime-node' | 'baselime-cf-worker'

declare module 'nitropack' {
    interface NitroRuntimeHooks {
        'otel:span:name': (context: { event: H3Event, name: undefined|string}) => void
    }

    interface NitroOptions {
        otel?: Partial<{
            /**
             * The path to the initializer file.
             * This file will be imported in the entry file and need to initialize the OpenTelemetry SDK or one of its providers.
             * Fallback to the default initializer file for the selected preset.
             * If set to `false`, no initializer file will be imported.
             */
            configFile: presets | string | false
        }>
    }
}
