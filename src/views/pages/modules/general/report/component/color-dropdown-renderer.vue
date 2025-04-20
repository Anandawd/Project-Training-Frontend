<template>
  <div>
    <color-picker
      :isWidget="true"
      format="hex"
      v-model:pureColor="pureColor"
      v-model:gradientColor="gradientColor"
      @pureColorChange="onChange"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from "vue";
import CSelect from "@/components/select/select.vue";
import { ColorPicker } from "vue3-colorpicker";
import "vue3-colorpicker/style.css";

export default defineComponent({
  name: "DropDownRenderer",
  components: {
    CSelect,
    ColorPicker,
  },
  props: {
    params: Object,
  },
  emits: ["params"],
  setup(props) {
    const pureColor = ref(props.params?.value ?? "");
    const gradientColor = ref(
      "linear-gradient(0deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 100%)"
    );

    const onChange = () => {
      props.params.api.stopEditing();
    };

    watch(pureColor, () => {
      onChange();
    });

    const getValue = () => pureColor.value;
    const isPopup = () => true;

    onMounted(() => {
      pureColor.value = props.params?.value ?? "";
    });

    return {
      pureColor,
      gradientColor,
      onChange,
    };
  },
});
</script>
