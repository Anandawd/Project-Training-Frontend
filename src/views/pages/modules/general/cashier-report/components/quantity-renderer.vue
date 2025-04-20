<template>
  <div v-if="params.node.rowPinned">{{ cellValue }}</div>
  <c-input
    v-else
    v-model="quantity"
    type="number"
    spinner
    @change="onChangeQuantity"
  ></c-input>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import CInput from "@/components/input/input.vue";

export default defineComponent({
  components: { CInput },
  props: ["params"],
  setup(props: any) {
    const cellValue = props.params.value;
    let quantity = ref(0);
    function onChangeQuantity() {
      console.log(quantity);
      let colId = props.params.column.colId;
      props.params.node.setDataValue(colId, quantity.value);
      props.params.context.componentParent.generateTotalFooter(
        true,
        props.params.data
      );
    }
    return {
      onChangeQuantity,
      cellValue,
      quantity,
    };
  },
  mounted() {
    this.quantity = this.cellValue;
  },
});
</script>
