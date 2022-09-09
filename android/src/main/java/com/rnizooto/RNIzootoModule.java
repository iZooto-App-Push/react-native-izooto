package com.rnizooto;

import android.content.Context;
import android.os.Build;
import android.os.StrictMode;
import android.util.Log;

import androidx.annotation.RequiresApi;

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

public class RNIzootoModule extends ReactContextBaseJavaModule implements TokenReceivedListener, NotificationHelperListener, NotificationWebViewListener, NotificationReceiveHybridListener {

    private ReactApplicationContext mReactApplicationContext;
    private ReactContext mReactContext;
    private String notificationOpened, notificationToken, notificationWebView, notificationPayload;
    private boolean isInit;

    public RNIzootoModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mReactApplicationContext = reactContext;
        mReactContext = reactContext;



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
                iZooto.setPluginVersion("rv_2.0.9");
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

    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
    @ReactMethod
    public void addUserProperty(ReadableMap triggers) {
        iZooto.addUserProperty(triggers.toHashMap());
    }

    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
    @ReactMethod
    public void addTag(ReadableArray topicName) {
        List<String> list = getArrayList(topicName);
        iZooto.addTag(list);
    }

    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
    @ReactMethod
    public void removeTag(ReadableArray topicName) {
        List<String> list = getArrayList(topicName);
        iZooto.removeTag(list);
    }

    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
    @ReactMethod
    public void setDefaultTemplate(int templateID) {
        if (templateID == 1)
            iZooto.setDefaultTemplate(PushTemplate.TEXT_OVERLAY);
        else
            iZooto.setDefaultTemplate(PushTemplate.DEFAULT);
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

    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
    @ReactMethod
    public void iZootoHandleNotification(ReadableMap data){
        Log.e("iZootoExample", "handleNotification: "+data.toHashMap() );
        try {
            iZooto.iZootoHandleNotification(mReactApplicationContext, (Map) data.toHashMap());
        } catch (Exception e) {
            e.getStackTrace();
        }
    }

    @ReactMethod
    public void setInAppNotificationBehaviour(int displayOption) {
        if (displayOption == 1)
            iZooto.setInAppNotificationBehaviour(iZooto.OSInAppDisplayOption.InAppAlert);
        else if (displayOption == 2)
            iZooto.setInAppNotificationBehaviour(iZooto.OSInAppDisplayOption.None);
        else
            iZooto.setInAppNotificationBehaviour(iZooto.OSInAppDisplayOption.Notification);
    }

    @ReactMethod
    public void setIcon(String icon1) {
        if (getBadgeIcon(mReactApplicationContext, icon1) != 0)
            iZooto.setIcon(getBadgeIcon(mReactApplicationContext, icon1));
    }

    @ReactMethod
    public void onNotificationReceivedListener() {
       this.onNotificationReceivedHybrid(notificationPayload);
        iZooto.notificationReceivedCallback(this);
    }
    @ReactMethod
    public void onNotificationOpenedListener() {
        iZooto.notificationClick(this);
    }
    @ReactMethod
    public void onWebViewListener() {
        iZooto.notificationWebView(this);
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
//        notificationPayload = payload;
//        if (payload!=null) {
//            Gson gson = new Gson();
//            String jsonPayload = gson.toJson(payload);
//            sendEvent(iZootoConstants.RECEIVED_NOTIFICATION, jsonPayload);
//        }


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
                e.getStackTrace();
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

}
