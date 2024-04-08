---
title: 一、MyBatis-day01
date: 2023-04-02 10:38:46
order: 1
category:
  - ssm
  - Mybatis
  - 数据库中间件 
tag:
  - ssm
  - Mybatis
  - 数据库中间件 
author:
  name: liu yang fang 
  link: https://github.com/lyf110
---

# day01-MyBatis

# 学习目标

+ 能够了解什么是框架
+ 掌握Mybatis框架开发快速入门
+ 掌握Mybatis框架的基本CRUD操作
+ 掌握Mybatis的参数深入
+ 掌握SqlMapConfig.xml配置文件 

# 第一章-框架概述 

## 知识点-框架概述

### 1.目标

- [ ] 能够了解什么是框架

### 2.路径

1. 什么是框架 
2. 框架要解决的问题 
3. 分层开发下的常见框架 

### 3.讲解

#### 3.1什么是框架 

​	框架（Framework）是整个或部分系统的可重用设计，表现为一组抽象构件及构件实例间交互的方法;另一种定义认为，框架是可被应用开发者定制的应用骨架。前者是从应用方面而后者是从目的方面给出的定义。

​	==简而言之，框架是软件(系统)的半成品，框架封装了很多的细节，使开发者可以使用简单的方式实现功能,大大提高开发效率。== 

​	eg: 开发项目当做表演节目.  框架当做舞台.  我们开发者当做演员.  演员不需要关注舞台怎么搭建的, 关注点在于怎么把节目表演的好看. 

#### 3.2框架要解决的问题 

​	框架要解决的最重要的一个问题是==技术整合==的问题，在 J2EE 的 框架中，有着各种各样的技术，不同的软件企业需要从J2EE 中选择不同的技术，这就使得软件企业最终的应用依赖于这些技术，技术自身的复杂性和技术的风险性将会直接对应用造成冲击。而应用是软件企业的核心，是竞争力的关键所在，因此应该将应用自身的设计和具体的实现技术解耦。这样，软件企业的研发将集中在应用的设计上，而不是具体的技术实现，技术实现是应用的底层支撑，它不应该直接对应用产生影响。

​	 框架一般处在低层应用平台（如 J2EE）和高层业务逻辑之间的中间层。

#### 3.3分层开发下的常见框架 

​	通过分层更好的实现了各个部分的职责，在每一层将再细化出不同的框架，分别解决各层关注的问题。

![img](./img01/tu_14.png)

### 4.小结

1. 框架: 软件半成品. 封装了很多细节, 让我们开发项目更加的快速和高效
2. 三层架构下面常见框架:
   + web层: SpringMVC, struts2
   + 业务层: Spring
   + 持久层: MyBatis, Hibernate



## 知识点-MyBatis框架概述

### 1.目标

- [ ] 能够了解什么是MyBatis

### 2.路径

1. jdbc 程序回顾
2. MyBatis框架概述 

### 3.讲解

#### 3.1jdbc 程序回顾

##### 3.1.1程序回顾

+ 注册驱动
+ 获得连接
+ 创建预编译sql语句对象
+ 设置参数, 执行
+ 处理结果
+ 释放资源

```java
    public static void main(String[] args) {
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        try {
            //1.加载数据库驱动 
            Class.forName("com.mysql.jdbc.Driver");
            //2.通过驱动管理类获取数据库链接
            connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/mybatis?characterEncoding=utf-8", "root", "123456");
            //3.定义 sql 语句 ?表示占位符  
            String sql = "select * from user where username = ?";
            //4.获取预处理 statement
            preparedStatement = connection.prepareStatement(sql);
            //5.设置参数，第一个参数为 sql 语句中参数的序号（从 1 开始），第二个参数为设置的参数值
            preparedStatement.setString(1, "王五");
            //6.向数据库发出 sql 执行查询，查询出结果集
            resultSet = preparedStatement.executeQuery();
            //7.遍历查询结果集
            while (resultSet.next()) {
                System.out.println(resultSet.getString("id") + "
                        "+resultSet.getString(" username"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
		//8.释放资源
            if (resultSet != null) {
                try {
                    resultSet.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
            if (preparedStatement != null) {
                try {
                    preparedStatement.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
            if (connection != null) {
                try {
                    connection.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
    }
```

##### 3.1.2jdbc 问题分析 

