<template>
  <div style="margin-top:3px">
    <i class="fa fa-smoke"></i>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'smoke_icon',
  props: ['params'],
  setup() {
    let data;

    return {
      data
    }
  },
  mounted() {
    if (this.params.data) {
      this.data = `${this.params.data.value}`;
    }
  }
})
</script>