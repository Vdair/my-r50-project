/**
 * 测试扣子 API - 长超时时间
 */

const https = require('https');

const COZE_API_URL = 'https://3mp9d3y2dz.coze.site/run';
const COZE_API_TOKEN = 'pat_tCvXZJZRdqVJXQNYGLXvJDhxPNfvXFvCxfqBEGPEFKGVlqEXqPqJxDUGqvLvmFZf';

const testData = {
  input_text: JSON.stringify({
    lens: 'RF 55mm f/1.8',
    flash_enabled: true,
    scene: '夜景人像',
    lighting: '黄金时刻',
    weather: '晴天',
    style: '日系小清新'
  })
};

console.log('🧪 测试扣子 API（60秒超时）');
console.log('📍 URL:', COZE_API_URL);
console.log('⏳ 发送请求...\n');

const url = new URL(COZE_API_URL);
const startTime = Date.now();

const options = {
  hostname: url.hostname,
  port: url.port || 443,
  path: url.pathname,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${COZE_API_TOKEN}`
  },
  timeout: 60000 // 60 秒超时
};

const req = https.request(options, (res) => {
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📥 收到响应');
  console.log('✅ 状态码:', res.statusCode);
  console.log('⏱️  响应时间:', duration, '秒');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
    process.stdout.write('.');
  });

  res.on('end', () => {
    console.log('\n\n📦 响应数据（前500字符）:');
    console.log(data.substring(0, 500));
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    if (res.statusCode === 200) {
      console.log('✅ 测试成功！扣子 API 可以直接调用');
      
      // 尝试解析 JSON
      try {
        const json = JSON.parse(data);
        console.log('✅ JSON 解析成功');
        console.log('📋 响应结构:', Object.keys(json));
      } catch (e) {
        console.log('⚠️  JSON 解析失败:', e.message);
      }
    } else {
      console.log('❌ 测试失败！状态码:', res.statusCode);
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  });
});

req.on('error', (error) => {
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('❌ 请求失败');
  console.log('⏱️  失败时间:', duration, '秒');
  console.log('🔴 错误:', error.message);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});

req.on('timeout', () => {
  console.log('\n⏰ 请求超时（60秒）');
  req.destroy();
});

req.write(JSON.stringify(testData));
req.end();

// 显示进度
let dots = 0;
const progressInterval = setInterval(() => {
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
  process.stdout.write(`\r⏳ 等待响应... ${elapsed}秒 `);
  dots = (dots + 1) % 4;
}, 1000);

req.on('close', () => {
  clearInterval(progressInterval);
});
