<template>
  <i
    data-bs-toggle="tooltip"
    data-bs-placement="top"
    :title="$t('tooltips.occupiedDirty')"
  >
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
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
AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAB0VBMVEUAAADqAAD7AAD7AAD2
AAD7AAD7AAD7AAD8AAD7AAD7AAD7AAD7AACFOTCFOS/6AAD7AAD7AAD7AACFOjCHOzGGOjD6AAD7
AAC0Ix2GOjCGOjD6AAD7AADgDQqNNy6GOjCGOjCCOC76AAD7AADyBAObLyeHOjCiKyT2AAD7AAD6
AAC1IhyGOjCpKCH2AgL5AADwAAD7AAD7AADPFRGJOS+TMyrtBgX7AAD3AAD2AgG4IRuMOC6KOS/V
Eg77AADxAAD7AAD7AADyBAPbDwy6IBqZMCiuJh/7AADxBATOFhKrJyCSNCuHOjCGOjCGOjCHOjDL
FxP7AAD7AAD5AQGkKyOHOzCGOjCGOjCGOS+GOjCMNy7sBwb7AAD6AAD7AAD6AACxJB6HOTCHOjGF
OjCGOjCNNy3uBgX7AAD7AADYAADsBwWNNy2GOjCNNy7rBwbtAADSAAD3AgGsJyCKOC6KOC7oCQfr
AAD4AQGiLCSGOjCJOS/nCQjlCgiyIx2IOS+GOjCGOjCGOjCJOS/nCQi7HxqkKyOIOS+HOjCHOjCJ
OS/pCQf7AAD5AQDQFBHNFhK5IBq5IBv3AgH7AADPAAD7AAD7AAD7AADqAAD8AACHOzH///+LK0Wa
AAAAmHRSTlMAApKYA4/+dP59W/1jNg5E+PpLbf6wMPA794gg5ovT/s8HFNfFmvQqCsXvcP17sA0E
sPVz6q+vuAXbatPje6EBfvzGg3iSdIe6eXux89Py+nds59+I/u9oH4bHsO8+belxwf5Ge8uxg0Ec
oLzu0awlHNJ4ptamJd2D2dygj17P+N714ZtrWuHU2+SX+eV0c2ps2fsGudi9CQUag3QAAAABYktH
RJqY32cSAAAAB3RJTUUH4wodESU2jmrYVgAAAUpJREFUKM9tUWVXAkEUHV0dV8FAUexnYmFhN3a3
YmM3dmB3dzv7b53ZdRcOcM98eHNr3jmDkAIPT84LuYM3wZw73ocnmPd15f1UmEKlpqN/gAMfGEQI
wQRrglGINtTOh+mwJBBdeIQQqfBR0VhGTCzExct8QiJzi4mkZNCnyHxqGpaF9AwDZGZlS3xOrtJj
zMuHgkJcVCwKnGhniZLSMqG8gs6VVZQ3Sebqmtq6ej1Ag5HdGhFS88ze1NzS2gbtHdDZJab5btTD
Snr7+sE8MDgkwPCIVDuKxiwmQsYnJs1T0zMgwOwcE+YtC/SRRdq5tAxgBYqVVfbEmrjVOrVsbG5Z
BYEmtndYYlcRiG1Pu8+Eg0MHQVz36Pjk9MxwfnHJLg4Jgm1X1ze3d/cPTlX0PD49v7y+vTtXSfjQ
YJeq/48i9sTn17cTfn4R+gMf23jqCjBgEQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxOS0xMC0yOVQx
NzozNzo1NCswMzowMI1qp58AAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTktMTAtMjlUMTc6Mzc6NTQr
MDM6MDD8Nx8jAAAAAElFTkSuQmCC"
      />
    </svg>
  </i>
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