1. 数据库链接创建、释放频繁造成系统资源浪费从而影响系统性能，如果使用数据库链接池可解决此问题。
2. Sql 语句在代码中硬编码，造成代码不易维护，实际应用 sql 变化的可能较大， sql 变动需要改变java 代码。 
3. 使用 preparedStatement 向占有位符号传参数存在硬编码，因为 sql 语句的 where 条件不一定，可能多也可能少，修改 sql 还要修改代码，系统不易维护。  
4. 对结果集解析存在硬编码（查询列名）， sql 变化导致解析代码变化，系统不易维护，如果能将数据库记录封装成 pojo 对象解析比较方便 

#### 3.2MyBatis框架概述  

​	==mybatis 是一个优秀的基于 java 的持久层框架，它内部封装了 jdbc==，使开发者只需要关注 sql 语句本身，而不需要花费精力去处理加载驱动、创建连接、创建 statement 等繁杂的过程。

​	mybatis 通过xml 或注解的方式将要执行的各种statement 配置起来，并通过java 对象和statement 中sql的动态参数进行映射生成最终执行的 sql 语句，最后由 mybatis 框架执行 sql并将结果映射为 java 对象并返回。

​	采用 ORM 思想解决了实体和数据库映射的问题， 对jdbc 进行了封装，屏蔽了jdbc api 底层访问细节，使我们不用与 jdbc api打交道，就可以完成对数据库的持久化操作。

官网: http://www.mybatis.org/mybatis-3/

### 4.小结

1. 为什么要学习MyBatis?

   ​	不管是JDBC还是JDBCTemplate都要一些缺点, 在MyBatis都进行了解决

   ​	工作里面Dao以MyBatis或者SpringDataJPA为主

2. 什么是MyBatis?

   ​	是持久层的一个框架, 封装了JDBC. 用MyBatis操作数据库, 性能很优秀的, 可以让SQL和java代码分离

# 第二章-Mybatis入门

## 案例-Mybatis快速入门  

### 1.需求

- [ ] 使用MyBatis查询所有的用户, 封装到List集合

### 2.分析

0. 创建数据库
1. 创建Maven工程(jar), 添加坐标
2. 创建pojo
3. 创建Dao接口  
4. 创建Dao映射文件(编写sql语句)
5. 创建SqlMapConfig.xml(配置四个基本项...)
6. 编写Java代码操作数据库

### 3.实现

#### 3.1准备工作

+ 数据库

```sql
CREATE DATABASE mybatis_day01;
USE mybatis_day01;
CREATE TABLE t_user(
		uid int PRIMARY KEY auto_increment,
		username varchar(40),
	 	sex varchar(10),
		birthday date,
		address varchar(40)
);

INSERT INTO `t_user` VALUES (null, 'zs', '男', '2018-08-08', '北京');
INSERT INTO `t_user` VALUES (null, 'ls', '女', '2018-08-30', '武汉');
INSERT INTO `t_user` VALUES (null, 'ww', '男', '2018-08-08', '北京');
```

#### 3.2.MyBatis快速入门

 ![img](./img01/tu_10.png)



##### 3.2.1创建Maven工程(jar)导入坐标

```xml
  <dependencies>
    <!--MyBatis坐标-->
    <dependency>
      <groupId>org.mybatis</groupId>
      <artifactId>mybatis</artifactId>
      <version>3.4.5</version>
    </dependency>
    <!--mysql驱动-->
    <dependency>
      <groupId>mysql</groupId>
      <artifactId>mysql-connector-java</artifactId>
      <version>5.1.6</version>
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

##### 3.2.2创建User实体类

+ User .java

```java
public class User implements Serializable{
    private int uid; //用户id
    private String username;// 用户姓名
    private String sex;// 性别
    private Date birthday;// 生日
    private String address;// 地址
	
}
```

##### 3.2.3创建 UserDao 接口

- UserDao 接口就是我们的持久层接口（也可以写成 UserMapper) .我们就写成UserDao ,具体代码如下： 

```java
public interface UserDao {
    public List<User> findAll();
}
```

##### 3.2.4创建 UserDao.xml 映射文件

注意:  该文件要放在com/itheima/dao里面, 不要写成com.itheima.dao

 ![1544705827942](./img01/1544705827942.png)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<!--namespace属性: 接口类的全限定名-->
<mapper namespace="com.itheima.dao.UserDao">
    <!--select标签: 查询
        id属性: 方法名
        resultType属性: 写方法返回值类型(如果是list,直接写实体类的全限定名)
        标签体: sql语句
    -->
    <select id="findAll" resultType="com.itheima.bean.User">
        select * from t_user;
    </select>
</mapper>
```

