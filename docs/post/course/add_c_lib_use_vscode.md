---
toc: false
date: 1651841050000
title: '使用VScode尝试为C添加额外的库'
scope: ['tools', 'vscode']
buckets: ['post', 'course']
draft: false
visible: true
lang: 'zh'
layout: 'page'
---

<div style="height:150px;margin-bottom:10px;background-color:#2c2c32;display:flex;justify-content:center;align-items:center;color:#ffffff;font-size:20px;user-select:none"><Icon icon="vscode-icons:file-type-vscode" width="50" height="50" />&nbsp;Visual Studio Code&nbsp;/&nbsp;<span style="text-decoration:underline">C</span></div>

<br/>

使用 NPcap 编程进行网络抓包时出现需要导入第三方库的情况：

![c库未导入使用问题](https://res.zrain.fun/images/2022/05/c%E5%BA%93%E6%9C%AA%E5%AF%BC%E5%85%A5%E4%BD%BF%E7%94%A8%E9%97%AE%E9%A2%98-6c5841292d3f9f6e17068317c7323569.png)

强制编译自然没好果子吃：

C:\Users\zrain\Desktop\zrain\cat\test.c:9:10: <strong style="color:#ff616e">fatal</strong> error: pcap.h: No such file or directory:
<br>
#include <strong style="color:#ff616e;text-decoration:#ff616e wavy underline;text-underline-offset:2px"><pcap.h\></strong>

### 解决

在 VSCode 中可以在 `./.vscode` 文件夹下配置 C 编译的相关配置。VSCode YYDS 🤣。假设需要加载的库结构如下：

```text
C:.
│  test.c
│
├─.vscode
│
├─Include // 头文件
│  └─pcap
│
└─Lib // 动态链接库
    │
    ├─ARM64 // 适合ARM架构
    │
    └─x64 // 适合X86架构
```

### c\_cpp\_properties.json

可以手动创建，也可以借助**C/C++**扩展自动生成，使用 `Ctrl+Shift+P` 打开命令面板，键入 `c++` 通常第一项就是：

<CenterImg src="https://res.zrain.fun/images/2022/05/vscode%E5%91%BD%E4%BB%A4%E9%9D%A2%E6%9D%BF-cea8cff109471b6f91520d9549747fb5.png" alt="vscode命令面板" zoom="60%" />

配置如下：

```json
{
  "configurations": [
    {
      "name": "Win32",
      // 包含库、头文件的目录
      "includePath": [
        "${workspaceFolder}/**",
        "C:\\Users\\zrain\\Desktop\\zrain\\cat\\Include",
        "C:\\Users\\zrain\\Desktop\\zrain\\cat\\Lib\\x64"
      ],
      "browse": {
        "path": ["${workspaceRoot}", "C:\\Users\\zrain\\Desktop\\zrain\\cat\\Lib"]
      },
      "defines": ["_DEBUG", "UNICODE", "_UNICODE"],
      // 注意gcc执行路径
      "compilerPath": "C:\\tools\\mingw64\\bin\\gcc.exe",
      "cStandard": "gnu17",
      "cppStandard": "gnu++14",
      "intelliSenseMode": "windows-gcc-x64",
      // 编译参数很重要，这将决定vscode是否报错
      "compilerArgs": ["-L", "${workspaceFolder}/Lib/x64", "-lwpcap", "-lPacket", "-I", "${workspaceFolder}/Include"]
    }
  ],
  "version": 4
}
```

### tasks.json

此文件为调试时的启动配置文件，无需配置，它会在第一次调试运行时根据上面的 `c_cpp_properties.json` 自动生成。配置如下：

```json
{
  "tasks": [
    {
      "type": "cppbuild",
      "label": "C/C++: gcc.exe 生成活动文件",
      "command": "C:\\tools\\mingw64\\bin\\gcc.exe",
      "args": [
        "-fdiagnostics-color=always",
        "-g",
        "${file}",
        "-o",
        "${fileDirname}\\${fileBasenameNoExtension}.exe",
        "-L",
        "${workspaceFolder}/Lib/x64",
        "-lwpcap",
        "-lPacket",
        "-I",
        "${workspaceFolder}/Include"
      ],
      "options": {
        "cwd": "${fileDirname}"
      },
      "problemMatcher": ["$gcc"],
      "group": {
        "kind": "build",
        "isDefault": true
      },
      "detail": "调试器生成的任务。"
    }
  ],
  "version": "2.0.0"
}
```

到此配置完成 🙌。

### 参数启动

实际上也可以在 vscode 的 terminal(终端)中使用命令直接运行，不用配置文件，但是为了方便使用，建议配置好文件，方便进行 debug 之类的操作。可以在命令行使用下列命令进行编译(生成 exe 二进制文件)(-L 指定 lib 目录，-I 指定 include 目录，xxx.cpp 是你需要进行编译的文件，xxx.exe 是你要编译的文件的名称)：

```bash
# 说明：-L和-I与后面的参数可以不需要空格
gcc xxx.c -L'xxx\\lib' -I'xxx\\include' -o xxx.exe
```

### 参考

[VScode 中使用 C++语言调用第三方库的方法 - 知乎](https://zhuanlan.zhihu.com/p/414270736)
