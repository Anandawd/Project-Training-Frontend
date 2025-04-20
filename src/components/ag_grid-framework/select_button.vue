<template>
  <div v-if="params.node.rowPinned">
    <b>{{ params.colDef.textTotal ? params.colDef.textTotal : $t('labels.total') }}</b>
  </div>
  <div v-else>
    <button class="btn-select-grid btn btn-primary" type="button" @click="handleSelect"><span class="select-text">{{
      $t('buttons.select')
    }}</span></button>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "select-button",
  props: ['params'],
  setup(props) {
    const paramsParent = computed(() => {
      return props.params.context.componentParent;
    });
    function handleSelect() {
      if (props.params.data) {
        try {
          const params = props.params.data
          paramsParent.value.handleSelectedData(params)
        } catch (err) {
          throw new Error("Method not implemented.");
        }
      } else {
        openUndefinedAlert();
      }
    }

    function openUndefinedAlert() {
      alert("undefined");
    }

    return {
      handleSelect
    }
  }
})
</script>
<style lang="scss">
.btn-select-grid {
  font-size: 12px;
  height: 30px;
  padding-left: 5px;

  .select-text {
    padding-left: 10px;
    padding-right: 10px;
  }
}
</style>
