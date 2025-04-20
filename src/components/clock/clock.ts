import { Vue } from "vue-class-component";

export default class Clock extends Vue {
  public inc = 1000;

  clock() {
    const date = new Date();

    const hours = ((date.getHours() + 11) % 12) + 1;
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const hour = hours * 30;
    const minute = minutes * 6;
    const second = seconds * 6;

    console.log(document.querySelector<HTMLElement>(".hour"));
    const h = document.querySelector<HTMLElement>(".hour");
    const m = document.querySelector<HTMLElement>(".minute");
    const s = document.querySelector<HTMLElement>(".second");
    h.style.transform = `rotate(${hour}deg)`;
    m.style.transform = `rotate(${minute}deg)`;
    s.style.transform = `rotate(${second}deg)`;
  }

  mounted(): void {
    this.clock();
    setInterval(this.clock, this.inc);
  }
}
