
#import "RNIzooto.h";



@interface RNIzooto : NSObject

+(RNIzooto *) shareInstance;

@property(nonatomic) BOOL didStartObserving;

-(void)initiZooto:(NSDictionary *)launchOptions;


@end




