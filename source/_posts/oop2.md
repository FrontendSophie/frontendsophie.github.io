---
title: 继承
date: 2017-02-25 22:28:49
categories: JavaScript
tags: [OOP, Interview]
---

本篇内容总结于慕课网的前端跳槽面试必备技巧，并进行了相应扩展。只有彻底明白[new](http://frontendsophie.com/javascript/2017/02/22/oop1.html)的工作原理，才能更好的理解继承。

### 构造函数实现继承

原理：使用`call()`或者`apply()`将父级构造函数的`this`指向子构造函数，相当于将父类的属性复制到子类中。  
缺点：父构造函数的原型对象上的属性和方法没有被继承。

```
function Parent1() {
  this.name = 'parent1';
}
function Child1() {
  Parent1.call(this);
  this.type = 'child1';
}
```

&nbsp;

### 原型链实现继承

原理：通过`new`使得`Child2.prototype.__proto__`指向`Parent2.prototype`从而形成原型链，可以向上查找父构造函数原型对象上的属性和方法。  
缺点：`s1.__proto__`和`s2.__proto__`都指向一个原型对象`Child2.prototype`，共用一个属性`play`，导致实例没有被隔离，会互相影响。

```
function Parent2() {
  this.play = [1, 2, 3];
}
function Child2() {}
Child2.prototype = new Parent2();

var s1 = new child2();
s1.play.push(4);
var s2 = new child2();
console.log(s1.play); // [1, 2, 3, 4]
console.log(s2.play); // [1, 2, 3, 4]
console.log(Child2.prototype.play); // [1, 2, 3, 4]
```

&nbsp;

### 组合继承

原理：结合构造函数和原型链的优点。  
缺点：父级构造函数执行了两次，`call()`已经复制了一份父类的属性，`Child3.prototype`上没必要再复制一次。而且`new`的时候，构造函数动态传参也很尴尬。

```
function Parent3() {
  this.name = 'parent3';
  this.play = [1, 2, 3];
}
function Child3() {
  Parent3.call(this);
  this.type = 'child3';
}
Child3.prototype = new Parent3();
```

&nbsp;

### 组合继承的优化 1

原理：直接将子类的`prototype`指向父类的`prototype`，绕过`new`中的隐藏`call()`调用。  
缺点：实例无法判断构造函数是哪个，由于子类和父类共用一个原型对象，子类原型对象的`constructor`就是父类原型对象的`constructor`，父类原型对象的`constructor`指向自己。一旦修改子类原型对象的`constructor`, 父类的也会被修改。

```
function Parent4() {
  this.name = 'parent4';
  this.play = [1, 2, 3];
}
function Child4() {
  Parent4.call(this);
  this.type = 'child4';
}
Child4.prototype = Parent4.prototype;

var s4 = new Child4();
s4 instanceof Child4; // true
s4 instanceof Parent4; // true
s4.constructor === Parent4; // true
```

&nbsp;

### 组合继承的优化 2

原理：`Object.create()`新建一个对象并将它的`__proto__`指向传入的参数，也就是`Child5.prototype.__proto__`指向`Parent5.prototype`。这样子类原型对象和父类原型就不是同一个对象，但又形成了原型链得以继承。

```
function Parent5() {
  this.name = 'parent5';
  this.play = [1, 2, 3];
}
function Child5() {
  Parent5.call(this);
  this.type = 'child5';
}
Child5.prototype = Object.create(Parent5.prototype);
Child5.prototype.constructor = Child5;
```

`Object.create()`很像没有隐式调用`call()`的`new`，它的兼容写法是：

```
if (!Object.create) {
  Object.create = function(proto) {
    var F = function(){};
    F.prototype = proto;
    return new F();
  }
}
```
