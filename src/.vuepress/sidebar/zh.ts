import {sidebar} from "vuepress-theme-hope";

export const zhSidebar = sidebar({
    "/": [
        {
            text: "Java",
            icon: "java",
            prefix: "java/",
            collapsible: true,
            children: [
                {
                    text: "网络编程",
                    icon: "network",
                    prefix: "socket/",
                    collapsible: true,
                    children: "structure",
                },
            ]
        },

        {
            text: "数据库",
            icon: "database",
            prefix: "database/",
            collapsible: true,
            children: [
                {
                    text: "MySQL",
                    icon: "mysql",
                    prefix: "mysql/",
                    collapsible: true,
                    children: [
                        {
                            text: "黑马2022版",
                            icon: "mysql",
                            prefix: "heima2022/",
                            children: [
                                {
                                    text: "基础篇",
                                    icon: "mysql",
                                    prefix: "base/",
                                    children: "structure",
                                },
                                {
                                    text: "高级篇",
                                    icon: "mysql",
                                    prefix: "plus/",
                                    children: "structure",
                                },
                                {
                                    text: "运维",
                                    icon: "mysql",
                                    prefix: "op/",
                                    children: "structure",
                                },
                            ],
                        },
                    ],
                },

                {
                    text: "Redis",
                    icon: "redis",
                    prefix: "redis/",
                    collapsible: true,
                    children: [
                        {
                            text: "Redis-黑马2022-满一行版",
                            icon: "redis",
                            prefix: "heima2022/",
                            collapsible: true,
                            children: "structure"
                        },
                        {
                            text: "Redis-尚硅谷2023版",
                            icon: "redis",
                            prefix: "atguigu2023/",
                            collapsible: true,
                            children: "structure"
                        },
                    ],
                },
                {
                    text: "MongoDB",
                    icon: "mongo",
                    prefix: "mongo/",
                    collapsible: true,
                    children: "structure",
                },
            ],
        },

        {
            text: "框架",
            icon: "framework",
            prefix: "framework/",
            collapsible: true,
            children: [
                {
                    text: "Spring",
                    icon: "spring",
                    prefix: "spring/",
                    collapsible: true,
                    children: [
                        {
                            text: "Spring-黑马49讲",
                            icon: "spring",
                            prefix: "spring49/",
                            collapsible: true,
                            children: "structure",
                        },
                        {
                            text: "Spring-黑马66期版本",
                            icon: "spring",
                            prefix: "spring66/",
                            collapsible: true,
                            children: "structure",
                        },
                    ],
                },
                {
                    text: "SpringMVC",
                    icon: "springmvc",
                    prefix: "springmvc/",
                    collapsible: true,
                    children: "structure",
                },
                {
                    text: "Mybatis",
                    icon: "mybatis",
                    prefix: "mybatis/",
                    collapsible: true,
                    children: "structure",
                },
                {
                    text: "MybatisPlus",
                    icon: "mybatisplus",
                    prefix: "mybatisplus/",
                    collapsible: true,
                    children: "structure",
                },
                {
                    text: "SpringBoot",
                    icon: "springboot",
                    prefix: "springboot/",
                    collapsible: true,
                    children: "structure",
                },
                {
                    text: "SpringCloud",
                    icon: "springcloud",
                    prefix: "springcloud/",
                    collapsible: true,
                    children: "structure",
                },
            ],
        },


        {
            text: "中间件",
            icon: "middleware",
            prefix: "middleware/",
            collapsible: true,
            children: [
                {
                    text: "消息中间件",
                    icon: "mq",
                    prefix: "mq/",
                    collapsible: true,
                    children: [
                        {
                            text: "RabbitMQ",
                            icon: "mq",
                            prefix: "rabbitmq/",
                            collapsible: true,
                            children: "structure",
                        },
                        {
                            text: "RocketMq",
                            icon: "mq",
                            prefix: "rocketmq/",
                            collapsible: true,
                            children: "structure",
                        },
                        {
                            text: "kafka",
                            icon: "mq",
                            prefix: "kafka/",
                            collapsible: true,
                            children: "structure",
                        },
                    ],
                },
                {
                    text: "分布式搜索es",
                    icon: "es",
                    prefix: "elasticsearch/",
                    collapsible: true,
                    children: [
                        {
                            text: "es-黑马2022版",
                            icon: "es",
                            prefix: "heima2022/",
                            collapsible: true,
                            children: "structure",
                        },
                        {
                            text: "es-黑马66期版",
                            icon: "es",
                            prefix: "heima66/",
                            collapsible: true,
                            children: "structure",
                        },
                    ],
                },
                {
                    text: "配置中心和注册中心nacos",
                    icon: "nacos",
                    prefix: "nacos/",
                    collapsible: true,
                    children: "structure",
                },
                {
                    text: "分布式事务seata",
                    icon: "seata",
                    prefix: "seata/",
                    collapsible: true,
                    children: "structure",
                },
                {
                    text: "服务监控和保护sentinel",
                    icon: "sentinel",
                    prefix: "sentinel/",
                    collapsible: true,
                    children: "structure",
                },
                {
                    text: "阿里微服务调用中心dubbo",
                    icon: "dubbo",
                    prefix: "dubbo/",
                    collapsible: true,
                    children: "structure",
                },
                {
                    text: "注册中心zookeeper",
                    icon: "zookeeper",
                    prefix: "zookeeper/",
                    collapsible: true,
                    children: "structure",
                },
            ],
        },

        {
            text: "分布式",
            icon: "distributed",
            prefix: "distributed/",
            collapsible: true,
            children: "structure",
        },

        {
            text: "容器与开发工具",
            icon: "tool",
            prefix: "tools/",
            collapsible: true,
            children: [
                {
                    text: "代码开发工具IDEA",
                    icon: "idea",
                    prefix: "idea/",
                    collapsible: true,
                    children: "structure",
                },
                {
                    text: "代码仓库管理工具Maven",
                    icon: "maven",
                    prefix: "maven/",
                    collapsible: true,
                    children: "structure",
                },
                {
                    text: "容器技术Docker",
                    icon: "docker",
                    prefix: "docker/",
                    collapsible: true,
                    children: "structure",
                },
                {
                    text: "容器编排技术",
                    icon: "",
                    prefix: "k8s/",
                    collapsible: true,
                    children: "structure",
                },
            ],
        },

        {
            text: "项目",
            icon: "project",
            prefix: "project/",
            collapsible: true,
            children: [
                {
                    text: "神领物流",
                    icon: "project",
                    prefix: "slwl/",
                    collapsible: true,
                    children: [
                        {
                            text: "笔记",
                            icon: "project",
                            prefix: "notes/",
                            collapsible: true,
                            children: "structure",
                        },
                        {
                            text: "其他",
                            icon: "project",
                            prefix: "others/",
                            collapsible: true,
                            children: "structure",
                        },
                    ],
                },
                {
                    text: "天机学堂",
                    icon: "project",
                    prefix: "tjxt/",
                    collapsible: true,
                    children: [
                        {
                            text: "笔记",
                            icon: "project",
                            prefix: "notes/",
                            collapsible: true,
                            children: "structure",
                        },
                        {
                            text: "其他",
                            icon: "project",
                            prefix: "others/",
                            collapsible: true,
                            children: "structure",
                        },
                    ],
                },
                {
                    text: "黑马头条",
                    icon: "project",
                    prefix: "hmtt/",
                    collapsible: true,
                    children: [
                        {
                            text: "笔记",
                            icon: "project",
                            prefix: "notes/",
                            collapsible: true,
                            children: "structure",
                        },
                        {
                            text: "其他",
                            icon: "project",
                            prefix: "others/",
                            collapsible: true,
                            children: "structure",
                        },
                    ],
                },
                {
                    text: "中州养老",
                    icon: "project",
                    prefix: "zzyl/",
                    collapsible: true,
                    children: [
                        {
                            text: "笔记",
                            icon: "project",
                            prefix: "notes/",
                            collapsible: true,
                            children: "structure",
                        },
                        {
                            text: "其他",
                            icon: "project",
                            prefix: "others/",
                            collapsible: true,
                            children: "structure",
                        },
                    ],
                },
                {
                    text: "云岚到家",
                    icon: "project",
                    prefix: "j2oto/",
                    collapsible: true,
                    children: [
                        {
                            text: "笔记",
                            icon: "project",
                            prefix: "notes/",
                            collapsible: true,
                            children: "structure",
                        },
                        {
                            text: "其他",
                            icon: "project",
                            prefix: "others/",
                            collapsible: true,
                            children: "structure",
                        },
                    ],
                },
            ],
        },


        {
            text: "前端技术",
            icon: "vue",
            prefix: "front/",
            collapsible: true,
            children: [
                {
                    text: "ajax",
                    icon: "ajax",
                    prefix: "ajax/",
                    collapsible: true,
                    children: "structure",
                },
                {
                    text: "bootstrap",
                    icon: "bootstrap",
                    prefix: "bootstrap/",
                    collapsible: true,
                    children: "structure",
                },
                {
                    text: "jquery",
                    icon: "jquery",
                    prefix: "jquery/",
                    collapsible: true,
                    children: "structure",
                },
                {
                    text: "vue",
                    icon: "vue",
                    prefix: "vue/",
                    collapsible: true,
                    children: "structure",
                },

            ],
        },


        {
            text: "其他",
            icon: "note",
            prefix: "others/",
            collapsible: true,
            children: "structure",
        },
    ],

    "/interview/": [
        {
            text: "Java基础",
            icon: "java",
            prefix: "javabase/",
            collapsible: true,
            children: [
                {
                    text: "基础",
                    icon: "java",
                    prefix: "base/",
                    collapsible: true,
                    children: "structure",
                },
                {
                    text: "集合",
                    icon: "java",
                    prefix: "collection/",
                    collapsible: true,
                    children: "structure",
                },
                {
                    text: "多线程",
                    icon: "java",
                    prefix: "juc/",
                    collapsible: true,
                    children: "structure",
                },
                {
                    text: "Lambda",
                    icon: "java",
                    prefix: "Lambda/",
                    collapsible: true,
                    children: "structure",
                },
            ],
        },
        {
            text: "数据库",
            icon: "mysql",
            prefix: "database/",
            collapsible: true,
            children: [
                {
                    text: "MySQL",
                    icon: "mysql",
                    prefix: "mysql/",
                    collapsible: true,
                    children: "structure",
                },
                {
                    text: "Redis",
                    icon: "cache",
                    prefix: "redis/",
                    collapsible: true,
                    children: "structure",
                },
                {
                    text: "MongoDB",
                    icon: "mysql",
                    prefix: "mongo/",
                    collapsible: true,
                    children: "structure",
                },
            ],
        },
        {
            text: "常用框架",
            icon: "java",
            prefix: "ssm/",
            collapsible: true,
            children: [
                {
                    text: "Spring",
                    icon: "java",
                    prefix: "spring/",
                    collapsible: true,
                    children: "structure"
                },
                {
                    text: "SpringMVC",
                    icon: "java",
                    prefix: "springmvc/",
                    collapsible: true,
                    children: "structure"
                },
                {
                    text: "Mybatis",
                    icon: "mysql",
                    prefix: "mybatis/",
                    collapsible: true,
                    children: "structure"
                },
            ],
        },
        {
            text: "微服务",
            icon: "es6",
            prefix: "cloud/",
            collapsible: true,
            children: "structure",
        },
        {
            text: "计算机与数据结构和算法",
            icon: "computer",
            prefix: "computer/",
            collapsible: true,
            children: [
                {
                    text: "数据结构与算法",
                    icon: "calculate",
                    prefix: "Data_Structure_Algorithm/",
                    collapsible: true,
                    children: "structure"
                },
                {
                    text: "计算机",
                    icon: "computer",
                    prefix: "pc/",
                    collapsible: true,
                    children: "structure"
                },
                {
                    text: "ffmpeg",
                    icon: "tool",
                    prefix: "ffmpeg/",
                    collapsible: true,
                    children: "structure"
                },
                {
                    text: "Linux",
                    icon: "linux",
                    prefix: "Linux/",
                    collapsible: true,
                    children: "structure"
                },
            ],
        },
        {
            text: "windows",
            icon: "computer",
            prefix: "windows/",
            collapsible: true,
            children: "structure",
        },
        {
            text: "项目",
            icon: "workingDirectory",
            prefix: "project/",
            collapsible: true,
            children: "structure",
        },
    ],

})
