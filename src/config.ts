export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  jwtSecret: import.meta.env.VITE_JWT_SECRET || 'fallback-dev-secret',
  env: import.meta.env.VITE_ENV || 'development',
} as const;