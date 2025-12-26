import {Button, Input, ScrollView, Switch, Text, View} from '@tarojs/components'
import Taro, {showToast} from '@tarojs/taro'
import {useCallback} from 'react'
import {
  type LensType,
  type LightingType,
  type SceneType,
  type StyleType,
  useCameraStore,
  type WeatherType
} from '@/store/cameraStore'

// 场景选项配置
const sceneOptions: Array<{value: SceneType; label: string; icon: string}> = [
  {value: 'portrait-night', label: '夜景人像', icon: 'i-mdi-account-star'},
  {value: 'outdoor-sport', label: '户外运动', icon: 'i-mdi-run'},
  {value: 'indoor-still', label: '室内静物', icon: 'i-mdi-lamp'},
  {value: 'outdoor-landscape', label: '户外风景', icon: 'i-mdi-image-filter-hdr'},
  {value: 'custom', label: '自定义', icon: 'i-mdi-pencil'}
]

// 光线环境配置
const lightingOptions: Array<{value: LightingType; label: string; icon: string}> = [
  {value: 'dawn', label: '清晨', icon: 'i-mdi-weather-sunset-up'},
  {value: 'noon', label: '正午', icon: 'i-mdi-white-balance-sunny'},
  {value: 'golden', label: '黄金时刻', icon: 'i-mdi-weather-sunset'},
  {value: 'night', label: '夜晚', icon: 'i-mdi-weather-night'}
]

// 天气情况配置
const weatherOptions: Array<{value: WeatherType; label: string; icon: string}> = [
  {value: 'sunny', label: '晴天', icon: 'i-mdi-weather-sunny'},
  {value: 'cloudy', label: '多云', icon: 'i-mdi-weather-partly-cloudy'},
  {value: 'overcast', label: '阴天', icon: 'i-mdi-weather-cloudy'},
  {value: 'rainy', label: '雨天', icon: 'i-mdi-weather-rainy'},
  {value: 'foggy', label: '雾天', icon: 'i-mdi-weather-fog'}
]

// 风格偏好配置
const styleOptions: Array<{value: StyleType; label: string; desc: string}> = [
  {value: 'japanese', label: '日系小清新', desc: '柔和淡雅'},
  {value: 'film', label: '胶片复古', desc: '怀旧质感'},
  {value: 'blackwhite', label: '高对比黑白', desc: '经典永恒'},
  {value: 'hk', label: '港风', desc: '浓郁色调'},
  {value: 'minimal', label: '极简主义', desc: '简约纯粹'},
  {value: 'cyberpunk', label: '赛博朋克', desc: '未来科技'},
  {value: 'morandi', label: '莫兰迪色调', desc: '高级灰调'},
  {value: 'painting', label: '油画质感', desc: '艺术氛围'},
  {value: 'cinematic', label: '电影感', desc: '故事叙事'},
  {value: 'ins', label: 'INS风', desc: '时尚潮流'}
]

