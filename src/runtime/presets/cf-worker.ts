import { instrument } from '@microlabs/otel-cf-workers'
// @ts-ignore - nitro entry alias
import handler from "#nitro-entry-file"
// @ts-ignore virtual
import options from "#nitro-otel-options"

export interface Env {
	BASELIME_API_KEY: string
    SERVICE_NAME: string
}

export default instrument(handler, options)