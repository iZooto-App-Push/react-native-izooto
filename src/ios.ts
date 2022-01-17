import { NativeModules, NativeEventEmitter, EmitterSubscription, Platform } from 'react-native';
export enum AuthorizationOption {
    Badge = 1,
    Sound = 2,
    Alert = 4,
    CarPlay = 8,
    CriticalAlert  = 16,
    ProvidesAppNotificationSettings = 32,
  }
  export enum BackgroundFetchResult {
    NewData = 1,
    NoData = 2,
    Failed = 3,
  }
  export enum AuthorizationStatus {
    NotDetermined = 0,
    Denied = 1,
    Authorized = 2,
    Provisional = 3,
  }
  
  export enum NotificationSetting {
    NotSupported = 0,
    Disabled = 1,
    Enabled = 2,
  }
  export interface DeliveredNotification {
    body?: string|null;
    sound?: string|null;
    launchImageName?: string|null;
    badge?: number|null;
    subtitle?: string|null;
    title?: string|null;
    identifier: string;
    summaryArgumentCount?: number|null;
    summaryArgument?: string|null;
    date: number;
    categoryIdentifier?: string|null;
    threadIdentifier?: string|null;
    userInfo?: object;
  }
  export interface NotificationSettings {
    authorizationStatus: AuthorizationStatus;
    soundSetting: number;
    badgeSetting: number;
    alertSetting: number;
    notificationCenterSetting: number;
    lockScreenSetting: number;
    carPlaySetting: number;
    alertStyle: number;
    showPreviewsSetting?: number;
    criticalAlertSetting?: number;
    providesAppNotificationSettings?: number;
  }
  
  export interface NotificationArgs {
    id: string;
    title?: string; // aps.title
    subtitle?: string; // aps.subtitle
    body?: string; // aps.body
    badge?: number; // aps.badge
    sound?: string; // aps.sound
    categoryIdentifier?: string; // aps.category
    threadIdentifier?: string; // aps.thread-id
    userInfo?: any; // aps.userInfo
    // summaryArgument?
    // attachments?
  }
  export enum CategoryActionOptions {
    AuthenticationRequired = (1 << 0),
    Destructive = (1 << 1),
    Foreground = (1 << 2),
  }
  
  export interface CategoryAction {
    identifier: string;
    title: string;
    options: CategoryActionOptions;
  }
  
  export enum CategoryOptions {
    CustomDismissAction = (1 << 0),
    AllowInCarPlay = (1 << 1),
    HiddenPreviewsShowTitle = (1 << 2),
    HiddenPreviewsShowSubtitle = (1 << 3),
  }
  
  export interface Category {
    identifier: string;
    options: CategoryOptions;
    intentIdentifiers: string[];
    actions: CategoryAction[];
  }
  export interface Module {
    setVerbose(verbose: boolean): void;
    invokeCallback(key: string, value: any): void;
    setApplicationIconBadgeNumber(value: number): void;
    getApplicationIconBadgeNumber(): Promise<number>;
    registerForRemoteNotifications(): void;
    isRegisteredForRemoteNotifications(): Promise<boolean>;
    requestAuthorization(options: AuthorizationOption): Promise<void>;
    getNotificationSettings(): Promise<NotificationSettings>;
    removeDeliveredNotifications(ids: string[]): void;
    beginBackgroundTask(): Promise<string>;
    endBackgroundTask(key: string): void;
    getDeliveredNotifications(): Promise<DeliveredNotification[]>;
    openNotificationSettings(): void;
    showNotification(args: NotificationArgs): Promise<void>;
    setupCategories(categories: Category[]): void;
  }
  export type Event = {
    type: 'didRegisterForRemoteNotificationsWithDeviceToken';
    deviceToken: string;
    isDevEnvironment: boolean;
    bundle: string;
    locale: string;
  } | {
    type: 'didFailToRegisterForRemoteNotificationsWithError';
    message: string;
    code: number;
  } | {
    type: 'didReceiveRemoteNotification';
    userInfo: {
      [k: string]: any;
      aps: {
        sound?: string;
        badge?: number;
        ['content-available']?: 1|0;
        alert?: {
          body?: string;
          title?: string;
          subtitle?: string;
        }
      }
    };
    callbackKey: string;
  } | {
    type: 'didReceiveNotificationResponse';
    actionIdentifier: string;
    notification: DeliveredNotification;
    callbackKey: string;
  } | {
    type: 'willPresentNotification';
    notification: DeliveredNotification;
    callbackKey: string;
  };
  export const Module = (Platform.OS === 'ios') ? NativeModules.RNIzooto as Module : undefined;
  export const Events = Module ? new NativeEventEmitter(NativeModules.RNIzooto) as {
    addListener(eventType: 'ReactNativeMoPushNotification', listener: (event: Event) => void): EmitterSubscription;
  } : undefined;
