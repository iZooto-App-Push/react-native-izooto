import React, {Component} from 'react';
import {Platform, Button, Text, View} from 'react-native';
import iZooto from '../src';
import {PushTemplate} from '../src/PushTemplate';

export default class App extends React.Component {
  async componentDidMount() {


    if (Platform.OS === 'ios') {
      iZooto.initiOSAppID('d8586f035eb5723058304989c05be301ca87a26b');
      iZooto.syncUserDetailsEmail('ios1@gmail.com', 'Demo', 'Demo');

      iZooto.addEventListener('onTokenReceived', (token) => {
        console.log('iZooto Device Token', token);
      });

      iZooto.addEventListener('onNotificationOpened', (openData) => {
        // eslint-disable-next-line no-alert
        alert('DeepLink');
        console.log('Notification Deep Link Data', openData);
      });
      iZooto.addEventListener('onWebView', (urlData) => {
        // eslint-disable-next-line no-alert
        alert('Webview');
        console.log('Notification WebView URL Data', urlData);
      });
      iZooto.addEventListener('onNotificationReceived', (data) => {
        // console.log("Notification Payload Data ",data);
      });
      // const obj = {name: "oadd"};
      // const myJSON = JSON.stringify(obj);
      // iZooto.addUserProperty(myJSON);
      // iZooto.addEvent('AAAAP',myJSON);
      // iZooto.setSubscription(true);

      var notificationData = await iZooto.getNotificationFeed(false);
      console.log(notificationData);
    } else {
      iZooto.initAndroid(false);
      //iZooto.setNotificationChannelName('Push Notification Data'); // channel name

      //var notificationData = await iZooto.getNotificationFeed(false);
      //console.log(notificationData);

      iZooto.promptForPushNotifications();
      iZooto.onNotificationOpenedListener((data) => {
        console.log('DeepLink Data Received', data);
      });
      iZooto.onNotificationReceivedListener((payload) => {
        console.log('Notification Payload', payload);
      });
      //webview listener

      iZooto.onWebViewListener((landingUrl) => {
        console.log('Landing URL', landingUrl);
      });
      iZooto.onTokenReceivedListener((token) => {
        console.log('Token Received', token);
      });

      // iZooto.requestOneTapActivity();
      // iZooto.requestOneTapListener((response) => {
      //   console.log('response', response);
      // });
      iZooto.syncUserDetailsEmail('abc@gmail.com', 'Demo', 'Demo');
    }


    // iZooto.setDefaultTemplate(PushTemplate.DEFAULT);
    // iZooto.setDefaultNotificationBanner('image_name');
    // iZooto.setNotificationSound('sound_name_here');
  }

  render() {
    return (
      <View style={{ padding: 160 }}>
      <Button
        title="Clicks to Navigate Setting"
        onPress={() => iZooto.navigateToSettings()}
      />
      <View style={{ height: 16 }} />
      <Button
        title="Unsubscribe"
        onPress={() => iZooto.setSubscription(false)}
      />
      <View style={{ height: 16 }} />
      <Button
        title="Subscribe"
        onPress={() => iZooto.setSubscription(true)}
      />
    </View>
    );
  }
}
// iZooto.navigateToSettings()