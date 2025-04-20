import { createI18n } from "vue-i18n";
import en from "./en.json";
import id from "./id.json";
import vn from "./vn.json";

const i18n = createI18n({
  locale: "en",
  allowComposition: true, // you need to specify that!
  messages: { en, id, vn },
  fallbackLocale: "en",
});

export default i18n;
