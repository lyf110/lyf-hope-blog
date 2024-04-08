---
title: 二、SpringCloud-02-66期版
date: 2023-03-28 14:54:19
order: 2
category:
  - 中间件
  - Spring Cloud
  - 微服务
tag:
  - 中间件
  - Spring Cloud
  - 微服务
author: 
  name: liuyangfang
  link: https://github.com/lyf110
---



# SpringCloud（二）

反馈：

![1564705879296](./assets/1564705879296.png)



- 慢  适应  
- 不要拖堂
- 好
- 看起来像： 点     3年     面
  - 代码出错了：立马叫人（先自己去分析）
  - 开发：环境（自己带）    小：硬盘       大厂：wiki服务器（FTP）
  - 同事讲话（底气）   技术（认识）
- 昨天：量大  （注解   配置）
- 看文档。 
  - 官网文档（英文）---> 新的技术  --->   说明书
  - 中文文档：成熟的技术   新的技术：坑
- 后悔
- 不能



课程回顾：

1、远程调用：

- 场景：模拟调用第三方的接口（提供url    接口地址）
- 调用一：httpclient
- 调用二：RestTemplate

2、eureka：协调一切

- 注册中心
- 服务提供方
- 服务消费方

3、Robbin：负载均衡

- @LoadBalanced
- 负载：默认的策略  轮询

4、熔断器：

- 场景：雪崩效应
- 思路：服务降级，默认提供一些数据
- 程序：Fallback方法（兜底）
  - 作用在方法
  - 作用在类



课程目标：

1、能够使用Feign进行远程调用：更加优美的实现远程调用（符合程序员的逻辑 ）

2、能够搭建Spring Cloud Gateway网关

3、能够搭建Spring Cloud Config配置中心

4、能够使用Spring Cloud Bus消息总线



# 1 Feign进行远程调用

## 1.1 介绍

Feign 的英文表意为“假装，伪装，变形”， 是一个**http请求调用的轻量级框架**，可以以Java接口注解的方式调用Http请求，而不用像Java中通过封装HTTP请求报文的方式直接调用。Feign通过处理注解，将请求模板化，当实际调用的时候，传入参数，根据参数再应用到请求上，进而转化成真正的请求，这种请求相对而言比较直观。**Feign被广泛应用在Spring Cloud 的解决方案中**，是学习基于Spring Cloud 微服务架构不可或缺的重要组件。

**http调用过程，如图：**

![1563174971237](./assets/1563174971237.png)

Feign是声明式的web service客户端，它**让微服务之间的调用变得更简单了，类似controller调用service**。Spring Cloud集成了Ribbon和Eureka，可在使用Feign时提供负载均衡的http客户端。 

