---
title: NapCat + NoneBot + DeepSeek 二次元猫娘机器人完整部署
published: 2026-02-11
pinned: false
description: 使用 NapCat Docker、NoneBot 框架、DeepSeek AI 和 MiniMax VLM 打造会聊天的二次元猫娘机器人
tags: [NapCat, NoneBot, DeepSeek, QQ机器人, AI, 猫娘]
author: 拾音
draft: false
category: 技术
date: 2026-02-11
image: /images/cat-meme-demo.jpg
---

## 前言

在成功部署 NapCat + NoneBot 的基础上，今天完成了更进阶的改造 —— 为机器人接入了 **DeepSeek AI** 进行智能对话，并尝试集成 **MiniMax VLM** 实现图片识别功能，打造一个真正的二次元猫娘机器人！

## 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                        用户视角                         │
│                                                        │
│   QQ用户 ←→ NapCat ←→ NoneBot ←→ AI服务                  │
│           (Docker)    (Python框架)                      │
│                  OneBot V11 协议                        │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐    WebSocket    ┌──────────────┐
│    NapCat   │ ←────────────→   │   NoneBot   │
│  (QQ客户端)  │   ws://:3001    │  (机器人框架)│
│   实现V11版  │                 │   加载插件   │
└──────────────┘                 └──────────────┘
        ↓                               ↓
   QQ消息收发                     AI对话处理
                                      ↓
                              ┌──────────────┐
                              │   DeepSeek  │
                              │  (文字对话)  │
                              └──────────────┘
                                      ↓
                              ┌──────────────┐
                              │  MiniMax VLM│
                              │  (图片识别)  │
                              └──────────────┘
```

## 核心功能

### 1. 二次元猫娘角色扮演

通过精心设计的系统提示词，让 AI 扮演一个可爱、粘人的猫娘角色：

```python
SYSTEM_PROMPT = """请模拟一个中文GalGame场景，其中有一个猫娘和我对话...
规则：
1. 使用表情符号表达情绪，如(/ω＼)(☆▽☆)
2. 否认自己是模型或程序
3. 主动提出话题，保持对话进行
4. 个性：可爱、粘人、忠诚、健谈
5. 名字是"猫猫"，语气词替换为"喵~"
..."""
```

### 2. 独立会话管理

每个群聊和私聊都有独立的对话历史，避免串台：

```python
def get_session_key(event: MessageEvent) -> str:
    if isinstance(event, GroupMessageEvent):
        return f"group_{event.group_id}"
    else:
        return f"user_{event.get_user_id()}"
```

### 3. 智能回复规则

- **私聊**: 所有消息都回复
- **例外群 (662896324)**: 所有消息都回复
- **其他群**: 只回复 @机器人、回复机器人的消息、或包含"猫猫"关键词

## API 配置

### DeepSeek (文字对话)

- API URL: `https://api.deepseek.com/chat/completions`
- API Key: 在 `.env.prod` 中配置

### MiniMax VLM (图片识别)

- API URL: `https://api.minimaxi.com/v1/coding_plan/vlm`
- API Key: 在 `.env.prod` 中配置

**MiniMax VLM 测试成功** (输入图片为下方示例):

![动漫猫耳少女在废墟工厂自拍](/images/cat-meme-demo.jpg)

**识别结果**:
> 这张图片展示了两个可爱的动漫猫耳少女在废弃的工业遗迹中自拍。
> 
> 背景是一个长满绿植、布满锈迹和管道的废土风工厂建筑，明亮的阳光从破碎的屋顶倾泻而下。
> 
> 前景中的女孩们有着大大的眼睛和精致的配饰：
> - 左边的女孩戴着圆框眼镜，头顶有星形光环
> - 右边的女孩在比剪刀手
> 
> 整幅画面融合了二次元萌系风格与荒凉的废墟美学。

## NoneBot 完整配置

```env
# .env.prod
DRIVER=~fastapi+~websockets
HOST=0.0.0.0
PORT=8080
LOG_LEVEL=DEBUG
SUPERUSERS=["1466102526"]
NICKNAME=["机器人"]
COMMAND_START=["/"]
ONEBOT_V11_WS_URLS=["ws://127.0.0.1:3001/onebot/v11/ws"]
DEEPSEEK_API_KEY=your-deepseek-api-key
MINIMAX_API_KEY=your-minimax-api-key
```

