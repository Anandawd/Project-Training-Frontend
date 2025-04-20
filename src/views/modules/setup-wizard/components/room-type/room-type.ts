import { Options, Vue } from "vue-class-component";
import "vue3-form-wizard/dist/style.css";
import CInput from "@/components/input/input.vue";
import { AgGridVue } from "ag-grid-vue3";
import CModal from "@/components/modal/modal.vue";
import * as Yup from "yup";
import { GridApi, GridOptions } from "ag-grid-community";
import action_gridVue from "@/components/ag_grid-framework/action_grid.vue";
import { getToastInfo } from "@/utils/toast";
import WizardRoomTypeAPI from "@/services/api/wizard/room-type";
import { anyToFloat, getError } from "@/utils/general";
const wizardRoomTypeAPI = new WizardRoomTypeAPI();

@Options({
  components: {
    CInput,
    CModal,
    AgGridVue,
  },
})
export default class RoomType extends Vue {
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
  paramsData: any;
  showConfirmation: boolean = false;

  getRowNodeId(params: any) {
    return params.id;
  }

  resetForm() {
    this.form = {};
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
      const isExist = rows.find((val) => val.code == this.form.code);
      if (isExist) {
        getToastInfo(`Code ${this.form.code} is exist`);
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
    this.delete(this.paramsData.code);
  }

  handleEdit(paramsData: any) {
    this.modeData = 1;
    this.edit(paramsData.id);
  }

  async handleDuplicate(paramsData: any) {
    this.modeData = 2;
    await this.edit(paramsData.id);
    this.form.code = "";
  }
  // API =========================================================================================
  async getList() {
    try {
      const { data } = await wizardRoomTypeAPI.getList();
      this.rowData = data ?? [];
      this.$emit("change", this.rowData);
    } catch (error) {
      getError(error);
    }
  }

  async edit(id: number) {
    try {
      const { data } = await wizardRoomTypeAPI.edit(id);
      this.form = data;
      this.showForm = true;
    } catch (error) {
      getError(error);
    }
  }

  async insert() {
    try {
      await wizardRoomTypeAPI.insert(this.form);
      this.getList();
    } catch (error) {
      getError(error);
    }
  }

  async update() {
    try {
      await wizardRoomTypeAPI.update(this.form);
      this.getList();
    } catch (error) {
      getError(error);
    }
  }

  async delete(code: string) {
    try {
      await wizardRoomTypeAPI.delete(code);
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
        headerName: this.$t("commons.table.code"),
        headerClass: "align-header-center",
        field: "code",
        width: 100,
        cellStyle: { textAlign: "center" },
      },
      {
        headerName: this.$t("commons.table.name"),
        headerClass: "align-header-center",
        field: "name",
        cellStyle: { textAlign: "center" },
        width: 200,
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
      Code: Yup.string()
        .matches(
          /^[a-zA-Z0-9-_\.]+$/,
          "Code must only contain alphanumeric characters or the '-' symbol"
        )
        .required()
        .test((val) => val.length < 5),
      Name: Yup.string().required(),
      "ID sort": null,
    });
  }

  get title() {
    return (this.modeData == 1 ? "Update " : "Insert ") + " Room Type";
  }
}
