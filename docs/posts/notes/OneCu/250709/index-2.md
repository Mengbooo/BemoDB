---
title: '一卒#007 | Vitepress 添加归档和标签功能的实现过程'
date: '2025-07-09'
tags:

- BemoNote
- Vitepress

---
# 一卒#007 | Vitepress 添加归档和标签功能的实现过程

如果你用 VitePress 搭建个人博客，可能会发现它默认缺少归档和标签功能。这两个功能对于内容组织、方便读者浏览和检索文章来说，其实非常实用。在这篇文章里，我们就一步步地看看如何在 VitePress 中手动实现这两个功能。

## 整体思路和技术选型

首先，我们来明确一下想要实现的功能：

1.  **归档功能**：可以按照文章的发布年份进行分类展示。
2.  **标签功能**：可以根据文章 frontmatter 中的标签进行分组，并且可以点击标签筛选文章。
3.  **自动处理**：所有文章数据都应该从 Markdown 文件的 frontmatter 中自动收集。
4.  **原生体验**：归档页和标签页的样式要和 VitePress 的默认主题风格保持一致。

为了实现这个目标，我们的整体架构可以分成三个部分：

1.  **数据处理层**：负责扫描所有文章，提取元数据，并按年份和标签进行组织。
2.  **页面渲染层**：负责创建归档页和标签页，并用 Vue 来渲染数据和处理交互。
3.  **导航配置**：在 VitePress 的导航栏中添加入口，方便用户访问。

## 数据处理层实现

实现这个功能的核心在于处理数据。VitePress 恰好提供了一个很方便的 API——`createContentLoader`，它可以帮我们批量加载和处理指定目录下的 Markdown 文件。这正是我们需要的。

我们先在项目的 `.vitepress/theme` 目录下创建一个名为 `posts.data.ts` 的文件，专门用来处理文章数据：

```typescript
import { createContentLoader } from 'vitepress'

// 获取配置中的base路径
import { useData } from 'vitepress'

// 格式化日期函数
function formatDate(date: string | Date) {
  if (!date) return {
    time: 0,
    string: '1970-01-01'
  }
  
  const d = new Date(date)
  const time = d.getTime()
  const year = d.getFullYear()
  const month = ('0' + (d.getMonth() + 1)).slice(-2)
  const day = ('0' + d.getDate()).slice(-2)
  
  return {
    time,
    string: `${year}-${month}-${day}`
  }
}

interface Post {
  title: string
  url: string
  date: {
    time: number
    string: string
  }
  abstract: string
  tags: string[]
}

// 在配置文件中定义的基础路径
const BASE_URL = "/BemoDB/"

export default createContentLoader("posts/**/*.md", {
  transform(raw) {
    const postMap: Record<string, Post> = {}
    const yearMap: Record<string, string[]> = {}
    const tagMap: Record<string, string[]> = {}
    
    const posts = raw
      .filter(({ url }) => {
        // 排除index.md文件
        const fileName = url.split('/').pop()
        return fileName !== 'index.md' && fileName !== 'index.html'
      })
      .map(({ url, frontmatter }) => {
        // 如果没有frontmatter，则跳过该文章
        if (!frontmatter || Object.keys(frontmatter).length === 0) {
          return null
        }
        
        // 从URL路径中提取信息
        const urlParts = url.split("/")
        if (urlParts.length < 3) return null
        
        // 将顶级目录作为标签之一
        let tags = [urlParts[2]]
        
        // 合并frontmatter中的标签
        if (frontmatter?.tags) {
          tags = [...tags, ...frontmatter.tags]
        }
        
        // 确保标签没有重复
        tags = Array.from(new Set(tags))
        
        // 构建完整URL
        const fullUrl = BASE_URL + url.replace(/^\//, '')
        
        const result: Post = {
          title: frontmatter.title || url.split('/').pop()?.replace('.md', '') || '无标题',
          url: fullUrl,
          date: formatDate(frontmatter.date),
          abstract: frontmatter.abstract || '',
          tags,
        }
        
        postMap[fullUrl] = result
        return result
      })
      .filter((post): post is Post => post !== null)
      .sort((a, b) => b.date.time - a.date.time)
    
    // 按年份和标签组织文章
    posts.forEach((item) => {
      const year = new Date(item.date.string).getFullYear()
      
      // 按年份归档
      if (!yearMap[year]) {
        yearMap[year] = []
      }
      if (!yearMap[year].includes(item.url)) {
        yearMap[year].push(item.url)
      }
      
      // 按标签归档
      item.tags.forEach((tag) => {
        if (!tagMap[tag]) {
          tagMap[tag] = []
        }
        if (!tagMap[tag].includes(item.url)) {
          tagMap[tag].push(item.url)
        }
      })
    })
    
    return {
      yearMap,
      postMap,
      tagMap,
    }
  },
})
```

