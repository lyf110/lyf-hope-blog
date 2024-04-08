---
title: 三、Spring-day03
date: 2023-04-02 10:38:46
order: 3
category:
  - ssm
  - Spring
tag:
  - ssm
  - Spring
author:
  name: liu yang fang 
  link: https://github.com/lyf110
---

# spring5第三天

# 学习目标

- [ ] 能够理解AOP相关概念
- [ ] 能够说出AOP相关术语的含义
- [ ] 能够编写Spring的AOP中不同通知的代码
- [ ] 能够理解spring的AOP的注解

# 第一章-AOP相关的概念

## 知识点-AOP概述

### 1.目标

- [ ] 能够理解AOP相关概念

### 2.路径

1. 什么是AOP
2. AOP的作用和优势
3. AOP实现原理

### 3.讲解

#### 3.1什么是AOP

​	

![img](./img03/tu_1.png)

​	

​	AOP：全称是AspectOriented Programming, 即面向切面编程。在不修改源码的基础上，对我们的已有方法进行增强。

​	说白了就是把我们程序重复的代码抽取出来，在需要执行的时候，使用动态代理的技术，进行增强

#### 3.2AOP的作用和优势

**作用：**

    在程序运行期间，不修改源码对已有方法进行增强。 

**优势：**

    减少重复代码      

    提高开发效率      

    维护方便

#### 3.3AOP实现原理

​	使用动态代理技术 

### 4.小结

1. AOP: 面向切面编程.
2. 作用:  不修改源代码的情况下, 对目标方法进行增强
3. 原理: 动态代理



## 知识点-AOP的具体应用

### 1.需求

​	在所有的dao层的save()方法逻辑调用之前,进行权限的校验

### 2.分析

在AOP 这种思想还没有出现的时候，我们解决 切面的问题思路无非有以下两种：

1. 方式一:通过静态方法实现(缺点:需要修改源码,后期不好维护)

   ​	把需要添加的代码抽取到一个地方，然后在需要添加那些方法中引用

2. 方式二:通过继承方案来解决(缺点:需要修改源码,继承关系复杂,后期不好维护)

   ​	抽取共性代码到父类， 子类在需要的位置，调用父类方法。

上述两种方式的缺点

​       都会打破原来代码的平静（也就是必须要修改代码 ， 或者就是必须事先固定好。） 如果我们想在原有代码基础上扩展。 并且不改动原来的代码, 就可以使用AOP了。

​	其实AOP 字面直译过来是面向切面编程，其实通俗一点它就是对我们的具体某个方法进行了增强而已。在之前我们对某个方法进行增强无非是两种手段 ，一种是装饰者模式 、 一种是代理模式 （静态代理 & 动态代理） 。 AOP 的底层使用的是动态代理方式 。  

### 3.实现

​	AOP 的底层动态代理实现有两种方案。 

​	一种是使用JDK的动态代理。 这种是早前我们在前面的基础增强说过的。 这一种主要是针对有接口实现的情况。 它的底层是创建接口的实现代理类， 实现扩展功能。也就是我们要增强的这个类，实现了某个接口，那么我就可以使用这种方式了. 而另一种方式是使用了cglib 的动态代理，这种主要是针对没有接口的方式，那么它的底层是创建被目标类的子类，实现扩展功能.

#### 3.1JDK方式  

==要求: 必须有接口==   

```java
public class B_JDKProxy {

    @Test
    public void fun01(){
         AccountDao accountDao = new AccountDaoImpl();

        AccountDao proxyDao =  (AccountDao) Proxy.newProxyInstance(accountDao.getClass().getClassLoader(), accountDao.getClass().getInterfaces(), new InvocationHandler() {
            @Override
            public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
                if("save".equals(method.getName())){
                    System.out.println("权限校验...");
                    return method.invoke(accountDao,args);
                }
                return method.invoke(accountDao, args);
            }
        });
        proxyDao.save();
    }
}
```

#### 3.2CgLib方式

