package your.application.BasicTestPhoneGapAndroid2;

import org.apache.cordova.*;
import android.os.Bundle;
//import com.phonegap.*;

public class BasicTestPhoneGapAndroid2Activity extends DroidGap {
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        super.loadUrl("file:///android_asset/www/index.html");
    }
}