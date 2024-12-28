import { BaselimeSDK} from "@baselime/node-opentelemetry"
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node"
import { UndiciInstrumentation } from '@opentelemetry/instrumentation-undici';

const sdk = new BaselimeSDK({
  instrumentations: [
    getNodeAutoInstrumentations(),
    new UndiciInstrumentation()
  ],
});

sdk.start();
