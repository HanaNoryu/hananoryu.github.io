---
title: '一份Less的使用指南'
date: '2022-12-02 9:23:32'
updated: '2022-12-02 9:23:32'
author: 'HanaNoryu'
sponsor: false
toc: true
aside: true
comment: true
excerpt: 'Less 是一门 CSS 预处理语言,它扩展了 CSS 语言,增加了变量、Mixin、函数等特性,使 CSS 更易维护和扩展。Less 可以运行在 Node 或浏览器端。而本文是当初我在学习 Less 时所做的总结积累，可以在其中快速的查阅用法，也可以作为一个学习文档来进行阅读。'
categories: '极光的学习总结'
tags: ['css', 'less']
---

::: tip

标题中带‘*’的为重要部分，可以认真去掌握了解。

:::

## 前言

Less 是一门 CSS 预处理语言,它扩展了 CSS 语言,增加了变量、Mixin、函数等特性,使 CSS 更易维护和扩展。Less 可以运行在 Node 或浏览器端。而本文是当初我在学习 Less 时所做的总结积累，可以在其中快速的查阅用法，也可以作为一个学习文档来进行阅读。

## Less 的安装

```shell
npm i less less-loader -D
```

## Less 的使用方法

### Less 中的变量

#### 1. 值变量*

```less
/* Less */
@color: #999;
@bgColor: skyblue; // 不要添加引号
@width: 50%;
#wrap {
  color: @color;
  background: @bgColor;
  width: @width;
}

/* 生成后的 CSS */
#wrap {
  color: #999;
  background: skyblue;
  width: 50%;
}
```

以 `@` 开头 定义变量，并且使用时 直接 键入 `@`名称。

在平时工作中，我们就可以把 常用的变量 封装到一个文件中，这样利于代码组织维护。

```less
@lightPrimaryColor: #c5cae9;
@textPrimaryColor: #fff;
@accentColor: rgb(99, 137, 185);
@primaryTextColor: #646464;
@secondaryTextColor: #000;
@dividerColor: #b6b6b6;
@borderColor: #dadada;
```

#### 2. 选择器变量

让 选择器 变成 动态

```less
/* Less */
@mySelector: #wrap;
@Wrap: wrap;
@{mySelector} { // 变量名 必须使用大括号包裹
  color: #999;
  width: 50%;
}
.@{Wrap} {
  color: #ccc;
}
#@{Wrap} {
  color: #666;
}

/* 生成的 CSS */
#wrap {
  color: #999;
  width: 50%;
}
.wrap {
  color: #ccc;
}
#wrap {
  color: #666;
}
```

#### 3. 属性变量

```less
/* Less */
@borderStyle: border-style;
@Soild: solid;
#wrap {
  @{borderStyle}: @Soild; // 变量名 必须使用大括号包裹
}

/* 生成的 CSS */
#wrap {
  border-style: solid;
}
```

#### 4. url 变量

项目结构改变时，修改其变量即可。

```less
/* Less */
@images: "../img"; // 需要加引号
body {
  background: url("@{images}/dog.png"); // 变量名 必须使用大括号包裹
}

/* 生成的 CSS */
body {
  background: url("../img/dog.png");
}
```

#### 5. 声明变量*

* 结构：`@name: { 属性： 值 }`
* 使用：`@name()`

```less
/* Less */
@background: { background:red; };
#main {
    @background();
}
@Rules: {
    width: 200px;
    height: 200px;
    border: solid 1px red;
};
#con {
  @Rules();
}

/* 生成的 CSS */
#main {
  background: red;
}
#con {
  width: 200px;
  height: 200px;
  border: solid 1px red;
}
```

#### 6. 变量运算*

* 加减法时，以第一个数据的单位为基准
* 乘除法时，注意单位要统一

```less
/* Less */
@width: 300px;
@color: #222;
#wrap {
  width: @width-20;
  height: @width-20*5;
  margin: (@width-20)*5;
  color: @color*2;
  background-color: @color + #111;
}

/* 生成的 CSS */
#wrap {
  width: 280px;
  height: 200px;
  margin: 1400px;
  color: #444;
  background-color: #333;
}
```

#### 7. 变量作用域

一句话：**就近原则**

```less
/* Less */
@var: @a;
@a: 100%;
#wrap {
  width: @var;
  @a: 9%;
}

/* 生成的 CSS */
#wrap {
  width: 9%;
}
```

