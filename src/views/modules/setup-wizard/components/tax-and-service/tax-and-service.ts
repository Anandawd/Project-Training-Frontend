import { Options, Vue } from "vue-class-component";
import "vue3-form-wizard/dist/style.css";
import CInput from "@/components/input/input.vue";
import { AgGridVue } from "ag-grid-vue3";
import CModal from "@/components/modal/modal.vue";
import * as Yup from "yup";
import { GridApi, GridOptions } from "ag-grid-community";
import action_gridVue from "@/components/ag_grid-framework/action_grid.vue";
import { getToastInfo } from "@/utils/toast";
import { formatNumber } from "@/utils/format";
import CCheckbox from "@/components/checkbox/checkbox.vue";
import WizardTaxAndServiceAPI from "@/services/api/wizard/tax-and-service";
import CSelect from "@/components/select/select.vue";
import checklistVue from "@/components/ag_grid-framework/checklist.vue";
import { getError } from "@/utils/general";
const wizardTaxAndService = new WizardTaxAndServiceAPI();

@Options({
  components: {
    CInput,
    CCheckbox,
    CModal,
    CSelect,
    AgGridVue,
  },
})
export default class TaxAndService extends Vue {
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
  showConfirmation: boolean = false;
  taxServices: any = null;
  paramsData: any;

  resetForm() {
    this.formElement.resetForm();
    this.form = {
      tax: 10,
      service: 10,
      service_tax: 10,
      code: "TS01",
    };
  }

  onSubmit() {
    this.update();
  }

  handleSave() {
    this.formElement.$el.requestSubmit();
  }

  async handleEdit(paramsData: any) {
    this.modeData = 1;
    await this.edit();
  }

  onChange() {
    this.$emit("change", this.form);
  }

  // API =========================================================================================
  async getList() {
    try {
      const { data } = await wizardTaxAndService.getList();
      this.taxServices = data ?? [];
    } catch (error) {
      getError(error);
    }
  }

  async edit() {
    try {
      const { data } = await wizardTaxAndService.edit();
      if (data && data.id > 0) {
        this.form = data;
      }
    } catch (error) {
      getError(error);
    }
  }

  async update() {
    try {
      await wizardTaxAndService.update(this.form);
    } catch (error) {
      getError(error);
    }
  }

  mounted() {
    this.resetForm();
    this.getList();
    this.edit();
  }

  get disabledActionGrid() {
    return this.showForm;
  }

  get schema() {
    return Yup.object().shape({
      Default: Yup.string().required(),
      Tax: Yup.number().test((val) => val < 100),
      Service: Yup.number().test((val) => val < 100),
      "Service Tax": Yup.number().test((val) => val < 100),
    });
  }

  get title() {
    return (this.modeData == 1 ? "Update " : "Insert ") + " Tax & Service";
  }
}
