export type WindowState = {
  screenX: number;
  screenY: number;
  width: number;
  height: number;
};

export type GlobalState = {
  current: WindowState;
  other: WindowState[];
};

export type MessageT<Action extends string, Payload extends unknown> = {
  action: Action;
  payload: Payload;
};

type WindowStateChangePayload = {
  oldWindow: WindowState;
  newWindow: WindowState;
  id: number;
};

type AttributeIdPayload = {
  id: number;
};

type WindowUnloadedPayload = {
  id: number;
};

export type WorkerMessage =
  | MessageT<"connected", { state: WindowState }>
  | MessageT<"sync", { allWindows: { windowState: WindowState; id: number }[] }>
  | MessageT<"windowStateChanged", WindowStateChangePayload>
  | MessageT<"attributeId", AttributeIdPayload>
  | MessageT<"windowUnloaded", WindowUnloadedPayload>;
