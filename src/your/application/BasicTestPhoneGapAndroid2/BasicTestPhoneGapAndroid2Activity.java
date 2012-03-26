package your.application.BasicTestPhoneGapAndroid2;

import org.apache.cordova.*;
import android.os.Bundle;
//import com.phonegap.*;

public class BasicTestPhoneGapAndroid2Activity extends DroidGap {
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        //Set Splash Screen
        super.setIntegerProperty("splashscreen", R.drawable.splash);
        //Load Webview for PhoneGap/Cordova
        //Force splash screen to show 5000 ms
        super.loadUrl("file:///android_asset/www/index.html", 5000);
    }
}