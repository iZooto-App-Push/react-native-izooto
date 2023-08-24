package com.rnizooto;

import android.content.Context;
import android.os.Build;
import android.util.Log;


import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.izooto.AppConstant;
import com.izooto.NotificationHelperListener;
import com.izooto.NotificationReceiveHybridListener;
import com.izooto.NotificationWebViewListener;
import com.izooto.Payload;
import com.izooto.PreferenceUtil;
import com.izooto.PushTemplate;
import com.izooto.TokenReceivedListener;
import com.izooto.iZooto;
import org.json.JSONArray;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@SuppressWarnings("unchecked")
public class RNIzootoModule extends ReactContextBaseJavaModule implements TokenReceivedListener, NotificationHelperListener, NotificationReceiveHybridListener,NotificationWebViewListener {

    private ReactApplicationContext mReactApplicationContext;
    private boolean isDefaultWebView;

    private String notificationOpened, notificationToken, notificationWebView, notificationPayload;
    private boolean isInit;

    public RNIzootoModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mReactApplicationContext = reactContext;
    }
    @Override
    public String getName() {
        return iZootoConstants.IZ_PLUGIN_NAME;
    }
    @ReactMethod
    public void initAndroid(boolean defaultWebView) {
        iZooto.isHybrid = true;
        if(!isInit) {
            isInit = true;
            try {
                PreferenceUtil preferenceUtil = PreferenceUtil.getInstance(mReactApplicationContext);
                preferenceUtil.setBooleanData(AppConstant.DEFAULT_WEB_VIEW,defaultWebView);
                isDefaultWebView = preferenceUtil.getBoolean(AppConstant.DEFAULT_WEB_VIEW);
                if (isDefaultWebView) {
                    iZooto.initialize(mReactApplicationContext)
                            .setTokenReceivedListener(this)
                            .setNotificationReceiveListener(this)
                            .setNotificationReceiveHybridListener(this)
                            .unsubscribeWhenNotificationsAreDisabled(true)
                            .build();
                }else {
                    iZooto.initialize(mReactApplicationContext)
                            .setTokenReceivedListener(this)
                            .setNotificationReceiveListener(this)
                            .setLandingURLListener(this)
                            .setNotificationReceiveHybridListener(this)
                            .unsubscribeWhenNotificationsAreDisabled(true)
                            .build();
                }
                iZooto.setPluginVersion(iZootoConstants.IZ_PLUGIN_VERSION);
            }
            catch (IllegalStateException ex){
                Log.e("Exception",""+ ex);
            }
        }
    }
