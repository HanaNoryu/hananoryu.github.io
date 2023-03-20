import { defineSiteConfig } from 'valaxy'

export default defineSiteConfig({
  lang: 'zh-CN',
  title: '极光の杂物铺',
  subtitle: '记录生活中的点点滴滴',
  description: 'The world is full of possibilities.',
  author: {
    name: 'HanaNoryu',
    email: 'HanaNoryu@outlook.com',
    link: 'https://www.hananoryu.cn',
    avatar: 'https://image.hananoryu.cn/images/hananoryu.png',
    status: {
      emoji: '✨',
      message: '努力提升自己中...',
    },
  },
  url: 'https://www.hananoryu.cn',
  favicon: 'https://image.hananoryu.cn/images/ico.webp',
  feed: {
    favicon: 'https://image.hananoryu.cn/images/ico.webp',
  },
  mediumZoom: { enable: true },
  social: [
    {
      name: 'RSS',
      link: '/atom.xml',
      icon: 'i-ri-rss-line',
      color: 'orange',
    },
    {
      name: 'QQ',
      link: 'tencent://message/?uin=1581893646&Site=Sambow&Menu=yes',
      icon: 'i-ri-qq-line',
      color: '#12B7F5',
    },
    {
      name: 'GitHub',
      link: 'https://github.com/HanaNoryu',
      icon: 'i-ri-github-line',
      color: '#6e5494',
    },
    {
      name: '网易云音乐',
      link: 'https://music.163.com/#/user/home?id=391356695',
      icon: 'i-ri-netease-cloud-music-line',
      color: '#C20C0C',
    },
    {
      name: '哔哩哔哩',
      link: 'https://space.bilibili.com/10273650',
      icon: 'i-ri-bilibili-line',
      color: '#FF8EB3',
    },
    {
      name: 'E-Mail',
      link: 'mailto:HanaNoryu@outlook.com',
      icon: 'i-ri-mail-line',
      color: '#8E71C1',
    },
    {
      name: 'Travelling',
      link: 'https://www.travellings.cn/go.html',
      icon: 'i-ri-train-line',
      color: 'var(--va-c-text)',
    },
  ],

  search: {
    enable: true,
    type: 'fuse',
  },

  // sponsor: {
  //   enable: false,
  //   title: '我很可爱，请给我钱！',
  //   methods: [
  //     {
  //       name: '支付宝',
  //       url: '',
  //       color: '#00A3EE',
  //       icon: 'i-ri-alipay-line',
  //     },
  //     {
  //       name: 'QQ 支付',
  //       url: '',
  //       color: '#12B7F5',
  //       icon: 'i-ri-qq-line',
  //     },
  //     {
  //       name: '微信支付',
  //       url: '',
  //       color: '#2DC100',
  //       icon: 'i-ri-wechat-pay-line',
  //     },
  //   ],
  // },

  comment: {
    enable: true,
  },

  statistics: {
    enable: true,
    readTime: {
      speed: {
        cn: 300,
        en: 100,
      },
    },
  },
})