##### 3.2.5创建 SqlMapConfig.xml 配置文件

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>

    <!--配置连接数据库的环境 default:指定使用哪一个环境-->
    <environments default="a">
        <environment id="development">
            <!--配置事务,MyBatis事务用的是jdbc-->
            <transactionManager type="JDBC"/>
            <!--配置连接池, POOLED:使用连接池(mybatis内置的); UNPOOLED:不使用连接池-->
            <dataSource type="POOLED">
                <property name="driver" value="com.mysql.jdbc.Driver"/>
                <property name="url" value="jdbc:mysql://localhost:3306/mybatis_day01?characterEncoding=utf-8"/>
                <property name="username" value="root"/>
                <property name="password" value="123456"/>
            </dataSource>
        </environment>
        <environment id="a">
            <!--配置事务,MyBatis事务用的是jdbc-->
            <transactionManager type="JDBC"/>
            <!--配置连接池, POOLED:使用连接池(mybatis内置的); UNPOOLED:不使用连接池-->
            <dataSource type="POOLED">
                <property name="driver" value="com.mysql.jdbc.Driver"/>
                <property name="url" value="jdbc:mysql://localhost:3306/mybatis_day02?characterEncoding=utf-8"/>
                <property name="username" value="root"/>
                <property name="password" value="123456"/>
            </dataSource>
        </environment>
    </environments>

    <mappers>
        <!--引入映射文件; resource属性: 映射文件的路径-->
        <mapper resource="com/itheima/dao/UserDao.xml"/>
    </mappers>
</configuration>
```

##### 3.2.6测试

```java
public class DbTest {
    @Test
    public void fun01() throws Exception {
        //1. 读取SqlMapConfig.xml获得输入流
        InputStream is = Resources.getResourceAsStream("SqlMapConfig.xml");
        //2.创建SqlSessionFactory
        SqlSessionFactoryBuilder builder = new SqlSessionFactoryBuilder();
        SqlSessionFactory sqlSessionFactory = builder.build(is);
        //3. 获得SqlSession
        SqlSession sqlSession = sqlSessionFactory.openSession();
        //4.获得UserDao代理对象
        UserDao userDao = sqlSession.getMapper(UserDao.class);
        //5.调用方法
        List<User> list = userDao.findAll();
        System.out.println(list);
        //6.释放资源
        sqlSession.close();
    }
}
```

### 4.小结

#### 4.1步骤

1. 创建Maven工程, 导入坐标(需要驱动坐标)
2. 创建pojo
3. 创建Dao接口
4. 创建Dao映射文件(sql语句)
5. 创建SqlMapConfig.xml主配置文件(四个基本项+导入映射文件)
6. 编写Java代码

#### 4.2注意实现

1. 需要导入驱动坐标
2. Dao映射文件目录应该写/

![1561016383171](./img01/1561016383171.png) 



## 知识点-Mapper动态代理方式规范

### 1.目标

- [ ] 掌握Mapper动态代理方式规范

### 2.路径

1. 入门案例回顾
2. 规范
3. Java代码里面用到设计模式

### 3.讲解

#### 3.1入门案例回顾

##### 3.1.2Mapper.xml(映射文件)

​	定义mapper映射文件UserDao.xml，需要修改namespace的值为 UserDao接口全限定名。将UserDao.xml放在classpath的xxx.xxx.dao目录下

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.itheima.dao.UserDao">
    <select id="findAll" resultType="User">
        SELECT *FROM t_user
    </select>
</mapper>
```

##### 3.1.2Mapper.java(dao接口)

```java
public interface UserDao {

    /**
     * 查询所有的用户
     * @return
     */
    List<User> findAll();

}
```

##### 3.2.3测试

```java
public class DbTest {

      @Test
    public void fun01() throws Exception {
        SqlSession sqlSession = SqlSessionFactoryUtils.openSession();
        //4.获得UserDao代理对象
        UserDao userDao = sqlSession.getMapper(UserDao.class);
        //5.调用方法
        List<User> list = userDao.findAll();
        System.out.println(list);
        //6.释放资源
        sqlSession.close();
    }

    @Test
    public void fun02() throws Exception {
        SqlSession sqlSession = SqlSessionFactoryUtils.openSession();
        UserDao userDao = sqlSession.getMapper(UserDao.class);

        User user = new User("王二麻子","男",new Date(),"广州");
        userDao.save(user);
        sqlSession.commit();

        sqlSession.close();
    }

}
```

