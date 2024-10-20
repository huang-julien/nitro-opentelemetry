import type { Span } from "@opentelemetry/api";
import type { H3Event } from "h3"

declare module 'h3' {
    interface H3EventContext {
        span: Span
    }
}

declare module 'nitropack' {
    interface NitroRuntimeHooks {
        'nitro-opentelemetry:span-name': (context: { event: H3Event, name: undefined|string}) => void
    }

    interface NitroOptions {
        openTelemetry?: Partial<{
            /**
             * The path to the initializer file.
             * This file will be imported in the entry file and need to initialize the OpenTelemetry SDK or one of its providers.
             */
            configFilePath: string
        }>
    }
}
