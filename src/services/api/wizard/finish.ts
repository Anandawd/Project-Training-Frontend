import request from "@/utils/axios";
const group = "wizard/";
class WizardFinishSetupAPI {
  Finish(type: any) {
    return request({
      url: `${group}FinishSetup/${type}`,
      method: "post",
    });
  }
}
export default WizardFinishSetupAPI;
