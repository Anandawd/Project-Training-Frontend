import { Options, Vue } from "vue-class-component";
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-enterprise";
import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import SearchFilter from "@/views/pages/components/filter/filter.vue";
import {
  generateIconContextMenuAgGrid,
  getError,
  rowSelectedAfterRefresh,
} from "@/utils/general";
import CSelect from "@/components/select/select.vue";
import CCheckbox from "@/components/checkbox/checkbox.vue";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import CInput from "@/components/input/input.vue";
import CRadio from "@/components/radio/radio.vue";
import $global from "@/utils/global";
import { Form } from "vee-validate";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import ConfigurationResource from "@/services/api/configuration/configuration-resource";
import TransactionAPI from "@/services/api/transaction";
import { reactive, ref } from "vue";
import { getToastSuccess } from "@/utils/toast";
import CDialog from "@/components/dialog/dialog.vue";
import Checklist from "@/components/ag_grid-framework/checklist.vue";
import { formatDateTime, formatNumber } from "@/utils/format";
import configStore from "@/stores/config";
import * as Yup from "yup";
import { focusOnInvalid, setInputFocus } from "@/utils/validation";

const resourceAPI = new ConfigurationResource("RoomRateBreakdown");
const transactionAPI = new TransactionAPI();

@Options({
  components: {
    Form,
    CCheckbox,
    CDialog,
    CSelect,
    CDatepicker,
    CInput,
    AgGridVue,
    SearchFilter,
    CRadio,
  },
})
export default class Breakdown extends Vue {
  private config = configStore();
  public rowData: any = [];
  public form: any = reactive({});
  public code: string = null;
  public formElement: any = ref();
  public showForm: boolean = false;
  public showDialog: boolean = false;
  public disableForm: boolean = false;
  public isSaving: boolean = false;
  public options: any = {};
  public showFormType: number = 0;
  public modeData: any = 0;
  focus : boolean = false
  Account: any = [];
  deleteCode: any = "";
  searchDefault: any = {
    index: 1,
    text: "",
  };
  listDropdown = {};
  searchOptions: any = [];
  detailRowAutoHeight: boolean = true;
  columnOptionsAccount = [
    {
      label: "code",
      field: "code",
      align: "left",
      width: "100",
      filter: true,
    },
    {
      label: "name",
      field: "name",
      align: "left",
      width: "120",
      filter: true,
    },
  ];

  folioNumber: any;
  global: any;
  selectedCode: any = {};
  subGroupCode: any = "";
  // GENERAL FUNCTION ================================================================
  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================

  async resetForm() {
    this.formElement.resetForm();
    await this.$nextTick();
    this.form = {
      amount: 0,
      charge_frequency_code: "1",
      extra_pax: 0,
      include_child: 0,
      is_amount_percent: 0,
      max_pax: 1,
      per_pax: 0,
      per_pax_extra: 0,
      quantity: 1,
      sub_department_code: this.sdFrontOffice,
      room_rate_code: this.code,
    };
    setInputFocus()
  }

  onChangeAccount(event: any) {
    const code = event.target.value;
    this.getAccountSubGroup(code);
    this.setAccountName(code);
  }

  setAccountName(code: number) {
    this.form.account = "";
    for (const i of this.Account) {
      if (i.code == code) {
        this.selectedCode = i;
        this.form.account = i.name;
      }
    }
  }

  onSubmit() {
    this.formElement.$el.requestSubmit();
  }

  onInvalidSubmit() {
    focusOnInvalid();
  }

  // onChangePerPaxExtra(){
  //   this.disableForm = false
  //   if(this.form.per_pax_extra === 1 ){
  //     this.disableForm = true
  //   }
  //   this.onChangePerPax()
  // }

  onChangePerPax() {
    this.form.max_pax = 1;
    if (this.form.per_pax) {
      this.form.max_pax = 1;
      this.form.quantity = 1;
    } else {
      this.form.include_child = 0;
    }
  }

  handleShowForm(params: any, mode: any) {
    this.resetForm();
    this.loadDropdown();
    this.modeData = mode;
    this.showForm = true;
  }

