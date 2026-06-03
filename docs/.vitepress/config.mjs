import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'KittiSU',
  description: 'A more stable fork of ReSukiSU',
  base: '/',

  head: [
    ['link', { rel: 'icon', href: '/logo.jpg' }],
    ['link', { rel: 'preconnect', href: 'https://cdn.jsdelivr.net/' }],
    ['link', { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/jetbrains-mono-webfont@latest/jetbrains-mono.css' }],
    ['link', { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/remixicon@latest/fonts/remixicon.css' }],
    ['meta', { name: 'theme-color', content: '#a855f7' }],
  ],

  themeConfig: {
    logo: '/logo.jpg',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide' },
      { text: 'Links', link: '/links' },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/terebiko/KittiSU' },
      { icon: 'telegram', link: 'https://t.me/illogicalEmission' },
    ],

    footer: {
      message: 'Documented with ❤️ by KittiSU Development',
      copyright: 'Copyright © 2025-2026 KittiSU, under MIT License',
    },

    editLink: {
      pattern: 'https://github.com/terebiko/KittiSU/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },
  },
})
