<template>
  <i data-bs-toggle="tooltip" data-bs-placement="top" :title="$t('tooltips.modifyRoomStatus')">
    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
      x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24" enable-background="new 0 0 24 24"
      xml:space="preserve">
      <image id="image0" :width="size" :height="size" x="0" y="0" xlink:href="data:image/png;base64,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" />
    </svg>
  </i>
</template>
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    size: {
      type: [String, Number],
      default: '24'
    }
  }
})
</script>
