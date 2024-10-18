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
}
 