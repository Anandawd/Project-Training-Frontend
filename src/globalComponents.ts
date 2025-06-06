import Pagination from "@/components/pagination/pagination.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { Form } from "vee-validate";
import { PerfectScrollbar } from "vue3-perfect-scrollbar";
import CDialog from "./components/dialog/dialog.vue";
import FeatherIcon from "./components/FeatherIcon.vue";
import SaveCloseButton from "./components/save-close-button/save-close-button.vue";
import Confirmation from "./views/pages/components/confirmation/confirmation.vue";

class GlobalComponent {
  constructor(main: any) {
    main.component("v-form", Form);
    main.component("perfect-scrollbar", PerfectScrollbar);
    main.component(FeatherIcon.name, FeatherIcon);
    main.component("font-awesome-icon", FontAwesomeIcon);
    main.component("c-confirmation", Confirmation);
    main.component("c-dialog", CDialog);
    main.component("save-close-button", SaveCloseButton);
    main.component("pagination", Pagination);
  }
}
export default GlobalComponent;
