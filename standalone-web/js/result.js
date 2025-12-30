// 结果页面逻辑

document.addEventListener('DOMContentLoaded', () => {
  console.log('📄 结果页面加载')
  loadResult()
})

// 加载结果
function loadResult() {
  try {
    // 从 localStorage 获取结果
    const resultJson = localStorage.getItem('current_result')
    
    if (!resultJson) {
      console.error('❌ 未找到结果数据')
      showError('未找到结果数据，请重新生成参数')
      return
    }

    const result = JSON.parse(resultJson)
    console.log('✅ 加载结果:', result)

    // 显示结果
    displayResult(result)
    
  } catch (error) {
    console.error('❌ 加载结果失败:', error)
    showError('加载结果失败: ' + error.message)
  }
}

// 显示结果
function displayResult(result) {
  // 隐藏加载动画
  document.getElementById('loading')?.classList.add('hidden')
  
  // 显示结果容器
  document.getElementById('result')?.classList.remove('hidden')

  // 场景分析
  if (result.sceneAnalysis) {
    document.getElementById('sceneSummary').textContent = result.sceneAnalysis.summary || '-'
    
    const difficultyEl = document.getElementById('difficultyLevel')
    const difficulty = result.sceneAnalysis.difficultyLevel || '中等'
    difficultyEl.textContent = difficulty
    
    // 设置难度颜色
    difficultyEl.classList.remove('difficulty-easy', 'difficulty-medium', 'difficulty-hard')
    if (difficulty.includes('简单') || difficulty.includes('容易')) {
      difficultyEl.classList.add('difficulty-easy')
    } else if (difficulty.includes('困难') || difficulty.includes('挑战')) {
      difficultyEl.classList.add('difficulty-hard')
    } else {
      difficultyEl.classList.add('difficulty-medium')
    }
  } else {
    document.getElementById('sceneAnalysisSection')?.classList.add('hidden')
  }

  // 镜头推荐
  if (result.lensRecommendation) {
    document.getElementById('lensRecommendation').textContent = result.lensRecommendation.focalLength || '-'
    document.getElementById('lensReason').textContent = result.lensRecommendation.reason || '-'
  } else {
    document.getElementById('lensRecommendationSection')?.classList.add('hidden')
  }

  // 相机设置
  document.getElementById('shootingMode').textContent = result.shootingMode || '-'
  document.getElementById('iso').textContent = result.iso || '-'
  document.getElementById('aperture').textContent = result.aperture || '-'
  document.getElementById('shutterSpeed').textContent = result.shutterSpeed || '-'
  document.getElementById('exposureCompensation').textContent = result.exposureCompensation || '0'
  document.getElementById('whiteBalance').textContent = result.whiteBalance || '-'

  // 照片风格
  document.getElementById('styleName').textContent = result.styleName || '-'
  document.getElementById('sharpness').textContent = result.sharpness ?? '-'
  document.getElementById('contrast').textContent = formatValue(result.contrast)
  document.getElementById('saturation').textContent = formatValue(result.saturation)
  document.getElementById('tone').textContent = formatValue(result.tone)

  // 闪光灯设置
  if (result.flashEnable) {
    document.getElementById('flashSection')?.classList.remove('hidden')
    document.getElementById('flashMode').textContent = result.flashMode || '-'
    document.getElementById('flashPower').textContent = result.flashPower || '-'
    document.getElementById('flashZoom').textContent = result.flashZoom || '-'
    document.getElementById('flashAngle').textContent = result.flashAngle || '-'
    document.getElementById('flashHss').textContent = result.flashHssSync ? '开启' : '关闭'
    document.getElementById('flashDiffuser').textContent = result.flashDiffuserAdvice || '-'
  }

  // 专家建议
  document.getElementById('suggestion').textContent = result.suggestion || '-'

  // 添加动画效果
  animateValues()
}

// 格式化数值（带符号）
function formatValue(value) {
  if (value === undefined || value === null) return '-'
  const num = Number(value)
  if (isNaN(num)) return value
  return num > 0 ? `+${num}` : String(num)
}

// 数字滚动动画
function animateValues() {
  const elements = document.querySelectorAll('.param-value')
  
  elements.forEach((el, index) => {
    // 延迟动画
    setTimeout(() => {
      el.style.opacity = '0'
      el.style.transform = 'translateY(20px)'
      
      setTimeout(() => {
        el.style.transition = 'all 0.5s ease-out'
        el.style.opacity = '1'
        el.style.transform = 'translateY(0)'
      }, 50)
    }, index * 100)
  })
}

// 显示错误
function showError(message) {
  document.getElementById('loading')?.classList.add('hidden')
  
  const resultDiv = document.getElementById('result')
  resultDiv?.classList.remove('hidden')
  resultDiv.innerHTML = `
    <div class="bg-red-900 border border-red-700 rounded-lg p-6 text-center">
      <i class="mdi mdi-alert-circle text-6xl text-red-400 mb-4"></i>
      <h2 class="text-2xl font-bold mb-2">加载失败</h2>
      <p class="text-red-200 mb-6">${message}</p>
      <button onclick="window.location.href='index.html'" class="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-all">
        <i class="mdi mdi-home mr-2"></i>
        返回首页
      </button>
    </div>
  `
}
