import {ScrollView, Text, View} from '@tarojs/components'
import {useState} from 'react'

interface WikiItem {
  id: string
  title: string
  description: string
  icon: string
}

const canonR50Items: WikiItem[] = [
  {
    id: 'a-plus',
    title: 'A+ 场景智能',
    description: '相机自动识别场景类型（人像、风景、运动等）并优化参数设置。适合初学者快速拍摄，无需手动调整复杂参数。',
    icon: 'i-mdi-auto-fix'
  },
  {
    id: 'tv',
    title: 'Tv 快门优先',
    description: '手动设置快门速度，相机自动调整光圈以获得正确曝光。适合拍摄运动物体，控制动态模糊效果。',
    icon: 'i-mdi-timer'
  },
  {
    id: 'av',
    title: 'Av 光圈优先',
    description: '手动设置光圈大小，相机自动调整快门速度。适合控制景深效果，如人像虚化背景或风景全景清晰。',
    icon: 'i-mdi-camera-iris'
  },
  {
    id: 'servo',
    title: 'Servo 伺服对焦',
    description: '连续自动对焦模式，相机持续追踪移动主体并保持对焦。适合拍摄运动中的人物、动物或车辆。',
    icon: 'i-mdi-target'
  }
]

const godoxItems: WikiItem[] = [
  {
    id: 'ttl',
    title: 'TTL 自动测光',
    description: 'Through The Lens 测光，闪光灯自动根据相机测光结果调整输出功率。适合快速变化的场景，无需手动调整。',
    icon: 'i-mdi-flash-auto'
  },
  {
    id: 'm-mode',
    title: 'M 手动模式',
    description: '手动设置闪光灯输出功率（1/1 至 1/128）。适合需要精确控制光线强度的场景，如棚拍或多灯布光。',
    icon: 'i-mdi-flash'
  },
  {
    id: 'hss',
    title: 'HSS 高速同步',
    description: 'High Speed Sync 允许在高于相机同步速度（如 1/250s 以上）的快门下使用闪光灯。适合大光圈日光下补光。',
    icon: 'i-mdi-flash-outline'
  },
  {
    id: 'curtain',
    title: '前/后帘同步',
    description: '前帘：曝光开始时闪光；后帘：曝光结束前闪光。后帘同步可在运动轨迹后方产生光线，效果更自然。',
    icon: 'i-mdi-flash-red-eye'
  }
]

export default function Wiki() {
  const [expandedCanon, setExpandedCanon] = useState<string | null>(null)
  const [expandedGodox, setExpandedGodox] = useState<string | null>(null)

  const toggleCanon = (id: string) => {
    setExpandedCanon(expandedCanon === id ? null : id)
  }

  const toggleGodox = (id: string) => {
    setExpandedGodox(expandedGodox === id ? null : id)
  }

  return (
    <View className="min-h-screen bg-gradient-dark">
      <ScrollView scrollY className="h-screen" style={{background: 'transparent'}}>
        <View className="px-4 py-6 pb-24">
          {/* 标题 */}
          <View className="mb-6">
            <Text className="text-2xl font-bold text-foreground block mb-2">器材百科</Text>
            <Text className="text-sm text-muted-foreground block">了解您的 Canon R50 和 Godox TT685II</Text>
          </View>

          {/* Canon R50 部分 */}
          <View className="mb-6">
            <View className="flex flex-row items-center gap-2 mb-4">
              <View className="i-mdi-camera text-2xl text-primary" />
              <Text className="text-xl font-bold text-foreground block">Canon EOS R50</Text>
            </View>

            <View className="flex flex-col gap-3">
              {canonR50Items.map((item) => (
                <View key={item.id} className="bg-card rounded-xl border border-border overflow-hidden">
                  <View className="flex flex-row items-center justify-between p-4" onClick={() => toggleCanon(item.id)}>
                    <View className="flex flex-row items-center gap-3 flex-1">
                      <View className={`${item.icon} text-xl text-primary`} />
                      <Text className="text-base font-semibold text-foreground block">{item.title}</Text>
                    </View>
                    <View
                      className={`i-mdi-chevron-down text-xl text-muted-foreground transition-transform ${
                        expandedCanon === item.id ? 'rotate-180' : ''
                      }`}
                    />
                  </View>
                  {expandedCanon === item.id && (
                    <View className="px-4 pb-4 pt-0">
                      <View className="bg-secondary rounded-lg p-3">
                        <Text className="text-sm text-foreground block leading-relaxed">{item.description}</Text>
                      </View>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* Godox TT685II 部分 */}
          <View className="mb-6">
            <View className="flex flex-row items-center gap-2 mb-4">
              <View className="i-mdi-flash text-2xl text-accent" />
              <Text className="text-xl font-bold text-foreground block">Godox TT685II</Text>
            </View>

            <View className="flex flex-col gap-3">
              {godoxItems.map((item) => (
                <View key={item.id} className="bg-card rounded-xl border border-border overflow-hidden">
                  <View className="flex flex-row items-center justify-between p-4" onClick={() => toggleGodox(item.id)}>
                    <View className="flex flex-row items-center gap-3 flex-1">
                      <View className={`${item.icon} text-xl text-accent`} />
                      <Text className="text-base font-semibold text-foreground block">{item.title}</Text>
                    </View>
                    <View
                      className={`i-mdi-chevron-down text-xl text-muted-foreground transition-transform ${
                        expandedGodox === item.id ? 'rotate-180' : ''
                      }`}
                    />
                  </View>
                  {expandedGodox === item.id && (
                    <View className="px-4 pb-4 pt-0">
                      <View className="bg-secondary rounded-lg p-3 border-l-4 border-accent">
                        <Text className="text-sm text-foreground block leading-relaxed">{item.description}</Text>
                      </View>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* 底部提示 */}
          <View className="bg-card rounded-xl p-4 border border-border">
            <View className="flex flex-row items-start gap-3">
              <View className="i-mdi-information text-xl text-primary mt-0.5" />
              <View className="flex-1">
                <Text className="text-sm font-semibold text-foreground block mb-2">使用提示</Text>
                <Text className="text-xs text-muted-foreground block leading-relaxed">
                  点击任意项目可展开查看详细说明。建议结合 AI 参数咨询功能，根据实际拍摄场景灵活运用这些功能。
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
