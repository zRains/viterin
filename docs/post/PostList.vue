<template>
  <ul class="PostList">
    <li v-for="page in postFiles" :key="page.link">
      <a class="post" :href="page.link">
        <div class="title">{{ page.title || '无标题' }}</div>
        <div class="utils">
          <RelativeTime class="ctime" :time="page.date" />
          <div class="scope">
            {{ page.scope?.join(' / ') }}
          </div>
          <div class="tags">
            <div v-if="+new Date() - page.date <= 8e7" class="tag isCurrentUpdate"><Icon icon="dashicons:update-alt" />更改</div>
            <div v-if="page.draft" class="tag isDraft"><Icon icon="charm:git-request-draft" />草稿</div>
          </div>
        </div>
      </a>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import files from '../.vitepress/fileData.json'

const postFiles = files.filter((file) => file.link.startsWith('/post')).sort((f1, f2) => f2.date - f1.date)
</script>

<style lang="scss" scoped>
.PostList {
  margin: 0;
  padding: 0;

  li {
    list-style: none;
    &:not(:last-child) {
      margin-bottom: 20px;
    }
  }

  .post {
    display: block;
    text-decoration: none;
    color: inherit;

    .title {
      display: inline-block;
      font-weight: 600;
      font-size: 1.1rem;
      line-height: 30px;
      color: var(--c-text-1);
      transition: color 0.2s ease;
    }

    .utils {
      display: flex;
      align-items: center;
      font-size: 0.9rem;
      line-height: 20px;
      color: var(--c-text-2);
      transition: color 0.2s ease;

      .tags {
        user-select: none;

        .tag {
          display: inline-flex;
          align-items: center;
          line-height: 20px;
          height: 20px;
          padding: 0 5px;
          font-size: inherit;
          color: var(--c-text-2);
          transition: background-color 0.2s ease;
        }

        .isCurrentUpdate {
          background-color: var(--c-brand);
        }

        .isDraft {
          background-color: var(--c-bg-mute);
        }
      }

      :is(&, .tags) > *:not(:last-child) {
        margin-right: 15px;
      }
    }

    &:hover {
      .title {
        color: var(--c-brand);
      }
    }
  }
}
</style>
