import { Vue, Options } from "vue-class-component";
import CInput from "@/components/input/input.vue";
import CSelect from "@/components/select/select.vue";
import ImageUploader from "vue-image-crop-upload";
import SettingsAPI from "@/services/api/general/settings";
import authModule from "@/stores/auth";
import * as Yup from "yup";
import { getError } from "@/utils/general";
const settingAPI = new SettingsAPI();

@Options({
  components: {
    CInput,
    CSelect,
    ImageUploader,
  },
})
export default class HotelInformationForm extends Vue {
  public auth = authModule();
  public form: any = {};
  public showImageUploader: boolean = false;
  public imgDataUrl: any = null;
  public headers: any = {};
  public formElement: any = null;
  public params = {
    token: "123456798",
    name: "avatar",
  };
  public isSaved: any = false;
  public uploadURL: string =
    import.meta.env.VITE_APP_URL_API + "/upload/UploadImageHotelInformation";
  public options: any = {};

  handleShowImageUploader() {
    this.showImageUploader = !this.showImageUploader;
  }

  cropSuccess(imgDataUrl: any, field: any) {
    console.log("-------- crop success --------");
    this.imgDataUrl = imgDataUrl;
  }

  cropUploadSuccess(jsonData: any, field: any) {
    this.getHotelInformation();
  }
  /**
   * upload fail
   *
   * [param] status    server api return error status, like 500
   * [param] field
   */
  cropUploadFail(status: any, field: any) {
    console.log("-------- upload fail --------");
    console.log(status);
    console.log("field: " + field);
  }

  async onSubmit() {
    await this.updateHotelInformation();
  }

  async handleSave() {
    await this.formElement.$el.requestSubmit();
  }

  onInvalidSubmit() {
    this.isSaved = false;
  }

  // API CALL=============================================================================================

  async updateHotelInformation() {
    try {
      const { data } = await settingAPI.updateHotelInformation(this.form);
      this.isSaved = true;
    } catch (error) {
      this.isSaved = false;
      getError(error);
    }
  }

  async getHotelInformation() {
    try {
      const { data } = await settingAPI.getHotelInformation();
      this.form = data;
    } catch (error) {
      getError(error);
    }
  }

  async getComboList() {
    try {
      const { data } = await settingAPI.codeNameListArray(["Country", "State"]);
      this.options = data;
    } catch (error) {
      getError(error);
    }
  }
  // END API CALL=============================================================================================

  mounted(): void {
    this.isSaved = false;
    console.log(import.meta.env.VITE_APP_SECRET_USER);
    console.log(import.meta.env.VITE_APP_SECRET_PASSWORD);
    this.headers = {
      Authorization:
        "Basic " +
        btoa(
          import.meta.env.VITE_APP_SECRET_USER +
            ":" +
            import.meta.env.VITE_APP_SECRET_PASSWORD
        ),
    };
    this.getComboList();
    this.getHotelInformation();
  }

  get schema() {
    return Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      city: Yup.string().required(),
    });
  }

  get screenSize() {
    return this.$store.getters["ui/screenSize"];
  }
}
