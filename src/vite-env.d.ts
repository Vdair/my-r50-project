/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Dify API 配置（已移除）
  // readonly TARO_APP_DIFY_API_URL: string
  // readonly TARO_APP_DIFY_API_KEY: string

  // 扣子工作流 API 配置（TARO_APP_ 前缀用于小程序）
  readonly TARO_APP_COZE_API_URL: string
  readonly TARO_APP_COZE_API_TOKEN: string

  // 扣子工作流 API 配置（VITE_ 前缀用于 H5）
  readonly VITE_COZE_API_URL: string
  readonly VITE_COZE_API_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