#### 8. 用变量去定义变量

```less
/* Less */
@fnord:  "I am fnord.";
@var:    "fnord";
#wrap::after {
  content: @@var; // 将 @var 替换为其值 content:@fnord;
}

/* 生成的 CSS */
#wrap::after {
  content: "I am fnord.";
}
```

### Less 中的嵌套

#### 1. 正常嵌套示例*

```less
/* Less */
.a {
  color: #fff;
  .b {
    width: 20px;
  }
}

/* 生成的 CSS */
.a {
  color: #fff;
}
.a .b {
  width: 20px;
}
```

#### 2. & 的使用*

&：代表上一层选择器的名字

```less
/* Less */
#header {
  &:after {
    content: "Less is more!";
  }
  &:hover {
    color: red;
  }
  .title {
    font-weight: bold;
  }
  &_content { // 理解方式：直接把 & 替换成 #header
    margin: 20px;
  }
}

/* 生成的 CSS */
#header::after {
  content: "Less is more!";
}
#header:hover {
  color: red;
}
#header .title { // 嵌套了
  font-weight: bold;
}
#header_content { // 没有嵌套！
  margin: 20px;
}
```

#### 3. 媒体查询

在以往的工作中，我们使用 媒体查询，都要把一个元素 分开写

```css
#wrap{
  width: 500px;
}
@media screen and (max-width: 768px) {
  #wrap {
    width: 100px;
  }
}
```

Less 提供了一个十分便捷的方式

```less
/* Less */
#main{
  // something...
  @media screen {
    @media (max-width: 768px) {
      width: 100px;
    }
  }
  @media tv {
    width: 2000px;
  }
}

/* 生成的 CSS */
@media screen and (maxwidth: 768px) {
  #main {
    width: 100px; 
  }
}
@media tv {
  #main {
    width: 2000px;
  }
}
```

唯一的缺点就是 每一个元素都会编译出自己 `@media` 声明，并不会合并。

### Less 中的混合（mixin）

Less 的混合有三种情况：

* 不带参数；
* 带参数，没有默认值；
* 带参数，且有设置默认值；

调用的时候也存在区别：

* 不带参数：调用时可以不加括号，直接使用；
* 带参数：调用时要加括号，括号里必须要传值，不然编译会报错；
* 带参数且有默认值：调用时要加括号，参数可传可不传；

#### 1. 无参数方法*

```less
/* Less */
.card { // 等价于 .card()
    background: #f6f6f6;
    -webkit-box-shadow: 0 1px 2px rgba(151, 151, 151, .58);
    box-shadow: 0 1px 2px rgba(151, 151, 151, .58);
}
#wrap {
  .card; // 等价于 .card();
}

/* 生成的 CSS */
#wrap {
  background: #f6f6f6;
  -webkit-box-shadow: 0 1px 2px rgba(151, 151, 151, .58);
  box-shadow: 0 1px 2px rgba(151, 151, 151, .58);
}
```

其中 `.card` 与 `.card()` 是等价的。个人建议，为了避免混淆，应写成：

```less
.card() {
  // somthing...
}
#wrap {
  .card()
}
```

要点：

- `.` 与 `#` 皆可作为 方法前缀。
- 方法后写不写 `()` 看个人习惯。

#### 2. 默认参数方法*

* Less 可以使用默认参数，如果没有传参数，那么将使用默认参数。
* `@arguments` 犹如 JS 中的 `argument` 指代的是 全部参数。
* 传的参数中 必须带着单位。

```less
/* Less */
.border(@a: 10px, @b: 50px, @c: 30px, @color: #000) {
    border: solid 1px @color;
    box-shadow: @arguments; // 指代的是 全部参数
}
#main {
    .border(0px, 5px, 30px, red); // 必须带着单位
}
#wrap {
    .border(0px);
}
#content {
  .border; // 等价于 .border()
}

/* 生成的 CSS */
#main {
    border: solid 1px red;
    box-shadow: 0px, 5px, 30px, red;
}
#wrap {
    border: solid 1px #000;
    box-shadow: 0px 50px 30px #000;
}
#content {
    border: solid 1px #000;
    box-shadow: 10px 50px 30px #000;
}
```

#### 3. 方法的匹配模式

与 面向对象中的多态 很相似

