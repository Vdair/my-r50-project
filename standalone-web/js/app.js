// R50 光影私教 - 主应用逻辑

// 配置
const CONFIG = {
  // 扣子 API 配置
  COZE_API_URL: 'https://3mp9d3y2dz.coze.site/run',
  COZE_API_TOKEN: 'pat_tCvXZJZRdqVJXQNYGLXvJDhxPNfvXFvCxfqBEGPEFKGVlqEXqPqJxDUGqvLvmFZf',
  
  // CORS 代理（如果需要）
  USE_CORS_PROXY: false,
  CORS_PROXY_URL: 'https://cors-anywhere.herokuapp.com/',
  
  // 本地存储键名
  STORAGE_KEY: 'r50_history'
}

// 场景映射
const SCENE_MAP = {
  'portrait': '人像',
  'landscape': '风景',
  'night_portrait': '夜景人像',
  'indoor': '室内静物',
  'sports': '运动抓拍',
  'food': '美食'
}

// 光线映射
const LIGHTING_MAP = {
  'dawn': '清晨',
  'noon': '正午',
  'golden': '黄金时刻',
  'night': '夜晚'
}

// 天气映射
const WEATHER_MAP = {
  'sunny': '晴天',
  'cloudy': '多云',
  'overcast': '阴天',
  'rainy': '雨天',
  'foggy': '雾天'
}

// 风格映射
const STYLE_MAP = {
  'japanese': '日系小清新',
  'film': '胶片复古',
  'blackwhite': '高对比黑白',
  'hk': '港风怀旧'
}

// 应用状态
const state = {
  lens: '55mm',
  flash: false,
  scene: 'portrait',
  customScene: '',
  lighting: 'golden',
  weather: 'sunny',
  style: 'japanese'
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 R50 光影私教 - 应用启动')
  initializeUI()
  attachEventListeners()
})

// 初始化 UI
function initializeUI() {
  // 设置默认选中状态
  document.querySelector('[data-lens="55mm"]')?.classList.add('active')
  document.querySelector('[data-scene="portrait"]')?.classList.add('active')
  document.querySelector('[data-lighting="golden"]')?.classList.add('active')
  document.querySelector('[data-weather="sunny"]')?.classList.add('active')
  document.querySelector('[data-style="japanese"]')?.classList.add('active')
}

// 绑定事件监听器
function attachEventListeners() {
  // 镜头选择
  document.querySelectorAll('.lens-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.lens-btn').forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      state.lens = btn.dataset.lens
      console.log('选择镜头:', state.lens)
    })
  })

  // 闪光灯开关
  const flashToggle = document.getElementById('flashToggle')
  flashToggle?.addEventListener('change', (e) => {
    state.flash = e.target.checked
    console.log('闪光灯:', state.flash ? '开启' : '关闭')
  })

  // 场景选择
  document.querySelectorAll('.scene-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.scene-btn').forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      state.scene = btn.dataset.scene
      console.log('选择场景:', state.scene)
    })
  })

  // 自定义场景
  const customScene = document.getElementById('customScene')
  customScene?.addEventListener('input', (e) => {
    state.customScene = e.target.value
    console.log('自定义场景:', state.customScene)
  })

  // 光线环境
  document.querySelectorAll('.lighting-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.lighting-btn').forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      state.lighting = btn.dataset.lighting
      console.log('选择光线:', state.lighting)
    })
  })

  // 天气情况
  document.querySelectorAll('.weather-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.weather-btn').forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      state.weather = btn.dataset.weather
      console.log('选择天气:', state.weather)
    })
  })

  // 风格偏好
  document.querySelectorAll('.style-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.style-btn').forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      state.style = btn.dataset.style
      console.log('选择风格:', state.style)
    })
  })

  // 生成按钮
  const generateBtn = document.getElementById('generateBtn')
  generateBtn?.addEventListener('click', handleGenerate)
}

// 处理生成参数
async function handleGenerate() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🎬 开始生成参数')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('当前状态:', state)

  // 显示加载状态
  showLoading(true)
  
  try {
    // 调用扣子 API
    const result = await callCozeAPI()
    
    // 保存到历史记录
    saveToHistory(result)
    
    // 跳转到结果页面
    localStorage.setItem('current_result', JSON.stringify(result))
    window.location.href = 'result.html'
    
  } catch (error) {
    console.error('❌ 生成参数失败:', error)
    showLoading(false)
    alert('生成参数失败：' + error.message + '\n\n请检查网络连接或稍后重试。')
  }
}

// 调用扣子 API
async function callCozeAPI() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📤 调用扣子 API')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  // 构建输入文本
  const inputText = buildInputText()
  console.log('📝 输入文本:', inputText)

  // 构建请求 URL
  const apiUrl = CONFIG.USE_CORS_PROXY 
    ? CONFIG.CORS_PROXY_URL + CONFIG.COZE_API_URL 
    : CONFIG.COZE_API_URL

  console.log('🔗 API URL:', apiUrl)
  console.log('🔑 Token:', CONFIG.COZE_API_TOKEN.substring(0, 30) + '...')

  // 发送请求
  const startTime = Date.now()
  
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CONFIG.COZE_API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      input_text: inputText
    })
  })

  const endTime = Date.now()
  const duration = ((endTime - startTime) / 1000).toFixed(1)

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📥 API 响应')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📊 状态码:', response.status)
  console.log('⏱️ 响应时间:', duration + '秒')

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  const data = await response.json()
  console.log('📦 响应数据:', data)

  // 解析响应
  const result = parseCozeResponse(data)
  console.log('✅ 解析结果:', result)

  return result
}