+ 添加坐标

```xml
  <dependencies>
    <!--Spring核心容器-->
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-context</artifactId>
      <version>5.0.2.RELEASE</version>
    </dependency>
    <!--SpringAOP相关的坐标-->
    <dependency>
      <groupId>org.aspectj</groupId>
      <artifactId>aspectjweaver</artifactId>
      <version>1.8.7</version>
    </dependency>
    
    <!--Spring整合单元测试-->
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-test</artifactId>
      <version>5.0.2.RELEASE</version>
    </dependency>
    <!--单元测试-->
    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>4.12</version>
      <scope>test</scope>
    </dependency>
  </dependencies>
```

- 使用CgLib方式实现: 第三方的代理机制，不是jdk自带的.  没有实现接口的类产生代理，使用的是字节码的增强技术，其实就是产生这个类的子类。

  ==不需要有接口==

```java
public class C_CglibProxy {
    @Test
    public void fun01(){
         AccountDaoImpl accountDao = new AccountDaoImpl();

        //创建enhancer对象
        Enhancer enhancer  = new Enhancer();
        //设置代理的父类
        enhancer.setSuperclass(AccountDaoImpl.class);

        enhancer.setCallback(new MethodInterceptor() {

            @Override
            public Object intercept(Object obj, Method method, Object[] args, MethodProxy methodProxy) throws Throwable {
                if("save".equals(method.getName())){
                    System.out.println("权限校验...");
                    return method.invoke(accountDao, args);
                }
                return method.invoke(accountDao, args);
            }
        });

        AccountDaoImpl accountDaoProxy = (AccountDaoImpl) enhancer.create();
        accountDaoProxy.save();
    }
}
```

### 4.小结

1. AOP的底层就是封装了动态代理

   + JDK的动态代理
   + CgLib的动态代理

2. JDK的动态代理: 依赖接口的, 必须有接口

   CgLib的动态代理: 依赖类的(父类), 不需要接口的



# 第二章-Spring中的AOP

## 知识点-AOP术语

### 1.目标

- [ ] 能够说出AOP相关术语的含义

### 2.路径

1. Spring中的AOP说明
2. AOP中的术语

### 3.讲解

#### 3.1 学习spring中的AOP要明确的事

+ 开发阶段（我们做的）

  ​	编写核心业务代码（开发主线）：大部分程序员来做，要求熟悉业务需求。
  ​	把公用代码抽取出来，制作成通知。（开发阶段最后再做）：AOP编程人员来做。
  ​	在配置文件中，声明切入点与通知间的关系，即切面：AOP编程人员来做。

+ 运行阶段（Spring框架完成的）

  ​	Spring框架监控切入点方法的执行。一旦监控到切入点方法被运行，使用代理机制，动态创建目标对象的代理对象，根据通知类别，在代理对象的对应位置，将通知对应的功能织入，完成完整的代码逻辑运行。

​	在spring中，框架会根据目标类是否实现了接口来决定采用哪种动态代理的方式。

#### 3.2.AOP中的术语  

- JoinPoint: 连接点

  ​	类里面哪些方法可以被增强，这些方法称为连接点. 在spring的AOP中，指的是所有现有的方法。

- Pointcut: 切入点

  ​	 在类里面可以有很多方法被增强，但是实际开发中，我们只对具体的某几个方法而已，那么这些实际增强的方法就称之为切入点

- Advice: 通知/增强 

  ​	增强的逻辑、称为增强，比如给某个切入点(方法) 扩展了校验权限的功能，那么这个校验权限即可称之为增强 或者是通知

  ​	通知分为:

  ​		前置通知： 在原来方法之前执行. 

  ​		后置通知： 在原来方法之后执行. 特点: 可以得到被增强方法的返回值

  ​		环绕通知：在方法之前和方法之后执行. 特点:可以阻止目标方法执行

  ​		异常通知： 目标方法出现异常执行. 如果方法没有异常,不会执行. 特点:可以获得异常的信息

  ​		最终通知： 指的是无论是否有异常，总是被执行的。


