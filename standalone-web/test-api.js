// 测试 standalone-web 应用的 API 调用
const https = require('https');

const COZE_API_URL = 'https://3mp9d3y2dz.coze.site/run';
const COZE_API_TOKEN = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjJhNjZkZTYyLWE0OGQtNGUyMS05MTNkLWM5ZDg1ZTc2NDQ5MiJ9.eyJpc3MiOiJodHRwczovL2FwaS5jb3plLmNuIiwiYXVkIjpbImFJekRHQ1VqUm9tSVUydDNjM29yalVsVGRiN2xtUEM0Il0sImV4cCI6ODIxMDI2Njg3Njc5OSwiaWF0IjoxNzY2ODg5ODM4LCJzdWIiOiJzcGlmZmU6Ly9hcGkuY296ZS5jbi93b3JrbG9hZF9pZGVudGl0eS9pZDo3NTg4NzI3NzMwNTk0NjQzOTc4Iiwic3JjIjoiaW5ib3VuZF9hdXRoX2FjY2Vzc190b2tlbl9pZDo3NTg4NzM0MDczOTE3NDA3MjUxIn0.ROrwlS8sAOaxmBhY9X8xg0ZhUY-VwtPW8DvlsHNBGZaPH6kqZzt6-Ime-1EESMlV-_v_9163EmO1bHs5jWpNffE6_voFdnm2aiGoaqjwyH4AA5JF5GHxFQ79QWpl7ayMrVo32U5O3ZeAOS8mv31GxPuKaMG_VCIDerfH_KooJUDtmzXqKy2Soid_neL4uXUQgG1ApAWzm5BavZ79N44FlC_H9KY9dvb2EHT3qY0aOTADi0V0ZK2a3HoRSkyDFHd6txrxEog4vYlJ10sqGnu2be_NVpm9mlpddwvHvzWYaU2ly4lsc-73_CdtNVw-Tn93-x9y98_aTQ6NNmvt4WXj_A';

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

console.log('🧪 测试 standalone-web 应用的 API 调用');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

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
  timeout: 30000
};

const req = https.request(options, (res) => {
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  
  console.log('✅ 状态码:', res.statusCode);
  console.log('⏱️  响应时间:', duration, '秒');

  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('✅ API 调用成功！');
      console.log('📦 响应数据（前200字符）:', data.substring(0, 200));
    } else {
      console.log('❌ API 调用失败！');
      console.log('📦 响应数据:', data);
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  });
});

req.on('error', (error) => {
  console.log('❌ 请求失败:', error.message);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});

req.on('timeout', () => {
  console.log('⏰ 请求超时（30秒）');
  req.destroy();
});

req.write(JSON.stringify(testData));
req.end();
