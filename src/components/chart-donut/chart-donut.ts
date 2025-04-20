import { Options, Vue } from "vue-class-component";
import { Doughnut } from "vue-chartjs";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";

ChartJS.register(ArcElement, Tooltip);

@Options({
  name: "chart_donut",
  components: { Doughnut },
  props: {
    chartData: {
      type: Object,
      required: true,
    },
    chartOptions: {
      type: Object,
      default: () => {},
    },
    totalValue: {
      type: String,
    },
    totalLabel: {
      type: String,
    },
  },
})
export default class ChartDonut extends Vue {}
