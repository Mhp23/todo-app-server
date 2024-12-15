import type {
  AccountModelType,
  AccountSchemaType,
} from '@/schemas/account.schema';
import mongoose from 'mongoose';

const AccountSchema = new mongoose.Schema<AccountSchemaType>(
  {
    username: {
      type: String,
      index: true,
      unique: true,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
    refreshTokenExpiration: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

AccountSchema.statics.removeExpiredTokens = async function () {
  const now = new Date();
  await this.updateMany(
    {refreshTokenExpiration: {$lt: now}},
    {$set: {refreshToken: undefined, refreshTokenExpiration: undefined}},
  );
};

export const AccountModel = mongoose.model<AccountSchemaType, AccountModelType>(
  'Account',
  AccountSchema,
);
