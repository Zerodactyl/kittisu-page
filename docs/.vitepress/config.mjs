import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'KittiSU',
  description: 'A more stable fork of ReSukiSU',
  base: '/',

  head: [
    ['link', { rel: 'icon', href: '/logo.png' }],
    ['link', { rel: 'preconnect', href: 'https://cdn.jsdelivr.net/' }],
    ['link', { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/misans-vf@1.0.0/lib/MiSans.min.css' }],
    ['link', { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/jetbrains-mono-webfont@latest/jetbrains-mono.css' }],
    ['link', { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/remixicon@latest/fonts/remixicon.css' }],
    ['script', { src: 'https://cdn.jsdelivr.net/npm/animejs@3.2.1/lib/anime.min.js', defer: '' }],
    ['script', { src: '/md-anim.js', defer: '' }],
    ['meta', { name: 'theme-color', content: '#0061A4' }],
  ],

  themeConfig: {
    logo: '/logo.png',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/introduce' },
      { text: 'Links', items: [
        { text: 'KernelSU Documentation', link: 'https://kernelsu.org/' },
        { text: 'KernelSU Modules Repository', link: 'https://modules.kernelsu.org/' },
      ]},
    ],

    sidebar: [
      {
        text: 'Get started',
        collapsed: false,
        items: [
          { text: 'Install', link: '/guide/install' },
        ],
      },
      {
        text: 'Building Kernel',
        collapsed: false,
        items: [
          { text: 'Manual Hooks', link: '/guide/manual-integrate' },
          { text: 'Unofficial Supported Devices', link: '/guide/unofficial-devices' },
          { text: 'FAQ', link: '/guide/faq' },
          { text: 'About KittiSU', link: '/guide/introduce' },
        ],
      },
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

    docFooter: {
      prev: 'Previous page',
      next: 'Next page',
    },
  },
})
