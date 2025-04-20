<template>
    <div :class="{'loading-container': true, loadings: isLoading, visible: isVisible}">
        <div class="loader" :style="{ width: progress + '%' }">
            <div class="light"></div>
        </div>
        <div class="glow"></div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import {random} from 'lodash'
// import $eventHub from '../components/eventHub'

export default defineComponent({
  setup() {
    // Assume that loading will complete under this amount of time.
    const defaultDuration = 8000
    // How frequently to update
    const defaultInterval = 1000
    // 0 - 1. Add some variation to how much the bar will grow at each interval
    const variation = 0.5
    // 0 - 100. Where the progress bar should start from.
    const startingPoint = 0
    // Limiting how far the progress bar will get to before loading is complete
    const endingPoint = 90 

    let isLoading = true // Once loading is done, start fading away
    let isVisible = true // Once animate finish, set display: none
    let progress = startingPoint
    let timeoutId: any = undefined

    function start() {
      isLoading = true
      isVisible = true
      progress = startingPoint
      loop()
    }

    function loop() {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      if (progress >= endingPoint) {
        return
      }
      const size = (endingPoint - startingPoint) / (defaultDuration / defaultInterval)
      const p = Math.round(progress + random(size * (1 - variation), size * (1 + variation)))
      progress = Math.min(p, endingPoint)
      timeoutId = setTimeout(
        loop,
        random(defaultInterval * (1 - variation), defaultInterval * (1 + variation))
      )
    }

    function stop() {
      isLoading = false
      progress = 100
      clearTimeout(timeoutId) 
      setTimeout(() => {
        if (!isLoading) {
          isVisible = false
        }
      }, 200)
    }

    return {
      start,
      loop,
      stop,
      progress, 
      isLoading,
      isVisible
    }
  },
  mounted(){ 
    this.start()
    // $eventHub.$on('asyncComponentLoading', this.start)
    // $eventHub.$on('asyncComponentLoaded', this.stop)
  }
})
</script>
<style scoped>

.loading-container {
    font-size: 0; /* remove space */
    position: fixed;
    top: 0;
    left: 0;
    height: 5px;
    width: 100%;
    opacity: 0;
    display: none;
    z-index: 100;
    transition: opacity 200;
}

.loading-container.visible {
    display: block;
}
.loading-container.loading {
    opacity: 1;
}

.loader {
    background: #23d6d6;
    display: inline-block;
    height: 100%;
    width: 50%;
    overflow: hidden;
    border-radius: 0 0 5px 0;
    transition: 200 width ease-out;
}

.loader > .light {
    float: right;
    height: 100%;
    width: 20%;
    background-image: linear-gradient(to right, #23d6d6, #29ffff, #23d6d6);
    animation: loading-animation 2s ease-in infinite;
}

.glow {
    display: inline-block;
    height: 100%;
    width: 30px;
    margin-left: -30px;
    border-radius: 0 0 5px 0;
    box-shadow: 0 0 10px #23d6d6;
}

@keyframes loading-animation {
    0% {
        margin-right: 100%;
    }
    50% {
        margin-right: 100%;
    }
    100% {
        margin-right: -10%;
    }
}
</style>