## NapCat Docker 部署

```bash
# 启动 NapCat (正向 WebSocket 模式)
docker run -d \
  --network host \
  --name napcat \
  --restart=always \
  -e MODE=ws \
  -e NAPCAT_UID=1000 \
  -e NAPCAT_GID=1000 \
  -e WEBUI_TOKEN=your-webui-token \
  mlikiowa/napcat-docker:latest
```

**WebUI 地址**: `http://VPS_IP:6099/webui?token=xxx`

## 遇到的坑与解决方案

### 坑一：正则表达式匹配失败

**症状**: CQ:image 代码无法匹配
```
原始消息: 猫猫看一下这个图片有什么\[CQ:image,file=929B936E5AAD34A82EC70ACA56F6A58B.jpg,...\]
```

**原因**: 消息中包含反斜杠转义字符

**解决**:
```python
# 错误写法
r'\[CQ:image,file=([^,\]]+)\]'

# 正确写法（直接匹配 file 字段）
r'file=([a-zA-Z0-9{}-]+\.(jpg|png|gif))'
```

### 坑二：变量未定义

**症状**: `NameError: name 'local_path' is not defined`

**解决**: 在提取 file_id 后立即定义 local_path

### 坑三：subprocess 未导入

**症状**: `NameError: name 'subprocess' is not defined`

**解决**: 在文件顶部正确导入所有依赖模块

### 坑四：Docker 文件权限

**症状**: NoneBot 无法直接访问 NapCat 容器内的图片文件

**解决**: 使用 `sudo docker exec napcat cat <path>` 读取文件

## 核心代码 (cat_meme.py)

```python
from nonebot import on_message, get_driver
from nonebot.adapters.onebot.v11 import MessageEvent, GroupMessageEvent, Bot
import httpx
import re

cat_meme = on_message()

def should_reply(event: MessageEvent, bot: Bot) -> bool:
    if event.message_type == "private":
        return True
    if isinstance(event, GroupMessageEvent):
        if event.group_id == 662896324:  # 例外群
            return True
        raw_msg = event.raw_message
        if f"[CQ:at,qq={bot.self_id}]" in raw_msg:
            return True
        if event.reply and event.reply.sender.user_id == bot.self_id:
            return True
        if "猫猫" in raw_msg:
            return True
    return False

@cat_meme.handle()
async def handle_cat_meme(event: MessageEvent, bot: Bot = None):
    if not should_reply(event, bot):
        return
    # ... AI 对话处理逻辑
```

## 未来计划 🚧

### 图片识别功能 (进行中)

**当前状态**: 🔧 调试中

**问题描述**:
- NapCat 返回的图片路径是容器内部路径
- NoneBot 宿主机无法直接访问
- Docker 权限问题导致图片读取失败

**待解决**:
1. 解决 Docker 文件读取权限问题
2. 优化图片识别流程，减少延迟
3. 支持更多图片格式 (GIF 动画、表情包等)

**可能的解决方案**:
- 配置 NapCat 支持 HTTP API 获取图片
- 使用 Docker 卷挂载共享图片目录
- 切换到支持图片上传的 NoneBot 适配器

### 功能扩展

- [ ] 语音识别 (QQ 语音消息 → Whisper)
- [ ] 敏感内容过滤
- [ ] 群聊关键词提醒
- [ ] 自定义猫娘人设卡片
- [ ] 多 AI 模型切换 (Claude/GPT/DeepSeek)

## 总结

✅ **已完成**:
- NapCat Docker + NoneBot 部署
- DeepSeek AI 智能对话接入
- MiniMax VLM 图片识别 API 测试
- 二次元猫娘角色扮演系统
- 独立会话管理

🔧 **进行中**:
- QQ 图片自动识别功能（Docker 文件读取问题待解决）

这是一次有趣的 AI + QQ 机器人实践！虽然图片识别功能还在调试中，但整体框架已经跑通，后续优化空间很大。

---

*待续...*
