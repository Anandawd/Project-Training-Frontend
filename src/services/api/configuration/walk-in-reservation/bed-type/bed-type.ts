import ConfigurationResource from "../../configuration-resource";
import request from "@/utils/axios";

const uri = "BedType";

class BedType extends ConfigurationResource {
  constructor() {
    super(uri);
  }
}

export { BedType as default };
