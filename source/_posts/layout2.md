---
title: 多列布局
date: 2017-07-07 22:36:17
categories: CSS
tags: [Layout, Interview]
---

本篇内容总结于网易前端微专业的页面架构，并进行了相应扩展。

### 一列定宽一列自适应

难点在于设置两行并列和自适应那栏的宽度处理。

```
<div class="parent">
  <div class="left">
    <p>left</p>
  </div>
  <div class="right">
    <p>right</p>
  </div>
</div>
```

1、 `float` + `margin`  
原理：`float`会让元素脱离文档流，而其文本没有脱离，所以会形成环绕效果。`.right`的 120px 左边距，多出来的 20px 就是视觉上的间距。如果给`.left`设置`margin-right: 120px`，`.left`元素已经脱离文档流，设置外边距对还在文档流中的`.right`是无效的。同时因为其`float`元素的文本没有脱离文档流，最终效果就是对`.right`的内部文本产生类似`padding-left: 20px`的影响。  
优点：非常简单。  
缺点：`.right`内部文本`p`清除浮动以后，`p`会“掉下去”。

```
.left {
  float: left; /* Or divs will align vertically */
  width: 100px;
}
.right {
  margin-left: 120px;
}
```

2、 `float` + `margin` + `(fix)`  
原理：开启 BFC 模式以后`.right`就会独立不受浮动的`.left`影响。使用`float: right`开启 BFC，`float`元素宽是内容宽，为了让右侧宽度自适应，就要外面新套一层`.right-fix`设置`width: 100%`，内部设置`margin-left: 120px`来保证`.right`的宽度是自适应的。但位置不够又导致`.right-fix`“掉下去”，所以使用`margin`负值又将它“提上来”。此时由于层级问题，`.right-fix`会盖住`.left`，导致`.left`无法被点击，最后要使用`position: relative`提高`.left`的层级。  
优点：兼容性很好。  
缺点：结构和样式比较复杂。

```
<div class="parent">
  <div class="left">
    <p>left1</p>
  </div>
  <div class="right-fix">
    <div class="right">
      <p>right1</p>
    </div>
  </div>
</div>
```

```
.left {
  float: left;
  width: 100px;
  position: relative;
}
.right-fix {
  float: right;
  width: 100%;
  margin-left: -100px;
}
.right {
  margin-left: 120px;
}
```

3、 `float` + `margin` + `calc`  
原理：根据上一个例子的启发，使用`float: right`开启 BFC 模式，然后计算宽度使其自适应并正常排列。  
优点：简单。  
缺点：`calc()`是 CSS3 方法，不兼容 IE8。

```
.left {
  float: left;
  width: 100px;
}
.right {
  float: right;
  width: calc(100% - 120px);
}
```

4、 `float` + `overflow`  
原理：开启 BFC 的另一种方法，设置`overflow`除`visible`以外的参数。  
优点：简单。

```
.left {
  float: left;
  width: 100px;
  margin-right: 20px;
}
.right {
  overflow: hidden;
}
```

5、 `table`  
原理：`display: table`宽度是内容宽，所以要设置宽度 100%。设置子元素`display: table-cell`，`.left`和`.right`就是水平排列的两个等分单元格。`table`特性是每列宽度之和等于整个表格宽度，所以设置`.left`宽度之后，`.right`一定是剩余宽度。单元格设置`margin`无效，故使用`padding`做间隔。由于是定宽处理，增加`table-layout: fixed`可以实现布局优先、加速渲染。  
缺点：代码比较多。

```
.parent {
  display: table;
  width: 100%;
  table-layout: fixed;
}
.left, .right {
  display: table-cell;
}
.left {
  width: 100px;
  padding-right: 20px;
}
```

6、 `flex`  
原理：设置`display: flex`，子元素变成`flex-item`水平排布，其宽度是内容宽。设置`flex: 1`就会获取剩余宽度。  
缺点：flex 是 CSS3 属性，不兼容 IE8。而且性能有一定问题，只适合小范围布局。

```
.parent {
  display: flex;
}
.left {
  width: 100px;
  margin-right: 20px;
}
.right {
  flex: 1;
}
```

7、 `grid`  
原理：设置`grid-template-columns`分成水平左右两列，右列设置`auto`来自适应宽度。  
优点：面向未来的前端布局解决方案。  
缺点：兼容性比`flex`还差。

```
.parent {
  display: grid;
  grid-template-columns: 100px auto;
  grid-column-gap: 20px;
}
```

&nbsp;

### 一列不定宽一列自适应

基于上述一列定宽的思路，筛选去掉固定宽后，使用内容宽的，同时设置间隔不依赖于固定宽的布局解决方案。

```
<div class="parent">
  <div class="left">
    <p>left1</p>
  </div>
  <div class="right">
    <p>right1</p>
  </div>
</div>
```

1、 `float` + `overflow`  
优点：简单、常用。

```
.left {
  float: left;
  margin-right: 20px;
}
.right {
  overflow: hidden;
}
```

2、 `table`  
原理：定宽下`table-layout: fixed`布局优先的设置必须移除，默认`auto`内容优先。同时必须给左列设置最小宽度，然后靠内容撑开，否则左右单元格会均分宽度。

```
.parent {
  display: table;
  width: 100%;
}
.left, .right {
  display: table-cell;
}
.left {
  width: 0.1%;
  padding-right: 20px;
}
```

3、 `flex`

```
.parent {
  display: flex;
}
.left {
  margin-right: 20px;
}
.right {
  flex: 1;
}
```