开源项目地址： [https://github.com/OpenFeign/feign](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2FOpenFeign%2Ffeign)

**Feign的调用过程，如图：**

![1563183555286](./assets/1563183555286.png)

综上，Feign的好处：

~~~properties
- 集成Ribbon的负载均衡功能
- 集成Eureka服务注册与发现功能
- 集成了Hystrix的熔断器功能
- 支持请求压缩
- Feign以更加优雅的方式编写远程调用代码，并简化重复代码
~~~

## 1.2 入门程序

### 1.2.1 需求

使用Feign替代RestTemplate发送Rest请求

### 1.2.2 代码实现

#### 1.2.2.1 添加依赖

在服务消费方【本次工程：eureka_client_consumer】添加Feign依赖：

```xml
<!--配置feign-->
<dependency>
   <groupId>org.springframework.cloud</groupId>
   <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```

![1563175855992](./assets/1563175855992.png)

#### 1.2.2.2 编写Feign客户端

在服务消费方编写Feign客户端接口UserClient，用于发送请求。

~~~java
@FeignClient(value = "eureka-client-provider")
public interface UserClient {

    // 地址：请求的是提供方的url地址
    @GetMapping("/user/findUserById/{id}")
    String getUserById(@PathVariable(value = "id") Integer id);
}
~~~



![1563179772218](./assets/1563179772218.png)

#### 1.2.2.3 编写Controller

在服务消费方编写FeignConsumerController，注入UserClient并发送请求。

~~~java
@RestController
@RequestMapping("/feign")
public class FeignConsumerController {

    // 注入userClient
    @Autowired
    private UserClient userClient;

    @GetMapping("/user/getUser/{id}")
    public String getUser(@PathVariable(value = "id") Integer id){
        return userClient.getUserById(id);
    }
}
~~~



![1563179902935](./assets/1563179902935.png)

~~~properties
PS：
	在controller中注入UserClient报错但是可以正常编译并且访问，注意了这只是IDEA工具的检测问题，可以在IDEA中修改检测级别。
~~~

- IDEA 2018版：做如下配置

  ![1563180492994](./assets/1563180492994.png)

- IDEA 2017版：并没有这些选项，因此我们直接修改代码

  ![1563180539475](./assets/1563180539475.png)

#### 1.2.2.4 开启Feign功能

在启动类中添加@EnableFeignClients注解，开启Feign功能。

~~~java
@SpringCloudApplication
@EnableFeignClients	// 开启Feign客户端功能
public class EurekaClientConsumerApplication {

	public static void main(String[] args) {
		SpringApplication.run(EurekaClientConsumerApplication.class, args);
	}

	@Bean
	@LoadBalanced
    public RestTemplate restTemplate(){
	    return new RestTemplate();
    }

}
~~~



![1563177009476](./assets/1563177009476.png)

#### 1.2.2.5 测试

启动服务并且进行访问测试。<http://localhost:8080/feign/user/getUser/1> 

![1563180113790](./assets/1563180113790.png)

#### 1.2.2.6 坑

~~~properties
使用Feign的时候,如果参数中带有@PathVariable形式的参数,则要用value属性去指定。
标明对应的参数,否则会抛出IllegalStateException异常，异常信息：Feign PathVariable annotation was empty on param 0.


建议：RESTful风格   @Pathvariable（value）
~~~

![1563180237909](./assets/1563180237909.png)



## 1.3 熔断支持

Feign默认对Hystrix支持。

![1563181447217](./assets/1563181447217.png)

### 1.3.1 需求

调用服务时，如果服务出现宕机，给用户响应一个友好提示。

### 1.3.2 代码实现

#### 1.3.2.1 开起Feign对熔断器支持

开启Feign对熔断器支持，默认是关闭的。在服务消费方的application.yml文件中配置如下内容：

![1563181784611](./assets/1563181784611.png)

~~~yaml
feign:
  hystrix:
    enabled: true
~~~



#### 1.3.2.2 编写Fallback处理类

在工程的src目录下创建熔断器的处理类，需要实现Feign客户端的接口。

![1563181958556](./assets/1563181958556.png)



#### 1.3.2.3 调用Fallback

在Feign客户端需要调用熔断器的处理类。

![1563182409461](./assets/1563182409461.png)

~~~java
@FeignClient(value = "eureka-client-provider", fallback = UserClientFallback.class)
public interface UserClient {

    // 地址：请求的是提供方的url地址
    @GetMapping("/user/findUserById/{id}")
    String getUserById(@PathVariable(value = "id") Integer id);
}
~~~



#### 1.3.2.4 测试

停止服务提供方程序，发送请求<http://localhost:8080/feign/user/getUser/1> ，结果如下：

![1563182773889](./assets/1563182773889.png)

## 1.4 其他

### 1.4.1 负载均衡

Feign本身集成了Ribbon依赖和自动配置，因此不需要额外引入依赖，也不需要再注入RestTemplate对象。Feign内置的ribbon默认设置了请求超时时长，默认是1000ms，可以修改ribbon内部有重试机制，一旦超时，会自动重新发起请求。如果不希望重试可以关闭配置。

我们可以在服务消费方application.yml中配置如下内容：

```yaml
# 配置负载均衡
eureka-client-consumer:
  ribbon:
    NFLoadBalancerRuleClassName: com.netflix.loadbalancer.RandomRule # 配置为随机
    ConnectTimeout: 1000 # 指的是建立连接所用的时间
    ReadTimeout: 2000    # 指的是建立连接后从服务器读取到可用资源所用的时间
    MaxAutoRetries: 0    # 最大重试次数(第一个服务)
    MaxAutoRetriesNextServer: 0     # 最大重试下一个服务次数(集群的情况才会用到)
    OkToRetryOnAllOperations: false # 是否对所有的请求都重试
```

### 1.4.2 请求压缩

SpringCloudFeign支持对请求和响应进行GZIP压缩，以减少通信过程中的性能损耗。通过配置开启请求与响应的压缩功能：

- 开启压缩功能

~~~yaml
# 无注释版
feign:
	compression:
        request:
            enabled: true
        response:
            enabled: true

feign:
	compression:
        request:
            enabled: true # 开启请求压缩
        response:
            enabled: true # 开启响应压缩
~~~

- 对请求类型以及压缩大小进行限制

~~~yaml
# 无注释版
feign:
	compression:
		request:
			enabled: true
			mime-types:	text/html,application/xml,application/json
			min-request-size: 2048 
#  Feign配置
feign:
	compression:
		request:
			enabled: true # 开启请求压缩
			mime-types:	text/html,application/xml,application/json # 设置压缩的数据类型
			min-request-size: 2048 # 设置触发压缩的大小下限
			#以上数据类型，压缩大小下限均为默认值
~~~



# 2 Spring Cloud Gateway网关

## 2.1 API网关

API 网关出现的原因是微服务架构的出现，不同的微服务一般会有不同的网络地址，而外部客户端可能需要调用多个服务的接口才能完成一个业务需求，如果让客户端直接与各个微服务通信，会有以下的问题： 

- 客户端会多次请求不同的微服务，增加了客户端的复杂性。
- 存在跨域请求（CORS     A服务器---->B服务器资源），在一定场景下处理相对复杂。
- 认证复杂，每个服务都需要独立认证。  url ：token（令牌or票据）=3434duri4fdewfdjsdiuresirwerwewsfh
- 难以重构，随着项目的迭代，可能需要重新划分微服务。例如，可能将多个服务合并成一个或者将一个服务拆分成多个。如果客户端直接与微服务通信，那么重构将会很难实施。
- 某些微服务可能使用了防火墙 （花钱买）/ 浏览器不友好的协议，直接访问会有一定的困难。

以上这些问题可以借助 API 网关解决。API 网关是介于客户端和服务器端之间的中间层，所有的外部请求都会先经过 API 网关这一层。也就是说，API 的实现方面更多的考虑业务逻辑，而安全、性能、监控可以交由 API 网关来做，这样既提高业务灵活性又不缺安全性，架构图如图所示： 

![1563184636038](./assets/1563184636038.png)

使用 API 网关后的优点如下：

- 易于监控。可以在网关收集监控数据并将其推送到外部系统进行分析。
- 易于认证。可以在网关上进行认证，然后再将请求转发到后端的微服务，而无须在每个微服务中进行认证。
- 减少了客户端与各个微服务之间的交互次数。



## 2.2 网关选型

### 2.2.1 网关选型

加密：是否安全   不安全。

- 生日碰撞（数学问题）
- hash碰撞（物理实验     具体的应用与物理实验有距离）



太不稳定

微服务架构中常用的网关，如下：  nginx可以限流

![1563184720423](./assets/1563184720423.png)

 

### 2.2.2 Spring Cloud Gateway

#### 2.2.2.1 介绍

版本：1.4  2017  1.5     zuul

Spring Cloud Gateway 是 Spring Cloud 的一个**全新项目**，该项目是基于 Spring 5.0，Spring Boot 2.x 和 Project Reactor 等技术开发的网关，它旨在为微服务架构提供一种简单有效的统一的 API 路由管理方式。 

Spring Cloud Gateway 作为 Spring Cloud 生态系统中的网关，目标是替代 Netflix Zuul，其不仅提供统一的路由方式，并且基于 Filter 链的方式提供了网关基本的功能，例如：安全、监控、限流等。

#### 2.2.2.2 术语

- **Route（路由）**：这是网关的基本构建块。它由一个 ID，一个目标 URI，一组断言和一组过滤器定义。如果断言为真，则路由匹配。
- **Predicate（断言）**：这是一个 [Java 8 的 Predicate](http://docs.oracle.com/javase/8/docs/api/java/util/function/Predicate.html)。输入类型是一个 [`ServerWebExchange`](https://docs.spring.io/spring/docs/5.0.x/javadoc-api/org/springframework/web/server/ServerWebExchange.html)。我们可以使用它来匹配来自 HTTP 请求的任何内容，例如 headers 或参数。    请求做一些配置
- **Filter（过滤器）**：这是`org.springframework.cloud.gateway.filter.GatewayFilter`的实例，我们可以使用它修改请求和响应

#### 2.2.2.3 流程

客户端向 Spring Cloud Gateway 发出请求。然后在 Gateway Handler Mapping 中找到与请求相匹配的路由，将其发送到 Gateway Web Handler。Handler 再通过指定的过滤器链来将请求发送到我们实际的服务执行业务逻辑，然后返回。 过滤器之间用虚线分开是因为过滤器可能会在发送代理请求之前（“pre”）或之后（“post”）执行业务逻辑。

![1563263071310](./assets/1563263071310.png)

## 2.3 入门程序

### 2.3.1 创建maven工程

通过spring 创建工程，并且添加需要的依赖：eureka以及gateway

~~~xml
<dependencies>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-gateway</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
    </dependency>
</dependencies>
~~~



![1563185890858](./assets/1563185890858.png)



### 2.3.2 编写启动类

创建的工程也属于一个服务，因此我们也需要启动并且交个Eureka注册中心管理。在启动类中添加@EnableDiscoveryClient注解或者@EnableEurekaClient。

![1563186263700](./assets/1563186263700.png)



### 2.3.3 编写配置文件

1、配置Eureka

2、配置api的路由规则

~~~yaml
server:
  port: 10010
spring:
  application:
    name: api-gateway
  cloud:
    gateway:
      routes:
        - id: eureka-client-provider-route
          uri: http://127.0.0.1:9091
          predicates:
            - Path=/user/**
eureka:
  client:
    service-url:
      defaultZone: http://127.0.0.1:10086/eureka
      

#注释
server:
  port: 10010
spring:
  application:
    name: api-gateway
  cloud:
    gateway:
      # 路由(集合， - 代表集合)
      routes:
      	# id唯一标识，(可自定义)
        - id: eureka-client-provider-route
          # 路由服务提供方地址
          uri: http://127.0.0.1:9091
          	# 路由拦截地址的规则(断言)
          predicates:
            - Path=/user/**
eureka:
  client:
    service-url:
      defaultZone: http://127.0.0.1:10086/eureka
~~~



### 2.3.4 测试

启动所有服务，访问测试：<http://localhost:10010/user/findUserById/2> 

![1563187551870](./assets/1563187551870.png)



## 2.4 动态路由

- 刚才路由规则中，我们把路径对应服务地址写死了！如果服务提供者集群的话，这样做不合理。应该是**根据服务名称**，去Eureka注册中心查找服务对应的所有实例列表，然后进行动态路由！配置如下：

~~~yaml
#          uri: http://127.0.0.1:9091
              uri: lb://eureka-client-provider
~~~

![1563188159621](./assets/1563188159621.png)



- 启动网关服务再次访问：本次测试访问4次结果如下（结果：会路由不到不同的服务提供方    PS：不同的负载均衡策略可能查看的结果不一样。）：

  <http://localhost:10010/user/findUserById/2> 

  ![1563188379721](./assets/1563188379721.png)



## 2.5 过滤器

由filter工作流程点，可以知道filter有着非常重要的作用，在“pre”类型的过滤器可以做参数校验、权限校验、流量监控、日志输出、协议转换等，在“post”类型的过滤器中可以做响应内容、响应头的修改，日志的输出，流量监控等。 (过滤器, 处理请求, 可以修改请求前的数据和返回后的数据, 类似于spring webmvc的interceptor)

当我们有很多个服务时，比如下图中的user-service、goods-service、sales-service等服务，客户端请求各个服务的Api时，每个服务都需要做相同的事情，比如鉴权、限流、日志输出等。 

![1563263330304](./assets/1563263330304.png)

对于这样重复的工作，有没有办法做的更好，答案是肯定的。在微服务的上一层加一个全局的权限控制、限流、日志输出的Api Gatewat服务，然后再将请求转发到具体的业务服务层。这个Api Gateway服务就是起到一个服务边界的作用，外接的请求访问系统，必须先通过网关层。 

![1563263375300](./assets/1563263375300.png)

Spring Cloud Gateway同zuul类似，有“pre”和“post”两种方式的filter。客户端的请求先经过“pre”类型的filter，然后将请求转发到具体的业务服务，比如上图中的user-service，收到业务服务的响应之后，再经过“post”类型的filter处理，最后返回响应到客户端。

![1563263584830](./assets/1563263584830.png)

与zuul不同的是，filter除了分为“pre”和“post”两种方式的filter外，在Spring Cloud Gateway中，filter从作用范围可分为另外两种，一种是针对于单个路由的gateway filter，它在配置文件中的写法同predict类似；另外一种是针对于所有路由的global gateway filer。现在从作用范围划分的维度来讲解这两种filter。

### 2.5.1 过滤器分类

- 默认过滤器：出厂自带，实现好了拿来就用，不需要实现
  - 全局默认过滤器
  - 局部默认过滤器
- 自定义过滤器：根据需求自己实现，实现后需配置，然后才能用哦。
  - 全局过滤器：作用在所有路由上。
  - 局部过滤器：配置在具体路由下，只作用在当前路由上。

默认过滤器几十个，常见如下：

| 过滤器名称           | 说明                         |
| -------------------- | ---------------------------- |
| AddRequestHeader     | 对匹配上的请求加上Header     |
| AddRequestParameters | 对匹配上的请求路由           |
| AddResponseHeader    | 对从网关返回的响应添加Header |
| StripPrefix          | 对匹配上的请求路径去除前缀   |

详细说明官方[链接](https://cloud.spring.io/spring-cloud-static/spring-cloud-gateway/2.1.1.RELEASE/single/spring-cloud-gateway.html#_gatewayfilter_factories)

### 2.5.2 配置过滤器

#### 2.5.2.1 配置全局过滤器

举个栗子：设置响应的头信息。

- 第一步：修改application.yml文件

  ~~~yaml
  spring:
    application:
      name: api-gateway
    cloud:
      gateway:
        routes:
          - id: eureka-client-provider-route
  #          uri: http://127.0.0.1:9091
            uri: lb://eureka-client-provider
            predicates:
              - Path=/user/**
        default-filters:
          - AddResponseHeader=X-Response-Default-MyName,itheima
  ~~~

  ![1563264411000](./assets/1563264411000.png)

- 第二步：通过浏览器查看

  ![1563264375857](./assets/1563264375857.png)

#### 2.5.2.2 配置局部过滤器

- 添加请求路径前缀

  - 第一步：修改application.yml文件

    ~~~yaml
    spring:
      application:
        name: api-gateway
      cloud:
        gateway:
          routes:
            - id: eureka-client-provider-route
    #          uri: http://127.0.0.1:9091
              uri: lb://eureka-client-provider
              predicates:
                - Path=/**
              filters:
                - PrefixPath=/user/findUserById
    ~~~

    ![1563266971454](./assets/1563266971454.png)

  - 第二步：重启网关服务：略

  - 第三步：测试：<http://localhost:10010/1> 

    ![1563266992208](./assets/1563266992208.png)

  - 路由说明：

    | 配置                 | 访问api网关地址          | 路由地址                         |
    | -------------------- | ------------------------ | -------------------------------- |
    | PrefixPath=/user     | http://localhost:10010/8 | http://localhost:9091/user/8     |
    | PrefixPath=/user/abc | http://localhost:10010/8 | http://localhost:9091/user/abc/8 |

- 去除请求路径前缀

  ~~~properties
  在gateway中通过配置路由过滤器StripPrefix，来指定路由要去掉的前缀个数。以实现映射路径中地址的去除。
  例1：StripPrefix=1
  路径/api/user/1将会被路由到/user/1
  
  例2：StripPrefix=2
  路径/api/user/1将会被路由到/1
  ~~~

  - 第一步：修改application.yml文件

    ~~~yaml
    spring:
      application:
        name: api-gateway
      cloud:
        gateway:
          routes:
            - id: eureka-client-provider-route
    #          uri: http://127.0.0.1:9091
              uri: lb://eureka-client-provider
              predicates:
                - Path=/**
              filters:
    #            - PrefixPath=/user
                - StripPrefix=1
    ~~~

    ![1563266521280](./assets/1563266521280.png)

  - 第二步：重启网关服务

  - 第三步：测试：<http://localhost:10010/xxx/user/findUserById/1> 

    ![1563267864789](./assets/1563267864789.png)

  - 路由说明：

    | 配置          | 访问网关地址                      | 路由地址（提供方）           |
    | ------------- | --------------------------------- | ---------------------------- |
    | StripPrefix=1 | http://localhost:10010/api/user/1 | http://localhost:9091/user/1 |
    | StripPrefix=2 | http://localhost:10010/api/user/1 | http://localhost:9091/1      |

### 2.5.3 自定义过滤器

自定义过滤器：参考官方的文档

1、自定义全局的过滤器：必须实现接口：GlobalFilter、可以实现Ordered接口（指定该过滤器的执行顺序）

- 需求：发送的请求中，必须携带令牌（无法访问）

2、自定义局部的过滤器：必须实现接口：AbstractGatewayFilterFactory 

- 需求：限定请求的ip（A  可以访问    其他公司：不能访问）
- 自定义局部过滤器类的名称：不能随便写     XxxGatewayFilterFactory



#### 2.5.3.1 自定义全局过滤器

Spring Cloud 中常见的内置过滤器如下：

![1563268861501](./assets/1563268861501.png)

如果要自定义全局过滤，我们需要实现GlobalFilter接口（也可以实现Ordered接口，该接口中的方法代表该过滤器执行的优先级，值越小，优先级越高）。

**PS：如果不会自定义全局过滤器，可以参考官方已实现的过滤器**。（<https://cloud.spring.io/spring-cloud-static/Greenwich.SR2/single/spring-cloud.html#_gatewayfilter_factories> ）

##### 2.5.3.1.1 需求

判断请求是否包含了请求参数“token”，如果不包含请求参数“token”则不转发路由，否则执行正常的业务逻辑。 

##### 2.5.3.1.2 自定义全局过滤器

在网关服务工程中（在com.itheima.filter包下），自定义全局过滤器。

![1563271204828](./assets/1563271204828.png)

~~~java
@Component
public class MyGlobalFilter implements GlobalFilter, Ordered {


    /**
     * @author 栗子
     * @Description 判断请求参数是否有token值
     * @Date 17:33 2019/7/16
     * @param exchange
     * @param chain
     * @return reactor.core.publisher.Mono<java.lang.Void>
     **/
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        // 获取请求参数token
        String token = exchange.getRequest().getQueryParams().getFirst("token");
        // 如果为空，则无法继续执行业务
        if(StringUtils.isEmpty(token)){
            System.out.println("token is empty!!!");
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED); // 401：无效认证
            return exchange.getResponse().setComplete();
        }
        return chain.filter(exchange);
    }

    /**
     * @author 栗子
     * @Description 代表过滤器的优先级，值越小优先级越高（先执行）
     * @Date 17:32 2019/7/16
     * @param
     * @return int
     **/
    @Override
    public int getOrder() {
        return 0;
    }
}

