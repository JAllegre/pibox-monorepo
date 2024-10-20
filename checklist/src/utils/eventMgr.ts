export enum EventType {
  Refresh = "checklist-refresh",
  MoveItem = "checklist-move-item",
}
export interface CustomEventDetailsMoveItem {
  id: number;
  isUp: boolean;
}

export type CustomEventDetails = CustomEventDetailsMoveItem;

const eventTarget = new EventTarget();

function dispatch(eventType: EventType, detail?: CustomEventDetails) {
  eventTarget.dispatchEvent(new CustomEvent(eventType, { detail }));
}

function addListener(eventType: EventType, callback: EventListener): EventListener {
  eventTarget.addEventListener(eventType, callback);
  return callback;
}

function removeListener(eventType: EventType, callback: EventListener) {
  eventTarget.removeEventListener(eventType, callback);
}

const eventMgr = { addListener, removeListener, dispatch };

export default eventMgr;
