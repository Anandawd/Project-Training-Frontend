<template>
  <div v-if="params.colDef.sumTotal" class="ag-name-value">
    <span class="ag-name-value-value"> </span>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: "statusbar_total_renderer",
  props: ['params'],
  setup(params: any) {
    let count = null
    function onGridReady() {
      count = params.data
    }
    return { count, onGridReady }
  },
})
</script>
 