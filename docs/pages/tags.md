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