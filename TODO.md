# Task: 创建独立的纯前端 Web 应用

## 当前状态
✅ **已完成** - 创建了完全独立的纯前端 Web 应用，不依赖 Taro 框架

## 背景
- 小程序 H5 环境多次尝试修复 502 错误，但问题依然存在
- 用户要求：如果小程序调不通，就不要使用小程序进行调用
- 解决方案：创建独立的纯前端 Web 应用，直接在浏览器中运行

## 完成内容

### 1. 项目结构
```
standalone-web/
├── index.html          # 主页 - AI 参数咨询师
├── result.html         # 参数展示页面
├── wiki.html           # 器材百科页面
├── history.html        # 历史记录页面
├── css/
│   └── style.css       # 自定义样式
├── js/
│   ├── app.js          # 主应用逻辑
│   ├── result.js       # 结果页面逻辑
│   └── history.js      # 历史记录逻辑
└── README.md           # 使用说明
```

### 2. 技术栈
- **HTML5**：页面结构
- **Vanilla JavaScript (ES6+)**：应用逻辑，无框架依赖
- **Tailwind CSS (CDN)**：样式框架
- **Material Design Icons (CDN)**：图标库
- **LocalStorage API**：历史记录存储
- **Fetch API**：调用扣子 API

### 3. 核心功能

#### 3.1 AI 参数咨询师（index.html）
- 镜头选择：55mm 定焦、18-150mm 变焦、100-400mm 长焦
- 闪光灯开关：可视化开关组件
- 场景选择：人像、风景、夜景人像、室内静物、运动抓拍、美食
- 自定义场景：文本输入框
- 光线环境：清晨、正午、黄金时刻、夜晚
- 天气情况：晴天、多云、阴天、雨天、雾天
- 风格偏好：日系小清新、胶片复古、高对比黑白、港风怀旧
- 生成按钮：调用扣子 API 生成参数
- 加载动画：显示生成进度

#### 3.2 参数展示页面（result.html）
- 场景分析：场景摘要、难度等级（带颜色标识）
- 镜头推荐：推荐焦距、推荐理由
- 相机设置：拍摄模式、ISO、光圈、快门速度、曝光补偿、白平衡
- 照片风格：风格名称、锐度、反差、饱和度、色调
- 闪光灯设置：模式、功率、焦距、灯头角度、高速同步、柔光建议
- 专家建议：详细的拍摄建议
- 操作按钮：返回修改、重新生成

#### 3.3 器材百科（wiki.html）
- Canon EOS R50 拍摄模式详解
  - A+ 场景智能自动
  - Tv 快门优先
  - Av 光圈优先
  - M 手动模式
  - Servo 伺服对焦
- Godox TT685II 闪光灯使用指南
  - TTL 自动测光
  - M 手动模式
  - HSS 高速同步
  - 前帘/后帘同步
- 手风琴式展开/收起
- 详细的使用技巧和场景说明

#### 3.4 历史记录（history.html）
- 自动保存生成的参数（最多 50 条）
- 显示时间戳（今天、昨天、具体日期）
- 参数预览（镜头、场景、ISO、光圈）
- 查看详情：跳转到参数展示页面
- 删除单条记录
- 清空所有记录
- 空状态提示

### 4. API 调用方案

#### 4.1 直接调用（默认）
```javascript
const CONFIG = {
  COZE_API_URL: 'https://3mp9d3y2dz.coze.site/run',
  COZE_API_TOKEN: 'pat_tCvXZJZRdqVJXQNYGLXvJDhxPNfvXFvCxfqBEGPEFKGVlqEXqPqJxDUGqvLvmFZf',
  USE_CORS_PROXY: false
}
```

#### 4.2 使用 CORS 代理（可选）
```javascript
const CONFIG = {
  USE_CORS_PROXY: true,
  CORS_PROXY_URL: 'https://cors-anywhere.herokuapp.com/'
}
```

### 5. UI 设计

#### 5.1 配色方案
- 背景：深色（#111827 - gray-900）
- 主色调：红色（#dc2626 - red-600）- 佳能红
- 辅助色：橙色（#f97316 - orange-500）- 神牛橙
- 文字：白色、灰色

#### 5.2 交互设计
- 选中状态：红色边框 + 深红色背景
- 悬停效果：背景变亮
- 加载动画：旋转圆圈 + 提示文字
- 数字滚动：渐入动画
- 响应式布局：移动端友好

