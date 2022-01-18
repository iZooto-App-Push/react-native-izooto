//
//  RCTiZootoEventEmitter.m
//  react-native-izooto
//
//  Created by Amit on 18/01/22.
//

#import "RCTiZootoEventEmitter.h"
#import "RNIzooto.h"


@import iZootoiOSSDK;

@implementation RCTiZootoEventEmitter {
    BOOL _hasListeners;
    NSMutableDictionary* _notificationCompletionCache;
    NSMutableDictionary* _receivedNotificationCache;
}
static BOOL _didStartObserving = false;

+ (BOOL)hasSetBridge {
    return _didStartObserving;
}
+(BOOL)requiresMainQueueSetup {
    return YES;
}
RCT_EXPORT_MODULE(RNIzooto)

-(instancetype)init {
    if (self = [super init]) {
        _notificationCompletionCache = [NSMutableDictionary new];
        _receivedNotificationCache = [NSMutableDictionary new];

        for (NSString *eventName in [self supportedEvents])
            [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(emitEvent:) name:eventName object:nil];
    }

    return self;
}

-(void)startObserving {
    _hasListeners = true;

    [[NSNotificationCenter defaultCenter] postNotificationName:@"didSetBridge" object:nil];

    _didStartObserving = true;
}

-(void)stopObserving {
    _hasListeners = false;
}

-(NSArray<NSString *> *)supportedEvents {
    NSMutableArray *events = [NSMutableArray new];

    for (int i = 0; i < OSNotificationEventTypesArray.count; i++)
        [events addObject:OSEventString(i)];

    return events;
}

- (NSArray<NSString *> *)processNSError:(NSError *)error {
    if (error.userInfo[@"error"]) {
        return @[error.userInfo[@"error"]];
    } else if (error.userInfo[@"returned"]) {
        return @[error.userInfo[@"returned"]];
    } else {
        return @[error.localizedDescription];
    }
}

- (void)emitEvent:(NSNotification *)notification {
    if (!_hasListeners) {
        return;
    }

    [self sendEventWithName:notification.name body:notification.userInfo];
}

+ (void)sendEventWithName:(NSString *)name withBody:(NSDictionary *)body {
    [[NSNotificationCenter defaultCenter] postNotificationName:name object:nil userInfo:body];
}
RCT_EXPORT_METHOD(setSubscription:(BOOL)required) {
    [iZooto setSubscriptionWithIsSubscribe:required];
}

RCT_EXPORT_METHOD(setAppId:(NSString* _Nonnull)newAppId) {
    [iZooto initialisationWithIzooto_id:newAppId application:UIApplication.sharedApplication iZootoInitSettings:<#(NSDictionary<NSString *,id> * _Nonnull)#>];
    
}
RCT_EXPORT_METHOD(setNotificationOpenedHandler) {
//   // [iZooto  setNotificationOpenedHandler:^(OSNotificationOpenedResult *result) {
//        [RCTiZootoEventEmitter sendEventWithName:@"iZooto-remoteNotificationOpened" withBody:[result jsonRepresentation]];
//    }];
}
RCT_EXPORT_METHOD(addEvents:(NSString *)key value:(NSDictionary*)value) {
    [iZooto addEventWithEventName:key data:value ];
}
RCT_EXPORT_METHOD(addUserProperties:(NSDictionary *)properties) {
    [iZooto addUserPropertiesWithData:properties];
}


@end


