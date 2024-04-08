---
title: 一、FFmpeg学习笔记
date: 2023-04-03 21:29:40
order: 1
author:
  name: liu yang fang 
  link: https://github.com/lyf110
category:
  - 音影视频
  - FFmpeg
tag:
  - 音影视频
  - FFmpeg
---

# 一、FFmpeg学习笔记

## 1 常用命令

### 1.1 将mkv视频（无损）转成mp4视频

```shell
ffmpeg -y -i "input.mkv" -c:v copy -c:a copy "output.mp4" 
```

### 1.2 将字幕外挂到mp4视频中

```shell
ffmpeg -y -i "input.mp4" -i "input.ass" -c copy -c:s mov_text "output-中文字幕.mp4"
```

### 1.3 视频切割

```shell
# 从第什么时间开始切割
ffmpeg -y -ss 00:00:45 -i "input.mp4" -c:v copy -c:a copy "output.mp4"

# 切割指定范围时间的视频
ffmpeg -ss 00:00:00 -to 02:00:00 -i "input.mp4" -c:v copy -c:a copy "output.mp4"
```

