import {navbar} from "vuepress-theme-hope";

export const zhNavbar = navbar([
    {
        text: "首页",
        link: "/"
    },
    {
        text: "Java",
        icon: "java",
        prefix: "/java/",
        children: [
            {
                text: "网络编程",
                icon: "network",
                link: "socket/"
            },
        ]
    },
    {
        text: "数据库",
        icon: "mysql",
        prefix: "/database/",
        children: [
            {
                text: "MySQL",
                icon: "mysql",
                link: "mysql/"
            },
            {
                text: "Redis",
                icon: "redis",
                link: "redis/"
            },
            {
                text: "MongoDB",
                icon: "mongo",
                link: "mongo/"
            },
        ]
    },
    {
        text: "框架",
        icon: "framework",
        prefix: "/framework/",
        children: [
            {
                text: "Spring",
                icon: "spring",
                link: "spring/"
            },
            {
                text: "SpringMVC",
                icon: "mvc",
                link: "springmvc/"
            },
            {
                text: "Mybatis",
                icon: "mybatis",
                link: "mybatis/"
            },
            {
                text: "MybatisPlus",
                icon: "mybatisplus",
                link: "mybatis-plus/"
            },
            {
                text: "SpringBoot",
                icon: "springboot",
                link: "springboot/"
            },
            {
                text: "SpringCloud",
                icon: "springcloud",
                link: "springcloud/"
            },
        ]
    },
    {
        text: "中间件",
        icon: "middleware",
        prefix: "/middleware/",
        children: [
            {
                text: "消息中间件",
                icon: "mq",
                prefix: "mq/",
                children:[
                    {
                        text: "RabbitMQ",
                        icon: "rabbitmq",
                        link: "rabbitmq/"
                    },
                    {
                        text: "RocketMQ",
                        icon: "rocketmq",
                        link: "rocketmq/"
                    },
                    {
                        text: "Kafka",
                        icon: "kafka",
                        link: "kafka/"
                    },
                ]
            },
            {
                text: "分布式搜索",
                icon: "es",
                link: "elasticsearch/"
            },
            {
                text: "nacos",
                icon: "nacos",
                link: "nacos/"
            },
            {
                text: "seata",
                icon: "seata",
                link: "seata/"
            },
            {
                text: "sentinel",
                icon: "sentinel",
                link: "sentinel/"
            },
            {
                text: "dubbo",
                icon: "dubbo",
                link: "dubbo/"
            },
            {
                text: "zookeeper",
                icon: "zookeeper",
                link: "zookeeper/"
            },
        ],
    },
    {
        text: "分布式",
        icon: "distributed",
        prefix: "/distributed",
        children: []
    },
    {
        text: "容器与开发工具",
        icon: "tool",
        prefix: "/tools/",
        children: [
            {
                text: "IDEA",
                icon: "idea",
                link: "idea/"
            },
            {
                text: "Maven",
                icon: "maven",
                link: "maven/"
            },
            {
                text: "docker",
                icon: "docker",
                link: "docker/"
            },
            {
                text: "k8s",
                icon: "k8s",
                link: "k8s/"
            },
        ]
    },

    {
        text: "项目",
        icon: "project",
        prefix: "/project/",
        children: [
            {
                text: "神领物流",
                icon: "project",
                link: "slwl/"
            },
            {
                text: "天机学堂",
                icon: "project",
                link: "tjxt/"
            },
            {
                text: "黑马头条",
                icon: "project",
                link: "hmtt/"
            },
            {
                text: "中州养老",
                icon: "project",
                link: "zzyl/"
            },
            {
                text: "云岚到家",
                icon: "project",
                link: "j2oto/"
            },
        ]
    },
    {
        text: "前端",
        icon: "front",
        prefix: "/front",
        children: [
            {
                text: "ajax",
                icon: "ajax",
                link: "ajax/"
            },
            {
                text: "bootstrap",
                icon: "bootstrap",
                link: "bootstrap/"
            },
            {
                text: "jquery",
                icon: "jquery",
                link: "jquery/"
            },
            {
                text: "vue",
                icon: "vue",
                link: "vue/"
            },
        ]
    },
    {
        text: "面试",
        icon: "java",
        prefix: "/interview/",
        children: [
            {
                text: "Java基础",
                icon: "java",
                link: "javabase/",
            },
            {
                text: "数据库",
                icon: "mysql",
                link: "database/",
            },
            {
                text: "常用框架",
                icon: "java",
                link: "ssm/",
            },
            {
                text: "微服务",
                icon: "es6",
                link: "cloud/",
            },
            {
                text: "计算机原理",
                icon: "computer",
                link: "computer/",
            },
            {
                text: "windows相关",
                icon: "computer",
                link: "windows/",
            },
            {
                text: "项目",
                icon: "workingDirectory",
                link: "project/",
            }
        ]
    },
    {
        text: "其它",
        icon: "others",
        prefix: "/other/",
        children: []
    },
    {
        text: "书签",
        icon: "tool",
        children: [
            {
                text: "常用书签",
                link: "http://localhost:12345/index.html"
            },
            {
                text: "编程书签",
                link: "http://localhost:12345/program/index.html"
            },
        ]
    }
]);
