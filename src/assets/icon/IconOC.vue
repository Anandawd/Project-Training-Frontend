<template>
  <i data-bs-toggle="tooltip" data-bs-placement="top" :title="$t('tooltips.occupiedClean')">
    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
      x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24" enable-background="new 0 0 24 24"
      xml:space="preserve">
      <image id="image0" :width="size" :height="size" x="0" y="0" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAABGdBTUEAALGPC/xhBQAAACBjSFJN
AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABm1BMVEUAAADwAAD7AAD7AAD2
AAD7AAD7AAD7AAD7AAD8AAD6AAD6AAD7AAD7AAD6AAD7AAD6AAD6AAD7AAD7AAD6AAD6AAD7AAD7
AAD6AAD6AAD7AAD7AAD2AAD7AAD7AAD6AADxAAD7AAD7AAD3AADpAAD7AAC1Jjr7AADxAAD7AAD4
AQJKYZIAic8Dh8ydM038GRn9z8/8CQn7AAD7AAD1AwX8IyP9tLT6AAD7AADhDhX9mpr99/f7AAD7
AAD7AAD7AAD6Cgr8RUX8AAD6AADYAACEQWIGhsodebfHNkX9p6f8Bwf9eXntAADSAADrCQ399PTr
AAAYfLsVfr5Ho9XkDBNkU30Ais+9IjP8Ly/9v7/8JCT8CwsQgMLBHy/qAADRAAD7AAD7AAD7AADp
AAD8AAD5AQGXN1PUFSD8LS2rLEIAitAPgcP9y8v+/v78FRWHP1/8Fxf+/Pz9hIT8DQ3CHy8Aic8i
d7P8Z2f++vrTFSH3BQf9fX38UVH8CQmkMEgVfr4pc638CgpkU338ERH9l5duTXUQgML8AwP////c
ohwsAAAAZHRSTlMAA5eWA5X+lHv+eWD9X0n5SDXz8jQk6egjFtvaDMrJCwW1tAUBnv6dAYT+/v7+
/v7+/oNp/v7+aOz+/v7qP2x//v5+PiH+/v7+/v7+ICH+/iD+/v7+/v7+/v7+/v7+IAi617kHgtpl
ggAAAAFiS0dEiGtmFloAAAAHdElNRQfjCh0RJSxzCCEsAAABNElEQVQoz21QhVYDMRAMthAoFIfi
rsHdWtylaHFd7KC426Hlt9nc0RLazru8dzuzM7sJYz6EhIaFs2CIQIgMxkdxBB4dyMdYgGCJ9efj
rIgICNb4/3xCIpgCJiWrfEoq+JCW/sfbMmS36UDItHn5rGxQBczJNfm8fFDA6RQUSr6oWHbtluzt
G44DaSotI6Fc9lVUClFVTT81tXWyrmesgcuWQ01o2lEjNh27m0/Ix1tYqzHwVApa21n7ubvj4pKY
TtZld5BwdU3CTTfC7V0Plb32PhrSL0MHBsXQ8Mgo8DFZjRvrThiXmLx/eJx6AnyWyc5f4WVa12d0
XZ99ncM3RYB5YWJBuBaXlinK63inyXIrobk+PleUqK9Vj4c+Omv4rUYFwKlspbwuwrohbGxu+WF7
h7EfbnpeHZMLg5kAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTktMTAtMjlUMTc6Mzc6NDQrMDM6MDBB
wKcBAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE5LTEwLTI5VDE3OjM3OjQ0KzAzOjAwMJ0fvQAAAABJ
RU5ErkJggg==" />
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