PS：方法参数说明
ServerWebExchange exchange：Contract for an HTTP request-response interaction. Provides access to the HTTP request and response and also exposes additional server-side processing related properties and features such as request attributes（官方）
ServerWebExchange是一个HTTP请求-响应交互的契约。提供对HTTP请求和响应的访问，并公开额外的 服务器 端处理相关属性和特性，如请求属性。（存放着重要的请求-响应属性、请求实例和响应实例等等，有点像 Context 的角色）

GatewayFilterChain chain：过滤器链（将所有的过滤器加入该链中，相当于我们之前学习的springmvc的拦截器链）
~~~



##### 2.5.3.1.3 测试

启动网关服务，发送请求：

- 请求：<http://localhost:10010/abc/user/findUserById/1> 

  ![1563271441821](./assets/1563271441821.png)

  ![1563270539576](./assets/1563270539576.png)

- 请求：<http://localhost:10010/abc/user/findUserById/1?token=srre878ererrdr43> 

  ![1563271532127](./assets/1563271532127.png)



#### 2.5.3.2 自定义局部过滤器

实现局部过滤器，我们需要继承抽象类：AbstractGatewayFilterFactory 

![1563271699236](./assets/1563271699236.png)

##### 2.5.3.2.1 需求

需求是如果在配置文件配置了一个IP，那么该ip就可以访问，其它IP通通不能访问。如果不使用该过滤器，那么所有IP都可以访问服务。

