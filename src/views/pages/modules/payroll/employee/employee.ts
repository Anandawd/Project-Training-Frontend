import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import Checklist from "@/components/ag_grid-framework/checklist.vue";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import CDialog from "@/components/dialog/dialog.vue";
import CModal from "@/components/modal/modal.vue";
import EmployeeAPI from "@/services/api/payroll/employee/employee";
import OrganizationAPI from "@/services/api/payroll/organization/organization";
import { formatDate, formatDateTime2, formatDateTimeUTC } from "@/utils/format";
import {
  generateIconContextMenuAgGrid,
  generateTotalFooterAgGrid,
  getError,
} from "@/utils/general";
import $global from "@/utils/global";
import { getToastSuccess } from "@/utils/toast";
import CSearchFilter from "@/views/pages/components/filter/filter.vue";
import "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import { ref } from "vue";
import { Options, Vue } from "vue-class-component";
import CInputForm from "./employee-input-form/employee-input-form.vue";

const employeeAPI = new EmployeeAPI();
const organizationAPI = new OrganizationAPI();

@Options({
  components: {
    AgGridVue,
    CSearchFilter,
    CModal,
    CDialog,
    CInputForm,
  },
})
export default class Employee extends Vue {
  // data
  public rowData: any = [];
  public deleteParam: any;

  // options data
  public employeeTypeOptions: any = [];
  public genderOptions: any = [];
  public paymentFrequencyOptions: any = [];
  public maritalStatusOptions: any = [];
  public paymentMethodOptions: any = [];
  public bankOptions: any = [];
  public departmentOptions: any = [];
  public positionOptions: any = [];
  public placementOptions: any = [];

  // filter
  public searchOptions: any;
  searchDefault: any = {
    index: 0,
    text: "",
    filter: [1],
  };

  // form
  public showForm: boolean = false;
  public modeData: any;
  public form: any = {};
  public inputFormElement: any = ref();

  // dialog
  public showDialog: boolean = false;
  public dialogMessage: string = "";
  public dialogAction: string = "";

  // AG GRID VARIABLE
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

  // RECYCLE LIFE FUNCTION =======================================================
  mounted(): void {
    this.loadDataGrid();
  }

