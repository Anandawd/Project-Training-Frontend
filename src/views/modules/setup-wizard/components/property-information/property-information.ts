import { Options, Vue } from "vue-class-component";
import "vue3-form-wizard/dist/style.css";
import CInput from "@/components/input/input.vue";
import { AgGridVue } from "ag-grid-vue3";
import CModal from "@/components/modal/modal.vue";
import CSelect from "@/components/select/select.vue";
import SettingsAPI from "@/services/api/general/settings";
import { getError } from "@/utils/general";
import HotelInformationForm from "@/views/pages/modules/general/tools/settings/components/hotel-information-form/hotel-information-form.vue";
const settingsAPI = new SettingsAPI();

@Options({
  components: {
    CInput,
    CSelect,
    CModal,
    HotelInformationForm,
    AgGridVue,
  },
})
export default class PropertyInformation extends Vue {
  hotelInformationElement: any = null;
  isSaved: any = false;

  async handleSave() {
    const form = this.hotelInformationElement.form;
    await this.hotelInformationElement.handleSave();
    if (form.name == "" || form.street == "" || form.city == "") return false;
    await this.updateHotelInformation();
    return this.isSaved;
  }

  // API =========================================================================================
  async updateHotelInformation() {
    try {
      const { data } = await settingsAPI.updateHotelInformation(
        this.hotelInformationElement.form
      );
      this.isSaved = true;
    } catch (error) {
      this.isSaved = false;
      getError(error);
    }
  }
  // END API=====================================================================================
  async beforeMount() {}
}
