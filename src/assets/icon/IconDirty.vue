<template>
  <i data-bs-toggle="tooltip" data-bs-placement="top" :title="$t('tooltips.dirty')">
    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
      x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24" enable-background="new 0 0 24 24"
      xml:space="preserve">
      <image id="image0" :width="size" :height="size" x="0" y="0" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAABGdBTUEAALGPC/xhBQAAACBjSFJN
AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABblBMVEWGOjCGOjCGOjCHOjGG
OjCFOTCGOjCGOjCGOjCGOjGGOjCHOjGHOzGxgXr9/f37+vqfYlr38/Lu5OOTT0aKQTfGop318O+H
OzGLQzmwf3jDnZjt4uGhZ1+YWE/p3NvTuLXQs7Dq3duPSD+9lI78+/urd3CLQTiRQzSeTjjRtLDz
7eysWTzIcEWka2PaxMHKcUWwXD3y6+rOr6uGOjCMRDqHPDKGOjCGOjCGOjCGOjCHOjGGOjCGOjCH
OzG0hH7u5ePgzcqTT0b9/PzLq6erdm/+/v7IpqKka2T59/bq3duPSUCaWlH07u3y6+qXVk6cXlad
YFjWvLn49fTCnJfv5eT8+/uncGn9/f3BmpX28vG/lpHGo5/w5+XVu7iWU0u7kIuIPjSIPDGjaWLn
2NeJPTGbSzeLPjKPQjOJPDGMPzLu5OOxXT64Y0CgTzird3CwXD23YkC2iIL49fX38vK1h4GYSTaK
PTGIPTS1hoD////U1cJfAAAAPXRSTlM41fT01z3T/tzy+vL6/v7+/v7+/v7+/v7+/v7+/v7+/v7+
/v7+/v7+/v7+/v7+/v7+/v7y/v7U3TrZ+NtAVqQ2FQAAAAFiS0dEeaHc1NAAAAAHdElNRQfjCRMI
DicmIpDRAAABGElEQVQoz2NgYGRiZkJGYIKFlYGNnd0WBUFoDgZO7BJcDNy2aMDO3sHR1paHgRtN
B68TH58zWAeqhAu/Kx+fG6ZR7h6urq6eXhhGCQi68rkKCWNY7u0DVO/rB2Ii6xAR9eXjcxXzhzkX
SItLBEhKBUrzAe0NkkHyR3CIkysUhIZBTQUZJRsONEFOPkIBqEMRyefsSpFACWXxKBWghCpKkEQD
zYiJBRsVZ4tkFHs8H8haEFJRA+pQ14C5KkETJqElDpTQ1kmEeTAJ5qpk25TUtJT0jEyYB3WzIDr0
2LP1c9jZcw3goZtnqAKSMGLP1y8A+RgprAqLil1dS2wTS8ugrjKGhVW5iXKFKVLUmmGPc3MGC0sr
LMDaBgCivFpMZOAsuAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxOS0wOS0xOVQwODoxNDozOSswMzow
MMtIBEYAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTktMDktMTlUMDg6MTQ6MzkrMDM6MDC6Fbz6AAAA
AElFTkSuQmCC" />
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
