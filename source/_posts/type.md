---
title: 类型进阶
date: 2018-02-19 22:40:41
categories: JavaScript
tags: Interview
---

本篇内容总结于网易前端微专业的 Javascript 程序设计和慕课网的前端跳槽面试必备技巧，并进行了相应扩展。

### 类型检测

![img](http://osly086qe.bkt.clouddn.com/typeof.jpg)

```
typeof null; // 'object'
typeof function(){}; // 'function'
let s = new Symbol('uid');
typeof s; // 'symbol'
class PersonClass { ... };
typeof PersonClass; // 'function'
```

`typeof()`可以检测除`null`以外的基本类型和`Function`类型。

&nbsp;

![img](http://osly086qe.bkt.clouddn.com/instanceof.jpg)

```
[] instanceof Array; // true
'jerry' instanceof String; // false

function Point(x, y) {
    this.x = x;
    this.y = y;
}
function Circle(x, y, r) {
    Point.call(this, x, y);
    this.radius = r;
}
Circle.prototype = new Point();
Circle.prototype.constructor = Circle;

var c = new Circle(1, 1, 2);
c instanceof Circle; // true
c instanceof Point; // true
```

`instanceof`可以检测所有的对象类型（包括内置对象类型和自定义对象类型），不能检测基本类型。  
`instanceof`的原理是检查`c`的原型链上是否有`Circle.prototype`和`Point.prototype`。在`iframe`下`instanceof`就会不生效，因为处于不同的上下文。另外，`instanceof undefined`会报错，右边不是一个对象。

&nbsp;

![img](http://osly086qe.bkt.clouddn.com/toString.jpg)

```
function type(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1);
}
type(null); // 'Null'
type(new Date); // 'Date'

function Point(x, y) {
    this.x = x;
    this.y = y;
}
type(new Point(1, 2)); // 'Object'
```

`Object.prototype.toString.call()`可以检测基本类型和内置对象类型，但不能检测自定义对象类型。

&nbsp;

![img](http://osly086qe.bkt.clouddn.com/constructor.jpg)

```
(1).constructor === Number; // true
[].constructor === Array; // true

function Person(name) {
    this.name = name;
}
new Person('jerry').constructor === Person; // true

function getConstructorName(obj) {
    return obj && obj.constuctor && obj.constructor.toString().match(/function\s*([^(]*)/)[1];
}
getConstructorName([]) === 'Array'; // true
```

`constructor`可以检测除`null`和`undefined`以外的基本类型和所有的对象类型。但由于`constructor`是可以被修改的，所以要当心。  
&nbsp;

### 显式类型转换

`Number(str)`：比`parseInt(str)`严格：纯数字转成数字，否则`NaN`，`' '`和`null`转为 0。  
`Number(obj)`：先隐式调用`obj.valueOf()`，返回原始类型就直接调`Number()`，否则调用`obj.toString()`，返回原始类型再调`Number()`，否则报错。

`String(obj)`：与`Number(obj)`相反。先隐式调用`obj.toString()`，返回原始类型就直接调`String()`，否则调用`obj.valueOf()`，返回原始类型再调`String()`，否则报错。

`Boolean()`：`undefined`，`null`，0，`NaN`，`' '`会转为`false`，其余都是`true`（尤其是`[]`和`{}`）。  
&nbsp;

### 隐式类型转换

四则运算、判断语句、Native 调用（比如`console`和`alert`）会发生隐式类型转换。

```
true + true; // 2
[] + []; // '', String([]) + String([])
[] + {}; // '[object Object]', String([]) + String({})
```

`{} + []`，`{}`会被当做代码块而忽略，执行`+[]`，相当于`Number([])`，所以结果是 0。  
`{} + {}`，在 Chrome 下结果是`'[object Object][object Object]'`，相当于`String({}) + String({})`。在 Firefox 下结果是`NaN`，`{}`再次被当成是代码块而忽略，求值`Number({})`。  
`1 + {a: 1}`相当于`String(1) + String({a: 1})`，所以结果是`'1[object Object]'`。
