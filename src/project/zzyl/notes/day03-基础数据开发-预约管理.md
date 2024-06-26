---
title: day03-基础数据开发-预约管理
date: 2024-04-07 19:53:01
order: 4
category:
  - 项目
  - 中州养老
tag:
  - 项目
  - 中州养老
author: 
  name: liuyangfang
  link: https://github.com/lyf110

---


# 基础数据开发-预约管理


## 1 目标

我们先来回顾一下，养老项目的整体业务流程

![](./assets/image-20240407192427893-137.png)

从这个图上，我们可以看出来，整个业务流程的入口就是**参观预约**，客户可以通过小程序线上预约到访时间，我们这一天主要讲的就是小程序端的预约功能的开发，不过如果客户想要预约成功，需要先登录小程序才行。所以，我们今天课程主要目标就是微信**小程序登录**和**预约管理**。具体的目标如下：

- 掌握小程序端的整体实现流程
- 掌握第三方接口的调用方式
- 独立完成微信小程序功能设计开发
- 掌握token的发放和验证方式
- 掌握参观预约的业务需求流程
- 独立完成参观预约涉及到的接口开发
- 1掌握定时任务的使用场景
- 能够读懂cron表达式含义
- 掌握xxl-job的环境搭建及基本使用方式
- 能够独立完成xxl-job对项目的集成使用
- 独立完成预约的作业


## 2 微信小程序登录

我们在day01整体介绍养老项目的时候说过，养老项目分为两端，分别是管理后台和小程序端（家人端），我们day01和day02开发的功能都属于管理端，今天我们先开发一部分小程序端的功能

我们要开发的第一个功能是预约功能，如果有客户对养老院比较感兴趣，也可以在小程序端发起预约参观，不过在发起预约的时候，我们需要获得到客户的手机号，需要用户登录后才能预约，所以在做预约功能之前，我们先来完成微信登录的功能。


### 2.1 需求分析

原型PRD地址：[https://rp-java.itheima.net/zhyl/](https://rp-java.itheima.net/zhyl/)

假如用户现在想要预约参观养老院，假如点击了参观**预约按钮**，则需要先登录后才能操作，效果如下

![](./assets/image-20240407192427894-138.png)

弹出弹窗，提示使用”**微信快速登录**”，用户可以选择使用微信登录，并授权获取用户的手机号

![](./assets/image-20240407192427894-139.png)


### 2.2 实现思路分析

我们的主要实现思路可以根据微信小程序开放者平台给提供的实现思路，链接和流程如下：

微信小程序登录，官方文档：

[https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/login.html](https:_developers.weixin.qq.com_miniprogram_dev_framework_open-ability_login)

登录流程图

![](./assets/image-20240407192427894-140.jpg)

注意点：

- 
前端在小程序中集成微信相关依赖，当用户请求登录的同时，调用[wx.login()](https:_developers.weixin.qq.com_miniprogram_dev_api_open-api_login_wx.login) 获取 **临时登录凭证code** ，并回传到开发者服务器。

- 
开发者服务器可以根据用户标识来生成自定义登录态，用于后续业务逻辑中前后端交互时识别用户身份。

   - 
自定义登录态：后台服务器验证用户成功后，使用JWT生成一个token返回给前端，前端负责把token存储到小程序端的storage中，以后，从小程序中发起其他请求的时候，携带该token到后台验证

![](./assets/image-20240407192427894-141.png)


当前业务具体实现流程

![](./assets/image-20240407192427894-142.jpg)


### 2.2 表结构设计

从小程序端登录的用户主要有两类，第一类是参观预约的用户，第二类是，老人的家人（子女），方便查看老人信息、给老人下单、查看账单、查看合同等服务。

如果是老人的家人，需要跟入住的老人进行绑定，方便后期的更多服务，所以，在小程序端登录的用户，我们需要保存下来，保存到一张表中（客户表）

基于我们刚才的分析，在用户表中需要出现的字段有：

> 主键、手机号、名称、头像、微信OpenID（个人微信唯一ID）、性别


然后再加上必要的字段：

> 创建时间、更新时间、创建人、更新人、备注


如果还不太合适，可以进行手动修复，最终的sql如下：

```sql
CREATE TABLE "member" (
  "id" bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
  "phone" varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '手机号',
  "name" varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '名称',
  "avatar" varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '头像',
  "open_id" varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'OpenID',
  "gender" int DEFAULT NULL COMMENT '性别(0:男，1:女)',
  "create_time" timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  "update_time" timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  "create_by" bigint DEFAULT NULL COMMENT '创建人',
  "update_by" bigint DEFAULT NULL COMMENT '更新人',
  "remark" varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '备注',
  PRIMARY KEY ("id") USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
```

根据以上表结构，对应的实体类，如下：

```java
package com.zzyl.entity;

import com.zzyl.base.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Member extends BaseEntity {

    /**
     * 手机号
     */
    private String phone;

    /**
     * 名称
     */
    private String name;

    /**
     * 头像
     */
    private String avatar;

    /**
     * OpenID
     */
    private String openId;

    /**
     * 性别
     */
    private int gender;

}
```


### 2.3 接口设计

这个接口跟我们平时开发的接口略有不同，这个需要参考微信开发者平台提供的流程来开发。

目前，小程序的代码已经开发完了，我们需要在后台提供接口就可以了

- 
接口路径（已固定）：`/customer/user/login`

- 
请求方式（已固定）：`POST`

- 
请求参数：（已固定）
```json
{
  "code": "0e36jkGa1ercRF0Fu4Ia1V3fPD06jkGW", //临时登录凭证code
  "nickName": "微信用户",
  "phoneCode": "13fe315872a4fb9ed3deee1e5909d5af60dfce7911013436fddcfe13f55ecad3"
}
```

> 以上三个参数，都是前端开发人员调用wx.login()方法返回的数据

> code:临时登录凭证code

> nickName:微信用户昵称（现在微信统一返回为：微信用户）

> phoneCode:详细用户信息code，后台根据此code可以获取用户手机号



- 
响应示例（已固定）
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiLlpb3mn7_lvIDoirE4OTE1IiwiZXhwIjoxNDY1MjI3MTMyOCwidXNlcmlkIjoxfQ.nB6ElZbUywh-yiHDNMJS8WqUpcLWCszVdvAMfySFxIM",
    "nickName": "好柿开花8915"
  },
  "operationTime": null
}
```




### 2.4 功能实现


#### 2.4.1 小程序端环境说明

**1)基础环境说明**

在资料文件夹中找到”养老-小程序”的压缩包，解压到一个没有中文和空格的目录

在资料文件夹中找到”微信开发者工具安装包”安装到本地，也可以直接到官网下载

地址：[https://developers.weixin.qq.com/miniprogram/dev/devtools/stable.html](https:_developers.weixin.qq.com_miniprogram_dev_devtools_stable)

安装成功以后，可以点击”+”号，找到刚才解压的小程序代码的目录

![](./assets/image-20240407192427894-143.png)

在小程序登录的时候，需要获取微信用户的手机号，目前在开发测试阶段，如果想要获取手机号需要把开发者加入小程序的开发者团队中，一个小程序的开发者团队最多50人。所以不能让每位同学都假如开发者团队中，不过，在微信小程序中可以由个人开通测试号来进行调试，这样就可以获取更多的微信信息了，就包含了手机号。

所以，现在大家需要每人注册一个微信小程序的测试号

2)**微信小程序测试申请**

1. 
申请小程序测试号

打开手机微信，扫描二维码，申请小程序测试号

[https://mp.weixin.qq.com/wxamp/sandbox?doc=1](https://mp.weixin.qq.com/wxamp/sandbox?doc=1)

![](./assets/image-20240407192427894-144.png)

2. 
扫码登录

注册成功以后，打开以下页面进行扫码登录

[https://mp.weixin.qq.com/](https://mp.weixin.qq.com/)


![](./assets/image-20240407192427894-145.png)

扫码之后，在手机中选择**小程序测试号**

![](./assets/image-20240407192427894-146.png)

登录成功之后，就可以看到小程序的开发者ID，包含两部分，如下图

![](./assets/image-20240407192427894-147.png)

3. 
修改小程序环境的APPID

使用**微信开发者工具**打开项目在小程序代码

然后打开 -->详情-->修改**APPID**,改为自己申请的测试号APPID

![](./assets/image-20240407192427894-148.png)



#### 2.4.2 后台功能开发

1)接口定义

```java
/**
 * <p>
 * 用户管理
 */
