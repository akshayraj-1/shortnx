/**
 * @type {EventBus}
 */

class EventBus {

    _events = {};

    constructor() {
        if (window.__event_bus_instance__) return window.__event_bus_instance__;
        window.__event_bus_instance__ = this;
    }

    static getInstance() {
        if (!window.__event_bus_instance__) {
            window.__event_bus_instance__ = new EventBus();
        }
        return window.__event_bus_instance__;
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


window.__event_bus_instance__ ||= null;

export default EventBus;