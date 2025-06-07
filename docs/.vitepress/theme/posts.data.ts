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
        // 只使用顶级目录作为标签，忽略子文件夹
        const urlParts = url.split("/")
        if (urlParts.length < 3) return null // 不符合预期的URL格式
        
        // 顶级目录作为标签
        let tags = [urlParts[2]]
        
        // 如果frontmatter中有标签，则合并
        if (frontmatter?.tags) {
          tags = [...tags, ...frontmatter.tags]
        }
        
        // 确保标签没有重复
        tags = Array.from(new Set(tags))
        
        // 确保URL包含正确的基础路径前缀
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
      .filter((post): post is Post => post !== null) // 过滤掉不符合条件的文章
      .sort((a, b) => b.date.time - a.date.time)
    
    // 按年份归档
    posts.forEach((item) => {
      const year = new Date(item.date.string).getFullYear()
      if (!yearMap[year]) {
        yearMap[year] = []
      }
      
      // 确保每篇文章只添加一次
      if (!yearMap[year].includes(item.url)) {
        yearMap[year].push(item.url)
      }
      
      // 按标签归档
      item.tags.forEach((tag) => {
        if (!tagMap[tag]) {
          tagMap[tag] = []
        }
        
        // 确保每个标签下每篇文章只添加一次
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