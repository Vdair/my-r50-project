import {create} from 'zustand'
import {generateMockParams, generateParamsWithAI} from '@/services/difyApi'

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
      // 首先尝试使用 Dify AI 生成参数
      console.log('尝试使用 Dify AI 生成参数...')
      const aiParams = await generateParamsWithAI(
        state.selectedLens,
        state.flashEnabled,
        state.scene,
        state.customScene,
        state.lighting,
        state.weather,
        state.style
      )

      if (aiParams) {
        // AI 生成成功
        console.log('AI 参数生成成功')
        set({params: aiParams, isGenerating: false})
        return
      }

      // AI 生成失败，使用 Mock 数据作为降级方案
      console.log('AI 生成失败，使用 Mock 数据')
      const mockParams = generateMockParams(
        state.selectedLens,
        state.flashEnabled,
        state.scene,
        state.lighting,
        state.weather,
        state.style
      )

      set({params: mockParams, isGenerating: false})
    } catch (error) {
      console.error('参数生成失败:', error)

      // 发生错误，使用 Mock 数据
      const mockParams = generateMockParams(
        state.selectedLens,
        state.flashEnabled,
        state.scene,
        state.lighting,
        state.weather,
        state.style
      )

      set({params: mockParams, isGenerating: false})
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
