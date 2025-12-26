const pages = ['pages/welcome/index', 'pages/consultant/index', 'pages/wiki/index']

//  To fully leverage TypeScript's type safety and ensure its correctness, always enclose the configuration object within the global defineAppConfig helper function.
export default defineAppConfig({
  pages,
  window: {
    backgroundTextStyle: 'dark',
    navigationBarBackgroundColor: '#0f0f0f',
    navigationBarTitleText: 'R50 光影私教',
    navigationBarTextStyle: 'white'
  }
})