@Slf4j
@Api(tags = "客户管理")
@RestController
@RequestMapping("/customer/user")
public class CustomerUserController {

    /**
     * C端用户登录--微信登录
     *
     * @param userLoginRequestDto 用户登录信息
     * @return 登录结果
     */
    @PostMapping("/login")
    @ApiOperation("登录")
    public ResponseResult<LoginVo> login(@RequestBody UserLoginRequestDto userLoginRequestDto) throws IOException {
        
        return null;
    }

}
```

接收参数类型UserLoginRequestDto

```java
package com.zzyl.dto;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * C端用户登录
 */
@Data
public class UserLoginRequestDto {

    @ApiModelProperty("昵称")
    private String nickName;

    @ApiModelProperty("登录临时凭证")
    private String code;

    @ApiModelProperty("手机号临时凭证")
    private String phoneCode;
}
```

返回类型：LoginVo

```java
@Data
@ApiModel(value = "登录对象")
public class LoginVo {

    @ApiModelProperty(value = "JWT token")
    private String token;

    @ApiModelProperty(value = "昵称")
    private String nickName;
}
```

2)mapper编写

在整个登录的过程中，会涉及到用户的新增、更新、查询，所以我们需要定义三个方法，代码如下：

```java
package com.zzyl.mapper;

import com.zzyl.entity.Member;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

/**
 * @author sjqn
 * @date 2023/10/27
 */
@Mapper
public interface MemberMapper {

    @Select("SELECT * FROM member WHERE open_id = #{openId}")
    Member getByOpenId(String openId);

    void save(Member member);

    void update(Member member);
}
```

MemberMapper.xml映射文件

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd" >
<mapper namespace="com.zzyl.mapper.MemberMapper">
    <resultMap id="BaseResultMap" type="com.zzyl.entity.Member">
        <id column="id" property="id" />
        <result column="phone" property="phone" />
        <result column="name" property="name" />
        <result column="avatar" property="avatar" />
        <result column="open_id" property="openId" />
        <result column="gender" property="gender" />
        <result column="create_by" property="createBy"/>
        <result column="update_by" property="updateBy"/>
        <result column="remark" property="remark"/>
        <result column="create_time" property="createTime"/>
        <result column="update_time" property="updateTime"/>
    </resultMap>
    <insert id="save" parameterType="com.zzyl.entity.Member" keyProperty="id" useGeneratedKeys="true">
        INSERT INTO member ( phone, name, avatar, open_id, gender, create_by, create_time)
        VALUES ( #{phone}, #{name}, #{avatar}, #{openId}, #{gender}, #{createBy}, #{createTime})
    </insert>

    <update id="update" parameterType="com.zzyl.entity.Member">
        UPDATE member SET
                          phone = #{phone},
                          name = #{name},
                          avatar = #{avatar},
                          open_id = #{openId},
                          gender = #{gender},
                          update_by = #{updateBy},
                          update_time = #{updateTime}
        WHERE id = #{id}
    </update>

</mapper>
```

3)业务层

我们从整个流程可以看出来，在后台实现的过程中，我们需要调用两次微信开发者平台的接口来获取数据，一般像这种第三方接口的调用，我们通常都会封装一个单独的业务代码，使其更通用

> 如果当前项目不止一个小程序，就可以复用


我们可以先分析微信开发者平台的接口，接口地址：

- 
获取用户openId

[https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/user-login/code2Session.html](https:_developers.weixin.qq.com_miniprogram_dev_openapidoc_user-login_code2session)

- 
获取手机号

   - 获取token:[https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/mp-access-token/getAccessToken.html](https:_developers.weixin.qq.com_miniprogram_dev_openapidoc_mp-access-token_getaccesstoken)
   - [https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/user-info/phone-number/getPhoneNumber.html](https:_developers.weixin.qq.com_miniprogram_dev_openapidoc_user-info_phone-number_getphonenumber)

微信调用代码封装

WechatService

```java
package com.zzyl.service;

import cn.hutool.json.JSONObject;

import java.io.IOException;

/**
 * @author sjqn
 * @date 2023/10/27
 */
public interface WechatService {

    /**
     * 获取openid
     * @param code  登录凭证
     * @return
     * @throws IOException
     */
    public String getOpenid(String code) throws IOException;

    /**
     * 获取手机号
     * @param code  手机号凭证
     * @return
     * @throws IOException
     */
    public String getPhone(String code) throws IOException;

}
```

WechatService实现类

```java
package com.zzyl.service.impl;

import cn.hutool.http.HttpUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.zzyl.exception.BaseException;
import com.zzyl.service.WechatService;
import com.zzyl.utils.ObjectUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * @author sjqn
 * @date 2023/10/27
 */
@Service
public class WechatServiceImpl implements WechatService {


    // 登录
    private static final String REQUEST_URL = "https://api.weixin.qq.com/sns/jscode2session?grant_type=authorization_code";

    // 获取token
    private static final String TOKEN_URL = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential";

    // 获取手机号
    private static final String PHONE_REQUEST_URL = "https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=";

    @Value("${zzyl.wechat.appId}")
    private String appId;

    @Value("${zzyl.wechat.appSecret}")
    private String secret;


    /**
     * 获取openid
     *
     * @param code 登录凭证
     * @return
     * @throws IOException
     */
    @Override
    public String getOpenid(String code) throws IOException {

        //封装参数
        Map<String,Object> requestUrlParam = getAppConfig();
        requestUrlParam.put("js_code",code);

        String result = HttpUtil.get(REQUEST_URL, requestUrlParam);

        JSONObject jsonObject = JSONUtil.parseObj(result);
        // 若code不正确，则获取不到openid，响应失败
        if (ObjectUtil.isNotEmpty(jsonObject.getInt("errcode"))) {
            throw new BaseException(jsonObject.getStr("errmsg"));
        }

        return jsonObject.getStr("openid");
    }

    /**
     * 封装公共参数
     * @return
     */
    private Map<String, Object> getAppConfig() {

        Map<String, Object> requestUrlParam = new HashMap<>();
        requestUrlParam.put("appid",appId);
        requestUrlParam.put("secret",secret);
        return requestUrlParam;
    }

    /**
     * 获取手机号
     *
     * @param code 手机号凭证
     * @return
     * @throws IOException
     */
    @Override
    public String getPhone(String code) throws IOException {

        //获取access_token
        String token = getToken();
        //拼接请求路径
        String url = PHONE_REQUEST_URL + token;

        Map<String,Object> param = new HashMap<>();
        param.put("code",code);

        String result = HttpUtil.post(url, JSONUtil.toJsonStr(param));
        JSONObject jsonObject = JSONUtil.parseObj(result);
        if (jsonObject.getInt("errcode") != 0) {
            //若code不正确，则获取不到phone，响应失败
            throw new BaseException(jsonObject.getStr("errmsg"));

        }
        return jsonObject.getJSONObject("phone_info").getStr("purePhoneNumber");

    }

    public String getToken(){
        Map<String, Object> requestUrlParam = getAppConfig();

        String result = HttpUtil.get(TOKEN_URL, requestUrlParam);
        //解析
        JSONObject jsonObject = JSONUtil.parseObj(result);
        //如果code不正确，则失败
        if(ObjectUtil.isNotEmpty(jsonObject.getInt("errcode"))){
            throw new BaseException(jsonObject.getStr("errmsg"));
        }
        return jsonObject.getStr("access_token");

    }
}
```

