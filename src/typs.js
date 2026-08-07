export type NotificationRequest = {|
    id: string,
    title?: string,
    subtitle?: string,
    body?: string,
    badge?: number,
    sound?: string,
    category?: string,
    threadId?: string,
    fireDate?: Date,
    repeats?: boolean,
   repeatsComponent?: {
      year?: boolean,
      month?: boolean,
      day?: boolean,
      dayOfWeek?: boolean,
      hour?: boolean,
      minute?: boolean,
      second?: boolean,
    },
   isSilent?: boolean,
    isCritical?: boolean,
   criticalSoundVolume?: number,
   userInfo?: Object,
  |};
  export type NotificationAlert = {|
    title?: string,
    subtitle?: string,
    body?: string,
  |};
 export type NotificationCategory = {|
    id: string,
    actions: NotificationAction[],
  |};
  export type NotificationAction = {|
    id: string,
    title: string,
    options?: {
      foreground?: boolean,
      destructive?: boolean,
      authenticationRequired?: boolean,
    },
    textInput?: {
      buttonTitle?: string,
      placeholder?: string,
    },
  |};
//   export const NOTIFICATION_RECEIVED = 'iZooto_Notification_Received';
//   export const NOTIFICATION_OPENED    = 'iZooto_Notification_Opened';
//   export const NOTIFICATION_TOKEN = 'iZooto_Notification_Token';
//   export const NOTIFICATION_WEBVIEW = 'iZooto_Notification_Landing_URL';