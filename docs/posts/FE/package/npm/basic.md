---
title: 关于 npm
date: '2025-04-07'
tags:
- FE
---

# 关于 npm

NPM（Node Package Manager）是一个 javascript 包管理工具，也是 Node.js 的默认包管理器。

> npm is the world's largest software registry. Open source developers from every continent use npm to share and borrow packages, and many organizations use npm to manage private development as well.

主要功能有：

- `包管理` ：NPM 可以帮助你安装并管理项目所需的各种第三方库（包）。例如，可以通过简单的命令来安装、更新、或删除依赖。
- `版本管理` ：NPM 支持版本控制，允许你锁定某个特定版本的依赖，或根据需求选择最新的版本。
- `包发布` ：NPM 允许开发者将自己的库发布到 NPM 仓库中，其他开发者可以通过 NPM 下载并使用这些库。
- `命令行工具` ：NPM 提供了强大的命令行工具，可以用于安装包、运行脚本、初始化项目等多种操作。

npm 由三个不同的组件组成：

- the website  网站
- the Command Line Interface (CLI)
命令行界面 （CLI）
- the registry  注册表

使用[NPM 网站](https://www.npmjs.com/)发现包、设置配置文件和管理 npm 体验的其他方面。例如，您可以设置组织来管理对公有或私有包的访问。

[CLI](https://docs.npmjs.com/cli/v11/commands/npm)从终端运行，是大多数开发人员与 npm 交互的方式。

[注册表](https://docs.npmjs.com/cli/v11/using-npm/registry)是一个大型公共数据库，其中包含 cli 软件及其周围的元信息。

## 常用命令

作为前端开发者，使用NPM的主要方式是通过CLI，故而需要使用相关命令来进行交互，接下来我们展示一些常用的命令，并列举一些其它命令。

### 安装、检验、更新 NPM

新版的 Nodejs 已经集成了 NPM ，故而不需要再次安装。

#### 检验版本

``` txt
npm -v
```

#### 更新版本

`For Windows`

``` txt
npm install npm -g
```

`For Linux`

``` shell
$ sudo npm install npm -g
/usr/local/bin/npm -> /usr/local/lib/node_modules/npm/bin/npm-cli.js
npm@2.14.2 /usr/local/lib/node_modules/npm
```

### 安装模块

语法格式如下：

``` txt
npm install <Module Name>
```

安装完成之后会有提示，包会被放置在工程目录下的 node_modules 目录中。

#### 全局安装与本地安装

npm 的包安装分为本地安装（local）、全局安装（global）两种，从敲的命令行来看，差别只是有没有 -g 参数。

`本地安装`：将包安装到 node_modules 目录，并将信息保存到 package.json 的 dependencies 中。

``` txt
npm install <Module Name> 
```

`全局安装`：用于安装命令行工具或需要在多个项目中使用的包。

``` txt
npm install <Module Name> -g
```


特性|本地安装|全局安装
----|----|----|
安装范围|在当前项目中可用|在系统的全局环境中可用
命令使用|npm install package-name|npm install -g package-name
安装位置|node_modules 目录|系统全局目录（依 OS 而异）
使用场景|项目依赖（库、框架）|CLI 工具、项目生成器
访问方式|通过 require() 或 import 使用|在命令行中直接使用
依赖声明|在 package.json 中记录|不在 package.json 中记录
版本控制|不同项目中可用不同版本|系统中只保留一个版本
权限问题|无需特殊权限|可能需要管理员权限

如果你希望具备两者功能，则需要在两个地方安装它或使用 npm link

安装过程输出内容的第一行会输出 `模块名` `模块的版本号` `安装位置`

#### 查看安装信息

你可以使用以下命令来查看所有全局安装的模块：

``` txt
npm list -g
```

对于 本地安装 ，直接在项目目录下的 package.json 中查看即可

如果要查看某个模块的版本号，可以使用命令如下：

``` txt
npm list <module_name>
```

### 卸载模块

``` txt
npm uninstall <module_name>
```

卸载后，你可以到 `/node_modules/` 目录下查看包是否还存在，或者使用以下命令查看：

``` txt
npm ls
```

### 更新模块

``` txt
npm update <module_name>
```

### 搜索模块

``` txt
npm search <module_name>
```

### 创建模块

创建模块，package.json 文件是必不可少的。我们可以使用 NPM 生成 package.json 文件，生成的文件包含了基本的结果。

``` txt
npm init
This utility will walk you through creating a package.json file.
It only covers the most common items, and tries to guess sensible defaults.

See `npm help json` for definitive documentation on these fields
and exactly what they do.

Use `npm install <pkg> --save` afterwards to install a package and
save it as a dependency in the package.json file.

Press ^C at any time to quit.
name: (node_modules) <name>                   # 模块名
version: (1.0.0) 
description: <des>  # 描述
entry point: (index.js) 
test command: make test
git repository: <url>
keywords: 
author: 
license: (ISC) 
About to write to ……/node_modules/package.json:      # 生成地址

{
  "name": "<name>",
  "version": "1.0.0",
  "description": "<des>",
  ……
}


Is this ok? (yes) yes
```

我们会在后面介绍各个key所对应的信息意义。

以上的信息，你需要根据你自己的情况输入。在最后输入 "yes" 后会生成 package.json 文件。

接下来我们可以使用以下命令在 npm 资源库中注册用户（使用邮箱注册）：

``` txt
npm adduser
Username: bolaxious
Password:
Email: (this IS public) bolaxious@163.com
```

### 发布模块

这一步需要你创建完模块之后再进行。

``` txt
npm publish
```

## 版本号

> 为了保持 JavaScript 生态系统的健康、可靠性和安全性，每次对您拥有的 npm 包进行重大更新时，我们建议在遵循语义版本控制规范的 package.json 文件中发布新版本的包，其中包含更新的版本号。遵循语义版本控制规范有助于依赖您的代码的其他开发人员了解给定版本中的更改程度，并在必要时调整他们自己的代码。

在 NPM 官网中，在已发布的包中递增语义版本是这样的：

Code status	Stage	|Rule	|Example |version
---|---|---|---|
First release	|New product	|Start with 1.0.0	|1.0.0
Backward compatible bug fixes	|Patch release	|Increment the third digit	|1.0.1
Backward compatible new features	|Minor release	|Increment the middle digit and reset last digit to zero	|1.1.0
Changes that break backward compatibility	|Major release	|Increment the first digit and reset middle and last digits to zero	|2.0.0

可以指定软件包可以从 Package 的 `package.json` 文件中的依赖项接受哪些更新类型。

例如，要指定可接受的版本范围（最高为 1.0.4），使用以下语法：

- 补丁版本：`1.0` 或 `1.0.x` 或 `~1.0.4`
- 次要版本：`1` 或 `1.x` 或 `^1.0.4`
- 主要版本：`*` 或 `x`

例如：

``` javascript
"dependencies": {
  "my_dep": "^1.0.0",
  "another_dep": "~2.2.0"
},
```

### 额外标记
- 预发布版本：如 `1.0.0-alpha` 或 `1.0.0-beta.1`，表示该版本仍在测试中。
- 构建元数据：如 `1.0.0+build.1`，提供有关构建的信息。

### 安装示例

- 安装特定版本：`npm install package-name@1.2.3`
- 安装最新的主版本：`npm install package-name@^1.2.3` （安装 1.x.x 的最新版本）

## 使用淘宝 NPM 镜像

由于国内直接使用 npm 的官方镜像是非常慢的，为了解决这个问题，我们可以使用淘宝提供的镜像（cnpm 或通过配置 NPM）来加速包的下载和安装。

淘宝 NPM 镜像是一个完整 npmjs.org 镜像，你可以用此代替官方版本(只读)，同步频率目前为 10分钟 一次以保证尽量与官方服务同步。

你可以使用淘宝定制的 cnpm (gzip 压缩支持) 命令行工具代替默认的 npm:

``` txt
npm install -g cnpm --registry=https://registry.npmmirror.com
```

接下来我们就可以使用 cnpm 来替代 npm 进行包的安装和管理：

``` txt
cnpm install [name]
```

不过使用淘宝源可能会导致一些版本上的问题，我们说过，npm的组成部分之一就是registry，由于使用镜像源故而可能造成问题

## package.json 的说明与使用

package.json 是 Node.js 项目中的一个核心文件，包含了项目的元数据、依赖、脚本等信息。

package.json 文件用于描述项目的元数据和依赖关系，它通常位于项目的根目录中，并且是项目的配置文件。

package.json 文件是一个 JSON 格式的文件，包含以下基本字段：

- `name` ：项目的名称，应该是唯一的，通常使用小写字母和连字符。
- `version` ：项目的版本号，遵循语义化版本控制（Semantic Versioning）。
- `description`  ：项目的简短描述。
- `main` ：项目的入口文件，通常是应用程序的启动文件。
- `scripts` ：定义了一系列的命令行脚本，可以在项目中执行特定的任务。
- `dependencies` ：列出了项目运行所需的所有依赖包及其版本。
- `devDependencies` ：列出了只在开发过程中需要的依赖包及其版本。
- `peerDependencies`  ：列出了项目期望其依赖包也依赖的包。
- `optionalDependencies` ：列出了可选的依赖包。
- `engines` ：指定了项目兼容的 Node.js 版本。
- `repository` ：项目的代码仓库信息，如 GitHub 仓库的 URL。
- `keywords` ：项目的关键词，有助于在 npm 搜索中找到项目。
- `author` ：项目的作者信息。
- `license` ：项目的许可证信息。

### 使用方法

1. `初始化项目` ：在项目目录中运行 `npm init` 命令，npm 会引导你创建一个 package.json 文件，或者自动生成一个包含默认值的 package.json。

2. `安装依赖` ：使用 `npm install <package-name>` 命令安装依赖，npm 会自动将依赖添加到 package.json 文件的 dependencies 或 devDependencies 中，并创建 `package-lock.json` 文件以锁定依赖的版本。

3. `管理脚本` ：在 `scripts` 字段中定义命令，例如 `"start": "node app.js"`，然后可以通过 `npm start` 命令来运行这些脚本。

4. `版本控制` ：使用 `npm version` 命令来管理项目的版本号，npm 会自动更新 package.json 中的版本号，并生成一个新的 `Git 标签`。

5. `发布包` ：当项目准备好发布到 `npm` 时，可以使用 `npm publish` 命令，npm 会读取 `package.json` 中的信息来发布包。

6. `依赖管理` ：`package.json` 和 `package-lock.json` 文件一起工作，确保项目在不同环境中的依赖版本一致。

一个典型的 package.json 文件结构如下：

``` javascript
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "A simple Node.js project",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "express": "^4.17.1"
  },
  "devDependencies": {
    "nodemon": "^2.0.20"
  },
  "keywords": ["node", "npm", "example"],
  "author": "Your Name",
  "license": "MIT"
}
```

### 使用 package.json 的好处

- 依赖管理：集中管理项目的依赖项及其版本。
- 自动化任务：通过 scripts 字段可以方便地运行常见的任务。
- 版本控制：确保项目及其依赖版本的一致性，便于团队协作。
- 描述项目：为项目提供元数据信息，便于发布和共享。

### 依赖管理

`dependencies` ：存储项目运行所需的依赖

``` javascript
"dependencies": {
  "express": "^4.17.1"
}
```
安装依赖时使用：

``` txt
npm install express
```

`devDependencies` ：存储项目开发期间需要的依赖。

``` javascript
"devDependencies": {
  "nodemon": "^2.0.20"
}
```

安装依赖时使用：

``` txt
npm install nodemon --save-dev
```

或者直接用以下命令来安装所有依赖：

``` txt
npm install
```

### 版本号中的符号说明

- `^` ：表示安装与当前主版本兼容的最新版本。例如，^4.17.1 会安装 4.x.x 中的最新版本。
- `~` ：表示安装与当前次版本兼容的最新版本。例如，~4.17.1 会安装 4.17.x 中的最新版本。

### 常用命令

初始化 package.json 文件：

``` txt
npm init
```

快速生成默认的 package.json 文件:

``` txt
npm init -y 
```

查看项目依赖：

``` txt
npm list --depth=0
```

更新依赖：

``` txt
npm update package-name
```





















































































































































