import { Options, Vue } from 'vue-class-component';

@Options({
  name: 'app-dropdown-menu',
  props: {
    size: String
  }
})
export default class DropdownMenu extends Vue {
  private dropdownMenuElement: HTMLElement = null;
  public size: string;

  public mounted(): void {
    this.dropdownMenuElement = this.$refs.dropdownMenu as HTMLElement;
  }

  get fixStyles(): any {
    if (this.dropdownMenuElement) {
      const windowWidth = document.getElementById('app').offsetWidth;
      const offsetRight =
        this.dropdownMenuElement.getBoundingClientRect().left;
      const offsetWidth = this.dropdownMenuElement.offsetWidth;
      const visiblePart = windowWidth - offsetRight;

      if (offsetRight < 0) {
        return {
          right: 'inherit',
          left: `${offsetRight - 5}px`
        };
      } else if (visiblePart < offsetWidth) {
        return { right: 'inherit', left: `0px` };
      }
      return { right: 'inherit', left: `0px` };
    }
    return { right: 'inherit', left: `0px` };
  }
}
