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
    { code: 1, name: "%2.0n" },
    { code: 2, name: "%2.1n" },
    { code: 3, name: "%2.2n" },
    { code: 4, name: "%2.3n" },
    { code: 5, name: "dd/mm/yyyy" },
    { code: 6, name: "dd/mm/yy" },
    { code: 7, name: "dd-mm-yyyy" },
    { code: 8, name: "dd-mm-yy" },
    { code: 9, name: "dd/mm/yyyy hh:mm:ss" },
    { code: 10, name: "dd/mm/yy hh:mm:ss" },
    { code: 11, name: "dd/mm/yyyy hh:mm" },
    { code: 12, name: "dd/mm/yy hh:mm" },
    { code: 13, name: "hh:mm:ss" },
    { code: 14, name: "hh:mm" },
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
