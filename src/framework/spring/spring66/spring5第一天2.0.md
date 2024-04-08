---
title: 一、Spring-day01
date: 2023-04-02 10:38:46
order: 1
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

# Spring5第一天

# 学习目标

- [ ] 能够描述spring框架
- [ ] 能够编写spring的IOC的入门案例
- [ ] 能够说出spring的bean标签的配置
- [ ] 能够理解Bean的属性注入方法
- [ ] 能够理解复杂类型的属性注入

# 第一章-Spring概述  

## 知识点-Spring介绍

### 1.目标

- [ ] 能够描述spring框架

### 2.路径

1. 什么是Spring
2. Spring 的发展历程 
3. Spring的优点   
4. Spring的体系结构

### 3.讲解

#### 3.1什么是Spring

​	Spring 是一个开源框架，是为了解决企业应用程序开发复杂性而创建的。

​	框架的主要优势之一就是其分层架构，分层架构允许您选择使用哪一个组件，同时为 J2EE 应用程序开发提供集成的框架。

​	简单来说，Spring是一个分层的JavaSE/EE full-stack(一站式) 轻量级开源框架。

​	一站式:Spring提供了三层解决方案.

#### 3.2Spring 的发展历程 

1997 年 IBM 提出了 EJB 的思想

1998 年， SUN 制定开发标准规范 EJB1.0  
1999 年， EJB1.1 发布
2001 年， EJB2.0 发布

2003 年， EJB2.1 发布 
2006 年， EJB3.0 发布
​

Rod Johnson（spring 之父） 
​	Expert One-to-One J2EE Design and Development(2002),阐述了 J2EE 使用 EJB 开发设计的优点及解决方案
​	Expert One-to-One J2EE Development without EJB(2004),阐述了 J2EE 开发不使用 EJB 的解决方式（Spring 雏形）

2017 年 9 月份发布了 spring 的最新版本 spring 5.0 通用版（GA）



#### 3.3Spring的优点   

1.方便解耦，简化开发

​	通过Spring提供的IoC容器，我们可以将对象之间的依赖关系交由Spring进行控制，避免硬编码所造成的过度程序耦合。有了Spring，用户不必再为单实例模式类、属性文件解析等这些很底层的需求编写代码，可以更专注于上层的应用。

2.AOP编程的支持

​	通过Spring提供的AOP功能，方便进行面向切面的编程，许多不容易用传统OOP实现的功能可以通过AOP轻松应付。

3.声明式事务的支持 

​	在Spring中，我们可以从单调烦闷的事务管理代码中解脱出来，通过声明式方式灵活地进行事务的管理，提高开发效率和质量。

4.方便程序的测试  

​	可以用非容器依赖的编程方式进行几乎所有的测试工作，在Spring里，测试不再是昂贵的操作，而是随手可做的事情。例如：Spring对Junit4支持，可以通过注解方便的测试Spring程序。

5.方便集成各种优秀框架 

​	Spring不排斥各种优秀的开源框架，相反，Spring可以降低各种框架的使用难度，Spring提供了对各种优秀框架（如Struts,Hibernate、Hessian、Quartz）等的直接支持。

6.降低Java EE API的使用难度 

​	Spring对很多难用的Java EE API（如JDBC，JavaMail，远程调用等）提供了一个薄薄的封装层，通过Spring的简易封装，这些Java EE API的使用难度大为降低。

#### 3.4Spring的体系结构

![img](./img01/tu_0.png)

### 4.小结

1. Spring是JavaSE/JavaEE 一系列框架, 提供了三层开发里面的技术解决方案. 是一站式的框架
2. 我们这四天学习的Spring是FrameWork部分
   + IOC
   + AOP



# 第二章-IOC

## 知识点-工厂模式解耦

### 1.目标

- [ ] 能够使用工厂模式进行解耦

### 2.路径

1. 程序耦合的概述

2. 使用工厂模式解耦 

### 3.讲解

#### 3.1程序的耦合 

##### 3.1.1程序耦合的概述

