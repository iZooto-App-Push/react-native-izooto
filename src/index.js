'use strict';

import { NativeModules,Platform,NativeEventEmitter} from 'react-native';
import EventManager from  './EventManager';
import invariant from 'invariant';
import {
    NOTIFICATION_RECEIVED,
    NOTIFICATION_OPENED,
    NOTIFICATION_TOKEN,
    NOTIFICATION_WEBVIEW,
    ONETAP_RESPONSE,
} from './events';
export type PushNotificationEventName = $Keys<{ 
  onNotificationOpened: string,
  onWebView:String,
  onNotificationReceived:String,
  onTokenReceived: string, 
  registrationError: string,
  oneTapResponse: String,
}>;
const DEVICE_NOTIF_EVENT = 'remoteNotificationReceived';
const NOTIF_REGISTER_EVENT = 'remoteNotificationsRegistered';
const NOTIF_REGISTRATION_ERROR_EVENT = 'remoteNotificationRegistrationError';
const NOTIF_REMOTE_WEB_URL= 'remoteNotificationLandingURL';
const NOTIF_REMOTE_RECEIVED_PAYLOAD='remoteNotificationPayload';
const RESPONSE_ONETAP = 'remoteResponeOneTap';

var  RNIzootoModule, eventManager, RNIzooto, PushNotificationEmitter, _notifHandlers;

if(Platform.OS==='android')
{
 RNIzootoModule = NativeModules.iZooto;
 eventManager = new EventManager(RNIzootoModule);
}
else{
  RNIzooto = NativeModules.RNIzooto;
  PushNotificationEmitter = new NativeEventEmitter(RNIzooto);
  _notifHandlers = new Map();
}
export default class iZooto {

 /* Add  Listener in iOS */  
    static addEventListener(type: PushNotificationEventName, handler: Function) {
        invariant(
          type === 'onNotificationOpened' ||
            type === 'onTokenReceived' ||
            type ==='onWebView'||
            type ==='onNotificationReceived'||
            type === 'registrationError' ||
            type === 'oneTapResponse',
          'iZootoPush Notificaiton  only supports ` onNotificationOpened`, `onNotificationReceived`,`onTokenReceived`, `onWebView` ,Events',
        );
        let listener;
        if (type === 'onNotificationOpened') {
          listener = PushNotificationEmitter.addListener(
            DEVICE_NOTIF_EVENT,
            (notifData) => {
              handler(notifData);
            },
          );
        } else if (type === 'onTokenReceived') {
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
              handler(errorInfo);
            },
          );
        } else if (type === 'onWebView') {
          listener = PushNotificationEmitter.addListener(
            NOTIF_REMOTE_WEB_URL,
            (notifData) => {
              handler(notifData);
            },
          );
        }
        else if (type === 'onNotificationReceived') {
          listener = PushNotificationEmitter.addListener(
            NOTIF_REMOTE_RECEIVED_PAYLOAD,
            (notifData) => {
              handler(notifData);
            },
          );
        }
        else if (type === 'oneTapResponse') {
          listener = PushNotificationEmitter.addListener(
            RESPONSE_ONETAP,
            (response) => {
              handler(response);
            },
          );
        }

        _notifHandlers.set(type, listener);
      }
      static removeEventListener(type: PushNotificationEventName) {
        invariant(
          type === 'onNotificationOpened' ||
            type === 'onTokenReceived' ||
            type ==='onWebView'||
            type ==='onNotificationReceived'||
            type === 'registrationError' ||
            type === 'oneTapResponse',
            'iZootoPush Notificaiton  only supports ` onNotificationOpened`, `onNotificationReceived`,`onTokenReceived`, `onWebView` ,Events',
            );
        const listener = _notifHandlers.get(type);
        if (!listener) {
          return;
        }
        listener.remove();
        _notifHandlers.delete(type);
      }


/*  Android initialization   */

      //  static initAndroid() {
      //   if(Platform.OS ==='android'){
      //    RNIzootoModule.initAndroid();
      //   }  
      //  }

