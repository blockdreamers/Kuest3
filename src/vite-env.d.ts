/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string;
    readonly VITE_SUPABASE_ANON_KEY: string;
    // 다른 VITE_ 변수들
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  