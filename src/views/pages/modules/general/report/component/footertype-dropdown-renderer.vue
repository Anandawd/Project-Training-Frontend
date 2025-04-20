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
      { code: 0, name: "(None)" },
      { code: 1, name: "Text 'TOTAL'" },
      { code: 2, name: "SUM" },
      { code: 3, name: "COUNT" },
      { code: 4, name: "COUNT IF <> ''" },
      { code: 5, name: "COUNT IF <> 0" },
    ]);

    const onChange = () => {
      props.params?.api.stopEditing();
    };

    const getValue = () => code.value;
    const isPopup = () => true;

    onMounted(() => {
      code.value = props.params?.value;
    });

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
