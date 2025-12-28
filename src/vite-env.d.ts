/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Dify API 配置（已移除）
  // readonly TARO_APP_DIFY_API_URL: string
  // readonly TARO_APP_DIFY_API_KEY: string

  // 扣子工作流 API 配置
  readonly TARO_APP_COZE_API_URL: string
  readonly TARO_APP_COZE_API_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