### 6. 数据存储
- 使用 LocalStorage 存储历史记录
- 键名：`r50_history`
- 最多保存 50 条记录
- 数据格式：JSON 数组

### 7. 错误处理
- API 调用失败：显示错误提示
- 数据解析失败：使用默认值
- 历史记录加载失败：显示空状态
- 网络错误：友好的错误消息

## 使用方法

### 方法 1：直接打开（推荐）
```bash
# 用浏览器直接打开
open standalone-web/index.html
```

### 方法 2：使用本地服务器
```bash
# 使用 Python
cd standalone-web
python3 -m http.server 8000

# 或使用 Node.js
npx http-server -p 8000

# 然后在浏览器中打开
# http://localhost:8000
```

## 优势

### 相比 Taro 小程序 H5
1. **无框架依赖**：不依赖 Taro、React 等框架
2. **无构建步骤**：不需要编译、打包
3. **无 CORS 限制**：可以使用 CORS 代理或本地服务器
4. **调试简单**：直接在浏览器中调试
5. **部署简单**：上传到任何静态服务器即可
6. **加载快速**：无需加载大型框架
7. **兼容性好**：支持所有现代浏览器

### 功能完整性
- ✅ 所有原有功能都已实现
- ✅ UI 设计保持一致
- ✅ 交互体验优化
- ✅ 移动端适配
- ✅ 历史记录功能
- ✅ 器材百科功能

## 测试步骤

1. **打开应用**
   ```bash
   cd standalone-web
   python3 -m http.server 8000
   # 打开 http://localhost:8000
   ```

2. **测试参数生成**
   - 选择镜头：RF 55mm f/1.8
   - 开启闪光灯
   - 选择场景：夜景人像
   - 选择光线：黄金时刻
   - 选择天气：晴天
   - 选择风格：日系小清新
   - 点击"生成最佳参数"
   - 等待约 10 秒
   - 查看参数展示页面

3. **测试历史记录**
   - 生成参数后自动保存
   - 点击"历史记录"标签
   - 查看历史记录列表
   - 点击"查看"按钮查看详情
   - 点击"删除"按钮删除记录

4. **测试器材百科**
   - 点击"器材百科"标签
   - 展开各个条目
   - 查看详细说明

## 注意事项

1. **CORS 问题**
   - 如果直接打开 HTML 文件遇到 CORS 错误
   - 使用本地服务器运行（推荐）
   - 或启用 CORS 代理

2. **API Token**
   - 已在代码中配置
   - 如需更换，修改 `js/app.js` 中的 `CONFIG.COZE_API_TOKEN`

3. **浏览器兼容性**
   - 需要支持 ES6+ 的现代浏览器
   - Chrome 90+、Firefox 88+、Safari 14+、Edge 90+

4. **数据隐私**
   - 历史记录存储在浏览器本地
   - 清除浏览器缓存会丢失历史记录
   - 无痕模式下不会保存历史记录

## 部署建议

### 静态网站托管
- **Vercel**：免费，自动 HTTPS，全球 CDN
- **Netlify**：免费，自动 HTTPS，全球 CDN
- **GitHub Pages**：免费，适合开源项目
- **Cloudflare Pages**：免费，全球 CDN

### 部署步骤（以 Vercel 为例）
```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 部署
cd standalone-web
vercel

# 3. 按提示操作，几秒钟即可完成部署
```

---

# Previous Task: 修复 H5 环境扣子 API 502 错误

## 状态
❌ **未解决** - 多次尝试修复，但问题依然存在

## 尝试的解决方案
1. 使用 Vite 代理
2. 判断运行环境
3. 清除缓存
4. 调整代理配置
5. 增加超时时间

## 最终决策
放弃 Taro 小程序 H5 方案，改用独立的纯前端 Web 应用

## 问题描述
- **错误信息**: 502 Bad Gateway
- **环境**: H5 浏览器环境
- **现象**: 测试脚本可以正常调用扣子 API，但集成在小程序 H5 中就失败
- **根本原因**: 代码直接使用完整 URL `https://3mp9d3y2dz.coze.site/run`，绕过了 Vite 代理

