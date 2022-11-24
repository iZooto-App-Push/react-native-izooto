#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <RNIzooto.h>

#ifdef FB_SONARKIT_ENABLED
#import <FlipperKit/FlipperClient.h>
#import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
#import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
#import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
#import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
#import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>

@import iZootoiOSSDK;
@import UserNotifications;




static void InitializeFlipper(UIApplication *application) {
  FlipperClient *client = [FlipperClient sharedClient];
  SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
  [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application withDescriptorMapper:layoutDescriptorMapper]];
  [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
  [client addPlugin:[FlipperKitReactPlugin new]];
  [client addPlugin:[[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
  [client start];
}
#endif

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
#ifdef FB_SONARKIT_ENABLED
  InitializeFlipper(application);
#endif

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"example"
                                            initialProperties:nil];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  UNUserNotificationCenter *center =
       [UNUserNotificationCenter currentNotificationCenter];
   center.delegate = self;
 
  if (launchOptions != nil)
  {
    NSLog(@"Now Data");
  NSDictionary* userInfo = [launchOptions objectForKey:UIApplicationLaunchOptionsRemoteNotificationKey];
  if (userInfo != nil)
  {
  [self performSelector:@selector(HandleKilledStateNotification:) withObject: userInfo afterDelay:1];
  }
  }
     iZooto.landingURLDelegate = self;
   iZooto.notificationOpenDelegate=self;
  // iZooto.notificationReceivedDelegate = self;
  
  
  
  
  
  return YES;
}
/* Call the method when notification tap in killed state */
-(void) HandleKilledStateNotification: (NSDictionary*) userInfo {
  [RNIzooto willKillNotificationData:userInfo];
}
/* Received the device token  when app is registered sucessfully  */

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
    [RNIzooto didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
  
}

/* Received the paylaod when app is foreground */
-(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler{
 
  [RNIzooto willPresentNotificaiton:notification.request.content.userInfo];
  [iZooto handleForeGroundNotificationWithNotification:notification displayNotification:@"NONE" completionHandler:completionHandler];

}
- (void)application:(UIApplication *)application
    didReceiveRemoteNotification:(NSDictionary *)userInfo
          fetchCompletionHandler:
              (void (^)(UIBackgroundFetchResult))completionHandler {
  [RNIzooto didReceiveRemoteNotification:userInfo
                               fetchCompletionHandler:completionHandler];
}
/* Handle the notification tap */
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
    didReceiveNotificationResponse:(UNNotificationResponse *)response
             withCompletionHandler:(void (^)(void))completionHandler {
  [RNIzooto didReceiveNotificationResponse:response];

  completionHandler();
}


- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}


- (void)onHandleLandingURLWithUrl:(NSString * _Nonnull)url {
  NSLog(@"DeepLinkData1");

  [RNIzooto onHandleLandingURLWithUrl:url];
}
/* handle the deeplink Data*/
- (void)onNotificationOpenWithAction:(NSDictionary<NSString *,id> * _Nonnull)action {
  NSLog(@"DeepLinkData");
  [RNIzooto onNotificationOpenWithAction:action];

}


- (void)onNotificationReceivedWithPayload:(Payload * _Nonnull)payload {
  NSLog(@"Payload");
}

@end
