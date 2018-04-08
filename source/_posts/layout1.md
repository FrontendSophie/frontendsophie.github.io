---
title: 居中布局
date: 2017-07-06 22:33:13
categories: CSS
tags: [Layout, Interview]
---

本篇内容总结于网易前端微专业的页面架构，并进行了相应扩展。

### 水平居中

在父子元素宽度都是未知的情况下实现水平居中，难点在于要先设置子元素的宽度变成内容宽，然后设置父元素或者子元素的样式使其居中。

```
<div class="parent"</div>
  <div class="child"><div>
</div>
```

1、 `inline-block` + `text-align`  
原理：`inline-block`元素的宽度是内容宽，`text-align`对`inline`元素以及`inline-block`元素都会起作用。  
优点：兼容性很好。  
缺点：`text-align: center`会被继承，`.child`里面有文字的话就会被居中。

```
.parent {
  text-align: center;
}
.child {
  display: inline-block;
}
```

2、 `table` + `margin`  
原理：`block`元素定宽+`margin: 0 auto`可以实现水平居中。`table`元素表现上很像`block`元素，但是`table`元素的宽度也是内容宽。  
优点：只需要设置子元素的样式，不用关心父元素，同时 IE8 以上浏览器兼容性很好。

```
.child {
  display: table;
  margin: 0 auto;
}
```

3、 `absolute` + `transform`  
原理：`absolute`元素默认没有宽度，宽度由内容决定。`left: 50%`是相对于`.parent`的 50%，`.child`的左边就会抵达`.parent`的中间。然后`translate`内部百分比的参照物是自己，`translateX(-50%)`就是以`.child`自身宽度的 50%向左偏移从而使得元素居中。  
优点：绝对定位脱离文档流，`.child`不会对其他元素产生影响。  
缺点：`transform`是 CSS3 属性，不兼容 IE8。

```
.parent {
  position: relative;
}
.child {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
```

4、 `flex` + `justify-content`  
原理：设置`flex`以后子元素就变成了`flex-item`， `flex-item`默认情况下宽度是`auto`就是内容宽。除了对父元素设置`justify-content: center`， 对子元素设置`margin: 0 auto`也能使其居中，类似`table`元素。  
优点：只需要设置父元素的样式。  
缺点：`flex`是 CSS3 属性，IE8 不兼容。

```
.parent {
  display: flex;
  justify-content: center;
}

/* another solution */
.parent {
  display: flex;
}
.child {
  margin: 0 auto;
}
```

&nbsp;

### 垂直居中

在父子元素高度都是未知的情况下实现垂直居中，难点在于理解`vertical-align`的使用场景。

```
<div class="parent"</div>
  <div class="child"><div>
</div>
```

1、 `table-cell` + `vertical-align`  
原理：`vertical-align: middle`可以作用在`inline`元素、`inline-block`元素以及`table-cell`元素上。只有在`tabel-cell`元素中是用来设置单元格内容的对齐方式。当设置在行内元素上时，效果是设置这个元素相对于所在行基线的垂直对齐。题外话，如果想要和`text-align: center`实现文本水平居中一样实现文本的垂直居中，应该用`line-height`，将其高度设置成元素高度即可。  
优点：兼容性很好。

```
.parent {
  display: table-cell;
  vertical-align: middle;
}
```

2、 `absolute` + `transform`  
原理：参照水平居中方案三。  
优点：子元素不会干扰其他元素。  
缺点：`transform`是 CSS3 属性，IE8 不兼容。而且当父容器未设置高度，即高度通过子元素撑开时，子元素设置`absolute`之后脱离文档流，父容器就会没有高度，以致影响后续布局。

```
.parent {
  position: relative;
}
.child {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
```

3、 `flex` + `align-items`  
原理：`flex-item`的`align-items`属性默认值是`strech`，子元素会被拉伸到和父容器一样高。除了设置父元素的`align-items: center`使子元素继承得以居中，还可以直接单独设置子元素的`align-self: center`达到垂直居中。  
优点：只需要设置父容器样式。  
缺点：`flex`是 CSS3 属性，IE8 不兼容。

```
.parent {
  display: flex;
  align-items: center;
}

/* another solution */
.parent {
  display: flex;
}
.child {
  align-self: center;
}
```

&nbsp;

### 水平垂直居中

在父子元素宽度、高度都是未知的情况下实现水平、垂直居中，综合上述方法即可。

```
<div class="parent"</div>
  <div class="child"><div>
</div>
```

1、`inline-block` + `text-align` + `table-cell` + `vertical-align`  
优点：兼容性很好。

```
.parent {
  display: table-cell;
  vertical-align: middle;
  text-align: center;
}
.child {
  display: inline-block;
}
```

2、`absolute` + `transform`
优点：子元素不会干扰其他元素。  
缺点：`transform`是 CSS3 属性，IE8 不兼容。

```
.parent {
  position: relative;
}
.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

3、`flex` + `justify-content` + `align-items`  
优点：只需要设置父元素样式。  
缺点：`flex`是 CSS3 属性，IE8 不兼容。

```
.parent {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* other solution 1 */
.parent {
  display: flex;
  align-items: center;
}
.child {
  margin: 0 auto;
}

/* other solution 2 */
.parent {
  display: flex;
}
.child {
  align-self: center;
  margin: 0 auto;
}
```
