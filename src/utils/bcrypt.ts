import {env} from '@/core/envConfig';
import bcrypt from 'bcrypt';
/**
 * Hashes a password using bcrypt.
 * @param password - The plaintext password to hash.
 * @returns The hashed password as a string.
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(env.SALT_ROUNDS);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error('Error hashing password');
  }
}
/**
 * Verifies a password against a hashed password.
 * @param password - The plaintext password to verify.
 * @param hashedPassword - The hashed password to compare against.
 * @returns True if the password matches, false otherwise.
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    throw new Error('Error verify password');
  }
}
