<template><i data-bs-toggle="tooltip" data-bs-placement="top" :title="$t('tooltips.showingRoom')">
    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
      x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24" enable-background="new 0 0 24 24"
      xml:space="preserve">
      <image id="image0" :width="size" :height="size" x="0" y="0" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAACBjSFJN
AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAC6FBMVEUAS3IAAAAAS3IAS3II
SnA0RmX/KyXsMjftMzfsMzexOEXiMjntMTbsMDXsLzTsMTbsMTbsMTbsMTbsMDbsLjTsLTPsLjPs
MDUAS3IASHAASG8ASXEAS3NGQ2DkMjjtMTbsMTbsMDTsLjPsLTLsMDXsMTbsMTYAS3IASnEASHAA
SG8ASXAASXFBeZZym7Fbi6RFe5gwbYwgYYQRV3wIUXYCTHKFqLv////6+/v09vjr8PPc5uvM2+K2
y9aeusmEqLpplatPgp0ETnSHqrz//v78/Pz9/Pz9/f3+/f3///75+vrL2uEXW3+Lrb7Y4+gaXYCP
r8D+/v0bXoEASnKRscHZ4+kcX4GTssPZ5OkdX4KVtMTa5OoeYIKXtcXb5eofYYOZt8bc5eogYYOb
uMfd5usgYoQBS3Kdusjv8/Xa5OkiY4QBTHKfu8nh6e1NgZyVs8MmZocBTHOhvMoeX4F6oLQoZ4ik
vsx5oLQpaIilv8wkZIZ/pLcCTHOmwM39/fzu8vS4zNfK2eEmZYenwc7i6u4lZYYCS3IHSnADTXOo
wc4AS3MpRmijOUmrOEcDTXSpws/i6e06RWPlMjjwMTXvMTXsLzTsMjftQUbuSU3tPkLsMDXsMTaq
w88nZoc5RWThMjntMTbvV1v3qav72Nn84uP60tP1mZvuSE2sw9DtLzTxZWn74OH+///+/v76y8zv
TlMFTnWtxNDj6u4nZ4jhMTjuQkf60NH3sLLsNToFT3WuxdHhLzbycnX72dr3sbP4trj719jvU1cG
T3X1jZDsLjPtOD35xcbxaGuvxtLk6+/0f4L5xMbydnnydXnzfYDwXGD//v3q7/K3zNYaXoDhMDfw
UVX85OX+/Pz6ysvtPUKtxdH6+vvR3uWEp7pXiKIwbIwTWHz0i4399/f86+vxbG/t8vRaiqM0b47t
MDXsNjvzg4b729z99/j++/v99fX6zc/xbXAybo0xbY0WWn7uRkvxaW3wY2ftP0Swz63PAAAAJ3RS
TlMAAN0d3iQGCAgI9sC4uLi4s/n4+Pj4+Pi9vb29vMz6/fz8/Pz8/faThx58AAAAAWJLR0Q3MLi4
RwAAAAd0SU1FB+MLDQkpFxH6C+MAAAICSURBVDjLY1DX0NTS1NbRUEcGTMwMjFDAoKGrp29gaGRs
YqqjqamNRYGOmbmFpZW1ja2dvYOjoRMWE5xdXN3cPVw8PV3cvbx9NDAV+Hq6woCLnz8WBQEIBYF+
QZgKgkOQFISGYSpQD0dSEBGJRUEUkoLoGCwKYpEUxMVjUZCAUOCRmIRFQTKSN1NSMRWkpcMVeGVk
ZmEqyM6BKfDIzcsv0MFQUFgEV5BZXFKKRUEZQkFMeQUWBZVwBXFV1VgU1NTCFNTVNzQ2YVHQjPCm
eUsrUEFbezsLKxs7Byc7Bzs7O0NHJ1JA5QJN6Oru6eXi5uHl4+UHAgGGvn4kBROA3uyaOGnylKnT
ps+YOWvW7NmCDE5zkBS0zAUqmDd/wayFixYvWbps+dTZQgxOKzAVrFy1eg0QrF23fqoQw4aNSAo2
bQYp2LJ1mzlIwRrz7TuEGXbuwlCwe8/efWCw/8BBEYZDuzCs2H140REwOHrsuCjDoRNI0X2yAKzg
1OkzIHD23LbzYjAT3C94unhdvHRZA6jgytVra6+DwJobN8UZdt4yB8rdtrqz6+69+w8K1cHefPgI
6Ic1ax4/Afmi8+mdE2bPnvsc0tHUBiUXoIIXL1+9fvP23fsPs4HhUPPx02eYHBiAA2rWl69nvn2f
ClIgISklLYEMZGTl5BUUFJWUlVQUFFTVAFT/JZy+tYnOAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE5
LTExLTEzVDA5OjQxOjIzKzAzOjAwcQ95+gAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOS0xMS0xM1Qw
OTo0MToyMyswMzowMABSwUYAAAAASUVORK5CYII=" />
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
