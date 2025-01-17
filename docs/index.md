---
layout: home

hero:
  name: Bolaxious 的文档库
  text: Bolaxious's documentation library
  tagline: 技术 & 生活
  image:
    src: cat.png
    alt: 小猫跑了
  actions:
    - theme: brand
      text: 关于
      link: /about
    - theme: alt
      text: Github
      link: https://github.com/mengbooo
features:
  - icon: 🛠️
    title: Simple and minimal, always
    details: Lorem ipsum...
    link: /guide/start
    linkText: 了解更多
  - icon: ⚡️
    title: Another cool feature
    details: Lorem ipsum...
  - icon: 🌞
    title: Another cool feature
    details: Lorem ipsum...
---
<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #4ad07d 30%, #3370ff);

  --vp-home-hero-image-background-image: linear-gradient(-45deg, #4ad07d 50%, #3370ff 50%);
  --vp-home-hero-image-filter: blur(44px);
}

@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(56px);
  }
}

@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(68px);
  }
}
</style>