##### 2.5.3.2.2 自定义局部过滤器

创建自定义局部过滤器，代码实现如下：（定义局部过滤器时，要求过滤器类的名称有一定的规范性。XxxGatewayFilterFactory ）

![1563277019189](./assets/1563277019189.png)



~~~java
@Component
public class IpForbidGatewayFilterFactory extends AbstractGatewayFilterFactory<IpForbidGatewayFilterFactory.Config> {

    private static final String PARAM_NAME = "forbidIp";

    public IpForbidGatewayFilterFactory() {
        super(Config.class);
    }

    // 这个方法指定属性名称
    @Override
    public List<String> shortcutFieldOrder() {
        return Arrays.asList(PARAM_NAME);
    }

    @Override
    public GatewayFilter apply(Config config) {
        // grab configuration from Config object
        return (exchange, chain) -> {
            // 获取请求参数
            String ip = exchange.getRequest().getRemoteAddress().getAddress().getHostAddress();
            System.out.println("ip地址：" + ip);
            if(config.getForbidIp().equals(ip)){
                // 放行
                return chain.filter(exchange);
            }
            // 不放行
            exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
            return exchange.getResponse().setComplete();
        };
    }

    //Put the configuration properties for your filter here
    public static class Config {
        private String forbidIp;

        public String getForbidIp() {
            return forbidIp;
        }

