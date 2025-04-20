<template>
  <div>
    <color-picker
      isWidget="true"
      format="hex"
      v-model:pureColor="pureColor"
      v-model:gradientColor="gradientColor"
      pureColorChange="onChange()"
    />
  </div>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import CSelect from "@/components/select/select.vue";
import { ColorPicker } from "vue3-colorpicker";
import "vue3-colorpicker/style.css";
import { reactive, ref } from "vue";

@Options({
  name: "DropDownRenderer",
  components: {
    CSelect,
    ColorPicker,
  },
  props: {},
  emits: ["params"],
  watch: {
    pureColor(val: any) {
      this.onChange();
    },
  },
})
export default class DropDownRenderer extends Vue {
  public params: any;
  public pureColor: any;
  public gradientColor: any = ref(
    "linear-gradient(0deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 100%)"
  );

  getValue() {
    return this.pureColor;
  }

  isPopup() {
    return true;
  }

  onChange() {
    this.params.api.stopEditing();
  }
  created() {
    this.pureColor = this.params.value;
  }
  mounted() {
    this.pureColor = this.params.value;
  }
}
</script>
