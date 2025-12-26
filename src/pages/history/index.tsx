import {ScrollView, Text, View} from '@tarojs/components'
import Taro, {showModal, showToast} from '@tarojs/taro'
import {type HistoryItem, useCameraStore} from '@/store/cameraStore'

// 格式化时间
const formatTime = (timestamp: number) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  // 小于1分钟
  if (diff < 60000) {
    return '刚刚'
  }
  // 小于1小时
  if (diff < 3600000) {
    return `${Math.floor(diff / 60000)}分钟前`
  }
  // 小于1天
  if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)}小时前`
  }
  // 小于7天
  if (diff < 604800000) {
    return `${Math.floor(diff / 86400000)}天前`
  }

  // 超过7天显示具体日期
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day} ${hour}:${minute}`
}

// 获取场景名称
const getSceneName = (scene: string, customScene?: string) => {
  const sceneMap = {
    'portrait-night': '夜景人像',
    'outdoor-sport': '户外运动',
    'indoor-still': '室内静物',
    custom: customScene || '自定义'
  }
  return sceneMap[scene] || scene
}

// 获取光线名称
const getLightingName = (lighting: string) => {
  const lightingMap = {
    dawn: '清晨',
    noon: '正午',
    golden: '黄金时刻',
    night: '夜晚'
  }
  return lightingMap[lighting] || lighting
}

// 获取风格名称
const getStyleName = (style: string) => {
  const styleMap = {
    japanese: '日系小清新',
    film: '胶片复古',
    blackwhite: '高对比黑白'
  }
  return styleMap[style] || style
}

export default function History() {
  const {history, deleteHistoryItem, clearHistory} = useCameraStore()

  const handleBack = () => {
    Taro.navigateBack()
  }

  const handleDelete = (id: string) => {
    showModal({
      title: '确认删除',
      content: '确定要删除这条记录吗？',
      success: (res) => {
        if (res.confirm) {
          deleteHistoryItem(id)
          showToast({title: '已删除', icon: 'success'})
        }
      }
    })
  }

  const handleClearAll = () => {
    if (history.length === 0) {
      showToast({title: '暂无记录', icon: 'none'})
      return
    }

    showModal({
      title: '确认清空',
      content: '确定要清空所有历史记录吗？此操作不可恢复。',
      success: (res) => {
        if (res.confirm) {
          clearHistory()
          showToast({title: '已清空', icon: 'success'})
        }
      }
    })
  }

  const _handleViewDetail = (_item: HistoryItem) => {
    // 可以跳转到详情页或展开显示
    showToast({title: '查看详情', icon: 'none'})
  }

  return (
    <View className="min-h-screen bg-gradient-dark">
      <ScrollView scrollY className="h-screen scrollbar-hidden" style={{background: 'transparent'}}>
        <View className="px-4 py-6 pb-24">
          {/* 标题区域 */}
          <View className="mb-6">
            <View className="flex flex-row items-center justify-between mb-4">
              <View className="flex flex-row items-center">
                <View className="i-mdi-arrow-left text-2xl text-foreground mr-2" onClick={handleBack} />
                <Text className="text-2xl font-bold text-foreground">历史记录</Text>
              </View>
              {history.length > 0 && (
                <View
                  className="flex flex-row items-center gap-1 px-3 py-1 bg-destructive/10 rounded-lg"
                  onClick={handleClearAll}>
                  <View className="i-mdi-delete text-base text-destructive" />
                  <Text className="text-sm text-destructive">清空</Text>
                </View>
              )}
            </View>
            <Text className="text-sm text-muted-foreground block">共 {history.length} 条记录</Text>
          </View>

          {/* 历史记录列表 */}
          {history.length === 0 ? (
            <View className="flex flex-col items-center justify-center py-20">
              <View className="i-mdi-history text-6xl text-muted-foreground mb-4 opacity-30" />
              <Text className="text-base text-muted-foreground block mb-2">暂无历史记录</Text>
              <Text className="text-sm text-muted-foreground block">生成参数后会自动保存到这里</Text>
            </View>
          ) : (
            <View className="flex flex-col gap-3">
              {history.map((item, index) => (
                <View
                  key={item.id}
                  className="bg-card rounded-2xl p-4 border border-border animate-fade-in"
                  style={{animationDelay: `${index * 0.05}s`}}>
                  {/* 头部信息 */}
                  <View className="flex flex-row items-center justify-between mb-3">
                    <View className="flex flex-row items-center gap-2">
                      <View className="i-mdi-camera text-lg text-primary" />
                      <Text className="text-sm text-muted-foreground">{formatTime(item.timestamp)}</Text>
                    </View>
                    <View className="i-mdi-delete text-lg text-destructive" onClick={() => handleDelete(item.id)} />
                  </View>

                  {/* 输入参数标签 */}
                  <View className="flex flex-row flex-wrap gap-2 mb-3">
                    <View className="bg-secondary rounded-lg px-3 py-1 flex flex-row items-center gap-1">
                      <View className="i-mdi-camera-iris text-xs text-primary" />
                      <Text className="text-xs text-foreground">{item.lens}</Text>
                    </View>
                    <View className="bg-secondary rounded-lg px-3 py-1 flex flex-row items-center gap-1">
                      <View
                        className={`i-mdi-${item.flash ? 'flash' : 'flash-off'} text-xs ${item.flash ? 'text-accent' : 'text-muted-foreground'}`}
                      />
                      <Text className="text-xs text-foreground">{item.flash ? '闪光灯' : '无闪光'}</Text>
                    </View>
                    <View className="bg-secondary rounded-lg px-3 py-1">
                      <Text className="text-xs text-foreground">{getSceneName(item.scene, item.customScene)}</Text>
                    </View>
                    <View className="bg-secondary rounded-lg px-3 py-1">
                      <Text className="text-xs text-foreground">{getLightingName(item.lighting)}</Text>
                    </View>
                    <View className="bg-secondary rounded-lg px-3 py-1">
                      <Text className="text-xs text-foreground">{getStyleName(item.style)}</Text>
                    </View>
                  </View>

                  {/* 参数结果预览 */}
                  <View className="bg-secondary rounded-xl p-3">
                    <View className="grid grid-cols-4 gap-2 mb-2">
                      <View className="text-center">
                        <Text className="text-xs text-muted-foreground block mb-1">ISO</Text>
                        <Text className="text-base font-mono-param font-bold text-primary block">
                          {item.params.iso}
                        </Text>
                      </View>
                      <View className="text-center">
                        <Text className="text-xs text-muted-foreground block mb-1">光圈</Text>
                        <Text className="text-base font-mono-param font-bold text-primary block">
                          {item.params.aperture}
                        </Text>
                      </View>
                      <View className="text-center">
                        <Text className="text-xs text-muted-foreground block mb-1">快门</Text>
                        <Text className="text-base font-mono-param font-bold text-primary block">
                          {item.params.shutterSpeed}
                        </Text>
                      </View>
                      <View className="text-center">
                        <Text className="text-xs text-muted-foreground block mb-1">白平衡</Text>
                        <Text className="text-base font-mono-param font-bold text-primary block">
                          {item.params.whiteBalance}
                        </Text>
                      </View>
                    </View>

                    {/* 操作建议预览 */}
                    <View className="flex flex-row items-start gap-2 pt-2 border-t border-border">
                      <View className="i-mdi-lightbulb-on text-sm text-primary mt-0.5 flex-shrink-0" />
                      <Text className="text-xs text-muted-foreground flex-1 leading-relaxed line-clamp-2">
                        {item.params.suggestion}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}