  async handleEdit(params: any) {
    this.onChangePerPax();
    this.onChangePerPax();
    await this.loadDropdown();
    this.modeData = $global.modeData.edit;
    await this.editData(params.id);
    this.getAccountSubGroup(this.form.account_code);
    this.setAccountName(this.form.account_code);
  }

  async handleDuplicate(params: any) {
    await this.loadDropdown();
    this.modeData = $global.modeData.duplicate;
    await this.editData(params.id);
    this.setAccountName(this.form.account_code);
  }

  async handleSave() {
    this.isSaving = true;
    this.form.amount = parseFloat(this.form.amount);
    this.form.quantity = parseFloat(this.form.quantity);
    this.form.per_pax = parseInt(this.form.per_pax);
    this.form.include_child = parseInt(this.form.include_child);
    this.form.extra_pax = parseFloat(this.form.extra_pax);
    this.form.max_pax = parseInt(this.form.max_pax);
    this.form.is_amount_percent = parseInt(this.form.is_amount_percent);
    if (this.modeData == $global.modeData.insert) {
      await this.insertData(this.form);
    } else if (this.modeData == $global.modeData.edit) {
      await this.updateData(this.form);
    } else if (this.modeData == $global.modeData.duplicate) {
      await this.insertData(this.form);
    }
    this.isSaving = false;
  }

  onClose() {
    this.showForm = false;
    this.$emit("close");
  }
  // END HANDLE UI====================================================================
  // API REQUEST======================================================================
  async editData(code: any) {
    try {
      let { data } = await resourceAPI.edit(code);
      if (data) {
        data = data.data;
      } else {
        return;
      }
      this.form = data;
      this.showForm = true;
    } catch (error) {
      getError(error);
    }
  }

  async getAccountSubGroup(code: any) {
    if (!code) return;
    this.subGroupCode = "";
    try {
      const { data } = await transactionAPI.getAccountSubGroupByAccountCode1(
        code
      );
      this.subGroupCode = data;
    } catch (error) {
      getError(error);
    }
  }

  async updateData(form: any) {
    try {
      const { status2 } = await resourceAPI.update(form);
      if (status2.status == 0) {
        this.showForm = false;
        this.$emit("update");
        getToastSuccess(this.$t("messages.saveSuccess"));
      }
    } catch (error) {
      getError(error);
    }
  }

  async insertData(form: any) {
    try {
      const { status2 } = await resourceAPI.create(form);
      if (status2.status == 0) {
        this.showForm = false;
        this.$emit("save");
        getToastSuccess(this.$t("messages.saveSuccess"));
      }
    } catch (error) {
      getError(error);
    }
  }

  async loadDropdown() {
    try {
      const params = [
        "Outlet",
        "Product",
        "SubDepartment",
        "Account",
        "BusinessSource",
        "TaxAndService",
        "ChargeFrequency",
        "Company",
      ];
      const { data } = await resourceAPI.codeNameListArray(params);
      this.listDropdown = data;
      this.Account = data.Account;
    } catch (error) {
      getError(error);
    }
  }

  // END API REQUEST==================================================================
  // RECYCLE LIFE FUNCTION ===========================================================
  // END RECYCLE LIFE FUNCTION =======================================================
  // GETTER AND SETTER ===============================================================
  get sdFrontOffice() {
    return this.config.sdFrontOffice;
  }
  //Validation
  get schemaBreakdown() {
    return Yup.object().shape({
      "Sub Department": Yup.string().required(),
      Account: Yup.string().required(),
      Quantity: Yup.number().required().min(1),
      Amount: Yup.number().required().min(1),
      "Charge Frequency": Yup.string().required(),
    });
  }

  get title() {
    if (this.modeData === $global.modeData.insert) {
      return `${this.$t("commons.insert")} ${this.$t(
        `${this.$t("title.breakdown")}`
      )}`;
    } else if (this.modeData === $global.modeData.edit) {
      return `${this.$t("commons.update")} ${this.$t(
        `${this.$t("title.breakdown")}`
      )}`;
    } else if (this.modeData === $global.modeData.duplicate) {
      return `${this.$t("commons.duplicate")} ${this.$t(
        `${this.$t("title.breakdown")}`
      )}`;
    }
  }
  // END GETTER AND SETTER ===========================================================
}
