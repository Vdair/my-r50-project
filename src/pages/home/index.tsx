import {Button, Input, ScrollView, Switch, Text, View} from '@tarojs/components'
import {showToast} from '@tarojs/taro'
import {useCallback} from 'react'
import {type LensType, type LightingType, type SceneType, type StyleType, useCameraStore} from '@/store/cameraStore'

export default function Home() {
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
    await generateParams()
    showToast({title: '参数生成成功', icon: 'success'})
  }, [scene, customScene, generateParams])

  return (
    <View className="min-h-screen bg-gradient-dark">
      <ScrollView scrollY className="h-screen" style={{background: 'transparent'}}>
        <View className="px-4 py-6 pb-32">
          {/* 标题 */}
          <View className="mb-6">
            <Text className="text-2xl font-bold text-foreground block mb-2">AI 参数咨询师</Text>
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

          {/* 参数结果展示 */}
          {params && !isGenerating && (
            <View className="mb-6">
              <Text className="text-base font-semibold text-foreground block mb-3">参数建议</Text>

              {/* 主要参数仪表盘 */}
              <View className="bg-card rounded-xl p-4 border border-border mb-3">
                <View className="grid grid-cols-2 gap-4">
                  <View>
                    <Text className="text-xs text-muted-foreground block mb-1">ISO</Text>
                    <Text className="text-2xl font-mono-param font-bold text-primary block">{params.iso}</Text>
                  </View>
                  <View>
                    <Text className="text-xs text-muted-foreground block mb-1">光圈</Text>
                    <Text className="text-2xl font-mono-param font-bold text-primary block">{params.aperture}</Text>
                  </View>
                  <View>
                    <Text className="text-xs text-muted-foreground block mb-1">快门速度</Text>
                    <Text className="text-2xl font-mono-param font-bold text-primary block">{params.shutterSpeed}</Text>
                  </View>
                  <View>
                    <Text className="text-xs text-muted-foreground block mb-1">白平衡</Text>
                    <Text className="text-2xl font-mono-param font-bold text-primary block">{params.whiteBalance}</Text>
                  </View>
                </View>

                <View className="h-px bg-border my-4" />

                <View className="grid grid-cols-4 gap-3">
                  <View>
                    <Text className="text-xs text-muted-foreground block mb-1">锐度</Text>
                    <Text className="text-lg font-mono-param font-semibold text-foreground block">
                      {params.sharpness}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-xs text-muted-foreground block mb-1">反差</Text>
                    <Text className="text-lg font-mono-param font-semibold text-foreground block">
                      {params.contrast > 0 ? '+' : ''}
                      {params.contrast}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-xs text-muted-foreground block mb-1">饱和度</Text>
                    <Text className="text-lg font-mono-param font-semibold text-foreground block">
                      {params.saturation > 0 ? '+' : ''}
                      {params.saturation}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-xs text-muted-foreground block mb-1">色调</Text>
                    <Text className="text-lg font-mono-param font-semibold text-foreground block">
                      {params.tone > 0 ? '+' : ''}
                      {params.tone}
                    </Text>
                  </View>
                </View>
              </View>

              {/* 闪光灯参数卡片 */}
              {flashEnabled && params.flashMode && (
                <View className="bg-gradient-accent rounded-xl p-4 mb-3">
                  <View className="flex flex-row items-center gap-2 mb-3">
                    <View className="i-mdi-flash text-xl text-accent-foreground" />
                    <Text className="text-base font-semibold text-accent-foreground block">闪光灯参数</Text>
                  </View>
                  <View className="grid grid-cols-3 gap-4">
                    <View>
                      <Text className="text-xs text-accent-foreground/70 block mb-1">模式</Text>
                      <Text className="text-lg font-mono-param font-bold text-accent-foreground block">
                        {params.flashMode}
                      </Text>
                    </View>
                    <View>
                      <Text className="text-xs text-accent-foreground/70 block mb-1">功率</Text>
                      <Text className="text-lg font-mono-param font-bold text-accent-foreground block">
                        {params.flashPower}
                      </Text>
                    </View>
                    <View>
                      <Text className="text-xs text-accent-foreground/70 block mb-1">灯头角度</Text>
                      <Text className="text-lg font-mono-param font-bold text-accent-foreground block">
                        {params.flashAngle}°
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {/* 操作建议 */}
              <View className="bg-secondary rounded-xl p-4 border border-border">
                <View className="flex flex-row items-start gap-2">
                  <View className="i-mdi-lightbulb-on text-lg text-primary mt-0.5" />
                  <View className="flex-1">
                    <Text className="text-xs text-muted-foreground block mb-1">操作建议</Text>
                    <Text className="text-sm text-foreground block leading-relaxed">{params.suggestion}</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* 底部固定按钮 */}
        <View
          className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background to-transparent"
          style={{paddingBottom: '80px'}}>
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
    </View>
  )
}
