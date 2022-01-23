// declare module 'react-native-izooto'
//  {
  export type PushNotificationEventName =
    | 'deepLinkData'
    | 'register'
    | 'landingURL'
    | 'receivePayload'
    | 'registrationError';
  
  export interface iZooto {

    // for ios 
    initiOSAppID(izooto_app_id:string):void;
    setSubscription(isSubscribe:boolean): void;
    addUserProperty(propertiesData:Map<string,any>):void;
    addEvent(eventName:string,eventData:Map<string,any>):void;
    setFirebaseAnalyticsFire(isSetFirebaseAnalytics:boolean):void;
    addEventListener(
      type: 'deepLinkData',
      handler: (notification: string) => void,
    ): void;
    addEventListener(
      type: 'landingURL',
      handler: (notification: string) => void,
    ): void;
    addEventListener(
      type: 'receivePayload',
      handler: (notification: string) => void,
    ): void;
    addEventListener(
      type: 'register',
      handler: (deviceToken: string) => void,
    ): void;
    addEventListener(
      type: 'registrationError',
      handler: (error: {message: string; code: number; details: any}) => void,
    ): void;
    removeEventListener(type: PushNotificationEventName): void;
    // for Android only 

    initialize():void;
    addTag(keys: string[]);
    removeTag(keys: string[]);

    //onTokenReceivedListener(handle?: (token : String) =>void) : void;

    //onNotificationOpenedListener(handle?: (data : String) => void) :void;

    //onNotificationReceivedListener(handle?: (payload :String) => void): void;
     
    //onWebViewListener(handle?: (landingUrl : String) => void) : void;

    
        
      }
     const iZooto: iZooto;
     export default iZooto;
//}