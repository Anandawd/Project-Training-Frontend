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
  />
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import CSelect from "@/components/select/select.vue";

export default defineComponent({
  name: "DropDownRenderer",
  components: {
    CSelect,
  },
  props: {
    params: Object,
  },
  setup(props) {
    const code = ref(props.params?.value);
    const list = ref([
      { code: 0, name: "Arial" },
      { code: 1, name: "Tahoma" },
      { code: 2, name: "Verdana" },
      { code: 3, name: "Microsoft Sans Serif" },
      { code: 4, name: "Times New Roman" },
      { code: 5, name: "Comic Sans MS" },
      { code: 6, name: "Lucida Console" },
    ]);

    const onChange = () => {
      props.params?.api.stopEditing();
    };

    const getValue = () => code.value;
    const isPopup = () => true;

    return {
      code,
      list,
      onChange,
      getValue,
      isPopup,
    };
  },
});
</script>
