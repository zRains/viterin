<template>
  <div class="BlobViewImg">
    <img ref="imgRef" src="https://zrain.fun/images/avatar.png" alt="blobViewImg" />
    <label for="uploadImg">
      <span>{{ uploadBanner }}</span>
      <input id="uploadImg" ref="imgInput" type="file" />
    </label>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'

const uploadBanner = ref('替换新的图片')
const imgRef = ref<HTMLImageElement>()
const imgInput = ref<HTMLInputElement>()

onMounted(() => {
  imgInput.value!.addEventListener('input', function () {
    const file = this.files![0]
    if (file && /^image\/(png|jpeg|svg|jpg)$/.test(file.type)) {
      const blobURL = window.URL.createObjectURL(file)
      imgRef.value!.src = blobURL
      imgRef.value!.onload = function () {
        uploadBanner.value = '替换新的图片'
        window.URL.revokeObjectURL(blobURL)
      }
    } else uploadBanner.value = '无效媒体文件！仅支持png/jpeg/svg/jpg格式文件，重新上传'
  })
})
</script>

<style lang="scss">
.BlobViewImg {
  display: flex;
  align-items: center;
  height: 150px;
  margin-bottom: 16px;
  padding: 10px;
  border: 2.5px dotted var(--c-divider);
  background-color: var(--c-bg-mute);
  transition: border-color 0.2s ease, background-color 0.2s ease;

  img {
    height: 100%;
    max-width: 60%;
  }

  label[for='uploadImg'] {
    display: block;
    margin-left: 20px;

    span {
      font-weight: bold;
      cursor: pointer;
      transition: color 0.2s ease;

      &:hover {
        color: var(--c-brand);
        text-decoration: underline;
      }
    }

    input {
      display: none;
    }
  }
}
</style>
