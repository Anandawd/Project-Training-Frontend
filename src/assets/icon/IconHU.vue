<template>
  <i data-bs-toggle="tooltip" data-bs-placement="top" :title="$t('tooltips.houseUse')">
    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
      x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24" enable-background="new 0 0 24 24"
      xml:space="preserve">
      <image id="image0" :width="size" :height="size" x="0" y="0" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAACBjSFJN
AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABUFBMVEUAAAAAZTIAZTIAZTIA
ZTIAZTIAZTIAZTIAZTIAZTIAZTIAZTIAZTIAZTIAZTIAZTIAZTIAZTIAZTIAZTIAZTIAZTIAZTIA
ZTIAZTIAZTIAZTIAZTIAZTIAZTIAZTIAZTIAZTIAZTIAZTIAZTIAZTIAZTIAZTIAZTIAZTIAZTIA
ZTIAZTIAZTIAZTIAZTIAZTIAZTIAZTIAZTIAZTIAZTIAZTIAZTIAZTIAZTIAZTIAZTIAZTIAZTIA
ZTIAZTIAZTIAZTIAZTIAZDIAZjIEbDEThi8cli0GbzEgnS0rsCsssSsGcDEBZjIaky4bky4mpywr
sSsIczEoqysFbTElpSwWjC4XjS4AYzIDajIprSsBZzIHcjEPfzAViS8blC4nqSwmqCwaki4MejAJ
dTAdly0rrysqrishni0ssisVii4EbTEjoiwprCsZkC4KdjD////0+aEgAAAAQXRSTlMAADwqzikb
uQ+iB4r8iQJw9lju7UHhLtLRHr4SqKcRCY/9A3b4XfBG5eQy1tUhw8IZrhh90/PUfBYVHJ4UuJUG
eWSV2yMAAAABYktHRG9VCGGBAAAAB3RJTUUH4wsNCBATGdEodwAAAX1JREFUOMud0llbgkAUgGFO
mZaZWplmu2laarsVbdaghkNSuOTWYrba+v8vE2coGPGm7wrhfQ6HeeQ4fQB9fQBczwD6LZaB3gLA
akPIZu0pYHAItRsa7AHAPuxQgWPEbirA6XKjTm6X00QAjI4h2vho9xoAngn024SHFQBeH9I16TUK
AP8UMjTlNwiYnkFMs3M6APMLARYEFuZ/BSwGQ/S2kEoJ9DIUXARtgaUwfZzOnJ1l0pSEl8gaAJFl
+lzMYknC2XMqViKqAIjG6NCcLOF20kWO3ohH2wJW17T3i5eKCpRLUdtjfRW4jU1tbyFfwJ0KeQ2g
zS1uOxGP7RBQLJEJpSIB47vxxB7H8/sH2ileEVCmPw+PeJ7v/A+OyYRKVa5hXJOrFTIhSU+bAKF+
fXN718D4vpl5KJqAx6fGs0Q+U3kpldMsqL628F+K9CYw4J18gZYksxPSDGj+A0h60Op+xUftU9fL
Fwvq+W9DogHY1INi0oOTpM9iku9UBT/j/KRcmomdRwAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxOS0x
MS0xM1QwODoxNjoxOSswMzowMBXtT+kAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTktMTEtMTNUMDg6
MTY6MTkrMDM6MDBksPdVAAAAAElFTkSuQmCC" />
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
