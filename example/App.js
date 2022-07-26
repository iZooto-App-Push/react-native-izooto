

import React, { Component } from 'react';
import { Platform, StyleSheet,Linking, Text, View,  Alert,
} from 'react-native';
import iZooto from '../src';
import { OSInAppDisplayOption } from '../src/OSInAppDisplayOption';
import { PushTemplate } from '../src/PushTemplate';

export default class App extends React.Component {
     componentDidMount() {
      

       if (Platform.OS === 'ios') {
        iZooto.initiOSAppID("11f896fa4cab1d4e159c2f26a257be41b388ecf2");
        
        iZooto.addEventListener('onTokenReceived', (token) => {
          console.log("iZooto Device Token", token)
           });
       iZooto.addEventListener('onNotificationOpened',(openData)=>
        {
        console.log("Notification Deep Link Data",openData);
         });
      iZooto.addEventListener('onWebView',(urlData)=>{
        console.log("Notification WebView URL Data",urlData);

        });
      iZooto.addEventListener('onNotificationReceived',(data)=>
        {
        console.log("Notification Payload Data ",data);
       });
    //   const obj = {name: "oadd"};
    //   const myJSON = JSON.stringify(obj);
    //   iZooto.addUserProperty(myJSON);
    //   iZooto.addEvent('AAAAP',myJSON);
    //  iZooto.setSubscription(true);
      }
      else
      {
        iZooto.initAndroid();
        iZooto.onNotificationOpenedListener(data =>{
        console.log("DeepLink Data Received",data);
      });      
      iZooto.onNotificationReceivedListener(payload => {
        console.log("Notification Payload",payload); 
      });
  
      iZooto.onWebViewListener(landingUrl =>{
        console.log("Landing URL",landingUrl); 
      });
      iZooto.onTokenReceivedListener(token =>{
        console.log("Token Received",token);
      });
      
      } 
      iZooto.setDefaultTemplate(PushTemplate.TEXT_OVERLAY);
      iZooto.setDefaultNotificationBanner("image_name");
      iZooto.setNotificationSound("sound_name_here");
      iZooto.setInAppNotificationBehaviour(OSInAppDisplayOption.Notification);
      iZooto.setIcon("icon_name");
      
   }
  //  componentWillUnmount()
  //  {
  //    iZooto.removeEventListener('onNotificationOpened');
  //    iZooto.removeEventListener('onWebView');
  //    iZooto.removeEventListener('onNotificationReceived');
  //    iZooto.removeEventListener('onTokenReceived');

  //  }
render() {
        return (
            <View>
               
                <Text> React Native Library for iZooto  
                   Push Notifications Service </Text>

            </View>
        );
    }
}
