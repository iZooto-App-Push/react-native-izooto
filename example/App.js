import * as React from 'react';
import {useState, useEffect} from 'react';

import {
  View,
  StyleSheet,
  Text,
  NativeEventEmitter,
  NativeModules
  } from 'react-native';
  import PushNotificationIOS from '@react-native-community/push-notification-ios';

  //var iosPlugin = NativeModules.iZootoiOSPlugin;
  //var data = NativeModules.iZootoiOSModule;
  //import iZooto from 'react-native-izooto';

export default class App extends React.Component{ 
  constructor(props){
  super(props) 
  //iZooto.in
  //NativeModules.iZootoiOSModule.iZootoinitalise("1234567");
  
  //PushNotificationIOS.addEventListener('register', onRegistered);
  
  PushNotificationIOS.addEventListener('register', onRegistered);
  
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
 


  const onRegistered = (deviceToken) => {
    {
      console.log(deviceToken);
      console("amit");
  
    };};

NativeModules.iZootoiOSPlugin.getDeepLinkData((err ,name) => {
  console.log("deeplink1", name);
});
NativeModules.iZootoiOSPlugin.getWebViewData((err ,name) => {
  console.log("getWebViewData1", name);
});
NativeModules.iZootoiOSPlugin.getPayload((err ,name) => {
  console.log("getPayload1", name);
}); 

  }
  render() {
  return (
      <Text > iZooto Push Notification</Text>
);
  }
}
