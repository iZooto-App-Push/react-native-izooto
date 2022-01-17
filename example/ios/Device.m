//
//  Device.m
//  example
//
//  Created by Amit on 17/01/22.
//

#import "Device.h"
#import <UIKit/UIKit.h>
@import iZootoiOSSDK;

@implementation iZootoiOSPlugin

//export the name of the native module as 'Device' since no explicit name is mentioned
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(getToken:(RCTResponseSenderBlock)callback){
 @try{
   NSString *deviceName = [[UIDevice currentDevice] name];
   callback(@[[NSNull null], deviceName]);
 }
 @catch(NSException *exception){
   callback(@[exception.reason, [NSNull null]]);
 }
}
RCT_EXPORT_METHOD(getDeepLinkData:(RCTResponseSenderBlock)callback){
 @try{
   NSString *deviceName = [[UIDevice currentDevice] name];
   deviceName = @"aaaaaaaaa";

   callback(@[[NSNull null], deviceName]);
 }
 @catch(NSException *exception){
   callback(@[exception.reason, [NSNull null]]);
 }
}
RCT_EXPORT_METHOD(getWebViewData:(RCTResponseSenderBlock)callback){
 @try{
   NSString *deviceName = [[UIDevice currentDevice] name];
   deviceName = @"https://www.google.com";

   callback(@[[NSNull null], deviceName]);
 }
 @catch(NSException *exception){
   callback(@[exception.reason, [NSNull null]]);
 }
}
RCT_EXPORT_METHOD(getPayload:(RCTResponseSenderBlock)callback){
 @try{
   NSString *deviceName = [[UIDevice currentDevice] name];
   deviceName = @"https://www.google.com";
   callback(@[[NSNull null], deviceName]);
 }
 @catch(NSException *exception){
   callback(@[exception.reason, [NSNull null]]);
 }
}




@end
