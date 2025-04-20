import {Options, Vue} from 'vue-class-component';

@Options({
  name: 'modal',  
  props: {
    title: String,
    close: Boolean,
    confirm: Boolean
  },
  emits: ['close']
})
export default class Modal extends Vue {  
  public active: boolean = false; 
  public paramsDataStatusCode = 'N';
  public paramsDataIsLock = false;
}
