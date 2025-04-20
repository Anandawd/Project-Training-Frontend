import { defineComponent } from 'vue';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default defineComponent({
  components: {
    Bar,
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
      type: "bar",
      data: this.chartData,
      options: {
        indexAxis: 'y',
        // Elements options apply to all of the options unless overridden in a dataset
        // In this case, we are setting the border of each horizontal bar to be 2px wide
        elements: {
          bar: {
            borderWidth: 2,
          }
        },
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
          },
        }
      }
    });
  },
});
