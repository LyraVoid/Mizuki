---
title: Nginx注入自定义HTML标签
published: 2026-01-03
pinned: false
description: 使用Nginx sub_filter 可以替换相应内容中字符串的指令，主要用于反向代理和修改响应内容

tags: [Nginx]
category: '教程'
draft: false
date: 2026-01-03
image: "./assets/nginx-subfilter-html-cover.png"
---



# 前言

最近搭建了一个[Uptime Kuma](https://uptime.kuma.pet)监控，觉得状态页面的样式不好看，想要进行一番修改，但是呢，他的修改很有限，只能添加css样式，我想要注入iconfont都不行，研究了一番，找到了注入HTML的方法。

:::note

**sub_filter** 用于替换响应内容中字符串的指令，它主要用于反向代理和修改响应内容

**sub_filter** 是 ngx_http_sub_module 模块提供的功能，需要确保该模块被编译进Nginx

:::

因为服务是搭建在内网的飞牛NAS上的，需要中转出去，于是套了一层Nginx做端口复用，实现一个端口多个域名访问。

# 解决方式

在中转状态页的nginx配置做如下配置，即可成功注入。

```sql
server {
    listen 80;
    location ^~ / {
        //其他配置...
    }






    // 这个地址为状态页的路径
    location ^~ /status/external {
      //内网访问的页面
      proxy_pass http://10.0.0.11:3001/status/external;
      //下面内容可以直接复制location ^~ /里面的
      proxy_set_header Host $http_host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Real-Port $remote_port;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_set_header X-Forwarded-Host $host;
      proxy_set_header X-Forwarded-Port $server_port;
      proxy_set_header REMOTE-HOST $remote_addr;
      
      proxy_connect_timeout 60s;
      proxy_send_timeout 600s;
      proxy_read_timeout 600s;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection $connection_upgrade;
      
      # 在head后面进行拼接
      sub_filter '</head>' '<script src="/main.js"></script>';
      sub_filter '</head>' '<link rel="stylesheet" href="/main.css">';
      sub_filter '</head>' '<link rel="stylesheet" href="/iconfont.css">';

      # 设置字符串替换次数
      sub_filter_once off;  # 如果有多处需要替换，设置为 off
      sub_filter_types *;    # 应用于所有 MIME 类型
      
    }
}
```

下面是`sub_filter`常用的一些参数。

> - **sub_filter**：用于设置需要替换的字符串和替换后的字符串。语法为： sub_filter string replacement; 其中，string 是要被替换的字符串，replacement 是新的字符串，可以包含变量。
> - **sub_filter_last_modified**：用于设置网页内替换后是否修改。语法为： sub_filter_last_modified on | off; 默认值为 off。
> - **sub_filter_once**：用于设置字符串替换次数。语法为： sub_filter_once on | off; 默认只替换一次。如果设置为 off，则所有匹配到的字符都会被替换。
> - **sub_filter_types**：用于指定需要被替换的 MIME 类型。语法为： sub_filter_types *; 默认值为 text/html，如果设置为 *，则所有类型都会被替换。

## 缺点

解决不了一个问题，就是你无法在js、css里面引用变量作为路径。

类似于

```css
.div-bg{
    background: url('${fineServletURL}/resources?path=/com/fr/web/resources/dist/images/2x/data_import.png') no-repeat center center;
}
```

解决方法：

1. 可以将变量引用的静态文件，可以缓存到nginx本地。统一读取nginx路径下的文件。后续更新同步更新nginx路径下的文件
2. 改为使用http链接的形式