export default function Consultant() {
  const {
    selectedLens,
    flashEnabled,
    scene,
    customScene,
    lighting,
    weather,
    style,
    isGenerating,
    setLens,
    setFlash,
    setScene,
    setCustomScene,
    setLighting,
    setWeather,
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
          {/* 页面标题 */}
          <View className="flex flex-row items-center mb-6">
            <View className="i-mdi-arrow-left text-2xl text-foreground mr-2" onClick={handleBack} />
            <Text className="text-2xl font-bold text-foreground">AI 参数咨询师</Text>
          </View>

          {/* 镜头选择 */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-foreground block mb-3">镜头选择</Text>
            <View className="flex flex-row gap-3">
              {(['55mm', '18-150mm', '100-400mm'] as LensType[]).map((lens) => (
                <View
                  key={lens}
                  className={`flex-1 rounded-xl p-4 border-2 ${
                    selectedLens === lens ? 'bg-primary/10 border-primary' : 'bg-card border-border'
                  }`}
                  onClick={() => setLens(lens)}>
                  <View className="flex flex-col items-center gap-2">
                    <View
                      className={`i-mdi-camera-iris text-2xl ${selectedLens === lens ? 'text-primary' : 'text-muted-foreground'}`}
                    />
                    <Text
                      className={`text-sm font-medium ${selectedLens === lens ? 'text-primary' : 'text-foreground'}`}>
                      {lens}
                    </Text>
                  </View>
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
                  <Text className="text-base font-semibold text-foreground block">神牛 TT685II</Text>
                  <Text className="text-xs text-muted-foreground block">闪光灯控制</Text>
                </View>
              </View>
              <Switch checked={flashEnabled} onChange={(e) => setFlash(e.detail.value)} color="#F57C00" />
            </View>
          </View>

          {/* 场景描述 */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-foreground block mb-3">场景描述</Text>
            <ScrollView scrollX className="scrollbar-hidden" style={{whiteSpace: 'nowrap'}}>
              <View className="flex flex-row gap-3" style={{display: 'inline-flex'}}>
                {sceneOptions.map((option) => (
                  <View
                    key={option.value}
                    className={`rounded-xl p-4 border-2 ${
                      scene === option.value ? 'bg-primary/10 border-primary' : 'bg-card border-border'
                    }`}
                    style={{minWidth: '120px'}}
                    onClick={() => setScene(option.value)}>
                    <View className="flex flex-col items-center gap-2">
                      <View
                        className={`${option.icon} text-2xl ${scene === option.value ? 'text-primary' : 'text-muted-foreground'}`}
                      />
                      <Text
                        className={`text-sm font-medium ${scene === option.value ? 'text-primary' : 'text-foreground'} break-keep`}>
                        {option.label}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>

            {/* 自定义场景输入 */}
            {scene === 'custom' && (
              <View className="mt-3 bg-input rounded-xl border border-border px-4 py-3">
                <Input
                  className="w-full text-foreground text-sm"
                  placeholder="请描述拍摄场景，如：咖啡厅人像、城市夜景等"
                  placeholderClass="text-muted-foreground"
                  value={customScene}
                  onInput={(e) => setCustomScene(e.detail.value)}
                  style={{padding: 0, border: 'none', background: 'transparent'}}
                />
              </View>
            )}
          </View>

          {/* 光线环境 */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-foreground block mb-3">光线环境</Text>
            <ScrollView scrollX className="scrollbar-hidden" style={{whiteSpace: 'nowrap'}}>
              <View className="flex flex-row gap-3" style={{display: 'inline-flex'}}>
                {lightingOptions.map((option) => (
                  <View
                    key={option.value}
                    className={`rounded-xl p-4 border-2 ${
                      lighting === option.value ? 'bg-primary/10 border-primary' : 'bg-card border-border'
                    }`}
                    style={{minWidth: '100px'}}
                    onClick={() => setLighting(option.value)}>
                    <View className="flex flex-col items-center gap-2">
                      <View
                        className={`${option.icon} text-2xl ${lighting === option.value ? 'text-primary' : 'text-muted-foreground'}`}
                      />
                      <Text
                        className={`text-sm font-medium ${lighting === option.value ? 'text-primary' : 'text-foreground'} break-keep`}>
                        {option.label}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* 天气情况 */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-foreground block mb-3">天气情况</Text>
            <ScrollView scrollX className="scrollbar-hidden" style={{whiteSpace: 'nowrap'}}>
              <View className="flex flex-row gap-3" style={{display: 'inline-flex'}}>
                {weatherOptions.map((option) => (
                  <View
                    key={option.value}
                    className={`rounded-xl p-4 border-2 ${
                      weather === option.value ? 'bg-primary/10 border-primary' : 'bg-card border-border'
                    }`}
                    style={{minWidth: '100px'}}
                    onClick={() => setWeather(option.value)}>
                    <View className="flex flex-col items-center gap-2">
                      <View
                        className={`${option.icon} text-2xl ${weather === option.value ? 'text-primary' : 'text-muted-foreground'}`}
                      />
                      <Text
                        className={`text-sm font-medium ${weather === option.value ? 'text-primary' : 'text-foreground'} break-keep`}>
                        {option.label}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* 风格偏好 */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-foreground block mb-3">风格偏好</Text>
            <ScrollView scrollX className="scrollbar-hidden" style={{whiteSpace: 'nowrap'}}>
              <View className="flex flex-row gap-3" style={{display: 'inline-flex'}}>
                {styleOptions.map((option) => (
                  <View
                    key={option.value}
                    className={`rounded-xl p-4 border-2 ${
                      style === option.value ? 'bg-primary/10 border-primary' : 'bg-card border-border'
                    }`}
                    style={{minWidth: '130px'}}
                    onClick={() => setStyle(option.value)}>
                    <View className="flex flex-col gap-2">
                      <Text
                        className={`text-sm font-semibold ${style === option.value ? 'text-primary' : 'text-foreground'} break-keep`}>
                        {option.label}
                      </Text>
                      <Text
                        className={`text-xs ${style === option.value ? 'text-primary/70' : 'text-muted-foreground'} break-keep`}>
                        {option.desc}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
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