​	耦合性(Coupling)，也叫耦合度，是对模块间关联程度的度量。耦合的强弱取决于模块间接口的复杂性、调用模块的方式以及通过界面传送数据的多少。模块间的耦合度是指模块之间的依赖关系，包括控制关系、调用关系、数据传递关系。模块间联系越多，其耦合性越强，同时表明其独立性越差( 降低耦合性，可以提高其独立性)。 耦合性存在于各个领域，而非软件设计中独有的，但是我们只讨论软件工程中的耦合。
​	在软件工程中， 耦合指的就是就是对象之间的依赖性。对象之间的耦合越高，维护成本越高。因此对象的设计
应使类和构件之间的耦合最小。 软件设计中通常用耦合度和内聚度作为衡量模块独立程度的标准。 划分模块的一个
准则就是高内聚低耦合。
它有如下分类：
（1） 内容耦合。当一个模块直接修改或操作另一个模块的数据时，或一个模块不通过正常入口而转入另一个模块时，这样的耦合被称为内容耦合。内容耦合是最高程度的耦合，应该避免使用之。
（2） 公共耦合。两个或两个以上的模块共同引用一个全局数据项，这种耦合被称为公共耦合。在具有大量公共耦合的结构中，确定究竟是哪个模块给全局变量赋了一个特定的值是十分困难的。
（3） 外部耦合 。一组模块都访问同一全局简单变量而不是同一全局数据结构，而且不是通过参数表传递该全局变量的信息，则称之为外部耦合。
（4） 控制耦合 。一个模块通过接口向另一个模块传递一个控制信号，接受信号的模块根据信号值而进行适当的动作，这种耦合被称为控制耦合。
（5） 标记耦合 。若一个模块 A 通过接口向两个模块 B 和 C 传递一个公共参数，那么称模块 B 和 C 之间存在一个标记耦合。
（6） 数据耦合。模块之间通过参数来传递数据，那么被称为数据耦合。数据耦合是最低的一种耦合形式，系统中一般都存在这种类型的耦合，因为为了完成一些有意义的功能，往往需要将某些模块的输出数据作为另一些模块的输入数据。
（7） 非直接耦合 。两个模块之间没有直接关系，它们之间的联系完全是通过主模块的控制和调用来实
现的。
总结：
​	耦合是影响软件复杂程度和设计质量的一个重要因素，在设计上我们应采用以下原则：如果模块间必须存在耦合，就尽量使用数据耦合，少用控制耦合，限制公共耦合的范围，尽量避免使用内容耦合。内聚与耦合内聚标志一个模块内各个元素彼此结合的紧密程度，它是信息隐蔽和局部化概念的自然扩展。内聚是从功能角度来度量模块内的联系，一个好的内聚模块应当恰好做一件事。它描述的是模块内的功能联系。耦合是软件
结构中各模块之间相互连接的一种度量，耦合强弱取决于模块间接口的复杂程度、进入或访问一个模块的点以及通过接口的数据。 程序讲究的是低耦合，高内聚。就是同一个模块内的各个元素之间要高度紧密，但是各个模块之
间的相互依存度却要不那么紧密。 

​	内聚和耦合是密切相关的，同其他模块存在高耦合的模块意味着低内聚，而高内聚的模块意味着该模块同其他
模块之间是低耦合。在进行软件设计时，应力争做到高内聚，低耦合。 

##### 3.1.2在代码中体现

​	早期我们的 JDBC 操作，注册驱动时，我们为什么不使用 DriverManager 的 register 方法，而是采
用 Class.forName 的方式？

​	原因就是： 我们的类依赖了数据库的具体驱动类（MySQL） ，如果这时候更换了数据库（比如 Oracle） ，
需要修改源码来重新数据库驱动。这显然不是我们想要的。 

```java
/**
* 程序的耦合
* 耦合：程序间的依赖关系
* 包括：
* 		类之间的依赖
* 		方法间的依赖
* 解耦：
* 		降低程序间的依赖关系
* 实际开发中：
* 		应该做到：编译期不依赖，运行时才依赖。
* 解耦的思路：
*		第一步：使用反射来创建对象，而避免使用 new 关键字。
*		第二步：通过读取配置文件来获取要创建的对象全限定类名
*/
public class JdbcDemo1 {
    public static void main(String[] args) throws Exception{
        //1.注册驱动 
         //DriverManager.registerDriver(new Driver());
        Class.forName("com.mysql.jdbc.Driver");
        //2.获取连接
        //3.获取操作数据库的预处理对象
        //4.执行 SQL，得到结果集
        //5.遍历结果集
        //6.释放资源
    }
}
```

##### 3.1.3解决程序耦合的思路 

​	当是我们讲解 jdbc 时，是通过反射来注册驱动的，代码如下：

​	`Class.forName("com.mysql.jdbc.Driver");//此处只是一个字符串`

