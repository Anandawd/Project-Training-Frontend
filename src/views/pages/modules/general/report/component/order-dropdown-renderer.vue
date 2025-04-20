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
      { code: 1, name: "ASC" },
      { code: 0, name: "DESC" },
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
