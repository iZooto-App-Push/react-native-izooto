//  declare module 'react-native-izooto'
//   {
  export type PushTemplate =  1 | 2 | 3 ;

  
  export type PushNotificationEventName =
  | 'onNotificationOpened'
  | 'onTokenReceived'
  | 'onWebView'
  | 'onNotificationReceived'
  | 'registrationError';

export interface iZooto {

  // for ios 
  initiOSAppID(izooto_app_id:string):void;
  setSubscription(isSubscribe:boolean): void;
  addUserProperty(propertiesData:Map<string,any>):void;
  addEvent(eventName:string,eventData:Map<string,any>):void;
  
  addEventListener(
    type: 'onNotificationOpened',
    handler: (notification: string) => void,
  ): void;
  addEventListener(
    type: 'onWebView',
    handler: (notification: string) => void,
  ): void;
  addEventListener(
    type: 'onNotificationReceived',
    handler: (notification: string) => void,
  ): void;
  addEventListener(
    type: 'onTokenReceived',
    handler: (deviceToken: string) => void,
  ): void;
  addEventListener(
    type: 'registrationError',
    handler: (error: {message: string; code: number; details: any}) => void,
  ): void;
  removeEventListener(type: PushNotificationEventName): void;
  // for Android only 

  initAndroid(isDefaultWebView : boolean): void;

  setFirebaseAnalytics(isSetFirebaseAnalytics: boolean): void;

  setSubscription(isSetSubscribed: boolean): void;

  addEvent(eventName: String,triggers: object): void;

  addUserProperty(triggers: object): void;
  
  addTag(keys: string[]);

  removeTag(keys: string[]);

  onTokenReceivedListener(handle?: (token : String) =>void) : void;

  onNotificationOpenedListener(handle?: (data : String) => void) :void;

  onNotificationReceivedListener(handle?: (payload :String) => void): void;
   
  onWebViewListener(handle?: (landingUrl : String) => void) : void;

  setDefaultTemplate(templateID: PushTemplate): void;

  setDefaultNotificationBanner(setBanner: String): void;

  setNotificationSound(soundName: String): void;
  
  promptForPushNotifications(): void;
  
  setNotificationChannelName(channelName : String): void

  navigateToSettings():void
  
    
}
   const iZooto: iZooto;
   export default iZooto;
//}
