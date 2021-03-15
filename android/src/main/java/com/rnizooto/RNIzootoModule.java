package com.rnizooto;

import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.gson.Gson;
import com.izooto.NotificationHelperListener;
import com.izooto.NotificationWebViewListener;
import com.izooto.Payload;
import com.izooto.TokenReceivedListener;
import com.izooto.iZooto;

import java.util.ArrayList;
import java.util.List;

public class RNIzootoModule extends ReactContextBaseJavaModule implements TokenReceivedListener, NotificationHelperListener, NotificationWebViewListener {

    private ReactApplicationContext mReactApplicationContext;
    private ReactContext mReactContext;
    private String notificationOpened, notificationToken, notificationWebView;
    private Payload notificationPayload;
    private boolean isInit=false;
    public RNIzootoModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.mReactApplicationContext = reactContext;
    }
    @Override
    public String getName() {
        return "iZooto";
    }

    @ReactMethod
    public void initAndroid() {
        if(!isInit) {
            isInit=true;
            try {
                iZooto.initialize(mReactApplicationContext)
                        .setTokenReceivedListener(this)
                        .setNotificationReceiveListener(this)
                        .setLandingURLListener(this).build();
            }
            catch (IllegalStateException ex)
            {
                Log.e("Exception",""+ex.toString());
            }
        }

    }
    @ReactMethod
    public void setSubscription(boolean enable) {
        iZooto.setSubscription(enable);
    }

    @ReactMethod
    public void setFirebaseAnalytics(boolean isSet) {
        iZooto.setFirebaseAnalytics(isSet);
    }

    @ReactMethod
    public void addEvent(String eventName, ReadableMap triggers) {
        iZooto.addEvent(eventName,triggers.toHashMap());
    }

    @ReactMethod
    public void addUserProperty(ReadableMap triggers) {
        iZooto.addUserProperty(triggers.toHashMap());
    }

    @ReactMethod
    public void addTag(ReadableArray topicName) {
        List<String> list = getArrayList(topicName);
        iZooto.addTag(list);
    }

    @ReactMethod
    public void removeTag(ReadableArray topicName) {
        List<String> list = getArrayList(topicName);
        iZooto.removeTag(list);
    }

    @ReactMethod
    public void onNotificationReceivedListener() {
        this.onNotificationReceived(notificationPayload);
    }
    @ReactMethod
    public void onNotificationOpenedListener() {
        this.onNotificationOpened(notificationOpened);
    }
    @ReactMethod
    public void onWebViewListener() {
        this.onWebView(notificationWebView);
    }
    @ReactMethod
    public void onTokenReceivedListener() {
        this.onTokenReceived(notificationToken);
    }



    private void sendEvent(String eventName, Object params) {
        mReactApplicationContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    @Override
    public void onNotificationReceived(Payload payload) {
        notificationPayload = payload;
        if (payload!=null) {
            Gson gson = new Gson();
            String jsonPayload = gson.toJson(payload);
            sendEvent(iZootoConstants.RECEIVED_NOTIFICATION, jsonPayload);
        }


    }

    @Override
    public void onNotificationOpened(String data) {
        notificationOpened = data;
        if (data!=null) {
            sendEvent(iZootoConstants.OPEN_NOTIFICATION,data);
        }


    }

    @Override
    public void onWebView(String landingUrl) {
        notificationWebView = landingUrl;
        if (landingUrl!=null) {
            sendEvent(iZootoConstants.LANDING_URL, landingUrl);
        }
    }

    @Override
    public void onTokenReceived(String token) {
        notificationToken = token;
        if (token!=null) {
            sendEvent(iZootoConstants.RECEIVE_TOKEN,token);
        }

    }

    private List<String> getArrayList(ReadableArray tagKey){
        List<String> list = new ArrayList<>();
        for (Object object : tagKey.toArrayList()) {
            if (object instanceof String)
                list.add((String) object);
        }
        return list;
    }
}
