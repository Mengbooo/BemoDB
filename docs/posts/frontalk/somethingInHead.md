# “头”里面有什么—— HTML meta

HTML里的meta标签是用来提供网页元数据（metadata）的，功能非常强大。

::: details 什么是元数据
> 元数据（Metadata），又称中介数据、中继数据，为描述数据的数据（data about data），主要是描述数据属性（property）的信息，用来支持如指示存储位置、历史数据、资源查找、文件记录等功能。元数据算是一种电子式目录，为了达到编制目录的目的，必须描述并收藏数据的内容或特色，进而达成协助数据检索的目的。都柏林核心集（Dublin Core Metadata Initiative，DCMI）是元数据的一种应用，是1995年2月由国际图书馆电脑中心（OCLC）和美国国家超级计算应用中心（National Center for Supercomputing Applications，NCSA）所联合赞助的研讨会，邀请52位来自图书馆员、电脑专家，共同制定规格，创建一套描述网络上电子文件之特征。

**元数据是关于数据的组织、数据域及其关系的信息，简言之，元数据就是关于数据的数据。**
:::

所以它能干啥？HTML5 规范定义了一系列标准的元数据名称，这些元数据通常通过`<meta>`标签的name属性来表达。

- `charset`：定义文档的字符编码。
- `viewport`：定义视口（viewport）的大小和缩放。
- `description`：定义文档的描述。
- `keywords`：定义文档的关键字。
- `author`：定义文档的作者。
- `generator`：定义文档的生成器。
- `refresh`：定义文档的刷新时间。
- `application-name`：定义应用程序的名称。
- `msapplication-tooltip`：定义应用程序的提示。
- `msapplication-starturl`：定义应用程序的起始 URL。
- `msapplication-navbutton-color`：定义应用程序的导航按钮颜色。
- `theme-color`：定义浏览器的主题颜色。
- `format-detection`：定义浏览器是否应该自动检测页面的格式。
- `apple-mobile-web-app-title`：定义苹果设备上的 Web 应用程序的标题。
- `apple-mobile-web-app-capable`：定义苹果设备上的 Web 应用程序的功能。
- `apple-mobile-web-app-status-bar-style`：定义苹果设备上的 Web 应用程序的状态栏样式。
- `msapplication-TileColor`：定义 Windows 8 磁贴的颜色。
- `msapplication-TileImage`：定义 Windows 8 磁贴的图像。
- `msapplication-config`：定义 Windows 8 磁贴的配置文件。
- `HandheldFriendly`：定义是否应该以手持设备的形式显示页面。
- `MobileOptimized`：定义是否应该以移动设备的优化方式显示页面。
- `viewport`：定义视口（viewport）的大小和缩放。
- `X-UA-Compatible`：定义 Internet Explorer 的兼容模式。
- `referrer`：定义页面的来源。
- `google-site-verification`：定义 Google 搜索引擎验证用的代码。
- `alexaVerifyID`：定义 Alexa 验证用的代码。            
--- 
不过上面的这些元数据大部分在实际开发中接触不到，下面的这几个用的还比较多：

- `charset`：定义文档的字符编码 —— 一般直接写utf-8
- `viewport`：定义视口（viewport）的大小和缩放 —— 用于适配移动端
- `description`：定义文档的描述 —— 用于SEO，即是搜索用描述
- `keywords`：定义文档的关键词 —— 用于SEO，即是搜索用关键词
- `author`：定义文档的作者 —— 用于SEO，即是搜索用作者

