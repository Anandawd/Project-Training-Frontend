import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import CDialog from "@/components/dialog/dialog.vue";
import CModal from "@/components/modal/modal.vue";
import { formatDateTime } from "@/utils/format";
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

interface EmployeeEnrollment {
  id: number;
  employee_id: string;
  employee_name: string;
  department_code: string;
  department_name: string;
  position_code: string;
  position_name: string;
  placement_code: string;
  placement_name: string;
  fingerprint_id?: string;
  enrollment_date?: Date;
  enrollment_status: "ENROLLED" | "NOT_ENROLLED" | "PENDING" | "FAILED";
  device_id?: string;
  device_name?: string;
  last_verified?: Date;
  template_count: number;
  remark?: string;
}

interface EnrollmentProgress {
  message: string;
  step: string;
  percentage: number;
  success: boolean;
}

@Options({
  components: {
    AgGridVue,
    CSearchFilter,
    CModal,
    CDialog,
    CInputForm,
  },
})
export default class FingerprintEnrollment extends Vue {
  // data
  public rowData: EmployeeEnrollment[] = [];
  public filteredData: EmployeeEnrollment[] = [];
  public devices: FingerprintDevice[] = [];
  public deleteParam: any;

  // options data
  public employeeOptions: any[] = [];
  public enrollmentStatusOptions: any[] = [];

  // form
  public form: any = {};
  public modeData: any;
  public showForm: boolean = false;
  public inputFormElement: any = ref();

  // dialog & Modals
  public showDialog: boolean = false;
  public dialogTitle: string = "";
  public dialogMessage: string = "";
  public dialogAction: string = "";
  public showEnrollmentProgress: boolean = false;
  public enrollmentProgress: EnrollmentProgress = {
    message: "",
    step: "",
    percentage: 0,
    success: false,
  };

  // filter
  public searchOptions: any;
  searchDefault: any = {
    index: 0,
    text: "",
    filter: [0],
  };

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

