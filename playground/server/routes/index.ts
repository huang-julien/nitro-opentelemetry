import * as api from "@opentelemetry/api" 
const context = api.context, trace = api.trace
import { defineEventHandlerWithTracing } from "~/utils/handler-with-tracing";


function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

export default defineEventHandlerWithTracing((event) => {
 
  console.log('event', trace.getActiveSpan())

  return fetch('https://jsonplaceholder.typicode.com/todos/1').then(response => response.json());
});
