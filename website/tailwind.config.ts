import type { Config } from 'tailwindcss'
import sharedConfig from '@workspace/shared/tailwind.config'

const config = {
  ...sharedConfig,
} satisfies Config

export default config
