export const AUTH_CONSTANTS = {
  BCRYPT_SALT_ROUNDS: 12,
  ACCESS_TOKEN_EXPIRY: '15m',
  REFRESH_TOKEN_EXPIRY: '7d',
  REFRESH_TOKEN_COOKIE_MAX_AGE: 7 * 24 * 60 * 60 * 1000, // 7 days
  COOKIE_NAME: 'refresh_token',
} as const;

export const AUTH_ERRORS = {
  USER_EXISTS: 'User already exists',
  USER_NOT_FOUND: 'Invalid email',
  INVALID_PASSWORD: 'Invalid password',
  REFRESH_TOKEN_NOT_FOUND: 'Refresh token not found',
  INVALID_REFRESH_TOKEN: 'Invalid refresh token',
} as const;

export const AUTH_MESSAGES = {
  LOGOUT_SUCCESS: 'Successfully logged out',
  REFRESH_TOKEN_RESET_SUCCESS: 'Successfully reset the refresh token',
} as const;
