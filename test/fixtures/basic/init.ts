/*instrumentation.ts*/
import * as opentelemetry from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { UndiciInstrumentation } from '@opentelemetry/instrumentation-undici';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node'
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';

const contextManager = new AsyncLocalStorageContextManager();
// Create and configure NodeTracerProvider
const provider = new NodeTracerProvider();

// Initialize the provider
provider.register({
  contextManager,
});


const sdk = new opentelemetry.NodeSDK({
  traceExporter: new OTLPTraceExporter(),
  instrumentations: [getNodeAutoInstrumentations(), new UndiciInstrumentation()],
});
sdk.start();
