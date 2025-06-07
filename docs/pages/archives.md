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
    }).filter(Boolean) // 过滤掉null或undefined
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