​	此时的好处是，我们的类中不再依赖具体的驱动类，此时就算删除 mysql 的驱动 jar 包，依然可以编译（运行就不要想了没有驱动不可能运行成功的） 。 

​	同时，也产生了一个新的问题， mysql 驱动的全限定类名字符串是在 java 类中写死的，一旦要改还是要修改源码。解决这个问题也很简单，使用配置文件配置 

#### 3.2.工厂模式解耦 

1. 原始方式

2. 接口方式
   + 定义接口, 定义实现类
   + 多态体现(接口=实现类对象)
3. 自定义IOC

##### 3.2.1原始方式开发

+ AccountDao .java

```java
public interface AccountDao {
    /**
     * 保存账户
     */
    void save();
}
```

+ AccountDaoImpl.java

```java
public class AccountDaoImpl implements AccountDao {
    /**
     * 保存账户
     */
    @Override
    public void save() {
        System.out.println("AccountDaoImpl... save()");
    }
}
```

+ AccountService.java

```java
public interface AccountService {
    /**
     * 保存账户
     */
    void save();
}
```

+ AccountServiceImpl.java

```java
public class AccountServiceImpl implements AccountService {
    /**
     * 保存账户
     */
    @Override
    public void save() {
        System.out.println("AccountServiceImpl... save()");
        AccountDao accountDao = new AccountDaoImpl();
        accountDao.save();
    }
}
```

+ Client.java

```java
public class Client {
    public static void main(String[] args) {
        AccountService accountService = new AccountServiceImpl();
        accountService.save();
    }

}
```

##### 3.2.2使用工厂模式解耦

###### 3.2.2.1工厂模式解耦思路

​	在实际开发中我们可以把三层的对象都使用配置文件配置起来，当启动服务器应用加载的时候， 让一个类中的方法通过读取配置文件，把这些对象创建出来并存起来。在接下来的使用的时候，直接拿过来用就好了。那么，这个读取配置文件， 创建和获取三层对象的类就是工厂

###### 3.2.2.2实现

+ 添加坐标依赖

```xml
  <dependencies>
    <!-- 解析 xml 的 dom4j -->
    <dependency>
      <groupId>dom4j</groupId>
      <artifactId>dom4j</artifactId>
      <version>1.6.1</version>
    </dependency>
    <!-- dom4j 的依赖包 jaxen -->
    <dependency>
      <groupId>jaxen</groupId>
      <artifactId>jaxen</artifactId>
      <version>1.1.6</version>
    </dependency>
    <!--单元测试-->
    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>4.10</version>
      <scope>test</scope>
    </dependency>
  </dependencies>
```

+ AccountDao .java

```java
public interface AccountDao {
    /**
     * 保存账户
     */
    void save();
}
```

- AccountDaoImpl.java

```java
public class AccountDaoImpl implements AccountDao {
    /**
     * 保存账户
     */
    @Override
    public void save() {
        System.out.println("AccountDaoImpl... save()");
    }
}
```

- AccountService.java

```java
public interface AccountService {
    /**
     * 保存账户
     */
    void save();
}
```

- AccountServiceImpl.java

```java
public class AccountServiceImpl implements AccountService {

    private AccountDao accountDao = (AccountDao) BeanFactory.getBean("accountDao");
    /**
     * 保存账户
     */
    @Override
    public void save() {
        System.out.println("AccountServiceImpl---saveAccount()");
        accountDao.save();
    }
}
```

- Client.java

```java
public class Client {

    public static void main(String[] args) {
        AccountService accountService = (AccountService) BeanFactory.getBean("accountService");
        accountService.save();
    }

}
```

+ BeanFactory.java

  下面的通过 BeanFactory 中 getBean 方法获取对象就解决了我们代码中对具体实现类的依赖。 

```java
public class BeanFactory {
	
	//定义map
	private static Map<String, Object> beans;

	static{
		try {
			beans = new HashMap<String, Object>();
			//解析xml, 初始化beans集合
			//1. 创建SaxReader对象
			SAXReader saxReader = new SAXReader();
			//2. 读取配置文件 获得document对象 
			Document document = saxReader.read(BeanFactory.class.getClassLoader().getResourceAsStream("applicationContext.xml"));
			//3. 获得所有的bean标签对象List
			List<Element> beanList = document.selectNodes("//bean");
			//4. 遍历
			for (Element element : beanList) {
				//获得id的属性值作为map的key
				String id = element.attributeValue("id");
				//获得class的属性值,反射得到对象作为map的value
				String className = element.attributeValue("class");
				beans.put(id, Class.forName(className).newInstance());
			}
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	
	public static Object getBean(String id){
		return beans.get(id);
	}
	
	
}
```