        public void setForbidIp(String forbidIp) {
            this.forbidIp = forbidIp;
        }
    }
}
~~~



##### 2.5.3.2.3 配置局部过滤器（坑）

~~~properties
坑：在定义局部过滤器时，要求过滤器类的名称有一定的规范性。例如：XxxGatewayFilterFactory。配置局部过滤的名称时，并不是任意写，默认截取该类的XxxGatewayFilterFactory的GatewayFilterFactory前半部分，例如为Xxx。
~~~

![1563276977390](./assets/1563276977390.png)



![1563276659056](./assets/1563276659056.png)

##### 2.5.3.2.4 测试 

启动网关服务，发送请求：<http://localhost:10010/abc/user/findUserById/1?token=srre878ererrdr43> 

![1563276502219](./assets/1563276502219.png)



# 3 Spring Cloud Config配置中心

## 3.1 介绍

在传统的单体式应用系统中，我们通常会将配置文件和代码放在一起，但随着系统越来越大，需要实现的功能越来越多时，我们又不得不将系统升级为分布式系统，同时也会将系统的功能进行更加细化的拆分。拆分后，所有的服务应用都会有自己的配置文件，当需要修改某个服务的配置时，我们可能需要修改很多处，并且为了某一项配置的修改，可能需要重启这个服务相关的所有服务，这显然是非常麻烦的。

