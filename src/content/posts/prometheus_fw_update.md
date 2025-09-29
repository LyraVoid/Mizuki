# Linux 使用 Synaptics FS7605 指纹

## 1. 查看设备
```bash
lsusb
```
示例输出：
```
ID 06cb:00df Synaptics, Inc.
```

---

## 2. 尝试官方更新
```bash
sudo fwupdmgr enable-remote lvfs-testing
sudo fwupdmgr update
```

- 如果更新成功 → 到此结束  

---

## 3. 手动固件更新（⚠️危险操作）
> **仅在以下情况才需要手动操作：**  
> - 官方源没有对应固件;
> - 设备不能正常使用(排除硬件问题)
>
> ⚠️ **风险提示**  
> - 手动刷写可能导致指纹模块永久损坏或失效  
> - 请确认型号、版本完全匹配  
> - 建议提前做好系统备份
> - 本人概不负责 !
> - 

下文使用的设备是 06cb:00df，如果不是请自行寻找[设备固件](https://fwupd.org/lvfs/search?value=Synaptics)。

下载 Prometheus (IOTA Config) 固件 (06cb:00df)
前往 [06cb:00df](https://fwupd.org/lvfs/devices/com.synaptics.prometheus.0xDF_3483_500.config) 下载固件
然后安装
- 如果提示 **No supported devices found** 那就这样了。


---

## 4. 歪门邪道，修改 GUID
想强制安装怎么办? 把刚刚下载的固件解压。
在这个文件 `prometheus.metainfo.xml` 找到第 10 行：  
```xml
<firmware type="flashed">7b93dd19-18d1-5a0c-a32d-79a5d27e2b38</firmware>
```

查询本机设备 GUID：
```bash
fwupdmgr get-devices
```

示例输出：
```
Prometheus (IOTA Config):
│  GUID: 0e58a9cb-f338-567b-a7ca-2a821eb8f3c2
```

修改为：
```xml
<firmware type="flashed">0e58a9cb-f338-567b-a7ca-2a821eb8f3c2</firmware>
```

---

## 5. 重新打包并安装
打包：
```bash
gcab -c 固件包.cab 文件1 文件2 文件3 ...
```

安装：
```bash
fwupdmgr install 固件包.cab
```

请确认打包时包含：
- 修改过的 `prometheus.metainfo.xml`  
- 固件二进制文件（`.bin` 或 `.fw` 等）

---
