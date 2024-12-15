import {extendZodWithOpenApi} from '@asteasolutions/zod-to-openapi';
import type {Model} from 'mongoose';
import {z} from 'zod';
import {objectIdSchema} from './global.schema';

extendZodWithOpenApi(z);

export const CredentialsSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters or more')
    .max(30, 'Username must be 30 characters or less'),
  password: z
    .string()
    .min(8, 'Password minimum should be 8 character')
    .max(64, 'Password maximum should be 64 character'),
});

export const AccountSchema = z.object({
  _id: objectIdSchema,
  username: CredentialsSchema.shape.username,
  password: CredentialsSchema.shape.password,
  refreshToken: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const AccessibleAccountSchema = AccountSchema.omit({
  password: true,
}).extend({
  accessToken: z.string(),
});

export type AccountType = z.infer<typeof AccountSchema>;
export type CredentialsType = z.infer<typeof CredentialsSchema>;
export type AccessableAccountType = z.infer<typeof AccessibleAccountSchema>;

export type AccountSchemaType = AccountType & {
  refreshTokenExpiration?: Date;
};
export interface AccountModelType extends Model<AccountSchemaType> {
  removeExpiredTokens: () => Promise<void>;
}
