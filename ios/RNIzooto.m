#import "RNIzooto.h"
#import <React/RCTBridge.h>
#import <React/RCTConvert.h>
#import <React/RCTEventDispatcher.h>
@import iZootoiOSSDK;

NSString *const RCTRemoteNotificationReceived = @"RemoteNotificationReceived";
static NSString *const kRemoteNotificationsRegistered = @"RemoteNotificationsRegistered";
static NSString *const kRemoteNotificationRegistrationFailed = @"RemoteNotificationRegistrationFailed";
static NSString *const kRemoteNotificationDeepLinkData=@"iZootoDeepLinkData";
 NSString *const kRemoteNotificationWebViewData=@"iZootoWebViewData";
 NSString *const KRemoteNotificationReceivedPayload=@"iZootoReceivedPayload";
static NSString *const kLocalNotificationReceived = @"LocalNotificationReceived";

#if !TARGET_OS_TV
@interface RNIzooto()
@property (nonatomic, strong) NSMutableDictionary *remoteNotificationCallbacks;
@end
#else
@interface RNIzooto () <NativePushNotificationManagerIOS>
@end
#endif

@implementation RNIzooto

RCT_EXPORT_MODULE()

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

#if !TARGET_OS_TV
- (void)startObserving
{
  
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(handleLocalNotificationReceived:)
                                               name:kLocalNotificationReceived
                                             object:nil];
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(handleRemoteNotificationReceived:)
                                               name:RCTRemoteNotificationReceived
                                             object:nil];
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(handleRemoteNotificationsRegistered:)
                                               name:kRemoteNotificationsRegistered
                                             object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self
                                              selector:@selector(handleRemoteNotificationRegistrationError:)
                                                  name:kRemoteNotificationRegistrationFailed
                                             object:nil];
   
    [[NSNotificationCenter defaultCenter] addObserver:self
                                              selector:@selector(handleLandingURLData:)
                                                  name:kRemoteNotificationWebViewData
                                             object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(receivedRemoteNotificaitonPayload:)
                                                  name:KRemoteNotificationReceivedPayload
                                             object:nil];
}

- (void)stopObserving
{
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}



+ (void)didRegisterUserNotificationSettings:(__unused UIUserNotificationSettings *)notificationSettings
{
}

+ (void)didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  NSMutableString *hexString = [NSMutableString string];
  NSUInteger deviceTokenLength = deviceToken.length;
  const unsigned char *bytes = deviceToken.bytes;
  for (NSUInteger i = 0; i < deviceTokenLength; i++) {
    [hexString appendFormat:@"%02x", bytes[i]];
  }
  [[NSNotificationCenter defaultCenter] postNotificationName:kRemoteNotificationsRegistered
                                                      object:self
                                                    userInfo:@{@"deviceToken" : [hexString copy]}];
    
    //[iZooto setPluginVersionWithPluginVersion:@"rv_2.0.9"];
    [iZooto getTokenWithDeviceToken:deviceToken];

}

+ (void)didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
  [[NSNotificationCenter defaultCenter] postNotificationName:kRemoteNotificationRegistrationFailed
                                                      object:self
                                                    userInfo:@{@"error": error}];
}

+ (void)didReceiveRemoteNotification:(NSDictionary *)notification
{
  NSDictionary *userInfo = @{@"notification": notification};
  [[NSNotificationCenter defaultCenter] postNotificationName:RCTRemoteNotificationReceived
                                                      object:self
                                                    userInfo:userInfo];
}

+ (void)didReceiveRemoteNotification:(NSDictionary *)notification
              fetchCompletionHandler:(RNCRemoteNotificationCallback)completionHandler
{
  NSDictionary *userInfo = @{@"notification": notification, @"completionHandler": completionHandler};
  [[NSNotificationCenter defaultCenter] postNotificationName:RCTRemoteNotificationReceived
                                                      object:self
                                                    userInfo:userInfo];

}

+(void) willPresentNotificaiton:(NSDictionary *)notification
         
{
    NSDictionary *userInfo = @{@"notification": notification};
    [[NSNotificationCenter defaultCenter] postNotificationName:KRemoteNotificationReceivedPayload
                                                        object:self
                                                      userInfo:userInfo];
}
-(void) receivedRemoteNotificaitonPayload:(NSNotification *) notification
{
    NSMutableDictionary *remoteNotification = [NSMutableDictionary dictionaryWithDictionary:notification.userInfo[@"notification"]];

    [self sendEventWithName:@"remoteNotificationPayload" body:remoteNotification];
}
- (void)handleRemoteNotificationReceived:(NSNotification *)notification
{

  NSMutableDictionary *remoteNotification = [NSMutableDictionary dictionaryWithDictionary:notification.userInfo[@"notification"]];

  [self sendEventWithName:@"remoteNotificationReceived" body:remoteNotification];
}


- (void)handleRemoteNotificationsRegistered:(NSNotification *)notification
{

  [self sendEventWithName:@"remoteNotificationsRegistered" body:notification.userInfo];
}
- (NSArray<NSString *> *)supportedEvents
{
  return @[@"localNotificationReceived",
           @"remoteNotificationReceived",
           @"remoteNotificationsRegistered",
           @"remoteNotificationLandingURL",
           @"remoteNotificationPayload",
           @"remoteNotificationRegistrationError"];
}


