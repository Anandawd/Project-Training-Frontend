import { Options, Vue } from "vue-class-component";
import "vue3-form-wizard/dist/style.css";
import CInput from "@/components/input/input.vue";
import { AgGridVue } from "ag-grid-vue3";
import CModal from "@/components/modal/modal.vue";
import * as Yup from "yup";
import { GridApi, GridOptions } from "ag-grid-community";
import action_gridVue from "@/components/ag_grid-framework/action_grid.vue";
import { getToastError, getToastInfo } from "@/utils/toast";
import WizardRoomTypeAPI from "@/services/api/wizard/room-type";
import CSelect from "@/components/select/select.vue";
import SettingsAPI from "@/services/api/general/settings";
import { getError } from "@/utils/general";
import { formatDateDatabase } from "@/utils/format";
const wizardRoomTypeAPI = new WizardRoomTypeAPI();

@Options({
  components: {
    CInput,
    CSelect,
    CModal,
    AgGridVue,
  },
})
export default class FormatAndSetting extends Vue {
  gridOptions: GridOptions = null;
  columnDefs: any = null;
  rowData: any = [];
  form: any = {};
  showForm: boolean = false;
  gridApi: GridApi;
  formElement: any = null;
  frameworkComponents: any = null;
  context: any = null;
  modeData: any = null;
  options: any = {};

  currencyFormat = [".-", ",0.0;-,0.0", ",0.00;-,0.00", ",0.000;-,0.000"];
  dateSeparator = ["/", "-"];
  decimalSeparator = [",", "."];
  thousandSeparator = [",", "."];
  shortDateFormat = ["DD/MM/YY", "DD/MM/YYYY", "MM/DD/YY", "MM/DD/YYYY"];

  resetForm() {
    this.form = {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      short_date_format: "DD/MM/YYYY",
      date_separator: "/",
      currency_format: ",0.00;-,0.00",
      decimal_separator: ".",
      thousands_separator: ",",
      audit_date: formatDateDatabase(new Date()),
    };
  }

  onSubmit() {
    this.updateConfigurationData(this.form);
    // this.resetForm();
  }

  handleSave() {
    this.formElement.$el.requestSubmit();
  }

  processLoadData(data: any[]) {
    if (!data) return;
    for (const i of data) {
      this.form[i.name.toLowerCase()] = i.value;
    }
  }

  // API =========================================================================================
  async loadConfigurationData() {
    const settingsAPI = new SettingsAPI();
    try {
      const { data } = await settingsAPI.getConfigurationsAll();
      this.processLoadData(data);
    } catch (error) {
      getError(error);
    }
  }

  async updateConfigurationData(data: any) {
    const settingsAPI = new SettingsAPI();
    if (!data) return;
    const params = {
      type: "",
      data: data,
      audit_date: formatDateDatabase(data.audit_date),
    };
    try {
      await settingsAPI.updateConfiguration(params);
      // this.loadConfigurationData();
      // this.showButtonSave = false;
      // getToastSuccess();
    } catch (error) {
      getError(error);
    }
  }

  async getComboList() {
    const params = ["Timezone"];
    const settingsAPI = new SettingsAPI();
    try {
      const { data } = await settingsAPI.codeNameListArray(params);
      this.options = data;
    } catch (error) {
      getError(error);
    }
  }
  // END API======================================================================================

  async beforeMount() {
    this.resetForm();
    await this.getComboList();
    this.loadConfigurationData();
  }

  get schema() {
    return Yup.object().shape({
      Timezone: Yup.string().required(),
      "Short Date Format": Yup.string().required(),
      "Date Separator": Yup.string().required(),
      "Currency Format": Yup.string().required(),
      "Decimal Separator": Yup.string().required(),
      "Thousand Separator": Yup.string().required(),
    });
  }

  get title() {
    return (this.modeData == 1 ? "Update " : "Insert ") + " Room Type";
  }
}
