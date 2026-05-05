# 這一版 Mizuki主要額外改動了一些地方


主要是額外支持了 `Video` 組件

你能以以下方式插入視頻

:::video[Demo Clip]{ src="https://coffee3322.ccwu.cc/api/s/xf1q1s/VID_20260505_212018.mp4" controls=true autoplay=false width="100%" height="468px" muted=true}

> [!TIP]
> 注意請確保他所有參數在同一行 而不是換行過後的
>

然後也對 `Image` 組件做了調整

```txt
![ice0 h-344px](./ice0.jpg)
```

他原本只支持對 `width` 進行調整

現在額外支持了高度控制

原本他只支持用 `%`

現在讓他可以用兩種形式

```txt
![ice0 h-100%](./ice0.jpg)
```