上面的代码看起来有点长，但它的核心目标是生成三个关键的数据结构：

1.  `postMap`：一个以文章 URL 为键（key）的对象，存储了每篇文章的详细信息（标题、日期、标签等）。
2.  `yearMap`：一个以年份为键的对象，存储了该年份下所有文章的 URL 列表。
3.  `tagMap`：一个以标签为键的对象，存储了带有该标签的所有文章的 URL 列表。

整个数据处理的流程大致是这样的：
- **过滤文件**：首先过滤掉像 `index.md` 这样的入口文件。
- **提取元数据**：然后从每篇 Markdown 的 frontmatter 中提取出标题、日期、标签等元数据。
- **自动标签**：为了方便，我们还把文章所在的目录名自动加到标签里，算是一种自动分类。
- **排序**：接着，所有文章会按照发布日期从新到旧排个序。
- **构建索引**：最后，根据处理好的数据，分别创建出按年份和按标签分组的索引。

## 归档页面实现

数据准备好了，接下来就是创建归档页面了。VitePress 的一个强大之处在于，我们可以在 Markdown 文件里直接写 Vue 组件。在 `docs/pages` 目录下，我们创建一个 `archives.md` 文件：

```markdown
---
layout: page
title: 归档
sidebar: false
---

<script setup>
import { computed, onMounted, ref } from 'vue'
import { data } from '../.vitepress/theme/posts.data'

const { yearMap, postMap } = data
const yearList = Object.keys(yearMap).sort((a, b) => b - a); // 按年份降序排序
const debugInfo = ref('')

// 计算文章总数
const totalPosts = computed(() => {
  let count = 0
  for(let year in yearMap) {
    count += yearMap[year].length
  }
  return count
})

// 计算每年的文章并确保能够正确加载
const computedYearMap = computed(() => {
  let result = {}
  for(let year in yearMap) {
    result[year] = yearMap[year].map(url => {
      const post = postMap[url]
      if (!post) {
        debugInfo.value += `找不到文章: ${url}\n`
      }
      return post
    }).filter(Boolean)
  }
  return result
})

onMounted(() => {
  console.log('Archive page mounted')
  console.log('Year list:', yearList)
  console.log('Total posts:', totalPosts.value)
  for(let year in computedYearMap.value) {
    console.log(`Year ${year}: ${computedYearMap.value[year].length} posts`)
  }
})
</script>

<div class="archives-container">
  <div v-for="year in yearList" :key="year" class="year-section">
    <div class="year-title">
      <span>{{ year }}</span>
      <span class="post-count">({{ computedYearMap[year].length }})</span>
    </div>
    <div class="posts-list">
      <div v-for="(article, index) in computedYearMap[year]" :key="index" class="post-item">
        <a v-text="article.title" :href="article.url" class="post-title"></a>
        <div v-text="article.date.string" class="post-date"></div>
      </div>
    </div>
  </div>
</div>

<style scoped>
.archives-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.debug-info {
  margin-bottom: 20px;
  padding: 10px;
  background: #fff4f4;
  color: #ff6b6b;
  border-radius: 4px;
  font-size: 0.9em;
  overflow: auto;
  max-height: 200px;
}

.year-section {
  margin-bottom: 30px;
}

.year-title {
  font-size: 1.5em;
  font-weight: bold;
  margin-bottom: 10px;
  color: var(--vp-c-brand);
  display: flex;
  align-items: center;
}

.post-count {
  font-size: 0.7em;
  color: var(--vp-c-text-2);
  margin-left: 8px;
}

.posts-list {
  margin-left: 20px;
}

.post-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px dashed var(--vp-c-divider);
}

.post-title {
  position: relative;
  padding-left: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 80%;
}

.post-title:before {
  content: "";
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--vp-c-brand);
  left: 0;
  top: 50%;
  transform: translateY(-50%);
}

.post-date {
  color:rgb(155, 155, 155);
  font-size: 0.9em;
}
</style>
```

