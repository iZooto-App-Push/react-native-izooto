package com.rnizooto;

import android.content.Context;
import android.os.Build;
import android.util.Log;

import androidx.annotation.NonNull;

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
import com.izooto.OneTapCallback;
import com.izooto.Payload;
import com.izooto.PreferenceUtil;
import com.izooto.PushTemplate;
import com.izooto.TokenReceivedListener;
import com.izooto.iZooto;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.facebook.react.bridge.Promise;

@SuppressWarnings("unchecked")
public class RNIzootoModule extends ReactContextBaseJavaModule implements TokenReceivedListener, NotificationWebViewListener, NotificationHelperListener, NotificationReceiveHybridListener, OneTapCallback {
    private final ReactApplicationContext mReactApplicationContext;
    private String notificationToken, notificationPayload;
    private boolean isInit;
    private boolean isDefaultWebView;
    private String email, first_name, last_name;

    public RNIzootoModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mReactApplicationContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return iZootoConstants.IZ_PLUGIN_NAME;
    }

    @ReactMethod
    public void initAndroid(boolean defaultWebView) {
        iZooto.isHybrid = true;
        if (!isInit) {
            isInit = true;
            try {
                PreferenceUtil preferenceUtil = PreferenceUtil.getInstance(mReactApplicationContext.getApplicationContext());
                preferenceUtil.setBooleanData(AppConstant.IZ_DEFAULT_WEB_VIEW,defaultWebView);
                isDefaultWebView = preferenceUtil.getBoolean(AppConstant.IZ_DEFAULT_WEB_VIEW);
                if (isDefaultWebView) {
                    iZooto.initialize(mReactApplicationContext.getApplicationContext())
                            .setTokenReceivedListener(this)
                            .setNotificationReceiveListener(this)
                            .setNotificationReceiveHybridListener(this)
                            .unsubscribeWhenNotificationsAreDisabled(true)
                            .build();
                } else {
                    iZooto.initialize(mReactApplicationContext.getApplicationContext())
                            .setTokenReceivedListener(this)
                            .setNotificationReceiveListener(this)
                            .setLandingURLListener(this)
                            .setNotificationReceiveHybridListener(this)
                            .unsubscribeWhenNotificationsAreDisabled(true)
                            .build();
                }
                iZooto.setPluginVersion(iZootoConstants.IZ_PLUGIN_VERSION);
            } catch (IllegalStateException ex) {
                Log.e("Exception", "" + ex);
            }
        }
    }

    @ReactMethod
    public void setSubscription(boolean enable){
        iZooto.setSubscription(enable);
    }

    @ReactMethod
    public void setFirebaseAnalytics ( boolean isSet){
        iZooto.setFirebaseAnalytics(isSet);
    }

    @ReactMethod
    public void addEvent (String eventName, ReadableMap triggers){
        iZooto.addEvent(eventName, triggers.toHashMap());
    }

    @ReactMethod
    public void addUserProperty (ReadableMap triggers){
        iZooto.addUserProperty(triggers.toHashMap());
    }

    @ReactMethod
    public void addTag (ReadableArray topicName){
        List<String> list = getArrayList(topicName);
        iZooto.addTag(list);
    }

    @ReactMethod
    public void removeTag (ReadableArray topicName){
        List<String> list = getArrayList(topicName);
        iZooto.removeTag(list);
    }

    @ReactMethod
    public void setDefaultTemplate ( int templateID){
        if (templateID == 2) {
            iZooto.setDefaultTemplate(PushTemplate.TEXT_OVERLAY);
        } else if (templateID == 3) {
            iZooto.setDefaultTemplate(PushTemplate.DEVICE_NOTIFICATION_OVERLAY);
        } else {
            iZooto.setDefaultTemplate(PushTemplate.DEFAULT);
        }
    }

    @ReactMethod
    public void setDefaultNotificationBanner (String setBanner){
        if (getBadgeIcon(mReactApplicationContext, setBanner) != 0)
            iZooto.setDefaultNotificationBanner(getBadgeIcon(mReactApplicationContext, setBanner));
    }

    @ReactMethod
    public void setNotificationSound (String soundName){
        iZooto.setNotificationSound(soundName);
    }

    @ReactMethod
    public void iZootoHandleNotification (ReadableMap data){
        try {
            iZooto.iZootoHandleNotification(mReactApplicationContext, (Map) data.toHashMap());
        } catch (Exception e) {
            Log.v(iZootoConstants.IZ_HANDLE_NOTIFICATION, e.toString());
        }
    }

    @ReactMethod
    public void onNotificationReceivedListener() {
        try {
            this.onNotificationReceivedHybrid(notificationPayload);
            iZooto.notificationReceivedCallback(this);
        } catch (Exception ex) {
            Log.v("ReceivedListener", ex.toString());

        }
    }

    @ReactMethod
    public void onNotificationOpenedListener() {
        try {
            iZooto.notificationClick(this);
        } catch (Exception ex) {
            Log.v("OpenedListener", ex.toString());

        }
    }

    @ReactMethod
    public void onWebViewListener() {
        try {
            if (!isDefaultWebView) {
                iZooto.notificationWebView(this);
            }
        } catch (Exception e) {
            Log.v("WebViewListener", e.toString());
        }
    }

    @ReactMethod
    public void onTokenReceivedListener() {
        try {
            this.onTokenReceived(notificationToken);
        } catch (Exception ex) {
            Log.v("TokenReceivedListener", ex.toString());

        }
    }

    @ReactMethod
    public void requestOneTapListener() {
        try {
            if (LibGuard.hasOneTapLibrary()) {
                this.syncOneTapResponse(email, first_name, last_name);
            }
        } catch (Exception ex) {
            Log.e(iZootoConstants.IZ_PLUGIN_EXCEPTION, "requestOneTapListener" + ":-" + ex);

        }
    }

    private void sendEvent (String eventName, Object params){
        try {
            mReactApplicationContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(eventName, params);
        } catch (Exception ex) {
            Log.v(iZootoConstants.IZ_SEND_EVENT, ex.toString());
        }
    }

    @Override
    public void onNotificationReceived (Payload payload){

    }

    @Override
    public void onNotificationOpened (String data){
        try {
            if (data != null) {
                sendEvent(iZootoConstants.OPEN_NOTIFICATION, data);
            }
        } catch (Exception ex) {
            Log.v(iZootoConstants.IZ_NOTIFICATION_OPENED, ex.toString());
        }
    }

    @Override
    public void onWebView (String landingUrl){
        try {
            if (landingUrl != null) {
                sendEvent(iZootoConstants.LANDING_URL, landingUrl);
            }
        } catch (Exception ex) {
            Log.v(iZootoConstants.IZ_WEB_VIEW, ex.toString());
        }
    }

    @Override
    public void onTokenReceived (String token){
        try {
            notificationToken = token;
            if (token != null) {
                sendEvent(iZootoConstants.RECEIVE_TOKEN, token);
            }
        } catch (Exception ex) {
            Log.v(iZootoConstants.IZ_TOKEN_RECEIVED, ex.toString());
        }
    }

    private List<String> getArrayList(ReadableArray tagKey) {
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
                for (int i = jsonArray.length() - 1; i >= 0; i--) {
                    toReturn.put(jsonArray.getJSONObject(i));
                }
                sendEvent(iZootoConstants.RECEIVED_NOTIFICATION, toReturn.toString());
            } catch (Exception e) {
                Log.v("onNotificationReceive", e.toString());
            }
        }
    }

    static int getBadgeIcon(Context context, String setBadgeIcon) {
        int bI_icon = 0;
        int checkExistence = context.getResources().getIdentifier(setBadgeIcon, "drawable", context.getPackageName());
        if (checkExistence != 0) {  // the resource exists...
            bI_icon = checkExistence;
        } else {  // checkExistence == 0  // the resource does NOT exist!!
            int checkExistenceMipmap = context.getResources().getIdentifier(
                setBadgeIcon, "mipmap", context.getPackageName());
            if (checkExistenceMipmap != 0) {  // the resource exists...
                bI_icon = checkExistenceMipmap;
            }
        }
        return bI_icon;
    }

    @ReactMethod
    public void promptForPushNotifications () {
        try {
            if (Build.VERSION.SDK_INT >= 33) {
                iZooto.promptForPushNotifications();
            } else {
                Log.v(iZootoConstants.IZ_USER_PROMPT, iZootoConstants.IZ_PROMPT_MESSAGE);
            }
        } catch (Exception ex) {
            Log.v(iZootoConstants.IZ_USER_PROMPT, ex.toString());
        }
    }

    /* Added new method for navigate to notification setting page */
    @ReactMethod
    public void navigateToSettings () {
        try {
            iZooto.navigateToSettings(mReactApplicationContext.getCurrentActivity());
        } catch (Exception ex) {
            Log.v(iZootoConstants.IZ_NAVIGATE_SETTING, ex.toString());
        }
    }

    /* Added new method for setUp  to notification channel name */
    @ReactMethod
    public void setNotificationChannelName (String channelName){
        try {
            iZooto.setNotificationChannelName(channelName);
        } catch (Exception ex) {
            Log.v(iZootoConstants.IZ_NOTIFICATION_CHANNEL, ex.toString());
        }
    }

    /* Added new method for returning Notification Data */
    @ReactMethod
    public void getNotificationFeed ( boolean isPagination, Promise promise){
        try {
            promise.resolve(iZooto.getNotificationFeed(isPagination));
        } catch (Exception ex) {
            Log.v(iZootoConstants.IZ_NOTIFICATION_FEED, ex.toString());
        }
    }

    @Override
    public void syncOneTapResponse(String email, String firstName, String lastName) {
        try {
            email = email;
            first_name = firstName;
            last_name = lastName;

            if (email != null && firstName != null && lastName != null) {
                JSONObject syncTapResponse = new JSONObject();
                syncTapResponse.put(iZootoConstants.IZ_EMAIL, email);
                syncTapResponse.put(iZootoConstants.IZ_NAME, firstName);
                syncTapResponse.put(iZootoConstants.IZ_L_NAME, lastName);
                sendEvent(iZootoConstants.ONE_TAP_RESPONSE, syncTapResponse.toString());

            }
        } catch (JSONException e) {
            Log.e(iZootoConstants.SYNC_ONE_RESPONSE, e.toString());
        }
    }

    @ReactMethod
    public void requestOneTapActivity() {
        try {
            if (LibGuard.hasOneTapLibrary()) {
                iZooto.requestOneTapActivity(mReactApplicationContext.getCurrentActivity(), this);
            } else {
                Log.e(AppConstant.APP_NAME_TAG, "OneTap initialization failed due to missing libraries. Please check the library configuration.");
            }
        } catch (Exception e) {
            Log.e(iZootoConstants.IZ_REQUEST_ONE_TAP_ACTIVITY, "" + e);

        }
    }

    @ReactMethod
    public void syncUserDetails(String email, String firstName, String lastName) {
        try {
            iZooto.syncUserDetailsEmail(mReactApplicationContext,email,firstName,lastName);
        } catch (Exception e){
            Log.e(iZootoConstants.IZ_SYNC_USER_DETAILS,""+e);

        }
    }

}