+ applicationContext.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans>
	<!--id就是接口的名字, class实现类的全限定名  -->
	<bean id="userDao" class="com.itheima.dao.impl.UserDaoImpl"></bean>
	<bean id="userService" class="com.itheima.service.impl.UserServiceImpl"></bean>
</beans>
```

### 4.小结

1. 先把配置文件的所有的bean标签解析出来
2. 创建对象
3. 把id作为key, 把对象作为value 存到容器(Map)

> 对象不需要我们创建了, 直接从容器里面取



## 知识点-IOC概念 

### 1.目标

- [ ] 能够理解IOC概念

### 2.路径

1. 分析和IOC的引入
2. IOC概述

### 3.讲解

#### 3.1分析和IOC的引入

上一小节我们通过使用工厂模式，实现了表现层——业务层以及业务层——持久层的解耦。
它的核心思想就是：
​	1、通过读取配置文件反射创建对象。
​	2、把创建出来的对象都存起来，当我们下次使用时可以直接从存储的位置获取。
这里面要解释两个问题：
​	第一个：存哪去？
​		分析：由于我们是很多对象，肯定要找个集合来存。这时候有 Map 和 List 供选择。
​		到底选 Map 还是 List 就看我们有没有查找需求。有查找需求，选 Map。
​		所以我们的答案就是:在应用加载时，创建一个 Map，用于存放三层对象。我们把这个 map 称之为容器。
​	第二个： 什么是工厂？
​		工厂就是负责给我们从容器中获取指定对象的类。这时候我们获取对象的方式发生了改变。
​		原来：我们在获取对象时，都是采用 new 的方式。 是主动的。 



+ 老方式

![img](./img01/tu_10.png)

+ 现在 我们获取对象时，同时跟工厂要，有工厂为我们查找或者创建对象。 是被动的。 

  ![img](./img01/tu_11.png)



#### 3.2IOC概述

​	IOC(inversion of control)的中文解释是“控制反转”，对象的使用者不是创建者.  作用是将对象的创建 反转给spring框架来创建和管理。

​	控制反转怎么去理解呢。 其实它反转的是什么呢，是对象的创建工作。 举个例子:平常我们在servlet或者service里面创建对象，都是使用new 的方式来直接创建对象，现在有了spring之后，我们就再也不new对象了，而是把对象创建的工作交给spring容器去维护。我们只需要问spring容器要对象即可

​	 ioc 的作用：削减计算机程序的耦合(解除我们代码中的依赖关系)。 

### 4.小结

1. IOC概念: 控制反转. 说白了: 就是把对象交给Spring框架去创建和管理. 我们要用对象, 直接从Spring的IOC容器【集合】里面获得
2. 好处: 解耦, 到时候我们只需要修改配置文件, 不需要修改源码

## 案例-Spring的IOC快速入门

### 1.需求

- [ ] 能够编写spring的IOC的入门案例

### 2.分析

​	本章我们使用的案例是， 账户的业务层和持久层的依赖关系解决。在开始 spring 的配置之前，我们要先准备

一下环境。由于我们是使用 spring 解决依赖关系，并不是真正的要做增删改查操作，所以此时我们没必要写实体
类。并且我们在此处使用的是 java 工程，不是 java web 工程。

### 3.实现

#### 3.0步骤

1. 创建Maven工程, 添加坐标
2. 准备好接口和实现类
3. 创建spring的配置文件 进行配置
4. 获得Spring的工厂, 从工厂里面获得对象, 调用



#### 3.1准备工作

##### 3.1.1准备 spring 的开发包 

官网： http://spring.io/ 
下载地址：http://repo.springsource.org/libs-release-local/org/springframework/spring
解压:(Spring 目录结构:)

* docs :API 和开发规范.
* libs :jar 包和源码.
* schema :约束. 

![img](./img01/tu_12.png)

我们上课使用的版本是 spring5.0.2。
特别说明：

​	spring5 版本是用 jdk8 编写的，所以要求我们的 jdk 版本是 8 及以上。  



##### 3.1.2接口和实现类

- AccountDao .java

```java
public interface AccountDao {
    /**
     * 保存账户
     */
    void save();
}
```

- AccountDaoImpl.java

```java
public class AccountDaoImpl implements AccountDao {
    /**
     * 保存账户
     */
    @Override
    public void save() {
        System.out.println("AccountDaoImpl---saveAccount()");

    }
}
```

- AccountService.java

```java
public interface AccountService {