static initAndroid(isDefaultWebView) {
  if(Platform.OS ==='android'){
   RNIzootoModule.initAndroid(isDefaultWebView);
  }  
 }
  static promptForPushNotifications() {
        if(Platform.OS==='android'){
          RNIzootoModule.promptForPushNotifications();
        }
      }

 /*  iOS initialization   */
 
   static initiOSAppID(izooto_app_id)
   {
     if(izooto_app_id!=null)
     {
     if(Platform.OS==='ios')
       {
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
 /* To Send Event Properties */

      static addEvent(eventName, eventData)
      {
        if(Platform.OS ==='ios')
        {
        invariant(
          RNIzooto,'Zooto Push Notificaitonis not available.',
        );        
        RNIzooto.addEvents(eventName, eventData);
        }
        if(Platform.OS ==='android')
        {
          let keys = Object.keys(eventData);

          if (keys.length === 0) {
              console.error(`iZooto: Event Data: argument must be an object of the form { key : 'value' }`);
          }
          RNIzootoModule.addEvent(eventName,eventData);
        }     
      
      }
  /* To Send User Properties */

      static addUserProperty(propertiesData){
        if(Platform.OS === 'ios')
        {
        invariant(
          RNIzooto,
          'PushNotificationManager is not available.',
        );        
        RNIzooto.addUserProperties(propertiesData)
        }
        if(Platform.OS === 'android')
        {
          let keys = Object.keys(propertiesData);

        if (keys.length === 0) {
            console.error(`iZooto: propertiesData: argument must be an object of the form { key : 'value' }`);
        }
        RNIzootoModule.addUserProperty(propertiesData);

        }
      }


  /* To Send Subscription  */
  static setSubscription(isSubscribe){
    if(Platform.OS ==='ios')
      {
        RNIzooto.setSubscription(isSubscribe);
       }
     if(Platform.OS ==='android')
      {
        RNIzootoModule.setSubscription(isSubscribe);
      }
 }

  /*  setNotificationChannelName */

static setNotificationChannelName(channelName) {
  if(Platform.OS==='android'){
    RNIzootoModule.setNotificationChannelName(channelName);
  }
}
/*  setNotificationChannelName */

static navigateToSettings() {
  if(Platform.OS==='android'){
    RNIzootoModule.navigateToSettings();
  }
  if(Platform.OS === 'ios')
  {
    RNIzooto.navigateToSettings();

  }
}

/*  To Send  FirebaseAnalytics Events   */

  static setFirebaseAnalytics(isSetFirebaseAnalytics){
    if(Platform.OS==='android'){
     RNIzootoModule.setFirebaseAnalytics(isSetFirebaseAnalytics);
    }
    else
    {
      console.log("Under developement Analytics feature in iOS")
    }
 }

 /*  To Add Topic Properties   */

 static addTag(topicName) {
    if(Platform.OS ==='android')
    {
    if (!Array.isArray(topicName)) {
                console.error("iZooto: topicName: argument must be of array type");
            }
            RNIzootoModule.addTag(topicName)
        }
      }

/*  To Remove Topic  Properties   */

  static removeTag(topicName) {
          if(Platform.OS ==='android')
          {
            if (!Array.isArray(topicName)) {
                console.error("iZooto: topicName: argument must be of array type");
            }
            RNIzootoModule.removeTag(topicName)
          }
        }
     
/*  Token Listener  */

        static onTokenReceivedListener(handler){
            if(Platform.OS ==='android'){
            RNIzootoModule.onTokenReceivedListener();
            eventManager.setEventHandler(NOTIFICATION_TOKEN, handler);
            }
        }

 /*  DeepLink Listener  */
       
        static onNotificationOpenedListener(handler){
            if(Platform.OS === 'android')
            {
            RNIzootoModule.onNotificationOpenedListener();
            eventManager.setEventHandler(NOTIFICATION_OPENED, handler);
            }
        }

   /*  Receive Notification Listener  */
      
        static onNotificationReceivedListener(handler){
            if(Platform.OS === 'android'){
            RNIzootoModule.onNotificationReceivedListener();
            eventManager.setEventHandler(NOTIFICATION_RECEIVED, handler);
            }
        }

   /*  WebView Listener  */
      
        static onWebViewListener(handler){
            if(Platform.OS === 'android')
            {
            RNIzootoModule.onWebViewListener();
            eventManager.setEventHandler(NOTIFICATION_WEBVIEW, handler);
            }
        }

 /*  To Add Notificaiton Preview */
     
    static setDefaultTemplate(templateID) {
      if(Platform.OS ==='android'){
        RNIzootoModule.setDefaultTemplate(templateID);
      }
    }

 /*  To Add Notificaiton Preview  Banner*/

    static setDefaultNotificationBanner(setBanner) {
      if(Platform.OS ==='android'){
        RNIzootoModule.setDefaultNotificationBanner(setBanner);
      }
    }

 /*  To Add Notificaiton Sound */

    static setNotificationSound(soundName) {
      if(Platform.OS==='android'){
        RNIzootoModule.setNotificationSound(soundName);
      }
    }


    /*  To Add Notification Feed  */

    static async getNotificationFeed(isPagination) {
      if(Platform.OS==='android'){
        const notificationFeed = await RNIzootoModule.getNotificationFeed(isPagination);
        if(notificationFeed!= null){
          return notificationFeed;
        } else{
          return "No more data";
        }
      }
      if(Platform.OS==='ios')
      {
        return RNIzooto.getNotificationFeed(isPagination)
      }
    }
      /*  one tap response  */
      static requestOneTapListener(handler){
        if(Platform.OS === 'android'){
        RNIzootoModule.requestOneTapListener();
        eventManager.setEventHandler(ONETAP_RESPONSE, handler);
        }
    }
     /*  users sync details */
     static syncUserDetailsEmail(email, firstName, lastName) {
      if(Platform.OS ==='android'){
        RNIzootoModule.syncUserDetails(email,firstName,lastName);
      }
      else{
        RNIzooto.syncUserDetails(email,fname,lname);
      }
    }

     /*  users google one tap authentication  */
    static requestOneTapActivity() {
      if(Platform.OS ==='android'){
        RNIzootoModule.requestOneTapActivity();
      }
    }

 
}
