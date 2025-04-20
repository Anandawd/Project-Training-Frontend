import Loading from "./loading-indicator.vue";
let vm: any = {};
export default {
  install(Vue: any, opts: any) {
    opts = opts || {};
    const loadingPlugin = Vue.(Loading);
    vm = new loadingPlugin({
      data: opts,
    }).$mount();
    document.body.appendChild(vm.$el);
    Vue.prototype.$loading = (loading: any) => (vm.loading = loading);
  },
};
export const asyncLoading = function (fn: any) {
  return new Promise((resolve, reject) => {
    vm.loading = true;
    const finished = (cb: any) => {
      return (result: any) => {
        cb(result);
        vm.loading = false;
      };
    };
    fn.then(finished(resolve)).catch(finished(reject));
  });
};