    /**
     * 保存账户
     */
    void save();
}
```

- AccountServiceImpl.java

```java
public class AccountServiceImpl implements AccountService {

    /**
     * 保存账户
     */
    @Override
    public void save() {
        System.out.println("AccountServiceImpl---saveAccount()");
        AccountDao accountDao = new AccountDaoImpl();//TODO 耦合待解决
        accountDao.saveAccount();
    }
}
```

- Client.java

```java
public class Client {
    public static void main(String[] args) {
        AccountService accountService = new AccountServiceImpl();//TODO 耦合待解决
        accountService.save();
    }
}
```

#### 3.2代码实现

+ 创建 maven 工程并导入坐标 

![img](./img01/tu_13.png)

+ 坐标

```xml
<dependencies>
    <dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-context</artifactId>
    <version>5.0.2.RELEASE</version>
    </dependency>	
</dependencies>
```

+ 在类的根路径下创建spring的配置文件

+ 配置文件为任意名称的 xml 文件（不能是中文）,一般习惯名称为applicationContext.xml

  ![img](./img01/tu_14.png)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <!--注册Service-->
    <bean id="accountService" class="com.itheima.service.impl.AccountServiceImpl"></bean>
    <!--注册Dao-->
    <bean id="accountDao" class="com.itheima.dao.impl.AccountDaoImpl"></bean>

</beans>
```

+ 编写Java代码测试

```java
public class DbTest {
    @Test
    public void fun01() throws Exception {
        //1. 创建工厂
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("applicationContext.xml");
        //2. 根据id获得对象
        AccountService accountService = (AccountService) applicationContext.getBean("accountService");
        accountService.save();
  
    }
}
```

### 4.小结

#### 4.1步骤

1. 创建Maven工程,导入坐标
2. 创建接口和实现类
3. 创建applicationContext.xml(配置bean)
4. 获得Spring工厂, 从工厂里面获得对象, 调用

#### 4.2注意事项

1. 我们当前使用Spring的版本是5.0.2 只要版本>=5.0.0 JDK要求>=1.8

#### 

## 知识点-Spring 基于 XML 的 IOC 细节

### 1.目标

- [ ] 能够说出spring的bean标签的配置

### 2.路径

1. 配置文件详解(Bean标签)
2. bean的作用范围和生命周期 

### 3.讲解 

#### 3.1配置文件详解(Bean标签)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <!--
        bean标签: 注册bean, 把对象交给Spring管理
        1.【掌握】属性:
            id/name属性: 随便写,作为bean的唯一标识,不要重复(建议写接口的名字,首字母小写)
            class属性:  类的全限定名
            scope属性:  singleton 单例,  不管获得多少次 都是同一个, 创建出来存到Spring容器里面  【默认】
                        prototype 多例,  每获得一次 就创建一个新的对象,创建出来不会存到Spring容器里面

                        request 把创建的对象存到request域,针对web项目【了解】
                        session 把创建的对象存到session域,针对web项目【了解】
                        我们一般也是单例的, 特殊情况才是设置为prototype多例 eg:struts2里面的action
       2. 【了解】的属性
            init-method属性: 指定初始化方法,写方法名
            destroy-method属性: 指定销毁的方法, 象征着当前对象从Spring容器里面移除了 写方法名
    -->
    <bean id="accountService" class="com.itheima.service.impl.AccountServiceImpl" scope="prototype"
        init-method="initMethod" destroy-method="destoryMethod"
    ></bean>

