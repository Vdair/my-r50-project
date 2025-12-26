# Dify API 参数传递格式说明

## 概述
R50 光影私教现在将所有拍摄参数以简洁的文本格式直接传递给 Dify API，让 Dify 的 AI 工作流处理参数生成逻辑。

## 参数文本格式

### 格式模板
```
镜头：{lens}，闪光灯：{flash}，场景：{scene}，光线：{lighting}，天气：{weather}，风格：{style}
```

### 实际示例

#### 示例 1：夜景人像拍摄
```
镜头：55mm，闪光灯：开启，场景：夜景人像，光线：夜晚，天气：晴天，风格：日系小清新
```

#### 示例 2：户外运动抓拍
```
镜头：100-400mm，闪光灯：关闭，场景：户外运动，光线：正午，天气：晴天，风格：高对比黑白
```

#### 示例 3：室内静物摄影
```
镜头：55mm，闪光灯：开启，场景：室内静物，光线：清晨，天气：多云，风格：极简主义
```

#### 示例 4：户外风景拍摄
```
镜头：18-150mm，闪光灯：关闭，场景：户外风景，光线：黄金时刻，天气：晴天，风格：电影感
```

#### 示例 5：自定义场景
```
镜头：55mm，闪光灯：关闭，场景：咖啡厅人像，光线：清晨，天气：阴天，风格：莫兰迪色调
```

#### 示例 6：雨天拍摄
```
镜头：18-150mm，闪光灯：开启，场景：城市夜景，光线：夜晚，天气：雨天，风格：赛博朋克
```

## 参数值映射

### 镜头类型
- `55mm` - 定焦镜头，适合人像
- `18-150mm` - 变焦镜头，适合多场景
- `100-400mm` - 长焦镜头，适合运动和野生动物

### 闪光灯状态
- `开启` - 使用 Godox TT685II 闪光灯
- `关闭` - 不使用闪光灯

### 场景类型
- `夜景人像` - 夜间人像拍摄
- `户外运动` - 运动抓拍
- `室内静物` - 静物摄影
- `户外风景` - 风光摄影
- `{自定义文本}` - 用户自定义场景描述

### 光线环境
- `清晨` - 日出前后，柔和光线
- `正午` - 中午时分，强烈光线
- `黄金时刻` - 日落前后，温暖光线
- `夜晚` - 夜间，光线不足

### 天气情况
- `晴天` - 光线充足
- `多云` - 柔和光线
- `阴天` - 光线不足
- `雨天` - 光线暗，需防水
- `雾天` - 能见度低，需高 ISO

### 风格偏好
- `日系小清新` - 柔和淡雅
- `胶片复古` - 怀旧质感
- `高对比黑白` - 经典永恒
- `港风` - 浓郁色调
- `极简主义` - 简约纯粹
- `赛博朋克` - 未来科技
- `莫兰迪色调` - 高级灰调
- `油画质感` - 艺术氛围
- `电影感` - 故事叙事
- `INS风` - 时尚潮流

## API 调用示例

### 请求格式
```json
{
  "inputs": {},
  "query": "镜头：55mm，闪光灯：开启，场景：夜景人像，光线：夜晚，天气：晴天，风格：日系小清新",
  "response_mode": "blocking",
  "conversation_id": "",
  "user": "r50-user"
}
```

### 完整 curl 示例
```bash
curl -X POST 'https://difyonline.58corp.com/v1/chat-messages' \
  --header 'Authorization: Bearer app-jGTNEtyl3MUvqJexDXmKlfK7' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "inputs": {},
    "query": "镜头：55mm，闪光灯：开启，场景：夜景人像，光线：夜晚，天气：晴天，风格：日系小清新",
    "response_mode": "blocking",
    "conversation_id": "",
    "user": "r50-user"
  }'
```

## 期望的 AI 响应格式

Dify AI 应该返回 JSON 格式的参数建议：

```json
{
  "iso": 400,
  "aperture": "f/1.8",
  "shutterSpeed": "1/60",
  "whiteBalance": "3200K",
  "sharpness": 2,
  "contrast": -1,
  "saturation": -1,
  "tone": 1,
  "flashMode": "TTL",
  "flashPower": "1/16",
  "flashAngle": 45,
  "suggestion": "请使用 M 档，开启眼部对焦"
}
```

## 参数字段说明

### 必需字段（所有场景）
- `iso` - ISO 感光度（数字，如 100, 400, 1600）
- `aperture` - 光圈值（字符串，如 "f/1.8", "f/4.5"）
- `shutterSpeed` - 快门速度（字符串，如 "1/125", "1/60"）
- `whiteBalance` - 白平衡（字符串，如 "AWB", "5200K", "3200K"）
- `sharpness` - 锐度（数字，范围 0-7）
- `contrast` - 对比度（数字，范围 -4 到 +4）
- `saturation` - 饱和度（数字，范围 -4 到 +4）
- `tone` - 色调（数字，范围 -4 到 +4）
- `suggestion` - 操作建议（字符串，简短实用）

