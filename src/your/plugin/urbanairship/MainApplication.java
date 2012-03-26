package your.plugin.urbanairship;
 
import android.app.Application;
 
import com.urbanairship.AirshipConfigOptions;
import com.urbanairship.UAirship;
import com.urbanairship.push.PushManager;
 
public class MainApplication extends Application {
 
    final static String TAG = MainApplication.class.getSimpleName();
 
    @Override
    public void onCreate() {
        super.onCreate();
 
        AirshipConfigOptions options = AirshipConfigOptions.loadDefaultOptions(this);
        options.developmentAppKey = "Your UA App Key";
        options.productionAppKey = "Your UA Secret";
        options.iapEnabled = false;
        options.inProduction = false; //determines which app key to use
 
        UAirship.takeOff(this);
        PushManager.enablePush();
        PushManager.shared().setIntentReceiver(IntentReceiver.class);
    }
}