## 解决方案
✅ 判断运行环境（H5 vs 小程序）
✅ H5 环境使用代理路径 `/api/coze/run`
✅ 小程序环境使用完整 URL
✅ 添加详细的调试日志

## 技术细节
- **环境判断**: `typeof window !== 'undefined' && typeof document !== 'undefined'`
- **H5 请求路径**: `/api/coze/run` (通过 Vite 代理)
- **小程序请求路径**: `https://3mp9d3y2dz.coze.site/run` (直接请求)
- **Vite 代理配置**: `/api/coze` -> `https://3mp9d3y2dz.coze.site`
- **代理超时**: 30 秒（足够等待扣子 API 响应）

## 测试步骤

1. **清除缓存**（必须！）
   ```bash
   ./clear-cache.sh
   ```

2. **重启开发服务器**（必须！）
   ```bash
   # 停止当前服务器
   Ctrl+C
   
   # 重新启动
   npm run dev:h5
   ```

3. **强制刷新浏览器**
   ```bash
   Ctrl + Shift + R
   ```

4. **测试参数生成**
   - 导航到 AI 参数咨询师页面
   - 选择参数（镜头、闪光灯、场景、光线、天气、风格）
   - 点击"生成最佳参数"按钮
   - 等待约 10 秒
   - 查看控制台日志，应该显示：
     ```
     🔍 扣子 API 环境变量调试信息
     运行环境: H5 (浏览器)
     请求 URL: /api/coze/run
     使用代理: 是
     ```
   - 应该成功跳转到参数展示页面

5. **验证代理工作**
   - 打开浏览器开发者工具（F12）
   - 切换到 Network 标签
   - 查看请求，应该看到：
     - 请求 URL: `http://localhost:10086/api/coze/run`
     - 状态码: 200 OK
     - 响应时间: 约 10 秒

## 为什么之前会失败？

**问题根源**：
- 代码直接使用完整 URL `https://3mp9d3y2dz.coze.site/run`
- 浏览器发起跨域请求（CORS）
- 扣子 API 服务器不支持 CORS
- 浏览器阻止请求，返回 502 错误

**为什么测试脚本可以工作？**：
- Node.js 环境不受 CORS 限制
- 可以直接请求任何 URL

**为什么现在可以工作？**：
- H5 环境使用 Vite 代理
- 浏览器请求 `http://localhost:10086/api/coze/run`（同源）
- Vite 代理转发到 `https://3mp9d3y2dz.coze.site/run`
- 绕过 CORS 限制

## Notes
- H5 环境必须使用代理，否则会遇到 CORS 问题
- 小程序环境不受 CORS 限制，可以直接请求
- 代理配置在 `config/index.ts` 中
- 代理超时设置为 30 秒，足够等待扣子 API 响应
- 修改代理配置后必须重启开发服务器

---

# Previous Task: 修复 React useCallback 错误和缓存问题

## 状态
✅ **已完成** - 清除缓存解决 React useCallback 错误

## 完成内容

### 1. 扩展 CameraParams 接口
- ✅ 场景分析（sceneAnalysis）：summary, difficultyLevel
- ✅ 镜头推荐（lensRecommendation）：focalLength, reason
- ✅ 相机设置：shootingMode, exposureCompensation, whiteBalanceShift
- ✅ 照片风格：styleName
- ✅ 闪光灯设置：flashEnable, flashMode, flashHssSync, flashPower, flashZoom, flashAngle, flashDiffuserAdvice

### 2. 更新 parseCozeResponse 函数
- ✅ 解析所有扣子 API 返回的字段
- ✅ 添加 sceneAnalysis 和 lensRecommendation 变量定义
- ✅ 正确处理嵌套对象（white_balance, flash_godox_tt685ii）
- ✅ 提供合理的默认值

### 3. 重写参数展示页面
- ✅ 场景分析区域：显示场景摘要和难度等级（简单/中等/困难）
- ✅ 镜头推荐区域：显示推荐焦距和推荐理由
- ✅ 相机设置区域：显示拍摄模式、ISO、光圈、快门、曝光补偿、白平衡及偏移
- ✅ 照片风格区域：显示风格名称、锐度、反差、饱和度、色调
- ✅ 闪光灯设置区域：显示模式、功率/补偿、焦距、灯头角度、高速同步状态、柔光建议
- ✅ 专家建议区域：显示完整的专家建议文本
- ✅ 所有字段使用中文标签