</beans>
```

+ id/name属性

  ​	用于标识bean ， 其实id 和 name都必须具备唯一标识 ，两种用哪一种都可以。但是一定要唯一、 一般开发中使用id来声明. 

+ class属性: 用来配置要实现化类的全限定名

+ scope属性: 用来描述bean的作用范围

  ​	singleton: 默认值，单例模式。spring创建bean对象时会以单例方式创建。(默认)

  ​	prototype: 多例模式。spring创建bean对象时会以多例模式创建。	

  ​	request: 针对Web应用。spring创建对象时，会将此对象存储到request作用域。	

  ​	session: 针对Web应用。spring创建对象时，会将此对象存储到session作用域。	

+ init-method属性：spring为bean初始化提供的回调方法

+ destroy-method属性：spring为bean销毁时提供的回调方法. 销毁方法针对的都是单例bean ， 如果想销毁bean , 可以关闭工厂


#### 3.2bean的作用范围和生命周期 

+ 单例对象： scope="singleton"

  ​	一个应用只有一个对象的实例。它的作用范围就是整个引用。
  ​	生命周期：
  ​		对象出生：当应用加载，创建容器时，对象就被创建了。
  ​		对象活着：只要容器在，对象一直活着。
  ​		对象死亡：当应用卸载，销毁容器时，对象就被销毁了。

+ 多例对象： scope="prototype"

  ​	每次访问对象时，都会重新创建对象实例。
  ​	生命周期：
  ​		对象出生：当使用对象时，创建新的对象实例。
  ​		对象活着：只要对象在使用中，就一直活着。
  ​		对象死亡：当对象长时间不用时，被 java 的垃圾回收器回收了.

### 4.小结

1. 配置结构

```
<bean id/name="" class="" scope="" init-method="" destory-method=""></bean>
```

2. 单例和多例
   +  scope="singleton": 不管获得多少次对象, 都是用一个. Spring创建出来会存到Spring容器里面【默认】
   + scope="prototype": 每获得一次, 就创建一个新的. 并且这个对象不存到Spring容器里面



## 知识点-Spring工厂详解

### 1.目标

- [ ] 掌握Spring常见的工厂类

### 2.路径

1. spring 中工厂的类结构图
2. BeanFactory 和 ApplicationContext 的区别

### 3.讲解

#### 3.1spring 中工厂的类结构图

![1561506326545](./assets/1561506326545.png)

- ClassPathXmlApplicationContext：它是从类的根路径下加载配置文件 
- FileSystemXmlApplicationContext：推荐使用这种它是从磁盘路径上加载配置文件，配置文件可以在磁盘的任意位置。
- AnnotationConfigApplicationContext:当我们使用注解配置容器对象时，需要使用此类来创建 spring 容器。它用来读取注解。

#### 3.2BeanFactory 和 ApplicationContext 的区别

- ApplicationContext 是现在使用的工厂

  ```
  ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
  ```



- XmlBeanFactory是老版本使用的工厂,目前已经被废弃【了解】

  ```
  BeanFactory beanFactory = new XmlBeanFactory(new ClassPathResource("applicationContext.xml"));
  ```


两者的区别:

​	ApplicationContext加载方式是框架启动时就开始创建所有单例的bean,存到了容器里面

​	BeanFactory加载方式是用到bean时再加载(目前已经被废弃)



### 4.小结

1. 工厂类继承关系
   + BeanFactory
     + ==ApplicationContext==
       + ==ClassPathXmlApplicationContext   基于xml方式工厂(xml在类路径下)==
       + FileSystemXmlApplicationContext  基于xml方式工厂(xml可以不在类路径下)
       + ==AnnotationConfigApplicationContext 基于注解方式工厂==

2. 新旧工厂
   + 新工厂: 在工厂初始化的话的时候, 就会创建配置的所有的单例bean,存到Spring容器里面
   + 旧工厂(已经废弃了): 等用到对象的时候, 再创建



## 知识点-实例化 Bean 的三种方式【了解】

### 1.目标

- [ ] 了解实例化 Bean 的三种方式

### 2.路径

1. 无参构造方法方式 
2. 静态工厂方式
3. 实例工厂实例化的方法 

### 3.讲解

#### 3.1方式一:无参构造方法方式  

​	需要实例化的类，提供无参构造方法

​	配置代码

```xml
 <bean id="accountService" class="com.itheima.service.impl.AccountServiceImpl"></bean>
