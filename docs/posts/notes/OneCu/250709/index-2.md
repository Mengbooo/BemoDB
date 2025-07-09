---
title: '一卒#007 | Vitepress 添加归档和标签功能的实现过程'
date: '2025-07-09'
tags:

- BemoNote
- Vitepress

---
# 一卒#007 | Vitepress 添加归档和标签功能的实现过程

在使用 VitePress 构建个人博客的过程中，归档和标签功能是非常实用的内容组织方式，可以帮助读者更好地浏览和检索文章。然而，VitePress 默认并没有提供这些功能。本文将详细记录如何在 VitePress 中实现归档和标签功能的过程。

## 功能需求分析与实现架构

本文实现的归档和标签功能基于以下核心需求：

1. 归档功能：基于文章发布时间（年份）进行分类展示
2. 标签功能：基于文章元数据中的标签属性进行分类，支持标签筛选
3. 数据源：从 Markdown 文件的 frontmatter 中提取元数据
4. 用户界面：提供符合 VitePress 风格的交互界面

实现架构分为三个核心模块：

1. 数据处理层：负责文章数据的收集、处理和组织
2. 页面渲染层：负责归档页和标签页的界面实现
3. 路由配置层：负责在导航系统中集成入口点

## 数据处理层实现

数据处理层利用 VitePress 提供的 `createContentLoader` API 实现。该 API 允许批量加载和处理指定目录下的 Markdown 文件，是实现归档和标签功能的基础。

在项目的 `.vitepress/theme` 目录下，创建 `posts.data.ts` 文件：

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

上述代码实现了三个核心数据结构：

1. `postMap`：键值对结构，以 URL 为键，存储文章的完整元数据
2. `yearMap`：键值对结构，以年份为键，存储该年份下所有文章的 URL 列表
3. `tagMap`：键值对结构，以标签为键，存储包含该标签的所有文章的 URL 列表

数据处理流程包括：
- 过滤无效文件（如索引文件）
- 提取文章元数据（标题、日期、标签等）
- 自动从 URL 路径提取分类信息作为标签补充
- 对文章按发布日期进行降序排序
- 构建年份索引和标签索引

## 归档页面实现

归档页面基于 Vue 组件实现，利用 Vue 的响应式系统处理数据并渲染 UI。在 `docs/pages` 目录下，创建 `archives.md` 文件：

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

归档页面的实现要点：

1. **数据导入与处理**：通过导入 `posts.data.ts` 获取文章数据
2. **计算属性**：使用 Vue 的 `computed` 属性计算派生数据
   - `totalPosts`：计算文章总数
   - `computedYearMap`：将 URL 映射到完整的文章对象
3. **年份排序**：对年份进行降序排列，确保最新年份显示在前
4. **错误处理**：添加调试信息，处理可能的数据不一致问题
5. **UI 结构**：使用嵌套结构展示年份和文章列表
6. **CSS 样式**：使用 VitePress 主题变量确保与整体设计一致

## 标签页面实现

标签页面在归档页面的基础上增加了交互功能。在 `docs/pages` 目录下，创建 `tags.md` 文件：

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

标签页面的实现要点：

1. **状态管理**：使用 `ref` 创建响应式状态 `currentTag` 跟踪当前选中的标签
2. **事件处理**：实现 `onTagClick` 函数处理标签点击事件
3. **URL 参数支持**：通过 `URLSearchParams` 解析 URL 参数，支持直接通过 URL 定位到特定标签
4. **条件渲染**：使用 `v-if` 指令条件性显示选中标签的文章列表
5. **样式交互**：实现标签的悬停和激活状态样式

## 导航配置集成

最后，需要在 VitePress 配置文件中添加导航链接，集成归档和标签页面。修改 `.vitepress/config.ts` 文件：

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

这样配置后，归档和标签页面将作为顶级导航项出现在网站导航栏中，用户可以直接访问这些功能。

## 技术要点分析

### 数据流架构

本实现采用了单向数据流架构：

1. 数据源（Markdown 文件）→ 数据处理层（`posts.data.ts`）→ 视图层（归档页和标签页）

这种架构确保了数据的一致性和可维护性。当添加新文章时，只需遵循相同的 frontmatter 格式，系统会自动将其纳入归档和标签系统。

### Vue 3 组合式 API 的应用

本实现充分利用了 Vue 3 的组合式 API：

1. `ref` 和 `computed`：管理响应式状态和计算派生数据
2. `onMounted`：处理组件生命周期相关逻辑
3. `unref`：在计算属性中安全地访问响应式引用

### CSS 变量与主题集成

为了确保与 VitePress 主题系统的无缝集成，本实现使用了 VitePress 提供的 CSS 变量：

- `--vp-c-brand`：品牌颜色，用于强调元素
- `--vp-c-text-2`：次要文本颜色，用于日期等辅助信息
- `--vp-c-divider`：分割线颜色，用于列表项分隔
- `--vp-c-bg-alt`：替代背景色，用于标签背景

这确保了在主题切换（如深色模式/浅色模式）时，自定义页面也能正确适应。

## 性能优化与扩展方向

### 性能优化策略

对于大型博客站点，可考虑以下性能优化措施：

1. **分页加载**：对大量文章实现分页机制，避免一次加载过多内容
2. **虚拟滚动**：对长列表实现虚拟滚动，只渲染可视区域的内容
3. **延迟加载**：非首屏内容采用延迟加载策略
4. **数据缓存**：利用 localStorage 缓存处理后的文章数据

### 功能扩展方向

本实现可进一步扩展以下功能：

1. **搜索功能**：集成全文搜索能力
2. **时间线视图**：提供按时间线展示文章的视图
3. **相关文章推荐**：基于标签相似度推荐相关文章
4. **标签关系图**：可视化展示标签之间的关联关系
5. **阅读统计**：集成阅读量统计和热门文章展示

## 总结

本文详细介绍了在 VitePress 中实现归档和标签功能的完整过程。通过利用 VitePress 的 `createContentLoader` API 和 Vue 3 的组合式 API，成功构建了一个高效、可扩展的内容组织系统。

实现过程中的关键技术点包括：

1. 使用 `createContentLoader` 批量处理 Markdown 文件
2. 构建高效的数据索引结构（年份索引和标签索引）
3. 利用 Vue 3 的响应式系统实现交互式 UI
4. 通过 CSS 变量确保与 VitePress 主题系统的一致性

这种实现方式不仅提升了博客的内容组织和用户体验，还保持了与 VitePress 轻量级特性的一致性。通过这种模块化、可扩展的架构设计，可以在 VitePress 的基础上构建更加强大的静态博客系统。
