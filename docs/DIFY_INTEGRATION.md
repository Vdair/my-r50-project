# Dify AI 集成文档

## 概述
R50 光影私教已成功集成 Dify AI，实现真实的 AI 参数生成功能，替代原有的 Mock 数据。

## 集成架构

### 1. 配置管理
**文件**: `.env`

```env
# Dify AI 配置
TARO_APP_DIFY_API_URL=https://difyonline.58corp.com/v1
TARO_APP_DIFY_API_KEY=app-jGTNEtyl3MUvqJexDXmKlfK7
```

### 2. API 客户端
**文件**: `src/services/difyApi.ts`

#### 核心功能
- ✅ Dify API 调用封装
- ✅ Prompt 构建
- ✅ 响应解析
- ✅ Mock 数据降级方案

#### API 调用流程
```
用户输入参数
    ↓
构建详细 Prompt
    ↓
调用 Dify API (blocking 模式)
    ↓
解析 JSON 响应
    ↓
返回 CameraParams
```

### 3. 状态管理
**文件**: `src/store/cameraStore.ts`

#### generateParams 方法
```typescript
generateParams: async () => {
  // 1. 尝试使用 Dify AI
  const aiParams = await generateParamsWithAI(...)
  
  if (aiParams) {
    // AI 生成成功
    return aiParams
  }
  
  // 2. 降级到 Mock 数据
  const mockParams = generateMockParams(...)
  return mockParams
}
```

## Prompt 设计

### 输入参数
- 镜头类型（55mm / 18-150mm / 100-400mm）
- 闪光灯状态（开启/关闭）
- 场景描述（夜景人像/户外运动/室内静物/户外风景/自定义）
- 光线环境（清晨/正午/黄金时刻/夜晚）
- 天气情况（晴天/多云/阴天/雨天/雾天）
- 风格偏好（10种风格）

### Prompt 结构
```
你是一位专业的摄影参数顾问，专门为 Canon R50 相机和 Godox TT685II 闪光灯用户提供参数建议。

拍摄条件：
- 镜头：[lens]
- 闪光灯：[flash]
- 场景：[scene]
- 光线环境：[lighting]
- 天气情况：[weather]
- 风格偏好：[style]

请根据以上条件，提供详细的拍摄参数建议。必须严格按照以下 JSON 格式返回...
```

### 期望输出格式
```json
{
  "iso": 400,
  "aperture": "f/1.8",
  "shutterSpeed": "1/125",
  "whiteBalance": "5200K",
  "sharpness": 4,
  "contrast": 1,
  "saturation": 0,
  "tone": 0,
  "flashMode": "TTL",
  "flashPower": "1/16",
  "flashAngle": 45,
  "suggestion": "请使用 M 档，开启眼部对焦"
}
```

## API 调用详情

### 请求配置
```typescript
{
  url: 'https://difyonline.58corp.com/v1/chat-messages',
  method: 'POST',
  header: {
    Authorization: 'Bearer app-jGTNEtyl3MUvqJexDXmKlfK7',
    'Content-Type': 'application/json'
  },
  data: {
    inputs: {},
    query: prompt,
    response_mode: 'blocking',  // 阻塞模式，等待完整响应
    conversation_id: '',
    user: 'r50-user'
  },
  timeout: 30000  // 30秒超时
}
```

### 响应处理
1. **成功响应**：解析 `answer` 字段中的 JSON
2. **失败响应**：使用 Mock 数据降级
3. **超时处理**：30秒超时后使用 Mock 数据

## 降级策略

### 三层保障
1. **第一层**：Dify AI 生成（优先）
2. **第二层**：API 失败时使用 Mock 数据
3. **第三层**：异常捕获后使用 Mock 数据

### Mock 数据特点
- 基于规则的参数计算
- 考虑光线、天气、风格因素
- 保证基本可用性

## 响应解析

### JSON 提取
```typescript
// 从 AI 响应中提取 JSON
const jsonMatch = response.match(/\{[\s\S]*\}/)
const params = JSON.parse(jsonMatch[0])
```