分布式系统中，由于**服务数量非常多**，配置文件分散在不同微服务项目中，管理极其不方便。为了便于集中配置的统一管理，在分布式架构中通常会使用分布式配置中心组件，目前比较流行的分布式配置中心组件有百度的disconf、阿里的diamond、携程的apollo和Spring Cloud的Config等 。相对于同类产品而言，Spring Cloud Config最大的优势就是和Spring的无缝集成，对于已有的Spring应用程序的迁移成本非常低，结合Spring Boot可使项目有更加统一的标准（包括依赖版本和约束规范），避免了因集成不同开发软件造成的版本依赖冲突等问题 。也支持配置文件放在远程仓库Git(GitHub、**码云**)。配置中心本质上是一个微服务，同样需要注册到Eureka服务中心！  有。  项目中：技术点      OA      消耗的资源

![1563341945823](./assets/1563341945823.png)

## 3.2 GIT远程仓库配置（码云）

- 知名的Git远程仓库有国外的GitHub和国内的码云(gitee)；
- GitHub主服务在外网，访问经常不稳定，如果希望服务稳定，可以使用码云；
- 码云访问地址：http://gitee.com

### 3.2.1 创建远程仓库

- 第一步：新建仓库

  ![1563342280083](./assets/1563342280083.png)

- 第二步：编写仓库相关信息

  ![1563342582596](./assets/1563342582596.png)

### 3.2.2 创建配置文件