这个归档页面的实现有几个关键点：

1.  **数据导入**：直接从我们刚刚创建的 `posts.data.ts` 中导入处理好的数据。
2.  **计算属性**：用 Vue 的 `computed` 属性来处理一些动态数据，比如文章总数，以及把文章 URL 列表转换成包含完整信息的文章对象列表。
3.  **年份排序**：对年份列表进行降序排序，这样最新的文章会显示在最前面。
4.  **调试信息**：为了方便调试，我们添加了一些简单的日志输出和页面提示，防止因为找不到文章而页面崩溃。
5.  **UI 渲染**：用简单的 `v-for` 循环来展示年份和对应的文章列表。
6.  **CSS 样式**：样式部分用的是 VitePress 的主题变量（如 `--vp-c-brand`），这样可以和网站的整体风格保持一致，还能自动适配深色/浅色模式。

## 标签页面实现

标签页面的思路和归档页很像，但多了些交互。当用户点击一个标签时，我们要筛选出对应的文章列表。同样，我们在 `docs/pages` 目录下创建 `tags.md` 文件：

```markdown
---
layout: page
title: 标签
sidebar: false
---

<script setup>
import { ref, unref, computed, onMounted } from 'vue'
import { data } from '../.vitepress/theme/posts.data'

const { tagMap, postMap } = data
const tags = Object.keys(tagMap)
const computedTagMap = computed(() => {
  let result = {}
  for(let key in tagMap) {
    result[key] = tagMap[key].map(url => postMap[url])
  }
  return result
})

const currentTag = ref(null)
function onTagClick(newTag) {
  currentTag.value = newTag
}
const postList = computed(() => (unref(computedTagMap)[unref(currentTag)]))
onMounted(() => {
  const searchParams = new URLSearchParams(window.location.search)
  if(searchParams.get('tag')) currentTag.value = searchParams.get('tag')
})
</script>

<div class="tags-container">
  <div class="tags-cloud">
    <div 
      v-for="(tag, i) in tags" 
      :key="i" 
      class="tag-item" 
      :class="{ active: currentTag === tag }"
      @click="onTagClick(tag)"
    >
      <span>{{ tag }}</span>
      <span class="tag-count">{{ computedTagMap[tag].length }}</span>
    </div>
  </div>
  
  <div v-if="currentTag" class="tag-posts">
    <h2 class="tag-title">{{ currentTag }}</h2>
    <div class="posts-list">
      <div v-for="(article, index) in postList" :key="index" class="post-item">
        <a v-text="article.title" :href="article.url" class="post-title"></a>
        <div v-text="article.date.string" class="post-date"></div>
      </div>
    </div>
  </div>
</div>

<style scoped>
.tags-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 30px;
}

.tag-item {
  display: inline-flex;
  align-items: center;
  padding: 5px 12px;
  background-color: var(--vp-c-bg-alt);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.tag-item:hover {
  color: var(--vp-c-brand);
}

.tag-item.active {
  background-color: var(--vp-c-brand);
  color: white;
}

.tag-count {
  margin-left: 5px;
  font-size: 0.8em;
  color: var(--vp-c-brand);
}

.tag-item.active .tag-count {
  color: white;
}

.tag-title {
  font-size: 1.5em;
  margin-bottom: 20px;
  color: var(--vp-c-brand);
}

.posts-list {
  margin-left: 20px;
}

.post-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px dashed var(--vp-c-divider);
}

.post-title {
  position: relative;
  padding-left: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 80%;
}

.post-title:before {
  content: "";
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--vp-c-brand);
  left: 0;
  top: 50%;
  transform: translateY(-50%);
}

.post-date {
  color: var(--vp-c-text-2);
  font-size: 0.9em;
}
</style>
```

标签页面的关键点在于交互：

1.  **状态管理**：用 `ref` 来创建一个响应式变量 `currentTag`，用来追踪用户当前点击的是哪个标签。
2.  **事件处理**：通过 `@click` 事件来更新 `currentTag` 的值。
3.  **URL 参数支持**：页面加载时会检查 URL 有没有带 `tag` 参数，这样就可以通过链接直接分享特定标签的列表。
4.  **条件渲染**：用 `v-if` 来控制，只有当用户选择了某个标签后，才显示对应的文章列表。
5.  **样式交互**：给当前选中的标签添加一个 `.active` 类，让用户清楚地知道自己选了哪个。

