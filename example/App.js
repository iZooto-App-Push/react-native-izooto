import React from 'react';
import {
  Platform,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import iZooto from '../src';
import {PushTemplate} from '../src/PushTemplate';

export default class App extends React.Component {
  async componentDidMount() {
    if (Platform.OS === 'ios') {
      iZooto.initiOSAppID('d8586f035eb5723058304989c05be301ca87a26b');
      iZooto.syncUserDetailsEmail('ios1@gmail.com', 'Demo', 'Demo');

      iZooto.addEventListener('onTokenReceived', token => {
        console.log('iZooto Device Token', token);
      });

      iZooto.addEventListener('onNotificationOpened', openData => {
        alert('DeepLink');
        console.log('Notification Deep Link Data', openData);
      });

      iZooto.addEventListener('onWebView', urlData => {
        alert('Webview');
        console.log('Notification WebView URL Data', urlData);
      });

      iZooto.addEventListener('onNotificationReceived', data => {
        // console.log("Notification Payload Data ",data);
      });

      const notificationData = await iZooto.getNotificationFeed(false);
      console.log(notificationData);
    } else {
      iZooto.initAndroid(false);

      iZooto.promptForPushNotifications();

      iZooto.onNotificationOpenedListener(data => {
        console.log('DeepLink Data Received', data);
      });

      iZooto.onNotificationReceivedListener(payload => {
        console.log('Notification Payload', payload);
      });

      iZooto.onWebViewListener(landingUrl => {
        console.log('Landing URL', landingUrl);
      });

      iZooto.onTokenReceivedListener(token => {
        console.log('Token Received', token);
      });

      iZooto.syncUserDetailsEmail('abc@gmail.com', 'Demo', 'Demo');
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {/* Title */}
        <Text style={styles.title}>iZooto React Native Demo App</Text>

        {/* Buttons */}
        <CustomButton
          label="Go to Settings"
          color="#007bff"
          onPress={() => iZooto.navigateToSettings()}
        />
        <CustomButton
          label="Unsubscribe"
          color="#dc3545"
          onPress={() => iZooto.setSubscription(false)}
        />
        <CustomButton
          label="Subscribe"
          color="#28a745"
          onPress={() => iZooto.setSubscription(true)}
        />
      </View>
    );
  }
}

// Reusable button component
const CustomButton = ({label, onPress, color}) => (
  <TouchableOpacity
    style={[styles.button, {backgroundColor: color}]}
    onPress={onPress}>
    <Text style={styles.buttonText}>{label}</Text>
  </TouchableOpacity>
);

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    color: '#333',
  },
  button: {
    width: '80%',
    paddingVertical: 14,
    borderRadius: 12,
    marginVertical: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