- 第一步：创建配置文件：统一管理

  - 配置文件命名规则：{application}-{profile}.yml或{application}-{profile}.properties
    - application：应用名称，例如：user
    - profile：指定应用环境，例如：开发环境dev，测试环境test，生产环境pro等
      - 开发环境 user-dev.yml
      - 测试环境 user-test.yml
      - 生产环境 user-pro.yml

  ![1563343068548](./assets/1563343068548.png)

- 第二步：创建配置文件并提交：将工程服务提供方工程【eureka-client-provider】下的配置文件内容复制过来

  ![1563343198348](./assets/1563343198348.png)

- 第三步：配置中心如下

  ![1563343333982](./assets/1563343333982.png)



## 3.3 搭建配置中心服务

### 3.3.1 创建工程

在父工程下继续创建配置中心服务工程config_center_server，并且需要注册到注册中心，因此需要添加如下依赖：

![1563344003017](./assets/1563344003017.png)



### 3.3.2 编写启动类

在启动类中添加**@EnableConfigServer**、**@EnableDiscoveryClient**

![1563344302139](./assets/1563344302139.png)

~~~java
@SpringBootApplication
@EnableDiscoveryClient	// 开启eureka
@EnableConfigServer // 开启config服务支持
public class ConfigCenterServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(ConfigCenterServerApplication.class, args);
	}

}
~~~



### 3.3.3 编写配置文件

编写application.yml文件，配置内容如下：

~~~yaml
server:
  port: 12000
spring:
  application:
    name: config-server
  cloud:
    config:
      server:
        git:
          uri: https://gitee.com/ruanwen/itheima-spring-cloud-config.git
eureka:
  client:
    service-url:
      defaultZone: http://127.0.0.1:10086/eureka
logging:
  level:
    com: debug

PS：注释说明
server:
  port: 12000 # 端口号
spring:
  application:
    name: config-server # 应用名
  cloud:
    config:
      server:
        git:
          # 配置gitee的仓库地址
          uri: https://gitee.com/ruanwen/itheima-spring-cloud-config.git
# Eureka服务中心配置
eureka:
  client:
    service-url:
      # 注册Eureka Server集群
      defaultZone: http://127.0.0.1:10086/eureka
# com.itheima 包下的日志级别都为Debug
logging:
  level:
    com: debug

~~~

### 3.3.4 启动测试

- 启动注册中心服务以及该服务进行测试：<http://localhost:12000/user-dev.yml> 

![1563344594304](./assets/1563344594304.png)

- 修改码云中配置内容，再去刷新看看配置是否能同步：可以的。

  ![1563345502299](./assets/1563345502299.png)



## 3.4 服务获取配置中心配置信息

### 3.4.1 需求

服务提供方工程中，配置文件内容不在由该服务自己去提供，而是从配置中心上获取。

### 3.4.2 添加依赖

在服务提供方添加Spring Cloud Config依赖。

~~~xml
<!--spring cloud 配置中心-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-config</artifactId>
</dependency>
~~~

![1563346244241](./assets/1563346244241.png)



### 3.4.3 修改配置

- 删除提供方application.yml文件；    应用场景：开发中配置具体的中间件（Redis、tomcat、mq等等）

  - 配置开发过程中的具体的应用的（应用性的配置：tomcat、redis、mq、kafka。。。）

- 添加bootstrap.yml文件，配置内容如下      框架本身的配置信息。

  - 系统级别的配置（服务在启动的过程中需要加载配置信息）

  ![1563346418143](./assets/1563346418143.png)

~~~yaml
# 无注释版
spring:
  cloud:
    config:
      name: user
      profile: dev
      label: master
      discovery:
        enabled: true
        service-id: config-server
eureka:
  client:
    service-url:
      defaultZone: http://127.0.0.1:10086/eureka

# 注释版本      
spring:
  cloud:
    config:
      name: user # 与远程仓库中的配置文件的application保持一致，{application}-{profile}.yml
      profile: dev # 远程仓库中的配置文件的profile保持一致
      label: master # 远程仓库中的版本保持一致
      discovery:
        enabled: true # 使用配置中心
        service-id: config-server # 配置中心服务id

#向Eureka服务中心集群注册服务
eureka:
  client:
    service-url:
      defaultZone: http://127.0.0.1:10086/eureka
~~~



- 当使用 Spring Cloud 的时候，配置信息一般是从 config server 加载的，为了取得配置信息（比如密码等），你需要一些提早的或引导配置。因此，把 config server 信息放在 bootstrap.yml，用来加载真正需要的配置信息。 

- application.yml和bootstrap.yml文件的说明

  - bootstrap.yml文件是SpringBoot的默认配置文件，而且其加载时间相比于application.yml优先级更高（优先加载）
  - bootstrap.yml（系统级别）可以理解成系统级别的一些参数配置，一般不会变动
  - application.yml（应用级别）用来定义应用级别的参数

  

### 3.4.4 启动测试

![1563347549322](./assets/1563347549322.png)

启动注册中心、服务提供方、网关服务、配置中心服务，判断是否能够进行调用：

