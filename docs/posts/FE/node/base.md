# Node.js 基础相关

## 是什么？

nodejs 并不是 JavaScript 应用，也不是编程语言，因为编程语言使用的 JavaScript,Nodejs 是 JavaScript 的运行时，也就是运行环境。采用事件驱动和非阻塞 I/O 的 设计理念，使用 npm 作为包管理工具，适合干一些 IO 密集型应用，不适合 CPU 密集型应用，nodejsIO 依靠 libuv 有很强的处理能力，而 CPU 因为 nodejs 单线程原因，容易造成 CPU 占用率高，如果非要做 CPU 密集型应用，可以使用 C++插件编写 或者 nodejs 提供的 cluster。

## 怎么安装

## Npm Package json

npm（Node Package Manager）是 Node.js 的包管理工具（类似于 pip、cargo 等等），它是一个基于命令行的工具，用于帮助开发者在自己的项目中安装、升级、移除和管理依赖项。

::: details npm 相关命令

- `npm init`：初始化一个新的 npm 项目，创建 package.json 文件。
- `npm install`：安装一个包或一组包，并且会在当前目录存放一个 node_modules。
- `npm install <package-name>`：安装指定的包。
- `npm install <package-name> --save`：安装指定的包，并将其添加到 package.json 文件中的依赖列表中。
- `npm install <package-name> --save-dev`：安装指定的包，并将其添加到 package.json 文件中的开发依赖列表中。
- `npm install -g <package-name>`：全局安装指定的包。
- `npm update <package-name>`：更新指定的包。
- `npm uninstall <package-name>`：卸载指定的包。
- `npm run <script-name>`：执行 package.json 文件中定义的脚本命令。
- `npm search <keyword>`：搜索 npm 库中包含指定关键字的包。
- `npm info <package-name>`：查看指定包的详细信息。
- `npm list`：列出当前项目中安装的所有包。
- `npm outdated`：列出当前项目中需要更新的包。
- `npm audit`：检查当前项目中的依赖项是否存在安全漏洞。
- `npm publish`：发布自己开发的包到 npm 库中。
- `npm login`：登录到 npm 账户。
- `npm logout`：注销当前 npm 账户。
- `npm link`: 将本地模块链接到全局的  node_modules  目录下
- `npm config list` 用于列出所有的 npm 配置信息。执行该命令可以查看当前系统和用户级别的所有 npm 配置信息，以及当前项目的配置信息（如果在项目目录下执行该命令）
- `npm get registry` 用于获取当前 npm 配置中的 registry 配置项的值。registry 配置项用于指定 npm 包的下载地址，如果未指定，则默认使用 npm 官方的包注册表地址
- `npm set registry npm config set registry <registry-url>`  命令，将 registry 配置项的值修改为指定的` <registry-url>`  地址
  :::

执行 npm init 便可以初始化一个 package.json

::: details package.json 字段说明

- name：项目名称，必须是唯一的字符串，通常采用小写字母和连字符的组合。
- version：项目版本号，通常采用语义化版本号规范。
- description：项目描述。
- main：项目的主入口文件路径，通常是一个 JavaScript 文件。
- keywords：项目的关键字列表，方便他人搜索和发现该项目。
- author：项目作者的信息，包括姓名、邮箱、网址等。
- license：项目的许可证类型，可以是自定义的许可证类型或者常见的开源许可证（如 MIT、Apache 等）。
- dependencies：项目所依赖的包的列表，这些包会在项目运行时自动安装。
- devDependencies：项目开发过程中所需要的包的列表，这些包不会随项目一起发布，而是只在开发时使用。
- peerDependencies：项目的同级依赖，即项目所需要的模块被其他模块所依赖。
- scripts：定义了一些脚本命令，比如启动项目、运行测试等。
- repository：项目代码仓库的信息，包括类型、网址等。
- bugs：项目的 bug 报告地址。
- homepage：项目的官方网站地址或者文档地址。
  :::

## package-lock.json 文件是什么？

package-lock.json 文件在 Node.js 项目中起着重要的作用。它主要用于锁定依赖版本，确保在不同环境中安装依赖时的一致性。

- `version` 该参数指定了当前包的版本号
- `resolved` 该参数指定了当前包的下载地址
- `integrity` 用于验证包的完整性
- `dev` 该参数指定了当前包是一个开发依赖包
- `bin` 该参数指定了当前包中可执行文件的路径和名称
- `engines` 该参数指定了当前包所依赖的 Node.js 版本范围

除此之外，package-lock.json 帮助我们做了缓存，他会通过 name + version + integrity 信息生成一个唯一的 key，这个 key 能找到对应的 `index-v5` 下的缓存记录 也就是 npm cache 文件夹下的记录，找到 tar 包的 hash 值，然后将对应的二进制文件解压到 node_modeules,避免再次安装。

## npm install 的时候发生了什么？

首先安装的依赖都会存放在根目录的 node_modules,默认采用扁平化的方式安装，并且排序规则.bin 第一个然后@系列，再然后按照首字母排序 abcd 等，并且使用的算法是广度优先遍历，在遍历依赖树时，npm 会首先处理项目根目录下的依赖，然后逐层处理每个依赖包的依赖，直到所有依赖都被处理完毕。在处理每个依赖时，npm 会检查该依赖的版本号是否符合依赖树中其他依赖的版本要求，如果不符合，则会尝试安装适合的版本
::: details 什么是“扁平化”的方式安装？
安装某个二级模块时，若发现第一层级有相同名称，相同版本的模块，便直接复用那个模块，这么做能让依赖项的树结构层级更少。
:::

## npm run xxx
在执行 npm run 命令时，会读取 package.json 的 scripts 对应的脚本命令，例如：`"dev":"vite"` vite是个可执行脚本，其查找规则是：
- 先从当前项目的node_modules/.bin去查找可执行命令vite
- 如果没找到就去全局的node_modules 去找可执行命令vite
- 如果还没找到就去环境变量查找
- 再找不到就进行报错
::: tip
如果成功找到会发现有三个文件：vite.sh、vite.cmd、vite.ps1
- .sh文件给Linux unix Macos 使用
- .cmd 给windows的cmd使用
- .ps1 给windows的powerShell 使用
:::
::: tip 生命周期
``` json
    "predev": "node prev.js",
    "dev": "node index.js",
    "postdev": "node post.js"
```
执行 npm run dev 命令的时候 predev 会自动执行 他的生命周期是在dev之前执行，然后执行dev命令，再然后执行postdev，也就是dev之后执行

运用场景例如:
- npm run build 可以在打包之后删除dist目录等等
- postdev 例如编写完一个工具发布npm，那就可以在之后写一个ci脚本顺便帮你推送到git等等

vue-cli 中使用到了这个技术点。
:::

## npmrc 文件是什么？

npmrc 文件，全称为 npm running configuration，是 npm 的运行时**配置文件**。它主要用于设置 package.json 中依赖包的安装来源，即指定从哪个源下载依赖包。

## npx
npx是一个命令行工具，它是npm 5.2.0版本中新增的功能。它允许用户在不安装全局包的情况下，运行已安装在本地项目中的包或者远程仓库中的包。这可以使开发人员更轻松地管理包的依赖关系，并且可以避免全局污染的问题。它还可以帮助开发人员在项目中使用不同版本的包，而不会出现版本冲突的问题。