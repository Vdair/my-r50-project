/**
 * 测试脚本：直接请求扣子 API
 * 用于验证 API 是否可用，以及正确的请求格式
 */

const https = require('https')

// 从环境变量读取配置
require('dotenv').config()

const COZE_API_URL = process.env.VITE_COZE_API_URL || process.env.TARO_APP_COZE_API_URL
const COZE_API_TOKEN = process.env.VITE_COZE_API_TOKEN || process.env.TARO_APP_COZE_API_TOKEN

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('🧪 测试扣子 API')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('📍 URL:', COZE_API_URL)
console.log('🔑 Token:', COZE_API_TOKEN ? `${COZE_API_TOKEN.substring(0, 30)}...` : '未设置')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

if (!COZE_API_URL || !COZE_API_TOKEN) {
  console.error('❌ 错误：未设置 COZE_API_URL 或 COZE_API_TOKEN')
  process.exit(1)
}

// 解析 URL
const url = new URL(COZE_API_URL)

// 请求体
const requestBody = JSON.stringify({
  input_text: '镜头：RF 55mm f/1.8，闪光灯：关闭，场景：室内夜景人像，光线：黄金时刻，天气：晴天，风格：日系小清新'
})

// 请求选项
const options = {
  hostname: url.hostname,
  port: url.port || 443,
  path: url.pathname,
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${COZE_API_TOKEN}`,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(requestBody),
    'Accept': 'application/json'
  }
}

console.log('\n📤 发送请求')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('🌐 主机:', options.hostname)
console.log('🔌 端口:', options.port)
console.log('📍 路径:', options.path)
console.log('📋 请求头:', JSON.stringify(options.headers, null, 2))
console.log('📦 请求体:', requestBody)
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

const startTime = Date.now()

const req = https.request(options, (res) => {
  const duration = Date.now() - startTime
  
  console.log('\n📥 收到响应')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📊 状态码:', res.statusCode)
  console.log('📋 响应头:', JSON.stringify(res.headers, null, 2))
  console.log('⏱️  响应时间:', duration, 'ms')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  let data = ''

  res.on('data', (chunk) => {
    data += chunk
  })

  res.on('end', () => {
    console.log('\n📦 响应数据')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
    try {
      const jsonData = JSON.parse(data)
      console.log(JSON.stringify(jsonData, null, 2))
      
      if (res.statusCode === 200) {
        console.log('\n✅ 测试成功！')
      } else {
        console.log('\n❌ 测试失败：状态码', res.statusCode)
      }
    } catch (error) {
      console.log('原始数据:', data)
      console.log('\n❌ 解析 JSON 失败:', error.message)
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  })
})

req.on('error', (error) => {
  const duration = Date.now() - startTime
  
  console.log('\n❌ 请求失败')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('⏱️  失败时间:', duration, 'ms')
  console.log('❌ 错误信息:', error.message)
  console.log('❌ 错误代码:', error.code)
  console.log('❌ 错误堆栈:', error.stack)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
})

req.on('timeout', () => {
  console.log('\n⏱️  请求超时')
  req.destroy()
})

// 设置超时时间（30 秒）
req.setTimeout(30000)

// 发送请求体
req.write(requestBody)
req.end()