```less
/* Less */
.triangle(top, @width: 20px, @color: #000) {
    border-color: transparent  transparent @color transparent ;
}
.triangle(right, @width: 20px, @color: #000) {
    border-color: transparent @color transparent  transparent ;
}

.triangle(bottom, @width: 20px, @color: #000) {
    border-color: @color transparent  transparent  transparent ;
}
.triangle(left, @width: 20px, @color: #000) {
    border-color: transparent  transparent  transparent @color;
}
.triangle(@_, @width: 20px, @color: #000) {
    border-style: solid;
    border-width: @width;
}
#main {
    .triangle(left, 50px, #999)
}

/* 生成的 CSS */
#main {
  border-color: transparent  transparent  transparent #999;
  border-style: solid;
  border-width: 50px;
}
```

要点：

* 第一个参数 `left` 要会找到方法中匹配程度最高的，如果匹配程度相同，将全部选择，并存在着样式覆盖替换。
* 如果匹配的参数是变量，则将会匹配，如 `@_`。

#### 4. 方法的命名空间

```less
/* Less */
#card() {
    background: #723232;
    .d(@w: 300px) {
        width: @w;
        
        #a(@h: 300px) {
            height: @h; // 可以使用上一层传进来的方法
        }
    }
}
#wrap {
    #card > .d > #a(100px); // 父元素不能加 括号
}
#main {
    #card .d();
}
#con {
    // 不得单独使用命名空间的方法
    // .d() 如果前面没有引入命名空间 #card ，将会报错
    
    #card; // 等价于 #card();
    .d(20px); // 必须先引入 #card
}

/* 生成的 CSS */
#wrap {
  height: 100px;
}
#main {
  width: 300px;
}
#con {
  width: 20px;
}
```

要点：

* 在 CSS 中 `>` 选择器，选择的是儿子元素，就是 必须与父元素 有直接血缘的元素。
* 在引入命令空间时，如使用 `>` 选择器，父元素不能加括号。
* 不得单独使用命名空间的方法，必须先引入命名空间，才能使用其中的方法。
* 子方法 可以使用上一层传进来的方法。

#### 5. 方法的条件筛选

Less 没有 if else，可是它有 `when`

```less
/* Less */
#card {
    
    // and 运算符 ，相当于 与运算 &&，必须条件全部符合才会执行
    .border(@width, @color, @style) when (@width > 100px) and (@color = #999) {
        border: @style @color @width;
    }

    // not 运算符，相当于 非运算 !，条件为 不符合才会执行
    .background(@color) when not (@color >= #222) {
        background: @color;
    }

    // , 逗号分隔符：相当于 或运算 ||，只要有一个符合条件就会执行
    .font(@size: 20px) when (@size > 50px) , (@size < 100px) {
        font-size: @size;
    }
}
#main {
    #card > .border(200px, #999, solid);
    #card .background(#111);
    #card > .font(40px);
}

/* 生成后的 CSS */
#main {
  border: solid #999 200px;
  background: #111;
  font-size: 40px;
}
```

要点：

* 比较运算有：`> >= = <= <`
* `=` 代表的是等于
* 除去关键字 true 以外的值都被视为 false

#### 6. 数量不定的参数

如果你希望你的方法接受数量不定的参数，你可以使用 `...`，犹如 ES6 的扩展运算符。

```less
/* Less */
.boxShadow(...) {
    box-shadow: @arguments;
}
.textShadow(@a, ...) {
    text-shadow: @arguments;
}
#main {
    .boxShadow(1px, 4px, 30px, red);
    .textShadow(1px, 4px, 30px, red);
}

/* 生成后的 CSS */
#main {
  box-shadow: 1px 4px 30px red;
  text-shadow: 1px 4px 30px red;
}
```

#### 7. 方法使用 `!important`

```less
/* Less */
.border {
    border: solid 1px red;
    margin: 50px;
}
#main {
    .border() !important;
}

/* 生成后的 CSS */
#main {
    border: solid 1px red !important;
    margin: 50px !important;
}
```

#### 8. 循环方法

Less 并没有提供 for 循环功能，但我们可以使用递归去实现。

```less
/* Less */
.generate-columns(4);

.generate-columns(@n, @i: 1) when (@i =< @n) {
  .column-@{i} {
    width: (@i * 100% / @n);
  }
  .generate-columns(@n, (@i + 1));
}

/* 生成后的 CSS */
.column-1 {
  width: 25%;
}
.column-2 {
  width: 50%;
}
.column-3 {
  width: 75%;
}
.column-4 {
  width: 100%;
}
```

