/*instrumentation.ts*/
import * as opentelemetry from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { UndiciInstrumentation } from '@opentelemetry/instrumentation-undici';
 
const sdk = new opentelemetry.NodeSDK({
  traceExporter: new OTLPTraceExporter(), 
  instrumentations: [getNodeAutoInstrumentations(), new UndiciInstrumentation()],
});
sdk.start();
