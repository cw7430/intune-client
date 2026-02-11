export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly APP_ENV: 'local' | 'development' | 'production';
      readonly API_URL: string;
      readonly NEXT_PUBLIC_CHAT_BFF_URL: string;
    }
  }
}
