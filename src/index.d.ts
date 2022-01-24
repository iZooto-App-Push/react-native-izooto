//  declare module 'react-native-izooto'
//   {
    export type PushTemplate = 0 | 1 ;

    export type OSInAppDisplayOption = 0 | 1 | 2;
  
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

    initAndroid(): void;

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


    setInAppNotificationBehaviour(displayOption: OSInAppDisplayOption): void;
        
    setIcon(icon1: String): void;

      }
     const iZooto: iZooto;
     export default iZooto;
//}
 