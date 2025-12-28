/**
 * 扣子 API 测试脚本
 * 用于验证 API 调用是否正常工作
 */

const https = require('https')

// 从环境变量读取配置
const COZE_API_URL = 'https://3mp9d3y2dz.coze.site/run'
const COZE_API_TOKEN = process.env.VITE_COZE_API_TOKEN || process.env.TARO_APP_COZE_API_TOKEN || ''

// 测试输入文本
const testInputText = '镜头：RF 55mm f/1.8，拍摄场景：室内夜景人像，光线环境：黄金时刻，天气：晴天，风格偏好：日系小清新，闪光灯：开启'

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('🧪 扣子 API 测试脚本')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('📋 测试配置:')
console.log('  URL:', COZE_API_URL)
console.log('  Token:', COZE_API_TOKEN ? `${COZE_API_TOKEN.substring(0, 30)}...` : '(未设置)')
console.log('  输入文本:', testInputText)
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

if (!COZE_API_TOKEN) {
  console.error('❌ 错误: COZE_API_TOKEN 未设置')
  console.error('请先设置环境变量:')
  console.error('  export VITE_COZE_API_TOKEN="your_token_here"')
  console.error('或者:')
  console.error('  export TARO_APP_COZE_API_TOKEN="your_token_here"')
  process.exit(1)
}

// 构建请求数据
const postData = JSON.stringify({
  input_text: testInputText
})

// 解析 URL
const url = new URL(COZE_API_URL)

// 配置请求选项
const options = {
  hostname: url.hostname,
  port: url.port || 443,
  path: url.pathname,
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${COZE_API_TOKEN}`,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
}

console.log('\n📤 发送请求...\n')

// 发送请求
const req = https.request(options, (res) => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📥 收到响应')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📊 状态码:', res.statusCode)
  console.log('📋 响应头:', JSON.stringify(res.headers, null, 2))
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  let data = ''

  res.on('data', (chunk) => {
    data += chunk
  })

  res.on('end', () => {
    console.log('\n📦 响应数据:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
    try {
      const jsonData = JSON.parse(data)
      console.log(JSON.stringify(jsonData, null, 2))
      
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      
      if (res.statusCode === 200) {
        if (jsonData.output_text) {
          console.log('✅ API 调用成功！')
          console.log('\n📝 输出文本:')
          console.log(jsonData.output_text)
          
          // 尝试解析 JSON
          try {
            const jsonMatch = jsonData.output_text.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
              const params = JSON.parse(jsonMatch[0])
              console.log('\n📸 解析后的相机参数:')
              console.log(JSON.stringify(params, null, 2))
            }
          } catch (e) {
            console.log('\n⚠️ 无法解析为 JSON，可能需要调整解析逻辑')
          }
        } else {
          console.log('⚠️ 响应中缺少 output_text 字段')
        }
      } else {
        console.log('❌ API 调用失败')
        console.log('错误信息:', jsonData.message || jsonData.error || '未知错误')
      }
    } catch (e) {
      console.log('原始响应（非 JSON）:')
      console.log(data)
      console.log('\n❌ 解析响应失败:', e.message)
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  })
})

req.on('error', (e) => {
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.error('❌ 请求失败')
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.error('错误信息:', e.message)
  console.error('错误详情:', e)
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
})

// 发送请求数据
req.write(postData)
req.end()
