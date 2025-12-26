import Taro from '@tarojs/taro'
import type {CameraParams, LensType, LightingType, SceneType, StyleType, WeatherType} from '@/store/cameraStore'

// Dify API 配置
const DIFY_API_URL = process.env.TARO_APP_DIFY_API_URL || ''
const DIFY_API_KEY = process.env.TARO_APP_DIFY_API_KEY || ''

// Dify API 响应类型
interface DifyResponse {
  event: string
  message_id: string
  conversation_id: string
  answer: string
  created_at: number
}

// 构建参数文本（简洁格式，直接传递给 Dify）
const buildParamsText = (
  lens: LensType,
  flash: boolean,
  scene: SceneType,
  customScene: string,
  lighting: LightingType,
  weather: WeatherType,
  style: StyleType
): string => {
  // 场景名称映射
  const sceneNames = {
    'portrait-night': '夜景人像',
    'outdoor-sport': '户外运动',
    'indoor-still': '室内静物',
    'outdoor-landscape': '户外风景',
    custom: customScene || '自定义场景'
  }

  // 光线名称映射
  const lightingNames = {
    dawn: '清晨',
    noon: '正午',
    golden: '黄金时刻',
    night: '夜晚'
  }

  // 天气名称映射
  const weatherNames = {
    sunny: '晴天',
    cloudy: '多云',
    overcast: '阴天',
    rainy: '雨天',
    foggy: '雾天'
  }

  // 风格名称映射
  const styleNames = {
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

  // 构建简洁的参数文本
  return `镜头：${lens}，闪光灯：${flash ? '开启' : '关闭'}，场景：${sceneNames[scene]}，光线：${lightingNames[lighting]}，天气：${weatherNames[weather]}，风格：${styleNames[style]}`
}

// 解析 AI 返回的参数
const parseAIResponse = (response: string): CameraParams | null => {
  try {
    // 尝试提取 JSON 部分
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error('无法从响应中提取 JSON:', response)
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
      console.error('参数格式不正确:', params)
      return null
    }

    return params as CameraParams
  } catch (error) {
    console.error('解析 AI 响应失败:', error, response)
    return null
  }
}