#### 3.2代理方式规范

Mapper接口开发需要遵循以下规范： 

1、 Mapper.xml文件中的namespace必须和mapper(Dao)接口的全限定名相同。

2、Mapper.xml文件中select,update等的标签id的值必须和mapper(Dao)接口的方法名相同

3、Mapper.xml文件中select,update等的标签的parameterType必须和mapper(Dao)接口的方法的形参类型对应

4, Mapper.xml文件中select,update等的标签的resultType必须和mapper(Dao)接口的方法的返回值类型对应

5,  Mapper.xml文件的文件名尽量和mapper(Dao)接口的名字一样

6, Mapper.xml文件的路径尽量和mapper(Dao)接口的路径在同一层目录

#### 3.3java代码里面设计模式

![1561017283666](./img01/1561017283666.png)

### 4.小结

1. 代理方式规范
   + dao映射文件里面的namespace必须写dao接口类的全限定名
   + dao映射文件select,update标签的id属性必须写dao接口里面的方法名
   + dao映射文件select,update标签的parameterType属性必须和dao接口里面的方法里面形参类型一致
   + dao映射文件select,update标签的resultType属性必须和dao接口里面的方法的返回值类型一致
   + dao映射文件的名字尽量和dao接口名一样
   + dao映射文件的路径和dao接口路径的层级一致





## 知识点-核心配置文件详解

### 1.目标

- [ ] 掌握SqlMapConfig.xml配置文件

### 2.路径

1. 核心配置文件的顺序
2. properties
3. typeAliases
4. Mapper

### 3.讲解

#### 3.1.核心配置文件的顺序

**properties（引入外部properties文件）**

settings（全局配置参数）

**typeAliases（类型别名）**

typeHandlers（类型处理器）

objectFactory（对象工厂）

plugins（插件）

**environments（环境集合属性对象）**

​	environment（环境子属性对象）

​		transactionManager（事务管理）

​		dataSource（数据源）

**mappers（映射器）**

#### 3.2.properties

步骤:

1. 抽取四个基本项到jdbc.properties
2. 在SqlMapConfig.xml使用properties标签引入jdbc.properties
3. 动态获得赋值



- jdbc.properties

```properties
jdbc.driver=com.mysql.jdbc.Driver
jdbc.url=jdbc:mysql://localhost:3306/mybatis_day01?characterEncoding=utf-8
jdbc.user=root
jdbc.password=123456
```

- 引入到核心配置文件

```xml
<configuration>
   <properties resource="jdbc.properties">
    </properties>
    <!--数据源配置-->
    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"/>
            <dataSource type="UNPOOLED">
                <property name="driver" value="${jdbc.driver}"/>
                <property name="url" value="${jdbc.url}"/>
                <property name="username" value="${jdbc.user}"/>
                <property name="password" value="${jdbc.password}"/>
            </dataSource>
        </environment>
    </environments>
    ....
</configuration>
```

#### 3.3.typeAliases（类型别名）

##### 3.3.1定义单个别名【了解】

- 核心配置文件

```xml
<typeAliases>
      <typeAlias type="com.itheima.bean.User" alias="user"></typeAlias>
 </typeAliases>
```

- 修改UserDao.xml

```java
<select id="findAll" resultType="user">
    SELECT  * FROM  user
</select>
```

##### 3.3.2批量定义别名【重点】

使用package定义的别名：就是pojo的类名，大小写都可以

- 核心配置文件

```xml
<typeAliases>
    <package name="com.itheima.bean"/>
</typeAliases>
```

- 修改UserDao.xml

```java
<select id="findAll" resultType="user">
         SELECT  * FROM  user
</select>
```

#### 3.4.Mapper

##### 3.4.1方式一:引入映射文件路径

```xml
<mappers>
     <mapper resource="com/itheima/dao/UserDao.xml"/>
 </mappers>
```

##### 3.4.2方式二:扫描接口

注: 此方式只能用作:代理开发模式,原始dao方式不能使用.

- 配置单个接口

```xml
<mappers>
 	<mapper class="com.itheima.dao.UserDao"></mapper>
</mappers>
```

- 批量配置

```xml
<mappers>
   <package name="com.itheima.dao"></package>
</mappers>
```

### 4.小结

1. 顺序

![1561020102361](./img01/1561020102361.png) 

