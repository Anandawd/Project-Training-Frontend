<template>
  <svg
    version="1.1"
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    title="Please Clean"
    width="24px"
    height="24px"
    viewBox="0 0 24 24"
    enable-background="new 0 0 24 24"
    xml:space="preserve"
  >
    <image
      id="image0"
      :width="size"
      :height="size"
      x="0"
      y="0"
      xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAABGdBTUEAALGPC/xhBQAAACBjSFJN
AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABRFBMVEUrrysrrysrrysssCwr
rysrrytMu0wwsTDG6cbP7M8zsjMxsjHM68zU7tQvsS+m3aao3qhseR42szbi8+L9/f2J0omq36qx
4bGlShL+AACqRRH3+/dGuUbH6cf4+/iK04oxsTEusC65Og6+NQ1tyG1Lu0vk9OR1y3U4tDhyynIs
ryxOvE7g8+A/tz8tsC1wyXA/nyeJYhhBnifbHQdDnCeUWBZJlyUrrysssCwrrysrrysssCwvsS8x
sTEusS5XwFdfw183tDeV15VkxWT+/v5rx2sxsjF7zXvj9ONAt0D9/f09tj00qCo1pym75btlxWVI
ukhRvVG5Og6+NQ06tTqz4rP4+/jl9OWW15YusC695b18zXw2tDb3+/fB58G147X7/ftGuUZUv1TA
58CuQxCzPw85tTlqex50cxyuQhC7Nw3///+E5M57AAAAO3RSTlO+9LL+/vH+/v7+/v7+/v7+/v7+
/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+xfv7uPp1MUYAAAABYktHRGtSZaWY
AAAAB3RJTUUH4wodESU2jmrYVgAAAPRJREFUKM9jYGDECpgYmK1ZrKEIiOFsVtwSLNgBhg4bWyxG
2QEl7B2wGMXGwsLOwcmFYZSjE7czj4sLr6sbmlHuHnye/F5eAt4+gr7IRgkJi4iyMIuJM7NISEoh
GcXu5+Ii7c8SEMhiHSQZjNAhIysCBHLyCoosLEqSylAdISqhYSIuLi4iLiLhEaqREB1go9gdoiAS
atExMKNgdqjHAiXiNEBsFDtYWDRFRDi5VLRYkO2AoPgEbQedRGt0o1isk5JZrHVBjBTJVJSw0tOH
MgwMjVCDPQ0aUenGGdhjMFMyC3sMmpiaseCJc3MLSwsoAmI42woARrhKlBXEWoYAAAAldEVYdGRh
dGU6Y3JlYXRlADIwMTktMTAtMjlUMTc6Mzc6NTQrMDM6MDCNaqefAAAAJXRFWHRkYXRlOm1vZGlm
eQAyMDE5LTEwLTI5VDE3OjM3OjU0KzAzOjAw/DcfIwAAAABJRU5ErkJggg=="
    />
  </svg>
</template>
<script>
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    size: {
      type: [String, Number],
      default: "24",
    },
  },
});
</script>