#### 9. 属性拼接方法

`+_` 代表的是 空格；`+` 代表的是 逗号。

* 逗号

```less
/* Less */
.boxShadow() {
    box-shadow+: inset 0 0 10px #555;
}
.main {
  .boxShadow();
  box-shadow+: 0 0 20px black;
}

/* 生成后的 CSS */
.main {
  box-shadow: inset 0 0 10px #555, 0 0 20px black;
}
```

* 空格

```less
/* Less */
.Animation() {
  transform+_: scale(2);
}
.main {
  .Animation();
  transform+_: rotate(15deg);
}

/* 生成的 CSS */
.main {
  transform: scale(2) rotate(15deg);
}
```

### Less 中的继承

extend 是 Less 的一个伪类。它可继承 所匹配声明中的全部样式。

#### 1. extend 关键字的使用*

```less
/* Less */
.animation {
    transition: all .3s ease-out;
    .hide {
      transform: scale(0);
    }
}
#main {
    &:extend(.animation);
}
#con {
    &:extend(.animation .hide);
}

/* 生成后的 CSS */
.animation, #main {
  transition: all .3s ease-out;
}
.animation .hide , #con {
    transform: scale(0);
}
```

#### 2. all 全局搜索替换

使用选择器匹配到的 全部声明。

```less
/* Less */
#main {
  width: 200px;
}
#main {
  &:after {
    content: "Less is good!";
  }
}
#wrap:extend(#main all) {}

/* 生成的 CSS */
#main, #wrap {
  width: 200px;
}
#main:after, #wrap:after {
    content: "Less is good!";
}
```

#### 3. 减少代码的重复性

从表面来看，`extend` 与 方法 最大的差别，就是 `extend` 是同个选择器共用同一个声明。而 方法 是使用自己的声明，这无疑增加了代码的重复性。

下面是用 方法 写的上面的示例，可以对比一下。

```less
/* Less */
.Method {
  width: 200px;
  &:after {
      content: "Less is good!";
  }
}
#main {
  .Method;
}
#wrap {
  .Method;
}

/* 生成的 CSS */
#main {
  width: 200px;
  &:after {
    content: "Less is good!";
  }  
}
#wrap {
  width: 200px;
  &:after {
    content: "Less is good!";
  }  
}
```

要点：

* 选择器和扩展之间 是允许有空格的：`pre:hover :extend(div pre)`
* 可以有多个扩展：`pre:hover:extend(div pre):extend(.bucket tr)` 注意这与 `pre:hover:extend(div pre, .bucket tr)` 一样
* 扩展必须写在最后：`pre:hover:extend(div pre).nth-child(odd)` 这样写会报错
* 如果一个规则集包含多个选择器，所有选择器都可以使用 extend 关键字

### Less 中的导入

#### 1. 导入 less 文件，可省略后缀*

```less
import "main";
// 等价于
import "main.less";
```

#### 2. `@import` 的位置可随意放置*

```less
#main {
  font-size: 15px;
}
@import "style";
```

#### 3. reference

Less 中最强大的特性，使用引入的 Less 文件，但不会编译它。

```less
/* Less */
@import (reference) "bootstrap.less";

#wrap: extend(.navbar all) {}
```

翻译官网：

> 使用@import (reference)导入外部文件，但不会添加 把导入的文件 编译到最终输出中，只引用。

#### 4. once

```less
@import (once) "foo.less";
@import (once) "foo.less"; // this statement will be ignored
```

> @import语句的默认行为，这表明相同的文件只会被导入一次，而随后的导入文件的重复代码都不会解析。

#### 5. multiple

```less
/* Less */

// file: foo.less
.a {
  color: green;
}
// file: main.less
@import (multiple) "foo.less";
@import (multiple) "foo.less";

/* 生成后的 CSS */
.a {
  color: green;
}
.a {
  color: green;
}
```

> 使用@import (multiole)允许导入多个同名文件。

### Less 中的函数

#### 1. 判断类型

* isnumber

> 判断给定的值 是否是一个数字。

```less
isnumber(#ff0);     // false
isnumber(blue);     // false
isnumber("string"); // false
isnumber(1234);     // true
isnumber(56px);     // true
isnumber(7.8%);     // true
isnumber(keyword);  // false
isnumber(url(...)); // false
```

