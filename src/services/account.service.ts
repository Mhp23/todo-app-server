import {AccountModel} from '@/models/account.model';
import type {
  AccessableAccountType,
  AccountType,
  CredentialsType,
} from '@/schemas/account.schema';
import {ResponseService} from '@/services/response.service';
import {hashPassword, verifyPassword} from '@/utils/bcrypt';
import {generateAuthTokens, verifyToken} from '@/utils/jwt';
import {logger} from '@/utils/logger';
import {StatusCodes} from 'http-status-codes';

class AccountService {
  async register({username, password}: CredentialsType) {
    try {
      const existingAccount = await AccountModel.findOne({username}).lean();

      if (existingAccount) {
        return ResponseService.failure(
          'Username already exists.',
          StatusCodes.CONFLICT,
        );
      }
      const hashedPassword = await hashPassword(password);

      const newAccount = new AccountModel({
        username,
        password: hashedPassword,
      });

      const {accessToken, refreshToken, refreshTokenExpiration} =
        await generateAuthTokens({
          _id: newAccount._id,
          username: newAccount.username,
        });

      newAccount.refreshToken = refreshToken;
      newAccount.refreshTokenExpiration = refreshTokenExpiration;
      await newAccount.save();

      const {password: _, ...accountData} = newAccount.toObject();
      return ResponseService.success<AccessableAccountType>(
        {
          ...accountData,
          accessToken,
        },
        'Account created successfully.',
        StatusCodes.CREATED,
      );
    } catch (e) {
      logger.error(e);
      return ResponseService.internalError();
    }
  }
  async login({username, password}: CredentialsType) {
    try {
      const account = await AccountModel.findOne({username});

      if (!account || !(await verifyPassword(password, account.password))) {
        return ResponseService.failure(
          'Invalid username or password.',
          StatusCodes.UNAUTHORIZED,
        );
      }
      const {accessToken, refreshToken, refreshTokenExpiration} =
        await generateAuthTokens({
          _id: account._id,
          username: account.username,
        });

      account.refreshToken = refreshToken;
      account.refreshTokenExpiration = refreshTokenExpiration;
      await account.save();

      const {
        password: _,
        refreshTokenExpiration: __,
        ...accountData
      } = account.toObject();

      return ResponseService.success<AccessableAccountType>(
        {...accountData, accessToken},
        'Login successful.',
      );
    } catch (e) {
      logger.error(e);
      return ResponseService.internalError();
    }
  }
  async refreshToken({
    _id,
    refreshToken,
  }: Required<Pick<AccountType, '_id' | 'refreshToken'>>) {
    try {
      const account = await AccountModel.findById(_id);

      if (!account || account.refreshToken !== refreshToken) {
        return ResponseService.failure(
          'Invalid refresh token.',
          StatusCodes.UNAUTHORIZED,
        );
      }
      const verifiedToken = verifyToken(refreshToken, 'refresh');

      if (!verifiedToken) {
        account.refreshToken = undefined;
        account.refreshTokenExpiration = undefined;
        await account.save();

        return ResponseService.failure(
          'Refresh token has expired.',
          StatusCodes.UNAUTHORIZED,
        );
      }
      const {
        accessToken,
        refreshToken: newRefreshToken,
        refreshTokenExpiration,
      } = await generateAuthTokens({
        _id: account._id,
        username: account.username,
      });

      account.refreshToken = newRefreshToken;
      account.refreshTokenExpiration = refreshTokenExpiration;
      await account.save();

      const {
        password: _,
        refreshTokenExpiration: __,
        ...accountData
      } = account.toObject();

      return ResponseService.success<AccessableAccountType>(
        {...accountData, accessToken, refreshToken: newRefreshToken},
        'Access token refreshed successfully.',
      );
    } catch (e) {
      logger.error(e);
      return ResponseService.internalError();
    }
  }
  async logout({_id}: Pick<AccountType, '_id'>) {
    try {
      const account = await AccountModel.findById(_id);

      if (!account) {
        return ResponseService.failure(
          'Account not found.',
          StatusCodes.NOT_FOUND,
        );
      }
      account.refreshToken = undefined;
      account.refreshTokenExpiration = undefined;
      await account.save();

      return ResponseService.OK('Logout successful.');
    } catch (e) {
      logger.error(e);
      return ResponseService.internalError();
    }
  }
}

export const accountService = new AccountService();