由于上述代码需要读取配置来获取微信小程序的appid和appSecret  ，所以需要在application.yml添加对应配置，这里大家注意，这个要跟微信开发者平台设置的相同，就是我们刚才自己申请的测试小程序的appid和appSecret

![](./assets/image-20240407192427894-149.png)

> 大家注意格式：zzyl.wechat.appid


业务层代码

定义：MemberService

```java
package com.zzyl.service;

import com.zzyl.dto.UserLoginRequestDto;
import com.zzyl.vo.LoginVo;

import java.io.IOException;

/**
 * @author sjqn
 * @date 2023/10/27
 */
public interface MemberService {


    /**
     * 小程序端登录
     * @param userLoginRequestDto
     * @return
     */
    LoginVo login(UserLoginRequestDto userLoginRequestDto) throws IOException;
}
```

定义：MemberService实现类MemberServiceImpl

```java
package com.zzyl.service.impl;

import cn.hutool.json.JSONObject;
import com.google.common.collect.Lists;
import com.zzyl.constant.Constants;
import com.zzyl.dto.UserLoginRequestDto;
import com.zzyl.entity.Member;
import com.zzyl.exception.BaseException;
import com.zzyl.mapper.MemberMapper;
import com.zzyl.properties.JwtTokenManagerProperties;
import com.zzyl.service.MemberService;
import com.zzyl.service.WechatService;
import com.zzyl.utils.JwtUtil;
import com.zzyl.utils.ObjectUtil;
import com.zzyl.utils.StringUtils;
import com.zzyl.vo.LoginVo;
import org.aspectj.weaver.ast.Var;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

/**
 * @author sjqn
 * @date 2023/10/27
 */
@Service
public class MemberServiceImpl implements MemberService {

    @Autowired
    private WechatService wechatService;

    @Autowired
    private MemberMapper memberMapper;

    @Autowired
    private JwtTokenManagerProperties jwtTokenManagerProperties;


    static ArrayList DEFAULT_NICKNAME_PREFIX = Lists.newArrayList(
            "生活更美好",
            "大桔大利",
            "日富一日",
            "好柿开花",
            "柿柿如意",
            "一椰暴富",
            "大柚所为",
            "杨梅吐气",
            "天生荔枝"
    );

    /**
     * 小程序端登录
     *
     * @param userLoginRequestDto
     * @return
     */
    @Override
    public LoginVo login(UserLoginRequestDto userLoginRequestDto) throws IOException {

        //1.调用微信api,根据code获取openId
        String openId = wechatService.getOpenid(userLoginRequestDto.getCode());

        //2.根据openId查询用户
        Member member = memberMapper.getByOpenId(openId);

        //3.如果用户为空，则新增
        if (ObjectUtil.isEmpty(member)) {
            member = Member.builder().openId(openId).build();
        }

        //4.调用微信api获取用户绑定的手机号
        String phone = wechatService.getPhone(userLoginRequestDto.getPhoneCode());

        //5.保存或修改用户
        saveOrUpdate(member, phone);

        //6.将用户id存入token,返回
        Map<String, Object> claims = new HashMap<>();
        claims.put(Constants.JWT_USERID, member.getId());
        claims.put(Constants.JWT_USERNAME, member.getName());

        String token = JwtUtil.createJWT(jwtTokenManagerProperties.getBase64EncodedSecretKey(), jwtTokenManagerProperties.getTtl(), claims);

        LoginVo loginVo = new LoginVo();
        loginVo.setToken(token);
        loginVo.setNickName(member.getName());
        return loginVo;

    }

    /**
     * 保存或修改客户
     *
     * @param member
     * @param phone
     */
    private void saveOrUpdate(Member member, String phone) {

        //1.判断取到的手机号与数据库中保存的手机号不一样
        if(ObjectUtil.notEqual(phone, member.getPhone())){
            //设置手机号
            member.setPhone(phone);
        }
        //2.判断id存在
        if (ObjectUtil.isNotEmpty(member.getId())) {
            memberMapper.update(member);
            return;
        }
        //3.保存新的用户
        //随机组装昵称，词组+手机号后四位
        String nickName = DEFAULT_NICKNAME_PREFIX.get((int) (Math.random() * DEFAULT_NICKNAME_PREFIX.size()))
                + StringUtils.substring(member.getPhone(), 7);

        member.setName(nickName);
        memberMapper.save(member);
    }

}
```

控制层与业务层整合

```java
/**
 * <p>
 * 用户管理
 */
@Slf4j
@Api(tags = "客户管理")
@RestController
@RequestMapping("/customer/user")
public class CustomerUserController {

    @Autowired
    private MemberService memberService;

    /**
     * C端用户登录--微信登录
     * @param userLoginRequestDto 用户登录信息
     * @return 登录结果
     */
    @PostMapping("/login")
    @ApiOperation("小程序端登录")
    public ResponseResult<LoginVo> login(@RequestBody UserLoginRequestDto userLoginRequestDto) throws IOException {
        LoginVo loginVo = memberService.login(userLoginRequestDto);
        return ResponseResult.success(loginVo);
    }

}
```


#### 2.4.3 前后端联调测试

打开微信开发者工具，使用注册小程序测试的微信扫码登录

![](./assets/image-20240407192427894-150.png)

然后在点击中州养老的登录，如果能登录成功，则表示前后端调试成功。

如果登录不成功，可以从两个层面来查看错误消息，如下图

![](./assets/image-20240407192427894-151.png)

第一：可以从console中查看错误信息

第二：可以从Network中查看接口请求响应的情况，然后结合后台idea中的控制台来查看错误


### 2.5 拦截器校验token

通过我们刚才的流程，我们知道，用户登录成功以后，会返回前端一个token，这个token就是来验证用户信息的，当用户点击了小程序中的其他操作（需要登录），则会把token携带到请求头（header）中，方便后台去验证并获取用户信息，简易流程如下：

![](./assets/image-20240407192427894-152.png)

如果想要验证用户的token，我们可以使用自定义的拦截器实现，整体的流程如下：

![](./assets/image-20240407192427894-153.png)

ThreadLocal存储取出流程

![](./assets/image-20240407192427894-154.png)

在zzyl-framework模块中定义拦截器，代码如下：

```java
package com.zzyl.intercept;

import cn.hutool.core.map.MapUtil;
import cn.hutool.core.util.ObjectUtil;
import com.zzyl.constant.Constants;
import com.zzyl.exception.BaseException;
import com.zzyl.properties.JwtTokenManagerProperties;
import com.zzyl.utils.JwtUtil;
import com.zzyl.utils.UserThreadLocal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;

/**
 * 小程序端token校验
 * 统一对请求的合法性进行校验，需要进行2个方面的校验，
 * 一、请求头中是否携带了authorization
 * 二、请求头中是否存在userId，如果不存在则说明是非法请求，响应401状态码
 * 如果是合法请求，将userId存储到ThreadLocal中
 */
@Slf4j
@Component
public class UserInterceptor implements HandlerInterceptor {

    @Autowired
    private JwtTokenManagerProperties jwtTokenManagerProperties;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        //如果不是映射到方法就放行，比如跨域验证请求、静态资源等不需要身份校验的请求
        if (!(handler instanceof HandlerMethod)) {
            return true;
        }

        //获取header的参数
        String token = request.getHeader(SecurityConstant.USER_TOKEN);

        log.info("开始解析 customer user token {}", token);
        if (ObjectUtil.isEmpty(token)) {
            //token失效
            throw new BaseException("小程序登录","401",null,"没有权限,请登录");
        }
        Map<String, Object> claims = JwtUtil.parseJWT(jwtTokenManagerProperties.getBase64EncodedSecretKey(), token);
        if (ObjectUtil.isEmpty(claims)) {
            //token失效
            throw new BaseException("小程序登录","401",null,"没有权限,请登录");
        }

        Long userId = MapUtil.get(claims, Constants.JWT_USERID, Long.class);
        if (ObjectUtil.isEmpty(userId)) {
            throw new BaseException("小程序登录","401",null,"没有权限,请登录");
        }

        UserThreadLocal.set(userId);

        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        UserThreadLocal.remove();
    }
}
```