2. properties（属性）

   + 定义jdbc.properties, 建议这个key写前缀

   ![1561020153801](./img01/1561020153801.png) 

3. typeAliases

   + 批量取别名

   ```xml
   <typeAliases>
   <!--方式二: 批量取别名, 以包为单位;
   name属性: 包名 【当前包里面的所有的类都有别名了, 别名就是类的名字, 忽略大小写, 建议直接写类名】
   -->
   <package name="com.itheima.pojo"></package>
   </typeAliases>
   ```

   > 建议直接写类名

4. mappers

   + 批量导入映射

   ```xml
       <mappers>
           <!--直接写包名(映射文件和接口名字一致,同一级 )-->
           <package name="com.itheima.dao"/>
       </mappers>
   ```

   > 映射文件和接口名字一致,同一级



# 第三章-MyBatis进阶

## 案例-使用Mybatis完成CRUD

### 1.需求

- [ ] 使用Mybatis完成CRUD

### 2.分析

1. 查询 定义select标签
2. 更新 定义update标签
3. 删除 定义delete标签
4. 新增 定义insert标签

标签里面的id属性就写方法名

标签体里面写sql语句

标签里面的parameterType需要和方法的参数类型一致

标签里面的resultType需要和方法的返回值类型一致

### 3.实现

#### 3.1新增用户

##### 3.1.1实现步骤

- UserDao中添加新增方法 

```java
public interface UserDao {
    /**
     * 保存用户
     * @param user
     */
    void save(User user);
}
```

- 在 UserDao.xml 文件中加入新增配置 

```xml
    <insert id="save" parameterType="com.itheima.bean.User">
        INSERT INTO t_user(username,sex,birthday,address) VALUES (#{username},#{sex},#{birthday},#{address})
    </insert>

	<!--我们可以发现， 这个 sql 语句中使用#{}字符， #{}代表占位符，我们可以理解是原来 jdbc 部分所学的?，它们都是代表占位符， 具体的值是由 User 类的 username 属性来决定的。
	parameterType 属性：代表参数的类型，因为我们要传入的是一个类的对象，所以类型就写类的
全名称。-->
```

- 添加测试类中的测试方法 

```java
    @Test
    public void fun02() throws Exception {
        //1. 读取SqlMapConfig.xml获得输入流
        InputStream is = Resources.getResourceAsStream("SqlMapConfig.xml");
        //2.创建SqlSessionFactory
        SqlSessionFactoryBuilder builder = new SqlSessionFactoryBuilder();
        SqlSessionFactory sqlSessionFactory = builder.build(is);
        //3. 获得SqlSession
        SqlSession sqlSession = sqlSessionFactory.openSession();
        //4.获得UserDao代理对象
        UserDao userDao = sqlSession.getMapper(UserDao.class);

        //5.调用方法
        User user = new User("赵六","男",new Date(),"广州");
        userDao.save(user);
        sqlSession.commit();

        //6.释放资源
        sqlSession.close();
    }
```

##### 3.1.2新增用户 id 的返回值 

​	新增用户后， 同时还要返回当前新增用户的 id 值，因为 id 是由数据库的自动增长来实现的，所以就相当于我们要在新增后将自动增长 auto_increment 的值返回。 

- 方式一 SelectKey获取主键

| **属性**    | **描述**                                                     |
| ----------- | ------------------------------------------------------------ |
| keyProperty | selectKey 语句结果应该被设置的目标属性。                     |
| resultType  | 结果的类型。MyBatis 通常可以算出来,但是写上也没有问题。MyBatis 允许任何简单类型用作主键的类型,包括字符串。 |
| order       | 这可以被设置为 BEFORE 或 AFTER。如果设置为 BEFORE,那么它会首先选择主键,设置 keyProperty 然后执行插入语句。如果设置为 AFTER,那么先执行插入语句,然后是 selectKey 元素-这和如  Oracle 数据库相似,可以在插入语句中嵌入序列调用。 |

  UserDao.xml

```xml
    <!--parameterType属性: 参数的类型 ;  赋值的时候直接写对象里面的属性名-->
    <insert id="save" parameterType="com.itheima.bean.User">
        <!--presultType: 主键类型; keyProperty:pojo里面对应的id的属性名; order属性: 指定是在目标的sql语句之前还是之后执行 -->
        <selectKey resultType="int" keyProperty="uid" order="AFTER">
            SELECT LAST_INSERT_ID()
        </selectKey>
        INSERT INTO t_user(username,sex,birthday,address)VALUES(#{username},#{sex},#{birthday},#{address})
    </insert>
```

