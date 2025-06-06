# OpenAI 帮助中心界面

这是一个基于 HTML、CSS 和 JavaScript 创建的 OpenAI 帮助中心移动端界面。该项目展示了一个符合美国用户审美的现代化移动应用界面设计。

## 功能特点

- 响应式设计，适配移动设备屏幕
- 多页面布局，包含独立的HTML页面：
  - 首页 (home.html)
  - 帮助页面 (help.html)
  - 消息页面 (messages.html)
  - 聊天页面 (chat.html)
- 页面间流畅导航和跳转
- 现代化 UI 设计，包括卡片布局、阴影效果等
- 交互元素（按钮、链接等）具有悬停效果
- 优雅的动画效果（例如问候语中的挥手图标）
- 功能完整的聊天界面，包括发送和接收消息功能

## 使用技术

- HTML5
- CSS3（动画、Flexbox 布局、阴影效果等）
- JavaScript（导航交互、聊天功能）
- Font Awesome 图标库

## 项目结构

```
.
├── index.html        # 重定向到首页的入口页面
├── home.html         # 首页，显示问候语、最近消息和常见问题
├── messages.html     # 消息列表页面
├── help.html         # 帮助文章分类集合页面  
├── chat.html         # 聊天对话界面
└── styles.css        # 所有页面共用的样式文件
```

## 如何使用

1. 克隆或下载此仓库
2. 在浏览器中打开 `index.html` 文件，它会自动重定向到首页
3. 通过底部导航栏在不同页面之间切换
4. 点击"Send us a message"或任何消息项目打开聊天界面
5. 在聊天界面，点击"Get started"可以开始一个新的对话

## 页面功能

- **首页** - 展示问候语、最近消息、系统通知和常见问题
- **消息页面** - 显示与 OpenAI 的消息历史记录
- **帮助页面** - 提供帮助文章分类集合
- **聊天页面** - 提供与 AI 助手的对话界面，支持发送和接收消息

## 兼容性

该界面设计兼容最新版本的主流浏览器，包括 Chrome、Firefox、Safari 和 Edge。为获得最佳效果，推荐使用最新版本的浏览器。

## 许可

此项目仅用于学习和展示目的。 