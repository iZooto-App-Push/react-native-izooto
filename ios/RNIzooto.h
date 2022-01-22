#import <React/RCTBridgeModule.h>
#import <RNIzooto.h>
#import <React/RCTConvert.h>
#import <React/RCTUtils.h>
#import <React/RCTEventEmitter.h>
#import <UserNotifications/UserNotifications.h>
@import iZootoiOSSDK;
extern NSString *const RNCRemoteNotificationReceived;

@interface RNIzooto : RCTEventEmitter

typedef void (^RNCRemoteNotificationCallback)(UIBackgroundFetchResult result);

#if !TARGET_OS_TV
+ (void)didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings;
+ (void)didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken;
+ (void)didReceiveRemoteNotification:(NSDictionary *)notification;
+ (void)didReceiveRemoteNotification:(NSDictionary *)notification fetchCompletionHandler:(RNCRemoteNotificationCallback)completionHandler;
+ (void)didReceiveNotificationResponse:(UNNotificationResponse *)response API_AVAILABLE(ios(10.0));
+(void)onHandleLandingURLWithUrl:(NSString *) url;
#endif

@end
