import { IUser } from "../../../../../interfaces/user";
import { Options, Vue } from "vue-class-component";
import defaultProfileImage from "@/assets/img/default-profile.png";
import Dropdown from "../../../../../components/dropdown/dropdown.vue";
import authModule from "@/stores/auth";

@Options({
  name: "user-dropdown",
  components: {
    "app-dropdown": Dropdown,
  },
})
export default class User extends Vue {
  //TODO replace vuex with pinia
  auth: any = authModule();
  defaultProfileImage = defaultProfileImage;
  user: any = {};

  logout() {
    this.auth.logout();
  }

  async getUser() {
    this.user = await this.auth.user;
    if (!this.user) return this.auth.logout();
  }

  created(): void {
    this.getUser();
  }

  get userId() {
    return this.user.ID;
  }

  get userGroup() {
    return this.user.GroupCode;
  }

  get readableCreatedAtDate() {
    return ""; //DateTime.fromISO(this.user.createdAt).toFormat("dd LLLL yyyy");
  }
}
