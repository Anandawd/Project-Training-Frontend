import { Options, Vue } from "vue-class-component";
import { FormWizard, TabContent } from "vue3-form-wizard";
import "vue3-form-wizard/dist/style.css";
import CInput from "@/components/input/input.vue";
import { AgGridVue } from "ag-grid-vue3";
import CModal from "@/components/modal/modal.vue";
import * as Yup from "yup";
import { GridApi, GridOptions } from "ag-grid-community";
import action_gridVue from "@/components/ag_grid-framework/action_grid.vue";
import CSelect from "@/components/select/select.vue";
import CCheckbox from "@/components/checkbox/checkbox.vue";
import { getToastInfo } from "@/utils/toast";
import WizardRoomAPI from "@/services/api/wizard/room";
import { anyToFloat, getError } from "@/utils/general";
const wizardRoomAPI = new WizardRoomAPI();

@Options({
  components: {
    FormWizard,
    TabContent,
    CInput,
    CModal,
    AgGridVue,
    CSelect,
    CCheckbox,
  },
  props: {
    bedTypeList: Array,
    roomTypeList: Array,
    roomViewList: Array,
  },
})
export default class Room extends Vue {
  gridOptions: any = null;
  columnDefs: any = null;
  rowData: any = [];
  form: any = {
    room_view_code: "",
  };
  showForm: boolean = false;
  gridApi: GridApi;
  formElement: any = null;
  frameworkComponents: any = null;
  context: any = null;
  modeData: any = null;
  options: any = {};
  paramsData: any;
  showConfirmation: boolean = false;

  getRowNodeId(params: any) {
    return params.id;
  }

  resetForm() {
    this.form = {};
    this.getComboList();
  }

  getRows(): any[] {
    let data: any = [];
    this.gridApi.forEachNode((node) => {
      data.push(node.data);
    });
    return data;
  }

  onSubmit() {
    let rows = this.getRows();
    this.form.id_sort = anyToFloat(this.form.id_sort);
    if (this.modeData == 0 || this.modeData == 2) {
      const isExist = rows.find((val) => val.number == this.form.number);
      if (isExist) {
        getToastInfo(`Number ${this.form.number} is exist`);
        return;
      }
      this.insert();
    } else {
      this.update();
    }
    this.showForm = false;
    this.resetForm();
  }

  handleInsert() {
    this.resetForm();
    this.form.id_sort = this.rowData.length + 1;
    this.modeData = 0;
    this.showForm = true;
  }

  handleSave() {
    this.formElement.$el.requestSubmit();
  }

  handleDelete(paramsData: any) {
    this.paramsData = paramsData;
    this.showConfirmation = true;
  }

  onDelete() {
    this.delete(this.paramsData.id);
  }

  async handleEdit(paramsData: any) {
    this.modeData = 1;
    this.getComboList();
    await this.edit(paramsData.id);
  }

  async handleDuplicate(paramsData: any) {
    this.modeData = 2;
    this.getComboList();
    await this.edit(paramsData.id);
    this.form.number = "";
  }

  // API =========================================================================================
  async getList() {
    try {
      const { data } = await wizardRoomAPI.getList();
      this.rowData = data ?? [];
      this.$emit("change", this.rowData);
    } catch (error) {
      getError(error);
    }
  }

  async edit(number: string) {
    try {
      const { data } = await wizardRoomAPI.edit(number);
      this.form = data;
      this.showForm = true;
    } catch (error) {
      getError(error);
    }
  }

  async getComboList() {
    try {
      const { data } = await wizardRoomAPI.getComboList();
      this.options = data;
    } catch (error) {
      getError(error);
    }
  }

  async insert() {
    try {
      await wizardRoomAPI.insert(this.form);
      this.getList();
    } catch (error) {
      getError(error);
    }
  }

  async update() {
    try {
      await wizardRoomAPI.update(this.form);
      this.getList();
    } catch (error) {
      getError(error);
    }
  }

  async delete(id: any) {
    try {
      await wizardRoomAPI.delete(id);
      this.getList();
    } catch (error) {
      getError(error);
    }
  }
  // END API======================================================================================

  beforeMount() {
    this.gridOptions = {
      actionGrid: {
        duplicate: true,
        delete: true,
        edit: true,
      },
      rowHeight: this.$global.agGrid.rowHeightDefault,
      headerHeight: this.$global.agGrid.headerHeight,
    };
    this.context = { componentParent: this };
    this.columnDefs = [
      {
        headerName: this.$t("commons.table.action"),
        headerClass: "align-header-center",
        width: 100,
        cellRenderer: "actionGrid",
        cellStyle: { textAlign: "center" },
      },
      {
        headerName: this.$t("commons.table.code"),
        headerClass: "align-header-center",
        field: "index",
        width: 100,
        hide: true,
        cellStyle: { textAlign: "center" },
      },
      {
        headerName: this.$t("commons.table.room#"),
        headerClass: "align-header-center",
        field: "number",
        width: 100,
        cellStyle: { textAlign: "center" },
      },
      {
        headerName: this.$t("commons.table.roomTypeCode"),
        // headerClass: "align-header-center",
        field: "room_type_code",
        // cellStyle: { textAlign: "center" },
        width: 120,
      },
      {
        headerName: this.$t("commons.table.bedTypeCode"),
        // headerClass: "align-header-center",
        field: "bed_type_code",
        // cellStyle: { textAlign: "center" },
        width: 120,
      },
      // {
      //   headerName: this.$t("commons.table.roomViewCode"),
      //   // headerClass: "align-header-center",
      //   field: "view_code",
      //   // cellStyle: { textAlign: "center" },
      //   width: 120,
      // },
      {
        headerName: this.$t("commons.table.building"),
        // headerClass: "align-header-center",
        field: "building",
        // cellStyle: { textAlign: "center" },
        width: 100,
      },
      {
        headerName: this.$t("commons.table.floor"),
        // headerClass: "align-header-center",
        field: "floor",
        // cellStyle: { textAlign: "center" },
        width: 100,
      },
      {
        headerName: this.$t("commons.table.smoking"),
        // headerClass: "align-header-center",
        field: "is_smoking",
        // cellStyle: { textAlign: "center" },
        width: 100,
      },
      {
        headerName: this.$t("commons.table.idSort"),
        headerClass: "align-header-center",
        field: "id_sort",
        cellStyle: { textAlign: "center" },
        width: 100,
      },
      // ------------------end need setting manual for column table-----------------//
    ];

    this.frameworkComponents = {
      actionGrid: action_gridVue,
    };

    this.getList();
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  get schema() {
    return Yup.object().shape({
      Number: Yup.string()
        .required()
        .test((val) => val.length <= 20),
      "Room Type": Yup.string().required(),
      "Bed Type": Yup.string().required(),
      Building: Yup.string().required(),
      Floor: Yup.string().required(),
      "ID sort": Yup.string().required(),
    });
  }

  get title() {
    return (this.modeData == 1 ? "Update " : "Insert ") + " Room";
  }
}
