import { defineValaxyConfig } from 'valaxy'
import type { UserThemeConfig } from 'valaxy-theme-yun'
import { addonWaline } from 'valaxy-addon-waline'
import { addonAlgolia } from 'valaxy-addon-algolia'

/**
 * User Config
 */
export default defineValaxyConfig<UserThemeConfig>({
  theme: 'yun',

  themeConfig: {
    banner: {
      enable: true,
      title: '极光の杂物铺',
      cloud: {
        enable: true,
      },
    },

    bg_image: {
      enable: true,
      url: 'https://image.hananoryu.cn/images/pixiv_92389224_p3.webp',
      dark: 'https://image.hananoryu.cn/images/pkq3zp.jpg',
      opacity: 0.8,
    },

    say: {
      enable: true,
      api: '/young.json',
      hitokoto: {
        enable: false,
        api: '',
      },
    },

    notice: {
      enable: true,
      content: '「それでも君が好きだよ」',
    },

    pages: [
      {
        name: '我的小伙伴们',
        url: '/links/',
        icon: 'i-ri-genderless-line',
        color: 'dodgerblue',
      },
      // {
      //   name: '喜欢的女孩子',
      //   url: '/girls/',
      //   icon: 'i-ri-women-line',
      //   color: 'hotpink',
      // },
    ],

    footer: {
      since: 2023,
      icon: {
        enable: true,
        // name: 'HanaNoryu',
        animated: true,
        color: 'pink',
        url: '',
        title: 'HanaNoryu',
      },
      powered: true,
      beian: {
        enable: true,
        icp: '豫ICP备2022025836号',
      },
    },
  },

  unocss: {
    safelist: [
      'i-ri-home-line',
    ],
  },

  addons: [
    addonAlgolia({
      appId: '18E8F0DA4N',
      apiKey: '1ec248f9b05a87b508f52c823a4bdb1a',
      indexName: 'hexo',
    }),
    addonWaline({
      serverURL: 'https://waline.hananoryu.cn',
      comment: true,
    }),
  ],
})
