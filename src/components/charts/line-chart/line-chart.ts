import { defineComponent } from 'vue';
import { Line } from 'vue-chartjs'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default defineComponent({
  components: {
    Line,
  },
  props: {
    chartData: {
      type: Object,
      required: true,
    },
    chartOptions: {
      type: Object,
      default: () => ({}),
    },
  },
  mounted() {
    const ctx = this.$refs.canvas.getContext('2d');
    new ChartJS(ctx, {
      type: "line",
      data: this.chartData,
      options: this.chartOptions,
    });
  },
});
