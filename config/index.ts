import path from 'node:path'
import {defineConfig, type UserConfigExport} from '@tarojs/cli'
import {miaodaDevPlugin} from 'miaoda-sc-plugin'
import tailwindcss from 'tailwindcss'
import type {Plugin} from 'vite'
import {UnifiedViteWeappTailwindcssPlugin as uvtw} from 'weapp-tailwindcss/vite'

import devConfig from './dev'
import lintConfig from './lint'
import prodConfig from './prod'

const base = String(process.argv[process.argv.length - 1])
const publicPath = /^http/.test(base) ? base : '/'

// https://taro-docs.jd.com/docs/next/config#defineconfig-辅助函数
export default defineConfig<'vite'>(async (merge) => {
  const baseConfig: UserConfigExport<'vite'> = {
    projectName: 'taro-vite',
    date: '2025-8-25',
    designWidth: 375,
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      375: 2,
      828: 1.81 / 2
    },
    sourceRoot: 'src',
    outputRoot: 'dist',
    plugins: ['@tarojs/plugin-generator'],
    alias: {
      '@': path.resolve(__dirname, '../src'),
      // 小程序场景使用微信polyfill版本supabase-js
      '@supabase/supabase-js': process.env.TARO_ENV === 'h5' ? '@supabase/supabase-js' : 'supabase-wechat-js'
    },
    defineConstants: {},
    copy: {
      patterns: [],
      options: {}
    },
    framework: 'react',
    compiler: {
      type: 'vite',
      vitePlugins: [
        miaodaDevPlugin({appType: 'miniapp', cdnBase: publicPath}),

        {
          name: 'env-inject-plugin',
          config() {
            // 从 .env 文件读取环境变量并注入到编译时常量
            // 这样可以确保环境变量在编译时被正确替换
            const cozeApiUrl = process.env.VITE_COZE_API_URL || process.env.TARO_APP_COZE_API_URL || ''
            const cozeApiToken = process.env.VITE_COZE_API_TOKEN || process.env.TARO_APP_COZE_API_TOKEN || ''

            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
            console.log('🔧 Vite 编译时环境变量注入')
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
            console.log('VITE_COZE_API_URL:', process.env.VITE_COZE_API_URL ? '✅ 已设置' : '❌ 未设置')
            console.log('TARO_APP_COZE_API_URL:', process.env.TARO_APP_COZE_API_URL ? '✅ 已设置' : '❌ 未设置')
            console.log('VITE_COZE_API_TOKEN:', process.env.VITE_COZE_API_TOKEN ? '✅ 已设置' : '❌ 未设置')
            console.log('TARO_APP_COZE_API_TOKEN:', process.env.TARO_APP_COZE_API_TOKEN ? '✅ 已设置' : '❌ 未设置')
            console.log('最终使用的 URL:', cozeApiUrl || '(未设置)')
            console.log('最终使用的 Token:', cozeApiToken ? `已设置 (${cozeApiToken.substring(0, 30)}...)` : '(未设置)')
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

            return {
              // 设置 envPrefix 以支持读取环境变量
              envPrefix: ['VITE_', 'TARO_APP_'],
              // 使用 define 配置直接注入环境变量值
              // 注意：只注入我们需要的环境变量，避免影响其他模块
              define: {
                __COZE_API_URL__: JSON.stringify(cozeApiUrl),
                __COZE_API_TOKEN__: JSON.stringify(cozeApiToken)
              }
            }
          }
        },

        {
          name: 'hmr-toggle',
          configureServer(server) {
            let hmrEnabled = true

            // 包装原来的 send 方法
            const _send = server.ws.send
            server.ws.send = (payload) => {
              if (hmrEnabled) {
                return _send.call(server.ws, payload)
              } else {
                console.log('[HMR disabled] skipped payload:', payload.type)
              }
            }

            // 提供接口切换 HMR
            server.middlewares.use('/innerapi/v1/sourcecode/__hmr_off', (_req, res) => {
              hmrEnabled = false
              const body = {
                status: 0,
                msg: 'HMR disabled'
              }
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(body))
            })

            server.middlewares.use('/innerapi/v1/sourcecode/__hmr_on', (_req, res) => {
              hmrEnabled = true
              const body = {
                status: 0,
                msg: 'HMR enabled'
              }
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(body))
            })

            // 注册一个 HTTP API，用来手动触发一次整体刷新
            server.middlewares.use('/innerapi/v1/sourcecode/__hmr_reload', (_req, res) => {
              if (hmrEnabled) {
                server.ws.send({
                  type: 'full-reload',
                  path: '*' // 整页刷新
                })
              }
              res.statusCode = 200
              const body = {
                status: 0,
                msg: 'Manual full reload triggered'
              }
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(body))
            })
          },
          load(id) {
            if (id === 'virtual:after-update') {
              return `
        if (import.meta.hot) {
          import.meta.hot.on('vite:afterUpdate', () => {
            window.postMessage(
              {
                type: 'editor-update'
              },
              '*'
            );
          });
        }
      `
            }
          },
          transformIndexHtml(html) {
            return {
              html,
              tags: [
                {
                  tag: 'script',
                  attrs: {
                    type: 'module',
                    src: '/@id/virtual:after-update'
                  },
                  injectTo: 'body'
                }
              ]
            }
          }
        },

        {
          // 通过 vite 插件加载 postcss,
          name: 'postcss-config-loader-plugin',
          config(config) {
            // 加载 tailwindcss
            if (typeof config.css?.postcss === 'object') {
              config.css?.postcss.plugins?.unshift(tailwindcss())
            }
          }
        },
        uvtw({
          // rem转rpx
          rem2rpx: {
            rootValue: 24,
            propList: ['*'],
            transformUnit: 'rpx'
          } as any,
          // 除了小程序这些，其他平台都 disable
          disabled: process.env.TARO_ENV === 'h5',
          // 由于 taro vite 默认会移除所有的 tailwindcss css 变量，所以一定要开启这个配置，进行css 变量的重新注入
          injectAdditionalCssVarScope: true
        })
      ] as Plugin[]
    },
    mini: {
      postcss: {
        pxtransform: {
          enable: true,
          config: {
            baseFontSize: 12,
            minRootSize: 12
          }
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      }
    },
    h5: {
      publicPath,
      staticDirectory: 'static',

      sassLoaderOption: {
        additionalData: `@import "@/styles/overrides.scss";`
      },

      miniCssExtractPluginOption: {
        ignoreOrder: true,
        filename: 'css/[name].[hash].css',
        chunkFilename: 'css/[name].[chunkhash].css'
      },
      postcss: {
        pxtransform: {
          enable: true,
          config: {
            baseFontSize: 12,
            minRootSize: 12
          }
        },
        autoprefixer: {
          enable: true,
          config: {}
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      },
      devServer: {
        open: false
      }
    }
  }

  if (process.env.LINT_MODE === 'true') {
    return merge({}, baseConfig, lintConfig)
  }

  if (process.env.NODE_ENV === 'development') {
    const sentryDsn = process.env.INJECT_SENTRY_DSN
    const environment = process.env.MIAODA_ENV
    const appid = process.env.TARO_APP_ID
    const cdnHost = process.env.MIAODA_CDN_HOST || 'resource-static.cdn.bcebos.com'
    // 本地开发构建配置（不混淆压缩）
    return merge({}, baseConfig, devConfig(sentryDsn, environment, appid, cdnHost))
  }

  // 生产构建配置（默认开启压缩混淆等）
  return merge({}, baseConfig, prodConfig)
})
