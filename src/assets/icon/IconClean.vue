<template>
  <i data-bs-toggle="tooltip" data-bs-placement="top" :title="$t('tooltips.clean')">
    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
      x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24" enable-background="new 0 0 24 24"
      xml:space="preserve">
      <image id="image0" :width="size" :height="size" x="0" y="0" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAABGdBTUEAALGPC/xhBQAAACBjSFJN
    AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAA9lBMVEUrrysrrysrrysssCwr
    rysrrysusS5MvEwwsTDH6cfQ7NAzsjOW15bM68zV7tXj9OOn3aeo3qg1szXi8+L9/f2J0omq36qx
    4bG75buK04o6tTpuyG6z4rP4+/jl9OWY2JhLu0susC51y3X3+/fB58E4tDhyynJtyG0sryz7/fvh
    8+HA58A/tz9xyXErrysssCwrrysrrysssCwvsS8xsjFXwFdgw2A2szZlxWX+/v5syGx7zXs/tz/9
    /f09tj0wsTD4+/hkxWRHukdRvVFGuUbH6cf4/PgusS5fw1+95r18znw1szXQ7dAzsjO147VOvE5U
    v1T///9I1VHvAAAAMnRSTlO+9LL+/vH+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+
    /v7+/v7+xfv7uCtJcSUAAAABYktHRFGUaXwqAAAAB3RJTUUH4wkTCAsbdDoYEwAAAMJJREFUKM9j
    YGDECpgYmI1YjEAIiCEMCGLFLcGCHWDoMDbBYhQbkDA1w2IUOwsLBycXN4ZR5jwmFryWlnxWJmhG
    WfMb2wjY2graoRklJCwiysIsJs6MZpS9hKWIgyOLkzOaq1xcRSxFLN0k7d2RXSUlLSMrAgFy8gqK
    SEaxeXjagnRYynl5o/mDWUkZqF5FFUuQqNmK+PiqYwldDT9Nfw8tFyzBHqBtZKSDLdiZdXEFuxR1
    YxChQ0/fQB+EgBjCgCBDAHYxPCVUSh4WAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE5LTA5LTE5VDA4
    OjExOjI3KzAzOjAwsfS0wQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOS0wOS0xOVQwODoxMToyNysw
    MzowMMCpDH0AAAAASUVORK5CYII=" />
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

