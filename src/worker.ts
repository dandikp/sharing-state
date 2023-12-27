import { WindowState, WorkerMessage } from "./types";

let client: MessagePort[] = [];
let nextId: number = 0;
let windows: { windowState: WindowState; id: number; port: MessagePort }[] = [];

onconnect = ({ ports }) => {
  const port = ports[0];
  client.push(port);

  const sendSync = () => {
    windows.forEach((w) =>
      w.port.postMessage({
        action: "sync",
        payload: { allWindows: JSON.parse(JSON.stringify(windows)) },
      } satisfies WorkerMessage),
    );
  };

  nextId += 1;

  port.onmessage = function (event: MessageEvent<WorkerMessage>) {
    const msg = event.data;

    switch (msg.action) {
      case "connected": {
        windows.push({
          id: nextId,
          windowState: msg.payload.state,
          port,
        });

        console.log("connected msg", { msg });
        const message: WorkerMessage = {
          action: "attributeId",
          payload: { id: nextId },
        };

        port.postMessage(message);
        sendSync();
        break;
      }
      case "windowUnloaded": {
        const id = msg.payload.id;
        windows = windows.filter((windowItem) => windowItem.id !== id);
        sendSync();
        break;
      }
      case "windowStateChanged": {
        const { id, newWindow } = msg.payload;
        const oldWindowIndex = windows.findIndex((w) => w.id === id);

        if (oldWindowIndex !== -1) {
          windows[oldWindowIndex].windowState = newWindow;
          sendSync();
        }

        break;
      }
    }
  };

  port.onmessageerror = function () {
    console.error("oh oopsies~");
  };
};

self.addEventListener("beforeunload", () => console.log("oopsies~"));