使拦截器生效

```java
package com.zzyl.config;

/**
 * @ClassName WebMvcConfig.java
 * @Description webMvc高级配置
 */
@Configuration
@ComponentScan("springfox.documentation.swagger.web")
public class WebMvcConfig implements WebMvcConfigurer {

    @Autowired
   UserInterceptor userInterceptor;

    //拦截的时候过滤掉swagger相关路径和登录相关接口
    private static final String[] EXCLUDE_PATH_PATTERNS = new String[]{"/swagger-ui.html",
            "/webjars/**",
            "/swagger-resources",
            "/v2/api-docs",
            // 登录接口
            "/customer/user/login"};

    /**
     * @Description 拦截器
     */
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // 小程序端接口鉴权拦截器
        registry.addInterceptor(userInterceptor)
            .excludePathPatterns(EXCLUDE_PATH_PATTERNS)
            .addPathPatterns("/customer/**");
    }

   
}
```

想要测试当前拦截器是否生效，可以随便定义一个控制层代码（需符合拦截要求的），测试代码如下：

```java
package com.zzyl.controller.customer;

import com.zzyl.base.ResponseResult;
import com.zzyl.controller.BaseController;
import com.zzyl.utils.UserThreadLocal;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/customer/reservation")
@Api(tags = "客户预约管理")
public class CustomerReservationController extends BaseController {


    @GetMapping("/cancelled-count")
    @ApiOperation("查询取消预约数量")
    public ResponseResult<Integer> getCancelledReservationCount() {
        Long userId = UserThreadLocal.getUserId();
        System.out.println(userId+"---------------------");
        return success(1);
    }
}
```

以上代码是我们马上要开发的预约管理中的一个需求，这个请求路径是符合拦截需求的，大家可以使用在线接口文档测试或者是直接在小程序中使用，在登录成功以后，可以点击”参观预约”按钮测试，然后查看idea控制台，是否输出了用户的id，如果可以成功输出，则表示成功

![](./assets/image-20240407192427895-155.png)


## 3 预约管理

刚才我们已经完成了小程序的登录，并且使用拦截器在后台获取了用户的信息，我们接下来要开发的预约管理就会使用用户信息。我们先来介绍下什么是预约

老人及家属可通过小程序或电话预约参观养老院，了解养老院的环境、设施及服务情况，预约成功后，系统将安排养老顾问进行对接，做好到院接待的工作


### 3.1 需求分析

预约分为了两种，分别是探访预约和参观预约

- 探访预约是指家里有老人已经入住了养老院，家人可以点击探访预约，看望绑定的老人
- 参观预约是指想要参观一下养老院，了解养老院的环境、设施及服务情况

由于我们现在还没做老人的入住功能，现在能做的就是参观预约

我们来看原型和需求说明，打开原型图

**首页**

![](./assets/image-20240407192427895-156.png)

**预约设置页**

![](./assets/image-20240407192427895-157.png)

当用户新增了预约之后，可以在我的预约中进行操作，原型如下：

![](./assets/image-20240407192427895-158.png)


### 3.2 表结构设计

通过需求分析，我们可以确定的字段有：

> 预约人姓名、手机号、家人姓名、预约时间


根据我们的经验来看，一个表中必要的字段有6个，所以现在的字段有

> 主键、 预约人姓名、手机号、家人姓名、预约时间、创建时间、修改时间、创建人、修改人、备注


由于当前预约表是可以表示**探访预约**和**参观预约**的，我们可以再加一个字段`type`来区分

预约也有状态，会根据预约探访的情况设置状态，具体如下：

- 待报道   预约之后，到院之前
- 已完成  按时到院
- 取消   在小程序端取消预约
- 过期   过期未到

所以，预约表中最终的表字段为：

> 主键、 预约人姓名、手机号、家人姓名、类型、状态、预约时间、创建时间、修改时间、创建人、修改人、备注


由于一个手机号在同一个时间段内只能预约一次，我们也可以在表结构中设置唯一约束（**手机号**+**时间**）

建表语句：

```sql
CREATE TABLE `reservation` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '预约人姓名',
  `mobile` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '预约人手机号',
  `time` datetime NOT NULL COMMENT '预约时间',
  `visitor` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '探访人',
  `type` int NOT NULL COMMENT '预约类型，0：参观预约，1：探访预约',
  `status` int NOT NULL COMMENT '预约状态，0：待报道，1：已完成，2：取消，3：过期',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `create_by` bigint DEFAULT NULL COMMENT '创建人id',
  `update_by` bigint DEFAULT NULL COMMENT '更新人id',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `name_mobile_time_visitor` (`mobile`,`time`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=93 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='预约信息表';
```

> 注意：其中的手机号和手机号做了唯一约束，代表一个手机号同一个时间段端只能预约一次


对应的实体类：

```java
package com.zzyl.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.zzyl.base.BaseEntity;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@ApiModel(description = "预约信息")
public class Reservation extends BaseEntity {

    /**
     * 预约人
     */
    @ApiModelProperty("预约人")
    private String name;

    /**
     * 预约人手机号
     */
    @ApiModelProperty("预约人手机号")
    private String mobile;

    /**
     * 时间
     */
    @ApiModelProperty("时间")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime time;

    /**
     * 探访人
     */
    @ApiModelProperty("探访人")
    private String visitor;

    /**
     * 预约类型，0：参观预约，1：探访预约
     */
    @ApiModelProperty("预约类型，0：参观预约，1：探访预约")
    private Integer type;

    /**
     * 预约状态，0：待报道，1：已完成，2：取消，3：过期
     */
    @ApiModelProperty("预约状态，0：待报道，1：已完成，2：取消，3：过期")
    private Integer status;
}
```


### 3.3 接口设计

我们现在已经分析完了需求，并且设计了表结构，下面，我们来设计一下接口。我们现在可以基于刚才的需求来分析一下这里面都包含了哪些接口。


#### 3.3.1 查询取消预约数量

用户登录成功以后，点击了**首页**的”参观预约”按钮，我们需要查询用户**当天**的**取消预约**的数量，如果大于3，当天则不能再预约

我们需要根据当前用户去查询当天的取消次数，我们还是依据接口的四要素来描述接口，如下：

- 
接口地址:`/customer/reservation/cancelled-count`

- 
请求方式:`GET`

- 
请求参数:

无，我们需要获取线程中的用户即可，在后端获取，不需要前端传任何参数

- 
响应示例
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": 1,  //取消预约次数
  "operationTime": null
}
```




#### 3.3.2 查询每个时间段剩余预约次数

当用户进入了预约的表单页面之后，会触发这个接口，会查询当前所有能选择的时间段的剩余预约次数一次性返回，如果用户了换了日期之后，会再次触发这个接口

- 
接口地址:`/customer/reservation/countByTime`

- 
请求方式:`GET`

- 
请求参数:
| 参数名称 | 参数说明 | 数据类型 |
| --- | --- | --- |
| time | 时间 | long(时间戳) |



- 
返回示例：
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": [
    {
      "time": "2023-08-21 09:30:00",
      "count": 5
    },
    {
      "time": "2023-08-21 10:00:00",
      "count": 5
    }
  ],
  "operationTime": null
}
```




#### 3.3.3 新增预约

根据上述需求分析，新增预约就是保存用户输入的信息

- 
接口地址:`/customer/reservation/`

- 
请求方式:`POST`

- 
请求参数:
```json
{
  "mobile": "",  //手机号
  "name": "",    //预约人
  "time": "",    //时间
  "type":0,      //预约类型  0为参观预约
  "visitor": ""  //家人
}
```