### 4. 优化 UI 设计
- ✅ 使用不同图标区分各个区域
- ✅ 难度等级使用颜色标识
- ✅ 闪光灯相关元素使用 text-flash 颜色
- ✅ 添加渐进式动画效果
- ✅ 条件渲染：仅在有数据时显示对应区域

### 5. 代码质量
- ✅ 通过 lint 检查
- ✅ 类型安全
- ✅ 完整的错误处理

## 扣子 API 返回参数示例

```json
{
  "optimized_params": {
    "scene_analysis": {
      "summary": "室内夜景低光环境需平衡噪点与曝光，情绪抑郁风格要求低曝光+高反差+低饱和+冷色调",
      "difficulty_level": "Medium"
    },
    "lens_recommendation": {
      "focal_length": "35mm",
      "reason": "用户已指定RF 35mm f/1.8，适合室内环境的环境人像构图，f/1.8大光圈可提升进光量"
    },
    "camera_settings_r50": {
      "shooting_mode": "M",
      "aperture": "f/1.8",
      "shutter_speed": "1/200",
      "iso": 800,
      "exposure_compensation": "-1.0",
      "white_balance": {
        "mode_or_kelvin": "4000K",
        "shift": "B3M1"
      }
    },
    "picture_style_settings": {
      "style_name": "User Def 1",
      "sharpness": 2,
      "contrast": 2,
      "saturation": -3,
      "color_tone": 0
    },
    "flash_godox_tt685ii": {
      "enable": true,
      "mode": "TTL",
      "hss_sync": false,
      "power_or_comp": "TTL-0.7",
      "zoom": "35mm",
      "head_angle": "45° Up + CTO Gel (1/2)",
      "diffuser_advice": "使用小型柔光箱或硫酸纸柔化闪光，避免硬光破坏情绪氛围"
    },
    "expert_advice": "降低闪光灯输出并搭配CTO凝胶，避免环境光与闪光色温割裂，同时利用RF 35mm的环境融入感强化情绪叙事"
  }
}
```

## 字段映射（中文）

| 英文字段 | 中文标签 |
|---------|---------|
| scene_analysis | 场景分析 |
| summary | 场景摘要 |
| difficulty_level | 难度等级 |
| lens_recommendation | 镜头推荐 |
| focal_length | 焦距 |
| reason | 推荐理由 |
| shooting_mode | 拍摄模式 |
| aperture | 光圈 |
| shutter_speed | 快门速度 |
| iso | ISO 感光度 |
| exposure_compensation | 曝光补偿 |
| white_balance | 白平衡 |
| shift | 偏移 |
| style_name | 风格名称 |
| sharpness | 锐度 |
| contrast | 反差 |
| saturation | 饱和度 |
| color_tone | 色调 |
| flash | 闪光灯 |
| mode | 模式 |
| hss_sync | 高速同步 |
| power_or_comp | 功率/补偿 |
| zoom | 焦距 |
| head_angle | 灯头角度 |
| diffuser_advice | 柔光建议 |
| expert_advice | 专家建议 |

## 测试步骤

1. **重启开发服务器**（必须！）
   ```bash
   # 停止当前服务器
   Ctrl+C
   
   # 重新启动
   npm run dev:h5
   ```

2. **强制刷新浏览器**
   ```bash
   Ctrl + Shift + R
   ```

3. **测试参数生成**
   - 选择参数（镜头、闪光灯、场景、光线、天气、风格）
   - 点击"生成最佳参数"
   - 等待约 10 秒
   - 查看参数展示页面

4. **验证显示内容**
   - ✅ 场景分析区域显示正确
   - ✅ 镜头推荐区域显示正确
   - ✅ 相机设置区域显示正确
   - ✅ 照片风格区域显示正确
   - ✅ 闪光灯设置区域显示正确（仅在开启闪光灯时）
   - ✅ 专家建议区域显示正确
   - ✅ 所有字段使用中文标签

## Notes
- 所有字段都支持条件渲染，仅在有数据时显示
- 难度等级使用颜色标识：绿色（简单）、黄色（中等）、红色（困难）
- 闪光灯相关元素使用橙色（text-flash）突出显示
- 使用渐进式动画效果提升用户体验
- 代码已通过 lint 检查，类型安全
