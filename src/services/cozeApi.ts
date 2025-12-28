/**
 * 扣子工作流 API 服务
 * 用于调用扣子工作流生成相机参数
 */

import Taro from '@tarojs/taro'
import type {CameraParams, LensType, LightingType, SceneType, StyleType, WeatherType} from '@/store/cameraStore'

// 读取环境变量（支持小程序和 H5 环境）
// 在 H5 环境中，Vite 会在编译时替换 import.meta.env.VARIABLE_NAME
// 必须直接访问变量名，不能使用动态 key 访问
const COZE_API_URL = import.meta.env.TARO_APP_COZE_API_URL || process.env.TARO_APP_COZE_API_URL || ''
const COZE_API_TOKEN = import.meta.env.TARO_APP_COZE_API_TOKEN || process.env.TARO_APP_COZE_API_TOKEN || ''

// 扣子 API 响应类型
interface CozeResponse {
  output_text?: string
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
 * 期望返回 JSON 格式的相机参数
 */
const parseCozeResponse = (response: string): CameraParams | null => {
  try {
    // 尝试提取 JSON 部分
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error('❌ 无法从响应中提取 JSON:', response)
      return null
    }

    const jsonStr = jsonMatch[0]
    const params = JSON.parse(jsonStr)

    // 验证必需字段
    if (
      typeof params.iso !== 'number' ||
      typeof params.aperture !== 'string' ||
      typeof params.shutterSpeed !== 'string' ||
      typeof params.whiteBalance !== 'string' ||
      typeof params.sharpness !== 'number' ||
      typeof params.contrast !== 'number' ||
      typeof params.saturation !== 'number' ||
      typeof params.tone !== 'number' ||
      typeof params.suggestion !== 'string'
    ) {
      console.error('❌ 参数格式不正确:', params)
      return null
    }

    return params as CameraParams
  } catch (error) {
    console.error('❌ 解析扣子 API 响应失败:', error, response)
    return null
  }
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
   TARO_APP_COZE_API_URL=https://3mp9d3y2dz.coze.site/run
   TARO_APP_COZE_API_TOKEN=your_token_here
3. 重启开发服务器（必须！）：
   - 停止当前服务器（Ctrl+C）
   - 重新运行：npm run dev:h5
4. 刷新浏览器页面
5. 查看控制台的"环境变量调试信息"

【注意事项】
- H5 环境需要在 config/dev.ts 中配置 envPrefix
- 修改 .env 文件后必须重启服务器才能生效`

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
    console.log('📦 响应数据:', JSON.stringify(response.data, null, 2))
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    // 检查响应状态码
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
      throw new Error(error)
    }

    // 检查响应数据
    const data = response.data as CozeResponse
    if (!data || !data.output_text) {
      const error = '扣子 API 返回数据无效：缺少 output_text 字段'
      console.error('❌ 响应数据无效:', error)
      console.error('❌ 响应内容:', JSON.stringify(data, null, 2))
      throw new Error(error)
    }

    // 解析返回的参数
    const params = parseCozeResponse(data.output_text)
    if (!params) {
      const error = `扣子 API 返回的参数格式无效

【返回内容】
${data.output_text}

【期望格式】
应该返回包含以下字段的 JSON 对象：
- iso (number): ISO 值
- aperture (string): 光圈值，如 "f/2.8"
- shutterSpeed (string): 快门速度，如 "1/125"
- whiteBalance (string): 白平衡，如 "5200K"
- sharpness (number): 锐度，范围 0-7
- contrast (number): 反差，范围 -4 到 4
- saturation (number): 饱和度，范围 -4 到 4
- tone (number): 色调，范围 -4 到 4
- suggestion (string): 操作建议
- flashMode (string, 可选): 闪光灯模式，如 "TTL"
- flashPower (string, 可选): 闪光灯功率，如 "1/16"
- flashAngle (number, 可选): 闪光灯角度`

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
    // 如果是网络错误或其他异常
    if (!error.message.includes('扣子 API')) {
      const networkError = `扣子 API 调用异常

【错误信息】
${error.message}

【可能原因】
- 网络连接失败
- 请求超时（超过 30 秒）
- 服务器无响应

【建议】
1. 检查网络连接
2. 稍后重试
3. 查看控制台完整错误日志`

      console.error('❌ 网络错误:', networkError)
      console.error('❌ 原始错误:', error)
      throw new Error(networkError)
    }

    // 重新抛出已处理的错误
    throw error
  }
}
