<template>
  <i data-bs-toggle="tooltip" data-bs-placement="top" :title="$t('tooltips.occupied')">
    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
      x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24" enable-background="new 0 0 24 24"
      xml:space="preserve">
      <image id="image0" :width="size" :height="size" x="0" y="0" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAABGdBTUEAALGPC/xhBQAAACBjSFJN
AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAA5FBMVEUAAAAAWSsAZTIAXS0A
ZTIAZTIAZTIAZTMAZjMAZTIAZTIAZTIAZTIAZTEAZDEAZTIAZTIAZDEAZTIAYjAAZTIAYzEAXy8A
ZTIAYzAAWy0AZTIAXi4AZTIAZTIAZjIAZTIAZTIAZTIAZTIAZDEAZTIAZTIAZDIAUSgAWSwATyYA
WCwATiYAVysASyQAZTIAZTIAZjMAVSoAZjMBaDIWiy8joS0AZzIhni0ssCwhnS0PfzAYjy8Vii8V
iS8FbzIqrSwNfDAoqiwCaTILeTEBaTIAZjIRgjAXjS8KdzEMezAFbjL///+ocQ6LAAAAMnRSTlMA
ApICkJF2/v5c/UX5RTHxMiHmFNgUCscMBLIEmn/+gGXl5DppejocHBwcHBwFsM/PBVrVutcAAAAB
YktHREtpC4VQAAAAB3RJTUUH4wodESUscwghLAAAAORJREFUKM+ljtlWwkAQRJtFwqbIIiCCguwq
W7E4AkIQCMj/f5CTniQMy5v3qerWOTNN5OHz+wN0jSBwc82HDCAcuvSRKCTRyLmPxcHEb0/9XQIO
iXvdJ1PwSCWPPp2RYjgaj0dDGTIPrs/mZJ18CsnXRMZcXvnHgv3CVDBTOxeeeCjy0zM1zLgUbV8y
OM/V8M3l+YWorDwWS9svF6oZZaq4Z5orIVam216pWqs7+We93jixXmvIT5rA1tp5WFugxVe1gb3Q
2ANv7mDqw++/hoOlcdCGc9Twfjl88NDp9von9LoDoj8yHU1sECrLTwAAACV0RVh0ZGF0ZTpjcmVh
dGUAMjAxOS0xMC0yOVQxNzozNzo0NCswMzowMEHApwEAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTkt
MTAtMjlUMTc6Mzc6NDQrMDM6MDAwnR+9AAAAAElFTkSuQmCC" />
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