- 方式二属性配置

  UserDao.xml

```xml
<insert id="save" parameterType="com.itheima.bean.User" keyProperty="uid" useGeneratedKeys="true">
        INSERT INTO t_user(username,sex,birthday,address) VALUES (#{username},#{sex},#{birthday},#{address})
    </insert>
```

##### 3.1.3新增用户 id 的返回值(字符串类型)

```xml
<insert id="save" parameterType="com.itheima.bean.User">
    <selectKey  keyProperty="id" resultType="string" order="BEFORE">
        select uuid()
    </selectKey>
        INSERT INTO t_user(username,sex,birthday,address) VALUES (#{username},#{sex},#{birthday},#{address})
</insert>
```

#### 3.2修改用户

- UserDao中添加新增方法 

```java
public interface UserDao {
    /**
     * 更新用户
     * @param user
     */
    void  update(User user);
}
```

- 在 UserDao.xml 文件中加入新增配置 

```xml
<update id="update" parameterType="com.itheima.bean.User">
    UPDATE t_user SET username=#{username},sex=#{sex},birthday=#{birthday},address=#{address} WHERE uid=#{uid}
</update>
```

- 添加测试类中的测试方法 

```java
    @Test
    public void fun03() throws Exception {
        InputStream is = Resources.getResourceAsStream("SqlMapConfig.xml");
        SqlSessionFactoryBuilder builder = new SqlSessionFactoryBuilder();
        SqlSessionFactory sqlSessionFactory = builder.build(is);
        SqlSession sqlSession = sqlSessionFactory.openSession();
        UserDao userDao = sqlSession.getMapper(UserDao.class);

        User user = new User("王二","女",new Date(),"广州");
        user.setUid(11);
        userDao.update(user);

        sqlSession.commit();
        sqlSession.close();
    }
```

#### 3.3删除用户

- UserDao中添加新增方法 

```java
public interface UserDao {

    /**
     * 删除用户
     * @param uid
     */
    void delete(int uid);
}
```

- 在 UserDao.xml 文件中加入新增配置 

```xml
<delete id="delete" parameterType="int">
    DELETE FROM t_user WHERE uid = #{uid}
</delete>
```

- 添加测试类中的测试方法 

```java
    @Test
    public void fun04() throws Exception {
        InputStream is = Resources.getResourceAsStream("SqlMapConfig.xml");
        SqlSessionFactoryBuilder builder = new SqlSessionFactoryBuilder();
        SqlSessionFactory sqlSessionFactory = builder.build(is);
        SqlSession sqlSession = sqlSessionFactory.openSession();
        UserDao userDao = sqlSession.getMapper(UserDao.class);

        userDao.delete(11);

        sqlSession.commit();
        sqlSession.close();
    }
```

#### 3.4模糊查询

##### 3.4.1 方式一

- UserDao 中添加新增方法 

```java
public interface UserDao {
    /**
     * 模糊查询
     * @param firstName
     * @return
     */
    List<User> findByFirstName(String firstName);
}
```

- 在 UserDao.xml 文件中加入新增配置 

```xml
<select id="findByFirstName" parameterType="string" resultType="com.itheima.bean.User">
  	SELECT * FROM t_user WHERE username LIKE #{firstName}
</select>
```

- 添加测试类中的测试方法 

```java
    @Test
    public void fun05() throws Exception {
        InputStream is = Resources.getResourceAsStream("SqlMapConfig.xml");
        SqlSessionFactoryBuilder builder = new SqlSessionFactoryBuilder();
        SqlSessionFactory sqlSessionFactory = builder.build(is);
        SqlSession sqlSession = sqlSessionFactory.openSession();
        UserDao userDao = sqlSession.getMapper(UserDao.class);

        List<User> list = userDao.findByFirstName("王%");
        System.out.println(list);

        sqlSession.commit();
        sqlSession.close();
    }
```

##### 3.4.2 方式二

- UserDao 中添加新增方法 

```java
public interface UserDao {
    /**
     * 模糊查询
     * @param firstName
     * @return
     */
    List<User> findByFirstName02(String firstName);
}
```

- 在 UserMapper.xml 文件中加入新增配置 

```xml
    <select id="findByFirstName02" parameterType="string" resultType="com.itheima.bean.User">
        SELECT * FROM t_user WHERE username LIKE '${value}%'
    </select>
```

