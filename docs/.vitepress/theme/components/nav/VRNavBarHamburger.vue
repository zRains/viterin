<template>
  <VRSwitch class="VRNavBarHamburger" :on-toggle="toggleScreen" :init-status="isScreenOpen">
    <template #default="{ status }">
      <svg :class="{ hamburger: true, isActivated: status }" viewBox="0 0 100 100" height="35" width="35">
        <path
          class="line top"
          d="m 30,33 h 40 c 0,0 9.044436,-0.654587 9.044436,-8.508902 0,-7.854315 -8.024349,-11.958003 -14.89975,-10.85914 -6.875401,1.098863 -13.637059,4.171617 -13.637059,16.368042 v 40"
        />
        <path class="line middle" d="m 30,50 h 40" />
        <path
          class="line bottom"
          d="m 30,67 h 40 c 12.796276,0 15.357889,-11.717785 15.357889,-26.851538 0,-15.133752 -4.786586,-27.274118 -16.667516,-27.274118 -11.88093,0 -18.499247,6.994427 -18.435284,17.125656 l 0.252538,40"
        />
      </svg>
    </template>
  </VRSwitch>
</template>

<script setup lang="ts">
import VRSwitch from '../VRSwitch.vue'
import { toggleScreen, isScreenOpen } from '../../composables/nav'
</script>

<style lang="scss">
@import '../../styles/vars.scss';

.VRNavBarHamburger {
  display: flex;
  align-items: center;
  height: $nav-height-mobile;
  width: 35px;

  .hamburger {
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: transform 400ms;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;

    .top {
      stroke-dasharray: 40 139;
    }

    .bottom {
      stroke-dasharray: 40 180;
    }

    &.isActivated {
      transform: rotate(45deg);

      .top {
        stroke-dashoffset: -98px;
      }

      .bottom {
        stroke-dashoffset: -138px;
      }
    }

    path {
      fill: none;
      transition: stroke-dasharray 400ms, stroke-dashoffset 400ms;
      stroke: var(--c-text-1);
      stroke-width: 5.5;
      stroke-linecap: round;
    }

    &:hover .line {
      stroke: var(--c-brand);
    }
  }
}

// 移动端适配
@media (min-width: 768px) {
  .VRNavBarHamburger {
    display: none;
  }
}

// 适配移动端
@media only screen and (min-width: $b-md) {
  .VRNavBarHamburger {
    display: none;
  }
}
</style>
