import { Options, Vue } from "vue-class-component";
import { AgGridVue } from "ag-grid-vue3";

import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import SearchFilter from "@/views/pages/components/filter/filter.vue";
import { generateIconContextMenuAgGrid, getError } from "@/utils/general";
import Select from "@/components/select/select.vue";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import CInput from "@/components/input/input.vue";
import $global from "@/utils/global";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import ConfigurationResource from "@/services/api/configuration/configuration-resource";
import InputForm from "../components/input-form/input-form.vue";
import { reactive, ref } from "vue";
import { getToastSuccess } from "@/utils/toast";
import CDialog from "@/components/dialog/dialog.vue";
import { formatDateTime } from "@/utils/format";
import * as Yup from "yup";
import VueI18n from "vue-i18n";
// manggil database
const resourceAPI = new ConfigurationResource("SalesSalary");

@Options({
  components: {
    CDialog,
    InputForm,
    Select,
    CDatepicker,
    CInput,
    AgGridVue,
    // "search-filter": SearchFilter,
    SearchFilter,
  },
})
export default class SalesSalary extends Vue {
  public rowData: any = [];
  public form: any = reactive({});
  public inputFormElement: any = ref();
  public showForm: boolean = false;
  public showDialog: boolean = false;
  public options: any = {};
  public showFormType: number = 0;
  public modeData: any = 0;
  deleteCode: any = "";
  searchDefault: any = {
    searchBy: 1,
    keyword: "",
  };
  searchOptions: any = [];
  // Ag grid variable
  gridOptions: any = {};
  columnDefs: any;
  context: any;
  frameworkComponents: any;
  rowGroupPanelShow: string;
  statusBar: any;
  paginationPageSize: any;
  rowSelection: string;
  rowModelType: string;
  limitPageSize: any;
  gridApi: any;
  paramsData: any;
  ColumnApi: any;
  agGridSetting: any;
  folioNumber: any;
  global: any;

  beforeMount() {
    this.searchOptions = [
      // untuk melakukan pencarian ini, sebenarnya data yg bisa kita cari itu ditentukan oleh bagian backendnya
      { text: this.$t("commons.table.code"), value: 0 },
      { text: this.$t("commons.table.amount"), value: 1 },
      { text: this.$t("commons.table.remark"), value: 2 },
    ];
    this.agGridSetting = $global.agGrid;

    this.columnDefs = [
      {
        headerName: this.$t("commons.table.action"),
        field: "action",
        cellRenderer: "actionGrid",
        colId: "params",
        width: 100,
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center-suppress-menu",
      },
      { headerName: this.$t("commons.table.code"), field: "code", width: 110 },
      {
        headerName: this.$t("commons.table.amount"),
        field: "amount",
        width: 100,
      },
      {
        headerName: this.$t("commons.table.remark"),
        field: "remark",
        width: 100,
      },
      {
        header: this.$t("commonst.table.createdAt"),
        field: "created_at",
        width: 120,
        valueFormatter: formatDateTime,
        filterParams: {
          valueFormatter: formatDateTime,
        },
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
      },
      {
        header: this.$t("commons.table.createdBy"),
        field: "created_by",
        width: 100,
      },
      {
        header: this.$t("commons.table.updatedAt"),
        field: "updated_at",
        width: 120,
        valueFormatter: formatDateTime,
        filterParams: {
          valueFormatter: formatDateTime,
        },
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
      },
      {
        header: this.$t("commons.table.updatedBy"),
        field: "updated_by",
        width: 100,
      },
    ];

    // ?
    this.context = { componentParent: this };
    this.frameworkComponents = {
      actionGrid: ActionGrid,
      IconLockRenderer: IconLockRenderer,
    };

    this.rowSelection = "single";
    this.rowModelType = "serverSide";
    this.limitPageSize = this.agGridSetting.limitDefaultPageSize;
  }

  mounted() {
    this.gridApi = this.gridOptions.api;
    this.ColumnApi = this.gridOptions.columnApi;
    this.loadData(this.searchDefault);
  }

