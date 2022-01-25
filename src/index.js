'use strict';

import { NativeModules,Platform,NativeEventEmitter} from 'react-native';
import EventManager from  './EventManager';

import invariant from 'invariant';
import {
    NOTIFICATION_RECEIVED,
    NOTIFICATION_OPENED,
    NOTIFICATION_TOKEN,
    NOTIFICATION_WEBVIEW,
} from './events';
// Android
if(Platform.OS==='android')
{
const  RNIzootoModule = NativeModules.iZooto;
const eventManager = new EventManager(RNIzootoModule);
}

//ios 
const RNIzooto = NativeModules.RNIzooto;
const PushNotificationEmitter = new NativeEventEmitter(RNIzooto);
const _notifHandlers = new Map();
const DEVICE_NOTIF_EVENT = 'remoteNotificationReceived';
const NOTIF_REGISTER_EVENT = 'remoteNotificationsRegistered';
const NOTIF_REGISTRATION_ERROR_EVENT = 'remoteNotificationRegistrationError';
const NOTIF_REMOTE_WEB_URL= 'remoteNotificationLandingURL';
const NOTIF_REMOTE_RECEIVED_PAYLOAD='remoteNotificationPayload';
export type PushNotificationEventName = $Keys<{
    
    deepLinkData: string,
    landingURL:String,
    receivePayload:String,
    register: string, 
    registrationError: string,
  }>;
export default class iZooto {
 static addEventListener(type: PushNotificationEventName, handler: Function) {
        invariant(
          type === 'deepLinkData' ||
            type === 'register' ||
            type ==='landingURL'||
            type ==='receivePayload'||
            type === 'registrationError' ,
          'iZootoPush Notificaiton  only supports `notification`, `register`, `registrationError` ,events',
        );
        let listener;
        if (type === 'deepLinkData') {
          listener = PushNotificationEmitter.addListener(
            DEVICE_NOTIF_EVENT,
            (notifData) => {
              handler(notifData);
            },
          );
        } else if (type === 'register') {
          listener = PushNotificationEmitter.addListener(
            NOTIF_REGISTER_EVENT,
            (registrationInfo) => {
              handler(registrationInfo.deviceToken);
            },
          );
        } else if (type === 'registrationError') {
          listener = PushNotificationEmitter.addListener(
            NOTIF_REGISTRATION_ERROR_EVENT,
            (errorInfo) => {
              console.log(errorInfo);
              handler(errorInfo);
            },
          );
        } else if (type === 'landingURL') {
          listener = PushNotificationEmitter.addListener(
            NOTIF_REMOTE_WEB_URL,
            (notifData) => {
              handler(notifData);
            },
          );
        }
        else if (type === 'receivePayload') {
          listener = PushNotificationEmitter.addListener(
            NOTIF_REMOTE_RECEIVED_PAYLOAD,
            (notifData) => {
              handler(notifData);
            },
          );
        }

        _notifHandlers.set(type, listener);
      }
      static removeEventListener(type: PushNotificationEventName) {
        invariant(
          type === 'deepLinkData' ||
            type === 'register' ||
            type ==='landingURL'||
            type ==='receivePayload'||
            type === 'registrationError',
          'iZooto Push Notificaiton  only supports `notification`, `register`, `registrationError`, events',
        );
        const listener = _notifHandlers.get(type);
        if (!listener) {
          return;
        }
        listener.remove();
        _notifHandlers.delete(type);
      }