//    @ReactMethod
//    public void initAndroid() {
//        iZooto.isHybrid = true;
//        if(!isInit) {
//            isInit=true;
//            try {
//                iZooto.initialize(mReactApplicationContext)
//                        .setTokenReceivedListener(this)
//                        .setNotificationReceiveListener(this)
//                        //.setLandingURLListener(this)
//                        .setNotificationReceiveHybridListener(this)
//                        .unsubscribeWhenNotificationsAreDisabled(true)
//                        .build();
//                iZooto.setPluginVersion(iZootoConstants.IZ_PLUGIN_VERSION);
//            }
//            catch (Exception ex)
//            {
//                Log.e(iZootoConstants.IZ_EXCEPTION_NAME,iZootoConstants.IZ_INIT_ANDROID+ex);
//            }
//        }
//    }
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
        } catch (Exception ex) {
            Log.e(iZootoConstants.IZ_EXCEPTION_NAME,iZootoConstants.IZ_HANDLE_NOTIFICATION+ex);
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
            Log.e(iZootoConstants.IZ_EXCEPTION_NAME,iZootoConstants.IZ_RECEIVED_LISTENER+ex);

        }
    }
    @ReactMethod
    public void onNotificationOpenedListener() {
        try {
            iZooto.notificationClick(this);
        }
        catch (Exception ex){
            Log.e(iZootoConstants.IZ_EXCEPTION_NAME,iZootoConstants.IZ_OPEN_LISTENER+ex);

        }
    }
    @ReactMethod
    public void onWebViewListener() {
        try {
            if (!isDefaultWebView) {
                iZooto.notificationWebView(this);
            }
        }catch (Exception e){
            Log.v(iZootoConstants.IZ_EXCEPTION_NAME,iZootoConstants.IZ_WEB_VIEW_LISTENER+e);
        }
    }
    @ReactMethod
    public void onTokenReceivedListener() {
        try {
            this.onTokenReceived(notificationToken);
        }
        catch (Exception ex){
            Log.e(iZootoConstants.IZ_EXCEPTION_NAME,iZootoConstants.IZ_ON_TOKEN_LISTENER+ex);

        }
    }
    private void sendEvent(String eventName, Object params) {
        try {
            mReactApplicationContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(eventName, params);
        }catch (Exception ex){
            Log.e(iZootoConstants.IZ_EXCEPTION_NAME, iZootoConstants.IZ_SEND_EVENT +ex);


        }
    }
    @Override
    public void onNotificationReceived(Payload payload) {
    }

    @Override
    public void onNotificationOpened(String data) {
        try {
            notificationOpened = data;
            if (data != null) {
                sendEvent(iZootoConstants.IZ_OPEN_NOTIFICATION, data);
            }
        }catch (Exception ex){
            Log.e(iZootoConstants.IZ_EXCEPTION_NAME,iZootoConstants.IZ_NOTIFICATION_OPENED+ex);

        }


    }

    @Override
    public void onWebView(String landingUrl) {
        try {
            notificationWebView = landingUrl;
            if (landingUrl != null) {
                sendEvent(iZootoConstants.IZ_LANDING_URL, landingUrl);
            }
        }catch (Exception ex){
            Log.e(iZootoConstants.IZ_EXCEPTION_NAME,iZootoConstants.IZ_ON_WEB_VIEW+ex);
        }

    }

    @Override
    public void onTokenReceived(String token) {
        try {
            notificationToken = token;
            if (token != null) {
                sendEvent(iZootoConstants.IZ_RECEIVE_TOKEN, token);
            }
        }catch (Exception ex){
            Log.e(iZootoConstants.IZ_EXCEPTION_NAME,iZootoConstants.IZ_TOKEN_RECEIVED+ex);

        }

    }
    // user permission prompt
    @ReactMethod
    public void promptForPushNotifications() {
        try {
            if (Build.VERSION.SDK_INT >= 33) {
                iZooto.promptForPushNotifications();
            }else {
                Log.v(iZootoConstants.IZ_PROMPT_USER,iZootoConstants.IZ_PROMPT_ERROR);
            }
        }
        catch (Exception ex){
            Log.e(iZootoConstants.IZ_EXCEPTION_NAME,iZootoConstants.IZ_PROMPT_USER+ex);
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
                sendEvent(iZootoConstants.IZ_RECEIVED_NOTIFICATION, toReturn.toString());
            } catch (Exception ex) {
                Log.e(iZootoConstants.IZ_EXCEPTION_NAME,iZootoConstants.IZ_ON_NOTIFICATION_RECEIVED+ex);
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
            Log.e(iZootoConstants.IZ_EXCEPTION_NAME,iZootoConstants.IZ_NAVIGATE_SETTINGS+ex);
        }
    }
    /* Added new method for setUp  to notification channel name */
    @ReactMethod
    public void setNotificationChannelName(String channelName) {
        try {
            iZooto.setNotificationChannelName(channelName);
        }
        catch (Exception ex){
            Log.e(iZootoConstants.IZ_EXCEPTION_NAME,iZootoConstants.IZ_CHANNEL_NAME+ex);

        }
    }

    /* Added new method for returning Notification Data */

    @ReactMethod
    public void getNotificationFeed(boolean isPagination, Promise promise) {
        try {
            promise.resolve(iZooto.getNotificationFeed(isPagination));
        }
        catch (Exception ex){
            Log.v(iZootoConstants.IZ_EXCEPTION_NAME,iZootoConstants.IZ_NOTIFICATION_FEED+ex.toString());

        }
    }

}
