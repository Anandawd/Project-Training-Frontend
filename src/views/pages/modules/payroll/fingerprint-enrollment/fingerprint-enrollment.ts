import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import CDialog from "@/components/dialog/dialog.vue";
import CModal from "@/components/modal/modal.vue";
import FingerprintEnrollmentAPI from "@/services/api/payroll/fingerprint-enrollment/fingerprint-enrollment";
import {
  formatDateTime,
  formatDateTime2,
  formatDateTimeUTC,
} from "@/utils/format";
import {
  generateIconContextMenuAgGrid,
  generateTotalFooterAgGrid,
  getError,
} from "@/utils/general";
import $global from "@/utils/global";
import { getToastError, getToastSuccess } from "@/utils/toast";
import CSearchFilter from "@/views/pages/components/filter/filter.vue";
import "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import { ref } from "vue";
import { Options, Vue } from "vue-class-component";
import FingerprintEnrollmentSummary from "./components/fingerprint-enrollment-summary/fingerprint-enrollment-summary.vue";
import CInputForm from "./fingerprint-enrollment-input-form/fingerprint-enrollment-input-form.vue";

interface FingerprintDevice {
  id: string;
  name: string;
  model: string;
  ipAddress: string;
  connected: boolean;
  lastSync: Date;
  enrolledUsers: number;
  maxUsers: number;
}

// interface EmployeeEnrollment {
//   id: number;
//   employee_id: string;
//   employee_name: string;
//   department_code: string;
//   department_name: string;
//   position_code: string;
//   position_name: string;
//   placement_code: string;
//   placement_name: string;
//   fingerprint_id?: string;
//   enrollment_date?: Date;
//   enrollment_status: string; // "ENROLLED" | "NOT_ENROLLED" | "PENDING" | "FAILED"
//   device_id?: string;
//   device_name?: string;
//   last_verified?: Date;
//   template_count: number;
//   remark?: string;
//   updated_at: Date;
//   updated_by: string;
//   created_at: Date;
//   created_by: string;
// }

interface EnrollmentProgress {
  message: string;
  step: string;
  percentage: number;
  success: boolean;
}

const fingerprintEnrollmentAPI = new FingerprintEnrollmentAPI();

@Options({
  components: {
    AgGridVue,
    CSearchFilter,
    CModal,
    CDialog,
    CInputForm,
    FingerprintEnrollmentSummary,
  },
})
export default class FingerprintEnrollment extends Vue {
  // data
  public rowData: any = [];
  public deleteParam: any;
  public devices: FingerprintDevice[] = [];

  public filteredData: any = [];

  // options data
  public employeeOptions: any[] = [];
  public devicesOptions: any[] = [];
  public enrollmentStatusOptions: any[] = [];

  // form
  public form: any = {};
  public modeData: any;
  public showForm: boolean = false;
  public inputFormElement: any = ref();
  public isSaving: boolean = false;

  // dialog & Modals
  public showDialog: boolean = false;
  public dialogTitle: string = "";
  public dialogMessage: string = "";
  public dialogAction: string = "";

  // filter
  public searchOptions: any;
  searchDefault: any = {
    index: 0,
    text: "",
    filter: [0],
  };

