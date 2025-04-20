import { Options, Vue } from "vue-class-component";
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-enterprise";
import CSelect from "@/components/select/select.vue";
import CInput from "@/components/input/input.vue";
import { Form } from "vee-validate";
import CCheckbox from "@/components/checkbox/checkbox.vue";
import CRadio from "@/components/radio/radio.vue";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import { BCard, BTabs, BTab, BCardText } from "bootstrap-vue-3";
import EncryptionHelper from "@/utils/crypto";
import UserSetting from "@/services/api/general/user-setting";
import AccessGroupHotel from "../access-group-hotel/access-group-hotel.vue";
import AccessGroupBanquet from "../access-group-banquet/access-group-banquet.vue";
import AccessGroupGeneral from "../access-group-general/access-group-general.vue";
import AccessGroupPos from "../access-group-pos/access-group-pos.vue";
import AccessGroupCrm from "../access-group-crm/access-group-crm.vue";
import AccessGroupAccounting from "../access-group-accounting/access-group-accounting.vue";
import AccessGroupAssets from "../access-group-assets/access-group-assets.vue";
import AccessGroupReport from "../access-group-report/access-group-report.vue";
import AccessGroupTools from "../access-group-tools/access-group-tools.vue";
import { anyToFloat, cloneObject, getError } from "@/utils/general";
import { getToastSuccess } from "@/utils/toast";
import * as Yup from "yup";
const userSetting = new UserSetting();
const encryptionHelper = new EncryptionHelper();

@Options({
  name: "InputForm",
  components: {
    // TransferForm,
    // {Form,
    BCardText,
    BCard,
    BTabs,
    BTab,
    "v-form": Form,
    CRadio,
    CSelect,
    CInput,
    AccessGroupBanquet,
    AccessGroupAssets,
    AccessGroupAccounting,
    AccessGroupGeneral,
    AccessGroupCrm,
    AccessGroupHotel,
    AccessGroupPos,
    AccessGroupReport,
    AccessGroupTools,
    CCheckbox,
    CDatepicker,
    AgGridVue,
  },
  props: { editData: Object },
  emits: ["save", "close"],
})
export default class InputForm extends Vue {
  public accessGroupGeneralForm: any = null;
  public accessGroupHotelForm: any = null;
  public accessGroupCRMForm: any = null;
  public accessGroupPointOfSalesForm: any = null;
  public accessGroupBanquetForm: any = null;
  public accessGroupAccountingForm: any = null;
  public accessGroupAssetsForm: any = null;
  public accessGroupReportForm: any = null;
  public accessGroupToolsForm: any = null;
  public accessForm: any = {};
  public editData: any;
  public inputFormElement: any = null;
  public accessLevel: any = [];
  accessLevelCode: any = "";
  code: any = "";
  isSaving: boolean;
  property: string = "";
  propertyList: any = [];

  uppercase() {
    this.code = this.code.toUpperCase();
  }

  resetForm() {
    this.accessForm = {
      general: {
        access_module: "",
      },
      hotel: {
        access_form: "",
        access_report: "",
        access_special: "",
        access_keylock: "",
        access_reservation: "",
        access_deposit: "",
        access_in_house: "",
        access_walk_in: "",
        access_folio: "",
        access_folio_history: "",
        access_floor_plan: "",
        access_company: "",
        access_invoice: "",
        access_member_voucher: "",
        access_payment_by_ap_ar: "",
        print_invoice_count: 1,
        sa_max_discount_percent: 0,
        sa_max_discount_amount: 0,
      },
      point_of_sales: {},
      accounting: {
        print_invoice_count: 1,
      },
      asset: {},
      crm: {},
      banquet: {},
      report: {},
      tools: {},
    };
  }

