import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import Checklist from "@/components/ag_grid-framework/checklist.vue";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import StatusBarTotalRenderer from "@/components/ag_grid-framework/statusbar_total.vue";
import CDialog from "@/components/dialog/dialog.vue";
import CModal from "@/components/modal/modal.vue";
import TrainingAPI from "@/services/api/training/training";
import { formatDateTimeUTC, formatNumber } from "@/utils/format";
import {
  generateIconContextMenuAgGrid,
  generateTotalFooterAgGrid,
  getError,
} from "@/utils/general";
import $global from "@/utils/global";
import { getToastSuccess } from "@/utils/toast";
import SearchFilter from "@/views/pages/components/filter/filter.vue";
import "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import { ref } from "vue";
import { Options, Vue } from "vue-class-component";
import InputForm from "./training-input-form/training-input-form.vue";

const trainingAPI = new TrainingAPI();

@Options({
  components: {
    CModal,
    AgGridVue,
    InputForm,
    CDialog,
    SearchFilter,
  },
})
export default class Training extends Vue {
  public rowData: any = [];
  public showForm: boolean = false;
  public modeData: any;
  public form: any = {};
  public inputFormElement: any = ref();
  public showDialog: boolean = false;
  public showDialog2: boolean = false;
  public deleteParam: any;
  public searchOptions: any;
  public formType: any;
  searchDefault: any = {
    index: 0,
    text: "",
    filter: [1],
  };
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
  // GENERAL FUNCTION ================================================================
  handleSave(formData: any) {
    formData.date_posting = formatDateTimeUTC(formData.date_posting);
    formData.date_return = formatDateTimeUTC(formData.date_return);
    formData.color = parseInt(formData.color);
    formData.is_lost = parseInt(formData.is_lost);
    formData.is_return = parseInt(formData.is_return);
    formData.value = parseInt(formData.value);
    if (this.modeData == $global.modeData.insert) {
      this.insertData(formData);
    } else if (this.modeData == $global.modeData.edit) {
      this.updateData(formData);
    }
  }
  async handleEdit(params: any) {
    this.showDialog2 = true;
    this.modeData = $global.modeData.edit;
    await this.loadEditData(params.id);
    this.modeData = $global.modeData.edit;
    await this.loadEditData(params.id);
  }
  handleDelete(params: any) {
    this.showDialog = true;
    this.deleteParam = params.id;
  }

  handleInsertDetail1(paramsData: any) {
    alert(paramsData);
  }

  handleInsertDetail2(paramsData: any) {
    alert(paramsData);
  }

