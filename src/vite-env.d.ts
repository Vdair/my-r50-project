/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly TARO_APP_DIFY_API_URL: string
  readonly TARO_APP_DIFY_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
