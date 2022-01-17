#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>
@import iZootoiOSSDK;
#import <UserNotifications/UserNotifications.h>
#import <React/RCTEventEmitter.h>



@interface AppDelegate : UIResponder <UIApplicationDelegate,UNUserNotificationCenterDelegate,iZootoLandingURLDelegate,iZootoNotificationOpenDelegate,iZootoNotificationReceiveDelegate,RCTBridgeDelegate>

@property (nonatomic, strong) UIWindow *window;
@property (nonatomic, strong) RCTBridge *bridge;

@property(nonatomic, weak)id <iZootoLandingURLDelegate> landingURLDelegate;
@property(nonatomic, weak)id <iZootoNotificationOpenDelegate> notificationOpenDelegate;
@property(nonatomic, weak)id <iZootoNotificationReceiveDelegate> notificationReceivedDelegate;

@end