// 调用 Dify API 生成参数（不降级，直接抛出错误）
export const generateParamsWithAI = async (
  lens: LensType,
  flash: boolean,
  scene: SceneType,
  customScene: string,
  lighting: LightingType,
  weather: WeatherType,
  style: StyleType
): Promise<CameraParams> => {
  // 检查 API 配置
  if (!DIFY_API_URL || !DIFY_API_KEY) {
    const error = 'Dify API 配置缺失：请检查 .env 文件中的 TARO_APP_DIFY_API_URL 和 TARO_APP_DIFY_API_KEY'
    console.error('❌ 配置错误:', error)
    throw new Error(error)
  }

  // 构建参数文本
  const paramsText = buildParamsText(lens, flash, scene, customScene, lighting, weather, style)

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📤 发送 Dify API 请求')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🔗 URL:', `${DIFY_API_URL}/chat-messages`)
  console.log('🔑 API Key:', `${DIFY_API_KEY.substring(0, 20)}...`)
  console.log('📝 参数文本:', paramsText)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  try {
    // 调用 Dify API（使用 blocking 模式）
    const response = await Taro.request({
      url: `${DIFY_API_URL}/chat-messages`,
      method: 'POST',
      header: {
        Authorization: `Bearer ${DIFY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      data: {
        inputs: {},
        query: paramsText,
        response_mode: 'blocking',
        conversation_id: '',
        user: 'r50-user'
      },
      timeout: 30000
    })

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📥 Dify API 响应')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📊 状态码:', response.statusCode)
    console.log('📦 响应数据:', JSON.stringify(response.data, null, 2))
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    // 检查响应状态码
    if (response.statusCode !== 200) {
      const error = `Dify API 请求失败，HTTP 状态码: ${response.statusCode}`
      console.error('❌ 请求失败:', error)
      console.error('❌ 响应内容:', response.data)
      throw new Error(error)
    }

    // 检查响应数据
    const data = response.data as DifyResponse
    if (!data || !data.answer) {
      const error = 'Dify API 返回数据无效：缺少 answer 字段'
      console.error('❌ 数据无效:', error)
      console.error('❌ 实际返回:', data)
      throw new Error(error)
    }

    console.log('✅ AI 返回内容:', data.answer)

    // 解析 AI 返回的参数
    const params = parseAIResponse(data.answer)
    if (!params) {
      const error = 'AI 返回的 JSON 格式无效或参数不完整'
      console.error('❌ 解析失败:', error)
      console.error('❌ 原始内容:', data.answer)
      throw new Error(error)
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('✅ AI 参数生成成功')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📸 生成的参数:', JSON.stringify(params, null, 2))
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    return params
  } catch (error: any) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.error('❌ Dify API 调用异常')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.error('❌ 错误类型:', error.constructor.name)
    console.error('❌ 错误信息:', error.message)
    console.error('❌ 错误详情:', error)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    // 重新抛出错误，让上层处理
    throw error
  }
}

// Mock 参数生成（作为降级方案）
export const generateMockParams = (
  lens: LensType,
  flash: boolean,
  scene: SceneType,
  lighting: LightingType,
  weather: WeatherType,
  style: StyleType
): CameraParams => {
  // 基础参数根据光线环境调整
  let iso = 100
  let aperture = 'f/2.8'
  let shutterSpeed = '1/125'

  // 根据光线环境调整
  switch (lighting) {
    case 'dawn':
      iso = 400
      shutterSpeed = '1/60'
      break
    case 'noon':
      iso = 100
      shutterSpeed = '1/250'
      break
    case 'golden':
      iso = 200
      shutterSpeed = '1/125'
      break
    case 'night':
      iso = flash ? 400 : 1600
      shutterSpeed = flash ? '1/60' : '1/30'
      break
  }

  // 根据镜头调整光圈
  switch (lens) {
    case '55mm':
      aperture = 'f/1.8'
      break
    case '18-150mm':
      aperture = 'f/4.5'
      break
    case '100-400mm':
      aperture = 'f/5.6'
      break
  }

  // 根据风格调整参数
  let sharpness = 4
  let contrast = 0
  let saturation = 0
  let tone = 0

  switch (style) {
    case 'japanese':
      sharpness = 2
      contrast = -1
      saturation = -1
      tone = 1
      break
    case 'film':
      sharpness = 3
      contrast = 1
      saturation = -2
      tone = 0
      break
    case 'blackwhite':
      sharpness = 5
      contrast = 2
      saturation = -4
      tone = 0
      break
    case 'hk':
      sharpness = 4
      contrast = 2
      saturation = 1
      tone = -1
      break
    case 'minimal':
      sharpness = 3
      contrast = -2
      saturation = -3
      tone = 0
      break
    case 'cyberpunk':
      sharpness = 5
      contrast = 3
      saturation = 2
      tone = 0
      break
    case 'morandi':
      sharpness = 2
      contrast = -1
      saturation = -2
      tone = 1
      break
    case 'painting':
      sharpness = 1
      contrast = 1
      saturation = 1
      tone = 1
      break
    case 'cinematic':
      sharpness = 3
      contrast = 2
      saturation = 0
      tone = -1
      break
    case 'ins':
      sharpness = 4
      contrast = 1
      saturation = 1
      tone = 1
      break
  }

  // 根据天气调整参数
  switch (weather) {
    case 'sunny':
      iso = Math.max(100, iso - 100)
      break
    case 'cloudy':
      iso = Math.round(iso * 1.2)
      break
    case 'overcast':
      iso = Math.round(iso * 1.5)
      break
    case 'rainy':
      iso = Math.round(iso * 2)
      break
    case 'foggy':
      iso = Math.round(iso * 1.8)
      contrast = Math.max(-4, contrast - 1)
      break
  }

  // 白平衡
  let whiteBalance = 'AWB'
  if (lighting === 'golden') whiteBalance = '5200K'
  if (lighting === 'night') whiteBalance = '3200K'
  if (weather === 'cloudy' || weather === 'overcast') whiteBalance = '6000K'

  // 操作建议
  let suggestion = '请使用 M 档，开启眼部对焦'
  if (scene === 'outdoor-sport') suggestion = '建议使用 Tv 档，开启伺服对焦'
  if (scene === 'indoor-still') suggestion = '建议使用 Av 档，使用三脚架稳定'
  if (scene === 'outdoor-landscape') suggestion = '建议使用 Av 档，使用小光圈增加景深'
  if (weather === 'rainy') suggestion += '，注意相机防水保护'
  if (weather === 'foggy') suggestion += '，建议增加曝光补偿'

  const result: CameraParams = {
    iso,
    aperture,
    shutterSpeed,
    whiteBalance,
    sharpness,
    contrast,
    saturation,
    tone,
    suggestion
  }

  // 闪光灯参数
  if (flash) {
    result.flashMode = 'TTL'
    result.flashPower = '1/16'
    result.flashAngle = 45
  }

  return result
}