​	` 我们在上面将原来的#{}占位符，改成了${value}。注意如果用模糊查询的这种写法，那么${value}的写法就是固定的，不能写成其它名字。` 

- 添加测试类中的测试方法 

```java
    @Test
    public void fun06() throws Exception {
        InputStream is = Resources.getResourceAsStream("SqlMapConfig.xml");
        SqlSessionFactoryBuilder builder = new SqlSessionFactoryBuilder();
        SqlSessionFactory sqlSessionFactory = builder.build(is);
        SqlSession sqlSession = sqlSessionFactory.openSession();
        UserDao userDao = sqlSession.getMapper(UserDao.class);

        List<User> list = userDao.findByFirstName02("王");
        System.out.println(list);

        sqlSession.commit();
        sqlSession.close();
    }
```

##### 3.4.3 #{}与${}的区别【面试】

1. `#{}`表示一个占位符号  
   + 通过`#{}`可以实现 preparedStatement 向占位符中设置值,自动进行 java 类型和 数据库 类型转换 
   +  `#{}`可以有效防止 sql 注入 
   +  `#{}`可以接收简单类型值(基本类型,String)或 pojo 属性值
   +   如果 parameterType 传输单个简单类型值(基本类型,String)， `#{}` 括号中可以是 value 或任意其它名称。
2. `${}`表示拼接 sql 串
   + 通过`${}`可以将 parameterType 传入的内容拼接在 sql 中且不进行 jdbc 类型转换. 
   + `${}`不能防止 sql 注入
   + `${}`可以接收简单类型值或 pojo 属性值
   + ==如果 parameterType 传输单个简单类型值.`${}`括号中只能是 value== 

#### 3.5.SqlSessionFactory工具类的抽取

```java
public class SqlSessionFactoryUtils {

    public static SqlSessionFactory sqlSessionFactory;

    static{
        InputStream is = null;
        try {
            //读取SqlMapConfig
            is = Resources.getResourceAsStream("SqlMapConfig.xml");
            //构建sqlSessionFactory
            SqlSessionFactoryBuilder builder = new SqlSessionFactoryBuilder();
            sqlSessionFactory = builder.build(is);
        } catch (Exception e) {
            e.printStackTrace();
        }finally {
            if (is != null) {
                try {
                    is.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

    }
    /**
     * 获得Session
     * @return
     */
    public static SqlSession openSession(){
        SqlSession sqlSession = sqlSessionFactory.openSession();
        return  sqlSession;
    }
}
```

### 4.小结

#### 4.1CRUD

1. 新增    insert标签
2. 查询    select标签
3. 更新   update标签
4. 删除   delete标签
5. 获得主键    selectkey标签或者insert标签配置属性(keyProperty,useGeneratedKeys)

#### 4.2注意事项

+ 通过 `${}` 获得参数的值, 参数类型是简单类型(字符串,基本类型), 必须写 `${value}` 



## 知识点-parameterType深入

### 1.目标

- [ ] 掌握Mybatis的参数深入(parameterType)

### 2.路径

1. 传递简单类型
2. 传递 pojo 对象
3. 传递 pojo 包装对象类型

### 3.讲解

#### 3.1传递简单类型

​	基本的类型,字符串

​	直接写#{任意字段}或者${value}

 ![1535099951604](./img01/1535099951604.png)

#### 3.2传递 pojo 对象 

​	Mybatis 使用 ognl 表达式解析对象字段的值， #{}或者${}括号中的值为 pojo 属性名称。 

![1535100050378](./img01/1535100050378.png)

#### 3.3传递 pojo 包装对象类型 

​	开发中通过 pojo 传递查询条件 ，查询条件是==综合的查询条件==，不仅包括用户查询条件还包括其它的查询条件（比如将用户购买商品信息也作为查询条件），这时可以使用包装对象传递输入参数。Pojo 类中包含 pojo。

​	京东查询的例子:

![1539830569011](./img01/1539830569011.png)

​	需求：根据用户id查询用户信息，查询条件放到 QueryVo 的 user 属性中。 

- QueryVo  

```java
public class QueryVo {

    private User user;

    public void setUser(User user) {
        this.user = user;
    }

    public User getUser() {
        return user;
    }
}
```

- UserDao接口 

```java
public interface UserDao {
    /**
     * 复杂参数查询
     * @return
     */
    List<User> findByQueryVo(QueryVo queryVo);

}
```