  async onSave() {
    if (this.isSaving) return;
    this.isSaving = true;
    if (!this.code) return;
    this.resetForm();

    //GENERAL
    for (const i in this.accessGroupGeneralForm.accessList) {
      this.accessForm.general[i] = "";
      for (const x in this.accessGroupGeneralForm.accessList[i]) {
        this.accessForm.general[i] +=
          this.accessGroupGeneralForm.access[i][x] ?? "0";
      }
    }
    //HOTEL
    for (const i in this.accessGroupHotelForm.accessList) {
      this.accessForm.hotel[i] = "";
      for (const x in this.accessGroupHotelForm.accessList[i]) {
        // console.log(i,this.accessGroupHotelForm.access[i][x])
        console.log(i, this.accessGroupHotelForm.access[i][x]);
        this.accessForm.hotel[i] +=
          this.accessGroupHotelForm.access[i][x] ?? "0";
      }
    }
    //CRM
    for (const i in this.accessGroupCRMForm.accessList) {
      this.accessForm.crm[i] = "";
      for (const x in this.accessGroupCRMForm.accessList[i]) {
        // console.log(i,this.accessGroupHotelForm.access[i][x])
        console.log(i, this.accessGroupCRMForm.access[i][x]);
        this.accessForm.crm[i] += this.accessGroupCRMForm.access[i][x] ?? "0";
      }
    }
    //POS
    for (const i in this.accessGroupPointOfSalesForm.accessList) {
      this.accessForm.point_of_sales[i] = "";
      for (const x in this.accessGroupPointOfSalesForm.accessList[i]) {
        this.accessForm.point_of_sales[i] +=
          this.accessGroupPointOfSalesForm.access[i][x] ?? "0";
      }
    }

    //BANQUET
    for (const i in this.accessGroupBanquetForm.accessList) {
      console.log("i", i);
      this.accessForm.banquet[i] = "";
      for (const x in this.accessGroupBanquetForm.accessList[i]) {
        // console.log("x", x);
        this.accessForm.banquet[i] +=
          this.accessGroupBanquetForm.access[i][x] ?? "0";
      }
    }

    //ACCOUNTING
    for (const i in this.accessGroupAccountingForm.accessList) {
      this.accessForm.accounting[i] = "";
      for (const x in this.accessGroupAccountingForm.accessList[i]) {
        this.accessForm.accounting[i] +=
          this.accessGroupAccountingForm.access[i][x] ?? "0";
      }
    }
    //ASSET
    for (const i in this.accessGroupAssetsForm.accessList) {
      this.accessForm.asset[i] = "";
      for (const x in this.accessGroupAssetsForm.accessList[i]) {
        this.accessForm.asset[i] +=
          this.accessGroupAssetsForm.access[i][x] ?? "0";
      }
    }
    //REPORT
    for (const i in this.accessGroupReportForm.accessList) {
      this.accessForm.report[i] = "";
      for (const x in this.accessGroupReportForm.accessList[i]) {
        this.accessForm.report[i] +=
          this.accessGroupReportForm.access[i][x] ?? "0";
      }
    }
    //TOOLS
    for (const i in this.accessGroupToolsForm.accessList) {
      this.accessForm.tools[i] = "";
      for (const x in this.accessGroupToolsForm.accessList[i]) {
        this.accessForm.tools[i] +=
          this.accessGroupToolsForm.access[i][x] ?? "0";
      }
    }
    this.accessForm.hotel.sa_max_discount_percent = anyToFloat(
      this.accessGroupHotelForm.access.sa_max_discount_percent
    );
    this.accessForm.hotel.sa_max_discount_amount = anyToFloat(
      this.accessGroupHotelForm.access.sa_max_discount_amount
    );
    this.accessForm.accounting.print_invoice_count = anyToFloat(
      this.accessGroupAccountingForm.access.print_invoice_count
    );
    const data = await this.encryptAccess();
    if (this.editData) {
      await this.updateUserGroup(data);
    } else {
      await this.insertUserGroup(data);
    }
    this.isSaving = false;
  }

  handleSave() {
    this.inputFormElement.$el.requestSubmit();
  }

