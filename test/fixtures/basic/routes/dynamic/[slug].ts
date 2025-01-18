 
export default defineEventHandler((event) => {
    // @ts-expect-error - internal property
    return event.otel.span.name 
})