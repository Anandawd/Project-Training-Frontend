import getters from "./getters";
import { defineStore } from "pinia";
interface ActiveSockets {
  [url: string]: WebSocket;
}
const wsStore = defineStore("wsStore", {
  state: () => ({
    runningText: "",
    runningTextInterval: 0,
    runningTextDuration: 0,
    duration: 0,
    modifiedRoomAvailable: false,
    activeSockets: {} as ActiveSockets,
    announcement: {
      text: "",
      action: "",
    },
  }),
  actions: {
    setModifiedRoomAvailable(isModified: boolean) {
      this.modifiedRoomAvailable = isModified;
    },
    setActiveWebsocket(url: string, socket: WebSocket) {
      this.activeSockets[url] = socket;
    },
    setAnnouncement(text: string, action: string) {
      this.announcement.text = text;
      this.announcement.action = action;
    },
    setRunningText(payload: string, duration: number, interval: number) {
      this.runningText = payload;
      this.runningTextInterval = duration;
      this.runningTextDuration = interval;
      clearInterval;
      let IDInterval: number;
      if (interval > 0) {
        IDInterval = setInterval(() => {
          if (this.runningText != "") {
            this.runningText = "";
          } else {
            this.runningText = payload;
          }
        }, interval);
      }

      if (duration > 0) {
        setTimeout(() => {
          this.runningText = "";
          clearInterval(IDInterval);
        }, duration);
      }
    },
  },
  getters,
});

export default wsStore;
