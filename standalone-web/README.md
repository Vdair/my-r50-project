# R50 光影私教 - 独立 Web 版本

这是一个**纯前端 Web 应用**，不依赖任何框架（Taro、React等），可以直接在浏览器中打开使用。

## 📁 文件结构

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
└── README.md           # 本文件
```

## 🚀 使用方法

### 方法 1：直接打开（推荐）

1. 用浏览器直接打开 `index.html` 文件
2. 开始使用！

### 方法 2：使用本地服务器

如果遇到 CORS 问题，可以使用本地服务器：

```bash
# 使用 Python 3
cd standalone-web
python3 -m http.server 8000

# 或使用 Node.js (需要先安装 http-server)
npx http-server -p 8000

# 然后在浏览器中打开
# http://localhost:8000
```

## ✨ 功能特性

### 1. AI 参数咨询师
- 选择镜头（55mm 定焦、18-150mm 变焦、100-400mm 长焦）
- 开启/关闭闪光灯
- 选择拍摄场景（人像、风景、夜景人像、室内静物、运动抓拍、美食）
- 自定义场景描述
- 选择光线环境（清晨、正午、黄金时刻、夜晚）
- 选择天气情况（晴天、多云、阴天、雨天、雾天）
- 选择风格偏好（日系小清新、胶片复古、高对比黑白、港风怀旧）
- 一键生成最佳参数

### 2. 参数展示
- 场景分析（场景摘要、难度等级）
- 镜头推荐（推荐焦距、推荐理由）
- 相机设置（拍摄模式、ISO、光圈、快门速度、曝光补偿、白平衡）
- 照片风格（风格名称、锐度、反差、饱和度、色调）
- 闪光灯设置（模式、功率、焦距、灯头角度、高速同步、柔光建议）
- 专家建议

### 3. 器材百科
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

### 4. 历史记录
- 自动保存生成的参数（最多 50 条）
- 查看历史记录
- 删除单条记录
- 清空所有记录

## 🔧 配置

### 扣子 API 配置

在 `js/app.js` 文件中修改配置：

```javascript
const CONFIG = {
  // 扣子 API 配置
  COZE_API_URL: 'https://3mp9d3y2dz.coze.site/run',
  COZE_API_TOKEN: 'your_token_here',
  
  // CORS 代理（如果需要）
  USE_CORS_PROXY: false,
  CORS_PROXY_URL: 'https://cors-anywhere.herokuapp.com/',
  
  // 本地存储键名
  STORAGE_KEY: 'r50_history'
}
```

### 使用 CORS 代理

如果直接调用扣子 API 遇到 CORS 问题，可以启用 CORS 代理：

```javascript
const CONFIG = {
  USE_CORS_PROXY: true,
  CORS_PROXY_URL: 'https://cors-anywhere.herokuapp.com/',
  // ...
}
```

**注意**：公共 CORS 代理可能不稳定，建议自己搭建或使用其他方案。

## 🌐 浏览器兼容性

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 📱 移动端支持

完全支持移动端浏览器，响应式设计，触摸友好。

## 💾 数据存储

所有数据（历史记录）存储在浏览器的 LocalStorage 中，不会上传到服务器。

## 🔒 隐私说明

- 应用完全在浏览器中运行
- 只在调用扣子 API 时发送数据
- 不收集任何个人信息
- 历史记录仅存储在本地

## 🐛 故障排除

### 问题 1：无法调用扣子 API（CORS 错误）

**解决方案**：
1. 启用 CORS 代理（修改 `js/app.js` 中的 `USE_CORS_PROXY` 为 `true`）
2. 或使用本地服务器运行应用

### 问题 2：历史记录丢失

**原因**：清除了浏览器缓存或使用了无痕模式

**解决方案**：使用正常模式浏览器，不要清除 LocalStorage

### 问题 3：页面样式错误

**原因**：Tailwind CSS CDN 加载失败

**解决方案**：检查网络连接，或下载 Tailwind CSS 到本地

## 📝 开发说明

### 技术栈
- HTML5
- Vanilla JavaScript (ES6+)
- Tailwind CSS (CDN)
- Material Design Icons (CDN)
- LocalStorage API
- Fetch API

### 代码结构
- `app.js`：主应用逻辑，包含状态管理、API 调用、数据处理
- `result.js`：结果页面逻辑，负责显示参数
- `history.js`：历史记录逻辑，负责存储和显示历史记录
- `style.css`：自定义样式，补充 Tailwind CSS

### 修改建议
- 修改 API 配置：编辑 `js/app.js` 中的 `CONFIG` 对象
- 修改样式：编辑 `css/style.css` 或直接修改 HTML 中的 Tailwind 类名
- 添加新功能：在对应的 JS 文件中添加函数

## 📄 许可证

本项目仅供学习和个人使用。

## 🙏 致谢

- Canon EOS R50
- Godox TT685II
- 扣子 AI 工作流
- Tailwind CSS
- Material Design Icons

---

**享受摄影的乐趣！📷✨**