```

#### 3.2方式二:静态工厂方式

​	需要额外提供工厂类 ， 工厂方法是静态方法

```java
public class StaticFactory {
	public static Object getBean(){
		return new AccountServiceImpl02();
	}
}
```

​	配置代码

```xml
<!--方式二:静态工厂方式  -->	
<bean  id="accountService02" class="com.itheima.utils.StaticFactory" factory-method="getBean"/>
```

#### 3.3方式三:实例工厂实例化的方法 

创建实例化工厂类

```java
public class InstanceFactory {
	public Object getBean(){
		return new AccountServiceImpl03();
	}
}
```

配置

```xml
<!-- 方式三: 实例化工厂 -->
<!--注册工厂  -->
<bean id="factory" class="com.itheima.utils.InstanceFactory"></bean>
<!--引用工厂  -->
<bean  id="accountService03" factory-bean="factory" factory-method="getBean"/>
```

### 4.小结

1. 一般情况下不会使用第二和三种, 主要使用第一种



# 第三章-依赖注入

## 知识点-依赖注入概念

### 1.目标

- [ ] 掌握什么是依赖注入

### 2.讲解

​	依赖注入全称是 dependency Injection 翻译过来是依赖注入.其实就是如果我们托管的某一个类中存在属性，需要spring在创建该类实例的时候，顺便给这个对象里面的属性进行赋值。 这就是依赖注入。

​	现在, Bean的创建交给Spring了, 需要在xml里面进行注册

​	我们交给Spring创建的Bean里面可能有一些属性(字段), Spring帮我创建的同时也把Bean的一些属性(字段)给赋值, 这个赋值就是注入.

### 3.小结

1. 注册: 对象的创建交给Spring
2. 注入: 对象是Spring创建的, 创建对象的同时, 给对象的属性(字段)进行赋值.这个赋值就是注入



## 知识点-依赖注入实现

### 1.目标

- [ ] 能够理解Bean的属性注入方法
- [ ] 能够理解复杂类型的属性注入

### 2.路径

1. 构造方法方式注入
2. set方法方式的注入
3. P名称空间注入
4.  SpEL的属性注入

### 3.讲解

#### 3.1构造方法方式注入【掌握】

+ Java代码

  ```java
  public class AccountServiceImpl implements AccountService {
      private String name;
      public AccountServiceImpl(String name) {
          this.name = name;
      }
      @Override
      public void save() {
          System.out.println("AccountServiceImpl... save()"+name);

      }
  }
  ```

+ 配置文件

  ```xml
  <!--注册AccountService-->
   <bean id="accountService" class="com.itheima.service.impl.AccountServiceImpl">
      <constructor-arg name="name" value="张三"></constructor-arg>
  </bean>
  ```



#### 3.2set方法方式的注入【重点】

##### 3.2.1注入简单类型

+ java代码

  ```java
  public class AccountServiceImpl implements AccountService {
      private String name;

      public void setName(String name) {
          this.name = name;
      }

      @Override
      public void save() {
          System.out.println("AccountServiceImpl... save()"+name);

      }
  }
  ```

+ 配置文件

  ```xml
   <bean id="accountService" class="com.itheima.service.impl.AccountServiceImpl">
         <property name="name" value="李四"></property>
  </bean>
  ```

##### 3.2.2注入数组类型

+ java代码

  ```java
  public class AccountServiceImpl implements AccountService {
      private String[] hobbys;

      public void setHobbys(String[] hobbys) {
          this.hobbys = hobbys;
      }

      @Override
      public void save() {
          System.out.println("AccountServiceImpl... save()"+ Arrays.toString(hobbys));

      }
  }
  ```

+ 配置文件

  ```xml
      <bean id="accountService" class="com.itheima.service.impl.AccountServiceImpl">
          <property name="hobbys">
              <array>
                  <value>篮球</value>
                  <value>足球</value>
                  <value>乒乓球</value>
                  <value>排球</value>
              </array>
          </property>
      </bean>
  ```

##### 3.2.3注入Map类型

+ Java代码

  ```java
  public class AccountServiceImpl implements AccountService {
      private Map<String,String> map;

      public void setMap(Map<String, String> map) {
          this.map = map;
      }

      @Override
      public void save() {
          Set<Map.Entry<String, String>> set = map.entrySet();
          for (Map.Entry<String, String> entry : set) {
              System.out.println(entry.getKey()+":"+entry.getValue());
          }
          System.out.println("AccountServiceImpl... save()");

      }
  }
  ```

+ 配置文件

  ```xml
  <bean id="accountService" class="com.itheima.service.impl.AccountServiceImpl">
       <property name="map">
           <map>
                <entry key="akey" value="aaa"/>
                <entry key="bkey" value="bbb"/>
                <entry key="ckey" value="ccc"/>
           </map>
       </property>
  </bean>
  或者
  
  <bean id="accountService" class="com.itheima.service.impl.AccountServiceImpl">
      <property name="map">
  		<props>
  			<prop key="akey">aaa</prop>
  			<prop key="bkey">bbb</prop>
  			<prop key="ckey">ccc</prop>
  		</props>
  	</property>
  </bean>
  ```

##### 3.2.4注入Java对象类型

+ Java代码

  ```java
  public class AccountServiceImpl implements AccountService {
      private AccountDao accountDao;

      public void setAccountDao(AccountDao accountDao) {
          this.accountDao = accountDao;
      }
      @Override
      public void save() {

          System.out.println("AccountServiceImpl... save()");
          accountDao.save();

      }
  }
  ```

+ 配置文件

  ```xml
  <!--注册AccountService-->
  <bean id="accountService" class="com.itheima.service.impl.AccountServiceImpl">
      <property name="accountDao" ref="accountDao"></property>
  </bean>
  <!--注册accountDao-->
  <bean id="accountDao" class="com.itheima.dao.impl.AccountDaoImpl">
  </bean>
  ```

#### 3.3P名称空间注入【了解】 

​	Spring2.5以后提供了一种p名称空间和C名称空间的属性注入. 通过直接写属性名的方式注入属性值。

##### 3.3.1p名称空间的方式

+  提供属性的set方法


+ 在applicationContext.xml引入p命名空间`xmlns:p="http://www.springframework.org/schema/p"`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context" xmlns:p="http://www.springframework.org/schema/p"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd">
</beans>
```

