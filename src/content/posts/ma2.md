---
title: ma2文件解析
published: 2026-06-20
pinned: false
description: maimai DX后使用的ma2谱面文件的解析。
tags: [音游, maimai]
category: 笔记
licenseName: "Unlicensed"
author: YKSetuna
sourceLink: https://blog.ykse27.fun/
draft: true
---

[TOC]

# ma2文件解析

## 文件名

文件名为`id_难度.ma2`，其中id是6位数字，不足的前补0；难度从00\~04，分别为Basic\~Re:Master。（也就是说dx已经彻底删除了Easy）

## 开头

真代~Fes前（VERSION 1.03）
```011425_03.ma2
VERSION	0.00.00	1.03.00
FES_MODE	0
BPM_DEF	174.000	174.000	174.000	174.000
MET_DEF	4	4
RESOLUTION	384
CLK_DEF	384
COMPATIBLE_CODE	MA2

BPM	0	0	174.000
MET	0	0	4	4
MET	2	0	4	7
MET	9	0	4	1
MET	9	96	4	4
MET	33	96	4	3
MET	37	288	4	2
MET	39	96	4	1
MET	39	192	4	3
MET	50	0	4	7
MET	51	288	4	4
MET	61	288	4	1
MET	62	0	4	3
MET	63	192	4	7
MET	67	0	4	3
```
Fes后（VERSION 1.04）
```011617_03.ma2
VERSION	0.00.00	1.04.00
FES_MODE	0
BPM_DEF	190.000	190.000	190.000	190.000
MET_DEF	4	4
RESOLUTION	384
CLK_DEF	384
COMPATIBLE_CODE	MA2

BPM	0	0	190.000
MET	0	0	4	4
```
Touch Hold后（VERSION 1.05）
```011860_03.ma2
VERSION	0.00.00	1.05.00
FES_MODE	0
BPM_DEF	202.000	202.000	202.000	202.000
MET_DEF	4	4
RESOLUTION	384
CLK_DEF	384
COMPATIBLE_CODE	MA2

BPM	0	0	202.000
MET	0	0	4	4
```

### 开头变量作用

|      变量       |              1               |                              2                               |  3   |  4   |
| :-------------: | :--------------------------: | :----------------------------------------------------------: | :--: | :--: |
|     VERSION     |      未知，固定0.00.00       | 版本号：<br />fes前1.03.00；<br />fes后1.04.00；<br />Touch Hold后1.05.00 |  -   |  -   |
|    FES_MODE     |    与字面意思不同，固定0-    |                              -                               |  -   |  -   |
|     BPM_DEF     |   谱面开头提示音的BPM速度    |               谱面中间的BPM，不知道有什么作用                | 同左 | 同左 |
|     MET_DEF     |           x分音符            |                拍子数y，谱面开头提示音是y/x拍                |  -   |  -   |
|   RESOLUTION    | 固定384，代表每四拍分为384份 |                              -                               |  -   |  -   |
|     CLK_DEF     |        未知，固定384         |                              -                               |  -   |  -   |
| COMPATIBLE_CODE |        未知，固定MA_2        |                              -                               |  -   |  -   |

#### 时刻

本文用时刻的概念代指文件中标记时间位置的方式。
时刻用`x y`来标记，其中`x`是“小节”位置（从0开始，无论拍号如何都**固定4拍计算**），`y`是等分为384份后音符在该“小节”的位置（从0开始）。

``BPM	0	0	202.000``：BPM在0 0的**时刻**变为202.000
``MET	0	0	4	4``：拍号在0 0的时刻为4/4拍
*注：每小节分为384份，也就是0 96代表第一个小节的第二拍；14 192代表第15小节的第三拍。*
*因此raputa最后的20分扫实际是不完全平均的。Sun Dance的96分圈是游戏内能做到的最快的圈（做不到128分、384分等）。*

## 谱面正文

### Fes前谱面内容（VERSION 1.03）

#### Tap

`TAP	时刻1	时刻2	按键位置`

按键位置：从0\~7，依次为1\~8号键。

带有保护套的Tap为`XTP`，绝赞为`BRK`，语法都与`TAP`相同。

##### 星星头Tap

`STR	时刻1	时刻2	按键位置`

带有保护套的星星头Tap为`XST`，绝赞星星头Tap为`BST`，语法都与`TAP`、`STR`相同。

#### Hold

`HLD	时刻1	时刻2	按键位置	持续时间`

带有保护套的Hold为`XHO`，语法与`HLD`相同。

#### 星星轨迹

`SI_	时刻1	时刻2	起始位置	延迟时间	持续时长	结束位置`

- SI_：
- SF_：
- SV_：
- SUL/SUR：
- SCL/SCR：
- SLL/SLR：
- SXL/SXR：

#### Touch

`TTP	时刻1	时刻2	位置	判定区	是否烟花	M1`

#### Touch Hold

`THO	时刻1	时刻2	位置	持续时间	判定区	是否烟花	M1`











#### FES星星

```011884_03.ma2
NMSI_	57	288	7	96	96	4
CNSI_	58	96	4	0	96	1
CNSI_	58	192	1	0	96	6
CNSI_	58	288	6	0	96	3
CNSI_	59	0	3	0	96	0
CNSI_	59	96	0	0	96	5
```





## 结尾

也不知道为什么DX还存着旧框用的统计数据，这些数据应该没有任何用处。

上面`T_...`有可能用来计算游玩时的实时成绩；
但下面的`TTM_...`完全就是旧框用的信息，比如`TTM_RAT_ACV`代表旧框的理论值。

```011425_03.ma2
T_REC_TAP	431
T_REC_BRK	27
T_REC_XTP	99
T_REC_HLD	71
T_REC_XHO	4
T_REC_STR	94
T_REC_BST	1
T_REC_XST	13
T_REC_TTP	71
T_REC_THO	1
T_REC_SLD	122
T_REC_ALL	934
T_NUM_TAP	708
T_NUM_BRK	28
T_NUM_HLD	76
T_NUM_SLD	122
T_NUM_ALL	934
T_JUDGE_TAP	736
T_JUDGE_HLD	174
T_JUDGE_SLD	122
T_JUDGE_ALL	1032
TTM_EACHPAIRS	101
TTM_SCR_TAP	354000
TTM_SCR_BRK	72800
TTM_SCR_HLD	76000
TTM_SCR_SLD	183000
TTM_SCR_ALL	685800
TTM_SCR_S	662550
TTM_SCR_SS	683000
TTM_RAT_ACV	10040
```

