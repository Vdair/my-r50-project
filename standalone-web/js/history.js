// 历史记录页面逻辑

const STORAGE_KEY = 'r50_history'

document.addEventListener('DOMContentLoaded', () => {
  console.log('📜 历史记录页面加载')
  loadHistory()
  attachEventListeners()
})

// 绑定事件监听器
function attachEventListeners() {
  // 清空所有记录
  document.getElementById('clearAllBtn')?.addEventListener('click', () => {
    if (confirm('确定要清空所有历史记录吗？此操作不可恢复。')) {
      localStorage.removeItem(STORAGE_KEY)
      loadHistory()
    }
  })
}

// 加载历史记录
function loadHistory() {
  try {
    const historyJson = localStorage.getItem(STORAGE_KEY)
    const history = historyJson ? JSON.parse(historyJson) : []
    
    console.log('📚 历史记录数量:', history.length)
    
    if (history.length === 0) {
      showEmptyState()
    } else {
      displayHistory(history)
    }
    
  } catch (error) {
    console.error('❌ 加载历史记录失败:', error)
    showEmptyState()
  }
}

// 显示空状态
function showEmptyState() {
  document.getElementById('emptyState')?.classList.remove('hidden')
  document.getElementById('historyList').innerHTML = ''
}

// 显示历史记录
function displayHistory(history) {
  document.getElementById('emptyState')?.classList.add('hidden')
  
  const listEl = document.getElementById('historyList')
  if (!listEl) return
  
  listEl.innerHTML = history.map((item, index) => {
    const date = new Date(item.timestamp)
    const dateStr = formatDate(date)
    const timeStr = formatTime(date)
    
    return `
      <div class="bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
        <!-- 头部 -->
        <div class="bg-gradient-to-r from-gray-700 to-gray-600 p-4 flex items-center justify-between">
          <div class="flex-1">
            <div class="text-sm text-gray-300">${dateStr}</div>
            <div class="text-xs text-gray-400">${timeStr}</div>
          </div>
          <div class="flex gap-2">
            <button onclick="viewHistory(${index})" class="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition-all">
              <i class="mdi mdi-eye mr-1"></i>
              查看
            </button>
            <button onclick="deleteHistory(${index})" class="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded text-sm transition-all">
              <i class="mdi mdi-delete"></i>
            </button>
          </div>
        </div>
        
        <!-- 内容预览 -->
        <div class="p-4">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div>
              <div class="text-gray-400 text-xs mb-1">镜头</div>
              <div class="font-bold">${item.input?.lens || '-'}</div>
            </div>
            <div>
              <div class="text-gray-400 text-xs mb-1">场景</div>
              <div class="font-bold">${getSceneName(item.input)}</div>
            </div>
            <div>
              <div class="text-gray-400 text-xs mb-1">ISO</div>
              <div class="font-bold text-red-400">${item.iso || '-'}</div>
            </div>
            <div>
              <div class="text-gray-400 text-xs mb-1">光圈</div>
              <div class="font-bold text-red-400">${item.aperture || '-'}</div>
            </div>
          </div>
          
          ${item.input?.flash ? `
            <div class="mt-3 flex items-center text-orange-400 text-sm">
              <i class="mdi mdi-flash mr-1"></i>
              使用闪光灯
            </div>
          ` : ''}
        </div>
      </div>
    `
  }).join('')
}

// 查看历史记录
function viewHistory(index) {
  try {
    const historyJson = localStorage.getItem(STORAGE_KEY)
    const history = historyJson ? JSON.parse(historyJson) : []
    
    if (index >= 0 && index < history.length) {
      const item = history[index]
      localStorage.setItem('current_result', JSON.stringify(item))
      window.location.href = 'result.html'
    }
    
  } catch (error) {
    console.error('❌ 查看历史记录失败:', error)
    alert('查看失败: ' + error.message)
  }
}

// 删除历史记录
function deleteHistory(index) {
  if (!confirm('确定要删除这条记录吗？')) return
  
  try {
    const historyJson = localStorage.getItem(STORAGE_KEY)
    const history = historyJson ? JSON.parse(historyJson) : []
    
    if (index >= 0 && index < history.length) {
      history.splice(index, 1)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
      loadHistory()
    }
    
  } catch (error) {
    console.error('❌ 删除历史记录失败:', error)
    alert('删除失败: ' + error.message)
  }
}

// 获取场景名称
function getSceneName(input) {
  if (!input) return '-'
  
  const sceneMap = {
    'portrait': '人像',
    'landscape': '风景',
    'night_portrait': '夜景人像',
    'indoor': '室内静物',
    'sports': '运动抓拍',
    'food': '美食'
  }
  
  return input.customScene || sceneMap[input.scene] || input.scene || '-'
}

// 格式化日期
function formatDate(date) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
  const itemDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  
  if (itemDate.getTime() === today.getTime()) {
    return '今天'
  } else if (itemDate.getTime() === yesterday.getTime()) {
    return '昨天'
  } else {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
}

// 格式化时间
function formatTime(date) {
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

// 暴露全局函数
window.viewHistory = viewHistory
window.deleteHistory = deleteHistory
