---
title: 一、Java基础面试题
date: 2023-06-26 15:26:49
order: 1
category:
  - java基础
  - 面试题
tag:
  - java基础
  - 面试题
author: 
  name: liuyangfang
  link: https://github.com/lyf110
---



# Java基础面试题

### 1、Java 中的几种基本数据类型是什么？对应的包装类型是什么？各自占用多少字节呢？

byte   [-128, 127]

short  [-2^15, 2^15-1]

int    [-2^31, 2^31 - 1] 

long   [-2^63, 2^63 - 1] 

float  [-2^31, 2^31 - 1] 

double [-2^63, 2^63 - 1] 

char   []

boolean



String 、 StringBuffer 和 StringBuilder 的区别是什么? String 为什么是不可变的?
String s1 = new String("abc");这段代码创建了几个字符串对象？
== 与 equals?hashCode 与 equals ?
包装类型的缓存机制了解么？
 自动装箱与拆箱了解吗？原理是什么？
 深拷贝和浅拷贝区别了解吗？什么是引用拷贝？
 谈谈对 Java 注解的理解，解决了什么问题？
Exception 和 Error 有什么区别？
 Java 反射？反射有什么缺点？你是怎么理解反射的（为什么框架需要反射）？
Java 泛型了解么？什么是类型擦除？介绍一下常用的通配符？
 内部类了解吗？匿名内部类了解吗？
 BIO,NIO,AIO 有什么区别?