  created(): void {
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
        edit: true,
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
        width: 100,
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
          !this.paramsData ||
          this.paramsData.enrollment_status === "ENROLLED" ||
          !this.deviceConnected,
        icon: generateIconContextMenuAgGrid("add_icon24"),
        action: () =>
          this.handleShowForm(this.paramsData, $global.modeData.insert),
      },
      {
        name: this.$t("commons.contextMenu.reEnroll"),
        disabled:
          !this.paramsData ||
          this.paramsData.enrollment_status !== "ENROLLED" ||
          !this.deviceConnected,
        icon: generateIconContextMenuAgGrid("edit_icon24"),
        action: () => this.handleReEnroll(this.paramsData),
      },
      {
        name: this.$t("commons.contextMenu.verify"),
        disabled:
          !this.paramsData ||
          this.paramsData.enrollment_status !== "ENROLLED" ||
          !this.deviceConnected,
        icon: generateIconContextMenuAgGrid("detail_icon24"),
        action: () => this.handleVerify(this.paramsData),
      },
      {
        name: this.$t("commons.contextMenu.delete"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("delete_icon24"),
        action: () => this.handleDelete(this.paramsData),
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

  handleShowForm(params: any, mode: any) {
    this.showForm = false;

    if (!this.deviceConnected) {
      getToastError(this.$t("messages.attendace.error.noDeviceConnected"));
      return;
    }

    this.modeData = mode;
    this.$nextTick(() => {
      if (mode === $global.modeData.insert) {
        this.inputFormElement.initialize();
      } else {
        this.loadEditData(params.id);
      }
    });
    this.showForm = true;
  }

  handleSave(formData: any) {
    const formattedData = this.formatData(formData);
    console.log("handleSave", formattedData);
    if (this.modeData == $global.modeData.insert) {
      this.enrollFingerprint(formattedData).then(() => {
        this.showForm = false;
      });
    } else {
      this.updateData(formattedData).then(() => {
        this.showForm = false;
      });
    }
  }

  handleEdit(formData: any) {
    this.handleShowForm(formData, $global.modeData.edit);
  }

  handleDelete(params: any) {
    this.deleteParam = params.id;
    this.dialogMessage = this.$t(
      "messages.attendance.delete.deleteFingerprintEnrollment"
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
    this.deleteParam = params;
    this.showDialog = true;
  }

  handleVerify(params: any) {
    this.verifyFingerprint(params);
  }

  confirmAction() {
    if (this.dialogAction === "delete") {
      this.deleteData();
    } else if (this.dialogAction === "re-enroll") {
      this.reEnrollFingerprint(this.deleteData);
    }
    this.showDialog = false;
  }

  handleEnrollmentProgress(progress: EnrollmentProgress) {
    this.enrollmentProgress = progress;
    this.showEnrollmentProgress = true;
  }

  refreshData(search: any) {
    this.searchOptions = { ...search };
    this.loadDataGrid(search);
  }

  onRefresh() {
    this.loadDataGrid(this.searchDefault);
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
      /*
      let params = {
        Index: search.index,
        Text: search.text,
        IndexCheckBox: search.filter[0],
      };
      const { data } = await salaryAdjustmentAPI.GetSalaryAdjustmentList(params);
      this.rowData = data;
      */

      let filteredData = [...this.rowData];

      if (search.text && search.text.trim()) {
        let searchText = search.text.toLowerCase().trim();
        let searchIndex = search.index;

        filteredData = filteredData.filter((item: any) => {
          switch (searchIndex) {
            case 0:
              return item.employee_id.toLowerCase().includes(searchText);
            case 1:
              return item.employee_name.toLowerCase().includes(searchText);
            case 2:
              return item.department_name.toLowerCase().includes(searchText);
            case 3:
              return item.position_name.toLowerCase().includes(searchText);
            case 4:
              return item.placement_name.toLowerCase().includes(searchText);
            default:
              return true;
          }
        });
      }

      if (search.filter && search.filter.length > 0) {
        const statusFilter = parseInt(search.filter[0]);
        if (statusFilter !== 0) {
          filteredData = filteredData.filter((item: any) => {
            switch (statusFilter) {
              case 1:
                return item.status === "ENROLLED";
              case 2:
                return item.status === "NOT_ENROLLED";
              case 3:
                return item.status === "PENDING";
              case 4:
                return item.status === "FAILED";
              default:
                return true;
            }
          });
        }
      }

      if (this.gridApi) {
        this.gridApi.setRowData(filteredData);
      }
    } catch (error) {
      getError(error);
    }
  }

  async loadEditData(id: any) {
    try {
      /*
      const { data } = await salaryAdjustmentAPI.GetSalaryAdjustment(id);
      this.populateForm(data);
      */

      const enrollemnt = this.rowData.find((item: any) => item.id === id);

      if (enrollemnt) {
        this.$nextTick(() => {
          this.inputFormElement.form = this.populateForm(enrollemnt);
        });
      } else {
        getToastError(
          this.$t("messages.attendance.error.notFingerprintEnrollment")
        );
      }
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
        remark: "Enrolled successfully",
      },
      {
        id: 2,
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
      },
      {
        id: 3,
        employee_id: "EMP003",
        employee_name: "Mike Johnson",
        department_code: "FINANCE",
        department_name: "Finance",
        position_code: "STAFF",
        position_name: "Staff",
        placement_code: "AMORA_UBUD",
        placement_name: "Amora Ubud",
        enrollment_status: "PENDING",
        template_count: 0,
        remark: "Enrollment in progress",
      },
      {
        id: 4,
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
      },
    ];
  }

  async loadDropdown() {
    try {
      /*
      const promises = [
        salaryAdjustmentAPI.GetEmployeeOptions().then(response => {
          this.employeeOptions = response.data;
        }),
        salaryAdjustmentAPI.GetAdjustmentReasonOptions().then(response => {
          this.adjustmentReasonOptions = response.data;
        }),
      ];

      await Promise.all(promises);
      */

      this.employeeOptions = this.rowData
        .filter((item) => item.enrollment_status === "NOT_ENROLLED")
        .map((item) => ({
          employee_id: item.employee_id,
          name: item.employee_name,
          department_code: item.department_code,
          department_name: item.department_name,
          position_code: item.position_code,
          position_name: item.position_name,
          placement_code: item.placement_code,
          placement_name: item.placement_name,
        }));
    } catch (error) {
      getError(error);
    }
  }

  async enrollFingerprint(formData: any) {
    try {
      this.handleEnrollmentProgress({
        message: this.$t("messages.attendance.enrollment.starting"),
        step: this.$t("messages.attendance.enrollment.preparing"),
        percentage: 0,
        success: false,
      });

      setTimeout(() => {
        this.handleEnrollmentProgress({
          message: this.$t("messages.attendance.enrollment.scanning"),
          step: this.$t("messages.attendance.enrollment.placeFinger"),
          percentage: 33,
          success: false,
        });
      }, 1000);

      setTimeout(() => {
        this.handleEnrollmentProgress({
          message: this.$t("messages.attendance.enrollment.processing"),
          step: this.$t("messages.attendance.enrollment.creatingTemplate"),
          percentage: 66,
          success: false,
        });
      }, 3000);

      setTimeout(() => {
        this.handleEnrollmentProgress({
          message: this.$t("messages.attendance.enrollment.completed"),
          step: this.$t("messages.attendance.enrollment.success"),
          percentage: 100,
          success: true,
        });

        const employeeIndex = this.rowData.findIndex(
          (item) => item.employee_id === formData.employee_id
        );

        if (employeeIndex !== -1) {
          this.rowData[employeeIndex] = {
            ...this.rowData[employeeIndex],
            fingerprint_id: `FP${Date.now()}`,
            enrollment_date: new Date(),
            enrollment_status: "ENROLLED",
            device_id: formData.device_id,
            device_name: formData.device_name,
            template_count: 3,
            remark: formData.remark,
          };
        }
        this.loadDataGrid(this.searchDefault);
        getToastSuccess(this.$t("messages.attendance.success.enrolled"));
      }, 5000);
    } catch (error) {
      getError(error);
      this.showEnrollmentProgress = false;
    }
  }

  async reEnrollFingerprint(params: any) {
    try {
      const employeeIndex = this.rowData.findIndex(
        (item) => item.id === params.id
      );
      if (employeeIndex !== -1) {
        this.rowData[employeeIndex] = {
          ...this.rowData[employeeIndex],
          enrollment_date: new Date(),
          last_verified: new Date(),
          template_count: 3,
          remark: "Re-enrolled successfully",
        };
      }

      this.loadDataGrid(this.searchDefault);
      getToastSuccess(this.$t("messages.attendance.success.reEnrolled"));
    } catch (error) {
      getError(error);
    }
  }

  async verifyFingerprint(params: any) {
    try {
      // Simulate fingerprint verification
      const employeeIndex = this.rowData.findIndex(
        (item) => item.id === params.id
      );
      if (employeeIndex !== -1) {
        this.rowData[employeeIndex].last_verified = new Date();
      }

      this.loadDataGrid(this.searchDefault);
      getToastSuccess(this.$t("messages.attendance.success.verified"));
    } catch (error) {
      getError(error);
    }
  }

  // async insertData(formData: any) {
  //   try {
  //     /*
  //     const { status2 } = await salaryAdjustmentAPI.InsertSalaryAdjustment(formData);
  //     if (status2.status == 0) {
  //       getToastSuccess(this.$t("messages.saveSuccess"));
  //       this.showForm = false;
  //       this.loadDataGrid(this.searchDefault);
  //     }
  //     */

  //     const newId = Math.max(...this.rowData.map((adj: any) => adj.id)) + 1;

  //     const newAdjustment = {
  //       id: newId,
  //       employee_id: formData.employee_id,
  //       employee_name: formData.employee_name,
  //       department_code: formData.department_code,
  //       department_name: formData.department_name,
  //       position_code: formData.position_code,
  //       position_name: formData.position_name,
  //       effective_date: formData.effective_date,
  //       current_salary: formData.current_salary,
  //       new_salary: formData.new_salary,
  //       status: "PENDING",
  //       remark: formData.remark || "",
  //       created_at: formatDateTimeUTC(new Date()),
  //       created_by: "Current User",
  //       updated_at: formatDateTimeUTC(new Date()),
  //       updated_by: "Current User",
  //     };

  //     this.rowData.push(newAdjustment);
  //     this.searchDefault.filter = [1];

  //     await this.$nextTick();
  //     await this.loadDataGrid(this.searchDefault);

  //     this.$t("messages.employee.success.saveSalaryAdjustment");
  //   } catch (error) {
  //     getError(error);
  //   }
  // }

  async updateData(formData: any) {
    try {
      /*
      const { status2 } = await salaryAdjustmentAPI.UpdateSalaryAdjustment(formData);
      if (status2.status == 0) {
        this.loadDataGrid(this.searchDefault);
        this.showForm = false;
        getToastSuccess(this.$t("messages.saveSuccess"));
      }
      */

      const index = this.rowData.findIndex(
        (item: any) => item.id === formData.id
      );
      if (index !== -1) {
        this.rowData[index] = {
          ...this.rowData[index],
          ...formData,
        };
      }

      this.loadDataGrid(this.searchDefault);
      getToastSuccess(this.$t("messages.attendance.success.updateFingerprint"));
    } catch (error) {
      getError(error);
    }
  }

  async deleteData() {
    try {
      /*
      const { status2 } = await salaryAdjustmentAPI.DeleteSalaryAdjustment(this.deleteParam);
      if (status2.status == 0) {
        this.loadDataGrid(this.searchDefault);
        getToastSuccess(this.$t("messages.deleteSuccess"));
      }
      */

      this.rowData = this.rowData.filter(
        (item: any) => item.id !== this.deleteParam
      );

      await this.loadDataGrid(this.searchDefault);
      getToastSuccess(this.$t("messages.attendance.success.deleteFingerprint"));
    } catch (error) {
      getError(error);
    }
  }

  async connectDevice(device: FingerprintDevice) {
    try {
      device.connected = true;
      device.lastSync = new Date();
      getToastSuccess(this.$t("messages.attendance.success.deviceConnected"));
    } catch (error) {
      getError(error);
    }
  }

  async testDevice(device: FingerprintDevice) {
    try {
      // Simulate device test
      getToastSuccess(
        this.$t("messages.attendance.success.deviceTest", {
          deviceName: device.name,
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
      remark: params.remark,
    };
  }

  deviceInfo(device: FingerprintDevice) {
    // Show device info modal
    console.log("Device info:", device);
  }

  showDeviceSettings() {
    // Show device settings modal
    console.log("Show device settings");
  }

  exportData() {
    // Export enrollment data
    console.log("Export enrollment data");
  }

  // GETTER AND SETTER =======================================================
  get pinnedBottomRowData() {
    return generateTotalFooterAgGrid(this.rowData, this.columnDefs);
  }

  get deviceConnected(): boolean {
    return this.devices.some((device: any) => device.connected);
  }

  get summaryData() {
    const summary = {
      total_employees: this.rowData.length,
      enrolled: 0,
      not_enrolled: 0,
      pending: 0,
      failed: 0,
    };

    this.rowData.forEach((item: any) => {
      switch (item.enrollment_status) {
        case "ENROLLED":
          summary.enrolled++;
          break;
        case "NOT_ENROLLED":
          summary.not_enrolled++;
          break;
        case "PENDING":
          summary.pending++;
          break;
        case "FAILED":
          summary.failed++;
          break;
      }
    });

    return summary;
  }
}
