<template>
  <i data-bs-toggle="tooltip" data-bs-placement="top" :title="$t('tooltips.ready')">
    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
      x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24" enable-background="new 0 0 24 24"
      xml:space="preserve">
      <image id="image0" :width="size" :height="size" x="0" y="0" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAABGdBTUEAALGPC/xhBQAAACBjSFJN
AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAilBMVEUAAAAAbKEAd7EAd7EA
d7EAcKcAdq8AZZYAdK0AcKYAZJX7AAD+AAD9AAAAcKb+AAD+AAD+AAAHZJU9WYXSAAD/AAD9AABD
V4HwAAD+AAD+AAD9AAARY5T+AAD+AAD9AAD+AAD9AADqAAD+AADwAAD2AAD3AAD9AAAAeLIAd7AA
Z5kAeLL/AAD////5kR/WAAAAK3RSTlMAAXbl/gFNKU0qKRTCOynQ/vEpKQP+dCkHtHt6KbV6FM97
B+YSFBRk/k0BcmBQcQAAAAFiS0dELc3aQT0AAAAHdElNRQfjCRMIEAxe31ZOAAAAxklEQVQoz3WS
CRKCMAxFQ4u4ILQuKLgBKojS+5/PtFbsghk608lLPv2ZQEBo6AUlEyB92OsPz3AnQMcBBWyMpk7M
MAnI5+DEApMuiJeJBtiVGnnGVwmsPamYCYFkY0htdT2CbLf/SeXFQeVlHOE0SOVnwS9lxQUXWW38
/FrIypuqr+Vzvx33CqWFPKhj+WjYB0gd22DLFKgN59pgU6n3aGAabJjW8WbVPuwh2rMakfLG3vXh
M3UikmBkFdQ6/F+GF6GdBygJ3l3LIUNqkTpDAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE5LTA5LTE5
VDA4OjE2OjEyKzAzOjAwj5+H/AAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOS0wOS0xOVQwODoxNjox
MiswMzowMP7CP0AAAAAASUVORK5CYII=" />
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
