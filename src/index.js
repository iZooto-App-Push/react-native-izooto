'use strict';

import { NativeModules ,Platform} from 'react-native';
import EventManager from  './EventManager';
import {
    NOTIFICATION_RECEIVED,
    NOTIFICATION_OPENED,
    NOTIFICATION_TOKEN,
    NOTIFICATION_WEBVIEW,
} from './events';
const  RNIzootoModule = NativeModules.iZooto;
const eventManager = new EventManager(RNIzootoModule);

export default class iZooto {
    /* I N I T I A L I Z A T I O N */

    
    static initialize() {
        RNIzootoModule.initAndroid();
    }
    /**
     * @param {boolean} isSetFirebaseAnalytics
     */
    static setFirebaseAnalyticsFire(isSetFirebaseAnalytics){
        RNIzootoModule.setFirebaseAnalytics(isSetFirebaseAnalytics);
    }

    /**
     * @param {boolean} isSetSubscribed
     */
    static setSubscription(isSetSubscribed){
        RNIzootoModule.setSubscription(isSetSubscribed);
        // this.eventListener = eventEmitter.addListener('iZooto_notification_token', (event) => {
        //     console.log(event.eventProperty) // "someValue"
        //  });
    }

    /**
     * @param {string} eventName
     */
    // Expected format is Map<String, Object>, make sure all values are Objects and keys are Strings
    static addEvent(eventName,triggers){
        let keys = Object.keys(triggers);

        if (keys.length === 0) {
            console.error(`iZooto: addTriggers: argument must be an object of the form { key : 'value' }`);
        }
        RNIzootoModule.addEvent(eventName,triggers);
    }

    static addUserProperty(triggers){
        let keys = Object.keys(triggers);

        if (keys.length === 0) {
            console.error(`iZooto: addTriggers: argument must be an object of the form { key : 'value' }`);
        }
        RNIzootoModule.addUserProperty(triggers);
    }

    static addTag(topicName) {

        if (!Array.isArray(topicName)) {
            console.error("iZooto: topicName: argument must be of array type");
        }

        RNIzootoModule.addTag(topicName)
    }

    static removeTag(topicName) {

        if (!Array.isArray(topicName)) {
            console.error("iZooto: topicName: argument must be of array type");
        }

        RNIzootoModule.removeTag(topicName)
    }

    
    static onTokenReceivedListener(handler){
        RNIzootoModule.onTokenReceivedListener();
        eventManager.setEventHandler(NOTIFICATION_TOKEN, handler);
    }
    
    static onNotificationOpenedListener(handler){
        // if (!checkIfInitialized(RNOneSignal)) return;
        // isValidCallback(handler);

        RNIzootoModule.onNotificationOpenedListener();
        eventManager.setEventHandler(NOTIFICATION_OPENED, handler);
    }

    static onNotificationReceivedListener(handler){
        RNIzootoModule.onNotificationReceivedListener();
        eventManager.setEventHandler(NOTIFICATION_RECEIVED, handler);

    }
    
    static onWebViewListener(handler){
        RNIzootoModule.onWebViewListener();
        eventManager.setEventHandler(NOTIFICATION_WEBVIEW, handler);
    }
}