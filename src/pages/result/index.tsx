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

          {/* 场景分析 */}
          {params.sceneAnalysis && (
            <View
              className="bg-card rounded-2xl p-5 border border-border mb-4 animate-fade-in"
              style={{animationDelay: '0.05s'}}>
              <View className="flex flex-row items-center mb-3">
                <View className="i-mdi-image-filter-hdr text-xl text-primary mr-2" />
                <Text className="text-base font-semibold text-foreground">场景分析</Text>
              </View>
              <Text className="text-sm text-foreground leading-relaxed block mb-2">{params.sceneAnalysis.summary}</Text>
              <View className="flex flex-row items-center mt-2">
                <Text className="text-xs text-muted-foreground mr-2">难度等级：</Text>
                <View
                  className={`px-2 py-1 rounded ${
                    params.sceneAnalysis.difficultyLevel === 'Easy'
                      ? 'bg-green-500/20'
                      : params.sceneAnalysis.difficultyLevel === 'Medium'
                        ? 'bg-yellow-500/20'
                        : 'bg-red-500/20'
                  }`}>
                  <Text
                    className={`text-xs ${
                      params.sceneAnalysis.difficultyLevel === 'Easy'
                        ? 'text-green-400'
                        : params.sceneAnalysis.difficultyLevel === 'Medium'
                          ? 'text-yellow-400'
                          : 'text-red-400'
                    }`}>
                    {params.sceneAnalysis.difficultyLevel === 'Easy'
                      ? '简单'
                      : params.sceneAnalysis.difficultyLevel === 'Medium'
                        ? '中等'
                        : '困难'}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* 镜头推荐 */}
          {params.lensRecommendation && (
            <View
              className="bg-card rounded-2xl p-5 border border-border mb-4 animate-fade-in"
              style={{animationDelay: '0.1s'}}>
              <View className="flex flex-row items-center mb-3">
                <View className="i-mdi-camera-iris text-xl text-primary mr-2" />
                <Text className="text-base font-semibold text-foreground">镜头推荐</Text>
              </View>
              <View className="bg-secondary rounded-xl p-3 mb-2">
                <Text className="text-lg font-bold text-primary block">{params.lensRecommendation.focalLength}</Text>
              </View>
              <Text className="text-sm text-muted-foreground leading-relaxed block">
                {params.lensRecommendation.reason}
              </Text>
            </View>
          )}

          {/* 相机设置 */}
          <View
            className="bg-card rounded-2xl p-5 border border-border mb-4 animate-fade-in"
            style={{animationDelay: '0.15s'}}>
            <View className="flex flex-row items-center mb-4">
              <View className="i-mdi-camera text-xl text-primary mr-2" />
              <Text className="text-base font-semibold text-foreground">相机设置</Text>
            </View>

            {/* 拍摄模式 */}
            {params.shootingMode && (
              <View className="mb-4">
                <Text className="text-xs text-muted-foreground block mb-2">拍摄模式</Text>
                <View className="bg-secondary rounded-xl p-3">
                  <Text className="text-2xl font-mono-param font-bold text-primary block">{params.shootingMode}</Text>
                </View>
              </View>
            )}

            {/* 主要参数 */}
            <View className="grid grid-cols-2 gap-4 mb-4">
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
                <Text className="text-xs text-muted-foreground block mb-2">曝光补偿</Text>
                <Text className="text-3xl font-mono-param font-bold text-primary block">
                  {params.exposureCompensation}
                </Text>
              </View>
            </View>

            {/* 白平衡 */}
            <View className="bg-secondary rounded-xl p-4">
              <Text className="text-xs text-muted-foreground block mb-2">白平衡</Text>
              <Text className="text-2xl font-mono-param font-bold text-primary block">{params.whiteBalance}</Text>
              {params.whiteBalanceShift && (
                <Text className="text-sm text-muted-foreground block mt-1">偏移：{params.whiteBalanceShift}</Text>
              )}
            </View>
          </View>

          {/* 照片风格设置 */}
          <View
            className="bg-card rounded-2xl p-5 border border-border mb-4 animate-fade-in"
            style={{animationDelay: '0.2s'}}>
            <View className="flex flex-row items-center mb-4">
              <View className="i-mdi-palette text-xl text-primary mr-2" />
              <Text className="text-base font-semibold text-foreground">照片风格</Text>
            </View>

            {params.styleName && (
              <View className="bg-secondary rounded-xl p-3 mb-4">
                <Text className="text-sm text-muted-foreground block mb-1">风格名称</Text>
                <Text className="text-lg font-bold text-primary block">{params.styleName}</Text>
              </View>
            )}

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

          {/* 闪光灯设置 */}
          {params.flashEnable && (
            <View
              className="bg-card rounded-2xl p-5 border border-border mb-4 animate-fade-in"
              style={{animationDelay: '0.25s'}}>
              <View className="flex flex-row items-center mb-4">
                <View className="i-mdi-flash text-xl text-red-500 mr-2" />
                <Text className="text-base font-semibold text-foreground">闪光灯设置</Text>
              </View>

              <View className="grid grid-cols-2 gap-4 mb-4">
                {params.flashMode && (
                  <View className="bg-secondary rounded-xl p-3">
                    <Text className="text-xs text-muted-foreground block mb-1">模式</Text>
                    <Text className="text-lg font-mono-param font-bold text-red-500 block">{params.flashMode}</Text>
                  </View>
                )}
                {params.flashPower && (
                  <View className="bg-secondary rounded-xl p-3">
                    <Text className="text-xs text-muted-foreground block mb-1">功率/补偿</Text>
                    <Text className="text-lg font-mono-param font-bold text-red-500 block">{params.flashPower}</Text>
                  </View>
                )}
                {params.flashZoom && (
                  <View className="bg-secondary rounded-xl p-3">
                    <Text className="text-xs text-muted-foreground block mb-1">焦距</Text>
                    <Text className="text-lg font-mono-param font-bold text-red-500 block">{params.flashZoom}</Text>
                  </View>
                )}
                {params.flashAngle && (
                  <View className="bg-secondary rounded-xl p-3">
                    <Text className="text-xs text-muted-foreground block mb-1">灯头角度</Text>
                    <Text className="text-lg font-mono-param font-bold text-red-500 block">{params.flashAngle}</Text>
                  </View>
                )}
              </View>

              {params.flashHssSync !== undefined && (
                <View className="flex flex-row items-center mb-3">
                  <View
                    className={`w-4 h-4 rounded mr-2 ${params.flashHssSync ? 'bg-red-500' : 'bg-muted-foreground/30'}`}
                  />
                  <Text className="text-sm text-foreground">高速同步 (HSS)</Text>
                </View>
              )}

              {params.flashDiffuserAdvice && (
                <View className="bg-secondary rounded-xl p-3">
                  <Text className="text-xs text-muted-foreground block mb-2">柔光建议</Text>
                  <Text className="text-sm text-foreground leading-relaxed block">{params.flashDiffuserAdvice}</Text>
                </View>
              )}
            </View>
          )}

          {/* 专家建议 */}
          <View
            className="bg-card rounded-2xl p-5 border border-border mb-4 animate-fade-in"
            style={{animationDelay: '0.3s'}}>
            <View className="flex flex-row items-center mb-3">
              <View className="i-mdi-lightbulb text-xl text-accent mr-2" />
              <Text className="text-base font-semibold text-foreground">专家建议</Text>
            </View>
            <Text className="text-sm text-foreground leading-relaxed block">{params.suggestion}</Text>
          </View>

          {/* 操作按钮 */}
          <View className="flex flex-col gap-3 animate-fade-in" style={{animationDelay: '0.35s'}}>
            <Button
              className="w-full bg-primary text-white py-4 rounded-xl break-keep text-base"
              size="default"
              onClick={handleNewAnalysis}>
              生成新参数
            </Button>
            <Button
              className="w-full bg-secondary text-foreground py-4 rounded-xl break-keep text-base"
              size="default"
              onClick={handleBack}>
              返回首页
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
