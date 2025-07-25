import { z } from 'zod';
import { AUTH_STORAGE_KEY } from '../constants';

const baseAuthSchema = z.object({
  proxyUrl: z.string().optional(),
});

export const apiKeyAuthSchema = baseAuthSchema.extend({
  apiKey: z.string().min(10, { message: 'API key must be at least 10 characters' }),
  userId: z.string().min(2, { message: 'User ID must be at least 2 characters' }),
  companyName: z.string().min(2, { message: 'Company name must be at least 2 characters' }),
});

export const jwtAuthSchema = baseAuthSchema.extend({
  signedJwt: z.string().min(10, { message: 'Signed JWT must be at least 10 characters' }),
  partnerId: z.string().min(2, { message: 'Partner ID must be at least 2 characters' }),
});

export const authUnionSchema = z.union([apiKeyAuthSchema, jwtAuthSchema]);

export const AUTH_OPTIONS = {
  API_KEY: 'API_KEY',
  SIGNED_JWT: 'SIGNED_JWT',
};

export const restoreAuth = () => {
  try {
    const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!savedAuth) return null;

    const parsed = JSON.parse(savedAuth);

    const validation = authUnionSchema.safeParse(parsed);
    if (!validation.success) {
      console.error('Invalid authorization data structure:', validation.error);
      return null;
    }

    return parsed;
  } catch (error) {
    console.error('Error restoring authorization data:', error);
    return null;
  }
};

export const preserveAuth = (authData) => {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
  } catch (error) {
    console.error('Error saving authorization data:', error);
  }
};
