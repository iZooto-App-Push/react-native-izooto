import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';

import iZooto from '../src';

export default class App extends React.Component {
  async componentDidMount() {
    if (Platform.OS === 'ios') {
      iZooto.initiOSAppID('11f896fa4cab1d4e159c2f26a257be41b388ecf2');

      iZooto.addEventListener('onTokenReceived', (token) => {
        console.log('iZooto Device Token', token);
      });

      iZooto.addEventListener('onNotificationOpened', (openData) => {
        alert('DeepLink');
        console.log('Notification Deep Link Data', openData);
      });

      iZooto.addEventListener('onWebView', (urlData) => {
        alert('Webview');
        console.log('Notification WebView URL Data', urlData);
      });

      iZooto.addEventListener('onNotificationReceived', (data) => {
        // Handle notification received
      });

      const notificationData = await iZooto.getNotificationFeed(false);
      console.log(notificationData);
    } else {
      iZooto.initAndroid(false);
      iZooto.promptForPushNotifications();

      iZooto.onNotificationOpenedListener((data) => {
        console.log('DeepLink Data Received', data);
      });

      iZooto.onNotificationReceivedListener((payload) => {
        console.log('Notification Payload', payload);
      });

      iZooto.onWebViewListener((landingUrl) => {
        console.log('Landing URL', landingUrl);
      });

      iZooto.onTokenReceivedListener((token) => {
        console.log('Token Received', token);
      });

      iZooto.addUserProperty({ language: 'english' });
    }
  }

  render() {
    return (
      <View style={styles.container}>
      
        <CustomButton
          title="Go to Settings"
          onPress={() => iZooto.navigateToSettings()}
        />
        <CustomButton
          title="Unsubscribe"
          onPress={() => iZooto.setSubscription(false)}
        />
        <CustomButton
          title="Subscribe"
          onPress={() => iZooto.setSubscription(true)}
        />
      </View>
    );
  }
}

const CustomButton = ({ title, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.button}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
  button: {
    backgroundColor: '#4A90E2',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