- Aspect: 切面

  ​	切入点和通知的结合。

  ![img](./img03/tu_2.png)

![img](./img03/tu_3.png)

### 4.小结

1. 使用AOP: 逻辑需要我们写的, 怎么切是Spring做(运行阶段), 源码阶段看不到
2. 术语:

![1561709532706](./img03/1561709532706.png) 

![1561709552788](./img03/1561709552788.png) 

切面: 让通知和切入点进行结合

## 知识点-基于XML的AOP配置

### 1.目标

- [ ] 能够编写Spring的AOP中不同通知的代码

### 2.路径

1. 前置通知
2. 后置通知
3. 环绕通知
4. 异常通知
5. 最终通知

### 3.讲解

#### 3.1前置通知

需求: 在dao的save()方法调用之前进行权限的校验

实现步骤: 

1. 导入坐标
2. 定义dao和增强的逻辑
3. 创建applicationContext.xml 注册dao和增强的逻辑
4. 在applicationContext.xml配置AOP

实现:

- 导入坐标

```xml
  <dependencies>
    <!--Spring核心容器-->
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-context</artifactId>
      <version>5.0.2.RELEASE</version>
    </dependency>
    <!--SpringAOP相关的坐标-->
    <dependency>
      <groupId>org.aspectj</groupId>
      <artifactId>aspectjweaver</artifactId>
      <version>1.8.7</version>
    </dependency>
    
    <!--Spring整合单元测试-->
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-test</artifactId>
      <version>5.0.2.RELEASE</version>
    </dependency>
    <!--单元测试-->
    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>4.12</version>
      <scope>test</scope>
    </dependency>
  </dependencies>
```

- 导入约束

  ```java
  <beans xmlns="http://www.springframework.org/schema/beans"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:aop="http://www.springframework.org/schema/aop" xsi:schemaLocation="
      http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
      http://www.springframework.org/schema/aop http://www.springframework.org/schema/aop/spring-aop.xsd"> 
  ```

- 定义被增强的业务逻辑类和切面类(增强的)

  ```java
  //被增强的类
  public class AccountDaoImpl implements AccountDao {

      @Override
      public void save() {
          System.out.println("save()...");
      }
  }

  //增强的类(切面类)
  public class MyAscept {
      public void checkPrivilege() {// 通知
          System.out.println("权限的校验...");
      }
  }
  ```

- xml中声明 增强的bean （扩展的bean） 和 被增强的bean (被扩展的bean)

  ```xml
  <!--注册accountDao-->
  <bean id="accountDao" class="com.itheima.dao.impl.AccountDaoImpl"/>
  <!--注册增强(切面)类-->
  <bean id="myAscept" class="com.itheima.aspect.MyAscept"/>
  ```

- 定义aop的配置

  ```xml
  
          <!--配置切入点(哪个包下的哪个类哪个方法需要增强)
         expression="execution(* com.xyz.myapp.service.*.*(..))"
         第一个* 表示返回值 ，不管任何返回值。 匹配任意返回值
         com.xyz.myapp.service : 表示这个包下
         第二个* 表示这个包下的所有类
         第三个* 表示这个包下的所有类中的所有方法
         (..) : 这个表示方法的参数 .. 任意参数
         spring 根据这一套规则，能够找到具体哪一个方法来做增强了。
      -->
          -->
       <!--配置AOP-->
      <aop:config>
          <aop:pointcut id="pointCut01" expression="execution(* com.itheima.dao.impl.AccountDaoImpl.save(..))"/>
          <!--配置切面(切入点和通知的结合)-->
          <aop:aspect ref="myAscept">
              <!--前置通知-->
              <aop:before method="checkPrivilege" pointcut-ref="pointCut01"></aop:before>
          </aop:aspect>
      </aop:config>      
  </aop:config>
  ```

#### 3.2后置通知

