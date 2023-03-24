package com.rnizooto;

import android.content.Context;
import android.os.Build;
import android.util.Log;

import androidx.annotation.RequiresApi;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.izooto.NotificationHelperListener;
import com.izooto.NotificationReceiveHybridListener;
import com.izooto.NotificationWebViewListener;
import com.izooto.Payload;
import com.izooto.PushTemplate;
import com.izooto.TokenReceivedListener;
import com.izooto.iZooto;
import org.json.JSONArray;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@SuppressWarnings("unchecked")
public class RNIzootoModule extends ReactContextBaseJavaModule implements TokenReceivedListener,NotificationWebViewListener, NotificationHelperListener, NotificationReceiveHybridListener {

    private ReactApplicationContext mReactApplicationContext;
    private String notificationOpened, notificationToken, notificationWebView, notificationPayload;
    private boolean isInit;

    public RNIzootoModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mReactApplicationContext = reactContext;
    }
    @Override
    public String getName() {
        return "iZooto";
    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    @ReactMethod
    public void initAndroid() {
        iZooto.isHybrid = true;
        if(!isInit) {
            isInit=true;
            try {
                iZooto.initialize(mReactApplicationContext)
                        .setTokenReceivedListener(this)
                        .setNotificationReceiveListener(this)
                        .setLandingURLListener(this)
                        .setNotificationReceiveHybridListener(this)
                        .unsubscribeWhenNotificationsAreDisabled(true)
                        .build();
                iZooto.setPluginVersion(iZootoConstants.Plugin_VERSION);
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
    public void setDefaultTemplate(int templateID) {
        if (templateID == 2) {
            iZooto.setDefaultTemplate(PushTemplate.TEXT_OVERLAY);
        }
        else if(templateID ==3)
        {
            iZooto.setDefaultTemplate(PushTemplate.DEVICE_NOTIFICATION_OVERLAY);

        }
        else {
            iZooto.setDefaultTemplate(PushTemplate.DEFAULT);

        }

    }

    @ReactMethod
    public void setDefaultNotificationBanner(String setBanner) {
        if (getBadgeIcon(mReactApplicationContext, setBanner) != 0)
            iZooto.setDefaultNotificationBanner(getBadgeIcon(mReactApplicationContext, setBanner));
    }

    @ReactMethod
    public void setNotificationSound(String soundName) {
        iZooto.setNotificationSound(soundName);
    }

    @ReactMethod
    public void iZootoHandleNotification(ReadableMap data){
        try {
            iZooto.iZootoHandleNotification(mReactApplicationContext, (Map) data.toHashMap());
        } catch (Exception e) {
            Log.v("HandleNotification",e.toString());
        }
    }
    @ReactMethod
    public void onNotificationReceivedListener() {
        try {
            this.onNotificationReceivedHybrid(notificationPayload);
            iZooto.notificationReceivedCallback(this);
        }
        catch (Exception ex)
        {
            Log.v("ReceivedListener",ex.toString());

        }
    }
    @ReactMethod
    public void onNotificationOpenedListener() {
        try {
            iZooto.notificationClick(this);
        }
        catch (Exception ex){
            Log.v("OpenedListener",ex.toString());

        }
    }
    @ReactMethod
    public void onWebViewListener() {
        try {
            iZooto.notificationWebView(this);
        }catch (Exception ex){
            Log.v("WebViewListener",ex.toString());
        }
    }
    @ReactMethod
    public void onTokenReceivedListener() {
        try {
            this.onTokenReceived(notificationToken);
        }
        catch (Exception ex){
            Log.v("TokenReceivedListener",ex.toString());

        }
    }
    private void sendEvent(String eventName, Object params) {
        try {
            mReactApplicationContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(eventName, params);
        }catch (Exception ex){
            Log.v("sendEvent",ex.toString());

        }
    }
    @Override
    public void onNotificationReceived(Payload payload) {
//        notificationPayload = payload;
//        if (payload!=null) {
//            Gson gson = new Gson();
//            String jsonPayload = gson.toJson(payload);
//            sendEvent(iZootoConstants.RECEIVED_NOTIFICATION, jsonPayload);
//        }


    }

    @Override
    public void onNotificationOpened(String data) {
        try {
            notificationOpened = data;
            if (data != null) {
                sendEvent(iZootoConstants.OPEN_NOTIFICATION, data);
            }
        }catch (Exception ex){
            Log.v("onNotificationOpened",ex.toString());

        }


    }

    @Override
    public void onWebView(String landingUrl) {
        try {
            notificationWebView = landingUrl;
            if (landingUrl != null) {
                sendEvent(iZootoConstants.LANDING_URL, landingUrl);
            }
        }catch (Exception ex){
            Log.v("onWebView",ex.toString());
        }

    }

    @Override
    public void onTokenReceived(String token) {
        try {
            notificationToken = token;
            if (token != null) {
                sendEvent(iZootoConstants.RECEIVE_TOKEN, token);
            }
        }catch (Exception ex){
            Log.v("onTokenReceived",ex.toString());

        }

    }
    // user permission prompt
    @ReactMethod
    public void promptForPushNotifications() {
        try {
            if (Build.VERSION.SDK_INT >= 33) {
                iZooto.promptForPushNotifications();
            }else {
                Log.v("promptUser..."," API level is lower than 33");
            }
        }
        catch (Exception ex){
            Log.v("promptUser...",ex.toString());

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
    @Override
    public void onNotificationReceivedHybrid(String receiveData) {
        notificationPayload = receiveData;
        if (receiveData != null) {
            try {
                JSONArray jsonArray = new JSONArray(receiveData);
                JSONArray toReturn = new JSONArray();
                for (int i = jsonArray.length()-1; i>=0; i--) {
                    toReturn.put(jsonArray.getJSONObject(i));
                }
                sendEvent(iZootoConstants.RECEIVED_NOTIFICATION, toReturn.toString());
            } catch (Exception e) {
                Log.v("onNotificationReceive",e.toString());
            }
        }
    }
    static int getBadgeIcon(Context context, String setBadgeIcon){
        int bIicon = 0;
        int checkExistence = context.getResources().getIdentifier(setBadgeIcon, "drawable", context.getPackageName());
        if ( checkExistence != 0 ) {  // the resource exists...
            bIicon = checkExistence;
        }
        else {  // checkExistence == 0  // the resource does NOT exist!!
            int checkExistenceMipmap = context.getResources().getIdentifier(
                    setBadgeIcon, "mipmap", context.getPackageName());
            if (checkExistenceMipmap != 0) {  // the resource exists...
                bIicon = checkExistenceMipmap;

            }
        }

        return bIicon;
    }
    /* Added new method for navigate to notification setting page */
    @ReactMethod
    public void navigateToSettings() {
        try {
             iZooto.navigateToSettings(mReactApplicationContext.getCurrentActivity());
        }
        catch (Exception ex){
            Log.v("NavigateToSetting...",ex.toString());
        }
    }
    /* Added new method for setUp  to notification channel name */
    @ReactMethod
    public void setNotificationChannelName(String channelName) {
        try {
            iZooto.setNotificationChannelName(channelName);
        }
        catch (Exception ex){
            Log.v("NotificationChannelName",ex.toString());

        }
    }



}
