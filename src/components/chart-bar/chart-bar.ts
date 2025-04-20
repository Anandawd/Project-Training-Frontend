import { Options, Vue } from "vue-class-component";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJSBar,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJSBar.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

@Options({
  name: "chart_bar",
  components: { Bar },
  props: {
    chartData: {
      type: Object,
      required: true,
    },
    chartOptions: {
      type: Object,
      default: () => {},
    },
  },
})
export default class ChartBar extends Vue {}
