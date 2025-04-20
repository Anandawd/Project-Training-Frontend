import { Options, Vue } from "vue-class-component";

@Options({})
export default class NetworkError extends Vue {
  reload() {
    location.reload();
  }
  mounted() {
    setInterval(() => {
      location.reload();
    }, 15000);
  }
}
