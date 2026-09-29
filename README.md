# 🚀 什么是 FC-UniApp-X？

FC-UniApp-X 是一套面向 uni-app x 蒸汽模式 的开箱即用框架。把常用能力收敛为模块，样式交给 UnoCSS，再配套 Skill 与 Rule，让人和 AI 沿着同一套约定协作开发——少重复、少返工。

## 🛠️ 特点

- **蒸汽模式**：紧贴 uni-app x 蒸汽模式设计，跨端能力按真实项目来组织
- **配好即用**：模块化接入，配置完成即可调用，用多少引多少
- **UnoCSS**：原子类随手写，样式快，体积也收得住
- **AI 友好**：内置 Skill 与 Rule，AI 认框架、按约定写代码，生成结果稳定可复用
- **全端适配**：iOS、Android、鸿蒙 OS、Web、微信小程序按模块标明，App 专属能力单独标注

## 🔗 预览体验

![安卓版 Demo 预览](https://www.pgyer.com/app/qrcode/fc-uniapp-x)

安卓版本

## 文档地址

[文档地址](https://lfcleo.github.io/fc-uniapp-x-doc/)

## 模块功能

| 模块 | 说明 | 支持平台 | 默认集成 | 可移除 |
| --- | --- | --- | --- | --- |
| `store` | [状态管理](/guide/base/store) | 随项目 | 是 | 否 |
| `router` | [路由](/guide/base/router) | 随项目 | 是 | 否 |
| `tool` | [工具类](/guide/base/util) | iOS、Android、鸿蒙 OS、Web、微信小程序 | 否 | 是 |
| `i18n` | [多语言](/guide/base/i18n) | iOS、Android、鸿蒙 OS、Web、微信小程序 | 否 | 是 |
| `theme` | [应用主题](/guide/base/theme) | iOS、Android、鸿蒙 OS、Web、微信小程序 | 否 | 是 |
| `request` | [网络请求](/guide/base/request) | iOS、Android、鸿蒙 OS、Web、微信小程序 | 否 | 是 |
| `upload` | [网络上传](/guide/base/upload) | iOS、Android、鸿蒙 OS、Web、微信小程序 | 否 | 是 |
| `download` | [网络下载](/guide/base/download) | iOS、Android、鸿蒙 OS、Web、微信小程序 | 否 | 是 |
| `stream` | [流式响应](/guide/base/stream) | iOS、Android、鸿蒙 OS、Web、微信小程序 | 否 | 是 |
| `websocket` | [WebSocket](/guide/base/websocket) | iOS、Android、鸿蒙 OS、Web、微信小程序 | 否 | 是 |
| `privacy` | [隐私协议](/guide/base/privacy) | iOS、Android、鸿蒙 OS | 否 | 是 |
| `permission` | [系统权限](/guide/base/permission) | iOS、Android、鸿蒙 OS | 否 | 是 |
| `push` | [通知推送](/guide/base/push) | iOS、Android、鸿蒙 OS、Web、微信小程序 | 否 | 是 |
| `update` | [应用更新](/guide/base/update) | iOS、Android、鸿蒙 OS | 否 | 是 |

## 🤖 写给 AI 的框架

框架不只给人用，也给 AI 用。项目里带好 Skill 和 Rule：

- **Skill** 讲清模块怎么配、能力怎么调、代码放哪
- **Rule** 守住目录、写法和调用约定，生成出来就是这个项目的样子

接到 Cursor 这类编程助手上，不用先把框架讲一遍。提需求，它按同一套规范写，快，也经得起改。
