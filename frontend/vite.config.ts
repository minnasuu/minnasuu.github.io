import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' 

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '')
  // 线上后端地址，可通过 .env.local 中 VITE_PROXY_TARGET 覆盖
  const proxyTarget = env.VITE_PROXY_TARGET || 'https://suminhan.cn'

  return {
    plugins: [react(), tailwindcss()],
    base: '/', // 改回根路径，GitHub Pages用户页面应该使用这个
    server: {
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          secure: true,
          configure: (proxy) => {
            proxy.on('proxyRes', (proxyRes, req) => {
              // 重写 Set-Cookie，让 cookie 能在 localhost 上生效
              const setCookie = proxyRes.headers['set-cookie']
              if (setCookie) {
                proxyRes.headers['set-cookie'] = setCookie.map(
                  (cookie: string) =>
                    cookie
                      .replace(/;\s*domain=[^;]*/gi, '')
                      .replace(/;\s*secure/gi, '')
                      .replace(/;\s*SameSite=None/gi, '; SameSite=Lax')
                )
              }

              // 重写 302 重定向中的 Location，让登录回调回到 localhost
              const { location } = proxyRes.headers
              if (location && location.includes('suminhan.cn')) {
                const localHost = req.headers.host || 'localhost:5173'
                proxyRes.headers.location = location.replace(
                  /https?:\/\/suminhan\.cn/g,
                  `http://${localHost}`
                )
              }
            })
          },
        },
      },
    },
  }
})