- 
响应示例：
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": null,
  "operationTime": null
}
```




#### 3.3.4 分页查询预约

进入到我的预约，就需要查询预约的列表，滚动分页查询，并且包含了两种类型（探访和参观）

- 
接口地址:`/customer/reservation/page`

- 
请求方式:`GET`

- 
请求参数:

| 参数名称 | 参数说明 | 数据类型 |
| --- | --- | --- |
| pageNum | 页码 | int |
| pageSize | 每页数量 | int |
| status | 状态 | int |


- 
响应示例：
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "total": "5",
    "pageSize": 10,
    "pages": "1",
    "page": 1,
    "records": [
      {
        "id": "94",
        "createTime": "2023-08-20 10:52:06",
        "createBy": "3",
        "creator": "日富一日8915",
        "name": "李晓天",
        "mobile": "13678903456",
        "time": "2023-08-20 17:30:00",
        "visitor": "李天增",
        "type": 0,
        "status": 0
      }
    ]
  },
  "operationTime": null
}
```




#### 3.3.5 取消预约

- 
接口地址:`/customer/reservation/{id}/cancel`

- 
请求方式:`PUT`

- 
请求参数:

| 参数名称 | 参数说明 | 数据类型 |
| --- | --- | --- |
| id | 主键 | long |


- 
响应示例：
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": null,
  "operationTime": null
}
```




### 3.4 功能开发

刚才我们分析了5个接口，我们在课堂上实现两个，剩下的留给大家来完成，课程上完成的有：

- 新增预约
- 分页查询预约

练习的接口：

- 查询取消预约数量
- 查询每个时间段剩余预约次数
- 取消预约


#### 3.4.1 查询取消预约数量

当登录后的用户在首页点击了”参观预约”的按钮就会触发这个接口的调用，这个接口我们可以先写一个简单的demo，主要作用是让流程先走下去，后面开发完了取消预约之后，需要与这个接口进行联动才行

我们新建一个CustomerReservationController，里面有一个方法，如下：

```java
package com.zzyl.controller;

@RestController
@RequestMapping("/customer/reservation")
@Api(tags = "客户预约管理")
public class CustomerReservationController extends BaseController {


    @GetMapping("/cancelled-count")
    @ApiOperation("查询取消预约数量")
    public ResponseResult<Integer> getCancelledReservationCount() {
        Long userId = UserThreadLocal.getUserId();
        return success(0);//后面开发了取消预约后，需要到数据库中去统计取消次数
    }

}
```


#### 3.4.2 查询每个时间段剩余预约次数

自己实现


#### 3.4.3 新增预约

1)定义接口

依据接口文档，我们在CustomerReservationController中新增接口，代码如下：

```java
@PostMapping
@ApiOperation("新增预约")
public ResponseResult add(@RequestBody ReservationDto dto) {
    return null;
}
```

ReservationDto   接收前端传递的参数

```java
package com.zzyl.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.zzyl.base.BaseDto;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReservationDto extends BaseDto {

    /**
     * 预约人
     */
    @ApiModelProperty("预约人")
    private String name;

    /**
     * 预约人手机号
     */
    @ApiModelProperty("预约人手机号")
    private String mobile;

    /**
     * 时间
     */
    @ApiModelProperty("时间")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime time;

    /**
     * 探访人
     */
    @ApiModelProperty("探访人")
    private String visitor;

    /**
     * 预约类型，0：参观预约，1：探访预约
     */
    @ApiModelProperty("预约类型，0：参观预约，1：探访预约")
    private Integer type;

    /**
     * 预约状态，0：待报道，1：已完成，2：取消，3：过期
     */
    @ApiModelProperty("预约状态，0：待报道，1：已完成，2：取消，3：过期")
    private Integer status;
}
```

2)mapper编写

新增一个ReservationMapper

```java
@Mapper
public interface ReservationMapper {
    // 插入预约信息
    int insert(Reservation reservation);
}
```

对应的xml映射文件

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd" >
<mapper namespace="com.zzyl.mapper.ReservationMapper">
    <resultMap id="reservationMap" type="com.zzyl.entity.Reservation">
        <id column="id" property="id"/>
        <result column="name" property="name"/>
        <result column="mobile" property="mobile"/>
        <result column="time" property="time"/>
        <result column="visitor" property="visitor"/>
        <result column="type" property="type"/>
        <result column="status" property="status"/>
        <result column="create_by" property="createBy"/>
        <result column="update_by" property="updateBy"/>
        <result column="remark" property="remark"/>
        <result column="create_time" property="createTime"/>
        <result column="update_time" property="updateTime"/>
        <result column="creator" property="creator"/>
    </resultMap>

    <insert id="insert" parameterType="com.zzyl.entity.Reservation" useGeneratedKeys="true" keyProperty="id">
        insert into reservation(name, mobile, time, visitor, type, status, create_by, remark, create_time)
        values (#{name}, #{mobile}, #{time}, #{visitor}, #{type}, #{status}, #{createBy}, #{remark}, #{createTime})
    </insert>

</mapper>
```

3)业务层代码

新增ReservationService

```java
public interface ReservationService {
    /**
     * 添加预约信息
     * @param dto 预约信息
     */
    void add(ReservationDto dto);

}
```

实现类

```java
package com.zzyl.service.impl;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.collection.CollUtil;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.zzyl.base.PageResponse;
import com.zzyl.dto.ReservationDto;
import com.zzyl.entity.Reservation;
import com.zzyl.enums.ReservationStatus;
import com.zzyl.exception.BaseException;
import com.zzyl.mapper.ReservationMapper;
import com.zzyl.service.ReservationService;
import com.zzyl.utils.UserThreadLocal;
import com.zzyl.vo.ReservationVo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class ReservationServiceImpl implements ReservationService {

    @Autowired
    private ReservationMapper reservationMapper;

    /**
     * 添加预约
     */
    @Override
    public void add(ReservationDto dto) {

        // TODO 如果已经预约的次数超过3次，则不需要再进行预约

        // 否则，允许添加预约
        Reservation reservation = new Reservation();
        BeanUtils.copyProperties(dto, reservation);
        reservation.setStatus(ReservationStatus.PENDING.getOrdinal());
        
        try {
            reservationMapper.insert(reservation);
        } catch (Exception e) {
            log.info(e + "");
            throw new BaseException("此手机号已预约该时间");
        }
    }
    
}
```

4)控制层代码

```java
@RestController
@RequestMapping("/customer/reservation")
@Api(tags = "客户预约管理")
public class CustomerReservationController extends BaseController {

    @Autowired
    private ReservationService reservationService;

    @PostMapping
    @ApiOperation("新增预约")
    public ResponseResult add(@RequestBody ReservationDto dto) {
        reservationService.add(dto);
        return success();
    }

}
```

5)集成小程序测试

![](./assets/image-20240407192427895-159.png)

新增之后，在数据库查询，保存成功即可


#### 3.4.4 分页查询预约

依据我们刚才分析的接口，我们还是先定义接口

1)定义接口

在CustomerReservationController新增方法如下

```java
@GetMapping("/page")
@ApiOperation("分页查询预约")
public ResponseResult<PageResponse<ReservationVo>> findByPage(@RequestParam(defaultValue = "1") int pageNum,
                                                              @RequestParam(defaultValue = "10") int pageSize,
                                                              Integer status) {
    PageResponse<ReservationVo> byPage = reservationService.findByPage(pageNum, pageSize, status);
    return null;
}
```

2)mapper编写

在ReservationMapper新增方法

```java
Page<Reservation> findByPage(int pageNum, int pageSize, Integer status, Long createBy);
```

对应的xml映射文件

```xml
<select id="findByPage" resultMap="reservationMap">
    select r.id, r.name, r.mobile, r.time, r.visitor, r.type, r.status, r.create_by, r.remark, r.create_time
    from reservation r
    <where>
        <if test="status != null">
            and r.status = #{status, jdbcType=INTEGER}
        </if>
        <if test="createBy != null">
            AND r.create_by = #{createBy}
        </if>
    </where>
    order by r.create_time desc
</select>
```

