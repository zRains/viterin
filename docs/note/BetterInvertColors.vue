<template>
  <div class="BetterInvertColors">
    <div class="invertSwitch">
      <div class="tip">开启反色：</div>
      <div :class="{ switcher: true, active: isInvert }" @click="isInvert = !isInvert"><span>Toggle</span></div>
    </div>
    <ul class="colorContainer">
      <li v-for="color in colors" :key="color" class="colorItem">
        <div :class="{ colorPreview: true, invert: isInvert }" :style="{ backgroundColor: color }"></div>
        <div class="colorValue">{{ color }}</div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isInvert = ref(false)

const colors = ['#603DC5', '#d63031']
</script>

<style lang="scss">
.BetterInvertColors {
  .invertSwitch {
    .tip {
      display: inline-block;
    }

    .switcher {
      display: inline-block;

      span {
        cursor: pointer;
        text-indent: -9999px;
        width: 45px;
        height: 25px;
        background-color: var(--c-divider-light);
        display: block;
        border-radius: 100px;
        position: relative;
        border: 1px solid var(--c-divider-light);
        transition: background-color 0.2s;
      }

      span:after {
        content: '';
        position: absolute;
        top: 1.5px;
        left: 1.5px;
        width: 20px;
        height: 20px;
        background: #fff;
        border-radius: 90px;
        transition: 0.2s;
      }

      &.active {
        span {
          background: var(--c-brand);

          &::after {
            left: calc(100% - 1.5px);
            transform: translateX(-100%);
          }
        }
      }

      span:active:after {
        width: 25px;
      }
    }
  }

  .colorContainer {
    margin: 0;
    padding: 0;
    margin-top: 16px;

    .colorItem {
      display: inline-flex;
      align-items: center;
      margin: 0 16px 0 0;
      list-style: none;

      .colorPreview {
        margin-right: 4px;
        height: 21.6px;
        width: 21.6px;
        border: 1.2px solid var(--c-divider-light);
        filter: invert(0);
        transition: filter 0.2s;

        &.invert {
          filter: invert(1);
        }
      }

      .colorValue {
        line-height: 24px;
      }
    }
  }
}
</style>
