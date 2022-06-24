<template>
  <div class="FileReaderMethods">
    <section class="inputSec">
      <span>输入</span><input v-model="inputVal" type="text" maxlength="10" /><span>以构造Blob对象 🙌</span>
    </section>
    <section class="resultSec">
      <div class="readAsText">readAsText=> {{ textRef }}</div>
      <div class="readAsArrayBuffer">readAsArrayBuffer=> {{ arrayBufferRef }}</div>
      <div class="readAsDataURL">readAsDataURL=> {{ dataURLRef }}</div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

const inputVal = ref('')
const textRef = ref('')
const arrayBufferRef = ref('[]')
const dataURLRef = ref('data:')
watch(inputVal, (n) => {
  const blob = new Blob([n])
  const textReader = new FileReader()
  const arrayBufferReader = new FileReader()
  const dataURLReader = new FileReader()
  textReader.readAsText(blob)
  textReader.onload = function () {
    textRef.value = this.result as string
  }
  arrayBufferReader.readAsArrayBuffer(blob)
  arrayBufferReader.onload = function () {
    arrayBufferRef.value = JSON.stringify(Array.from(new Uint8Array(this.result as ArrayBuffer)))
  }
  dataURLReader.readAsDataURL(blob)
  dataURLReader.onload = function () {
    dataURLRef.value = this.result as string
  }
})
</script>

<style lang="scss">
.FileReaderMethods {
  padding: 10px;
  margin-bottom: 16px;
  border: 2.5px dotted var(--c-divider);
  background: var(--c-bg-mute);
  transition: border-color 0.2s ease, background-color 0.2s ease;

  .inputSec {
    margin-bottom: 10px;
    input {
      margin: 0 10px;
      padding: 5px 10px;
      width: 15ch;
      outline: none;
      border: 2.5px solid var(--c-divider);
      font-family: Merriweather;
    }
  }

  .resultSec {
    .readAsText,
    .readAsArrayBuffer {
      margin-bottom: 10px;
    }
  }
}
</style>
