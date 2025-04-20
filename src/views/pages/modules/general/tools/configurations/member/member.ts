import { Options, Vue } from "vue-class-component";
import { ref } from "vue";
import { AgGridVue } from "ag-grid-vue3";
import memberAPI from "@/services/api/hotel/member/member";
import {
  formatDate,
  formatDateTime,
  formatDateTimeUTC,
  formatNumber,
} from "@/utils/format";
import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import Checklist from "@/components/ag_grid-framework/checklist.vue";
import $global from "@/utils/global";
import { getToastSuccess } from "@/utils/toast";
import {
  generateIconContextMenuAgGrid,
  getError,
  rowSelectedAfterRefresh,
} from "@/utils/general";
import InputForm from "./member-input-form/member-input-form.vue";
import CDialog from "@/components/dialog/dialog.vue";
import SearchFilter from "@/views/pages/components/filter/filter.vue";
import "ag-grid-enterprise";
import trackingDataModule from "@/stores/tracking-data";
const MemberAPI = new memberAPI();

@Options({
  name: "guest_in_house",
  components: {
    AgGridVue,
    InputForm,
    CDialog,
    SearchFilter,
  },
})
export default class guestProfile extends Vue {
  public rowData: any = [];
  public showForm: boolean = false;
  public modeData: any;
  public form: any = {};
  public inputFormElement: any = ref();
  public showDialog: boolean = false;
  public deleteParam: any;
  public searchOptions: any;
  public formType: any;
  searchDefault: any = {
    index: 0,
    text: "",
  };
  // Extra Variable for Activation and Blacklist Handling
  public cellSelectedStatusActive: any;
  public cellSelectedStatusBlacklist: any;
  public cellSelected: any;
  public cellActive: boolean = true;
  public cellBlacklist: boolean = false;
  // Save close button loading condition
  isSaving: boolean = false;
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
    formData.birth_date = formatDateTimeUTC(formData.birth_date);
    formData.is_male = parseInt(formData.is_male);
    this.isSaving = true;
    if (this.modeData == $global.modeData.insert) {
      this.insertData(formData);
    } else if (this.modeData == $global.modeData.edit) {
      this.updateData(formData);
    } else if (this.modeData == $global.modeData.duplicate) {
      this.insertData(formData);
    }
    this.isSaving = false;
  }
  async handleEdit(params: any) {
    await this.inputFormElement.initialize();
    await this.GetMemberComboList();
    await this.inputFormElement.handleresetAgGridProduct($global.modeData.edit);
    await this.inputFormElement.handleresetAgGridProductDiscount();
    this.modeData = $global.modeData.edit;
    await this.loadEditData(params.code);
  }
  async handleDuplicate(params: any) {
    this.modeData = $global.modeData.duplicate;
    await this.loadEditData(params.code);
  }
  refreshData(search: any) {
    this.loadDataGrid(search);
  }
  handleDelete(params: any) {
    this.showDialog = true;
    this.deleteParam = params.code;
  }
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
        action: () => this.handleEdit(this.paramsData),
      },
      {
        name: this.$t("commons.contextMenu.delete"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("delete_icon24"),
        action: () => this.handleDelete(this.paramsData),
      },
      {
        name: this.$t("commons.contextMenu.duplicate"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("duplicate_icon24"),
        action: () => this.handleEdit(this.paramsData),
      },
      "separator",
      {
        name: this.$t("commons.contextMenu.trackingData"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("tracking_icon24"),
        action: () =>
          this.handleTrackingData(
            this.$global.tableName.guestProfile,
            this.paramsData.id
          ),
      },
    ];
    return result;
  }
  handleRowRightClicked() {
    if (this.paramsData) {
      const vm = this;
      vm.gridApi.forEachNode((node: any) => {
        if (node.data) {
          if (node.data.id == vm.paramsData.id) {
            node.setSelected(true, true);
          }
        }
      });
    }
  }

  rowDoubleClicked(event: any) {
    this.handleEdit(event.data);
  }

  onRefresh() {
    this.loadDataGrid(this.searchDefault);
  }
  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================

  handleTrackingData(tableName: number, id: number) {
    const trackingData = trackingDataModule();
    trackingData.show(tableName, id);
  }

  handleMenu(params: any) {
    this.paramsData = params.data;
  }

  async handleShowForm(params: any, mode: any) {
    await this.GetMemberComboList();
    this.inputFormElement.initialize();
    this.modeData = mode;
    this.inputFormElement.handleresetAgGridProduct($global.modeData.insert);
    this.inputFormElement.handleresetAgGridProductDiscount();
    this.showForm = true;
  }

  handleActivation() {
    if (this.cellSelectedStatusActive == 1) {
      let payload = {
        id: this.cellSelected,
        stat: false,
      };
      this.updateActivation(payload);
    } else {
      let payload = {
        id: this.cellSelected,
        stat: true,
      };
      this.updateActivation(payload);
    }
  }
  handleBlacklist() {
    if (this.cellSelectedStatusBlacklist == 1) {
      let payload = {
        id: this.cellSelected,
        stat: false,
      };
      this.updateBlacklist(payload);
    } else {
      let payload = {
        id: this.cellSelected,
        stat: true,
      };
      this.updateBlacklist(payload);
    }
  }
  checkActivation(status: any) {
    if (status == 0) {
      return false;
    } else {
      return true;
    }
  }
  // END HANDLE UI====================================================================
  // API REQUEST======================================================================
  async loadDataGrid(search: any = this.searchDefault) {
    const selectedRow = this.gridApi.getSelectedRows();
    let rowNodes: any = [];
    this.gridApi.forEachNode((nodeX: any) => {
      rowNodes.push(nodeX);
    });
    try {
      let params = {
        Index: search.index,
        Text: search.text,
        IndexCheckBox: search.filter[0],
      };
      const { data } = await MemberAPI.GetMemberList(params);
      this.rowData = data.List;
      rowSelectedAfterRefresh(this, null, selectedRow[0], "code", rowNodes);
    } catch (error) {}
  }
  async insertData(formData: any) {
    try {
      formData.expire_date = formatDateTimeUTC(formData.expire_date);
      formData.birth_date = formatDateTimeUTC(formData.birth_date);
      const { status2 } = await MemberAPI.InsertMember(formData);
      if (status2.status == 0) {
        getToastSuccess(this.$t("messages.saveSuccess"));
        this.showForm = false;
        this.loadDataGrid(this.searchDefault);
      }
    } catch (error) {
      getError(error);
    }
  }
  async loadEditData(params: any) {
    try {
      const { data } = await MemberAPI.GetMember(params);
      this.inputFormElement.form = data;
      await this.GetMemberComboList();
      if (data.country_code != "") {
        await this.inputFormElement.GetStateByCountry(data.country_code);
      }
      if (data.state_code != "") {
        await this.inputFormElement.GetCityByState(data.state_code);
      }
      this.inputFormElement.pointTypeChange(1);
      this.inputFormElement.pointTypeChange(2);
      this.inputFormElement.pointTypeChange(3);
      this.inputFormElement.handleLoadProductDiscount(data.code);
      this.showForm = true;
    } catch (error) {
      getError(error);
    }
  }

  async updateData(formData: any) {
    try {
      const { status2 } = await MemberAPI.UpdateMember(formData);
      if (status2.status == 0) {
        this.loadDataGrid(this.searchDefault);
        this.showForm = false;
        getToastSuccess(this.$t("messages.saveSuccess"));
      }
    } catch (error) {
      getError(error);
    }
  }
  async deleteData() {
    try {
      const { status2 } = await MemberAPI.DeleteMember(this.deleteParam);
      if (status2.status == 0) {
        this.loadDataGrid(this.searchDefault);
        this.showDialog = false;
        getToastSuccess(this.$t("messages.deleteSuccess"));
      }
    } catch (error) {
      getError(error);
    }
  }
  async updateActivation(payload: any) {
    payload.id = parseInt(payload.id);
    try {
      let params = {
        id: payload.id,
        is_active: payload.stat,
      };
      const { status2 } = await MemberAPI.UpdateGuestProfileActive(params);
      if (status2.status == 0) {
        this.loadDataGrid(this.searchDefault);
        getToastSuccess(this.$t("messages.saveSuccess"));
        this.cellActive = !this.cellActive;
      }
    } catch (error) {
      getError(error);
    }
  }
  async updateBlacklist(payload: any) {
    payload.id = parseInt(payload.id);
    try {
      let params = {
        id: payload.id,
        is_blacklist: payload.stat,
      };
      const { status2 } = await MemberAPI.UpdateGuestProfileBlacklist(params);
      if (status2.status == 0) {
        this.loadDataGrid(this.searchDefault);
        getToastSuccess(this.$t("messages.saveSuccess"));
        this.cellBlacklist = !this.cellBlacklist;
      }
    } catch (error) {
      getError(error);
    }
  }
  async GetMemberComboList() {
    try {
      const { data } = await MemberAPI.GetMemberComboList();
      this.inputFormElement.listDropdown.company = data.Company;
      this.inputFormElement.listDropdown.country = data.Country;
      this.inputFormElement.listDropdown.guestType = data.GuestType;
      this.inputFormElement.listDropdown.nationality = data.Nationality;
      this.inputFormElement.listDropdown.title = data.Title;
      this.inputFormElement.listDropdown.idCardType = data.CardType;
      this.inputFormElement.listDropdown.roomPointType = data.RoomPointType;
      this.inputFormElement.listDropdown.outletPointType = data.OutletPointType;
      this.inputFormElement.listDropdown.banquetPointType =
        data.BanquetPointType;
      this.inputFormElement.listDropdown.memberOutletDiscount =
        data.MemberOutletDiscount;
      this.inputFormElement.listDropdown.Outlet = data.Outlet;
      this.inputFormElement.listDropdown.Category = data.Category;
    } catch (error) {
      getError(error);
    }
  }
  // END API REQUEST==================================================================
  // RECYCLE LIFE FUNCTION ===========================================================
  beforeMount() {
    this.searchOptions = [
      { text: this.$t("commons.filter.code"), value: 0 },
      { text: this.$t("commons.filter.name"), value: 1 },
      { text: this.$t("commons.filter.roomPointType"), value: 2 },
      { text: this.$t("commons.filter.outletPointType"), value: 3 },
      { text: this.$t("commons.filter.banquetPointType"), value: 4 },
      { text: this.$t("commons.filter.address"), value: 5 },
      { text: this.$t("commons.filter.state"), value: 6 },
      { text: this.$t("commons.filter.country"), value: 7 },
      { text: this.$t("commons.filter.phone"), value: 8 },
      { text: this.$t("commons.filter.company"), value: 9 },
      { text: this.$t("commons.filter.fax"), value: 10 },
      { text: this.$t("commons.filter.email"), value: 11 },
      { text: this.$t("commons.filter.website"), value: 12 },
      { text: this.$t("commons.filter.state"), value: 13 },
      { text: this.$t("commons.filter.company"), value: 14 },
      { text: this.$t("commons.filter.idCardType"), value: 15 },
      { text: this.$t("commons.filter.idCardNumber"), value: 16 },
      { text: this.$t("commons.filter.birthPlace"), value: 17 },
      { text: this.$t("commons.filter.guestProfileId"), value: 18 },
      { text: this.$t("commons.filter.createdBy"), value: 19 },
      { text: this.$t("commons.filter.updatedBy"), value: 20 },
    ];
    this.agGridSetting = $global.agGrid;
    this.gridOptions = {
      rowHeight: $global.agGrid.rowHeightDefault,
      headerHeight: $global.agGrid.headerHeight,
      onCellClicked: (params: any) => {
        this.cellSelected = params.data.id;
        this.cellSelectedStatusActive = params.data.is_active;
        this.cellSelectedStatusBlacklist = params.data.is_blacklist;
        if (params.data.is_active == 1) {
          this.cellActive = false;
        } else {
          this.cellActive = true;
        }
        if (params.data.is_blacklist == 1) {
          this.cellBlacklist = true;
        } else {
          this.cellBlacklist = false;
        }
      },
      actionGrid: {
        menu: true,
        edit: true,
        delete: true,
        duplicate: true,
      },
    };
    this.columnDefs = [
      {
        headerName: this.$t("commons.table.action"),
        field: "code",
        enableRowGroup: false,
        resizable: false,
        filter: false,
        suppressMenu: true,
        suppressMoveable: true,
        lockPosition: "left",
        sortable: false,
        cellRenderer: "actionGrid",
        colId: "params",
        width: 95,
        headerClass: "align-header-center-suppress-menu",
      },
      { headerName: this.$t("commons.table.code"), field: "code", width: 95 },
      {
        headerName: this.$t("commons.table.regDate"),
        field: "registration_date",
        width: 120,
        valueFormatter: formatDateTime,
        filterParams: {
          valueFormatter: formatDateTime,
        },
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center ",
      },
      {
        headerName: this.$t("commons.table.guestProfileId"),
        field: "guest_profile_id",
        width: 120,
      },
      {
        headerName: this.$t("commons.table.fullName"),
        field: "Name",
        width: 180,
      },
      {
        headerName: this.$t("commons.table.expireDate"),
        field: "expire_date",
        width: 120,
        valueFormatter: formatDateTime,
        filterParams: {
          valueFormatter: formatDateTime,
        },
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center ",
      },
      {
        headerName: this.$t("commons.table.forRoom"),
        field: "is_for_room",
        width: 100,
        cellRenderer: "checklistRenderer",
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center ",
      },
      {
        headerName: this.$t("commons.table.roomPointType"),
        field: "RoomPointType",
        width: 120,
      },
      {
        headerName: this.$t("commons.table.forOutlet"),
        field: "is_for_outlet",
        width: 100,
        cellRenderer: "checklistRenderer",
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center ",
      },
      {
        headerName: this.$t("commons.table.outletPointType"),
        field: "OutletPointType",
        width: 125,
      },
      {
        headerName: this.$t("commons.table.forBanquet"),
        field: "is_for_banquet",
        width: 100,
        cellRenderer: "checklistRenderer",
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center ",
      },
      {
        headerName: this.$t("commons.table.banquetPointType"),
        field: "BanquetPointType",
        width: 135,
      },
      {
        headerName: this.$t("commons.table.address"),
        field: "Address",
        width: 160,
      },
      {
        headerName: this.$t("commons.table.phone"),
        field: "Phone",
        width: 140,
      },
      { headerName: this.$t("commons.table.fax"), field: "fax", width: 140 },
      {
        headerName: this.$t("commons.table.email"),
        field: "email",
        width: 140,
      },
      {
        headerName: this.$t("commons.table.website"),
        field: "website",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.idCardType"),
        field: "IDCardType",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.idCardNumber"),
        field: "id_card_number",
        width: 150,
      },
      {
        headerName: this.$t("commons.table.birthPlace"),
        field: "birth_place",
        width: 150,
      },
      {
        headerName: this.$t("commons.table.birthDate"),
        field: "birth_date",
        width: 150,
        valueFormatter: formatDateTime,
        filterParams: {
          valueFormatter: formatDateTime,
        },
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center ",
      },
      {
        headerName: this.$t("commons.table.country"),
        field: "Country",
        width: 100,
      },
      {
        headerName: this.$t("commons.table.state"),
        field: "State",
        width: 100,
      },
      {
        headerName: this.$t("commons.table.company"),
        field: "Company",
        width: 100,
      },
      {
        headerName: this.$t("commons.table.createdAt"),
        field: "created_at",
        width: 120,
        valueFormatter: formatDateTime,
        filterParams: {
          valueFormatter: formatDateTime,
        },
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center ",
      },
      {
        headerName: this.$t("commons.table.createdBy"),
        field: "created_by",
        width: 100,
      },
      {
        headerName: this.$t("commons.table.updatedAt"),
        field: "updated_at",
        width: 120,
        valueFormatter: formatDateTime,
        filterParams: {
          valueFormatter: formatDateTime,
        },
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center ",
      },
      {
        headerName: this.$t("commons.table.updatedBy"),
        field: "updated_by",
        width: 100,
      },
    ];
    // ------------------end need setting manual for column table-----------------//
    this.context = { componentParent: this };
    this.frameworkComponents = {
      actionGrid: ActionGrid,
      iconLockRenderer: IconLockRenderer,
      checklistRenderer: Checklist,
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

  mounted() {
    this.gridApi = this.gridOptions.api;
  }

  public unmounted() {}
  // END RECYCLE LIFE FUNCTION =======================================================
  // GETTER AND SETTER FUNCTION ======================================================
  get disabledActionGrid() {
    return this.showForm;
  }
  // END GETTER AND SETTER FUNCTION ==================================================
}