  refreshData(search: any) {
    this.loadDataGrid(search);
  }
  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================
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
      {
        name: this.$t("commons.contextMenu.update"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("edit_icon24"),
        action: () => this.handleShowForm(this.paramsData, 1),
      },
      {
        name: this.$t("commons.contextMenu.delete"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("delete_icon24"),
        action: () => this.handleDelete(this.paramsData),
      },
      "separator",
      {
        name: this.$t("commons.contextMenu.trackingData"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("tracking_icon24"),
        action: () => this.handleShowForm(this.paramsData, 2),
      },
    ];
    return result;
  }
  handleRowRightClicked() {
    if (this.paramsData) {
      const vm = this;
      vm.gridApi.forEachNode((node: any) => {
        if (node.data) {
          if (node.data.id_log == vm.paramsData.id_log) {
            node.setSelected(true, true);
          }
        }
      });
    }
  }

  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================
  handleShowForm(params: any, mode: any) {
    // this.loadDropdown();
    this.inputFormElement.initialize();
    this.modeData = mode;
    this.showForm = true;
  }
  // END HANDLE UI====================================================================
  // API REQUEST======================================================================
  async loadDataGrid(search: any = this.searchDefault) {
    try {
      let params = {
        Index: search.index,
        Text: search.text,
        IndexCheckBox: search.filter[0],
      };
      const { data } = await trainingAPI.GetLostAndFoundList(params);
      this.rowData = data;
    } catch (error) {}
  }

  async insertData(formData: any) {
    try {
      const { status2 } = await trainingAPI.InsertLostAndFound(formData);
      if (status2.status == 0) {
        getToastSuccess(this.$t("messages.saveSuccess"));
        this.showForm = false;
        //         this.loadDataGrid(this.searchDefault)
        // =======
        this.loadDataGrid();
      }
    } catch (error) {
      getError(error);
    }
  }

  // untuk load data di form edit, ketika akan diedit
  async loadEditData(params: any) {
    try {
      const { data } = await trainingAPI.GetLostAndFound(params);
      this.inputFormElement.form = data;
      this.showForm = true;
    } catch (error) {
      getError(error);
    }
  }

  async updateData(formData: any) {
    try {
      // Optional : kalau misal code as primary key dan ditampilkan di web, maka saat insert data kembali harus ditimpa kembali
      // formData.code = this.form.code
      const { status2 } = await trainingAPI.UpdateLostAndFound(formData);
      if (status2.status == 0) {
        this.loadDataGrid("");
        this.showForm = false;
        getToastSuccess(this.$t("messages.saveSuccess"));
      }
    } catch (error) {
      getError(error);
    }
  }
  async deleteData() {
    try {
      const { status2 } = await trainingAPI.DeleteLostAndFound(
        this.deleteParam
      );
      if (status2.status == 0) {
        this.loadDataGrid("");
        this.showDialog = false;
        getToastSuccess(this.$t("messages.deleteSuccess"));
      }
    } catch (error) {
      getError(error);
    }
  }
  // END API REQUEST==================================================================

  // RECYCLE LIFE FUNCTION ===========================================================
  // mounted() {
  //   this.loadDataGrid()
  // }

  beforeMount() {
    this.searchOptions = [
      { text: this.$t("commons.filter.Type"), value: 0 },
      { text: this.$t("commons.filter.item"), value: 1 },
      { text: this.$t("commons.filter.location"), value: 2 },
      { text: this.$t("commons.filter.who"), value: 3 },
      { text: this.$t("commons.filter.currentLocation"), value: 4 },
      { text: this.$t("commons.filter.returnBy"), value: 5 },
      { text: this.$t("commons.filter.owner"), value: 6 },
      { text: this.$t("commons.filter.phone"), value: 7 },
      { text: this.$t("commons.filter.notes"), value: 8 },
      { text: this.$t("commons.filter.createdBy"), value: 9 },
      { text: this.$t("commons.filter.updatedBy"), value: 10 },
    ];
    this.agGridSetting = $global.agGrid;
    this.gridOptions = {
      actionGrid: {
        menuDropdown: true,
        menu: true,
        insert: true,
        correction: true,
        void: true,
        duplicate: true,
        delete: true,
        edit: true,
        insertDetail1: {
          title: "Insert Breakdown",
        },
        insertDetail2: {
          title: "Insert Package",
        },
      },
      rowHeight: $global.agGrid.rowHeightDefault,
      headerHeight: $global.agGrid.headerHeight,
    };
    this.columnDefs = [
      // suppressMenu: true >> untuk mematikan fungsi pencarian di dlm table (logo: burger menu di dlm table)
      // enableRowGroup: true >> untuk drag grouping
      // rowGroup >> auto drag group
      // lockPosition: 'left' >> supaya column tidak bisa dipindahkan
      // checkbox, tgl, header : rata tengah; text : kiri (default); angka: kanan
      {
        headerName: this.$t("commons.table.action"),
        headerClass: "align-header-center",
        cellClass: "action-grid-buttons",
        field: "id",
        enableRowGroup: false,
        resizable: false,
        filter: false,
        suppressMenu: true,
        lockPosition: "left",
        sortable: false,
        cellRenderer: "actionGrid",
        colId: "params",
        width: 300,
      },
      {
        headerName: this.$t("commons.table.type"),
        field: "Type",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.itemLostOrFound"),
        field: "item",
        width: 140,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.who"),
        textTotal: "ada",
        field: "who",
        width: 140,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.value"),
        headerClass: "align-header-right",
        sumTotal: true,
        field: "value",
        width: 100,

        enableRowGroup: true,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        cellStyle: { textAlign: "right" },
      },
      // ------------------end need setting manual for column table-----------------//
    ];
    this.context = { componentParent: this };
    this.frameworkComponents = {
      actionGrid: ActionGrid,
      iconLockRenderer: IconLockRenderer,
      checklistRenderer: Checklist,
      statusBarTotalRenderer: StatusBarTotalRenderer,
    };
    this.rowGroupPanelShow = "always";
    this.statusBar = {
      statusPanels: [
        { statusPanel: "agTotalAndFilteredRowCountComponent", align: "left" },
        { statusPanel: "agTotalRowCountComponent", align: "center" },
        { statusPanel: "agFilteredRowCountComponent" },
        { statusPanel: "agSelectedRowCountComponent" },
        { statusPanel: "agAggregationComponent" },
      ],
    };
    this.paginationPageSize = this.agGridSetting.limitDefaultPageSize;
    this.rowSelection = "single";
    this.rowModelType = "serverSide";
    this.limitPageSize = this.agGridSetting.limitDefaultPageSize;
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }
  // END RECYCLE LIFE FUNCTION =======================================================

  // GETTER AND SETTER
  get pinnedBottomRowData() {
    return generateTotalFooterAgGrid(this.rowData, this.columnDefs);
  }

  // VALIDATION
  // get schema() {
  //   return Yup.object().shape({
  //     Item: Yup.string().required(),
  //     Color: Yup.string(),
  //     Location: Yup.string(),
  //     Who: Yup.string(),
  //     Value: Yup.string(),
  //     currentLocation: Yup.string(),
  //     Date: Yup.string().required(),
  //   });
  // }
  // END GETTER AND SETTER
}