+ 使用

```xml
<bean id="accountService" class="com.itheima.service.impl.AccountServiceImpl" p:name="张三">
  	
</bean>
```

#### 3.4 Spring3.0之后  SpEL的属性注入【了解】   

​	这种方式是使用spring 提供的一种表达式方式去赋值， 如果是给前面提过的几个类型注入赋值，那么使用spEL 表达式来注入赋值倒显得繁琐。但是这个spEL 方式赋值，最大的好处在于，它能像EL表达式一般，在里面进行运算、 逻辑判断,还可以调用其它Bean的属性和方法给当前属性赋值

+ 语法格式 ：  #{spEL} 

+ 类中存在一个属性 name  , 并且给定 set方法。 


```xml
  <property name="name" value="#{'张三'}" ></property>
```

### 4.小结

1. 构造方法方式

   + 定义变量, 提供构造方法
   + 在bean标签里面配置constructor-arg标签  这个标签里面配置name属性
     + value属性  简单类型
     + ref属性   引用类型

2. Set方法方式

   + 定义变量, 提供Set方法

   + 在bean标签里面配置property标签  这个标签里面配置name属性

     + value属性  简单类型
     + array标签  数组类型

     ```
     <property name="">
     	<array>
     		<value></value>
     	</array>
     </property>
     ```

     + map标签   map类型

     ```
     <property name="">
     	<map>
     		<entry key="" value=""></entry>
     	</array>
     </property>
     ```

     + ref 引用类型



# 作业【必做】

## 1.需求

实现账户表的增删改查操作 

+ 表

```mysql
create table account(
    id int primary key auto_increment,
    name varchar(40),
    money double
)character set utf8 collate utf8_general_ci;

insert into account(name,money) values('zs',1000);
insert into account(name,money) values('ls',1000);
insert into account(name,money) values('ww',1000);
```

+ 实体类

```java
public class Account implements Serializable {
	private Integer id;
	private String name;
	private Double money;
}
```

+ 依赖

```xml
  <dependencies>
    <!--druid连接池-->
    <dependency>
      <groupId>com.alibaba</groupId>
      <artifactId>druid</artifactId>
      <version>1.0.14</version>
    </dependency>
    <!--dbutils 类似JDBCTemplate--> 
    <dependency>
      <groupId>commons-dbutils</groupId>
      <artifactId>commons-dbutils</artifactId>
      <version>1.4</version>
    </dependency>
    <!--数据库驱动-->
    <dependency>
      <groupId>mysql</groupId>
      <artifactId>mysql-connector-java</artifactId>
      <version>5.1.6</version>
    </dependency>
    <!--单元测试-->
    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>4.12</version>
      <scope>test</scope>
    </dependency>
    <!--Spring核心-->
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-context</artifactId>
      <version>5.0.2.RELEASE</version>
    </dependency>
  </dependencies>
```

## 2.要求

1.独立编写实体类，业务层和持久层代码。 （此处不涉及表现层，创建 maven 的 jar 工程即可）
2.持久层技术采用 dbutils 实现。（不要用 Mybatis） 
3.连接池（数据源） druid 或者 c3p0 均可。
4.要求使用 junit 测试代码。
5.运用今天所学的 spring 基于 xml 的 ioc 实现业务层和持久层解耦。 
