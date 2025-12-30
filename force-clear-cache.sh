#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔥 强制清除所有缓存"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 停止所有 Node 进程
echo "⏹️  停止所有 Node 进程..."
pkill -f "node" 2>/dev/null || true
sleep 2

# 清除 Vite 缓存
echo "🧹 清除 Vite 缓存..."
rm -rf node_modules/.vite
rm -rf node_modules/.cache

# 清除 Taro 编译缓存
echo "🧹 清除 Taro 编译缓存..."
rm -rf dist
rm -rf .taro-cache
rm -rf .temp

# 清除构建产物
echo "🧹 清除构建产物..."
rm -rf dist-h5
rm -rf dist-weapp

# 清除 npm 缓存
echo "🧹 清除 npm 缓存..."
npm cache clean --force 2>/dev/null || true

echo ""
echo "✅ 所有缓存已清除！"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📝 下一步操作："
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. 重启开发服务器: npm run dev:h5"
echo "2. 在浏览器中打开无痕窗口:"
echo "   - Chrome: Ctrl + Shift + N"
echo "   - Firefox: Ctrl + Shift + P"
echo "3. 访问: http://localhost:10086"
echo "4. 打开开发者工具 (F12)"
echo "5. 切换到 Console 标签"
echo "6. 查看日志，应该显示:"
echo "   🔗 使用完整 URL: https://3mp9d3y2dz.coze.site/run"
echo "7. 切换到 Network 标签"
echo "8. 点击'生成最佳参数'按钮"
echo "9. 查看请求 URL，应该是:"
echo "   https://3mp9d3y2dz.coze.site/run"
echo "   而不是 /api/coze/run"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
