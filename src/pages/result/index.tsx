import {Button, ScrollView, Text, View} from '@tarojs/components'
import Taro from '@tarojs/taro'
import {useEffect} from 'react'
import {type HistoryItem, useCameraStore} from '@/store/cameraStore'

export default function Result() {
  const {params, selectedLens, flashEnabled, scene, customScene, lighting, weather, style, addToHistory} =
    useCameraStore()

  useEffect(() => {
    // 保存到历史记录
    if (params) {
      const historyItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        lens: selectedLens,
        flash: flashEnabled,
        scene: scene,
        customScene: scene === 'custom' ? customScene : undefined,
        lighting: lighting,
        weather: weather,
        style: style,
        params: params
      }
      addToHistory(historyItem)
    }
  }, [params, addToHistory, customScene, flashEnabled, lighting, weather, scene, selectedLens, style])

  const handleBack = () => {
    Taro.navigateBack()
  }

  const handleNewAnalysis = () => {
    Taro.navigateBack()
  }

  if (!params) {
    return (
      <View className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <Text className="text-foreground">参数加载中...</Text>
      </View>
    )
  }

  return (
    <View className="min-h-screen bg-gradient-dark">
      <ScrollView scrollY className="h-screen scrollbar-hidden" style={{background: 'transparent'}}>
        <View className="px-4 py-6 pb-32">
          {/* 标题区域 */}
          <View className="mb-6 animate-fade-in">
            <View className="flex flex-row items-center justify-between mb-4">
              <View className="flex flex-row items-center">
                <View className="i-mdi-arrow-left text-2xl text-foreground mr-2" onClick={handleBack} />
                <Text className="text-2xl font-bold text-foreground">参数建议</Text>
              </View>
              <View className="i-mdi-check-circle text-2xl text-primary" />
            </View>
            <Text className="text-sm text-muted-foreground block">根据您的设置生成的最佳参数</Text>
          </View>

          {/* 主要参数仪表盘 */}
          <View
            className="bg-card rounded-2xl p-5 border border-border mb-4 animate-fade-in"
            style={{animationDelay: '0.05s'}}>
            <Text className="text-base font-semibold text-foreground block mb-4">相机参数</Text>
            <View className="grid grid-cols-2 gap-4">
              <View className="bg-secondary rounded-xl p-4">
                <Text className="text-xs text-muted-foreground block mb-2">ISO 感光度</Text>
                <Text className="text-3xl font-mono-param font-bold text-primary block">{params.iso}</Text>
              </View>
              <View className="bg-secondary rounded-xl p-4">
                <Text className="text-xs text-muted-foreground block mb-2">光圈</Text>
                <Text className="text-3xl font-mono-param font-bold text-primary block">{params.aperture}</Text>
              </View>
              <View className="bg-secondary rounded-xl p-4">
                <Text className="text-xs text-muted-foreground block mb-2">快门速度</Text>
                <Text className="text-3xl font-mono-param font-bold text-primary block">{params.shutterSpeed}</Text>
              </View>
              <View className="bg-secondary rounded-xl p-4">
                <Text className="text-xs text-muted-foreground block mb-2">白平衡</Text>
                <Text className="text-3xl font-mono-param font-bold text-primary block">{params.whiteBalance}</Text>
              </View>
            </View>

            <View className="h-px bg-border my-4" />

            <View className="grid grid-cols-4 gap-3">
              <View className="text-center">
                <Text className="text-xs text-muted-foreground block mb-1">锐度</Text>
                <Text className="text-xl font-mono-param font-semibold text-foreground block">{params.sharpness}</Text>
              </View>
              <View className="text-center">
                <Text className="text-xs text-muted-foreground block mb-1">反差</Text>
                <Text className="text-xl font-mono-param font-semibold text-foreground block">
                  {params.contrast > 0 ? '+' : ''}
                  {params.contrast}
                </Text>
              </View>
              <View className="text-center">
                <Text className="text-xs text-muted-foreground block mb-1">饱和度</Text>
                <Text className="text-xl font-mono-param font-semibold text-foreground block">
                  {params.saturation > 0 ? '+' : ''}
                  {params.saturation}
                </Text>
              </View>
              <View className="text-center">
                <Text className="text-xs text-muted-foreground block mb-1">色调</Text>
                <Text className="text-xl font-mono-param font-semibold text-foreground block">
                  {params.tone > 0 ? '+' : ''}
                  {params.tone}
                </Text>
              </View>
            </View>
          </View>

          {/* 闪光灯参数卡片 */}
          {flashEnabled && params.flashMode && (
            <View className="bg-gradient-accent rounded-2xl p-5 mb-4 animate-fade-in" style={{animationDelay: '0.1s'}}>
              <View className="flex flex-row items-center gap-2 mb-4">
                <View className="i-mdi-flash text-2xl text-accent-foreground" />
                <Text className="text-base font-semibold text-accent-foreground block">闪光灯参数</Text>
              </View>
              <View className="grid grid-cols-3 gap-4">
                <View className="bg-accent-foreground/10 rounded-xl p-3">
                  <Text className="text-xs text-accent-foreground/70 block mb-2">模式</Text>
                  <Text className="text-2xl font-mono-param font-bold text-accent-foreground block">
                    {params.flashMode}
                  </Text>
                </View>
                <View className="bg-accent-foreground/10 rounded-xl p-3">
                  <Text className="text-xs text-accent-foreground/70 block mb-2">功率</Text>
                  <Text className="text-2xl font-mono-param font-bold text-accent-foreground block">
                    {params.flashPower}
                  </Text>
                </View>
                <View className="bg-accent-foreground/10 rounded-xl p-3">
                  <Text className="text-xs text-accent-foreground/70 block mb-2">角度</Text>
                  <Text className="text-2xl font-mono-param font-bold text-accent-foreground block">
                    {params.flashAngle}°
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* 操作建议 */}
          <View
            className="bg-secondary rounded-2xl p-5 border border-border mb-4 animate-fade-in"
            style={{animationDelay: '0.15s'}}>
            <View className="flex flex-row items-start gap-3">
              <View className="i-mdi-lightbulb-on text-2xl text-primary mt-0.5 flex-shrink-0" />
              <View className="flex-1">
                <Text className="text-sm font-semibold text-foreground block mb-2">操作建议</Text>
                <Text className="text-sm text-muted-foreground block leading-relaxed">{params.suggestion}</Text>
              </View>
            </View>
          </View>

          {/* 底部按钮组 */}
          <View className="flex flex-col gap-3 animate-fade-in" style={{animationDelay: '0.2s'}}>
            <Button
              className="w-full bg-gradient-primary text-white py-4 rounded-xl break-keep text-base font-semibold"
              size="default"
              onClick={handleNewAnalysis}>
              再次分析
            </Button>
            <Button
              className="w-full bg-secondary text-foreground py-4 rounded-xl break-keep text-base font-semibold border border-border"
              size="default"
              onClick={() => Taro.navigateTo({url: '/pages/history/index'})}>
              查看历史记录
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
