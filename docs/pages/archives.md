---
layout: page
title: 归档
sidebar: false
---

<script setup>
import { computed } from 'vue'
import { data } from '../.vitepress/theme/posts.data'

const { yearMap, postMap } = data
const yearList = Object.keys(yearMap).sort((a, b) => b - a); // 按年份降序排序
const computedYearMap = computed(() => {
  let result = {}
  for(let key in yearMap) {
    result[key] = yearMap[key].map(url => postMap[url])
  }
  return result
})
</script>

<div class="archives-container">
  <div v-for="year in yearList" :key="year" class="year-section">
    <div v-text="year" class="year-title"></div>
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

.year-section {
  margin-bottom: 30px;
}

.year-title {
  font-size: 1.5em;
  font-weight: bold;
  margin-bottom: 10px;
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