需求: 在delete()方法调用之后, 打印日志是谁删除的

步骤:

1. 导入坐标
2. 定义dao和增强的逻辑
3. 创建applicationContext.xml 配置dao和增强的逻辑
4. 配置AOP



-  在原来方法之后执行. 特点: 可以得到被增强方法的返回值 `<aop:after-returning  .../>`

  ```java
  <!--后置通知  -->
  <aop:after-returning method="showLog" pointcut-ref="pointCut2" returning="obj"/>
  
  ```
#### 3.3环绕通知

需求: 计算出dao里面的findAll()方法执行的时间. findAll()方法执行之前打印一下系统时间, findAll()方法执行之后再打印一下系统时间

步骤:

1. 导入坐标
2. 定义dao和增强的逻辑
3. 创建applicationContext.xml 配置dao和增强的逻辑
4. 配置AOP



- 在方法之前和方法之后执行. 特点:可以阻止目标方法执行 `<aop:around .../>`

  ```java
      //环绕通知(ProceedingJoinPoint 代表目标方法)
      public void showTime(ProceedingJoinPoint joinPoint) throws Throwable {
          //打印系统时间
          System.out.println("调用之前的时间="+System.currentTimeMillis());
          //执行目标方法
          joinPoint.proceed();
          //打印系统时间
          System.out.println("调用之后的时间="+System.currentTimeMillis());
  
      }
  
  //配置
  <!--环绕通知  -->
  <aop:around method="showTime" pointcut-ref="pointCut3"/>
  ```

#### 3.4异常通知

- 方法出现异常执行. 如果方法没有异常,不会执行. 特点:可以获得异常的信息  `<aop:after-throwing .../>`

  ```java
  增强的方法:
  public void afterThrowing(Throwable e){
  	System.out.println("异常抛出通知========"+e.getMessage());
  }
  
  配置文件:
  <aop:after-throwing method="afterThrowing" throwing="e" pointcut-ref="pointCut4"/>
  ```

#### 3.5最终通知

-  指的是无论是否有异常，总是被执行的。 `<aop:after .../>`

  ```xml
  <!--最终通知  -->
  <aop:after method="after" pointcut-ref="pointCut4"/>	
  ```

### 4.小结

1. 创建工程, 导入坐标
2. 创建被增强的类和增强的类
3. 在Spring的配置文件里面注册被增强的类和增强的类
4. 配置AOP
   + 配置切入点
   + 配置切面
     + 配置通知

```xml
    <aop:config>
        <aop:pointcut id="" expression=""/>
    
        <aop:aspect ref="">
            <aop:before method="" pointcut-ref=""/>
        </aop:aspect>
    </aop:config>
```







## 知识点-基于注解的AOP配置

### 1.目标

- [ ] 能够理解spring的AOP的注解

### 2.分析

#### 2.1路径

1. 前置通知
2. 后置通知
3. 环绕通知
4. 异常通知
5. 最终通知

#### 2.2步骤

1. 开启AOP注解
2. 在增强的类上面添加@Aspect注解
3. 在增强的类的方法上面添加通知的注解
   + 前置通知  @Before()
   + 后置通知  @AfterReturning()
   + 环绕通知  @Around()
   + 异常通知 @AfterThrowing()
   + 最终通知 @After()

### 3.讲解

#### 3.1前置通知

+ 添加坐标

```xml
  <dependencies>
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-context</artifactId>
      <version>5.0.2.RELEASE</version>
    </dependency>
    <dependency>
      <groupId>org.aspectj</groupId>
      <artifactId>aspectjweaver</artifactId>
      <version>1.8.7</version>
    </dependency>
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-test</artifactId>
      <version>5.0.2.RELEASE</version>
    </dependency>
    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>4.12</version>
    </dependency>
  </dependencies>
```

- 定义被增强的业务逻辑类

  ```java
  //被增强的类
  public class AccountDaoImpl implements AccountDao {
      @Override
      public void save() {
          System.out.println("save()...");
      }
  }
  ```


