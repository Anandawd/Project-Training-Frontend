import { Options, Vue } from "vue-class-component";
import AppDropdownMenu from "./dropdown-menu/dropdown-menu.vue";
import DropdownMenuActionGrid from "./dropdown-menu-action-grid/dropdown-menu.vue";

@Options({
  name: "c-dropdown",
  components: {
    DropdownMenuActionGrid,
    AppDropdownMenu,
  },
  props: {
    disabled: Boolean,
    size: String,
    isNav: Boolean,
    isActionGrid: Boolean,
  },
})
export default class CDropdown extends Vue {
  private dropdownElement: HTMLElement;
  public isOpen: boolean = false;
  public component: any = null;
  public size: string = "md";
  public isActionGrid: boolean;
  public mounted(): void {
    this.component = this.isActionGrid
      ? DropdownMenuActionGrid
      : AppDropdownMenu;
    this.dropdownElement = this.$refs.dropdown as HTMLElement;
    document.addEventListener("click", this.documentClick);
  }

  public unmounted(): void {
    document.removeEventListener("click", this.documentClick);
  }

  private documentClick(event: Event) {
    const target: HTMLElement = event.target as HTMLElement;
    if (
      this.dropdownElement !== target &&
      !this.dropdownElement.contains(target)
    ) {
      this.isOpen = false;
    }
  }

  private toggleDropdown() {
    this.isOpen = !this.isOpen;
  }
}
