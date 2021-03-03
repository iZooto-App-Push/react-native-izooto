declare module 'react-native-izooto'
{
    export interface iZooto {
        /**
         * Completes iZooto initialization.
         * @returns void
         */
        initialize(): void;

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
      }
     const iZooto: iZooto;
     export default iZooto;




}