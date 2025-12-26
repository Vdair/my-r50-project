const pages = ['pages/home/index', 'pages/wiki/index']

//  To fully leverage TypeScript's type safety and ensure its correctness, always enclose the configuration object within the global defineAppConfig helper function.
export default defineAppConfig({
  pages,
  tabBar: {
    color: '#9CA3AF',
    selectedColor: '#D32F2F',
    backgroundColor: '#0f0f0f',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/home/index',
        text: 'AI 咨询'
      },
      {
        pagePath: 'pages/wiki/index',
        text: '器材百科'
      }
    ]
  },
  window: {
    backgroundTextStyle: 'dark',
    navigationBarBackgroundColor: '#0f0f0f',
    navigationBarTitleText: 'R50 光影私教',
    navigationBarTextStyle: 'white'
  }
})