// 构建输入文本
function buildInputText() {
  const parts = []
  
  // 镜头
  parts.push(`镜头: ${state.lens}`)
  
  // 闪光灯
  parts.push(`闪光灯: ${state.flash ? '开启' : '关闭'}`)
  
  // 场景
  const sceneText = state.customScene || SCENE_MAP[state.scene] || state.scene
  parts.push(`场景: ${sceneText}`)
  
  // 光线
  parts.push(`光线: ${LIGHTING_MAP[state.lighting] || state.lighting}`)
  
  // 天气
  parts.push(`天气: ${WEATHER_MAP[state.weather] || state.weather}`)
  
  // 风格
  parts.push(`风格: ${STYLE_MAP[state.style] || state.style}`)
  
  return parts.join(', ')
}

// 解析扣子 API 响应
function parseCozeResponse(data) {
  try {
    // 提取输出文本
    let outputText = ''
    
    if (data.data) {
      outputText = data.data
    } else if (data.output) {
      outputText = data.output
    } else if (typeof data === 'string') {
      outputText = data
    } else {
      throw new Error('无法从响应中提取输出文本')
    }

    console.log('📄 输出文本:', outputText)

    // 尝试解析 JSON
    let jsonData
    try {
      // 如果输出文本包含 JSON，提取它
      const jsonMatch = outputText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        jsonData = JSON.parse(jsonMatch[0])
      } else {
        jsonData = JSON.parse(outputText)
      }
    } catch (e) {
      console.warn('⚠️ 无法解析 JSON，使用默认值')
      jsonData = {}
    }

    // 构建结果对象
    const result = {
      // 场景分析
      sceneAnalysis: jsonData.scene_analysis || {
        summary: '场景分析数据不可用',
        difficultyLevel: '中等'
      },
      
      // 镜头推荐
      lensRecommendation: jsonData.lens_recommendation || {
        focalLength: state.lens,
        reason: '根据您的选择'
      },
      
      // 相机设置
      shootingMode: jsonData.shooting_mode || 'Av',
      iso: jsonData.iso || 400,
      aperture: jsonData.aperture || 'f/2.8',
      shutterSpeed: jsonData.shutter_speed || '1/125',
      exposureCompensation: jsonData.exposure_compensation || '0',
      whiteBalance: jsonData.white_balance?.mode || '自动',
      whiteBalanceShift: jsonData.white_balance?.shift || '0',
      
      // 照片风格
      styleName: jsonData.style_name || STYLE_MAP[state.style],
      sharpness: jsonData.sharpness || 4,
      contrast: jsonData.contrast || 0,
      saturation: jsonData.saturation || 0,
      tone: jsonData.tone || 0,
      
      // 闪光灯设置
      flashEnable: state.flash,
      flashMode: jsonData.flash_godox_tt685ii?.mode || 'TTL',
      flashHssSync: jsonData.flash_godox_tt685ii?.hss_sync || false,
      flashPower: jsonData.flash_godox_tt685ii?.power || '1/16',
      flashZoom: jsonData.flash_godox_tt685ii?.zoom || '50mm',
      flashAngle: jsonData.flash_godox_tt685ii?.angle || '45°',
      flashDiffuserAdvice: jsonData.flash_godox_tt685ii?.diffuser_advice || '建议使用柔光罩',
      
      // 专家建议
      suggestion: jsonData.suggestion || '根据场景调整参数以获得最佳效果',
      
      // 元数据
      timestamp: Date.now(),
      input: state
    }

    return result
    
  } catch (error) {
    console.error('❌ 解析响应失败:', error)
    throw new Error('解析 API 响应失败: ' + error.message)
  }
}

// 保存到历史记录
function saveToHistory(result) {
  try {
    const history = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY) || '[]')
    
    // 添加到历史记录（最新的在前面）
    history.unshift({
      id: Date.now(),
      ...result
    })
    
    // 只保留最近 50 条记录
    if (history.length > 50) {
      history.splice(50)
    }
    
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(history))
    console.log('✅ 已保存到历史记录')
    
  } catch (error) {
    console.error('❌ 保存历史记录失败:', error)
  }
}

// 显示/隐藏加载状态
function showLoading(show) {
  const overlay = document.getElementById('loadingOverlay')
  const btn = document.getElementById('generateBtn')
  const btnText = document.getElementById('btnText')
  
  if (show) {
    overlay?.classList.remove('hidden')
    btn?.setAttribute('disabled', 'true')
    if (btnText) btnText.textContent = '生成中...'
  } else {
    overlay?.classList.add('hidden')
    btn?.removeAttribute('disabled')
    if (btnText) btnText.textContent = '生成最佳参数'
  }
}
