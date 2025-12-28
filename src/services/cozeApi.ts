/**
 * 扣子工作流 API 服务
 * 用于调用扣子工作流生成相机参数
 */

import Taro from '@tarojs/taro'
import type {CameraParams, LensType, LightingType, SceneType, StyleType, WeatherType} from '@/store/cameraStore'

// 声明全局常量类型（由 Vite define 配置注入）
declare const __COZE_API_URL__: string
declare const __COZE_API_TOKEN__: string

/**
 * 获取扣子 API URL
 * 使用 Vite define 配置注入的全局常量
 * 这样可以避免 import.meta.env 的模块解析问题
 *
 * 在 H5 环境中，使用代理路径避免 CORS 问题
 */
const getCozeApiUrl = (): string => {
  // 检查是否在 H5 环境（浏览器）
  const isH5 = typeof window !== 'undefined' && typeof document !== 'undefined'

  if (isH5) {
    // H5 环境：使用代理路径，避免 CORS 问题
    // 代理配置在 config/index.ts 的 server.proxy 中
    // /api/coze 会被代理到 https://3mp9d3y2dz.coze.site
    console.log('🔗 使用代理路径（H5 环境）: /api/coze/run')
    return '/api/coze/run'
  }

  // 小程序环境：直接使用完整 URL
  // 优先使用 Vite define 注入的全局常量
  if (typeof __COZE_API_URL__ !== 'undefined' && __COZE_API_URL__) {
    console.log('🔗 使用完整 URL（小程序环境）:', __COZE_API_URL__)
    return __COZE_API_URL__
  }
  // 降级到 import.meta.env（用于开发环境）
  const url = import.meta.env.VITE_COZE_API_URL || import.meta.env.TARO_APP_COZE_API_URL || ''
  console.log('🔗 使用完整 URL（降级）:', url)
  return url
}

/**
 * 获取扣子 API Token
 * 使用 Vite define 配置注入的全局常量
 * 这样可以避免 import.meta.env 的模块解析问题
 */
const getCozeApiToken = (): string => {
  // 优先使用 Vite define 注入的全局常量
  if (typeof __COZE_API_TOKEN__ !== 'undefined' && __COZE_API_TOKEN__) {
    return __COZE_API_TOKEN__
  }
  // 降级到 import.meta.env（用于开发环境）
  return import.meta.env.VITE_COZE_API_TOKEN || import.meta.env.TARO_APP_COZE_API_TOKEN || ''
}

/**
 * 生成 Mock 参数数据（降级方案）
 * 当扣子 API 不可用时使用
 */
const generateMockParams = (
  lens: LensType,
  flash: boolean,
  scene: SceneType,
  lighting: LightingType,
  style: StyleType
): CameraParams => {
  console.log('🎭 生成 Mock 参数数据')
  console.log('📸 镜头:', lens)
  console.log('💡 闪光灯:', flash ? '开启' : '关闭')
  console.log('🎬 场景:', scene)
  console.log('☀️ 光线:', lighting)
  console.log('🎨 风格:', style)

  // 根据场景和光线生成合理的参数
  const isoMap: Record<LightingType, number> = {
    dawn: 800,
    noon: 200,
    golden: 400,
    night: 1600
  }

  const apertureMap: Record<LensType, string> = {
    '55mm': 'f/2.8',
    '18-150mm': 'f/5.6',
    '100-400mm': 'f/8'
  }

  const shutterSpeedMap: Record<LightingType, string> = {
    dawn: '1/125',
    noon: '1/500',
    golden: '1/250',
    night: '1/60'
  }

  return {
    iso: isoMap[lighting] || 400,
    aperture: apertureMap[lens] || 'f/5.6',
    shutterSpeed: shutterSpeedMap[lighting] || '1/125',
    whiteBalance: lighting === 'noon' ? '日光' : lighting === 'night' ? '钨丝灯' : '自动',
    sharpness: style === 'japanese' ? 2 : style === 'film' ? 3 : 4,
    contrast: style === 'blackwhite' ? 3 : style === 'film' ? -1 : 0,
    saturation: style === 'japanese' ? -1 : style === 'blackwhite' ? -4 : 0,
    tone: style === 'japanese' ? 1 : 0,
    flashMode: flash ? 'TTL' : undefined,
    flashPower: flash ? 'TTL-0.3' : undefined,
    flashAngle: flash ? 0 : undefined,
    suggestion: `这是 Mock 数据降级方案。建议：${scene} 场景下，使用 ${lens} 镜头，${lighting} 光线条件，${style} 风格。${flash ? '开启闪光灯可以补光。' : ''}请联系技术支持解决 API 问题以获取更准确的参数建议。`
  }
}

