import * as api from "@opentelemetry/api" 
const context = api.context, trace = api.trace

function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

export default defineEventHandlerWithTracing((event) => {
 
  console.log("active span", trace.getActiveSpan());
  console.log("ctrx", context.active());
  const currentSpan = trace.getSpan(context.active());
  console.log("current span", currentSpan);

  return fetch('https://jsonplaceholder.typicode.com/todos/1').then(response => response.json());
});
