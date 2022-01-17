import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  NativeEventEmitter,
  NativeModules
  } from 'react-native';
  var iosPlugin = NativeModules.iZootoiOSPlugin;

export default class App extends React.Component{ 
  constructor(props){
  super(props) 
 console.log("Kya cool hai hum");
 iosPlugin.getToken((err ,name) => {
  console.log("amit", name);
});
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
