import Taro from '@tarojs/taro'
import {create} from 'zustand'
// import {generateParamsWithAI} from '@/services/difyApi' // 已移除 Dify API 调用

// 镜头类型
export type LensType = '55mm' | '18-150mm' | '100-400mm'

// 光线环境
export type LightingType = 'dawn' | 'noon' | 'golden' | 'night'

// 天气情况
export type WeatherType = 'sunny' | 'cloudy' | 'overcast' | 'rainy' | 'foggy'

// 风格偏好
export type StyleType =
  | 'japanese'
  | 'film'
  | 'blackwhite'
  | 'hk'
  | 'minimal'
  | 'cyberpunk'
  | 'morandi'
  | 'painting'
  | 'cinematic'
  | 'ins'

// 场景类型
export type SceneType = 'portrait-night' | 'outdoor-sport' | 'indoor-still' | 'outdoor-landscape' | 'custom'

// 参数结果
export interface CameraParams {
  iso: number
  aperture: string
  shutterSpeed: string
  whiteBalance: string
  sharpness: number
  contrast: number
  saturation: number
  tone: number
  flashMode?: string
  flashPower?: string
  flashAngle?: number
  suggestion: string
}

// 历史记录项
export interface HistoryItem {
  id: string
  timestamp: number
  // 输入参数
  lens: LensType
  flash: boolean
  scene: SceneType
  customScene?: string
  lighting: LightingType
  weather: WeatherType
  style: StyleType
  // 生成的参数
  params: CameraParams
}

interface CameraStore {
  // 输入参数
  selectedLens: LensType
  flashEnabled: boolean
  scene: SceneType
  customScene: string
  lighting: LightingType
  weather: WeatherType
  style: StyleType

  // 结果
  params: CameraParams | null
  isGenerating: boolean

  // 历史记录
  history: HistoryItem[]

  // Actions
  setLens: (lens: LensType) => void
  setFlash: (enabled: boolean) => void
  setScene: (scene: SceneType) => void
  setCustomScene: (scene: string) => void
  setLighting: (lighting: LightingType) => void
  setWeather: (weather: WeatherType) => void
  setStyle: (style: StyleType) => void
  generateParams: () => Promise<void>
  addToHistory: (item: HistoryItem) => void
  deleteHistoryItem: (id: string) => void
  clearHistory: () => void
}

export const useCameraStore = create<CameraStore>((set, get) => ({
  // 初始状态
  selectedLens: '55mm',
  flashEnabled: false,
  scene: 'portrait-night',
  customScene: '',
  lighting: 'golden',
  weather: 'sunny',
  style: 'japanese',
  params: null,
  isGenerating: false,
  history: [],

  // Actions
  setLens: (lens) => set({selectedLens: lens}),
  setFlash: (enabled) => set({flashEnabled: enabled}),
  setScene: (scene) => set({scene}),
  setCustomScene: (scene) => set({customScene: scene}),
  setLighting: (lighting) => set({lighting}),
  setWeather: (weather) => set({weather}),
  setStyle: (style) => set({style}),

  generateParams: async () => {
    set({isGenerating: true})

    const state = get()

    try {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('🚀 开始生成参数')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('📋 当前参数:')
      console.log('  - 镜头:', state.selectedLens)
      console.log('  - 闪光灯:', state.flashEnabled ? '开启' : '关闭')
      console.log('  - 场景:', state.scene)
      console.log('  - 自定义场景:', state.customScene || '无')
      console.log('  - 光线:', state.lighting)
      console.log('  - 天气:', state.weather)
      console.log('  - 风格:', state.style)
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

      // TODO: 替换为新的 API 调用逻辑
      // 临时使用 mock 数据
      await new Promise((resolve) => setTimeout(resolve, 1500)) // 模拟 API 延迟

      const mockParams: CameraParams = {
        iso: 1600,
        aperture: 'f/2.8',
        shutterSpeed: '1/125',
        whiteBalance: '5200K',
        sharpness: 4,
        contrast: 0,
        saturation: -1,
        tone: 0,
        flashMode: state.flashEnabled ? 'TTL' : undefined,
        flashPower: state.flashEnabled ? '1/16' : undefined,
        flashAngle: state.flashEnabled ? 45 : undefined,
        suggestion: '使用适中的 ISO 和光圈，保持快门速度避免抖动。建议使用 M 档手动模式。'
      }

      // 成功生成参数
      set({params: mockParams, isGenerating: false})

      // 显示成功提示
      Taro.showToast({
        title: '参数生成成功',
        icon: 'success',
        duration: 2000
      })
    } catch (error: any) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.error('❌ 参数生成失败')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.error('❌ 错误信息:', error.message)
      console.error('❌ 错误堆栈:', error.stack)
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

      // 重置生成状态
      set({isGenerating: false})

      // 显示详细错误信息
      Taro.showModal({
        title: '参数生成失败',
        content: `错误信息：${error.message}\n\n请检查网络连接是否正常`,
        showCancel: false,
        confirmText: '我知道了'
      })

      // 重新抛出错误，便于外部监控
      throw error
    }
  },

  addToHistory: (item) =>
    set((state) => ({
      history: [item, ...state.history]
    })),

  deleteHistoryItem: (id) =>
    set((state) => ({
      history: state.history.filter((item) => item.id !== id)
    })),

  clearHistory: () => set({history: []})
}))
