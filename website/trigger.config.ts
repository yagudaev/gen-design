import type {
  ResolveEnvironmentVariablesFunction,
  TriggerConfig,
} from '@trigger.dev/sdk/v3'

export const config: TriggerConfig = {
  project: 'proj_ammczmaurxsglkmfzobt',
  logLevel: 'log',
  maxDuration: 60_000,
  retries: {
    enabledInDev: true,
    default: {
      maxAttempts: 3,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      factor: 2,
      randomize: true,
    },
  },
  // using the default path
  additionalFiles: ['./prisma/schema.prisma'],
  additionalPackages: ['prisma@5.14.0'],
  dependenciesToBundle: process.env.TRIGGER_ENV !== 'development' ? [/.*/] : [],
}
