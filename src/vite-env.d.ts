/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SUPERBASE_URL: string;
    readonly VITE_SUPERBASE_ANON_KEY: string;
    // 다른 VITE_ 변수들
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  