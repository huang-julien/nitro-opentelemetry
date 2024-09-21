import { Span } from "@opentelemetry/api";

declare module 'h3' {
    interface H3EventContext {
        span: Span
    }
}