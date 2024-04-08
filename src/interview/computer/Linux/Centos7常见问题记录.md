---
title: 二、Centos系统常见问题记录
date: 2023-04-10 16:41:49
order: 2
category:
  - Centos7
  - linux
  - 运维
tag:
  - Centos7
  - linux
  - 运维
author: 
  name: liuyangfang
  link: https://github.com/lyf110
---

# Centos系统常见问题记录

## 1 centos用ssh登录连接缓慢处理

### 一、用ssh登录服务器，发现登录缓慢，登录一次可能需要30秒左右，于是用ssh -vvv ip地址 查看详细登录信息 具体看那个阶段慢

### 二、有这几个原因

#### 1、连接慢的主要原因是DNS解析导致

##### 1）、在ssh服务端上更改/etc/ssh/sshd_config文件中的配置为如下内容：

```shell
UseDNS no
# GSSAPI options
GSSAPIAuthentication no
```



##### 2）、然后，执行/etc/init.d/sshd restart重启sshd进程使上述配置生效，在连接一般就不慢

```shell
service sshd restart
# or
systemctl restart sshd
```



#### 2、systemd-logind服务问题

```shell
systemctl stop systemd-logind
```

## 2 ssh连接服务器经常断开连接的解决方案

在使用 ssh 连接远程服务器时，经常会遇到刚连接上还没一会就断开连接的情况，这事由于 ssh 服务特有的会话连接机制判断客户端是否存活或者长时间未产生动作而主动将其断开，这样的机制经常会存在一些误判的情况。

这样的机制可以通过设置 sshd_config 文件来修改：
### 2.1 打开 sshd_config 文件

```shell
vim /etc/ssh/sshd_config
```



### 2.2 添加如下两行配置，保存并退出

```shell
# 设定每隔多少秒给 ssh 客户端发送一次信号
ClientAliveInterval 60
# 设定超过多少秒后断开与 ssh 客户端连接
ClientAliveCountMax 86400

```

> [注]：此处的配置名称需要拼写正确，如若不然则会导致 sshd 无法重启。



### 2.3 重启 ssh 服务

```shell
service sshd restart
# or
systemctl restart sshd
```

#### 2.4 shell 命令行便捷修改

> [注]：执行过 1、2、3 步骤后可跳过第 4 步，或仅使用第 4 步，一步搞定。

```shell
sudo sed -i 's/^export TMOUT=.*/export TMOUT=0/' /etc/profile &&sudo sed -i "/#ClientAliveInterval/a\ClientAliveInterval 60" /etc/ssh/sshd_config &&sudo sed -i "/#ClientAliveInterval/d"                        /etc/ssh/sshd_config &&sudo sed -i '/ClientAliveCountMax/ s/^#//'                   /etc/ssh/sshd_config &&sudo /bin/systemctl restart sshd.service

```

> 亦可以将，此处命令复制写入一个 `shell` 脚本中保存使用。
> **到此，重新连接该服务器将不会再频频断开连接了！**