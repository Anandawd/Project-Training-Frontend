<template>
  <i data-bs-toggle="tooltip" data-bs-placement="top" :title="$t('tooltips.underConstruction')">
    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
      x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24" enable-background="new 0 0 24 24"
      xml:space="preserve">
      <image id="image0" :width="size" :height="size" x="0" y="0" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAABGdBTUEAALGPC/xhBQAAACBjSFJN
AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABX1BMVEUAAADSVAD+ZQD+ZQD8
ZAD9ZQD+ZQD+ZQDITwClQQD+ZQD8ZADiWgD+ZQD+ZQCKNwCbPgCbPQCVOwCKNwD+ZQD+ZQD+ZQD+
ZQD+ZQD+ZQD+ZQD+ZQCPOQD+ZQD+ZgDWVQCePwC2SADJTwDKUADKUADJUAC8SwCoQwCDNADwXwD+
ZQD+ZQD+ZQD9ZQD+ZQD+ZQD+ZQD+ZQD+ZQD8ZAD0YgD6ZAD+ZQD+ZgD+ZQD+ZQD7ZAD6YwC/TAD1
YQD+ZQDaVwCiQQDQUwDvXwD6ZAD+ZQD9ZQD0YQDbVwCxRgDUVAD9ZQD+ZQD+ZQD+ZQD+ZQDLUADl
WwD+ZgD9ZQD+ZQD9ZAD+ZQD+ZQD8ZAC4SQC3SAD7ZAD+ZQDPUgD+ZQD+ZQD+ZQD+ZQD+ZQD+ZQD+
ZQD+ZQD+ZQDwXwD9ZQD+ZQCxRgD+ZQD8ZAD9ZQD+ZQD+ZQD9ZQD+ZQD+ZQD+ZQD/ZgD///8yBmyL
AAAAc3RSTlMAEMPpUY3+7QsE61dC/aEFDxELAYvItauqssK8A+j+IwwoPEVGPy4TAUPYrI99dX6Q
rttYPWeD9fyYZ1cEPvoVCTlfd4V7ZkQSEYi3u7/vCir9eIRhmuJOBAZVxxT18L6be4acwfIufJQG
5l5hzcSK8eqA0rgUNwAAAAFiS0dEdN9tqG0AAAAHdElNRQfjCh0RJgEd+i6aAAAA5UlEQVQoz2Ng
gANGJmYWBmyAla2YnQOLOCcXW3ExNxYJHl42NjY+bEbxCwgKCTNQAYiIiolLSEpJo4vLyLIVA13F
JiePLqOgqKSsoqqmToZlGig8TS1tHV09PX0DQyNjJGETUzPzYojlxRaWVtY2UHFbXjt7B0cnZzMX
Vzd3D087Ni+ohHexD7KxvsV+/mBGQGBxELJEcDFbCJgRWlwcFh4BE46Mki1miwaxYmKBwc0WF5/g
kpiYlJySCuKxpQEl0sGOKYa5CoIyGBgys7BJAK3PZsMKchhyi7HpKM5jyOcqwAIKiwCU/UAL2ZFS
AwAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxOS0xMC0yOVQxNzozODowMSswMzowMGa53dEAAAAldEVY
dGRhdGU6bW9kaWZ5ADIwMTktMTAtMjlUMTc6Mzg6MDErMDM6MDAX5GVtAAAAAElFTkSuQmCC" />
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