### 参数验证
- 验证所有必需字段存在
- 验证字段类型正确
- 验证数值范围合理

## 错误处理

### 常见错误场景
1. **网络错误**：请求超时或连接失败
2. **API 错误**：返回非 200 状态码
3. **解析错误**：响应格式不正确
4. **验证错误**：参数值不合法

### 错误处理流程
```
API 调用
    ↓
[失败] → 记录错误日志
    ↓
使用 Mock 数据
    ↓
返回参数
```

## 性能优化

### 1. 请求优化
- 使用 blocking 模式，避免流式处理复杂性
- 设置合理的超时时间（30秒）
- 单次请求获取完整参数

### 2. 响应优化
- 快速 JSON 解析
- 最小化数据处理
- 缓存不需要

### 3. 用户体验
- 显示加载动画
- 提供实时反馈
- 降级方案无感知

## 使用示例

### 基本调用
```typescript
import { useCameraStore } from '@/store/cameraStore'

const { generateParams } = useCameraStore()

// 生成参数
await generateParams()
```

### 完整流程
```typescript
// 1. 设置输入参数
setLens('55mm')
setFlash(true)
setScene('portrait-night')
setLighting('golden')
setWeather('sunny')
setStyle('japanese')

// 2. 生成参数
await generateParams()

// 3. 获取结果
const { params } = useCameraStore()
console.log(params)
```

## 调试指南

### 1. 查看日志
```typescript
// API 调用日志
console.log('发送 Dify API 请求...')
console.log('Dify API 响应:', response)

// 参数生成日志
console.log('尝试使用 Dify AI 生成参数...')
console.log('AI 参数生成成功')
console.log('AI 生成失败，使用 Mock 数据')
```

### 2. 测试 API
```bash
# 使用 curl 测试
curl -X POST 'https://difyonline.58corp.com/v1/chat-messages' \
  --header 'Authorization: Bearer app-jGTNEtyl3MUvqJexDXmKlfK7' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "inputs": {},
    "query": "测试查询",
    "response_mode": "blocking",
    "conversation_id": "",
    "user": "test-user"
  }'
```

### 3. 验证响应
- 检查 `statusCode` 是否为 200
- 检查 `data.answer` 是否存在
- 检查 JSON 格式是否正确
- 检查参数值是否合理

## 安全考虑

### 1. API 密钥保护
- 存储在 `.env` 文件
- 不提交到版本控制
- 使用环境变量访问

### 2. 请求限制
- 设置超时时间
- 避免频繁请求
- 实现降级方案

### 3. 数据验证
- 验证输入参数
- 验证输出参数
- 防止注入攻击

## 监控与维护

### 关键指标
- API 调用成功率
- 平均响应时间
- 降级使用频率
- 参数准确性

### 日志记录
- 记录所有 API 调用
- 记录失败原因
- 记录降级事件

### 优化建议
1. 监控 API 响应时间
2. 优化 Prompt 提高准确性
3. 调整超时时间
4. 改进错误处理

## 未来改进

### 1. 流式响应
- 实现 streaming 模式
- 实时显示生成进度
- 提升用户体验

### 2. 缓存机制
- 缓存常用参数组合
- 减少 API 调用
- 提高响应速度

### 3. 智能降级
- 根据网络状况选择策略
- 优先使用本地缓存
- 后台同步 AI 结果

### 4. 参数优化
- 收集用户反馈
- 优化 Prompt
- 提高准确性

## 文件清单

### 核心文件
- `.env` - API 配置
- `src/services/difyApi.ts` - API 客户端
- `src/store/cameraStore.ts` - 状态管理

### 相关文件
- `src/pages/consultant/index.tsx` - 参数输入页面
- `src/pages/result/index.tsx` - 结果展示页面

## 总结

Dify AI 集成为 R50 光影私教带来了真实的 AI 能力：

1. **智能参数生成**：基于真实 AI 模型，提供专业建议
2. **可靠降级方案**：API 失败时自动使用 Mock 数据
3. **完善错误处理**：多层保障确保功能可用
4. **良好用户体验**：无感知降级，始终可用

---

✨ Dify AI 集成完成！
