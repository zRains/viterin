<template>
  <div class="BookMark">
    <a class="title" :href="link" target="_blank" ref="noreferrer">{{ title }}</a>
    <div class="desc">{{ desc }}</div>
    <div class="footer">
      <img :src="refIcon" alt="ref-icon" />
      <span class="author">{{ author }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  link: string
  title: string
  desc: string
  refIcon: string
  author: string
}>()
</script>

<style lang="scss">
@import '../../styles/vars.scss';

.BookMark {
  padding: 12px;
  background-color: var(--c-bg-mute);
  transition: background-color $u-duration ease;

  .title {
    display: block;
    margin-bottom: 5px;
    color: var(--c-brand);
    font-size: 1.05em;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  .desc {
    margin-bottom: 10px;
    color: var(--c-text-2);
  }

  .footer {
    display: flex;
    font-size: 0.9em;

    img {
      height: 18px;
      margin-right: 8px;
    }

    span {
      line-height: 18px;
    }
  }
}
</style>
