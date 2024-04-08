---
title: 一、Windows查询进程和结束进程命令
date: 2023-04-04 10:36:43
order: 1
category:
  - windows
  - 进程命令 
tag:
  - windows
  - 进程命令 
author: 
  name: liuyangfang
  link: https://github.com/lyf110
---

# Windows查询进程和结束进程命令

## 1 查询所有的端口号: `netstat -ano`

```shell
netstat -ano
```

### 1.1 结果

```shell
C:\Users\11029>netstat -ano

活动连接

  协议  本地地址          外部地址        状态           PID
  TCP    0.0.0.0:135            0.0.0.0:0              LISTENING       1120
  TCP    0.0.0.0:443            0.0.0.0:0              LISTENING       5900
  TCP    0.0.0.0:445            0.0.0.0:0              LISTENING       4
  TCP    0.0.0.0:902            0.0.0.0:0              LISTENING       4712
  
  ...
  
  UDP    [fe80::752e:78f:ce2:5f60%21]:1900  *:*                                    10224
  UDP    [fe80::752e:78f:ce2:5f60%21]:55078  *:*                                    10224
  UDP    [fe80::a776:92d8:c1cc:29bf%9]:1900  *:*                                    10224
  UDP    [fe80::a776:92d8:c1cc:29bf%9]:55077  *:*                                    10224
  UDP    [fe80::c512:8238:c2dc:b4e7%5]:1900  *:*                                    10224
  UDP    [fe80::c512:8238:c2dc:b4e7%5]:55076  *:*                                    10224
```

## 2 搜索指定端口: `netstat -ano | findstr 端口号`

```shell
netstat -ano | findstr 10001
```

### 2.1 结果

```shell
C:\Users\11029>netstat -ano | findstr 10001
  TCP    192.200.216.227:10001  222.73.192.124:443     ESTABLISHED     14372
```

## 3 查询子进程`tasklist | findstr 端口号`

```shell
tasklist | findstr 14372
```

### 3.1 结果

```shell
C:\Users\11029>tasklist | findstr 14372
ApplePhotoStreams.exe        14372 Console                    4     42,892 K
```

## 4 杀掉子进程`taskkill /f /t /im "子进程名字" `

```shell
taskkill /f /t /im "ApplePhotoStreams.exe"
```

### 4.1 结果

```shell
C:\Users\11029>taskkill /f /t /im "ApplePhotoStreams.exe"
成功: 已终止 PID 14372 (属于 PID 13872 子进程)的进程。
```

## 5 验证

```shell
C:\Users\11029>netstat -ano | findstr 10001

C:\Users\11029>
```

