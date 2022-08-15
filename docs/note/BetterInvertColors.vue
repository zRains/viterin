<template>
  <div class="BetterInvertColors"><input type="checkbox" id="switch" /><label for="switch">Toggle</label></div>
</template>

<script setup lang="ts">
const colors = ['#603DC5']
</script>

<style lang="scss">
.BetterInvertColors {
  input[type='checkbox'] {
    height: 0;
    width: 0;
    visibility: hidden;
  }

  label {
    cursor: pointer;
    text-indent: -9999px;
    width: 45px;
    height: 25px;
    background: grey;
    display: block;
    border-radius: 100px;
    position: relative;
    border: 1px solid var(--c-divider-light);
  }

  label:after {
    content: '';
    position: absolute;
    top: 1.5px;
    left: 1.5px;
    width: 20px;
    height: 20px;
    background: #fff;
    border-radius: 90px;
    transition: 0.3s;
  }

  input:checked + label {
    background: #bada55;
  }

  input:checked + label:after {
    left: calc(100% - 1.5px);
    transform: translateX(-100%);
  }

  label:active:after {
    width: 30px;
  }
}
</style>
