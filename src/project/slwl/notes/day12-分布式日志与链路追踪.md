---
title: day12-分布式日志与链路追踪
date: 2023-07-15 15:58:23
order: 12
category:
  - 项目
  - 神领物流
  - 分布式日志
  - 链路追踪
tag:
  - 项目
  - 神领物流
  - 分布式日志
  - 链路追踪
author: 
  name: liuyangfang
  link: https://github.com/lyf110
---



# 1、课程安排

- 了解什么是分布式日志
- Graylog的部署安装
- 使用Graylog进行日志收集
- Graylog的搜索语法
- 了解什么是链路追踪
- Skywalking的基本使用
- 整合微服务使用Skywalking
- 将Skywalking整合到Docker中
# 2、背景说明
在微服务架构体系中，微服务上线后，有两个不容忽略的问题，一是日志该怎么存储、查看，二是如何在复杂的调用链中排查问题。
![](./assets/image-20240407183435285-377.gif)
## 2.1、日志问题
在微服务架构下，微服务被拆分成多个微小的服务，每个微小的服务都部署在不同的服务器实例上，当我们定位问题，检索日志的时候需要依次登录每台服务器进行检索。
这样是不是感觉很繁琐和效率低下？所以我们还需要一个工具来帮助集中收集、存储和搜索这些跟踪信息。
集中化管理日志后，日志的统计和检索又成为一件比较麻烦的事情。以前，我们通过使用grep、awk和wc等Linux命令能实现检索和统计，但是对于要求更高的查询、排序和统计等要求和庞大的机器数量依然使用这样的方法难免有点力不从心。
所以，需要通过**分布式日志服务**来帮我们解决上述问题的。
## 2.2、调用链问题
在微服务架构下，如何排查异常的微服务，比如：发布新版本后发现系统处理用户请求变慢了，要想解决这个问首先是要找出“慢”的环节，此时就需要对整个微服务的调用链有清晰的监控，否则是不容易找出问题的。下面所展现的就是通过skywalking可以查看微服务的调用链，就会比较容易的找出问题：
![](./assets/image-20240407183435285-378.png)
# 3、分布式日志
## 3.1、实现思路
分布式日志框架服务的实现思路基本是一致的，如下：

- **日志收集器：**微服务中引入日志客户端，将记录的日志发送到日志服务端的收集器，然后以某种方式存储
- **数据存储：**一般使用ElasticSearch分布式存储，把收集器收集到的日志格式化，然后存储到分布式存储中
- **web服务：**利用ElasticSearch的统计搜索功能，实现日志查询和报表输出

比较知名的分布式日志服务包括：

- ELK：elasticsearch、Logstash、Kibana
- GrayLog

本课程主要是基于GrayLog讲解。
## 3.2、为什么选择GrayLog？
业界比较知名的分布式日志服务解决方案是ELK，而我们今天要学习的是GrayLog。为什么呢？
ELK解决方案的问题：

1. 不能处理多行日志，比如Mysql慢查询，Tomcat/Jetty应用的Java异常打印
2. 不能保留原始日志，只能把原始日志分字段保存，这样搜索日志结果是一堆Json格式文本，无法阅读。
3. 不符合正则表达式匹配的日志行，被全部丢弃。

GrayLog方案的优势：

