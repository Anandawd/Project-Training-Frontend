<template>
  <i data-bs-toggle="tooltip" data-bs-placement="top" :title="$t('tooltips.officeUse')">
    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
      x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24" enable-background="new 0 0 24 24"
      xml:space="preserve">
      <image id="image0" :width="size" :height="size" x="0" y="0" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAABGdBTUEAALGPC/xhBQAAACBjSFJN
AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABVlBMVEUAAADJMzfTWl3QTVHK
NjrJMzfJMzeDISPLOj7+/v7uwMHNQkXJMzeHIiTMPkHwycrz1NX01NX01dX01dbyz9DqrrDKNDjJ
MzfJMze5LzOaJyqZJyr01tbJMzfJMzf01te8LzN/ICOBICPJMjfJMzfJMzfKMzemKi7JMTfJMzfL
MzfcMjbiMjbgMjbkMjbsMTbhMTbiMjbqMTbpMDXWMjbsMTbsMTb019fYMzfzfYDyc3bsMTbcYGP2
pqj+9PT2o6X019jcX2L3qqz4tbf5wcP71tf+9PX2p6nik5X0gYTzd3r+/f3ikZTYMjbJMzfSU1fN
QUTZMjbBKSynIibsMTbsMTbsMTb+/Pz9+Pn23t7no6TfhYfXaGvKNDj////YbG/++/vtMjftOj/u
RUrwWFz2pqj3sbP5vsD71db+/f345OTtO0DuRkvwWl734uLturvYaWzNQkbz9ik9AAAAV3RSTlMA
tuDg4ODLBPL+/v7+D/L+/v7+/v7+/quUNjAo/rSN/ksZGYXRk/02ds/RjIKSgnCSgHA6kf7r/pT+
/vSV/v73/pX+/v7+/vf+/v7+/pSjy8uBNRLW8azrWW/GAAAAAWJLR0ReBNZhuwAAAAd0SU1FB+MK
HREmAR36LpoAAAD8SURBVCjPY2BkYmZhhQM2dgYY4AjnjIjkioqO4Y7liY3l4YVL8MVxxoFQHD+6
BCcUCPCAABYdAriMEsRllBAuo4RxGSWMwyhhERxGxYvG8oiJS0hKAYE0skSCTCyPLBvINCCSQ3aV
PA+PBI+CIhAoKasgWy4fy6Oqpg42XkMTRYeWto6unj4IGBgaGSPpMDFNTIQjM4SEuYVpYpJlMlA0
xSox0RpJwsY2NY0zPdU2NcMuNdUeYYeDo5OTM6eLk5OTq5uTkztMR2aWB9CobM8coFG5XiCjOBK8
8/J9CgpjeXyRLbdm8PMPYIOAQFMkYM2AAEGoOhAgOCQUAcIAbtxdb3wqclgAAAAldEVYdGRhdGU6
Y3JlYXRlADIwMTktMTAtMjlUMTc6Mzg6MDErMDM6MDBmud3RAAAAJXRFWHRkYXRlOm1vZGlmeQAy
MDE5LTEwLTI5VDE3OjM4OjAxKzAzOjAwF+RlbQAAAABJRU5ErkJggg==" />
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
