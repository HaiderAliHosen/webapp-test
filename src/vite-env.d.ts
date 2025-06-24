/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_JWT_SECRET: string;
  readonly VITE_ENV: 'development' | 'production' | 'test';
  // Add other environment variables here...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}