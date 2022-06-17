<template>
  <div class="VRFriends">
    <ul>
      <li v-for="friend in theme.friendLinks" :key="friend.name">
        <div class="avatarBox">
          <a
            class="avatar"
            :href="friend.link"
            target="_blank"
            :style="{ backgroundImage: `url('${friend.avatar}')` }"
            rel="noreferrer"
          ></a>
        </div>
        <div class="desc">
          <a class="name" :href="friend.link" target="_blank" rel="noreferrer">{{ friend.name }}</a>
          <div class="tk">{{ friend.desc }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import type { VRThemeConfig } from '../types/theme'
import { useData } from 'vitepress'

const { theme } = useData<VRThemeConfig>()
</script>

<style lang="scss" scoped>
@import '../styles/vars.scss';

@mixin rect($s: 10px, $r: 3px, $c: #fff) {
  height: $s;
  width: $s;
  border-radius: $r;
  background-color: $c;
}

@mixin circle($s: 10px, $c: #fff) {
  height: $s;
  width: $s;
  border-radius: 50%;
  background-color: $c;
}

.VRFriends {
  position: relative;
  width: 100%;

  ul {
    margin: 0;
    padding: 0;

    li {
      list-style: none;
      display: flex;
      align-items: center;

      .avatarBox {
        user-select: none;
        height: 40px;
        text-align: center;

        .avatar {
          cursor: pointer;
          display: block;
          position: relative;
          height: inherit;
          width: 40px;
          image-rendering: -moz-crisp-edges;
          image-rendering: -o-crisp-edges;
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
          background-size: cover;
          margin-right: 10px;

          &::after {
            position: absolute;
            content: 'GO';
            left: -1px;
            right: -1px;
            top: -1px;
            bottom: -1px;
            line-height: 40px;
            color: #f3f3f3;
            background-color: rgba($color: #000000, $alpha: 0.7);
            z-index: 2;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s;
            font-size: 14px;
            font-weight: 600;
          }

          &:hover::after {
            opacity: 1;
            visibility: visible;
          }
        }
      }

      .desc {
        .name {
          display: inline-block;
          cursor: pointer;
          text-decoration: none;
          font-weight: 600;
          color: var(--c-text-1);
          margin-bottom: 5px;
          transition: color $u-duration ease;

          &:hover {
            text-decoration: underline;
            color: var(--c-brand);
          }
        }

        .tk {
          font-size: 14px;
        }
      }

      &:not(:last-child) {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