      static addEvent(eventName,eventData)
      {
        if(Platform.OS==='ios')
        {
        console.log(eventName);
        invariant(
          RNIzooto,
          'Zooto Push Notificaitonis not available.',
        );        
        RNIzooto.addEvents(eventName,eventData);
        }
        if(Platform.OS==='android')
        {
          let keys = Object.keys(triggers);

          if (keys.length === 0) {
              console.error(`iZooto: addTriggers: argument must be an object of the form { key : 'value' }`);
          }
          RNIzootoModule.addEvent(eventName,eventData);
        }     
      
      }
      static addUserProperty(propertiesData){
        if(Platform.OS==='ios')
        {
        invariant(
          RNIzooto,
          'PushNotificationManager is not available.',
        );        
        RNIzooto.addUserProperties(propertiesData)
        }
        if(Platform.OS==='android')
        {
          let keys = Object.keys(propertiesData);

        if (keys.length === 0) {
            console.error(`iZooto: addTriggers: argument must be an object of the form { key : 'value' }`);
        }
        RNIzootoModule.addUserProperty(propertiesData);

        }
      }
      static setSubscription(isSetSubscribed){
       
        if(Platform.OS==='ios')
        {
         console.log(isSetSubscribed);
         invariant(
                RNIzooto,
                'iZooto iOS Notification is not available.',
              );
          if (isSetSubscribed )   
         RNIzooto.setSubscription(1);
         else
         RNIzooto.setSubscription(0);
       }
       if(Platform.OS==='android')
       {
         RNIzootoModule.setSubscription(isSetSubscribed);
 
       }
       }
       static initAndroid() {
        RNIzootoModule.initAndroid();
        
    }
    static initiOSAppID(izooto_app_id)
    {
      if(izooto_app_id!=null)
      {
      if(Platform.OS==='ios')
        {
          console.log(izooto_app_id);
          RNIzooto.initiOSAppID(izooto_app_id);

        }
        else
        {
          console.log("Plateform Error");

        }
    }
    else{
      console.log("iZooto app id is not null ");
    }
  }
  static setFirebaseAnalytics(isSetFirebaseAnalytics){
    if(Platform.OS==='android'){
     RNIzootoModule.setFirebaseAnalytics(isSetFirebaseAnalytics);
    }
    else
    {
      console.log("Under developement Analytics feature in iOS")
    }
 }
 static addTag(topicName) {
    if(Platform.OS==='android')
    {
    if (!Array.isArray(topicName)) {
                console.error("iZooto: topicName: argument must be of array type");
            }
    
            RNIzootoModule.addTag(topicName)
        }
      }
    
        static removeTag(topicName) {
          if(Platform.OS==='android')
          {
            if (!Array.isArray(topicName)) {
                console.error("iZooto: topicName: argument must be of array type");
            }
            RNIzootoModule.removeTag(topicName)
          }
        }
     
        static onTokenReceivedListener(handler){
            if(Platform.OS==='android'){
            RNIzootoModule.onTokenReceivedListener();
            eventManager.setEventHandler(NOTIFICATION_TOKEN, handler);
            }
        }
        static onNotificationOpenedListener(handler){
            if(Platform.OS === 'android')
            {
            RNIzootoModule.onNotificationOpenedListener();
            eventManager.setEventHandler(NOTIFICATION_OPENED, handler);
            }
        }
        static onNotificationReceivedListener(handler){
            if(Platform.OS=== 'android'){
            RNIzootoModule.onNotificationReceivedListener();
            eventManager.setEventHandler(NOTIFICATION_RECEIVED, handler);
            }
        }
        static onWebViewListener(handler){
            if(Platform.OS === 'android')
            {
            RNIzootoModule.onWebViewListener();
            eventManager.setEventHandler(NOTIFICATION_WEBVIEW, handler);
            }
        }
    static setDefaultTemplate(templateID) {
        RNIzootoModule.setDefaultTemplate(templateID);
    }

    static setDefaultNotificationBanner(setBanner) {
        RNIzootoModule.setDefaultNotificationBanner(setBanner);
    }

    static setNotificationSound(soundName) {
        RNIzootoModule.setNotificationSound(soundName);
    }
    
    static iZootoHandleNotification(data) {
        RNIzootoModule.iZootoHandleNotification(data)
    }

    static setInAppNotificationBehaviour(displayOption) {
        RNIzootoModule.setInAppNotificationBehaviour(displayOption)
    }

    static setIcon(icon1) {
        RNIzootoModule.setIcon(icon1);  
    }
    
}