  beforeMount(): void {
    this.searchOptions = [
      { text: this.$t("commons.filter.payroll.employee.employeeId"), value: 0 },
      { text: this.$t("commons.filter.payroll.employee.name"), value: 1 },
      { text: this.$t("commons.filter.payroll.employee.position"), value: 2 },
      { text: this.$t("commons.filter.payroll.employee.department"), value: 3 },
      { text: this.$t("commons.filter.createdBy"), value: 4 },
      { text: this.$t("commons.filter.updatedBy"), value: 5 },
    ];
    this.agGridSetting = $global.agGrid;
    this.gridOptions = {
      actionGrid: {
        menu: true,
        delete: true,
        edit: true,
      },
      rowHeight: $global.agGrid.rowHeightDefault,
      headerHeight: $global.agGrid.headerHeight,
    };
    this.columnDefs = [
      {
        headerName: this.$t("commons.table.action"),
        headerClass: "align-header-center",
        field: "id",
        enableRowGroup: false,
        resizable: false,
        filter: false,
        suppressMenu: true,
        suppressMoveable: true,
        lockPosition: "left",
        sortable: false,
        cellRenderer: "actionGrid",
        colId: "params",
        width: 100,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.id"),
        field: "employee_id",
        width: 100,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.name"),
        field: "FullName",
        width: 200,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.gender"),
        field: "gender",
        width: 150,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.position"),
        field: "Position",
        width: 150,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.department"),
        field: "Department",
        width: 150,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.placement"),
        field: "Placement",
        width: 150,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.employeeType"),
        field: "EmployeeType",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.hireDate"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "hire_date",
        width: 100,
        enableRowGroup: true,
        valueFormatter: formatDate,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.endDate"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "end_date",
        width: 100,
        enableRowGroup: true,
        valueFormatter: formatDate,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.email"),
        field: "email",
        width: 180,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.phone"),
        field: "phone",
        width: 120,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.address"),
        field: "address",
        width: 120,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.status"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "status",
        width: 80,
        enableRowGroup: true,
        cellRenderer: "checklistRenderer",
      },
      {
        headerName: this.$t("commons.table.updatedAt"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "updated_at",
        width: 120,
        valueFormatter: formatDateTime2,
      },
      {
        headerName: this.$t("commons.table.updatedBy"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "updated_by",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.createdAt"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "created_at",
        width: 120,
        valueFormatter: formatDateTime2,
      },
      {
        headerName: this.$t("commons.table.createdBy"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "created_by",
        width: 120,
        enableRowGroup: true,
      },
    ];
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

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.ColumnApi = params.columnApi;
  }

  // GENERAL FUNCTION =======================================================
  getContextMenu(params: any) {
    const { node } = params;
    if (node) {
      this.paramsData = node.data;
    } else {
      this.paramsData = null;
    }

    const result = [
      {
        name: this.$t("commons.contextMenu.update"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("edit_icon24"),
        action: () =>
          this.handleShowForm(this.paramsData, $global.modeData.edit),
      },
      {
        name: this.$t("commons.contextMenu.delete"),
        icon: generateIconContextMenuAgGrid("delete_icon24"),
        action: () => this.handleDelete(this.paramsData),
      },
      "separator",
      {
        name: this.$t("commons.contextMenu.detail"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("detail_icon24"),
        action: () => this.handleShowDetail(this.paramsData),
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

  async handleShowForm(params: any, mode: any) {
    this.showForm = false;
    await this.$nextTick();

    this.modeData = mode;

    this.$nextTick(() => {
      if (mode === $global.modeData.insert) {
        this.inputFormElement.initialize();
      } else if (mode === $global.modeData.edit && params) {
        this.loadEditData(params);
      }
    });

    this.showForm = true;
  }

  handleShowDetail(params: any) {
    const employeeId = params.employee_id;
    this.$router.push({
      name: "EmployeeDetail",
      params: { id: employeeId },
    });
  }

  handleMenu() {}

  handleSave(formData: any) {
    const formattedData = this.formatData(formData);

    if (this.modeData === $global.modeData.insert) {
      this.insertData(formattedData);
    } else if (this.modeData === $global.modeData.edit) {
      this.updateData(formattedData);
    }
  }

  handleEdit(formData: any) {
    console.log("handleEdit", formData);
    this.handleShowForm(formData, $global.modeData.edit);
  }

  handleDelete(params: any) {
    this.deleteParam = params.id;
    this.dialogMessage = this.$t("messages.employee.confirm.delete");
    this.dialogAction = "delete";
    this.showDialog = true;
  }

  handleToEmployeeType() {
    this.$router.push({
      name: "EmployeeType",
    });
  }

  confirmAction() {
    if (this.dialogAction === $global.dialogActions.delete) {
      this.deleteData();
    }
    this.showDialog = false;
  }

  refreshData(search: any) {
    this.loadDataGrid(search);
  }

  // API REQUEST =======================================================
  async loadDataGrid(search: any = this.searchDefault) {
    try {
      let params = {
        Index: search.index,
        Text: search.text,
        IndexCheckBox: search.filter[0],
      };
      const { data } = await employeeAPI.GetEmployeeList(params);
      if (data) {
        this.rowData = data;
      } else {
        this.rowData = [];
      }
      this.loadDropdown();
    } catch (error) {
      getError(error);
    }
  }

  async loadEditData(params: any) {
    try {
      const { data } = await employeeAPI.GetEmployee(params.id);
      this.$nextTick(() => {
        this.inputFormElement.form = this.populateForm(data[0]);
      });
    } catch (error) {
      getError(error);
    }
  }

  async loadDropdown() {
    try {
      const promises = [
        employeeAPI.GetEmployeeTypeList({}).then((response) => {
          this.employeeTypeOptions = response.data;
        }),
        employeeAPI.GetPaymentFrequencyOptions().then((response) => {
          this.paymentFrequencyOptions = response.data;
        }),
        employeeAPI.GetMaritalStatusOptions().then((response) => {
          this.maritalStatusOptions = response.data;
        }),
        employeeAPI.GetPaymentMethodOptions().then((response) => {
          this.paymentMethodOptions = response.data;
        }),
        employeeAPI.GetBankOptions().then((response) => {
          this.bankOptions = response.data;
        }),
      ];

      // Load organization data from organization API
      promises.push(
        organizationAPI.GetDepartmentActiveList({}).then((response) => {
          this.departmentOptions = response.data;
        }),
        organizationAPI.GetPositionActiveList({}).then((response) => {
          this.positionOptions = response.data;
        }),
        organizationAPI.GetPlacementActiveList({}).then((response) => {
          this.placementOptions = response.data;
        })
      );

      await Promise.all(promises);
    } catch (error) {
      getError(error);
    }
  }

  async insertData(formData: any) {
    try {
      const { status2 } = await employeeAPI.InsertEmployee(formData);
      if (status2.status == 0) {
        getToastSuccess(this.$t("messages.employee.success.save"));
        this.loadDataGrid(this.searchDefault);
        this.showForm = false;
      }
    } catch (error) {
      getError(error);
    }
  }

  async updateData(formData: any) {
    try {
      const { status2 } = await employeeAPI.UpdateEmployee(formData);
      if (status2.status == 0) {
        getToastSuccess(this.$t("messages.employee.success.update"));
        this.loadDataGrid(this.searchDefault);
        this.showForm = false;
      }
    } catch (error) {
      getError(error);
      return false;
    }
  }

  async deleteData() {
    try {
      const { status2 } = await employeeAPI.DeleteEmployee(this.deleteParam);
      if (status2.status == 0) {
        getToastSuccess(this.$t("messages.employee.success.delete"));
        this.loadDataGrid(this.searchDefault);
      }
    } catch (error) {
      getError(error);
      return false;
    }
  }

  // HELPER =======================================================
  formatData(params: any) {
    return {
      id: params.id,
      // personal information
      profile_photo: params.profile_photo,
      employee_id: params.employee_id,
      first_name: params.first_name,
      last_name: params.last_name,
      gender: params.gender,
      birth_date: formatDateTimeUTC(params.birth_date),
      email: params.email,
      phone: params.phone,
      address: params.address,

      // employment information
      hire_date: formatDateTimeUTC(params.hire_date),
      end_date: formatDateTimeUTC(params.end_date),
      status: parseInt(params.status),
      employee_type: params.employee_type,
      position_code: params.position_code,
      department_code: params.department_code,
      placement_code: params.placement_code,
      supervisor_id: params.supervisor_id,

      // salary & payment information
      payment_frequency: params.payment_frequency,
      payment_method: params.payment_method,
      bank_name: params.bank_name,
      bank_account_name: params.bank_account_name,
      bank_account_number: params.bank_account_number,

      // identity information
      tax_number: params.tax_number,
      maritial_status: params.maritial_status,
      identity_number: params.identity_number,
      health_insurance_number: params.health_insurance_number,
      social_security_number: params.social_security_number,

      // leave information
      annual_leave_quota: params.annual_leave_quota,
      annual_leave_remaining: params.annual_leave_remaining,

      // modified
      created_at: params.created_at,
      created_by: params.created_by,
      updated_at: params.updated_at,
      updated_by: params.updated_by,
    };
  }

  populateForm(params: any) {
    return {
      id: params.id,

      // personal information
      profile_photo: params.profile_photo,
      employee_id: params.employee_id,
      first_name: params.first_name,
      last_name: params.last_name,
      gender: params.gender,
      birth_date: params.birth_date,
      address: params.address,
      phone: params.phone,
      email: params.email,

      // employment information
      hire_date: params.hire_date,
      end_date: params.end_date,
      status: params.status === 1 ? "1" : "0",
      employee_type: params.employee_type,
      placement_code: params.placement_code,
      position_code: params.position_code,
      department_code: params.department_code,
      supervisor_id: params.supervisor_id,

      // salary & payment information
      payment_frequency: params.payment_frequency,
      payment_method: params.payment_method,
      bank_name: params.bank_name,
      bank_account_number: params.bank_account_number,
      bank_account_name: params.bank_account_name,

      // identity information
      tax_number: params.tax_number,
      identity_number: params.identity_number,
      maritial_status: params.maritial_status,
      health_insurance_number: params.health_insurance_number,
      social_security_number: params.social_security_number,

      // leave information
      annual_leave_quota: params.annual_leave_quota,
      annual_leave_remaining: params.annual_leave_remaining,

      // modified
      created_at: params.created_at,
      created_by: params.created_by,
      updated_at: params.updated_at,
      updated_by: params.updated_by,
    };
  }

  // GETTER AND SETTER =======================================================
  get pinnedBottomRowData() {
    return generateTotalFooterAgGrid(this.rowData, this.columnDefs);
  }
}
