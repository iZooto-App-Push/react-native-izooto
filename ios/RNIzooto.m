
#if __has_include(<React/RCTConvert.h>)
#import <React/RCTConvert.h>
#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>
#import <React/RCTUtils.h>
#else
#import "RCTConvert.h"
#import "RCTBridge.h"
#import "RCTEventDispatcher.h"
#import "RCTUtils.h"
#endif

#import "RNIzooto.h"
#import "RCTiZootoEventEmitter.h"

@import iZootoiOSSDK;

#if __IPHONE_OS_VERSION_MIN_REQUIRED < __IPHONE_8_0
#define UIUserNotificationTypeAlert UIRemoteNotificationTypeAlert
#define UIUserNotificationTypeBadge UIRemoteNotificationTypeBadge
#define UIUserNotificationTypeSound UIRemoteNotificationTypeSound
#define UIUserNotificationTypeNone  UIRemoteNotificationTypeNone
#define UIUserNotificationType      UIRemoteNotificationType

#endif

@interface RNIzooto()
@end

@implementation RNIZooto : NSObject
{
    BOOL didInitailise;
}
+ (RNIzooto *) sharedInstance {
    static dispatch_once_t token = 0;
    static id _sharedInstance = nil;
    dispatch_once(&token, ^{
        _sharedInstance = [[RNIzooto alloc] init];
    });
    return _sharedInstance;
}
- (void)initiZooto:(NSDictionary *)launchOptions {

    if (didInitailise)
        return;

    [iZooto initialisationWithIzooto_id:<#(NSString * _Nonnull)#> application:<#(UIApplication * _Nonnull)#> iZootoInitSettings:<#(NSDictionary<NSString *,id> * _Nonnull)#>]
   // [iZooto initWithLaunchOptions:launchOptions];
    didInitailise = true;
}
- (void)handleRemoteNotificationOpened:(NSString *)result {
    NSDictionary *json = [self jsonObjectWithString:result];

    if (json)
        [self sendEvent:OSEventString(NotificationOpened) withBody:json];
}


- (NSDictionary *)jsonObjectWithString:(NSString *)jsonString {
    NSError *jsonError;
    NSData *data = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
    NSDictionary *json = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingMutableContainers error:&jsonError];

    if (jsonError) {
        
        return nil;
    }

    return json;
}
- (void)sendEvent:(NSString *)eventName withBody:(NSDictionary *)body {
    [RCTiZootoEventEmitter sendEventWithName:eventName withBody:body];
}

- (void)dealloc {
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

@end


