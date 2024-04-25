type EventType = "checklist-refresh" | "checklist-update";

const eventTarget = new EventTarget();

function dispatch(eventType: EventType) {
  eventTarget.dispatchEvent(new Event(eventType));
}

function addListener(eventType: EventType, callback: EventListener): EventListener {
  eventTarget.addEventListener(eventType, callback);
  return callback;
}

function removeListener(eventType: EventType, callback: EventListener) {
  eventTarget.removeEventListener(eventType, callback);
}

const eventMgr = { addListener, dispatch, removeListener };

export default eventMgr;