- 定义切面类,在切面增强类上面使用注解 @Aspect并且在切面类中定义切入点方法

  ```java
  @Aspect
  public class MyAscept {
      @Before(value = "execution(* com.itheima.dao.impl.AccountDaoImpl.save(..))")
      public void checkPrivilege() {// 通知
          System.out.println("权限的校验...");
      }
  }
  ```

- 创建配置文件

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <beans xmlns="http://www.springframework.org/schema/beans"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:aop="http://www.springframework.org/schema/aop"
         xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/aop http://www.springframework.org/schema/aop/spring-aop.xsd">
  
      <!--注册accountDao-->
      <bean id="accountDao" class="com.itheima.dao.impl.AccountDaoImpl"/>
      <!--注册切面类-->
      <bean id="myAscept" class="com.itheima.aspect.MyAscept"/>
      <!--开启AOP注解-->
      <aop:aspectj-autoproxy/>
  </beans>
  ```

#### 3.2.后置通知

- @AfterReturning:后置通知

  ```java
  @AfterReturning(value = "execution(* com.itheima.dao.impl.AccountDaoImpl.delete(..))",returning="obj")
  public void showLog(Object obj) {
          System.out.println("显示删除之后的日志..." + obj);
  }
  ```

#### 3.3环绕通知

- @Around:环绕通知

  ```java
  // 打印时间(环绕通知)
      @Around(value = "execution(* com.itheima.dao.impl.AccountDaoImpl.findAll(..))")
      public void showTime(ProceedingJoinPoint joinPoint) throws Throwable {
          System.out.println("执行之前的时间:" + System.currentTimeMillis());
          //执行findAll
          joinPoint.proceed();
          System.out.println("执行之后的时间:" + System.currentTimeMillis());
  
      }
  ```

#### 3.4异常通知

- @AfterThrowing:异常抛出通知

  ```java
      //测试异常通知
      @AfterThrowing(value="execution(* com.itheima.dao.impl.AccountDaoImpl.update(..))",throwing="e")
      public void showException(Throwable e) {
          System.out.println("异常通知...." + e.getMessage());
      }
  ```

#### 3.5最终通知


- @After:最终通知

  ```java
      //测试最终通知
      @After(value = "execution(* com.itheima.dao.impl.AccountDaoImpl.update(..))")
      public void showFinal() {
          System.out.println("最终通知...");
      }
  ```

### 4.小结 

1. 开启AOP注解
2. 在增强类上面添加@Aspect注解
3. 在增强类的增强方法上面添加注解
   + 前置通知  @Before()
   + 后置通知  @AfterReturning()
   + 环绕通知  @Around()
   + 异常通知 @AfterThrowing()
   + 最终通知 @After()

#  第三章-Spring5 的新特性【了解】

## 知识点-Spring5 的新特性

### 1.目标

- [ ] 了解Spring5 的新特性

### 2.路径

1. 与 JDK 相关的升级
2. 核心容器的更新
3. JetBrains Kotlin 语言支持
4. 响应式编程风格
5. Junit5 支持
6. 依赖类库的更新

### 3.讲解

#### 3.1与 JDK 相关的升级

##### 3.1.1jdk 版本要求

​	spring5.0 在 2017 年 9 月发布了它的 GA（通用）版本。 

​	该版本是基于 jdk8 编写的， 所以 jdk8 以下版本将无法使用。 同时，可以兼容 jdk9 版本。
注：
​	我们使用 jdk8 构建工程，可以降版编译。但是不能使用 jdk8 以下版本构建工程。

##### 3.1.2利用 jdk8 版本更新的内容

- 基于 JDK8 的反射增强  

```java
public class Test {
    //循环次数定义： 10 亿次
    private static final int loopCnt = 1000 * 1000 * 1000;
    public static void main(String[] args) throws Exception {
        //输出 jdk 的版本
        System.out.println("java.version=" + System.getProperty("java.version"));
        t1();
        t2();
        t3();
    }
    // 每次重新生成对象
    public static void t1() {
        long s = System.currentTimeMillis();
        for (int i = 0; i < loopCnt; i++) {
            Person p = new Person();
            p.setAge(31);
        }
        long e = System.currentTimeMillis();
        System.out.println("循环 10 亿次创建对象的时间： " + (e - s));
    }
    // 同一个对象
    public static void t2() {
        long s = System.currentTimeMillis();
        Person p = new Person();
        for (int i = 0; i < loopCnt; i++) {
            p.setAge(32);
        }
        long e = System.currentTimeMillis();
        System.out.println("循环 10 亿次给同一对象赋值的时间： " + (e - s));
    }
    //使用反射创建对象
    public static void t3() throws Exception {
        long s = System.currentTimeMillis();
        Class<Person> c = Person.class;
        Person p = c.newInstance();
        Method m = c.getMethod("setAge", Integer.class);
        for (int i = 0; i < loopCnt; i++) {
            m.invoke(p, 33);
        }
        long e = System.currentTimeMillis();
        System.out.println("循环 10 亿次反射创建对象的时间： " + (e - s));
    }
    static class Person {
        private int age = 20;
        public int getAge() {
            return age;
        }
        public void setAge(Integer age) {
            this.age = age;
        }
    }
}
```

![img](./img03/tu_20.png)

- @NonNull 注解和@Nullable 注解的使用 

  ​	用 @Nullable 和 @NotNull 注解来显示表明可为空的参数和以及返回值。这样就够在编译的时候处理空值而不是在运行时抛出 NullPointerExceptions。 

- 日志记录方面  

  ​	Spring Framework 5.0 带来了 Commons Logging 桥接模块的封装, 它被叫做 spring-jcl 而不是标准的 Commons Logging。当然，无需任何额外的桥接，新版本也会对 Log4j 2.x, SLF4J, JUL( java.util.logging) 进行自动检测。 

#### 3.2.核心容器的更新

​	Spring Framework 5.0 现在支持候选组件索引作为类路径扫描的替代方案。该功能已经在类路径扫描器中添加，以简化添加候选组件标识的步骤。应用程序构建任务可以定义当前项目自己的 META-INF/spring.components 文件。在编译时，源模型是自包含的， JPA 实体和 Spring 组件是已被标记的。从索引读取实体而不是扫描类路径对于小于 200 个类的小型项目是没有明显差异。但对大型项目影响较大。加载组件索引开销更低。因此，随着类数的增加，索引读取的启动时间将保持不变。	加载组件索引的耗费是廉价的。因此当类的数量不断增长，加上构建索引的启动时间仍然可以维持一个常数,不过对于组件扫描而言，启动时间则会有明显的增长。	这个对于我们处于大型 Spring 项目的开发者所意味着的，是应用程序的启动时间将被大大缩减。虽然 20	或者 30 秒钟看似没什么，但如果每天要这样登上好几百次，加起来就够你受的了。使用了组件索引的话，就能帮助你每天过的更加高效。

​	你可以在 Spring 的 Jira 上了解更多关于组件索引的相关信息。 

#### 3.3.JetBrains Kotlin 语言支持

​	Kolin概述：是一种支持函数式编程编程风格的面向对象语言。 Kotlin 运行在 JVM 之上，但运行环境并不
限于 JVM。    

- Kolin 的示例代码：

```java
{

  ("/movie" and accept(TEXT_HTML)).nest {GET("/", movieHandler::findAllView)

	 		 GET("/{card}", movieHandler::findOneView)
 		}

  ("/api/movie" and accept(APPLICATION_JSON)).nest {

  GET("/", movieApiHandler::findAll)

  GET("/{id}", movieApiHandler::findOne)

  }

}
```

- Kolin 注册 bean 对象到 spring 容器：

```java
val context = GenericApplicationContext {
  registerBean()
  registerBean { Cinema(it.getBean()) }
}
```

#### 3.4.响应式编程风格

​	此次 Spring 发行版本的一个激动人心的特性就是新的响应式堆栈 WEB 框架。这个堆栈完全的响应式且非阻塞，适合于事件循环风格的处理，可以进行少量线程的扩展。
​	Reactive Streams 是来自于 Netflix, Pivotal, Typesafe, Red Hat, Oracle, Twitter 以及Spray.io 的工程师特地开发的一个 API。它为响应式编程实现 的实现提供一个公共 的 API，好实现Hibernate 的 JPA。这里 JPA 就是这个 API, 而 Hibernate 就是实现。Reactive Streams API 是 Java 9 的官方版本的一部分。在 Java 8 中, 你会需要专门引入依赖来使用 Reactive Streams API。Spring Framework 5.0 对于流式处理的支持依赖于 Project Reactor 来构建, 其专门实现了Reactive Streams API。
​	Spring Framework 5.0 拥有一个新的 spring-webflux 模块，支持响应式 HTTP 和 WebSocket 客
户端 Spring Framework 5.0 还提供了对于运行于服务器之上，包含了 REST, HTML, 以及 WebSocket 风格交互的响应式网页应用程序的支持。在 spring-webflux 中包含了两种独立的服务端编程模型：基于注解：使用到了@Controller 以及 Spring MVC 的其它一些注解；使用 Java 8 lambda 表达式的函数式风格的路由和处理。有 了 Spring Webflux, 你 现 在 可 以 创 建 出 WebClient, 它 是 响 应 式 且 非 阻 塞 的 ， 可 以 作 为RestTemplate 的一个替代方案。 

- 这里有一个使用 Spring 5.0 的 REST 端点的 WebClient 实现：

```java
WebClient webClient = WebClient.create();
Movie movie = webClient.get().uri("http://localhost:8080/movie/42").accept(MediaType.APPLICATION_JSON)
.exchange().then(response -> response.bodyToMono(Movie.class)); 
```

#### 3.5.Junit5 支持

​	完全支持 JUnit 5 Jupiter，所以可以使用 JUnit 5 来编写测试以及扩展。此外还提供了一个编程以及扩展模型， Jupiter 子项目提供了一个测试引擎来在 Spring 上运行基于 Jupiter 的测试。
​	另外， Spring Framework 5 还提供了在 Spring TestContext Framework 中进行并行测试的扩展。针对响应式编程模型， spring-test 现在还引入了支持 Spring WebFlux 的 WebTestClient 集成测试的支持，类似于 MockMvc，并不需要一个运行着的服务端。使用一个模拟的请求或者响应， WebTestClient就可以直接绑定到 WebFlux 服务端设施。
​	你可以在这里找到这个激动人心的 TestContext 框架所带来的增强功能的完整列表。当然， Spring Framework 5.0 仍然支持我们的老朋友 JUnit! 在我写这篇文章的时候， JUnit 5 还只是发展到了 GA 版本。对于 JUnit4， Spring Framework 在未来还是要支持一段时间的。

#### 3.6.依赖类库的更新

- 终止支持的类库 

  ​	Portlet.
  ​	Velocity.
  ​	JasperReports.
  ​	XMLBeans.
  ​	JDO.
  ​	Guava.

- 支持的类库

  ​	Jackson 2.6+
  ​	EhCache 2.10+ / 3.0 GA
  ​	Hibernate 5.0+
  ​	JDBC 4.0+
  ​	XmlUnit 2.x+
  ​	OkHttp 3.x+
  ​	Netty 4.1+ 

  



# 四,作业

## 1 作业(必做)

实现两个版本的配置

    第一个版本：基于XML的的配置，使用三种常用通知类型(前置,后置,环绕)

    第二个版本：基于注解的配置，使用三种常用通知类型(前置,后置,环绕)

## 2.作业二 (选做)

把旅游项目全部换成IOC和注入

旅游线路里面的取消收藏    

.....