![1563347461411](./assets/1563347461411.png)

# 4 Spring Cloud Bus消息总线

## 4.1 需求

获取配置中心的属性值：例如，获取test.hello对应的value值。

![1563348390786](./assets/1563348390786.png)

## 4.2 代码实现

### 4.2.1 修改代码

修改服务提供方controller代码，如下：

![1563348597500](./assets/1563348597500.png)

### 4.2.2 测试

- 启动提供方，测试：<http://localhost:10010/abc/user/findUserById/1?token=srre878ererrdr43> 

  ![1563348697132](./assets/1563348697132.png)

- 重新编辑：配置中心的值，再次去测试：

  ![1563348842750](./assets/1563348842750.png)

- 问题：当我们修改配置中心的值后，获取的数据还是原有的。提供方并没有及时同步到最新的数据。这个时候我们要重启服务提供方即可。

  ![1563349056119](./assets/1563349056119.png)

## 4.3 思考

如果有1000个（甚至更多）服务连接该配置中心，而每个服务又有多个实例（集群），那么都需要重启需要大量开销。而且在生产环境下也不允许这样去做，有可能会影响到线上的业务。因此，在这个问题当中我们可以通过Spring Cloud Bus消息总线去解决该问题。

## 4.4 Spring Cloud Bus介绍

### 4.4.1 Bus介绍

Spring Cloud Bus是用轻量的消息代理将分布式的节点连接起来,可以用于**广播**配置文件的更改或者服务的监控管理。一个关键的思想就是,消息总线可以为微服务做监控,也可以实现应用程序之间相互通信。 Spring Cloud Bus可选的消息代理线线泡括RabbitMQ、Kaka等。本次我们用 RabbitMQ作为 Spring Cloud的消息组件去刷新更改微服务的配置文件。

Spring Cloud Bus的一个功能就是让这个过程变得简单,当远程Git仓库的配置更改后,只需要向某一个微服务实例发送一个**Post请求**,通过消息组件通知其他微 服务实例重新拉取配置文件。 



消息总线：

![1563349816545](./assets/1563349816545.png)

### 4.4.2 入门程序

#### 4.4.2.1 安装RabbitMQ-软件

安装后并启动：略。（可参考文档中的安装步骤）

#### 4.4.2.2 更新配置中心服务

- 第一步：在工程中添加依赖

  ~~~xml
  <!--消息总线依赖-->
  <dependency>
      <groupId>org.springframework.cloud</groupId>
      <artifactId>spring-cloud-bus</artifactId>
  </dependency>
  <!--RabbitMQ依赖-->
  <dependency>
      <groupId>org.springframework.cloud</groupId>
      <artifactId>spring-cloud-stream-binder-rabbit</artifactId>
  </dependency>
  ~~~

  ![1563350219186](./assets/1563350219186.png)

- 第二步：修改application.yml文件

  在配置文件中添加如下内容：

  ~~~yaml
  spring:
    rabbitmq:
      host: localhost
      port: 5672
      username: guest
      password: guest
  management:
    endpoints:
      web:
        exposure:
          include: bus-refresh
  
  # 注释版
  # rabbitmq的配置信息；如下配置的rabbit都是默认值，其实可以完全不配置
  spring:
    rabbitmq:
      host: localhost
      port: 5672
      username: guest
      password: guest
  # 暴露触发消息总线的地址
  management:
    endpoints:
      web:
        exposure:
          # 暴露触发消息总线的地址
          include: bus-refresh
  ~~~

  ![1563350343117](./assets/1563350343117.png)

#### 4.4.2.3 更新服务提供方服务

- 第一步：在工程中添加依赖：

  ~~~xml
  <!--消息总线依赖-->
  <dependency>
      <groupId>org.springframework.cloud</groupId>
      <artifactId>spring-cloud-bus</artifactId>
  </dependency>
  <!--RabbitMQ依赖-->
  <dependency>
      <groupId>org.springframework.cloud</groupId>
      <artifactId>spring-cloud-stream-binder-rabbit</artifactId>
  </dependency>
  <!--健康监控依赖-->
  <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-actuator</artifactId>
  </dependency>
  ~~~

  

  ![1563350495056](./assets/1563350495056.png)

- 第二步：修改bootstrap.yml文件：

  ~~~yaml
  spring:
    rabbitmq:
      host: localhost
      port: 5672
      username: guest
      password: guest
  ~~~

  

- 第三步：修改UserController，添加**@RefreshScope**注解，刷新配置。

  ![1563350697689](./assets/1563350697689.png)

#### 4.4.2.4 启动相关服务测试

- 修改码云上配置文件：略。

- 广播：发送POST请求，地址：http://127.0.0.1:12000/actuator/bus-refresh

  ![1563362190341](./assets/1563362190341.png)

- 再测试：效果如下：

  ![1563362241174](./assets/1563362241174.png)





# Spring Cloud总架构

![1563957797980](./assets/1563957797980.png)
