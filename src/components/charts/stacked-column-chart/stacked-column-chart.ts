import { defineComponent } from 'vue';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement);

export default defineComponent({
  name: 'StackedBarChart',
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
    type: "bar",
    data: this.chartData,
    // options: this.chartOptions,
    options:{ plugins:{
      legend: {
        position: "right"
      },
      
    },scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true
      }
    }}
  });
},
});