## 导航配置集成

万事俱备，只差临门一脚。我们最后需要在 VitePress 的配置文件里，把这两个页面的链接加到导航栏上。打开 `.vitepress/config.ts` 文件：

```typescript
// .vitepress/config.ts
export default {
  // ...其他配置
  themeConfig: {
    // ...其他主题配置
    nav: [
      { text: "主页", link: "/" },
      { text: "文档", link: "/doc" },
      { text: "导航", link: "/nav" },
      { text: "归档", link: "/pages/archives" },
      { text: "标签", link: "/pages/tags" },
    ],
    // ...其他配置
  },
}
```

加上这两行后，“归档”和“标签”就会出现在网站的导航栏里，方便访问了。

## 回顾一下技术细节

### 数据流架构

我们这个功能的实现，其实遵循了一个很清晰的单向数据流：

1.  数据源（Markdown 文件）→ 数据处理层（`posts.data.ts`）→ 视图层（归档页和标签页）

这种方式的好处是，数据流清晰，维护起来很方便。以后我们添加新文章，只要 frontmatter 格式写对，它就会自动出现在归档和标签页里，不需要额外做什么。

### Vue 3 组合式 API 的应用

我们还充分利用了 Vue 3 组合式 API 的优势：

1.  `ref` 和 `computed`：轻松管理响应式状态和派生数据。
2.  `onMounted`：处理组件挂载后的副作用，比如解析 URL 参数。
3.  `unref`：在需要时获取响应式对象的原始值。

### CSS 变量与主题集成

为了让我们的页面和 VitePress 的主题（比如浅色/深色模式切换）完美融合，我们大量使用了 VitePress 提供的 CSS 变量：

- `--vp-c-brand`：品牌颜色，用于强调元素
- `--vp-c-text-2`：次要文本颜色，用于日期等辅助信息
- `--vp-c-divider`：分割线颜色，用于列表项分隔
- `--vp-c-bg-alt`：替代背景色，用于标签背景

这确保了在主题切换时，我们的自定义页面也能正确地展示样式。

## 性能优化与扩展方向

### 性能优化策略

如果你的博客文章非常多，现在这种一次性加载所有数据的方式可能会有点慢。未来可以考虑一些性能优化：

1.  **分页加载**：对文章列表进行分页，避免单页加载过多内容。
2.  **虚拟滚动**：对于超长的文章列表，使用虚拟滚动技术只渲染可视区域的列表项。
3.  **数据缓存**：可以考虑将处理好的数据缓存在 localStorage 中，加快二次加载速度。

### 功能扩展方向

在这个基础上，我们还可以做很多有意思的扩展：

1.  **站内搜索**：集成一个轻量级的客户端搜索功能。
2.  **时间线视图**：将归档页面美化成更直观的时间线样式。
3.  **相关文章推荐**：根据文章的标签，在文章末尾推荐几篇相似的文章。
4.  **标签云增强**：根据标签下文章数量的不同，展示不同大小或颜色的标签。
5.  **阅读统计**：集成简单的阅读量统计，并展示热门文章。

## 总结

我们从头到尾走了一遍在 VitePress 中实现归档和标签功能的过程。核心就是利用 VitePress 的 `createContentLoader` API 来处理数据，再结合 Vue 3 强大的组合式 API 来渲染页面，最终打造出一个简单又高效的内容组织系统。

回顾一下，整个实现过程的关键点是：

1.  使用 `createContentLoader` 批量处理 Markdown 文件。
2.  构建清晰的数据索引结构（`yearMap` 和 `tagMap`）。
3.  在 Markdown 文件中直接使用 Vue 3 的组合式 API 来实现交互。
4.  通过 CSS 变量无缝集成 VitePress 主题系统。

通过这种方式，我们的博客不仅在功能上更完善，用户体验更好，而且整个实现过程也保持了 VitePress 轻量、灵活的特点。这个模块化、可扩展的设计思路，也为我们将来给博客添加更多好玩的功能打下了坚实的基础。