### 可选字段（闪光灯开启时）
- `flashMode` - 闪光灯模式（字符串，如 "TTL", "M"）
- `flashPower` - 闪光灯功率（字符串，如 "1/16", "1/32"）
- `flashAngle` - 闪光灯角度（数字，如 45, 60）

## 代码实现

### 参数文本构建
```typescript
const buildParamsText = (
  lens: LensType,
  flash: boolean,
  scene: SceneType,
  customScene: string,
  lighting: LightingType,
  weather: WeatherType,
  style: StyleType
): string => {
  const sceneNames = {
    'portrait-night': '夜景人像',
    'outdoor-sport': '户外运动',
    'indoor-still': '室内静物',
    'outdoor-landscape': '户外风景',
    custom: customScene || '自定义场景'
  }

  const lightingNames = {
    dawn: '清晨',
    noon: '正午',
    golden: '黄金时刻',
    night: '夜晚'
  }

  const weatherNames = {
    sunny: '晴天',
    cloudy: '多云',
    overcast: '阴天',
    rainy: '雨天',
    foggy: '雾天'
  }

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

  return `镜头：${lens}，闪光灯：${flash ? '开启' : '关闭'}，场景：${sceneNames[scene]}，光线：${lightingNames[lighting]}，天气：${weatherNames[weather]}，风格：${styleNames[style]}`
}
```

### API 调用
```typescript
const response = await Taro.request({
  url: `${DIFY_API_URL}/chat-messages`,
  method: 'POST',
  header: {
    Authorization: `Bearer ${DIFY_API_KEY}`,
    'Content-Type': 'application/json'
  },
  data: {
    inputs: {},
    query: paramsText, // 直接传递参数文本
    response_mode: 'blocking',
    conversation_id: '',
    user: 'r50-user'
  },
  timeout: 30000
})
```

## 日志输出示例

### 请求日志
```
发送 Dify API 请求，参数文本: 镜头：55mm，闪光灯：开启，场景：夜景人像，光线：夜晚，天气：晴天，风格：日系小清新
```

### 响应日志
```
Dify API 响应状态: 200
Dify API 响应数据: { event: 'message', message_id: '...', answer: '{"iso":400,...}' }
AI 返回内容: {"iso":400,"aperture":"f/1.8",...}
AI 生成的参数: { iso: 400, aperture: 'f/1.8', ... }
```

### 错误日志
```
Dify API 请求失败，状态码: 500
解析 AI 参数失败，将使用 Mock 数据
```

## 测试场景

### 1. 基础测试
```
镜头：55mm，闪光灯：关闭，场景：夜景人像，光线：夜晚，天气：晴天，风格：日系小清新
```

### 2. 闪光灯测试
```
镜头：55mm，闪光灯：开启，场景：室内静物，光线：清晨，天气：多云，风格：极简主义
```

### 3. 天气影响测试
```
镜头：18-150mm，闪光灯：关闭，场景：户外风景，光线：黄金时刻，天气：雨天，风格：电影感
```

### 4. 自定义场景测试
```
镜头：55mm，闪光灯：关闭，场景：咖啡厅人像，光线：清晨，天气：阴天，风格：莫兰迪色调
```

### 5. 长焦运动测试
```
镜头：100-400mm，闪光灯：关闭，场景：户外运动，光线：正午，天气：晴天，风格：高对比黑白
```

## Dify 工作流配置建议

### 输入节点
- 接收 `query` 字段的参数文本
- 解析各个参数值

### 处理逻辑
1. 根据镜头类型确定基础光圈
2. 根据光线环境确定基础 ISO 和快门
3. 根据天气情况调整 ISO
4. 根据风格偏好调整锐度、对比度、饱和度、色调
5. 如果闪光灯开启，生成闪光灯参数
6. 生成操作建议

### 输出节点
- 返回 JSON 格式的参数对象
- 确保所有必需字段都存在
- 确保数值在合理范围内

## 优势

### 1. 简洁明了
- 参数文本简短易读
- 便于调试和日志查看
- 减少网络传输数据量

### 2. 灵活性高
- Dify 端可以自由调整生成逻辑
- 无需修改前端代码
- 便于 A/B 测试不同策略

### 3. 易于维护
- 前端只负责参数收集和格式化
- AI 逻辑完全在 Dify 端
- 职责分离清晰

### 4. 可扩展性
- 新增参数只需修改文本格式
- Dify 端可以识别新参数
- 向后兼容性好

## 注意事项

1. **参数顺序**：保持固定顺序，便于 Dify 解析
2. **分隔符**：使用中文逗号和冒号，清晰易读
3. **值格式**：使用中文描述，符合用户习惯
4. **自定义场景**：直接使用用户输入的文本
5. **日志记录**：完整记录请求和响应，便于调试

---

✨ 参数传递格式更新完成！
