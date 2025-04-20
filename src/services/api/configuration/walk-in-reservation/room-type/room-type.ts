import ConfigurationResource from "../../configuration-resource";
import request from "@/utils/axios";

const uri = "RoomType";

class RoomType extends ConfigurationResource {
  constructor() {
    super(uri);
  }
}

export { RoomType as default };
