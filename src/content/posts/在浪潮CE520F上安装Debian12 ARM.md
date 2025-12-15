---
title: 在浪潮CE520F上安装Debian12 ARM
published: 2025-12-15
pinned: true
description: 飞腾D2000折腾系列1-安装Debian12
tags: [Markdown, Blogging, D2000,Debian,inspur]
category: Technology
licenseName: "Unlicensed"
author: humanfans
draft: false
---
# 在浪潮CE520F上安装Debian12 ARM

原机主要配置是飞腾D2000  
原显卡：景嘉微jm7201 因无与6.6内核适配的显卡驱动，所以更换为了AMD Radeon HD 8570。

图片是从Debian12 直接升级到Debian13后的截图。

Debian12 arm原版镜像是支持直接安装的。 [https://mirrors.ustc.edu.cn/debian-cd/current/arm64/iso-dvd/debian-12.10.0-arm64-DVD-1.iso](https://mirrors.ustc.edu.cn/debian-cd/current/arm64/iso-dvd/debian-12.10.0-arm64-DVD-1.iso)  
建议直接安装dvd 因为需要后期换支持飞腾D2000配套主板网卡的6.6内核。  
镜像制作推荐使用rufus，自测ventoy 无法启动，不知道啥原因。。。

debian12 arm 安装默认步骤完成安装后，是无法启动的。grub安装不正确。  
从启动镜像，重新进入图形化急救模式

然后chrooot进入系统，  
执行 grub-install –force-extra-removabl  
会提示不支持系统，但是重启就可以进入了。  
网卡默认没有驱动，需要安装6.6内核。我这里提供一个gxdeos（基于debian的 DDE桌面发行版系统）的内核。   
安装后，重启，选择6.6内核进入即可。畅游Debian世界了。  
想要升到Debian13的话，执行以下命令即可。

  
sudo apt update  
sudo apt full-upgrade -y

  
然后 将源中的bookworm换成trixie 即可

  
sudo apt update  
sudo apt dist-upgrade -y  
中间会遇到小插曲 参照以下解决   
安装后，然后再执行  
sudo apt autoremove 应该就可以了。  
自测飞腾D2000的兼容其它系统表  
1 ubuntu 25.04 arm (需要手动安装上面6.6内核)  
2 gxdeos 15.14 飞腾专版 直接可以不用自己安装内核。镜像在内核分享地址里有  
3 gxdeos 25 arm可以安装 但是需要手动更换内核。  
4 ubuntu server版 22.04 24.04 都可以安装 但是需要更换内核才能配置上网。需要使用netplan配置网络。  
5 kylin 专业版和社区版都支持。专业版重新安装 需要联系客服。  
6 uos 1070专业版支持的。因为信创机都是绑定硬盘，可以直接激活。  
7 deepin23 arm 飞腾说他们适配了。但是我安装不上，要不然就是安装完成，配置无法进入。可能要求配置要高一点吧。

