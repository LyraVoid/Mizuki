---
title: JS中的this真的太**傻**了
published: 2026-04-02
description: ''
image: ''
tags: []
category: 'JavaScript'
draft: false 
lang: ''
---

# JavaScript 中“this”的简单规则

总体规则是，函数被调用时通过检查其被调用位置（调用点 ）来确定。它遵循这些规则，按优先顺序排列。
大白话就是说,在上下文环境中, 谁调用了函数,this就指向谁


## 规则一: 如果调用函数时,使用了new关键字,函数内部的this就是全新的对象

    function ConstructorExample() {
        console.log(this);
        this.value = 10;
        console.log(this);
    }
    new ConstructorExample();
    // -> {}
    // -> { value: 10 }

## 规则二:如果使用apply,call,bind 来调用函数, 函数内部的this 就是作为参数传递的对象

    function fn() {
        console.log(this);
    }
    var obj = {
        value: 5
    };
    var boundFn = fn.bind(obj);
    boundFn();     // -> { value: 5 }
    fn.call(obj);  // -> { value: 5 }
    fn.apply(obj); // -> { value: 5 }

## 规则三:当函数作为对象的方法被调用时,函数内的this是调用该函数的对象

    var obj = {
        value: 5,
        printThis: function() {
            console.log(this);
        }
    };
    obj.printThis(); // -> { value: 5, printThis: ƒ }


##  规则四:作为普通函数中进行调用时,未满足以上所有规则时, 则该对象为全局对象 window/undefined

    function fn() {
        console.log(this);
    }
    // If called in browser:
    fn(); // -> Window {stop: ƒ, open: ƒ, alert: ƒ, ...}


注意其实这是一个隐式调用,和规则三类似. 区别在于未声明为方法的函数自动成为全局对象window的属性

当我们进行普通函数的调用时, 其实就是将函数进行 window.函数名() 的操作

    console.log(fn === window.fn); // -> true


## 如果存在多项规则的时候,那么较高规则(1号最高,4号最低)将决定this的值


##  如果函数是ES2015(ES6)中的箭头函数的话, 上面所有的规则都会进行忽略, this将会被设置为它被创建时的上下文

    const obj = {
        value: 'abc',
        createArrowFn: function() {
            return () => console.log(this);
        }
    };
    const arrowFn = obj.createArrowFn();
    arrowFn(); // -> { value: 'abc', createArrowFn: ƒ }



## 规则的应用

var obj = {
    value: 'hi',
    printThis: function() {
        console.log(this);
    }
};
var print = obj.printThis;
obj.printThis(); // -> {value: "hi", printThis: ƒ}
print(); // -> Window {stop: ƒ, open: ƒ, alert: ƒ, ...}


解释:  当我们使用obj.printThis 将函数作为对象方法来进行调用时,这属于规则三

而如果我们创建了一个函数表达式来对它进行普通函数调用时, 不使用new ,call ,bind ,apply 时,它就是规则四 

所以obj.printThis()中的this 就指向obj这个对象, 而print()执行后,this就指向了window/undefined 这个全局对象


# 切记切记!!!,this的指向规则不是一成不变的, 当多条规则都适用的时候,列表中较高的规则会获胜

    var obj1 = {
        value: 'hi',
        print: function() {
            console.log(this);
        },
    };
    var obj2 = { value: 17 };

## 如果规则二和规则三都适用,规则二优先

    obj1.print.call(obj2); // -> { value: 17 }
    
## 如果规则一和规则三都适用,则规则一优先

    new obj1.print(); // -> {}
