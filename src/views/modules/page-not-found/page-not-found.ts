import { Options, Vue } from "vue-class-component";

@Options({})
export default class NetworkError extends Vue {
  dashboard() {
    location.replace("/");
  }
}
