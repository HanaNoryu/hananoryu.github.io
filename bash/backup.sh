# 如果没有消息后缀，默认提交信息为 `:pencil: update content`
info=$1
if ["$info" = ""];
then info=":pencil: update content"
fi
set HEXO_ALGOLIA_INDEXING_KEY=847373a4187feef5bc36b9224087edb0
git add -A
git commit -m "$info"
git push origin hexo