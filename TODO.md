# Task: 修复 H5 环境扣子 API 502 错误

## 当前状态
✅ **已修复** - H5 环境现在使用 Vite 代理调用扣子 API

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