- (void)handleRemoteNotificationRegistrationError:(NSNotification *)notification
{
  NSError *error = notification.userInfo[@"error"];
  NSDictionary *errorDetails = @{
    @"message": error.localizedDescription,
    @"code": @(error.code),
    @"details": error.userInfo,
  };
  [self sendEventWithName:@"remoteNotificationRegistrationError" body:errorDetails];
}

RCT_EXPORT_METHOD(addUserProperties:(NSString*)propertiesData)
{
    NSLog(@"%@", propertiesData);

    if(propertiesData!= @""){
       
        NSData *jsonData = [propertiesData dataUsingEncoding:NSUTF8StringEncoding];
        NSError *error;
        NSMutableDictionary *data = [NSJSONSerialization JSONObjectWithData:jsonData
                                                           options:NSJSONReadingAllowFragments
                                                             error:&error];

        if (error) {
            NSLog(@"Got an error: %@", error);
        } else {
            NSLog(@"%@", data);
            [iZooto addUserPropertiesWithData:data];

        }

        
        
    }
   
}
RCT_EXPORT_METHOD(addEvents:(NSString*)eventName data:(NSString*)eventData)
{
    if(eventName!=@"" && eventData!= @""){
       
        NSData *jsonData = [eventData dataUsingEncoding:NSUTF8StringEncoding];
        NSError *error;
        NSMutableDictionary *data = [NSJSONSerialization JSONObjectWithData:jsonData
                                                           options:NSJSONReadingAllowFragments
                                                             error:&error];

        if (error) {
            NSLog(@"Got an error: %@", error);
        } else {
            NSLog(@"%@", data);
            [iZooto addEventWithEventName:eventName data:data];
        }
        
    }
    
    
}

RCT_EXPORT_METHOD(setSubscription:(NSInteger *) isSubscribed)
{
    if (isSubscribed == 1){
    [iZooto setSubscriptionWithIsSubscribe:true];
    }
    else{
       [iZooto setSubscriptionWithIsSubscribe:false];
    }

}

RCT_EXPORT_METHOD(initiOSAppID:(NSString *)izooto_app_id)
{
       NSMutableDictionary *izootoInitSetting = [[NSMutableDictionary alloc]init];
             [izootoInitSetting setObject:@YES forKey:@"auto_prompt"];
             [izootoInitSetting setObject:@YES forKey:@"nativeWebview"];
             [izootoInitSetting setObject:@NO forKey:@"provisionalAuthorization"];
       [iZooto initialisationWithIzooto_id:izooto_app_id application:UIApplication.sharedApplication iZootoInitSettings:izootoInitSetting];
    [iZooto setPluginVersionWithPluginVersion:@"rv_2.0.9"];

}




+ (void)didReceiveNotificationResponse:(UNNotificationResponse *)response
API_AVAILABLE(ios(10.0)) {
    [iZooto notificationHandlerWithResponse:response];
    
}


+(void) onHandleLandingURLWithUrl:(NSString *)url
{
    NSDictionary *dict = @{ @"URL" : url};
    [[NSNotificationCenter defaultCenter] postNotificationName:kRemoteNotificationWebViewData
                                                          object:self
                                                      userInfo:@{@"notification": dict}];
}
-(void) handleLandingURLData:(NSNotification *)notification
{
    NSMutableDictionary *remoteNotification = [NSMutableDictionary dictionaryWithDictionary:notification.userInfo[@"notification"]];
    [self sendEventWithName:@"remoteNotificationReceived" body:remoteNotification];

}
+(void) onNotificationOpenWithAction:(NSDictionary *) actionData
{
    [[NSNotificationCenter defaultCenter] postNotificationName:RCTRemoteNotificationReceived
                                                          object:self
                                                      userInfo:@{@"notification": actionData}];
}
RCT_EXPORT_METHOD(checkPermissions:(RCTResponseSenderBlock)callback)
{
  if (RCTRunningInAppExtension()) {
    callback(@[RCTSettingsDictForUNNotificationSettings(NO, NO, NO, NO, NO, UNAuthorizationStatusNotDetermined)]);
    return;
  }
  
  [UNUserNotificationCenter.currentNotificationCenter getNotificationSettingsWithCompletionHandler:^(UNNotificationSettings * _Nonnull settings) {
    callback(@[RCTPromiseResolveValueForUNNotificationSettings(settings)]);
    }];
  }

static inline NSDictionary *RCTPromiseResolveValueForUNNotificationSettings(UNNotificationSettings* _Nonnull settings) {
  return RCTSettingsDictForUNNotificationSettings(settings.alertSetting == UNNotificationSettingEnabled,
                                                  settings.badgeSetting == UNNotificationSettingEnabled,
                                                  settings.soundSetting == UNNotificationSettingEnabled,
                                                  settings.lockScreenSetting == UNNotificationSettingEnabled,
                                                  settings.notificationCenterSetting == UNNotificationSettingEnabled,
                                                  settings.authorizationStatus);
  }

static inline NSDictionary *RCTSettingsDictForUNNotificationSettings(BOOL alert, BOOL badge, BOOL sound,BOOL lockScreen, BOOL notificationCenter, UNAuthorizationStatus authorizationStatus) {
  return @{@"alert": @(alert), @"badge": @(badge), @"sound": @(sound), @"lockScreen": @(lockScreen), @"notificationCenter": @(notificationCenter), @"authorizationStatus": @(authorizationStatus)};
  }


#endif
@end




