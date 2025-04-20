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
      { code: 1, name: "n0" },
      { code: 2, name: "n1" },
      { code: 3, name: "n2" },
      { code: 4, name: "n3" },
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
