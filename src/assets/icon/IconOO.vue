<template>
  <i data-bs-toggle="tooltip" data-bs-placement="top" :title="$t('tooltips.outOfOrder')">
    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
      x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24" enable-background="new 0 0 24 24"
      xml:space="preserve">
      <image id="image0" :width="size" :height="size" x="0" y="0" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGOfPtRkwAAACBjSFJN
AACHDwAAjA8AAP1SAACBQAAAfXkAAOmLAAA85QAAGcxzPIV3AAABrVBMVEXsPkLsPEHsOj/uT1Pr
MDXrLzTrLTLtQkbsMjfsMDXsMTbrLjTtREjrKi/qJyzqJCnoCxHqIyjvXGDydXjydnrwX2PnCQ/r
JizoDhP0iIv//v7////+///2lJfpExnqIynoDRPwZmr9/f3+/f3yen7oCQ/oBgz5w8T+/v79/v77
3N3oBg3oCg/6z9D85+foBw3qISb0gYT2pafpGR7qISXrNjrpHCL4s7X60NHpFRvpDRPqHiPrKS/w
YWT4tLX4v8H4v8D4tbb9+Pjye3/rJyz1kZTmAADqGyHpGiDmAAH85uf3pafqICXqHyT3qq3oDRLo
Ehj86uv6yMrqGR/qHSP4sbToDBLoEhf6zs/qGB3qIif2nJ7rKzHrLDL86er4t7rqHCHyfoHtSk/t
SU786ur1kJLqJCrrLjPrLTP9///uSlDrKzDpDBL98vPnBwzrKS7wY2fze33rJiv96On//PznCA7o
GB3sLDHqHSL+9fXqKi/yd3r0h4rqJivnBg3wV1z1m5370tT87/D88PD71tf2oKLwYGTnCA3pFxzo
ERbpFhvtQ0fsOT/sNzzrNTqxUYMMAAAAAWJLR0QbAmDUpAAAAAlwSFlzAAAOxAAADsQBlSsOGwAA
AAd0SU1FB+MKHREwDH/T5/AAAAGMSURBVDjLfZP5OxtRFIaHmjgJI1K771Kd0Yo11tpLK5WWUrT2
rWIJQpHW0kUtpSj6N5twxdwZ5v31vM+ZZ873XUmKsyP+kZQg2+FIlMjpsiEpWRBIVlJSlCR6SHCn
eh6npWcomR7nPQJlZefk4hqWl/+EzAIVPNUnqqppqsqAwmckCvS8CEzzcrRilJSSUaCycqheAyoq
fGQQKqvEub4E1TV3glxrnkd31Dliwov6u+/HYA2NMaEJXmYFzTIXWlrBXra1C7S9eo0OPxfcb4DO
wFuBwLsudL/nQk8v8IHElKivHwMfufBpkGHILAz3Y2SUC2PjgM8xITA5NIXpz1zwz4A5grMCQdcc
5he4EFrEEiwwLIe5QCureo5mGL7Q7aHW1q2n1rARiV2Syr4yy6W/bRrSdG7BbCASMhYmvK3XybCf
QfKLlVN2vuvKTabRzv3IMpdW9v2M/tt1jPi1GbLWnnZ/7+0fHP45Ov574r7/XZAydnp29q9SefBl
RSUxNF1wOe0InUsXl3b8D14B7NqFRgoLzVkAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTktMTAtMjlU
MTc6NDg6MTIrMDM6MDCywNJRAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE5LTEwLTI5VDE3OjQ4OjEy
KzAzOjAww51q7QAAAABJRU5ErkJggg==" />
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
