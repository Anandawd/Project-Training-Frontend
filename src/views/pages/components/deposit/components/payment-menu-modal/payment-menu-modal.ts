import { Options, Vue } from "vue-class-component";
import modal from "@/components/modal/modal.vue";

@Options({
  components: {
    modal,
  },
  props: {
    title: String,
  },
  emits: [
    "checkIn",
    "waitList",
    "cancel",
    "noShow",
    "void",
    "autoAssign",
    "removeAutoAssign",
    "lock",
    "close",
  ],
})
export default class PaymentMenuModal extends Vue {
  public paramsDataIsLock = false;
}
