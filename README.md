# Hexo 站点源文件

Hexo 主题：[Yun](https://github.com/YunYouJun/hexo-theme-yun/)

- 主站：[hananoryu.cn](https://www.hananoryu.cn) | [hananoryu.github.io](https://hananoryu.github.io)

## Use

### 日常发布

发布时，同时推送至 GitHub 的 hexo 分支备份，使用 CI（GitHub Actions）生成静态页面推送至 Github

```shell
npm run backup
# or
sh backup.sh
# sh backup.sh 'change info'
```