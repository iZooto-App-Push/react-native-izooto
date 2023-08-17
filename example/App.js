

import React, { Component } from 'react';
import { Platform, StyleSheet,Linking, Button,Text, View,  Alert,
} from 'react-native';
import iZooto from '../src';
import { PushTemplate } from '../src/PushTemplate';

export default class App extends React.Component {
     
  async componentDidMount() {
      
       if (Platform.OS === 'ios') {
        iZooto.initiOSAppID("11f896fa4cab1d4e159c2f26a257be41b388ecf2");
        
        iZooto.addEventListener('onTokenReceived', (token) => {
          console.log("iZooto Device Token", token)
           });
       iZooto.addEventListener('onNotificationOpened',(openData)=>
        {
          alert("DeepLink");
           console.log("Notification Deep Link Data",openData);
         });
      iZooto.addEventListener('onWebView',(urlData)=>{
        alert("Webview");
        console.log("Notification WebView URL Data",urlData);

        });
      iZooto.addEventListener('onNotificationReceived',(data)=>
        {
       // console.log("Notification Payload Data ",data);
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
        iZooto.setNotificationChannelName("Push Notification Data") // channel name 


        var notificationData =await iZooto.getNotificationFeed(false);
        console.log(notificationData);

        // permission peompt for push notification android 13
        iZooto.promptForPushNotifications();
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
      iZooto.setDefaultTemplate(PushTemplate.DEFAULT);
      iZooto.setDefaultNotificationBanner("image_name");
      iZooto.setNotificationSound("sound_name_here");
      
   }

render() {
        return (
          <View style={{flex:1,justifyContent: "center",alignItems: "center"}}>
          <Text > React Native Library for iZooto
             Push Notifications Service </Text>
             <Button title='Clicks to Navigate Setting'
             onPress={()=>
             iZooto.navigateToSettings()
            }
             >Navigate To Setting</Button>
      </View>
        );
    }
}
