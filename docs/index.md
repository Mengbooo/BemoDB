---
layout: home

hero:
  name: Bolaxious 的文档库
  text: Bolaxious's documentation library
  tagline: 技术 & 生活
  image:
    src: /cat.png
    alt: 小猫跑了
  actions:
    - theme: brand
      text: Get Started
      link: /bigFrontEnd/html/
    - theme: alt
      text: View on GitHub
      link: https://github.com/vuejs/vitepress
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