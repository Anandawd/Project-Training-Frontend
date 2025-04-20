import { defineComponent } from 'vue';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend)

export default defineComponent({
  components: {
    Pie,
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
      type: "pie",
      data: this.chartData,
      options: this.chartOptions,
    });
  },
});
