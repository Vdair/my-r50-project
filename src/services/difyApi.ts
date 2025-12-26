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

// 构建 AI Prompt
const buildPrompt = (
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

  return `你是一位专业的摄影参数顾问，专门为 Canon R50 相机和 Godox TT685II 闪光灯用户提供参数建议。

拍摄条件：
- 镜头：${lens}
- 闪光灯：${flash ? '开启 Godox TT685II' : '关闭'}
- 场景：${sceneNames[scene]}
- 光线环境：${lightingNames[lighting]}
- 天气情况：${weatherNames[weather]}
- 风格偏好：${styleNames[style]}

请根据以上条件，提供详细的拍摄参数建议。必须严格按照以下 JSON 格式返回，不要添加任何其他文字说明：

{
  "iso": 数字（ISO感光度，如 100, 400, 1600）,
  "aperture": "字符串（光圈值，如 f/1.8, f/4.5）",
  "shutterSpeed": "字符串（快门速度，如 1/125, 1/60）",
  "whiteBalance": "字符串（白平衡，如 AWB, 5200K, 3200K）",
  "sharpness": 数字（锐度，范围 0-7）,
  "contrast": 数字（对比度，范围 -4 到 +4）,
  "saturation": 数字（饱和度，范围 -4 到 +4）,
  "tone": 数字（色调，范围 -4 到 +4）,
  "flashMode": "字符串（闪光灯模式，如 TTL, M，仅在闪光灯开启时提供）",
  "flashPower": "字符串（闪光灯功率，如 1/16, 1/32，仅在闪光灯开启时提供）",
  "flashAngle": 数字（闪光灯角度，如 45, 60，仅在闪光灯开启时提供）,
  "suggestion": "字符串（简短的操作建议，如：请使用 M 档，开启眼部对焦）"
}

注意事项：
1. 必须严格返回 JSON 格式，不要添加任何解释文字
2. 所有数值必须符合相机实际参数范围
3. 根据天气情况调整 ISO（晴天降低，阴雨天提高）
4. 根据风格调整锐度、对比度、饱和度、色调
5. 闪光灯参数仅在闪光灯开启时提供
6. 操作建议要简洁实用，不超过 30 字`
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

// 调用 Dify API 生成参数
export const generateParamsWithAI = async (
  lens: LensType,
  flash: boolean,
  scene: SceneType,
  customScene: string,
  lighting: LightingType,
  weather: WeatherType,
  style: StyleType
): Promise<CameraParams | null> => {
  try {
    // 构建 prompt
    const prompt = buildPrompt(lens, flash, scene, customScene, lighting, weather, style)

    console.log('发送 Dify API 请求...')

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
        query: prompt,
        response_mode: 'blocking', // 使用阻塞模式，更简单
        conversation_id: '',
        user: 'r50-user'
      },
      timeout: 30000 // 30秒超时
    })

    console.log('Dify API 响应:', response)

    if (response.statusCode !== 200) {
      console.error('Dify API 请求失败:', response.statusCode, response.data)
      return null
    }

    const data = response.data as DifyResponse
    if (!data.answer) {
      console.error('Dify API 返回数据无效:', data)
      return null
    }

    // 解析 AI 返回的参数
    const params = parseAIResponse(data.answer)
    if (!params) {
      console.error('解析 AI 参数失败')
      return null
    }

    console.log('AI 生成的参数:', params)
    return params
  } catch (error) {
    console.error('调用 Dify API 失败:', error)
    return null
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