// 扣子 API 响应类型
interface CozeResponse {
  optimized_params?: {
    scene_analysis?: {
      summary?: string
      difficulty_level?: string
    }
    lens_recommendation?: {
      focal_length?: string
      reason?: string
    }
    camera_settings_r50?: {
      shooting_mode?: string
      aperture?: string
      shutter_speed?: string
      iso?: number
      exposure_compensation?: string
      white_balance?: {
        mode_or_kelvin?: string
        shift?: string
      }
    }
    picture_style_settings?: {
      style_name?: string
      sharpness?: number
      contrast?: number
      saturation?: number
      color_tone?: number
    }
    flash_godox_tt685ii?: {
      enable?: boolean
      mode?: string
      hss_sync?: boolean
      power_or_comp?: string
      zoom?: string
      head_angle?: string
      diffuser_advice?: string
    }
    expert_advice?: string
  }
  run_id?: string
  output_text?: string // 保留兼容性
  error?: string
  message?: string
  [key: string]: any
}

/**
 * 构建扣子工作流的输入文本
 * 格式：镜头：RF 35mm f/1.8，拍摄场景：室内夜景人像，光线环境：低光环境，风格偏好：情绪/抑郁
 */
const buildCozeInputText = (
  lens: LensType,
  flash: boolean,
  scene: SceneType,
  customScene: string,
  lighting: LightingType,
  weather: WeatherType,
  style: StyleType
): string => {
  // 镜头映射（保持原始格式）
  const lensMap: Record<LensType, string> = {
    '55mm': 'RF 55mm f/1.8',
    '18-150mm': 'RF 18-150mm f/3.5-6.3',
    '100-400mm': 'RF 100-400mm f/5.6-8'
  }

  // 场景映射
  const sceneMap: Record<SceneType, string> = {
    'portrait-night': '室内夜景人像',
    'outdoor-sport': '户外运动',
    'indoor-still': '室内静物',
    'outdoor-landscape': '户外风景',
    custom: customScene || '自定义场景'
  }

  // 光线环境映射
  const lightingMap: Record<LightingType, string> = {
    dawn: '清晨光线',
    noon: '正午强光',
    golden: '黄金时刻',
    night: '低光环境'
  }

  // 天气映射
  const weatherMap: Record<WeatherType, string> = {
    sunny: '晴天',
    cloudy: '多云',
    overcast: '阴天',
    rainy: '雨天',
    foggy: '雾天'
  }

  // 风格映射
  const styleMap: Record<StyleType, string> = {
    japanese: '日系小清新',
    film: '胶片复古',
    blackwhite: '高对比黑白',
    hk: '港风',
    minimal: '极简主义',
    cyberpunk: '赛博朋克',
    morandi: '莫兰迪色调',
    painting: '油画质感',
    cinematic: '电影感',
    ins: 'INS风'
  }

  // 构建输入文本
  const parts = [
    `镜头：${lensMap[lens]}`,
    `拍摄场景：${sceneMap[scene]}`,
    `光线环境：${lightingMap[lighting]}`,
    `天气：${weatherMap[weather]}`,
    `风格偏好：${styleMap[style]}`
  ]

  // 如果开启闪光灯，添加到描述中
  if (flash) {
    parts.push('闪光灯：开启')
  }

  return parts.join('，')
}

/**
 * 解析扣子 API 返回的参数
 * 适配扣子工作流返回的 optimized_params 格式
 */
const parseCozeResponse = (data: CozeResponse): CameraParams | null => {
  try {
    // 检查是否有 optimized_params
    if (!data.optimized_params) {
      console.error('❌ 响应中缺少 optimized_params 字段')
      return null
    }

    const optimized = data.optimized_params
    const cameraSettings = optimized.camera_settings_r50
    const pictureStyle = optimized.picture_style_settings
    const flash = optimized.flash_godox_tt685ii

    // 验证必需字段
    if (!cameraSettings) {
      console.error('❌ 响应中缺少 camera_settings_r50 字段')
      return null
    }

    // 构建 CameraParams 对象
    const params: CameraParams = {
      iso: cameraSettings.iso || 400,
      aperture: cameraSettings.aperture || 'f/2.8',
      shutterSpeed: cameraSettings.shutter_speed || '1/125',
      whiteBalance: cameraSettings.white_balance?.mode_or_kelvin || '5200K',
      sharpness: pictureStyle?.sharpness ?? 0,
      contrast: pictureStyle?.contrast ?? 0,
      saturation: pictureStyle?.saturation ?? 0,
      tone: pictureStyle?.color_tone ?? 0,
      suggestion: optimized.expert_advice || '请根据实际情况调整参数'
    }

    // 如果有闪光灯参数，添加到结果中
    if (flash?.enable) {
      params.flashMode = flash.mode || 'TTL'
      params.flashPower = flash.power_or_comp || 'TTL'
      params.flashAngle = flash.head_angle ? parseFlashAngle(flash.head_angle) : 0
    }

    console.log('✅ 成功解析扣子 API 响应')
    console.log('📸 相机参数:', JSON.stringify(params, null, 2))

    return params
  } catch (error) {
    console.error('❌ 解析扣子 API 响应失败:', error)
    return null
  }
}