* iscolor

> 判断给定的值 是否 是一个颜色

* isurl

> 判断给定的值 是否 是一个 url

#### 2. 颜色操作

- saturate

> 增加一定数值的颜色饱和度。

- lighten

> 增加一定数值的颜色亮度。

- darken

> 降低一定数值的颜色亮度。

- fade

> 给颜色设定一定数值的透明度。

- mix

> 根据比例混合两种颜色。

#### 3. 数学函数

- ceil

> 向上取整。

- floor

> 向下取整。

- percentage

> 将浮点数转换为百分比字符串。

- round

> 四舍五入。

- sqrt

> 计算一个数的平方根。

- abs

> 计算数字的绝对值，原样保持单位。

- pow

> 计算一个数的乘方。

**如果你想了解更多，可以去官网的[函数链接](https://link.juejin.cn/?target=http%3A%2F%2Flesscss.cn%2Ffunctions%2F)**

### 其他

#### 1. 注释

* 以 `//` 开头的注释，注释单行，且不会被编译到 CSS 文件中。
* 以 `/**/` 包裹的注释，注释多行，同样也不会被编译到 CSS 文件中。

#### 2. 避免编译

```less
/* Less */
#main {
  width: ~'calc(300px - 30px)';
}

/* 生成后的 CSS */
#main {
  width: calc(300px - 30px);
}
```

结构：`~'值'`

#### 3. 变量拼串

下面例子中，实现了不同的 transtion-delay、animation、@keyframes

```less
.judge(@i) when(@i = 1){
  @size: 15px;
}
.judge(@i) when(@i > 1){
  @size: 16px;
}
.loopAnimation(@i) when (@i < 16) {
  
  .circle:nth-child(@{i}) {
      .judeg(@i);
      border-radius: @size @size 0 0;
      animation: ~"circle-@{i}" @duration infinite @ease;
      transition-delay: ~"@{i}ms";
  }
  @keyframes ~"circle-@{i}" {
      // do something...
  }
  .loopAnimation(@i + 1);
}
```

结构：`~"字符@{变量}字符"`

#### 4. 使用 JS

因为 Less 是由 JS 编写，所以 Less 有一得天独厚的特性：代码中使用 Javascript。

```less
/* Less */
@content:`"aaa".toUpperCase()`;
#randomColor{
  @randomColor: ~"rgb(`Math.round(Math.random() * 256)`,`Math.round(Math.random() * 256)`,`Math.round(Math.random() * 256)`)";
}
#wrap{
  width: ~"`Math.round(Math.random() * 100)`px";
  &:after{
      content:@content;
  }
  height: ~"`window.innerHeight`px";
  alert:~"`alert(1)`";
  #randomColor();
  background-color: @randomColor;
}
/* 生成后的 CSS */

// 弹出 1
#wrap{
  width: 随机值（0~100）px;
  height: 743px;//由电脑而异
  background: 随机颜色;
}
#wrap::after{
  content:"AAA";
}
```

## Less 的一些实用示例

### 文字超出省略

这是前端开发中出现频率比较高的情况，我们来提取混合（mixin），实例代码如下：

```less
.ellipsisSingle() {
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

这样我们就可以在项目中直接混合使用，但是就此收手，觉得还是不过瘾。若是需要多行省略的情况呢？下面就用到了带参数的混合（mixin）：

```less
.ellipsisMultiple(@num: 1) {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: @num
}
```

styles 内容如下：

```less
.box {
  .text {
    .ellipsisMultiple(2);
    background: pink;
    width: 200px;
  }
}
```

### 文字垂直居中

很多时候你在写 CSS 样式的时候，会连续写两个连在一起的属性，比如 `height: 20px; line-height: 20px`，目的是为了让标签内的文字垂直居中，写多了就会觉得代码不是那么干净。又到了 Less 出手的时候了，把它封装起来，代码如下：

```less
.line-text-h (@h: 0) {
  height: @h;
  line-height: @h;
}
```

### 定位上下左右居中

项目开发中有些场景比如设置空页面的图标上下左右居中，这时我们可以封装一个 Less 混合（mixin）：

```less
.center() {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

**还有许许多多的日常中常用的实例，这里只是举出几个例子，大家可以进行举一反三，去创造更多的实例，让自己的代码更加健壮整洁。**