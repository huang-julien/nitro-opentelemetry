import type { Context } from "@opentelemetry/api";
import type { Span } from "@opentelemetry/sdk-trace-base";
import type { H3Event } from "h3"
import { Presets } from "./types";

declare module 'h3' {
    interface H3Event {
        otel: {
            span: Span
            /**
             * @internal
             */
            __endTime: number|undefined
            ctx: Context
        }
    }
}

declare module 'nitropack' {
    interface NitroRuntimeHooks {
        'otel:span:name': (context: { event: H3Event, name: undefined|string}) => void
        'otel:span:end': (context: { event: H3Event, span: Span }) => void
    }

    interface NitroOptions {
        otel?: Partial<{
            /**
             * The path to the initializer file.
             * This file will be imported in the entry file and need to initialize the OpenTelemetry SDK or one of its providers.
             * Fallback to the default initializer file for the selected preset.
             * If set to `false`, no initializer file will be imported.
             */
            preset: Presets | false
        }>
    }
}
