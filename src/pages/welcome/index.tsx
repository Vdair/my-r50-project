import {Text, View} from '@tarojs/components'
import Taro from '@tarojs/taro'

export default function Welcome() {
  const navigateToConsultant = () => {
    Taro.navigateTo({url: '/pages/consultant/index'})
  }

  const navigateToWiki = () => {
    Taro.navigateTo({url: '/pages/wiki/index'})
  }

  const navigateToHistory = () => {
    Taro.navigateTo({url: '/pages/history/index'})
  }

  return (
    <View className="min-h-screen bg-gradient-dark flex flex-col">
      {/* 顶部标题区域 */}
      <View className="px-6 pt-12 pb-8">
        <View className="flex flex-row items-center justify-between mb-3">
          <View className="flex-1" />
          <View className="i-mdi-camera text-4xl text-primary" />
          <View className="flex-1 flex flex-row justify-end">
            <View
              className="i-mdi-history text-2xl text-muted-foreground active:text-primary transition-colors"
              onClick={navigateToHistory}
            />
          </View>
        </View>
        <Text className="text-3xl font-bold text-center text-foreground block mb-2">R50 光影私教</Text>
        <Text className="text-sm text-center text-muted-foreground block">Canon R50 × Godox TT685II 专业参数助手</Text>
      </View>

      {/* 主要功能卡片 */}
      <View className="flex-1 px-6 py-4">
        {/* AI 场景助手卡片 */}
        <View
          className="bg-card rounded-2xl p-6 mb-4 border-2 border-primary/20 active:scale-98 transition-transform"
          onClick={navigateToConsultant}>
          <View className="flex flex-row items-start gap-4">
            <View className="bg-gradient-primary rounded-xl p-3 flex-shrink-0">
              <View className="i-mdi-auto-fix text-3xl text-primary-foreground" />
            </View>
            <View className="flex-1">
              <Text className="text-xl font-bold text-foreground block mb-2">AI 场景助手</Text>
              <Text className="text-sm text-muted-foreground block leading-relaxed mb-3">
                根据拍摄场景、光线环境和风格偏好，智能生成最佳相机参数建议
              </Text>
              <View className="flex flex-row flex-wrap gap-2">
                <View className="bg-secondary rounded-lg px-3 py-1 flex flex-row items-center gap-1">
                  <View className="i-mdi-camera-iris text-xs text-primary" />
                  <Text className="text-xs text-foreground">镜头选择</Text>
                </View>
                <View className="bg-secondary rounded-lg px-3 py-1 flex flex-row items-center gap-1">
                  <View className="i-mdi-flash text-xs text-accent" />
                  <Text className="text-xs text-foreground">闪光灯</Text>
                </View>
                <View className="bg-secondary rounded-lg px-3 py-1 flex flex-row items-center gap-1">
                  <View className="i-mdi-palette text-xs text-primary" />
                  <Text className="text-xs text-foreground">风格调整</Text>
                </View>
              </View>
            </View>
            <View className="i-mdi-chevron-right text-2xl text-muted-foreground flex-shrink-0" />
          </View>
        </View>

        {/* 器材百科卡片 */}
        <View
          className="bg-card rounded-2xl p-6 border-2 border-border active:scale-98 transition-transform"
          onClick={navigateToWiki}>
          <View className="flex flex-row items-start gap-4">
            <View className="bg-secondary rounded-xl p-3 flex-shrink-0">
              <View className="i-mdi-book-open-variant text-3xl text-accent" />
            </View>
            <View className="flex-1">
              <Text className="text-xl font-bold text-foreground block mb-2">器材百科</Text>
              <Text className="text-sm text-muted-foreground block leading-relaxed mb-3">
                详细了解 Canon R50 和 Godox TT685II 的各项功能和使用技巧
              </Text>
              <View className="flex flex-row flex-wrap gap-2">
                <View className="bg-secondary rounded-lg px-3 py-1 flex flex-row items-center gap-1">
                  <View className="i-mdi-camera text-xs text-primary" />
                  <Text className="text-xs text-foreground">R50 功能</Text>
                </View>
                <View className="bg-secondary rounded-lg px-3 py-1 flex flex-row items-center gap-1">
                  <View className="i-mdi-flash-outline text-xs text-accent" />
                  <Text className="text-xs text-foreground">闪光灯模式</Text>
                </View>
              </View>
            </View>
            <View className="i-mdi-chevron-right text-2xl text-muted-foreground flex-shrink-0" />
          </View>
        </View>
      </View>

      {/* 底部装饰图标 */}
      <View className="px-6 py-8">
        <View className="flex flex-row items-center justify-center gap-6 opacity-30">
          <View className="i-mdi-camera-iris text-2xl text-muted-foreground" />
          <View className="i-mdi-aperture text-2xl text-muted-foreground" />
          <View className="i-mdi-flash text-2xl text-muted-foreground" />
          <View className="i-mdi-white-balance-sunny text-2xl text-muted-foreground" />
          <View className="i-mdi-timer text-2xl text-muted-foreground" />
        </View>
        <Text className="text-xs text-center text-muted-foreground block mt-4">© 2025 R50 光影私教</Text>
      </View>
    </View>
  )
}
