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
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
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
    displayStack: {
      type: Boolean,
      default: false
    }
  },

  mounted() {
    const ctx = this.$refs.canvas.getContext('2d');
    new ChartJS(ctx, {
      type: "line",
      data: this.chartData,
      options: this.chartOptions
    });
  },
});

// {
//   responsive: true,
//   plugins: {
//     title: {
//       display: true,
//       text: "(ctx: any) => ctx.chart.options.scales.y.stacked"
//     },
//     // tooltip: {
//     //   mode: 'index'
//     // },
//   //   filler: {
//   //     propagate: true
//   // }
//   },
//   interaction: {
//     mode: 'nearest',
//     axis: 'x',
//     intersect: false
//   },
//   // scales: {
//   //   // x: {
//   //   //   beginAtZero: true,
//   //   // },
//   //   // y: {
//   //   //   beginAtZero: true,
//   //   //   ticks: {
//   //   //     stepSize: 0.2, // Langkah antara setiap nilai
//   //   //     // callback: (valu: any) => value.toFixed(1), // Format angka desimal dengan 1 digit di belakang koma
//   //   //   },
//   //   // },
//   // }
//   scales: {
//     x: {
//       title: {
//         display: this.displayStack,
//       }
//     },
//     y: {
//       stacked: true,
//       title: {
//         display: this.displayStack,
//         text: 'Value'
//       }
//     }
//   }
// }