  async encryptAccess() {
    let form: any = [];
    for (const i in this.accessForm) {
      form[i] = this.accessForm[i];
      for (const x in this.accessForm[i]) {
        if (
          x === "sa_max_discount_percent" ||
          x === "sa_max_discount_amount" ||
          x === "print_invoice_count" ||
          x === "code" ||
          x === "created_at" ||
          x === "created_by" ||
          x === "updated_at" ||
          x === "updated_by" ||
          x === "id" ||
          i === "code" ||
          i === "access_level_code"
        ) {
          if (
            x === "sa_max_discount_percent" ||
            x === "sa_max_discount_amount" ||
            x === "print_invoice_count"
          ) {
            form[i][x] = this.accessForm[i][x];
          }
          continue;
        }
        form[i][x] = await encryptionHelper.encrypt(
          this.accessForm[i][x],
          this.code
        );
      }
    }
    return form;
  }

  async decryptAccess(data: any) {
    let form: any = [];
    // console.log("data", data);
    for (const i in data) {
      form[i] = cloneObject(data[i]);
      // console.log("i", i);
      for (const x in data[i]) {
        // console.log("x", x);
        if (
          x === "sa_max_discount_percent" ||
          x === "sa_max_discount_amount" ||
          x === "print_invoice_count" ||
          x === "code" ||
          x === "is_active" ||
          x === "created_at" ||
          x === "created_by" ||
          x === "updated_at" ||
          x === "updated_by" ||
          x === "id" ||
          i === "code" ||
          i === "access_level_code"
        ) {
          if (
            x === "sa_max_discount_percent" ||
            x === "sa_max_discount_amount" ||
            x === "print_invoice_count"
          ) {
            form[i][x] = data[i][x];
          }
          continue;
        }
        if (data[i][x] == "") continue;
        const decrypted = await encryptionHelper.decrypt(data[i][x], this.code);
        form[i][x] = decrypted;
      }
    }
    return form;
  }

  //API ACCESS=============================================================================
  async insertUserGroup(form: any) {
    try {
      const params = {
        code: this.code,
        access_level_code: this.accessLevelCode,
        ...form,
      };
      await userSetting.insertUserGroupAccess(params);
      getToastSuccess();
      this.$emit("saved");
    } catch (err) {
      getError(err);
    }
  }

  async updateUserGroup(form: any) {
    try {
      const params = {
        id: this.editData.id,
        code: this.code,
        access_level_code: this.accessLevelCode,
        ...form,
      };
      await userSetting.updateUserGroupAccess(params);
      getToastSuccess();
      this.$emit("saved");
    } catch (err) {
      getError(err);
    }
  }

  async getUserAccessLevelList() {
    try {
      const { data } = await userSetting.getUserAccessLevelList();
      this.accessLevel = data;
    } catch (err) {
      getError(err);
    }
  }
  //END API ACCESS=========================================================================
  async mounted() {
    this.resetForm();
    this.getUserAccessLevelList();
    if (this.editData) {
      this.code = this.editData.code;
      this.accessLevelCode = this.editData.access_level_code;
      this.accessForm = await this.decryptAccess(this.editData);
      this.accessGroupGeneralForm.getAccessForm(this.accessForm.general);
      this.accessGroupHotelForm.getAccessForm(this.accessForm.hotel);
      this.accessGroupCRMForm.getAccessForm(this.accessForm.crm);
      this.accessGroupPointOfSalesForm.getAccessForm(
        this.accessForm.point_of_sales
      );
      this.accessGroupAccountingForm.getAccessForm(this.accessForm.accounting);
      this.accessGroupAssetsForm.getAccessForm(this.accessForm.asset);
      this.accessGroupBanquetForm.getAccessForm(this.accessForm.banquet);
      this.accessGroupReportForm.getAccessForm(this.accessForm.report);
      this.accessGroupToolsForm.getAccessForm(this.accessForm.tools);
    }
  }

  // Validation
  get schema() {
    return Yup.object().shape({
      Code: Yup.string()
        .matches(
          /^[a-zA-Z0-9-_\.]+$/,
          "Code must only contain alphanumeric characters, '-' or '_'"
        )

        .min(2)
        .max(20)
        .required(),
      AccessLevel: Yup.string().required(),
    });
  }
}
