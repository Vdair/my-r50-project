#!/bin/bash

echo "🧹 清除缓存..."

# 清除 Vite 缓存
rm -rf node_modules/.vite
echo "✅ 已清除 Vite 缓存"

# 清除 Taro 编译缓存
rm -rf .temp
rm -rf dist
echo "✅ 已清除 Taro 编译缓存"

echo ""
echo "✨ 缓存清除完成！"
echo ""
echo "📝 下一步操作："
echo "1. 重启开发服务器: npm run dev:h5"
echo "2. 在浏览器中强制刷新: Ctrl + Shift + R"
echo "3. 如果问题仍然存在，请清除浏览器缓存"
