---
title: 原型与new
date: 2017-02-22 17:51:47
categories: JavaScript
tags: [OOP, Interview]
---

### `prototype`

无论什么时候，只要创建了一个新函数，该函数就会创建一个`prototype`属性，指向这个函数的原型对象。这个原型对象里默认有一个属性：`constructor`，指向当前这个函数。

```
function Person(name) {
  this.name = name;
}
Person.prototype.constructor === Person; // true
```

&nbsp;

### `__proto__`

每个对象都有一个属性`__proto__`，它的指向取决于对象的创建方式，一般指向自身构造函数的原型对象（除了`Object.create()`）。本质是标准属性`[[Prototype]]`，由于`[[Prototype]]`不可见，Firefox、Safari、Chrome 浏览器实现了`__proto__`来访问。  
实例化一个构造函数之后得到的实例化对象，它的`__proto__`属性就指向这个构造函数的`prototype`。

```
var sophie = new Person('sophie');
sophie.__proto__ === Person.prototype; // true
```

这个构造函数的原型对象也是对象，所以也有一个`__proto__`属性，它的构造函数是`Object`，所以构造函数的原型对象的`__proto__`指向`Object.prototype`。

```
Person.prototype.__proto__ === Object.prototype; // true
```

最后，`Object.prototype`的`_proto`属性指向`null`。

```
Object.prototype.__proto__ === null; //true
```

![avatar](http://osly086qe.bkt.clouddn.com/ppchain_sophie.jpg)

需要加以区分的是，构造函数自身相当于`new Function`，它也是对象，也有一个`__proto__`属性指向自身构造函数的原型对象，即`Function.prototype`。

```
Person.__proto__ === Function.prototype; // true
```

和构造函数的原型对象一样，`Function`的原型对象的`__proto__`也指向`Object.prototype`。最终指向`null`。

```
Function.prototype.__proto__ === Object.prototype; // true
```

![avatar](http://osly086qe.bkt.clouddn.com/ppchain_person.jpg)

补充情况，当使用`Object.create()`的时候，新生成对象的`__proto__`会指向所传的参数，而不是`Object.prototype`。

```
var ss = Object.create(sophie);
ss.__proto__ === sophie; // true
```

关于`prototype`和`__proto__`，推荐一篇个人觉得很好的博文：[三张图搞懂原型](https://www.cnblogs.com/shuiyi/p/5305435.html)。  
&nbsp;

### `new`

```
var new2 = function(func) {
  var obj = Object.create(func.prototype);
  var returnVal = func.call(obj);
  if (typeof returnVal === 'object') {
    return returnVal;
  } else {
    return obj;
  }
}
```

如上图所示，`new`创建了一个空对象，将这个对象的`__proto__`指向构造函数的原型对象，并且调用构造函数的`call()`改变`this`的指针，相当于在对象上复制构造函数`this`绑定的属性。如果构造函数返回的不是对象类型，那么就返回这个新创建的对象。

```
function Person() {}
Person.prototype.a = 1;
function Student() {}
Student.prototype = new Person();
Student.prototype.a === 1; // true
```

![avatar](http://osly086qe.bkt.clouddn.com/this_pp1.jpg)

```
function Person() { this.a = 2 };
Person.prototype.a = 1;
function Student() {}
Student.prototype = new Person();
Student.prototype.a === 2; // true
```

![avatar](http://osly086qe.bkt.clouddn.com/this_pp2.jpg)

```
function Person() { this.a = 2 };
Person.prototype.a = 1;
function Student() {};
Student.prototype = new Person();
var s = new Student();
s.a === 2; // true;
```

![avatar](http://osly086qe.bkt.clouddn.com/this_pp3.jpg)

```
function Person() { this.a = 2 };
Person.prototype.a = 1;
function Student() { this.a = 3 };
Student.prototype = new Person();
var s = new Student();
s.a === 3; // true;
```

![avatar](http://osly086qe.bkt.clouddn.com/this_pp4.jpg)
&nbsp;  
最后用一道题目，结束原型链。

```
function Parent(){
  this.a = 1;
  this.b = [2];
}
Parent.prototype.c = [3];
function Child(){}
Child.prototype = new Parent();

var cc = new Child(); // cc.a = 1, cc.b = [2], cc.c = [3]
cc.a = 's';
cc.b.push('s');
cc.c = ['s'];

console.log(cc); // {a: 's', c: ['s']}
console.log(Child.prototype.b); // [2, 's']
cc.b === Child.prototype.b; // true
console.log(Parent.prototype.c); // [3]
```

`cc`一开始是个空对象，通过原型链可以访问到`a`, `b`, `c`, `d`。给`cc`赋值会给它自身添加属性，一般不会修改原型链，除非修改的是引用类型。这里面也有区别，`cc.b`引用`Child.prototype.b`指向同一个对象, 所以会互相影响。而`cc.c`重新赋值指向一个新对象`['s']`，所以不会影响`Parent.prototype.c`。
