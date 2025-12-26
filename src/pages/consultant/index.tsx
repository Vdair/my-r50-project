import {Button, Input, ScrollView, Switch, Text, View} from '@tarojs/components'
import Taro, {showToast} from '@tarojs/taro'
import {useCallback} from 'react'
import {type LensType, type LightingType, type SceneType, type StyleType, useCameraStore} from '@/store/cameraStore'

export default function Consultant() {
  const {
    selectedLens,
    flashEnabled,
    scene,
    customScene,
    lighting,
    style,
    params,
    isGenerating,
    setLens,
    setFlash,
    setScene,
    setCustomScene,
    setLighting,
    setStyle,
    generateParams
  } = useCameraStore()

  const handleGenerate = useCallback(async () => {
    if (scene === 'custom' && !customScene.trim()) {
      showToast({title: '请输入场景描述', icon: 'none'})
      return
    }

    // 开始生成参数
    await generateParams()

    // 跳转到结果页面
    Taro.navigateTo({url: '/pages/result/index'})
  }, [scene, customScene, generateParams])

  const handleBack = () => {
    Taro.navigateBack()
  }

  return (
    <View className="min-h-screen bg-gradient-dark">
      <ScrollView scrollY className="h-screen scrollbar-hidden" style={{background: 'transparent'}}>
        <View className="px-4 py-6 pb-32">
          {/* 返回按钮和标题 */}
          <View className="mb-6">
            <View className="flex flex-row items-center mb-4">
              <View className="i-mdi-arrow-left text-2xl text-foreground mr-2" onClick={handleBack} />
              <Text className="text-2xl font-bold text-foreground">AI 场景助手</Text>
            </View>
            <Text className="text-sm text-muted-foreground block">为您的 Canon R50 生成最佳拍摄参数</Text>
          </View>

          {/* 镜头选择 */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-foreground block mb-3">镜头选择</Text>
            <View className="flex flex-row gap-3">
              {(['55mm', '18-150mm', '100-400mm'] as LensType[]).map((lens) => (
                <View
                  key={lens}
                  className={`flex-1 rounded-xl p-4 border-2 transition-all ${
                    selectedLens === lens ? 'bg-primary/10 border-primary' : 'bg-card border-border'
                  }`}
                  onClick={() => setLens(lens)}>
                  <View
                    className={`i-mdi-camera-iris text-2xl mb-2 ${selectedLens === lens ? 'text-primary' : 'text-muted-foreground'}`}
                  />
                  <Text
                    className={`text-sm font-medium block text-center ${selectedLens === lens ? 'text-primary' : 'text-foreground'}`}>
                    {lens === '55mm' ? '定焦' : lens === '18-150mm' ? '变焦' : '长焦'}
                  </Text>
                  <Text className="text-xs text-muted-foreground block text-center mt-1">{lens}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* 闪光灯开关 */}
          <View className="mb-6">
            <View className="flex flex-row items-center justify-between bg-card rounded-xl p-4 border border-border">
              <View className="flex flex-row items-center gap-3">
                <View className={`i-mdi-flash text-2xl ${flashEnabled ? 'text-accent' : 'text-muted-foreground'}`} />
                <View>
                  <Text className="text-base font-semibold text-foreground block">神牛 TT685II 闪光灯</Text>
                  <Text className="text-xs text-muted-foreground block mt-1">{flashEnabled ? '已启用' : '未启用'}</Text>
                </View>
              </View>
              <Switch checked={flashEnabled} onChange={(e) => setFlash(e.detail.value)} color="#F57C00" />
            </View>
          </View>

          {/* 场景描述 */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-foreground block mb-3">场景描述</Text>
            <View className="grid grid-cols-2 gap-3 mb-3">
              {[
                {value: 'portrait-night' as SceneType, label: '夜景人像', icon: 'i-mdi-account-circle'},
                {value: 'outdoor-sport' as SceneType, label: '户外运动', icon: 'i-mdi-run'},
                {value: 'indoor-still' as SceneType, label: '室内静物', icon: 'i-mdi-flower'},
                {value: 'custom' as SceneType, label: '自定义', icon: 'i-mdi-pencil'}
              ].map((item) => (
                <View
                  key={item.value}
                  className={`rounded-xl p-3 border-2 transition-all ${
                    scene === item.value ? 'bg-primary/10 border-primary' : 'bg-card border-border'
                  }`}
                  onClick={() => setScene(item.value)}>
                  <View
                    className={`${item.icon} text-xl mb-1 ${scene === item.value ? 'text-primary' : 'text-muted-foreground'}`}
                  />
                  <Text
                    className={`text-sm font-medium block ${scene === item.value ? 'text-primary' : 'text-foreground'}`}>
                    {item.label}
                  </Text>
                </View>
              ))}
            </View>
            {scene === 'custom' && (
              <View className="bg-input rounded-xl border border-border px-3 py-2">
                <Input
                  className="w-full text-foreground text-sm"
                  style={{padding: 0, border: 'none', background: 'transparent'}}
                  placeholder="请描述您的拍摄场景..."
                  placeholderClass="text-muted-foreground"
                  value={customScene}
                  onInput={(e) => setCustomScene(e.detail.value)}
                />
              </View>
            )}
          </View>

          {/* 光线环境 */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-foreground block mb-3">光线环境</Text>
            <View className="grid grid-cols-4 gap-2">
              {[
                {value: 'dawn' as LightingType, label: '清晨', icon: 'i-mdi-weather-sunset-up'},
                {value: 'noon' as LightingType, label: '正午', icon: 'i-mdi-white-balance-sunny'},
                {value: 'golden' as LightingType, label: '黄金时刻', icon: 'i-mdi-weather-sunset'},
                {value: 'night' as LightingType, label: '夜晚', icon: 'i-mdi-weather-night'}
              ].map((item) => (
                <View
                  key={item.value}
                  className={`rounded-lg p-3 border-2 transition-all ${
                    lighting === item.value ? 'bg-primary/10 border-primary' : 'bg-card border-border'
                  }`}
                  onClick={() => setLighting(item.value)}>
                  <View
                    className={`${item.icon} text-xl mb-1 ${lighting === item.value ? 'text-primary' : 'text-muted-foreground'}`}
                  />
                  <Text
                    className={`text-xs font-medium block text-center ${lighting === item.value ? 'text-primary' : 'text-foreground'}`}>
                    {item.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* 风格偏好 */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-foreground block mb-3">风格偏好</Text>
            <View className="flex flex-col gap-2">
              {[
                {value: 'japanese' as StyleType, label: '日系小清新', desc: '低对比度、柔和色调'},
                {value: 'film' as StyleType, label: '胶片复古', desc: '颗粒感、低饱和度'},
                {value: 'blackwhite' as StyleType, label: '高对比黑白', desc: '强烈明暗对比'}
              ].map((item) => (
                <View
                  key={item.value}
                  className={`rounded-xl p-4 border-2 transition-all ${
                    style === item.value ? 'bg-primary/10 border-primary' : 'bg-card border-border'
                  }`}
                  onClick={() => setStyle(item.value)}>
                  <Text
                    className={`text-sm font-medium block mb-1 ${style === item.value ? 'text-primary' : 'text-foreground'}`}>
                    {item.label}
                  </Text>
                  <Text className="text-xs text-muted-foreground block">{item.desc}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* 底部固定按钮 */}
        <View
          className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background to-transparent"
          style={{paddingBottom: '20px'}}>
          <Button
            className={`w-full text-white py-4 rounded-xl break-keep text-base font-semibold ${
              isGenerating ? 'bg-muted' : 'bg-gradient-primary'
            }`}
            size="default"
            onClick={isGenerating ? undefined : handleGenerate}>
            {isGenerating ? '正在分析光影...' : '生成最佳参数'}
          </Button>
        </View>
      </ScrollView>

      {/* 加载动画遮罩 */}
      {isGenerating && (
        <View className="fixed inset-0 bg-background/95 z-50 flex items-center justify-center">
          <View className="flex flex-col items-center gap-6">
            {/* 相机图标动画 */}
            <View className="relative">
              <View className="i-mdi-camera text-8xl text-primary animate-pulse" />
              <View className="absolute inset-0 i-mdi-camera text-8xl text-primary/30 animate-ping" />
            </View>

            {/* 进度文字 */}
            <View className="flex flex-col items-center gap-2">
              <Text className="text-xl font-semibold text-foreground animate-pulse">正在分析光影</Text>
              <Text className="text-sm text-muted-foreground">AI 正在为您生成最佳参数...</Text>
            </View>

            {/* 装饰性图标 */}
            <View className="flex flex-row items-center gap-4 mt-4">
              <View
                className="i-mdi-camera-iris text-2xl text-primary/50 animate-bounce"
                style={{animationDelay: '0s'}}
              />
              <View className="i-mdi-flash text-2xl text-accent/50 animate-bounce" style={{animationDelay: '0.2s'}} />
              <View
                className="i-mdi-white-balance-sunny text-2xl text-primary/50 animate-bounce"
                style={{animationDelay: '0.4s'}}
              />
              <View
                className="i-mdi-aperture text-2xl text-accent/50 animate-bounce"
                style={{animationDelay: '0.6s'}}
              />
            </View>
          </View>
        </View>
      )}
    </View>
  )
}