3)业务层代码编写

在ReservationService新增方法

```java
 /**
     *  分页查找预约信息
     * @param pageNum   页码
     * @param pageSize  每页大小
     * @param status  预约状态
     * @return
     */
PageResponse<ReservationVo> findByPage(int pageNum, int pageSize, Integer status);pe);
```

实现类：

```java
 /**
     * 分页查找预约信息
     * @param pageNum  页码
     * @param pageSize 每页大小
     * @param status   预约状态
     * @return
     */
@Override
public PageResponse<ReservationVo> findByPage(int pageNum, int pageSize, Integer status) {
    PageHelper.startPage(pageNum, pageSize);
    Long userId = UserThreadLocal.getUserId();
    Page<Reservation> byPage = reservationMapper.findByPage(pageNum, pageSize, status,userId);
    return PageResponse.of(byPage, ReservationVo.class);
}
```

4)控制层

```java
@GetMapping("/page")
@ApiOperation("分页查询预约")
public ResponseResult<PageResponse<ReservationVo>> findByPage(@RequestParam(defaultValue = "1") int pageNum,
                                                              @RequestParam(defaultValue = "10") int pageSize,
                                                              Integer status) {
    PageResponse<ReservationVo> byPage = reservationService.findByPage(pageNum, pageSize, status);
    return success(byPage);
}
```

5)集成小程序测试

![](./assets/image-20240407192427895-160.png)


#### 3.4.5 取消预约

自己实现


## 4 定时任务框架xxl-job


### 4.1 需求说明

当用户预约之后，假如没有在预约的时间来访，那这次预约就会失效。那我们如何设置失效的状态呢？

肯定不能人工操作，更加简便的方式就是自动完成。那如何自动完成，就是我们要学习的任务调度

![](./assets/image-20240407192427895-161.png)


### 4.2 定时任务概述

**任务调度**是指系统为了自动完成特定任务，在约定的特定时刻去执行任务的过程。有了任务调度即可解放更多的人力，而是由系统自动去执行任务。

常用业务场景案例：

- 某电商系统需要在每天上午10点，下午3点，晚上8点发放一批优惠券。
- 某银行系统需要在信用卡到期还款日的前三天进行短信提醒。
- 某财务系统需要在每天凌晨0:10结算前一天的财务数据，统计汇总。
- 12306会根据车次的不同，设置某几个时间点进行分批放票。

如何实现任务调度？

- 多线程方式，结合sleep
- JDK提供的API，例如：Timer、ScheduledExecutor
- 框架，例如Quartz ，它是一个功能强大的任务调度框架，可以满足更多更复杂的调度需求
- spring task
- 分布式任务调度框架（例如：xxl-job）


### 4.3 cron表达式

在我们使用调度任务技术的时候，特别是调度框架，里面都支持使用日历的方式来设置任务制定的时间、频率等，通常情况下都会使用cron表达式来表达

cron表达式是一个字符串, 用来设置定时规则, 由七部分组成, 每部分中间用空格隔开, 每部分的含义如下表所示:

cron表达式是一个字符串, 用来设置定时规则, 由七部分组成, 每部分中间用空格隔开, 每部分的含义如下表所示:

| **组成部分** | **含义** | **取值范围** |
| :---: | :---: | :---: |
| 第一部分 | Seconds (秒) | 0－59 |
| 第二部分 | Minutes(分) | 0－59 |
| 第三部分 | Hours(时) | 0-23 |
| 第四部分 | Day-of-Month(天) | 1-31 |
| 第五部分 | Month(月) | 0-11或JAN-DEC |
| 第六部分 | Day-of-Week(星期) | 1-7(1表示星期日)或SUN-SAT |
| 第七部分 | Year(年) 可选 | 1970-2099 |


另外, cron表达式还可以包含一些特殊符号来设置更加灵活的定时规则, 如下表所示:

| **符号** | **含义** |
| :---: | :--- |
| ? | 表示不确定的值。当两个子表达式其中一个被指定了值以后，为了避免冲突，需要将另外一个的值设为“?”。例如：想在每月20日触发调度，不管20号是星期几，只能用如下写法：0 0 0 20 * ?，其中最后以为只能用“?” |
| * | 代表所有可能的值 |
| , | 设置多个值,例如”26,29,33”表示在26分,29分和33分各自运行一次任务 |
| - | 设置取值范围,例如”5-20”，表示从5分到20分钟每分钟运行一次任务 |
| / | 设置频率或间隔,如"1/15"表示从1分开始,每隔15分钟运行一次任务 |
| L | 用于每月，或每周，表示每月的最后一天，或每个月的最后星期几,例如"6L"表示"每月的最后一个星期五" |
| W | 表示离给定日期最近的工作日,例如"15W"放在每月（day-of-month）上表示"离本月15日最近的工作日" |
| # | 表示该月第几个周X。例如”6#3”表示该月第3个周五 |


为了让大家更熟悉cron表达式的用法, 接下来我们给大家列举了一些例子, 如下表所示:

| **cron表达式** | **含义** |
| --- | --- |
| _/5 _ _ _ * ? | 每隔5秒运行一次任务 |
| 0 0 23 _ _ ? | 每天23点运行一次任务 |
| 0 0 1 1 * ? | 每月1号凌晨1点运行一次任务 |
| 0 0 23 L * ? | 每月最后一天23点运行一次任务 |
| 0 26,29,33 _ _ * ? | 在26分、29分、33分运行一次任务 |
| 0 0/30 9-17 _ _ ? | 朝九晚五工作时间内每半小时运行一次任务 |
| 0 15 10 ? * 6#3 | 每月的第三个星期五上午10:15运行一次任务 |



### 4.4 xxl-job概述

在我们的项目中，使用的就是xxl-job调度框架来完成任务的自动执行。它是一个分布式的任务调度框架，我们后期要学习到的微服务课程、项目等也都会采用这个调度框架。

那我们为什么现在就会使用**分布式**的调度框架呢？

大家来看下面这个图：

![](./assets/image-20240407192427895-162.png)

上面是一个发送优惠券的定时任务

- 如果只是单体项目的话，定时任务执行是不会有任何问题的
- 如果后期业务量较大，**单体项目**做了**集群部署**，那集群中每一台服务的代码都是一样的，都会按照规定的时间来执行任务，这样就会造成优惠券重复发放。

所以，由此以上分析，我们要解决就是，即使是单体项目，如果做集群，同样要考虑任务重复执行的问题，那xxl-job就可以解决这些问题，当然不仅仅如此

官网地址：[https://www.xuxueli.com/xxl-job/](https://www.xuxueli.com/xxl-job/)

XXL-JOB是一个分布式任务调度平台，其核心设计目标是开发迅速、学习简单、轻量级、易扩展。现已开放源代码并接入多家公司线上产品线，开箱即用。


### 4.5 xxl-job入门


#### 4.5.1 环境搭建

1)源码下载

想要快速使用xxl-job，我们可以首先到gitee或者是github上拉取它的开源代码

