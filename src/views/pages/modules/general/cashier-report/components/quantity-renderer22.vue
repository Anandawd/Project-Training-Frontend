<template>
  <div v-if="params.node.rowPinned">{{ initialValue }}</div>
  <c-input
    v-else
    v-model="quantity"
    type="number"
    spinner
    @change="onChangeQuantity"
  ></c-input>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import CInput from "@/components/input/input.vue";
@Options({
  name: "quantity_renderer",
  components: { CInput },
  props: {},
  emits: ["params"],
})
export default class QuantityRenderer extends Vue {
  public params: any;
  public quantity: number = 0;

  onChangeQuantity(event: any) {
    let colId = this.params.column.colId;
    this.params.node.setDataValue(colId, this.quantity);
    this.params.context.componentParent.generateTotalFooter(
      true,
      this.params.data
    );
  }

  mounted() {
    this.quantity = this.initialValue;
  }

  get initialValue() {
    return this.params.value;
  }
}
</script>
