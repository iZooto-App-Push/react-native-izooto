import { NativeEventEmitter } from 'react-native';
import {
    NOTIFICATION_RECEIVED,
    NOTIFICATION_OPENED,
    NOTIFICATION_TOKEN,
    NOTIFICATION_WEBVIEW,
    ONETAP_RESPONSE
} from './events';

const eventList = [
    NOTIFICATION_RECEIVED,
    NOTIFICATION_OPENED,
    NOTIFICATION_TOKEN,
    NOTIFICATION_WEBVIEW,
    ONETAP_RESPONSE
]

export default class EventManager {
    constructor(RNIzootoModule) {
        this.RNIzootoModule = RNIzootoModule;
        this.notificationCache = new Map();
        this.izootoEventEmitter = new NativeEventEmitter(RNIzootoModule);
        this.eventHandlerMap = new Map();       // used for setters (single replacable callback)
        this.eventHandlerArrayMap = new Map();  // used for adders (multiple callbacks possible)
        this.listeners = [];
        this.setupListeners();
    }

    setupListeners() {
        // set up the event emitter and listeners
        if (this.RNIzootoModule != null) {

            for(let i = 0; i < eventList.length; i++) {
                let eventName = eventList[i];
                this.listeners[eventName] = this.generateEventListener(eventName);
            }
        }
    }

    // clear handlers
    clearHandlers() {
        this.eventHandlerMap = new Map();
        this.eventHandlerArrayMap = new Map();
    }

    /**
     * Sets the event handler on the JS side of the bridge
     * Supports only one handler at a time
     * @param  {string} eventName
     * @param  {function} handler
     */
     setEventHandler(eventName, handler) {
        this.eventHandlerMap.set(eventName, handler);
    }

    generateEventListener(eventName) {
        const addListenerCallback = (payload) => {
                let handler = this.eventHandlerMap.get(eventName);
                if (handler) {
                    if(payload!=null)
                    handler(payload);
                }
            // }
        };

        return this.izootoEventEmitter.addListener(eventName, addListenerCallback);
    }
}
