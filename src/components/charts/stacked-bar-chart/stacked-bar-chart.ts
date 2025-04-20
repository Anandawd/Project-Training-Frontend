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
    // chartOptions: {
    //   type: Object,
    //   default: () => ({}),
    // },
  },
  mounted() {
  // this.chartOptions
  const ctx = this.$refs.canvas.getContext('2d');
  new ChartJS(ctx, {
    type: "bar",
    data: this.chartData,
    options: {
      indexAxis: 'y',
      plugins: {
        title: {
          display: true,
          text: 'Stacked Bar Chart'
        },
        legend: {
          position: 'right',
        },
      },
      responsive: true,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true
        }
      }
    }
  });
},
});
