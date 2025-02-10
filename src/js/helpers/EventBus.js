/**
 * @type {EventBus}
 */

class EventBus {

    _events = {};

    constructor() {
        if (window.__event_bus_instance) return window.__event_bus_instance;
        window.__event_bus_instance = this;
    }

    static getInstance() {
        if (!window.__event_bus_instance) {
            window.__event_bus_instance = new EventBus();
        }
        return window.__event_bus_instance;
    }

    on(event, callback) {
        if (!this._events[event]) this._events[event] = [];
        this._events[event].push(callback);
    }

    emit(event, ...args) {
        if (!this._events[event]) return;
        this._events[event].forEach(callback => callback(...args));
    }
}


window.__event_bus_instance ||= null;

export default EventBus;