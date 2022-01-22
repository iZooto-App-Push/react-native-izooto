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
  
  
//   NSMutableDictionary *izootoInitSetting = [[NSMutableDictionary alloc]init];
//         [izootoInitSetting setObject:@YES forKey:@"auto_prompt"];
//         [izootoInitSetting setObject:@NO forKey:@"nativeWebview"];
//         [izootoInitSetting setObject:@NO forKey:@"provisionalAuthorization"];
//   [iZooto initialisationWithIzooto_id:@"11f896fa4cab1d4e159c2f26a257be41b388ecf2" application:application iZootoInitSettings:izootoInitSetting];
  // [iZooto notificationOpenDelegate] = self;
  // iZooto.notificationReceivedDelegate = self;
   iZooto.landingURLDelegate = self;
  // iZooto.notificationOpenDelegate = self;
   //[UNUserNotificationCenter currentNotificationCenter].delegate = self;
   UNUserNotificationCenter *center =
        [UNUserNotificationCenter currentNotificationCenter];
    center.delegate = self;
  
  
  
  return YES;
}


- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
   // [iZooto getTokenWithDeviceToken:deviceToken];
    [RNIzooto didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
  
  NSString *token = [[deviceToken description] stringByTrimmingCharactersInSet: [NSCharacterSet characterSetWithCharactersInString:@"<>"]];
      token = [token stringByReplacingOccurrencesOfString:@" " withString:@""];
      NSLog(@"content---%@", token);
  //[RNIzooto handleReceivedPayloadData:@"AmitGupta"];
  
  
  
}
 
-(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler{
    NSLog(@"Response",notification);

  [iZooto handleForeGroundNotificationWithNotification:notification displayNotification:@"NONE" completionHandler:completionHandler];

}
- (void)application:(UIApplication *)application
    didReceiveRemoteNotification:(NSDictionary *)userInfo
          fetchCompletionHandler:
              (void (^)(UIBackgroundFetchResult))completionHandler {
 // [RNIzooto didReceiveRemoteNotification:userInfo
                           //     fetchCompletionHandler:completionHandler];
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center
didReceiveNotificationResponse:(UNNotificationResponse *)response
     withCompletionHandler:(void (^)(void))completionHandler
{
  [RNIzooto didReceiveNotificationResponse:response];
  NSLog(@"Clicked",response);
 // [iZooto notificationHandlerWithResponse:response];

  

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
  NSLog(@"URL",url);
  [RNIzooto onHandleLandingURLWithUrl:url];
}

- (void)onNotificationOpenWithAction:(NSDictionary<NSString *,id> * _Nonnull)action {
  NSLog(@"Action",action);

}

- (void)onNotificationReceivedWithPayload:(Payload * _Nonnull)payload {
  NSLog(@"Payload","Payload");

}


@end