  // stats
  public statusCounts: any = ref({
    total_employees: 0,
    total_enrolled: 0,
    total_not_enrolled: 0,
    total_pending: 0,
    total_failed: 0,
  });

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
    this.loadData();
  }

  beforeMount(): void {
    this.searchOptions = [
      { text: this.$t("commons.filter.payroll.employee.employeeId"), value: 0 },
      {
        text: this.$t("commons.filter.payroll.employee.name"),
        value: 1,
      },
      { text: this.$t("commons.filter.payroll.employee.department"), value: 2 },
      { text: this.$t("commons.filter.payroll.employee.position"), value: 3 },
      { text: this.$t("commons.filter.payroll.employee.placement"), value: 4 },
    ];
    this.agGridSetting = $global.agGrid;
    this.gridOptions = {
      actionGrid: {
        menu: true,
        delete: true,
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
        width: 80,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.employeeId"),
        field: "employee_id",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.employeeName"),
        field: "employee_name",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.department"),
        field: "department_name",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.position"),
        field: "position_name",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.placement"),
        field: "placement_name",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.fingerprintId"),
        field: "fingerprint_id",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.enrollmentDate"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "enrollment_date",
        width: 140,
        enableRowGroup: true,
        valueFormatter: formatDateTime,
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.device"),
        field: "device_name",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.templateCount"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "template_count",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.status"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "enrollment_status",
        width: 120,
        enableRowGroup: true,
        cellRenderer: (params: any) => {
          const status = params.value;
          let badgeClass = "";
          let statusText = "";

          switch (status) {
            case "ENROLLED":
              badgeClass = "bg-success";
              statusText = this.$t("labels.payroll.attendance.enrolled");
              break;
            case "NOT_ENROLLED":
              badgeClass = "bg-secondary";
              statusText = this.$t("labels.payroll.attendance.notEnrolled");
              break;
            case "PENDING":
              badgeClass = "bg-warning";
              statusText = this.$t("labels.payroll.attendance.pending");
              break;
            case "FAILED":
              badgeClass = "bg-danger";
              statusText = this.$t("labels.payroll.attendance.failed");
              break;
            default:
              badgeClass = "bg-secondary";
              statusText = "-";
          }
          return `<span class="badge ${badgeClass} py-1 px-2">${statusText}</span>`;
        },
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.lastVerified"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "last_verified",
        width: 140,
        enableRowGroup: true,
        valueFormatter: formatDateTime,
      },
      {
        headerName: this.$t("commons.table.remark"),
        field: "remark",
        width: 200,
        enableRowGroup: false,
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
        name: this.$t("commons.contextMenu.enroll"),
        disabled:
          !this.paramsData || this.paramsData.enrollment_status === "ENROLLED",
        icon: generateIconContextMenuAgGrid("add_icon24"),
        action: () =>
          this.handleShowForm(this.paramsData, $global.modeData.insert),
      },
      {
        name: this.$t("commons.contextMenu.reEnroll"),
        disabled:
          !this.paramsData || this.paramsData.enrollment_status !== "ENROLLED",
        icon: generateIconContextMenuAgGrid("edit_icon24"),
        action: () => this.handleReEnroll(this.paramsData),
      },
      {
        name: this.$t("commons.contextMenu.delete"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("delete_icon24"),
        action: () => this.handleDelete(this.paramsData),
      },
      "separator",
      {
        name: this.$t("commons.contextMenu.quickVerify"),
        disabled:
          !this.paramsData || this.paramsData.enrollment_status !== "ENROLLED",
        icon: generateIconContextMenuAgGrid("detail_icon24"),
        action: () => this.handleQuickVerify(this.paramsData),
      },
      {
        name: this.$t("commons.contextMenu.fullVerify"),
        disabled:
          !this.paramsData || this.paramsData.enrollment_status !== "ENROLLED",
        icon: generateIconContextMenuAgGrid("detail_icon24"),
        action: () => this.handleFullVerify(this.paramsData),
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
      } else {
        this.loadEditData(params);
      }
    });

    this.showForm = true;
  }

  handleMenu() {}

  handleSave(formData: any) {
    const formattedData = this.formatData(formData);
    console.log("handleSave", formattedData);
    if (this.modeData == $global.modeData.insert) {
      this.insertData(formattedData);
    } else {
      this.updateData(formattedData);
    }
  }

  handleDelete(params: any) {
    this.deleteParam = params.id;
    this.dialogMessage = this.$t(
      "messages.attendance.confirm.deleteFingerprintEnrollment",
      {
        employeeName: params.employee_name,
      }
    );
    this.dialogAction = "delete";
    this.showDialog = true;
  }

  handleReEnroll(params: any) {
    this.dialogTitle = this.$t("messages.attendance.confirm.reEnrollTitle");
    this.dialogMessage = this.$t(
      "messages.attendance.confirm.reEnrollMessage",
      {
        employeeName: params.employee_name,
      }
    );
    this.dialogAction = "re-enroll";
    this.showDialog = true;
  }

  handleQuickVerify(params: any) {
    this.quickVerifyFingerprint(params);
  }

  handleFullVerify(params: any) {
    this.fullVerifyFingerprint(params);
  }

  async handleSync() {
    this.syncDevice();
  }

  handleToFingerprintDevices() {
    this.$router.push({
      name: "FingerprintDevices",
    });
  }

  confirmAction() {
    if (this.dialogAction === "delete") {
      this.deleteData();
    } else if (this.dialogAction === "re-enroll") {
      this.handleShowForm(this.paramsData, $global.modeData.edit);
    }
  }

  refreshData(search: any) {
    this.loadDataGrid(search);
  }

  // API REQUEST =======================================================
  async loadData() {
    try {
      this.loadMockData();
      this.loadDropdown();
    } catch (error) {
      getError(error);
    }
  }

  async loadDataGrid(search: any = this.searchDefault) {
    try {
      let params = {
        Index: search.index,
        Text: search.text,
        IndexCheckBox: search.filter[0],
      };
      const { data } = await fingerprintEnrollmentAPI.GetEmployeeEnrollmentList(
        params
      );
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
      const { data } = await fingerprintEnrollmentAPI.GetEmployeeEnrollment(
        params.id
      );
      this.$nextTick(() => {
        this.inputFormElement.form = this.populateForm(data[0]);
      });
    } catch (error) {
      getError(error);
    }
  }

  loadMockData() {
    this.devices = [
      {
        id: "DEV001",
        name: "Main Scanner - Entrance",
        model: "ZKTeco U160",
        ipAddress: "192.168.1.100",
        connected: true,
        lastSync: new Date(),
        enrolledUsers: 32,
        maxUsers: 500,
      },
      {
        id: "DEV002",
        name: "Backup Scanner - Office",
        model: "ZKTeco K40",
        ipAddress: "192.168.1.101",
        connected: false,
        lastSync: new Date(Date.now() - 24 * 60 * 60 * 1000),
        enrolledUsers: 28,
        maxUsers: 300,
      },
    ];

    this.rowData = [
      // Employee yang sudah enrolled
      {
        id: 1,
        employee_id: "EMP001",
        employee_name: "John Doe",
        department_code: "IT",
        department_name: "Information Technology",
        position_code: "STAFF",
        position_name: "Staff",
        placement_code: "AMORA_UBUD",
        placement_name: "Amora Ubud",
        fingerprint_id: "FP001",
        enrollment_date: new Date("2025-01-15"),
        enrollment_status: "ENROLLED",
        device_id: "DEV001",
        device_name: "Main Scanner - Entrance",
        last_verified: new Date("2025-01-30"),
        template_count: 3,
        finger_index: 6, // Right Index Finger
        quality_level: 2, // Medium Quality
        remark: "Enrolled successfully",
      },
      {
        id: 2,
        employee_id: "EMP004",
        employee_name: "Sarah Wilson",
        department_code: "IT",
        department_name: "Information Technology",
        position_code: "SUPERVISOR",
        position_name: "Supervisor",
        placement_code: "AMORA_UBUD",
        placement_name: "Amora Ubud",
        fingerprint_id: "FP004",
        enrollment_date: new Date("2025-01-20"),
        enrollment_status: "ENROLLED",
        device_id: "DEV002",
        device_name: "Backup Scanner - Office",
        last_verified: new Date("2025-01-29"),
        template_count: 2,
        finger_index: 5, // Right Thumb
        quality_level: 3, // High Quality
        remark: "Enrolled successfully",
      },

      // Employee yang belum enrolled
      {
        id: 3,
        employee_id: "EMP002",
        employee_name: "Jane Smith",
        department_code: "HR",
        department_name: "Human Resources",
        position_code: "MANAGER",
        position_name: "Manager",
        placement_code: "AMORA_UBUD",
        placement_name: "Amora Ubud",
        enrollment_status: "NOT_ENROLLED",
        template_count: 0,
        remark: "Waiting for enrollment",
      },
      {
        id: 4,
        employee_id: "EMP003",
        employee_name: "Mike Johnson",
        department_code: "FINANCE",
        department_name: "Finance",
        position_code: "STAFF",
        position_name: "Staff",
        placement_code: "AMORA_UBUD",
        placement_name: "Amora Ubud",
        enrollment_status: "NOT_ENROLLED",
        template_count: 0,
        remark: "New employee",
      },
      {
        id: 5,
        employee_id: "EMP005",
        employee_name: "Alex Brown",
        department_code: "MARKETING",
        department_name: "Marketing",
        position_code: "STAFF",
        position_name: "Staff",
        placement_code: "AMORA_UBUD",
        placement_name: "Amora Ubud",
        enrollment_status: "NOT_ENROLLED",
        template_count: 0,
        remark: "Waiting for enrollment",
      },
      {
        id: 6,
        employee_id: "EMP006",
        employee_name: "Lisa Anderson",
        department_code: "HR",
        department_name: "Human Resources",
        position_code: "STAFF",
        position_name: "Staff",
        placement_code: "AMORA_UBUD",
        placement_name: "Amora Ubud",
        enrollment_status: "NOT_ENROLLED",
        template_count: 0,
        remark: "New hire",
      },

      // Employee dengan status pending untuk testing
      {
        id: 7,
        employee_id: "EMP007",
        employee_name: "David Chen",
        department_code: "IT",
        department_name: "Information Technology",
        position_code: "STAFF",
        position_name: "Staff",
        placement_code: "AMORA_UBUD",
        placement_name: "Amora Ubud",
        enrollment_status: "PENDING",
        template_count: 0,
        remark: "Enrollment in progress",
      },

      // Employee dengan status failed untuk testing
      {
        id: 8,
        employee_id: "EMP008",
        employee_name: "Emily Davis",
        department_code: "FINANCE",
        department_name: "Finance",
        position_code: "STAFF",
        position_name: "Staff",
        placement_code: "AMORA_UBUD",
        placement_name: "Amora Ubud",
        enrollment_status: "FAILED",
        template_count: 0,
        remark: "Failed enrollment - poor fingerprint quality",
      },
    ];
  }

  async loadDropdown() {
    try {
      const promises = [
        fingerprintEnrollmentAPI
          .GetEmployeeEnrollmentList({})
          .then((response) => {
            this.employeeOptions = response.data;
          }),

        fingerprintEnrollmentAPI
          .GetFingerprintDeviceList({})
          .then((response) => {
            this.devicesOptions = response.data;
          }),

        fingerprintEnrollmentAPI
          .GetEmployeeEnrollmentList({})
          .then((response) => {
            this.enrollmentStatusOptions = response.data;
          }),
      ];

      await Promise.all(promises);
    } catch (error) {
      getError(error);
    }
  }

  async insertData(formData: any) {
    try {
      this.isSaving = true;

      const { status2 } =
        await fingerprintEnrollmentAPI.InsertEmployeeEnrollment(formData);
      if (status2.status == 0) {
        getToastSuccess(this.$t("messages.attendance.success.enrolled"));
        this.showForm = false;
        this.loadDataGrid(this.searchDefault);
      }

      // const newId =
      //   Math.max(...this.rowData.map((item: any) => item.id), 0) + 1;

      // const newEnrollment = {
      //   id: newId,
      //   employee_id: formData.employee_id,
      //   employee_name: formData.employee_name,
      //   department_code: formData.department_code,
      //   department_name: formData.department_name,
      //   position_code: formData.position_code,
      //   position_name: formData.position_name,
      //   placement_code: formData.placement_code,
      //   placement_name: formData.placement_name,
      //   fingerprint_id: `FP${Date.now()}`,
      //   device_id: formData.device_id,
      //   device_name: formData.device_name,
      //   device_model: formData.device_model,
      //   device_ip: formData.device_ip,
      //   enrollment_date: formData.enrollment_date,
      //   enrollment_status: formData.enrollment_status,
      //   template_count: formData.template_count,
      //   finger_index: formData.finger_index,
      //   quality_level: formData.quality_level,
      //   last_verified: formData.last_verified,
      //   remark: formData.remark,
      //   created_at: formatDateTimeUTC(new Date()),
      //   created_by: "Current User",
      //   updated_at: formatDateTimeUTC(new Date()),
      //   updated_by: "Current User",
      // };

      // this.rowData.push(newEnrollment);

      // await this.$nextTick();
      // await this.loadDataGrid(this.searchDefault);

      // getToastSuccess(this.$t("messages.attendance.success.enrolled"));
    } catch (error) {
      getError(error);
    } finally {
      this.isSaving = false;
    }
  }

  async updateData(formData: any) {
    try {
      this.isSaving = true;
      const { status2 } =
        await fingerprintEnrollmentAPI.UpdateEmployeeEnrollment(formData);
      if (status2.status == 0) {
        getToastSuccess(
          this.$t("messages.attendance.success.updateFingerprint")
        );
        this.loadDataGrid(this.searchDefault);
        this.showForm = false;
      }

      // const index = this.rowData.findIndex(
      //   (item: any) => item.id === formData.id
      // );
      // if (index !== -1) {
      //   this.rowData[index] = {
      //     ...this.rowData[index],
      //     device_id: formData.device_id,
      //     device_name: formData.device_name,
      //     remark: formData.remark,
      //     template_count:
      //       formData.template_count || this.rowData[index].template_count,
      //     updated_at: formatDateTimeUTC(new Date()),
      //     updated_by: "Current User",
      //   };
      // }

      // await this.$nextTick();
      // await this.loadDataGrid(this.searchDefault);
      // getToastSuccess(this.$t("messages.attendance.success.updateFingerprint"));
    } catch (error) {
      getError(error);
    } finally {
      this.isSaving = false;
    }
  }

  async deleteData() {
    try {
      this.isSaving = true;
      const { status2 } =
        await fingerprintEnrollmentAPI.DeleteEmployeeEnrollment(
          this.deleteParam
        );
      if (status2.status == 0) {
        getToastSuccess(
          this.$t("messages.attendance.success.deleteFingerprint")
        );
        this.showDialog = false;
        this.loadDataGrid(this.searchDefault);
      }
    } catch (error) {
      getError(error);
    } finally {
      this.isSaving = false;
    }
  }

  async quickVerifyFingerprint(params: any) {
    try {
      // Simulate quick verification process (single scan)
      getToastSuccess(
        this.$t("messages.attendance.success.quickVerifyStarted")
      );

      // Simulate scanning delay
      await this.sleep(2000);

      // Update last_verified timestamp
      const employeeIndex = this.rowData.findIndex(
        (item: any) => item.id === params.id
      );
      if (employeeIndex !== -1) {
        this.rowData[employeeIndex].last_verified = new Date();
      }

      this.loadDataGrid(this.searchDefault);
      getToastSuccess(
        this.$t("messages.attendance.success.quickVerified", {
          employeeName: params.employee_name,
        })
      );
    } catch (error) {
      getError(error);
    }
  }

  async fullVerifyFingerprint(params: any) {
    try {
      // Simulate comprehensive verification process (multiple scans + quality check)
      getToastSuccess(this.$t("messages.attendance.success.fullVerifyStarted"));

      // Simulate multiple scanning steps
      await this.sleep(1000);
      getToastSuccess(this.$t("messages.attendance.success.verifyStep1"));

      await this.sleep(1500);
      getToastSuccess(this.$t("messages.attendance.success.verifyStep2"));

      await this.sleep(1500);
      getToastSuccess(this.$t("messages.attendance.success.verifyStep3"));

      await this.sleep(1000);

      // Update last_verified timestamp and potentially template quality score
      const employeeIndex = this.rowData.findIndex(
        (item: any) => item.id === params.id
      );
      if (employeeIndex !== -1) {
        this.rowData[employeeIndex] = {
          ...this.rowData[employeeIndex],
          last_verified: new Date(),
          // Could add quality score or other metrics here
          remark:
            this.rowData[employeeIndex].remark +
            " - Full verification completed",
        };
      }

      this.loadDataGrid(this.searchDefault);
      getToastSuccess(
        this.$t("messages.attendance.success.fullVerified", {
          employeeName: params.employee_name,
        })
      );
    } catch (error) {
      getError(error);
    }
  }

  async syncDevice() {
    try {
      const connectedDevices = this.devices.filter((d) => d.connected);
      if (connectedDevices.length === 0) {
        getToastError(this.$t("messages.attendance.error.noDeviceConnected"));
        return;
      }

      for (const device of connectedDevices) {
        device.lastSync = new Date();
      }

      getToastSuccess(this.$t("messages.attendance.success.deviceSync"));
      this.loadDataGrid(this.searchDefault);
    } catch (error) {
      getError(error);
    }
  }

  // HELPER =======================================================
  formatData(params: any) {
    return {
      id: params.id,
      employee_id: params.employee_id,
      employee_name: params.employee_name,
      department_code: params.department_code,
      department_name: params.department_name,
      position_code: params.position_code,
      position_name: params.position_name,
      placement_code: params.placement_code,
      placement_name: params.placement_name,
      device_id: params.device_id,
      device_name: params.device_name,
      device_model: params.device_model,
      device_ip: params.device_ip,
      finger_index: parseInt(params.finger_index),
      quality_level: params.quality_level,
      enrollment_date: formatDateTimeUTC(params.enrollment_date),
      enrollment_status: params.enrollment_status,
      template_count: params.template_count,
      remark: params.remark,
    };
  }

  populateForm(params: any) {
    return {
      id: params.id,
      employee_id: params.employee_id,
      employee_name: params.employee_name,
      department_code: params.department_code,
      department_name: params.department_name,
      position_code: params.position_code,
      position_name: params.position_name,
      placement_code: params.placement_code,
      placement_name: params.placement_name,
      device_id: params.device_id,
      device_name: params.device_name,
      device_model: params.device_model,
      device_ip: params.device_ip,
      finger_index: params.finger_index,
      quality_level: params.quality_level,
      enrollment_date: params.enrollment_date,
      enrollment_status: params.enrollment_status,
      template_count: params.template_count,
      remark: params.remark,
    };
  }

  sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // GETTER AND SETTER =======================================================
  get pinnedBottomRowData() {
    return generateTotalFooterAgGrid(this.rowData, this.columnDefs);
  }
}