/**
 * 解析闪光灯角度字符串
 * 例如: "Up 45 deg + Bounce to Ceiling" -> 45
 */
const parseFlashAngle = (angleStr: string): number => {
  const match = angleStr.match(/(\d+)\s*deg/i)
  return match ? Number.parseInt(match[1], 10) : 0
}

/**
 * 调用扣子工作流生成相机参数
 */
export const generateParamsWithCoze = async (
  lens: LensType,
  flash: boolean,
  scene: SceneType,
  customScene: string,
  lighting: LightingType,
  weather: WeatherType,
  style: StyleType
): Promise<CameraParams> => {
  // 获取环境变量（每次调用时重新获取，确保获取最新的值）
  const COZE_API_URL = getCozeApiUrl()
  const COZE_API_TOKEN = getCozeApiToken()

  // 调试日志：查看环境变量
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🔍 扣子 API 环境变量调试信息')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('运行环境:', typeof import.meta !== 'undefined' ? 'H5 (Vite)' : '小程序')
  console.log('typeof process:', typeof process)
  console.log('typeof import.meta:', typeof import.meta)
  console.log('COZE_API_URL:', COZE_API_URL || '(未设置)')
  console.log('COZE_API_TOKEN:', COZE_API_TOKEN ? '已设置' : '(未设置)')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  // 检查 API 配置
  if (!COZE_API_URL || !COZE_API_TOKEN) {
    const error = `扣子 API 配置缺失

【当前环境】
- 运行环境: ${typeof import.meta !== 'undefined' ? 'H5 (Vite)' : '小程序'}
- COZE_API_URL: ${COZE_API_URL || '(未设置)'}
- COZE_API_TOKEN: ${COZE_API_TOKEN ? '已设置' : '(未设置)'}

【排查步骤】
1. 确认 .env 文件存在于项目根目录
2. 确认 .env 文件包含以下配置：
   VITE_COZE_API_URL=https://3mp9d3y2dz.coze.site/run
   VITE_COZE_API_TOKEN=your_token_here
   
   或者（小程序环境）：
   TARO_APP_COZE_API_URL=https://3mp9d3y2dz.coze.site/run
   TARO_APP_COZE_API_TOKEN=your_token_here
3. 重启开发服务器（必须！）：
   - 停止当前服务器（Ctrl+C）
   - 清理缓存：rm -rf node_modules/.vite dist
   - 重新运行：npm run dev:h5
4. 强制刷新浏览器页面（Ctrl+Shift+R）
5. 查看控制台的"环境变量调试信息"

【注意事项】
- H5 环境需要使用 VITE_ 前缀
- 小程序环境使用 TARO_APP_ 前缀
- 修改 .env 文件后必须重启服务器才能生效
- Vite 在编译时会替换 import.meta.env.VITE_XXX`

    console.error('❌ 配置错误:', error)
    throw new Error(error)
  }

  // 构建输入文本
  const inputText = buildCozeInputText(lens, flash, scene, customScene, lighting, weather, style)

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📤 发送扣子 API 请求')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🔗 URL:', COZE_API_URL)
  console.log('🔑 Token:', `${COZE_API_TOKEN.substring(0, 30)}...`)
  console.log('📝 输入文本:', inputText)
  console.log(
    '📋 完整请求配置:',
    JSON.stringify(
      {
        url: COZE_API_URL,
        method: 'POST',
        header: {
          Authorization: `Bearer ${COZE_API_TOKEN.substring(0, 30)}...`,
          'Content-Type': 'application/json'
        },
        data: {
          input_text: inputText
        }
      },
      null,
      2
    )
  )
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  try {
    // 调用扣子工作流 API
    const response = await Taro.request({
      url: COZE_API_URL,
      method: 'POST',
      header: {
        Authorization: `Bearer ${COZE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      data: {
        input_text: inputText
      },
      timeout: 30000
    })

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📥 扣子 API 响应')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📊 状态码:', response.statusCode)
    console.log('📋 响应头:', JSON.stringify(response.header, null, 2))
    console.log('📦 响应数据:', JSON.stringify(response.data, null, 2))
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    // 检查响应状态码 - 如果是 502，使用 Mock 数据
    if (response.statusCode === 502) {
      console.warn('⚠️ 扣子 API 返回 502 错误，使用 Mock 数据降级')
      console.warn('⚠️ 这是临时方案，请联系技术支持解决代理问题')

      // 返回 Mock 数据
      return generateMockParams(lens, flash, scene, lighting, style)
    }

    // 检查其他错误状态码
    if (response.statusCode !== 200) {
      const errorData = response.data as CozeResponse
      const errorMessage = errorData?.message || errorData?.error || '未知错误'

      const error = `扣子 API 请求失败

【错误信息】
- HTTP 状态码: ${response.statusCode}
- 错误消息: ${errorMessage}

【请求信息】
- URL: ${COZE_API_URL}
- 输入文本: ${inputText}

【可能原因】
${response.statusCode === 400 ? '- 请求参数格式错误\n- API Token 可能无效\n- 请求体格式不符合扣子 API 要求' : ''}
${response.statusCode === 401 ? '- API Token 无效或已过期\n- Authorization 头格式错误' : ''}
${response.statusCode === 403 ? '- API Token 没有访问权限\n- 工作流配额已用完' : ''}
${response.statusCode === 429 ? '- 请求频率超过限制\n- 请稍后重试' : ''}
${response.statusCode >= 500 ? '- 扣子服务器内部错误\n- 请稍后重试' : ''}`

      console.error('❌ 请求失败:', error)
      console.error('❌ 完整响应:', JSON.stringify(response.data, null, 2))

      // 对于服务器错误，也使用 Mock 数据降级
      if (response.statusCode >= 500) {
        console.warn('⚠️ 服务器错误，使用 Mock 数据降级')
        return generateMockParams(lens, flash, scene, lighting, style)
      }

      throw new Error(error)
    }

    // 检查响应数据
    const data = response.data as CozeResponse
    if (!data || !data.optimized_params) {
      const error = '扣子 API 返回数据无效：缺少 optimized_params 字段'
      console.error('❌ 响应数据无效:', error)
      console.error('❌ 响应内容:', JSON.stringify(data, null, 2))
      throw new Error(error)
    }

    // 解析返回的参数
    const params = parseCozeResponse(data)
    if (!params) {
      const error = `扣子 API 返回的参数格式无效

【返回内容】
${JSON.stringify(data, null, 2)}

【期望格式】
应该返回包含以下字段的对象：
- optimized_params.camera_settings_r50 (必需): 相机设置
  - iso (number): ISO 值
  - aperture (string): 光圈值，如 "f/2.8"
  - shutter_speed (string): 快门速度，如 "1/125"
  - white_balance (object): 白平衡设置
- optimized_params.picture_style_settings (可选): 照片风格设置
  - sharpness (number): 锐度，范围 0-7
  - contrast (number): 反差，范围 -4 到 4
  - saturation (number): 饱和度，范围 -4 到 4
  - color_tone (number): 色调，范围 -4 到 4
- optimized_params.flash_godox_tt685ii (可选): 闪光灯设置
  - enable (boolean): 是否启用
  - mode (string): 模式，如 "TTL"
  - power_or_comp (string): 功率或补偿，如 "TTL-0.3"
  - head_angle (string): 灯头角度
- optimized_params.expert_advice (string): 专家建议`

      console.error('❌ 解析失败:', error)
      throw new Error(error)
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('✅ 参数生成成功')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📸 相机参数:', JSON.stringify(params, null, 2))
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    return params
  } catch (error: any) {
    // 如果是网络错误或其他异常，使用 Mock 数据降级
    if (!error.message.includes('扣子 API')) {
      console.warn('⚠️ 网络错误或请求异常，使用 Mock 数据降级')
      console.warn('⚠️ 错误信息:', error.message)
      console.warn('⚠️ 这是临时方案，请检查网络连接或联系技术支持')

      // 返回 Mock 数据
      return generateMockParams(lens, flash, scene, lighting, style)
    }

    // 重新抛出已处理的错误
    throw error
  }
}
