/* eslint-disable */
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// drag, drop & resize container
declare module "vue3-ts-draggable-resizable";
