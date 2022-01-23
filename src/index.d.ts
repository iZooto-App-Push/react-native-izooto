// declare module 'react-native-izooto'
//  {
  // export interface FetchResult {
  //   NewData: 'UIBackgroundFetchResultNewData';
  //   NoData: 'UIBackgroundFetchResultNoData';
  //   ResultFailed: 'UIBackgroundFetchResultFailed';
  // }
  
  // export interface AuthorizationStatus {
  //   UNAuthorizationStatusNotDetermined: 0;
  //   UNAuthorizationStatusDenied: 1;
  //   UNAuthorizationStatusAuthorized: 2;
  //   UNAuthorizationStatusProvisional: 3;
  // }
  
  // export type NotificationAlert = {
  //   title?: string;
  //   subtitle?: string;
  //   body?: string;
  // };
  
  // export type NotificationCategory = {
  //   id: string;
  //   actions: NotificationAction[];
  // };
  // export type NotificationAction = {
 
  //   id: string;
    
  //   title: string;
    
  //   options?: {
  //     foreground?: boolean;
  //     destructive?: boolean;
  //     authenticationRequired?: boolean;
  //   };
    
  //   textInput?: {
     
  //     buttonTitle?: string;
      
  //     placeholder?: string;
  //   };
  // };
  // export interface PushNotification {
  
  //   getMessage(): string | NotificationAlert;
  
  //   getSound(): string;
  
  //   getCategory(): string;
  
    
  //   getAlert(): string | NotificationAlert;
  
  //   getTitle(): string;
  
  //   getContentAvailable(): number;
  
  //   getBadgeCount(): number;
  
  //   getData(): Record<string, any>;
  
  //   getActionIdentifier(): string | undefined;
  
  //   getUserText(): string | undefined;
  
  //   finish(result: string): void;
  // }
  // export type NotificationRequest = {
  
  //   id: string;
    
  //   title?: string;
    
  //   subtitle?: string;
    
  //   body?: string;
    
  //   badge?: number;
    
  //   sound?: string;
    
  //   category?: string;
    
  //   threadId?: string;
   
  //   fireDate?: Date;
    
  //   repeats?: boolean;
    
  //   repeatsComponent?: {
  //     year?: boolean;
  //     month?: boolean;
  //     day?: boolean;
  //     dayOfWeek?: boolean;
  //     hour?: boolean;
  //     minute?: boolean;
  //     second?: boolean;
  //   };
   
  //   isSilent?: boolean;
    
  //   isCritical?: boolean;
    
  //   criticalSoundVolume?: number;
    
  //   userInfo?: Record<string, any>;
  // };
  // export interface PresentLocalNotificationDetails {
  //   alertAction?: string;
  //   alertBody: string;
  //   alertTitle?: string;
  //   applicationIconBadgeNumber?: number;
  //   category?: string;
  //   soundName?: string;
  //   isSilent?: boolean;
  //   userInfo?: Record<string, any>;
  // }
  // export interface PushNotificationPermissions {
  //   alert?: boolean;
  //   badge?: boolean;
  //   sound?: boolean;
  //   critical?: boolean;
  //   lockScreen?: boolean;
  //   notificationCenter?: boolean;
  //   authorizationStatus?: AuthorizationStatus[keyof AuthorizationStatus];
  // }
  
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
// for Android 

       // initialize(): void;

        //setFirebaseAnalytics(isSetFirebaseAnalytics: boolean): void;

        //setSubscription(isSetSubscribed: boolean): void;

        //addEvent(eventName: String,triggers: object): void;

        //addUserProperty(triggers: object): void;
    
        
      }
     const iZooto: iZooto;
     export default iZooto;
//}