| 源码仓库地址 | Release Download |
| :--- | :--- |
| [https://github.com/xuxueli/xxl-job](https://github.com/xuxueli/xxl-job) | [Download](https://github.com/xuxueli/xxl-job/releases) |
| [http://gitee.com/xuxueli0323/xxl-job](http://gitee.com/xuxueli0323/xxl-job) | [Download](http://gitee.com/xuxueli0323/xxl-job/releases) |


也可以使用资料文件夹中的源码

2)初始化“调度数据库”

请下载项目源码并解压，获取 “调度数据库初始化SQL脚本” 并执行即可。

位置：`/xxl-job/doc/db/tables_xxl_job.sql`  共8张表

![](./assets/image-20240407192427895-163.png)

```java
- xxl_job_lock：任务调度锁表；
- xxl_job_group：执行器信息表，维护任务执行器信息；
- xxl_job_info：调度扩展信息表： 用于保存XXL-JOB调度任务的扩展信息，如任务分组、任务名、机器地址、执行器、执行入参和报警邮件等等；
- xxl_job_log：调度日志表： 用于保存XXL-JOB任务调度的历史信息，如调度结果、执行结果、调度入参、调度机器和执行器等等；
- xxl_job_logglue：任务GLUE日志：用于保存GLUE更新历史，用于支持GLUE的版本回溯功能；
- xxl_job_registry：执行器注册表，维护在线的执行器和调度中心机器地址信息；
- xxl_job_user：系统用户表；
```

调度中心支持集群部署，集群情况下各节点务必连接同一个mysql实例;

如果mysql做主从,调度中心集群节点务必强制走主库;

3. 编译源码

解压源码,按照maven格式将源码导入IDE, 使用maven进行编译即可，源码结构如下：

![](./assets/image-20240407192427895-164.png)

4. 配置部署“调度中心”

调度中心项目：xxl-job-admin

作用：统一管理任务调度平台上调度任务，负责触发调度执行，并且提供任务管理平台。

步骤一：调度中心配置

调度中心配置文件地址：`/xxl-job/xxl-job-admin/src/main/resources/application.properties`

数据库的连接信息修改为自己的数据库

```properties
### web
server.port=8888
server.servlet.context-path=/xxl-job-admin

### actuator
management.server.servlet.context-path=/actuator
management.health.mail.enabled=false

### resources
spring.mvc.servlet.load-on-startup=0
spring.mvc.static-path-pattern=/static/**
spring.resources.static-locations=classpath:/static/

### freemarker
spring.freemarker.templateLoaderPath=classpath:/templates/
spring.freemarker.suffix=.ftl
spring.freemarker.charset=UTF-8
spring.freemarker.request-context-attribute=request
spring.freemarker.settings.number_format=0.##########

### mybatis
mybatis.mapper-locations=classpath:/mybatis-mapper/*Mapper.xml
#mybatis.type-aliases-package=com.xxl.job.admin.core.model

### xxl-job, datasource
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/xxl_job?Unicode=true&serverTimezone=Asia/Shanghai&characterEncoding=UTF-8
spring.datasource.username=root
spring.datasource.password=root
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

### datasource-pool
spring.datasource.type=com.zaxxer.hikari.HikariDataSource
spring.datasource.hikari.minimum-idle=10
spring.datasource.hikari.maximum-pool-size=30
spring.datasource.hikari.auto-commit=true
spring.datasource.hikari.idle-timeout=30000
spring.datasource.hikari.pool-name=HikariCP
spring.datasource.hikari.max-lifetime=900000
spring.datasource.hikari.connection-timeout=10000
spring.datasource.hikari.connection-test-query=SELECT 1

### xxl-job, email
spring.mail.host=smtp.qq.com
spring.mail.port=25
spring.mail.username=xxx@qq.com
spring.mail.password=xxx
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
spring.mail.properties.mail.smtp.socketFactory.class=javax.net.ssl.SSLSocketFactory

### xxl-job, access token
xxl.job.accessToken=

### xxl-job, i18n (default is zh_CN, and you can choose "zh_CN", "zh_TC" and "en")
xxl.job.i18n=zh_CN

## xxl-job, triggerpool max size
xxl.job.triggerpool.fast.max=200
xxl.job.triggerpool.slow.max=100

### xxl-job, log retention days
xxl.job.logretentiondays=30
```

启动调度中心，默认登录账号 “admin/123456”, 登录后运行界面如下图所示。

![](./assets/image-20240407192427895-165.png)


#### 4.5.2 入门案例编写

1. 登录调度中心，点击下图所示“新建任务”按钮，新建示例任务

![](./assets/image-20240407192427895-166.png)

2. 创建xxljob-demo项目，导入依赖

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!--xxl-job-->
    <dependency>
        <groupId>com.xuxueli</groupId>
        <artifactId>xxl-job-core</artifactId>
        <version>2.3.0</version>
    </dependency>
</dependencies>
```

3. application.yml配置

```yaml
server:
  port: 8881


xxl:
  job:
    admin:
      addresses: http://192.168.200.146:8888/xxl-job-admin
    executor:
      appname: xxl-job-executor-sample
      port: 9999
```

4. 新建配置类(参考xxl-job源码-样例)

```java
package com.heima.xxljob.config;

import com.xxl.job.core.executor.impl.XxlJobSpringExecutor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * xxl-job config
 *
 * @author xuxueli 2017-04-28
 */
@Configuration
public class XxlJobConfig {
    private Logger logger = LoggerFactory.getLogger(XxlJobConfig.class);

    @Value("${xxl.job.admin.addresses}")
    private String adminAddresses;

    @Value("${xxl.job.executor.appname}")
    private String appname;

    @Value("${xxl.job.executor.port}")
    private int port;


    @Bean
    public XxlJobSpringExecutor xxlJobExecutor() {
        logger.info(">>>>>>>>>>> xxl-job config init.");
        XxlJobSpringExecutor xxlJobSpringExecutor = new XxlJobSpringExecutor();
        xxlJobSpringExecutor.setAdminAddresses(adminAddresses);
        xxlJobSpringExecutor.setAppname(appname);
        xxlJobSpringExecutor.setPort(port);
        return xxlJobSpringExecutor;
    }


}
```

5. 任务代码，重要注解:@XxlJob(“**JobHandler**”)

```java
package com.heima.xxljob.job;

import com.xxl.job.core.handler.annotation.XxlJob;
import org.springframework.stereotype.Component;

@Component
public class HelloJob {


    @XxlJob("demoJobHandler")
    public void helloJob(){
        System.out.println("简单任务执行了。。。。");

    }
}
```

6. 测试-单节点

- 
启动微服务

- 
在xxl-job的调度中心中启动任务



### 4.6 xxl-job 任务详解


#### 4.6.1 执行器

执行器：任务的绑定的执行器，任务触发调度时将会自动发现注册成功的执行器, 实现任务自动发现功能;

另一方面也可以方便的进行任务分组。每个任务必须绑定一个执行器

![](./assets/image-20240407192427895-167.png)

![](./assets/image-20240407192427895-168.png)

以下是执行器的属性说明：

| 属性名称 | 说明 |
| --- | --- |
| AppName | 是每个执行器集群的唯一标示AppName, 执行器会周期性以AppName为对象进行自动注册。可通过该配置自动发现注册成功的执行器, 供任务调度时使用; |
| 名称 | 执行器的名称, 因为AppName限制字母数字等组成,可读性不强, 名称为了提高执行器的可读性; |
| 排序 | 执行器的排序, 系统中需要执行器的地方,如任务新增, 将会按照该排序读取可用的执行器列表; |
| 注册方式 | 调度中心获取执行器地址的方式； |
| 机器地址 | 注册方式为"手动录入"时有效，支持人工维护执行器的地址信息； |


自动注册和手动注册的区别和配置

![](./assets/image-20240407192427895-169.png)


#### 4.6.2 基础配置

在我们新建任务的时候，里面有很多的配置项，下面我们就来介绍下里面具体的作用

![](./assets/image-20240407192427895-170.png)

**基础配置**

- 
执行器：每个任务必须绑定一个执行器, 方便给任务进行分组

- 
任务描述：任务的描述信息，便于任务管理；

- 
负责人：任务的负责人；

- 
报警邮件：任务调度失败时邮件通知的邮箱地址，支持配置多邮箱地址，配置多个邮箱地址时用逗号分隔


![](./assets/image-20240407192427896-171.png)

**调度配置**

- 调度类型：

   - 无：该类型不会主动触发调度；
   - CRON：该类型将会通过CRON，触发任务调度；
   - 固定速度：该类型将会以固定速度，触发任务调度；按照固定的间隔时间，周期性触发；

![](./assets/image-20240407192427896-172.png)

**任务配置**

- 运行模式：

    BEAN模式：任务以JobHandler方式维护在执行器端；需要结合 "JobHandler" 属性匹配执行器中任务；

- 
JobHandler：运行模式为 "BEAN模式" 时生效，对应执行器中新开发的JobHandler类“@JobHandler”注解自定义的value值；

- 
执行参数：任务执行所需的参数；


![](./assets/image-20240407192427896-173.png)

**阻塞处理策略**

阻塞处理策略：调度过于密集执行器来不及处理时的处理策略；

- 
单机串行（默认）：调度请求进入单机执行器后，调度请求进入FIFO(First Input First Output)队列并以串行方式运行；

- 
丢弃后续调度：调度请求进入单机执行器后，发现执行器存在运行的调度任务，本次请求将会被丢弃并标记为失败；

- 
覆盖之前调度：调度请求进入单机执行器后，发现执行器存在运行的调度任务，将会终止运行中的调度任务并清空队列，然后运行本地调度任务；


![](./assets/image-20240407192427896-174.png)

**路由策略**

当执行器集群部署时，提供丰富的路由策略，包括；

- 
FIRST（第一个）：固定选择第一个机器；

- 
LAST（最后一个）：固定选择最后一个机器；

- 
**ROUND（轮询）**

- 
RANDOM（随机）：随机选择在线的机器；

- 
CONSISTENT_HASH（一致性HASH）：每个任务按照Hash算法固定选择某一台机器，且所有任务均匀散列在不同机器上。

- 
LEAST_FREQUENTLY_USED（最不经常使用）：使用频率最低的机器优先被选举；

- 
LEAST_RECENTLY_USED（最近最久未使用）：最久未使用的机器优先被选举；

- 
FAILOVER（故障转移）：按照顺序依次进行心跳检测，第一个心跳检测成功的机器选定为目标执行器并发起调度；

- 
BUSYOVER（忙碌转移）：按照顺序依次进行空闲检测，第一个空闲检测成功的机器选定为目标执行器并发起调度；

- 
**SHARDING_BROADCAST(分片广播)：广播触发对应集群中所有机器执行一次任务，同时系统自动传递分片参数；可根据分片参数开发分片任务；**


![](./assets/image-20240407192427896-175.png)


### 4.7 xxl-job 案例


#### 4.7.1 轮询

1.修改任务为轮询

![](./assets/image-20240407192427896-176.png)

2.启动多个微服务

![](./assets/image-20240407192427896-177.png)

修改yml配置文件

```yaml
server:
  port: ${port:8881}


xxl:
  job:
    admin:
      addresses: http://192.168.200.146:8888/xxl-job-admin
    executor:
      appname: xxl-job-executor-sample
      port: ${executor.port:9999}
```

3.启动多个微服务

每个微服务轮询的去执行任务


#### 4.7.2 分片广播

执行器集群部署时，任务路由策略选择”分片广播”情况下，一次任务调度将会广播触发对应集群中所有执行器执行一次任务

![](./assets/image-20240407192427896-178.png)

执行器集群部署时，任务路由策略选择”分片广播”情况下，一次任务调度将会广播触发对应集群中所有执行器执行一次任务

![](./assets/image-20240407192427896-179.png)

**具体案例**

需求：让两个节点同时执行10000个任务，每个节点分别执行5000个任务

①：在xxl-job-executor-sample执行器下新创建任务，路由策略为分片广播

![](./assets/image-20240407192427896-180.png)

②：分片广播代码

分片参数

     index：当前分片序号(从0开始)，执行器集群列表中当前执行器的序号；

     total：总分片数，执行器集群的总机器数量；

代码

```java
package com.heima.xxljob.job;

import com.xxl.job.core.context.XxlJobHelper;
import com.xxl.job.core.handler.annotation.XxlJob;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class HelloJob {

    @Value("${server.port}")
    private String port;


    @XxlJob("demoJobHandler")
    public void helloJob(){
        System.out.println("简单任务执行了。。。。"+port);

    }

    @XxlJob("shardingJobHandler")
    public void shardingJobHandler(){
        //分片的参数
        int shardIndex = XxlJobHelper.getShardIndex();
        int shardTotal = XxlJobHelper.getShardTotal();

        //业务逻辑
        List<Integer> list = getList();
        for (Integer integer : list) {
            if(integer % shardTotal == shardIndex){
                System.out.println("当前第"+shardIndex+"分片执行了，任务项为："+integer);
            }
        }
    }

    public List<Integer> getList(){
        List<Integer> list = new ArrayList<>();
        for (int i = 0; i < 10000; i++) {
            list.add(i);
        }
        return list;
    }
}
```

④：测试

启动多个微服务测试，一次执行可以执行多个任务


### 4.8 预约管理定时修改状态

依据我们之前分析的需求，当用户没有按时来访之后，会把预约的状态修改为**已过期**

我们可以每隔半个小时查询一次数据，如果状态是未到访并且已经过了预约时间，则设置为已过期


#### 4.8.1 项目中集成xxl-job

1)调度中心搭建

关于调度中心的环境，在提供的虚拟机中已安装了该服务，大家可以直接使用。

地址：[http://192.168.200.146:8888/xxl-job-admin](http://192.168.200.146:8888/xxl-job-admin)

用户名密码：admin/123456

2)创建执行器和任务

登录调度中心后，手动创建执行器和任务

执行器，一般一个项目只需要创建一个执行器即可，在执行器下可以创建多个任务

![](./assets/image-20240407192427896-181.png)

创建任务

![](./assets/image-20240407192427896-182.png)

3)项目中集成

拷贝测试案例中的config到我们的项目中，

模块名：zzyl-framework   核心技术模块

包名：com.zzyl.config

![](./assets/image-20240407192427896-183.png)

在application.yml文件中的配置也要拷贝过来，修改为自己定义的执行器

```yaml
xxl:
  job:
    admin:
      addresses: http://192.168.200.146:8888/xxl-job-admin
    executor:
      appname: zzyl-dev-executor
      port: 9999
```


#### 4.8.2 定时任务代码编写

在ReservationMapper文件中新增一个方法(根据时间修改状态)，用于修改预约的状态

```java
@Update("update reservation set status = 3 where status = 0 and time < #{now}")
void updateReservationStatus(LocalDateTime now);
```

> 对于简单的sql，我们可以使用注解的方式开发

> 基本的思路就是：

> - 参数无需判断非空，条件控制在几个
> - 返回的类型需要单一，如果需要使用ResultMap，建议使用xml映射文件方式开发


在ReservationService业务层代码中新增一个方法(根据时间修改状态)，用于修改预约的状态

```java
/**
     * 过期状态修改
     * @param now
     */
void updateReservationStatus(LocalDateTime now);
```

实现类：

```java
/**
     * 过期状态修改
     * @param now
     */
@Override
public void updateReservationStatus(LocalDateTime now) {
    reservationMapper.updateReservationStatus(now);
}
```

在zzyl-service模块下创建任务类：

```java
package com.zzyl.job;

import com.zzyl.service.ReservationService;
import com.zzyl.vo.ReservationVo;
import com.xxl.job.core.handler.annotation.XxlJob;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

/**
 * @author sjqn
 * @date 2023/8/20
 */
@Component
@Slf4j
public class ReservationJob {

    @Autowired
    private ReservationService reservationService;

    @XxlJob("reservationStatusToExpired")
    public void updateReservationStatus() {
        log.info("预约状态-过期修改-begin");
        reservationService.updateReservationStatus(LocalDateTime.now());
        log.info("预约状态-过期修改-end");
    }
}
```

启动项目测试，在测试的时候，大家可以先把cron表达式修改为1分钟执行一次，手动在数据库改一些数据


## 5 作业练习

依据预约的需求分析，完成剩余的接口的编写：

- 查询取消预约数量
- 查询每个时间段剩余预约次数
- 取消预约
