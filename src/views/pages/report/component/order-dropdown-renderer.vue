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
    { code: 1, name: "ASC" },
    { code: 0, name: "DESC" },
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
