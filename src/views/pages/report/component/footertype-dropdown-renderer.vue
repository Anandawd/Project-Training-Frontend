<template>
  <c-select
    required
    @change="onChange"
    id="code"
    :options="list"
    class="row mb-1"
    keyName="code"
    labelName="name"
    v-model="code"
    name="code"
  >
  </c-select>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import CSelect from "@/components/select/select.vue";

@Options({
  name: "DropDownRenderer",
  components: {
    CSelect,
  },
  props: {},
  emits: ["params"],
})
export default class DropDownRenderer extends Vue {
  public params: any;
  public code: any;
  public list: any = [
    { code: 0, name: "(None)" },
    { code: 1, name: "Text 'TOTAL'" },
    { code: 2, name: "SUM" },
    { code: 3, name: "COUNT" },
    { code: 4, name: "COUNT IF <> ''" },
    { code: 5, name: "COUNT IF <> 0" },
  ];

  getValue() {
    return this.code;
  }

  isPopup() {
    return true;
  }

  onChange() {
    this.params.api.stopEditing();
  }
  created() {
    this.code = this.params.value;
  }
  mounted() {
    this.code = this.params.value;
  }
}
</script>
