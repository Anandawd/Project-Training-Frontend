import { Options, Vue } from "vue-class-component";
import CCheckbox from "@/components/checkbox/checkbox.vue";

import { AgGridVue } from "ag-grid-vue3";
import $global from "@/utils/global";
import { getError } from "@/utils/general";
import SelectEditor from "@/components/ag_grid-framework/select_editor.vue";
import TransactionAPI from "@/services/api/transaction";
import { getToastError, getToastSuccess } from "@/utils/toast";
const transactionAPI = new TransactionAPI();

@Options({
  components: {
    CCheckbox,
    AgGridVue,
  },
  props: {
    transactionType: String,
    folioNumber: {
      type: Number,
      require: true,
    },
  },
  emits: ["close", "save"],
})
export default class RoutingForm extends Vue {
  public formElement: any = null;
  public folioNumber: number;
  public rowData: any = [];
  public routingList: any;
  public transferExisting: boolean = false;
  public isSaving: boolean = false;
  public options: any = {};
  gridOptions: any = {};
  columnDefs: any = [];
  context: any = null;
  rowSelection: string = null;
  gridApi: any;
  gridColumnApi: any;
  frameworkComponents: any = null;

  beforeMount() {
    this.gridOptions = {
      ...$global.agGrid.defaultGridOptions,
    };
    // ------------------need setting manual for column table-----------------//
    // use this.$t("value") for transaltion localization------//
    // see value in @/lang/en.js //
    // see value in @/lang/en.js //
    this.columnDefs = [
      {
        headerName: this.$t("transaction.table.code"),
        field: "code",
        headerCheckboxSelection: true,
        checkboxSelection: true,
        width: 80,
      },
      {
        headerName: this.$t("transaction.table.name"),
        field: "name",
        width: 250,
      },
      {
        headerName: this.$t("commons.table.folio"),
        field: "folio_number",
        cellEditorSelector: (params: any) => {
          return {
            // component: 'agRichSelectCellEditor',
            component: "selectEditor",
            params: {
              values: this.options.folios,
              options: this.options.folios,
              keyName: "number",
              labelName: "number",
              columnOptions: [
                {
                  label: "number",
                  field: "number",
                  width: "100",
                  filter: true,
                },
                {
                  label: "fullName",
                  field: "full_name",
                  align: "left",
                  width: "200",
                  filter: true,
                },
                {
                  label: "room",
                  field: "room_number",
                  align: "left",
                  width: "100",
                  filter: true,
                },
                {
                  label: "type",
                  field: "name",
                  align: "left",
                  width: "100",
                  filter: true,
                },
              ],
              selectType: "column",
            },
            popup: false,
          };
        },
        editable: true,
        singleClickEdit: true,
        width: 200,
      },
      {
        headerName: this.$t("commons.table.subFolio"),
        field: "sub_folio_group_code",
        cellEditorSelector: (params: any) => {
          return {
            component: "selectEditor",
            params: {
              options: $global.subFolioGroup,
              keyName: "code",
              labelName: "code",
            },
            popup: false,
          };
        },
        editable: true,
        singleClickEdit: true,
        width: 100,
      },
    ];

    this.frameworkComponents = {
      selectEditor: SelectEditor,
    };

    // ------------------end need setting manual for column table-----------------//
    this.context = { componentParent: this };
    this.rowSelection = "multiple";
  }
  onGridReady() {
    //
  }
  // GENERAL FUNCTION ================================================================

  public getContextMenu(params: any) {
    console.log("ab");
    const { node } = params;
    const result = [
      {
        name: this.$t("commons.contextMenu.selectAll"),
        action: () => this.selectAll(),
      },
      {
        name: this.$t("commons.contextMenu.unselectAll"),
        action: () => this.deselectAll(),
      },
      {
        name: this.$t("commons.contextMenu.invertSelection"),
        action: () => this.invertSelection(),
      },
      "separator",
      {
        name: this.$t("commons.contextMenu.copyFolioToAll"),
        action: () => this.copyFolioNumberToAllAccount(node.data),
      },
      {
        name: this.$t("commons.contextMenu.copySubFolioToAll"),
        action: () => this.copySubFolioGroupCodeToAllAccount(node.data),
      },
    ];
    return result;
  }

  handleRowRightClicked(params: any) {
    // console.log('a');
  }

  getRowDataRouting() {
    const rowData: any = this.gridApi.getSelectedRows();
    for (const i of rowData) {
      if (!i.folio_number) {
        getToastError("Folio number selected row cannot be empty");
        return false;
      }
      i.account_code = i.code;
    }
    if (rowData.length <= 0) {
      getToastError(this.$t("messages.selectAccount"));
      return false;
    }
    return rowData;
  }

  getRowNodeId(params: { code: string }) {
    return params.code;
  }

  setRoutingAccountList(data: any) {
    if (!data) return;
    for (const i of data) {
      const node = this.gridApi.getRowNode(i.account_code);
      if (!node) continue;
      node.setDataValue("folio_number", i.folio_transfer);
      node.setSelected(true, false);
    }
  }

  selectAll() {
    this.gridApi.selectAll();
  }

  deselectAll() {
    this.gridApi.deselectAll();
  }

  copyFolioNumberToAllAccount(params: any) {
    this.gridApi.forEachNode((node: any) => {
      node.setDataValue("folio_number", params.folio_number);
    });
  }

  copySubFolioGroupCodeToAllAccount(params: any) {
    this.gridApi.forEachNode((node: any) => {
      node.setDataValue("sub_folio_group_code", params.sub_folio_group_code);
    });
  }

  invertSelection() {
    const selectedRow: any = this.gridApi.getSelectedRows();
    this.gridApi.forEachNode((node: any) => {
      node.setSelected(true, false);
      for (const i of selectedRow) {
        if (i.code == node.data.code) {
          node.setSelected(false, false);
        }
      }
    });
  }

  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================

  async onSave() {
    this.isSaving = true;
    const rowData = this.getRowDataRouting();
    if (!rowData) return (this.isSaving = false);
    await this.insertRoutingAccount(rowData);
    this.isSaving = false;
  }

  // END HANDLE UI====================================================================
  // API REQUEST======================================================================
  async getFolioList() {
    try {
      const { data } = await transactionAPI.getFolioList();
      this.options.folios = data;
    } catch (err) {
      getError(err);
    }
  }

  async getRoutingAccountList() {
    try {
      const { data } = await transactionAPI.getFolioRoutings(this.folioNumber);
      this.setRoutingAccountList(data);
    } catch (err) {
      getError(err);
    }
  }

  async getAccountChargeList() {
    try {
      const { data } = await transactionAPI.getAccountCharges();
      this.rowData = data ? data : [];
    } catch (err) {
      getError(err);
    }
  }

  async insertRoutingAccount(routingList: any) {
    try {
      const params = {
        folio_number: this.folioNumber,
        transfer_existing: this.transferExisting,
        routing_account_list: routingList,
      };
      const { data } = await transactionAPI.routingTransfer(params);
      this.$emit("save");
      getToastSuccess();
    } catch (err) {
      getError(err);
    }
  }

  // END API REQUEST==================================================================
  // RECYCLE LIFE FUNCTION ===========================================================

  async mounted() {
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
    await Promise.all([this.getFolioList(), this.getAccountChargeList()]);
    this.getRoutingAccountList();
  }
  // END RECYCLE LIFE FUNCTION ===========================================================
}
