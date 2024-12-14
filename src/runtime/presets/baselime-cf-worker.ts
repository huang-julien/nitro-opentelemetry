import { instrument, ResolveConfigFn } from '@microlabs/otel-cf-workers'
import handler from "#nitro-entry-file"

export interface Env {
	BASELIME_API_KEY: string
    SERVICE_NAME: string
}

const config: ResolveConfigFn = (env: Env, _trigger) => {
	return {
		exporter: {
			url: 'https://otel.baselime.io/v1',
			headers: { 'x-api-key': env.BASELIME_API_KEY, 'x-service': env.SERVICE_NAME },
		},
		service: { name: env.SERVICE_NAME },
	}
}

export default instrument(handler, config)