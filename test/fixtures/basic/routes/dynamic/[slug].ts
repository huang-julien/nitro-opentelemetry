 
export default defineEventHandler((event) => {
    return event.otel.span.name 
})