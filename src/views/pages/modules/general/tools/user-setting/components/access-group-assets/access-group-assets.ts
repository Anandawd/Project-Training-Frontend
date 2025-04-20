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
import authModule from "@/stores/auth";
import UserSettingAPI from "@/services/api/general/user-setting";
import $global from "@/utils/global";
import { onSelectContextMenu } from "@/utils/context-menu";
import { calculateDataForDisplay } from "@/utils/general";
const userSettingAPI = new UserSettingAPI();

@Options({
  name: "access_group_assets",
  components: {
    // TransferForm,
    // {Form,
    BCardText,
    BCard,
    BTabs,
    BTab,
    Form,
    CRadio,
    CSelect,
    CInput,
    CCheckbox,
    CDatepicker,
    AgGridVue,
  },
  props: { editData: Object },
  emits: ["save", "close"],
})
export default class AccessGroupAssets extends Vue {
  public auth = authModule();
  public access: any = {
    access_form: [],
    access_special: [],
    access_inventory_receive: [],
    access_fixed_asset_receive: [],
  };
  public accessList = {
    access_form: [
      {
        code: $global.inventoryAssetAccessOrder.accessForm.purchaseRequest,
        name: "Inventory - Purchase Request",
      },
      {
        code: $global.inventoryAssetAccessOrder.accessForm.purchaseOrder,
        name: "Inventory - Purchase Order",
      },
      {
        code: $global.inventoryAssetAccessOrder.accessForm.receiveStock,
        name: "Inventory - Receive Stock",
      },
      {
        code: $global.inventoryAssetAccessOrder.accessForm.storeRequisition,
        name: "Inventory - Store Requisition",
      },
      {
        code: $global.inventoryAssetAccessOrder.accessForm.stockTransfer,
        name: "Inventory - Stock Transfer",
      },
      {
        code: $global.inventoryAssetAccessOrder.accessForm.costing,
        name: "Inventory - Costing",
      },
      {
        code: $global.inventoryAssetAccessOrder.accessForm.costingPos,
        name: "Inventory - Costing POS",
      },
      {
        code: $global.inventoryAssetAccessOrder.accessForm.production,
        name: "Inventory - Production",
      },
      {
        code: $global.inventoryAssetAccessOrder.accessForm.costRecipe,
        name: "Inventory - Cost Recipe",
      },
      {
        code: $global.inventoryAssetAccessOrder.accessForm.returnStock,
        name: "Inventory - Return Stock",
      },
      {
        code: $global.inventoryAssetAccessOrder.accessForm.stockOpname,
        name: "Inventory - Stock Opname",
      },
      {
        code: $global.inventoryAssetAccessOrder.accessForm.storeStock,
        name: "Inventory - Store Stock",
      },
      {
        code: $global.inventoryAssetAccessOrder.accessForm.allStoreStock,
        name: "Inventory - All Store Stock",
      },
      {
        code: $global.inventoryAssetAccessOrder.accessForm.setActiveStock,
        name: "Inventory - Set Active Stock",
      },
      {
        code: $global.inventoryAssetAccessOrder.accessForm.closeInventory,
        name: "Inventory - Close Inventory",
      },
      {
        code: $global.inventoryAssetAccessOrder.accessForm.faPurchaseOrder,
        name: "Fixed Asset - FA Purchase Order",
      },
      {
        code: $global.inventoryAssetAccessOrder.accessForm.faReceive,
        name: "Fixed Asset - FA Receive",
      },
      {
        code: $global.inventoryAssetAccessOrder.accessForm.fixedAssetList,
        name: "Fixed Asset - Fixed Asset List",
      },
      {
        code: $global.inventoryAssetAccessOrder.accessForm.linenManagement,
        name: "Fixed Asset - Linen Management",
      },
      {
        code: $global.inventoryAssetAccessOrder.accessForm.depreciation,
        name: "Fixed Asset - Depreciation",
      }
    ],
    access_special: [
      {
        code: $global.inventoryAssetAccessOrder.accessSpecial
          .modifyClosedJournal,
        name: "Modify Closed Journal",
      },
      {
        code: $global.inventoryAssetAccessOrder.accessSpecial
          .acceptPurchaseRequest,
        name: "Accept Purchase Request",
      },
      {
        code: $global.inventoryAssetAccessOrder.accessSpecial
          .deletePurchaseOrder,
        name: "Delete Purchase Order",
      },
      {
        code: $global.inventoryAssetAccessOrder.accessSpecial
          .deletePurchaseRequest,
        name: "Delete Purchase Request",
      },
    ],
    access_inventory_receive: [
      {
        code: $global.inventoryAssetAccessOrder.accessInventoryReceive.insert,
        name: "Insert",
      },
      {
        code: $global.inventoryAssetAccessOrder.accessInventoryReceive.update,
        name: "Update ",
      },
      {
        code: $global.inventoryAssetAccessOrder.accessInventoryReceive.delete,
        name: "Delete",
      },
      {
        code: $global.inventoryAssetAccessOrder.accessInventoryReceive
          .receiveWithoutPo,
        name: "Receive Without PO",
      },
    ],
    access_fixed_asset_receive: [
      {
        code: $global.inventoryAssetAccessOrder.accessFixedAssetReceive.insert,
        name: "Insert",
      },
      {
        code: $global.inventoryAssetAccessOrder.accessFixedAssetReceive.update,
        name: "Update ",
      },
      {
        code: $global.inventoryAssetAccessOrder.accessFixedAssetReceive.delete,
        name: "Delete",
      },
    ],
  };
  public reports: any = {};
  editData: any;

  handleSave() {}

  calculateDataForDisplay(data: any[]) {
    return calculateDataForDisplay(data, this.columnSize);
  }

  async getAccessForm(access: any) {
    if (!access) return;
    for (const i in access) {
      for (let x = 0; x < access[i].length; x++) {
        if (this.access.hasOwnProperty(i)) {
          this.access[i][x] = parseInt(access[i][x]);
        }
      }
    }
  }

  getModelIndex(data: any, columnIndex: number, currentIndex: number) {
    const rowCount = Math.ceil(data.length / this.columnSize);
    return rowCount * columnIndex + currentIndex;
  }

  onContextMenu(e: MouseEvent, access: number[], list: object[]) {
    onSelectContextMenu(this, e, access, list);
  }

  // API CALL=============================================================================
  // END API CALL=========================================================================

  beforeMount(): void {}
  mounted(): void {}

  get screenSize() {
    return this.$store.getters["ui/screenSize"];
  }

  get columnSize() {
    if (this.screenSize == "lg") {
      return 4;
    }
    if (this.screenSize == "md") {
      return 2;
    }
    if (this.screenSize == "sm") {
      return 2;
    }
    if (this.screenSize == "xs") {
      return 1;
    }
    return 1;
  }
}