  // ?
  getContextMenu(params: any) {
    const { node } = params;
    if (node) {
      this.paramsData = node.data;
    } else {
      this.paramsData = null;
    }
    const result = [
      {
        name: this.$t("commons.contextMenu.insert"),
        icon: generateIconContextMenuAgGrid("add_icon24"),
        action: () => this.handleShowForm("", 0),
      },
    ];
    return result;
  }

  closeDialog() {
    this.showDialog = false;
  }

  refreshData(search: any) {
    this.loadData(search);
  }

  handleShowForm(params: any, mode: any) {
    this.loadDropdown();
    this.inputFormElement.initialize();
    this.modeData = mode;
    this.showForm = true;
  }

  handleDelete(params: any) {
    this.showDialog = true;
    // memasukkan id dari array/colomn
    this.deleteCode = params.code;
  }

  async handleEdit(params: any) {
    this.modeData = $global.modeData.edit;
    await this.editData(params.code);
  }

  handleSave(formData: any) {
    // console.log(formData)
    // kayak prepareForValidation laravel, kita ubah dulu datanya sebelum masuk ke dlm db
    formData.amount = parseFloat(formData.amount);
    if (this.modeData == $global.modeData.insert) {
      this.insertData(formData);
    } else if (this.modeData == $global.modeData.edit) {
      this.updateData(formData);
    }
  }

  // API
  async loadData(search: any = this.searchDefault) {
    try {
      let params = {
        Index: search.searchBy,
        Text: search.keyword,
      };
      const { data } = await resourceAPI.list(params);
      this.rowData = data;
    } catch (error) {
      getError(error);
    }
  }

  async editData(code: any) {
    try {
      this.loadDropdown();
      let { data } = await resourceAPI.edit(code);
      if (data) {
        this.inputFormElement.isUsed = data.is_used;
        data = data.data;
      } else {
        return;
      }
      this.form = data;
      this.inputFormElement.form = data;
      this.showForm = true;
    } catch (error) {
      getError(error);
    }
  }

  async updateData(formData: any) {
    // isinya berupa data yg sudah tersimpan di dlm database
    // console.log(formData)
    try {
      formData.code = this.form.code;
      formData.amount = this.form.amount;
      formData.remark = this.form.remark;
      formData.is_system = false;
      const { status2 } = await resourceAPI.update(formData);
      if (status2.status == 0) {
        this.loadData();
        this.showForm = false;
        getToastSuccess(this.$t("messages.saveSuccess"));
      }
    } catch (error) {
      getError(error);
    }
  }

  async insertData(formData: any) {
    try {
      console.log(formData);
      // penamaan const object
      // kita tampung dulu datanya di sini, lalu cek statusnya
      const { status2 } = await resourceAPI.create(formData);
      if (status2.status == 0) {
        this.loadData();
        this.showForm = false;
        getToastSuccess(this.$t("messages.saveSuccess"));
      }
    } catch (error) {
      getError(error);
    }
  }

  async loadDropdown() {
    // ?
    // console.log(this.inputFormElement.listDropdown)
    try {
      // codeNameList >> return request untuk get link dari table Sales (function ini berasal dari file configuration-resource.ts)
      const { data } = await resourceAPI.codeNameList("Sales");
      console.log(data);
      this.inputFormElement.listDropdown.sales = data;
    } catch (error) {
      getError(error);
    }
  }

  async deleteData() {
    try {
      const { status2 } = await resourceAPI.delete(this.deleteCode);
      // jika berhasil nanti akan muncul >> status: 0, message: ""
      // status: 0 > sudah diset oleh bagian backendnya yg berarti "sukses"
      // console.log(status2)
      if (status2.status == 0) {
        this.loadData();
        this.showDialog = false;
        getToastSuccess(this.$t("messages.deleteSuccess"));
      }
    } catch (error) {
      getError(error);
    }
  }

  // Validation
  get schema() {
    return Yup.object().shape({
      Code: Yup.string()
        .matches(
          /^[a-zA-Z0-9-_\.]+$/,
          "Code must only contain alphanumeric characters or the '-', '_', '.' symbols"
        )
        .required(),
      // amount >> float
      Amount: Yup.string().required(),
    });
  }
}
