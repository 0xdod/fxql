import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z
    .enum(['production', 'staging', 'development', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(8000),
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number().default(5432),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_DATABASE: z.string(),
  DB_MIGRATIONS_RUN: z.coerce.boolean().default(false),
  DB_SYNCRONIZE: z.coerce.boolean().default(false),
});

export type Env = z.infer<typeof EnvSchema>;

export function parseConfig(config: Record<string, unknown>) {
  return EnvSchema.parse(config);
}
