---
title: 一、stream操作toMap的key重复问题
date: 2023-04-11 09:31:49
order: 1
category:
  - Lambda
  - 面试题
tag:
  - Lambda
  - 面试题
author: 
  name: liuyangfang
  link: https://github.com/lyf110
---



# 怎么解决Java8 stream操作toMap的key重复问题

## 1 java.util.stream.Collectors#toMap 接口说明

```java
public static <T, K, U>
    Collector<T, ?, Map<K,U>> toMap(Function<? super T, ? extends K> keyMapper,
                                    Function<? super T, ? extends U> valueMapper,
                                    BinaryOperator<U> mergeFunction) {
        return toMap(keyMapper, valueMapper, mergeFunction, HashMap::new);
    }
```

- 前两两个参数都是与之前一样 key 和 value得取值属性，
- 第三个参数是当key 发生重复时处理的方法，注释上的解释

## 2 案例演示-1

### 2.1 测试代码

```java
package cn.lyf.lambda.demo1;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.*;
import java.util.stream.Collectors;

/**
 * @author lyf
 * @version 1.0
 * @classname CollectorsToMapDemo
 * @description
 * @since 2022/12/30 15:32
 */
@Slf4j
public class CollectorsToMapDemo {
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    static class User {
        private Long id;
        private String name;
    }

    public static void main(String[] args) {
        List<User> list = new ArrayList<>(Arrays.asList(
                new User(1L, "zhangsan"),
                new User(2L, "lisi1"),
                new User(2L, "lisi2"),
                new User(3L, "wangwu1"),
                new User(3L, "wangwu2")
        ));

        // 解决方式1：使用后一个key覆盖前一个key
        Map<Long, String> map1 = list.stream().collect(Collectors.toMap(
                User::getId,
                User::getName,
                (v1, v2) -> v2));
        log.debug("解决方式1：使用后一个key覆盖前一个key: \n{}", map1);
        // 解决方式2：使用前一个key覆盖后一个key
        Map<Long, String> map2 = list.stream().collect(Collectors.toMap(
                User::getId,
                User::getName,
                (v1, v2) -> v1
        ));
        log.debug("解决方式2：使用前一个key覆盖后一个key: \n{}", map2);
        // 解决方式3：相同的key使用list进行收集
        Map<Long, List<String>> map3 = list.stream().collect(Collectors.toMap(
                User::getId,
                user -> new ArrayList<>(Collections.singletonList(user.getName())),
                (List<String> oldList, List<String> newList) -> {
                    oldList.addAll(newList);
                    return oldList;
                }
        ));
        log.debug("解决方式3：相同的key使用list进行收集: \n{}", map3);
    }
}
```

### 2.2 运行结果

```verilog
[DEBUG] 15:44:12.666 [main] c.l.l.demo1.CollectorsToMapDemo     - 解决方式1：使用后一个key覆盖前一个key: 
{1=zhangsan, 2=lisi2, 3=wangwu2} 
[DEBUG] 15:44:12.682 [main] c.l.l.demo1.CollectorsToMapDemo     - 解决方式2：使用前一个key覆盖后一个key: 
{1=zhangsan, 2=lisi1, 3=wangwu1} 
[DEBUG] 15:44:12.684 [main] c.l.l.demo1.CollectorsToMapDemo     - 解决方式3：相同的key使用list进行收集: 
{1=[zhangsan], 2=[lisi1, lisi2], 3=[wangwu1, wangwu2]}
```

## 3 案例演示-2

### 3.1 测试代码

```java
package cn.lyf.lambda.demo1;

import lombok.extern.slf4j.Slf4j;

import java.util.*;
import java.util.stream.Collectors;

/**
 * @author lyf
 * @version 1.0
 * @classname CollectorsToMapDemo2
 * @description
 * @since 2022/12/30 15:32
 */
@Slf4j
public class CollectorsToMapDemo2 {

    public static void main(String[] args) {
        List<String> list = new ArrayList<>(Arrays.asList(
                "zhangsan@18",
                "lisi@20",
                "lisi@25",
                "wangwu@27"
        ));

        // 解决方式1：使用后一个key覆盖前一个key
        Map<String, String> map1 = list.stream().map(str -> str.split("@")).collect(Collectors.toMap(
                strArr -> strArr[0],
                strArr -> strArr[1],
                (v1, v2) -> v2
        ));
        log.debug("解决方式1：使用后一个key覆盖前一个key: \n{}", map1);
        // 解决方式2：使用前一个key覆盖后一个key
        Map<String, String> map2 = list.stream().map(str -> str.split("@")).collect(Collectors.toMap(
                strArr -> strArr[0],
                strArr -> strArr[1],
                (v1, v2) -> v1
        ));
        log.debug("解决方式2：使用前一个key覆盖后一个key: \n{}", map2);
        // 解决方式3：相同的key使用list进行收集
        Map<String, List<String>> map3 = list.stream().map(str -> str.split("@")).collect(Collectors.toMap(
                strArr -> strArr[0],
                strArr -> new ArrayList<>(Collections.singletonList(strArr[1])),
                (List<String> oldList, List<String> newList) -> {
                    oldList.addAll(newList);
                    return oldList;
                }
        ));
        log.debug("解决方式3：相同的key使用list进行收集: \n{}", map3);
    }
}
```

### 3.2 运行结果

```verilog
[DEBUG] 15:53:05.687 [main] c.l.l.demo1.CollectorsToMapDemo2    - 解决方式1：使用后一个key覆盖前一个key: 
{lisi=25, zhangsan=18, wangwu=27} 
[DEBUG] 15:53:05.698 [main] c.l.l.demo1.CollectorsToMapDemo2    - 解决方式2：使用前一个key覆盖后一个key: 
{lisi=20, zhangsan=18, wangwu=27} 
[DEBUG] 15:53:05.700 [main] c.l.l.demo1.CollectorsToMapDemo2    - 解决方式3：相同的key使用list进行收集: 
{lisi=[20, 25], zhangsan=[18], wangwu=[27]}
```

## 4 总结

使用stream的toMap()函数时，当key重复，系统会报错相同的key不能形成一个map，那么需要解决这个问题。

一：相同key的情况下，丢弃重复的只保留一个。

二：相同key的情况下，把value变成list，形成Map<Object,List>
