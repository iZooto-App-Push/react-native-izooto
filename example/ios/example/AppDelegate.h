#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>
#import <UserNotifications/UserNotifications.h>
@import iZootoiOSSDK;

@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate,UNUserNotificationCenterDelegate,iZootoNotificationReceiveDelegate,iZootoLandingURLDelegate,iZootoNotificationOpenDelegate>

@property (nonatomic, strong) UIWindow *window;
@property(nonatomic, weak)id <iZootoLandingURLDelegate> landingURLDelegate;
@property(nonatomic, weak)id <iZootoNotificationOpenDelegate> notificationOpenDelegate;
@property(nonatomic, weak)id <iZootoNotificationReceiveDelegate> notificationReceivedDelegate;

@end