- UserDao.xml文件 

```xml
<mapper namespace="com.itheima.dao.UserDao">
    <select id="findByQueryVo" resultType="com.itheima.bean.User" parameterType="com.itheima.bean.QueryVo">
        SELECT * FROM t_user WHERE uid > #{user.uid}
    </select>
</mapper>
```

- 测试代码

```java
   @Test
    public void fun01() throws Exception {
        SqlSession sqlSession = SqlSessionFactoryUtils.openSession();
        UserDao userDao = sqlSession.getMapper(UserDao.class);

        QueryVo queryVo = new QueryVo();
        User user = new User();
        user.setUid(2);
        queryVo.setUser(user);
        List<User> list = userDao.findByQueryVo(queryVo);
        System.out.println(list);

        sqlSession.close();
    }
```

### 4.小结

1. 传递简单类型     					==#{任意字段} 或者 ${value}==
2. 传递 pojo 对象                       ==#{pojo属性名}== 或者 ${pojo属性名}
3. 传递 pojo 包装对象类型        ==#{pojo对象.属性名}== 



## 知识点-resultType深入   

### 1.目标

- [ ] 掌握Mybatis的参数深入(resultType)

### 2.路径

1. 输出简单类型
2. 输出pojo对象
3. 输出pojo列表
4. resultMap结果类型 

### 3.讲解

#### 3.1输出简单类型

​	直接写对应的Java类型. eg: 返回int

```xml
<select id="findCount" parameterType="int" resultType="int">
     SELECT  COUNT(*) FROM t_user
</select>
```

#### 3.2输出pojo对象

​	直接写当前pojo类的全限定名 eg: 返回User

```xml
<select id="findByUid" parameterType="int" resultType="com.itheima.bean.User">
        select * from t_user where uid = #{uid}
</select>
```

#### 3.3输出pojo列表

​	直接写当前pojo类的全限定名 eg: 返回 `List<User> list`;

```xml
<select id="findAll" resultType="com.itheima.bean.User">
        select * from t_user
</select>
```

#### 3.4resultMap结果类型 

       resultType可以指定pojo将查询结果映射为pojo，但需要pojo的属性名和sql查询的列名一致方可映射成功。

       如果sql查询列名和pojo的属性名不一致，可以通过resultMap将字段名和属性名作一个对应关系 ，resultMap实质上还需要将查询结果映射到pojo对象中。

    	resultMap可以实现将查询结果映射为复杂类型的pojo，比如在查询结果映射对象中包括pojo和list实现一对一查询和一对多查询。(下次课讲)

​	那我们今天就来看返回的列名与实体类的属性不一致时的情况. 下次课再接着研究复杂的封装(多表查询)

​	通过改别名的方式，现在返回结果集的列名已经与 User 类的属性名不相同了。 

```sql
select uid uid_,username username_ ,birthday birthday_ ,sex sex_ ,address address_  from t_user where uid = #{id}
```

- UserDao.java

```java
public interface UserDao {
    /**
     * 根据uid查询
     * @param uid
     * @return
     */
    User findByUid(int uid);

}
```

- UserDao.xml

```xml
    <select id="findByUid" parameterType="int" resultMap="findByUidMap">
        select uid uid_,username username_ ,birthday birthday_ ,sex sex_ ,address address_  from t_user where uid = #{id}
    </select>

    <resultMap id="findByUidMap" type="com.itheima.bean.User">
        <id property="uid" column="uid_"></id>
        <result property="username" column="username_"></result>
        <result property="birthday" column="birthday_"></result>
        <result property="sex" column="sex_"></result>
        <result property="address" column="address_"></result>
    </resultMap>
<!-- 
id：此属性表示查询结果集的唯一标识，非常重要。如果是多个字段为复合唯一约束则定义多个id。
type: 当前resultMap封装后返回的结果
property：表示 User 类的属性。
column：表示 sql 查询出来的字段名。(column 和 property 放在一块儿表示将 sql 查询出来的字段映射到指定的 pojo 类属性上。)
-->
```

### 4.小结

1. 输出简单类型   		直接写类型名 			eg: int ,String 
2. 输出pojo对象          直接写pojo对象类型  eg: User
3. 输出pojo列表          写列表的泛型的类型   eg: `List<User>`  写User 不是写List
4. resultMap结果类型 
   + 处理查询出来的列名和JavaBean属性名不一致
   + 处理复杂的映射(多表间的映,封装)  







