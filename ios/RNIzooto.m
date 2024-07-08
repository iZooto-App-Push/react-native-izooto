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

// handle the device token register/unregister
RCT_EXPORT_METHOD(setSubscription:(BOOL)isSubscribed)
{

    if (isSubscribed == 0) {
        [iZooto setSubscriptionWithIsSubscribe:NO];
    } else {
        [iZooto setSubscriptionWithIsSubscribe:YES];
    }
}
// added a new method for navigateToSettings
RCT_EXPORT_METHOD(navigateToSettings)
{
    [iZooto navigateToSettings];
}
// Get Notification Feed Data
RCT_EXPORT_METHOD(getNotificationFeed:(BOOL *) isPagination
                 resolver: (RCTPromiseResolveBlock)result
                 rejecter:(RCTPromiseRejectBlock)err)
{
    
    [iZooto getNotificationFeedWithIsPagination:isPagination completion:^(NSString *jsonString, NSError *error){
        if (error) {
            result(error);
        } else if (jsonString) {
            result(jsonString);
          
        }
    }];
   
}

RCT_EXPORT_METHOD(initiOSAppID:(NSString *)izooto_app_id)
{
       NSMutableDictionary *izootoInitSetting = [[NSMutableDictionary alloc]init];
             [izootoInitSetting setObject:@YES forKey:@"auto_prompt"];
             [izootoInitSetting setObject:@YES forKey:@"nativeWebview"];
             [izootoInitSetting setObject:@NO forKey:@"provisionalAuthorization"];
       [iZooto initialisationWithIzooto_id:izooto_app_id application:UIApplication.sharedApplication iZootoInitSettings:izootoInitSetting];
       [iZooto setPluginVersionWithPluginVersion:@"rv_2.5.5"];

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

+(void)willKillNotificationData :(NSDictionary *) killNotificationData
{
      
    if((![killNotificationData  isEqual: @""]) && (killNotificationData != NULL))
      {
          NSDictionary * aps = [killNotificationData objectForKey:@"aps"];
          NSString * landingURL = [aps objectForKey:@"ln"];
          NSDictionary * additionalData = [aps objectForKey:@"ap"];
          NSString * inApp = [aps objectForKey:@"ia"];
          
          if (((additionalData == NULL) || ([additionalData  isEqual: @""])) && ([inApp  isEqual: @"1"])){

              if (landingURL && [landingURL isKindOfClass:[NSString class]]) {
                  
                  NSDictionary *dict = @{ @"URL" : landingURL};
                                   [[NSNotificationCenter defaultCenter] postNotificationName:kRemoteNotificationWebViewData
                                                                                       object:self
                                                                                     userInfo:@{@"notification": dict}];
                  // landingURL is present and is a valid NSString, safe to use
                  NSLog(@"Landing URL: %@", landingURL);
              } else {
                  // Handle the case where landingURL is not present or is not a valid NSString
                  NSLog(@"Landing URL is not present or is not a valid NSString");
                  landingURL = @""; // Optional: Explicitly set to nil for clarity
              }

          }
          if (!landingURL && ![landingURL isKindOfClass:[NSString class]]) {
              landingURL = @""; // Optional: Explicitly set to nil for clarity

          }
          
          
          NSString * act1name = [aps objectForKey:@"b1"];
          if (act1name == NULL) {
              act1name = @"";
          }
          NSString * act1link = [aps objectForKey:@"l1"];
          if (act1link == NULL) {
              act1link = @"";
          }
          NSString * act2name = [aps objectForKey:@"b2"];
          if (act2name == NULL) {
              act2name = @"";
          }
          NSString * act2link = [aps objectForKey:@"l2"];
          if (act2link == NULL) {
              act2link = @"";
          }
          NSString * act1id = [aps objectForKey:@"d1"];
          if (act1id == NULL) {
              act1id = @"";
          }
          NSString * act2id = [aps objectForKey:@"d2"];
          if (act2id == NULL) {
              act2id = @"";
          }
          
          NSMutableDictionary *actionData = [[NSMutableDictionary alloc]init];
          
          [actionData setObject:act1id forKey:@"button1ID"];
          [actionData setObject:act1name forKey:@"button1Title"];
          [actionData setObject:act1link forKey:@"button1URL"];
          
          if (additionalData != NULL){
              [actionData setObject:additionalData forKey:@"additionalData"];
          }
          [actionData setObject:landingURL forKey:@"landingURL"];
          [actionData setObject:act2id forKey:@"button2ID"];
          
          [actionData setObject:act2name forKey:@"button2Title"];
          [actionData setObject:act2link forKey:@"button2URL"];
          [actionData setObject:@"0" forKey:@"actionType"];
          
          if ((additionalData != NULL) && (![additionalData  isEqual: @""])){
              [[NSNotificationCenter defaultCenter] postNotificationName:RCTRemoteNotificationReceived
                                                                  object:nil
                                                                userInfo:@{@"notification": actionData}];
          }
      }
      else{
          NSLog(@"Notification Data is not found");
      }
}
-(void) handleLandingURLData:(NSNotification *)notification
{

    NSMutableDictionary *remoteNotification = [NSMutableDictionary dictionaryWithDictionary:notification.userInfo[@"notification"]];
    [self sendEventWithName:@"remoteNotificationLandingURL" body:remoteNotification];
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