1. 一体化方案，安装方便，不像ELK有3个独立系统间的集成问题。
2. 采集原始日志，并可以事后再添加字段，比如http_status_code，response_time等等。
3. 自己开发采集日志的脚本，并用curl/nc发送到Graylog Server，发送格式是自定义的GELF，Flunted和Logstash都有相应的输出GELF消息的插件。自己开发带来很大的自由度。实际上只需要用inotifywait监控日志的modify事件，并把日志的新增行用curl/netcat发送到Graylog Server就可。
4. 搜索结果高亮显示，就像google一样。
5. 搜索语法简单，比如： `source:mongo AND reponse_time_ms:>5000`，避免直接输入elasticsearch搜索json语法
6. 搜索条件可以导出为elasticsearch的搜索json文本，方便直接开发调用elasticsearch rest api的搜索脚本。
## 3.3、GrayLog简介
GrayLog是一个轻量型的分布式日志管理平台，一个开源的日志聚合、分析、审计、展示和预警工具。在功能上来说，和 ELK类似，但又比 ELK要简单轻量许多。依靠着更加简洁，高效，部署使用简单的优势很快受到许多公司的青睐。
官网：[https://www.graylog.org/](https://www.graylog.org/)
其基本框架如图：
![](./assets/image-20240407183435285-379.png)
流程如下：

- 微服务中的GrayLog客户端发送日志到GrayLog服务端
- GrayLog把日志信息格式化，存储到Elasticsearch
- 客户端通过浏览器访问GrayLog，GrayLog访问Elasticsearch

这里MongoDB是用来存储GrayLog的配置信息的，这样搭建集群时，GrayLog的各节点可以共享配置。
## 3.4、部署安装
我们在虚拟机中选择使用Docker来安装。需要安装的包括：

- MongoDB：用来存储GrayLog的配置信息
- Elasticsearch：用来存储日志信息
- GrayLog：GrayLog服务端

下面将通过docker的方式部署，镜像已经下载到101虚拟机中，部署脚本如下：
```shell
#部署Elasticsearch
docker run -d \
    --name elasticsearch \
    -e "ES_JAVA_OPTS=-Xms512m -Xmx512m" \
    -e "discovery.type=single-node" \
    -v es-data:/usr/share/elasticsearch/data \
    -v es-plugins:/usr/share/elasticsearch/plugins \
    --privileged \
    -p 9200:9200 \
    -p 9300:9300 \
elasticsearch:7.17.5

#部署MongoDB（使用之前部署的服务即可）
docker run -d \
--name mongodb \
-p 27017:27017 \
--restart=always \
-v mongodb:/data/db \
-e MONGO_INITDB_ROOT_USERNAME=sl \
-e MONGO_INITDB_ROOT_PASSWORD=123321 \
mongo:4.4

#部署
docker run \
--name graylog \
-p 9000:9000 \
-p 12201:12201/udp \
-e GRAYLOG_HTTP_EXTERNAL_URI=http://192.168.150.101:9000/ \
-e GRAYLOG_ELASTICSEARCH_HOSTS=http://192.168.150.101:9200/ \
-e GRAYLOG_ROOT_TIMEZONE="Asia/Shanghai"  \
-e GRAYLOG_WEB_ENDPOINT_URI="http://192.168.150.101:9000/:9000/api" \
-e GRAYLOG_PASSWORD_SECRET="somepasswordpepper" \
-e GRAYLOG_ROOT_PASSWORD_SHA2=8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918 \
-e GRAYLOG_MONGODB_URI=mongodb://sl:123321@192.168.150.101:27017/admin \
-d \
graylog/graylog:4.3
```
命令解读：

- 端口信息： 
   - `-p 9000:9000`：GrayLog的http服务端口，9000
   - `-p 12201:12201/udp`：GrayLog的GELF UDP协议端口，用于接收从微服务发来的日志信息
- 环境变量 
   - `-e GRAYLOG_HTTP_EXTERNAL_URI`：对外开放的ip和端口信息，这里用9000端口
   - `-e GRAYLOG_ELASTICSEARCH_HOSTS`：GrayLog依赖于ES，这里指定ES的地址
   - `-e GRAYLOG_WEB_ENDPOINT_URI`：对外开放的API地址
   - `-e GRAYLOG_PASSWORD_SECRET`：密码加密的秘钥
   - `-e GRAYLOG_ROOT_PASSWORD_SHA2`：密码加密后的密文。明文是`admin`，账户也是`admin`
   - `-e GRAYLOG_ROOT_TIMEZONE="Asia/Shanghai"`：GrayLog容器内时区
   - `-e GRAYLOG_MONGODB_URI`：指定MongoDB的链接信息
- `graylog/graylog:4.3`：使用的镜像名称，版本为4.3

访问地址 [http://192.168.150.101:9000/](http://192.168.150.101:9000/) ， 如果可以看到如下界面说明启动成功。
![](./assets/image-20240407183435285-380.png)
通过 `admin/admin`登录，即可看到欢迎页面，目前还没有数据：
![](./assets/image-20240407183435285-381.png)
## 3.5、收集日志
### 3.5.1、配置Inputs
部署完成GrayLog后，需要配置Inputs才能接收微服务发来的日志数据。
第一步，在`System`菜单中选择`Inputs`：
![](./assets/image-20240407183435285-382.png)
第二步，在页面的下拉选框中，选择`GELF UDP`：
![](./assets/image-20240407183435285-383.png)
然后点击`Launch new input`按钮：
![](./assets/image-20240407183435285-384.png)
点击`save`保存：
![](./assets/image-20240407183435285-385.png)
可以看到，GELF UDP Inputs 保存成功。
### 3.5.2、集成微服务
现在，GrayLog的服务端日志收集器已经准备好，我们还需要在项目中添加GrayLog的客户端，将项目日志发送到GrayLog服务中，保存到ElasticSearch。
基本步骤如下：

- 引入GrayLog客户端依赖
- 配置Logback，集成GrayLog的Appender
- 启动并测试

这里，我们以work微服务为例，其他的类似。
导入依赖：
```xml
<dependency>
    <groupId>biz.paluch.logging</groupId>
    <artifactId>logstash-gelf</artifactId>
    <version>1.15.0</version>
</dependency>
```
配置Logback，在配置文件中增加 GELF的appender：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!--scan: 当此属性设置为true时，配置文件如果发生改变，将会被重新加载，默认值为true。-->
<!--scanPeriod: 设置监测配置文件是否有修改的时间间隔，如果没有给出时间单位，默认单位是毫秒。当scan为true时，此属性生效。默认的时间间隔为1分钟。-->
<!--debug: 当此属性设置为true时，将打印出logback内部日志信息，实时查看logback运行状态。默认值为false。-->
<configuration debug="false" scan="false" scanPeriod="60 seconds">
    <springProperty scope="context" name="appName" source="spring.application.name"/>
    <!--文件名-->
    <property name="logback.appname" value="${appName}"/>
    <!--文件位置-->
    <property name="logback.logdir" value="/data/logs"/>

    <!-- 定义控制台输出 -->
    <appender name="stdout" class="ch.qos.logback.core.ConsoleAppender">
        <layout class="ch.qos.logback.classic.PatternLayout">
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} - [%thread] - %-5level - %logger{50} - %msg%n</pattern>
        </layout>
    </appender>


    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <filter class="ch.qos.logback.classic.filter.ThresholdFilter">
            <level>DEBUG</level>
        </filter>
        <File>${logback.logdir}/${logback.appname}/${logback.appname}.log</File>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <FileNamePattern>${logback.logdir}/${logback.appname}/${logback.appname}.%d{yyyy-MM-dd}.log.zip</FileNamePattern>
            <maxHistory>90</maxHistory>
        </rollingPolicy>
        <encoder>
            <charset>UTF-8</charset>
            <pattern>%d [%thread] %-5level %logger{36} %line - %msg%n</pattern>
        </encoder>
    </appender>

    <appender name="GELF" class="biz.paluch.logging.gelf.logback.GelfLogbackAppender">
        <!--GrayLog服务地址-->
        <host>udp:192.168.150.101</host>
        <!--GrayLog服务端口-->
        <port>12201</port>
        <version>1.1</version>
        <!--当前服务名称-->
        <facility>${appName}</facility>
        <extractStackTrace>true</extractStackTrace>
        <filterStackTrace>true</filterStackTrace>
        <mdcProfiling>true</mdcProfiling>
        <timestampPattern>yyyy-MM-dd HH:mm:ss,SSS</timestampPattern>
        <maximumMessageSize>8192</maximumMessageSize>
    </appender>

    <!--evel:用来设置打印级别，大小写无关：TRACE, DEBUG, INFO, WARN, ERROR, ALL 和 OFF，-->
    <!--不能设置为INHERITED或者同义词NULL。默认是DEBUG。-->
    <root level="INFO">
        <appender-ref ref="stdout"/>
        <appender-ref ref="GELF"/>
    </root>
</configuration>
```
修改代码，`com.sl.ms.work.controller.TransportOrderController#findStatusCount()`进入打印日志便于查看数据，启动服务，点击search按钮即可看到日志数据：
![](./assets/image-20240407183435285-386.png)
## 3.6、日志回收策略
到此graylog的基础配置就算完成了，已经可以收到日志数据。
但是在实际工作中，服务日志会非常多，这么多的日志，如果不进行存储限制，那么不久就会占满磁盘，查询变慢等等，而且过久的历史日志对于实际工作中的有效性也会很低。
Graylog则自身集成了日志数据限制的配置，可以通过如下进行设置：
![](./assets/image-20240407183435285-387.png)
选择`Default index set`的`Edit`按钮：
![](./assets/image-20240407183435286-388.png)
GrayLog有3种日志回收限制，触发以后就会开始回收空间，删除索引：
![](./assets/image-20240407183435286-389.png)
分别是：

- `Index Message Count`：按照日志数量统计，默认超过`20000000`条日志开始清理
   - 我们测试时，设置`100000`即可
- `Index Size`：按照日志大小统计，默认超过`1GB`开始清理
- `Index Message Count`：按照日志日期清理，默认日志存储1天
## 3.7、搜索语法
在search页面，可以完成基本的日志搜索功能：
![](./assets/image-20240407183435286-390.png)
### 3.7.1、搜索语法
搜索语法非常简单，输入关键字或指定字段进行搜索：
```shell
#不指定字段，默认从message字段查询
输入：undo

#输入两个关键字，关系为or
undo 统计

#加引号是需要完整匹配
"undo 统计"

#指定字段查询，level表示日志级别，ERROR（3）、WARNING（4）、NOTICE（5）、INFO（6）、DEBUG（7）
level: 6

#或条件
level:(6 OR 7)
```
更多查询官网文档：[https://docs.graylog.org/docs/query-language](https://docs.graylog.org/docs/query-language)
### 3.7.2、自定义展示字段
![](./assets/image-20240407183435286-391.png)
效果如下：
![](./assets/image-20240407183435286-392.png)
## 3.8、日志统计仪表盘
GrayLog支持把日志按照自己需要的方式形成统计报表，并把许多报表组合一起，形成DashBoard（仪表盘），方便对日志统计分析。
### 3.8.1、创建仪表盘
![](./assets/image-20240407183435286-393.png)
![](./assets/image-20240407183435286-394.png)
![](./assets/image-20240407183435286-395.png)
可以设置各种指标：
![](./assets/image-20240407183435286-396.png)
![](./assets/image-20240407183435286-397.png)
![](./assets/image-20240407183435286-398.png)
![](./assets/image-20240407183435286-399.png)
最终效果：
![](./assets/image-20240407183435286-400.png)
官方给出的效果：
![](./assets/image-20240407183435286-401.png)
# 4、链路追踪
## 4.1、APM
### 4.1.1、什么是APM
随着微服务架构的流行，一次请求往往需要涉及到多个服务，因此服务性能监控和排查就变得更复杂

- 不同的服务可能由不同的团队开发、甚至可能使用不同的编程语言来实现
- 服务有可能布在了几千台服务器，横跨多个不同的数据中心

因此，就需要一些可以帮助理解系统行为、用于分析性能问题的工具，以便发生故障的时候，能够快速定位和解决问题，这就是APM系统，全称是（**A**pplication **P**erformance **M**onitor，当然也有叫 **A**pplication **P**erformance **M**anagement tools）
APM最早是谷歌公开的论文提到的 [Google Dapper](http://bigbully.github.io/Dapper-translation)。Dapper是Google生产环境下的分布式跟踪系统，自从Dapper发展成为一流的监控系统之后，给google的开发者和运维团队帮了大忙，所以谷歌公开论文分享了Dapper。
### 4.1.2、原理
先来看一次请求调用示例：

1. 包括：前端（A），两个中间层（B和C），以及两个后端（D和E）
2. 当用户发起一个请求时，首先到达前端A服务，然后分别对B服务和C服务进行RPC调用；
3. B服务处理完给A做出响应，但是C服务还需要和后端的D服务和E服务交互之后再返还给A服务，最后由A服务来响应用户的请求；

![](./assets/image-20240407183435286-402.png)
如何才能实现跟踪呢？需要明白下面几个概念：

- 探针：负责在客户端程序运行时收集服务调用链路信息，发送给收集器
- 收集器：负责将数据格式化，保存到存储器
- 存储器：保存数据
- UI界面：统计并展示

探针会在链路追踪时记录每次调用的信息，Span是**基本单元**，一次链路调用（可以是RPC，DB等没有特定的限制）创建一个span，通过一个64位ID标识它；同时附加（Annotation）作为payload负载信息，用于记录性能等数据。
一个Span的基本数据结构：
```c
type Span struct {
    TraceID    int64 // 用于标示一次完整的请求id
    Name       string //名称
    ID         int64 // 当前这次调用span_id
    ParentID   int64 // 上层服务的调用span_id  最上层服务parent_id为null，代表根服务root
    Annotation []Annotation // 记录性能等数据
    Debug      bool
}
```
一次请求的每个链路，通过spanId、parentId就能串联起来：
![](./assets/image-20240407183435286-403.png)
当然，从请求到服务器开始，服务器返回response结束，每个span存在相同的唯一标识trace_id。
### 4.1.3、技术选型
市面上的全链路监控理论模型大多都是借鉴Google Dapper论文，重点关注以下三种APM组件：

- [**Zipkin**](https://link.juejin.im/?target=http%3A%2F%2Fzipkin.io%2F)：由Twitter公司开源，开放源代码分布式的跟踪系统，用于收集服务的定时数据，以解决微服务架构中的延迟问题，包括：数据的收集、存储、查找和展现。
- [**Pinpoint**](https://pinpoint.com/)：一款对Java编写的大规模分布式系统的APM工具，由韩国人开源的分布式跟踪组件。
- [**Skywalking**](https://skywalking.apache.org/zh/)：国产的优秀APM组件，是一个对JAVA分布式应用程序集群的业务运行情况进行追踪、告警和分析的系统。现在是Apache的顶级项目之一。

选项就是对比各个系统的使用差异，主要对比项：

1.  **探针的性能**
主要是agent对服务的吞吐量、CPU和内存的影响。微服务的规模和动态性使得数据收集的成本大幅度提高。 
2.  **collector的可扩展性**
能够水平扩展以便支持大规模服务器集群。 
3.  **全面的调用链路数据分析**
提供代码级别的可见性以便轻松定位失败点和瓶颈。 
4.  **对于开发透明，容易开关**
添加新功能而无需修改代码，容易启用或者禁用。 
5.  **完整的调用链应用拓扑**
自动检测应用拓扑，帮助你搞清楚应用的架构 

三者对比如下：

| 对比项 | zipkin | pinpoint | skywalking |
| --- | --- | --- | --- |
| 探针性能 | 中 | 低 | **高** |
| collector扩展性 | **高** | 中 | **高** |
| 调用链路数据分析 | 低 | **高** | 中 |
| 对开发透明性 | 中 | **高** | **高** |
| 调用链应用拓扑 | 中 | **高** | 中 |
| 社区支持 | **高** | 中 | **高** |

综上所述，使用skywalking是最佳的选择。
## 4.2、Skywalking简介
SkyWalking创建与2015年，提供分布式追踪功能，是一个功能完备的APM系统。
官网地址：[http://skywalking.apache.org/](http://skywalking.apache.org/)
![](./assets/image-20240407183435286-404.png)
主要的特征：

-  多语言探针或类库 
   - Java自动探针，追踪和监控程序时，不需要修改源码。
   - 社区提供的其他多语言探针 
      - [.NET Core](https://github.com/OpenSkywalking/skywalking-netcore)
      - [Node.js](https://github.com/OpenSkywalking/skywalking-nodejs)
-  多种后端存储： ElasticSearch， H2 
-  支持OpenTracing 
   - Java自动探针支持和OpenTracing API协同工作
-  轻量级、完善功能的后端聚合和分析 
-  现代化Web UI 
-  日志集成 
-  应用、实例和服务的告警 

官方架构图：
![](./assets/image-20240407183435286-405.png)
大致分四个部分：

- skywalking-oap-server：就是**O**bservability **A**nalysis **P**latform的服务，用来收集和处理探针发来的数据
- skywalking-UI：就是skywalking提供的Web UI 服务，图形化方式展示服务链路、拓扑图、trace、性能监控等
- agent：探针，获取服务调用的链路信息、性能信息，发送到skywalking的OAP服务
- Storage：存储，一般选择elasticsearch

因此我们安装部署也从这四个方面入手，目前elasticsearch已经安装完成，只需要部署其他3个即可。
## 4.3、部署安装
通过docker部署，需要部署两部分，分别是`skywalking-oap-server`和`skywalking-UI`。
```shell
#oap服务，需要指定Elasticsearch以及链接信息
docker run -d \
-e TZ=Asia/Shanghai \
--name oap \
-p 12800:12800 \
-p 11800:11800 \
-e SW_STORAGE=elasticsearch \
-e SW_STORAGE_ES_CLUSTER_NODES=192.168.150.101:9200 \
apache/skywalking-oap-server:9.1.0


#部署ui，需要指定oap服务
docker run -d \
--name oap-ui \
-p 48080:8080 \
-e TZ=Asia/Shanghai \
-e SW_OAP_ADDRESS=http://192.168.150.101:12800 \
apache/skywalking-ui:9.1.0
```
启动成功后，访问地址[http://192.168.150.101:48080/](http://192.168.150.101:48080/)，即可查看skywalking的ui界面。
![](./assets/image-20240407183435286-406.png)
## 4.4、微服务探针
现在，Skywalking的服务端已经启动完成，我们还需要在微服务中加入服务探针，来收集数据。
![](./assets/image-20240407183435286-407.png)
将`skywalking-agent`解压到非中文目录。
在微服务中设置启动参数，以work微服务为例：
![](./assets/image-20240407183435286-408.png)
输入如下内容：
```shell
-javaagent:F:\code\sl-express\docs\resources\skywalking-agent\skywalking-agent.jar
-Dskywalking.agent.service_name=ms::sl-express-ms-work
-Dskywalking.collector.backend_service=192.168.150.101:11800
```
参数说明：

- javaagent： 将skywalking-agent以代理的方式整合到微服务中
- skywalking.agent.service_name：指定服务名称，格式：[${group name}::]${logic name}
- skywalking.collector.backend_service：指定oap服务，注意端口要走11800

设置完成后，重新启动work微服务，多请求几次接口，即可自oap-ui中看到数据。
![](./assets/image-20240407183435286-409.png)
![](./assets/image-20240407183435286-410.png)
查看链路：
![](./assets/image-20240407183435286-411.png)
服务关系拓扑图：
![](./assets/image-20240407183435286-412.png)
## 4.5、整合到docker服务
前面的测试是在本地测试，如何将SkyWalking整合到docker服务中呢？
这里以`sl-express-ms-web-courier`为例，其他的服务类似。
第一步，修改Dockerfile文件
```shell
#FROM openjdk:11-jdk
#修改为基于整合了skywalking的镜像，其他的不需要动
FROM apache/skywalking-java-agent:8.11.0-java11
LABEL maintainer="研究院研发组 <research@itcast.cn>"
 
# 时区修改为东八区
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
 
WORKDIR /app
ARG JAR_FILE=target/*.jar
ADD ${JAR_FILE} app.jar

EXPOSE 8080
ENTRYPOINT ["sh","-c","java -Djava.security.egd=file:/dev/./urandom -jar $JAVA_OPTS app.jar"]
```
第二步，在Jenkins中编辑修改配置：
`名称：skywalkingServiceName   值：ms::sl-express-ms-web-courier`
![](./assets/image-20240407183435286-413.png)
`名称：skywalkingBackendService   值：192.168.150.101:11800`
![](./assets/image-20240407183435287-414.png)
修改运行脚本，增加系统环境变量：
`-e SW_AGENT_NAME=${skywalkingServiceName} -e SW_AGENT_COLLECTOR_BACKEND_SERVICES=${skywalkingBackendService}`
![](./assets/image-20240407183435287-415.png)
第三步，重新部署服务：
![](./assets/image-20240407183435287-416.png)
第四步，测试接口，查看数据。
![](./assets/image-20240407183435287-417.png)
![](./assets/image-20240407183435287-418.png)
# 5、练习
## 5.1、练习1
难度系数：★★☆☆☆
描述：修改所有微服务中的`logback-spring.xml`完成Graylog的整合。
## 5.1、练习2
难度系数：★★★★☆
描述：将所有的微服务与skywalking整合。
