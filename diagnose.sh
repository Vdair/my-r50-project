#!/bin/bash

# 快速诊断脚本：检查开发服务器状态和配置

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║          🔍 快速诊断：检查开发服务器和代理配置              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 步骤 1：检查开发服务器进程"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if pgrep -f "npm run dev:h5" > /dev/null || pgrep -f "vite" > /dev/null; then
    echo "✅ 开发服务器正在运行"
    echo ""
    echo "⚠️  警告：如果您刚刚修改了代理配置，需要重启服务器！"
    echo ""
    echo "请执行以下步骤："
    echo "1. 在运行 npm run dev:h5 的终端窗口中按 Ctrl+C"
    echo "2. 重新运行 npm run dev:h5"
    echo "3. 强制刷新浏览器（Ctrl+Shift+R）"
else
    echo "❌ 开发服务器未运行"
    echo ""
    echo "请启动开发服务器："
    echo "npm run dev:h5"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 步骤 2：检查代理配置"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if grep -q "proxyTimeout: 30000" config/index.ts; then
    echo "✅ 代理超时配置正确（proxyTimeout: 30000）"
else
    echo "❌ 代理超时配置缺失或错误"
    echo "请检查 config/index.ts 文件"
fi

if grep -q "timeout: 30000" config/index.ts; then
    echo "✅ 请求超时配置正确（timeout: 30000）"
else
    echo "❌ 请求超时配置缺失或错误"
    echo "请检查 config/index.ts 文件"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 步骤 3：检查环境变量"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f .env ]; then
    echo "✅ .env 文件存在"
    
    if grep -q "VITE_COZE_API_URL" .env; then
        echo "✅ VITE_COZE_API_URL 已配置"
    else
        echo "❌ VITE_COZE_API_URL 未配置"
    fi
    
    if grep -q "VITE_COZE_API_TOKEN" .env; then
        echo "✅ VITE_COZE_API_TOKEN 已配置"
    else
        echo "❌ VITE_COZE_API_TOKEN 未配置"
    fi
else
    echo "❌ .env 文件不存在"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 步骤 4：测试扣子 API 连接"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "运行测试脚本..."
echo ""

node test-coze-api.js

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ 诊断完成"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "如果测试脚本成功但浏览器请求失败，请确保："
echo "1. ✅ 已重启开发服务器"
echo "2. ✅ 已强制刷新浏览器（Ctrl+Shift+R）"
echo "3. ✅ 已清除浏览器缓存（F12 → Network → Disable cache）"
echo ""
echo "如果问题仍然存在，请提供："
echo "- 终端日志（Vite 开发服务器的输出）"
echo "- 浏览器控制台日志（F12 → Console）"
echo "- 浏览器网络日志（F12 → Network → /api/coze/run 请求详情）"
echo ""
