//var upd_base_url = "http://www.youpluspreprod.com/";
var upd_base_url = "http://www.youplusdallas.com/";
var base_url = "http://danpatrick.youplusdallas.com/" 
//var base_url = "http://danpatrick.youpluspreprod.com/";

var loggedIn = false;
var token = "8cc89d24b7574d7fb7368f756ce88354e665a5f7";
var user_email;
//debug variables
var debugResponses = true;

var stopCachingInAjaxGet = 0;

var appId = 164061783699045;
var appSecret = '7b817b00948d2de1739f47d5e8c7ab21';
var tokenLogin="";
var slug;
var uid;
var topicNumber;
var videoPath;//video path
var isGetCouponSuccess = false;
var list_coupon = [];
var total_coupon = 0;
var responses;
var hasFirstRun = false;
var isLoadingMore = false;
var isRefesh = false;
var indexElement = 0;
var hasFirstGet = false;
var refresh_minutes = 60;
var REFRESH_PERIOD = 1000* 60 * refresh_minutes;
var signupPageScroll;
var myScroll;
var myScrollrespond;
var myScrolldetail;
var atype = "";
var aname = "";
var apass = "";
var isGetRespond=false;
var OtherResponses;
var isAvailable = false;
var currentIndexVideoOtherResponses = 0;
var spinner = '';
var saveResponses;
var listRespondAvailable = new Array();
/***Variable for response page**/
var username;
var votes;
var unvotes;
var thumb;
var videoUrl=2;
var datetime;
var responseid;
var tempData;
var images = new Array();
var Data;
var isRespond =false;
var isBackActive = true;
var isUpdate = 0;
var duration;
var twitterPostMessage;
var shareText = "";

// Varible for View Other Page.
var startIdx = 0;

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    document.addEventListener("backbutton", onBackButtonClicked, true); 
    ypGetCurrentVideopinion();
    // refresh video opinion
    window.setInterval( ypGetCurrentVideopinion, REFRESH_PERIOD);
    initScrolls();
    readFirstRunState();
    if (!hasFirstRun) {
        sendDeviceTokenToServer();
        saveFirstRunState();
    }
    isLoginValid();
    readcreds();
    if(loggedIn){
    	 enableLogoutButton();
    	 token = tokenLogin;
    	 readcreds()
    }
    else{
    	disableLogoutButton();
    }
 
    initFacebook();
}
function initFacebook(){
	
	 if (typeof PhoneGap == 'undefined') navigator.notification.alert('Facebook features did not initialize correctly and may not work. Please close and Reopen the app.'); //alert('PhoneGap variable does not exist. Check that you have included phonegap.js correctly');
     if (typeof PG == 'undefined') navigator.notification.alert('Facebook features did not initialize correctly and may not work. Please close and Reopen the app.'); //alert('PG variable does not exist. Check that you have included pg-plugin-fb-connect.js correctly');
     if (typeof FB == 'undefined') navigator.notification.alert('Facebook features did not initialize correctly and may not work. Please close and Reopen the app.'); //alert('FB variable does not exist. Check that you have included the Facebook JS SDK file.');

     FB.Event.subscribe('auth.login', function(response) {
         //alert('auth.login event');
     });
     
     FB.Event.subscribe('auth.logout', function(response) {
         //alert('auth.logout event');
     });
     
     FB.Event.subscribe('auth.sessionChange', function(response) {
         //alert('auth.sessionChange event');
     });
     
     FB.Event.subscribe('auth.statusChange', function(response) {
         //alert('auth.statusChange event');
     });
}
function initScrolls(){
    signupPageScroll = new iScroll('dos-signup-content'); 
    myScrollrespond = new iScroll('wrap-content-respond');
    myScroll = new iScroll('content-offers-home');
    myScrolldetail = new iScroll('content-offers-detail-home');
}

function saveFirtGetState() {
    var store = new Lawnchair({name: "vault"}, function(store) {
        var st = {key: "FirstGetState", hasFirstGet:true};
        store.save(st , function callback(data) {
            console.log("save first success");
        });
    });
}

function saveFirstRunState() {
    var store = new Lawnchair({name: "vault"}, function(store) {
        var data = {key: "FirstRunState", hasFirstRun:true};
        store.save(data , function callback(data) {
            console.log("save first state success");
        });
    });
}

function readFirstGetState() {
    var store = new Lawnchair({name: "vault"}, function(store) {
        if(store) {
            store.get("FirstGetState", function(me) {
                if (me != null) {
                    hasFirstGet = me.hasFirstGet;
                }
            });
        }
    });
    
    console.log("has First Run State : " + hasFirstGet);
}

function readFirstRunState() {
    var store = new Lawnchair({name: "vault"}, function(store) {
        if(store) {
            store.get("FirstRunState", function(me) {
                if (me != null) {
                    hasFirstRun = me.hasFirstRun;
                }
            });
        }
    });
    
    console.log("has First Run State : " + hasFirstRun);
}


function refresh_video_opinion() {
    $.mobile.pageLoading(false);
    ypGetCurrentVideopinion();
}
function refresh_footer(){
	var currentPage = $('.ui-page-active').attr('id');
	if(currentPage=="page-offers")
	{
		setnavibar(1);
	}
	
}
function onBackButtonClicked() {
  //  navigator.app.exitApp();
    var currentPage = $('.ui-page-active').attr('id');
    refresh_footer();
    if(currentPage == "home"){
        
        if(isBackActive)
        	showDialogExit();
    }
    else{
    	  if(currentPage=="respon-home")
    	  {
    		  respondService.abort();
    		  isGetRespond = false;
    		  isBackActive = false;
    		  isLoadingMore = false;
    		  setTimeout(function(){
    			  isBackActive = true;
    				},1000);
    	  }
    	  parent.history.back(); 
    }

    return false;

}
function showDialogExit() {
    navigator.notification.confirm('Do you want to exit?', onConfirm, 'The Box Score', 'OK,Cancel');
}

function onConfirm(button) {
    if (button == 1) {
    	navigator.app.exitApp();
    } else if (button == 2) {
        
    }
}
function stopvideo() {
    
}

function onPlayVideo() {
    var extra_data = {"path": $("#video-url").attr("href")};
    var success_callback = function(args) { /*alert("success")*/; }
    var error_callback = function(args) { }
    window.plugins["ShoutzPlayerPlugin"].playVideo(success_callback, error_callback, extra_data);
}
var playRespondVideo = function(id){
    console.log("+++++++++++"+JSON.stringify(Data));
	var url = Data[id]["videoUrl"];
	var extra_data = {"path": url};
    var success_callback = function(args) { /*alert("success")*/; }
    var error_callback = function(args) {  }
    window.plugins["ShoutzPlayerPlugin"].playVideo(success_callback, error_callback, extra_data);
}
/*****Login Page*****************************/

// Called when capture operation is finished
var captureSuccess = function(mediaFiles) {
    //alert("Uploading video." + JSON.stringify(mediaFiles));
    var i, len;
    for (i = 0, len = mediaFiles.length; i < len; i += 1) {
        uploadFile(mediaFiles[i]);
    }
    //alert("Done uploading video.");
}

// Called if something bad happens.
var captureError = function(error) {
    //"undefined" seems to mean the user decided not to capture a video
    if (error.code != undefined && error.code != "undefined") {
        var msg = 'An error occurred during capture: ' + error.code;
        navigator.notification.alert(msg, null, "The Box Score", "OK");
        //alert(msg);
        //navigator.notification.alert(msg, null, 'Uh oh!');
    }
}

var captureVideo = function() {
    // Launch device video recording application, 
    // allowing user to capture 1 video clip
    navigator.device.capture.captureVideo(captureSuccess, captureError, {limit: 1 , duration: 10});
    //uploadFile();
    //window.plugins.shoutzcapture.pickVideo(captureSuccess, captureError, {limit: 1, duration: 10});
}

var pickVideo = function() {
    window.plugins.shoutzcapture.pickVideo(captureSuccess, captureError, {limit: 1, duration: duration});
}

//Send device tocken

function sendDeviceTokenToServer() {
    var push_network = 2;
    var base_channel_id = 328;
    var token = device.uuid;
    
    var url = upd_base_url + "device_tokens";
    var post_data = "token=" + token + "&base_channel_id=" + base_channel_id + "&push_network=" + push_network;
    $.ajax({
            url: url,
            data: post_data,
            type: "POST",
            success: function (result) {
                console.log("send device token :" + result.status);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log("send device token error."+xhr.status+":"+thrownError);
            }        
        });
    
}
var authFB = function(){
	 FB.init({ appId: appId, nativeInterface: PG.FB });
	 FB.login(
             function(response) {
                 if (response.session) {
                     navigator.notification.alert('Logged in', null, "The Box Score", "OK");
                     authFB2();
                 } else {
                     navigator.notification.alert('Not logged in', null, "The Box Score", "OK");
                 }
             },
             { perms: "email" }
         );
};
/*Facebook Auth*/
var authFB2 = function() {
    
    window.plugins.facebook.authorize(appId, function(res) {
    	
    	console.log("============Auth facebook success==============="+JSON.stringify(res));
        if(res.token !== undefined) {
            //we have a token, save it (user has authenticated before)
            navigator.notification.alert("Already Authenticated!", null, "The Box Score", "OK");
        } else {
            window.plugins.facebook.getAccess(function(res) {
                if(res.token !== undefined) {
                    //enable the logout button
                	loggedIn = true;
                	enableLogoutButton();

                    //authenticate with youplus
                    authFBYP(res.token);
                    
                    // we got a token (user has authenticated
                    //                 just in that moment)
                    window.location.hash = "#home";
                }
            });
        }
    });
};

var authFBYP = function(fbID) {
    //send fb-registration info to YP
    
    var facebook_id = fbID;

    window.plugins.facebook.request("me", function(response) {
        var email_address = response["email"];
        var first_name = response["first_name"];
        var last_name = response["last_name"];
        var facebook_id = response["id"];
        
        var url = upd_base_url + "user_session/login_from_facebook.json"
        
        var post_data = "user[facebook_uid]=" + response["id"]
                      + "&user[login]=" + email_address
                      + "&user[first_name]=" + first_name
                      + "&user[last_name]=" + last_name
                      + "&user[birthday]=00/00/0000";
        aname = email_address;
        console.log("authFBYP url : " + url);
        console.log("authFBYP post_data : " + post_data);
        $.ajax({
            url: url,
            data: post_data,
            type: "POST",
            success: function (result) {                
                if(result["status"] == "success") {
                    token = result["user_credentials"];
                    uid = result["user_id"];
                    console.log("authFPYP token" + token);
                    console.log("authFPYP uid" + uid);
                    console.log("authFPYP Login Success");
                    saveLoginData(aname, token);
                    loggedIn = true;
                } else {
                    navigator.notification.alert("Login Error", null, "The Box Score", "OK");
                     console.log("authFPYP Login Error");
                    logout();
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                navigator.notification.alert("Connection Error", null, "The Box Score", "OK"); 
                console.log("authFPYP Connection Error");
                logout();
            }        
        });
    });
}
var respond = function() {
	readcreds();
    $("#button-respondnow").css('background','url(images/RespondbuttonActive@2x.png)');
    setTimeout(
    	function(){
            $("#button-respondnow").css('background','url(images/Respondbutton@2x.png)');
            if (loggedIn) {
                //captureVideo();    
                //pickVideo();
                showGetVideo();
            }   
            else 
            {
                window.location.hash = "#yp-login";
            	isRespond = true;
            	//gotoTwitter();
                if(atype == "YP")
                {
                    $("#yp-login-email-field").val(aname);
                    $("#yp-login-password-field").val(apass);
                }
            }
    	},500
    );
};

function showGetVideo() {
    navigator.notification.confirm('How would you like to respond?', onConfirmGetVideo, 'The Box Score', 'Capture Video,Pick From Library,Cancel');
}

function onConfirmGetVideo(button) {
    if (button == 1) {
        captureVideo();
    } else if (button == 2) {
        pickVideo();
    }
}

function IsNumeric(input){
    var RE = /^-{0,1}\d*\.{0,1}\d+$/;
    return (RE.test(input));
}


function saveDuration(duration) {
    var store = new Lawnchair({name: "duration"}, function(store)
        {
            var data = {key: "duration", duration: duration};
            store.save(data);
        });
}

function getDuration() {
    var store = new Lawnchair({name: "duration"}, function(store) 
        {
            if(store)
            {
                 store.get("duration", function(me)
                 {
                     if(me)
                      {
                            duration = me["duration"];
                      } else {
                            duration = null;
                      }
                  });
             }
        });
}

//button like 
function buttonShare(id)
{	
    
    console.log('its happening');
    shareText = upd_base_url + "videopinions/" + slug;
    //readResponses("responses");
    //var dt = Data[id];
    window.plugins.share.show({
   // from: dt["username"];
    subject: 'The Box Score',
    text: shareText},
    function() {}, // Success function
    function() {navigator.notification.alert('Share failed' , null , 'The Box Score' , 'OK')} // Failure function
    );
  
}


/*****End*****/

function hackedBackButton() {
    parent.history.go(-1);
     isSignup = false;
}
function enableLogoutButton() {
    $(".yp-logout-link").css("visibility", "visible");
}

function disableLogoutButton() {
    $(".yp-logout-link").css("visibility", "hidden");
    loggedIn = false;
}
function logout() {
    disableLogoutButton();
    loggedIn = false;
    token = "logout";
    uid = null;
    saveLoginData("","");
    //logout of facebook too
    window.plugins.facebook.logout(function (stuff) { })
    navigator.notification.alert("Logged out", null, "The Box Score", "OK");
}

function savecreds(ukind, user, pass)
{
    var store = new Lawnchair({name: "vault"}, function(store)
        {
            var data = {key: "credentials", acctype: ukind, username: user, password: pass};
            store.save(data);
        });
}

function readcreds() 
{
    //alert("sdgsd    fhdfhfg");
    console.log("starting to load credentials...");
    var store = new Lawnchair({name: "logindatas"}, function(store) 
        {
            if(store)
            {
                 store.get("credentials", function(me)
                 {
                     if(me)
                      {
                            atype = me["acctype"];
                            aname = me["username"];
                            apass = me["password"];
   
                      }
                  });
             }
        });
}

function saveLoginData(user, token)
{
    var store = new Lawnchair({name: "logindatas"}, function(store)
        {
            var data = {key: "logindata", username: user, token:token};
            store.save(data);
        });
}

function readLoginData() 
{
    //alert("sdgsd    fhdfhfg");
    console.log("starting to load credentials...");
    var store = new Lawnchair({name: "vault"}, function(store) 
        {
            if(store)
            {
                 store.get("logindata", function(me)
                 {
                     if(me)
                      {
                            aname = me["username"];
                            tokenLogin = me["token"];
                            console.log("readLoginData aname: " + aname);
                            console.log("readLoginData tokenLogin: " + tokenLogin);
                      }
                  });
             }
        });
}

var ypLogin = function(){
    var email = $("#yp-login-email-field").val();
    var password = $("#yp-login-password-field").val();
    var error = "";
    var message = "";
    var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if(email =='email@domainname.com' && password == "password"){
    	error = "Please ipnut your email and password";
    }
    else if(email =='email@domainname.com'){
    	error = "Please input your email";
    }
    else if(password == "password"){
    	error = "Please input your password";
    }
    else if(!email.match(emailRegex)){
        error += 'The email entered is not valid.\n';
    }
    if(error == ""){

    	ypLoginAction();
    }
    else{
    	 navigator.notification.alert(
                 error,
                 function(){},
                 'The Box Score',
                 'OK'
    	);
    }
};

var ypLoginAction = function() {
    var email = $("#yp-login-email-field").val();
    var password = $("#yp-login-password-field").val();
    var isStillLoging = $("#checkbox-1")[0].checked;
    ypLoginReal(email, password);
    
    // Save information in checked.
    if(isStillLoging)
    {
       savecreds(atype, email, password);
    }
    else
    {
        savecreds("TMP", email, password);
    }
};

function ypLoginReal(username, password)
{
        var method = "user_session.json";
        doLoading();
        var user = "user_session[login]=" + username + "&user_session[password]=" + password;
        var post_url = upd_base_url + method;
        console.log("a="+post_url+"=b="+user);
        $.ajax({
            //this is the php file that processes the data and send mail
            url: post_url,
            data: user,
            type: "POST",
            //success
            success: function (result) {
        		endLoading();
                if(result["status"] == "success") {
                    token = result["user_credentials"];
                    uid = result["user_id"];
                    loggedIn = true;
                    atype = "YP";
                    console.log("login_valid_res : " + JSON.stringify(result));
                    saveLoginData(username, token);
                    //enable the logout button
                    loggedIn = true;
                    enableLogoutButton();
                    if(isRespond)
                    	showGetVideo();
                    hackedBackButton();
                } else {
                	navigator.notification.alert("Error when logging in: " + result["status"] , null , "The Box Score" , "OK");
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
            	endLoading();
            }    
    });
};
var checkboxlogin = 0;
var SaveInfor = function() {

	if(checkboxlogin == 0 )
	{
		$('#unselected').css('background','url(images/selected.png)no-repeat');
		checkboxlogin =1;
		document.getElementById("checkbox-1").checked=true;
	}
	else
	{
		$('#unselected').css('background','url(images/unselected.png)no-repeat');
		checkboxlogin =0;
		document.getElementById("checkbox-1").checked=false;
	}
    aname = $("#yp-login-email-field").val();
    apass = $("#yp-login-password-field").val();
    tmp = $("#checkbox-1")[0].checked;
    if(tmp) atype = "YP";
    else atype = "TMP";
    savecreds(atype, aname, apass);
};

function signup_success() {
	//navigator.notification.alert("aaaaaa" , null , "The Box Score" , "OK");
}

var updateInfor = function() {
    var tmpe = $("#yp-login-email-field").val();
    var tmpp = $("#yp-login-password-field").val();
    
    $("#email").val(tmpe);
    $("#password").val(tmpp);
    $("#passwordc").val(tmpp);
    var extras = {};
    window.plugins.webintent.startActivity({ 
            action: 'PICK_ACTIVITY',
            url: 'RegisterActivity.class'
        }, 
        function(result) {
            if (result == 'cancel') {
                //alert("no thing");
            } else {           
                //03-01 10:23:27.098: I/System.out(4927): result  ==== {"user_credentials":"474363929103c067f3477dc10cb9b3ab1fb1680b","user_id":"5404","devicetoken":"","status":"success"}

                if(result.status == 'success') {
                    
                    token = result.user_credentials;
                    
                    uid = result.user_id;
                    loggedIn = true;
                    // Save information
					
					atype = "YP";
					savecreds(atype, result.email, result.password);
                    saveLoginData(result.email, token);
					
                    navigator.notification.alert("Registeration successful!", null , "Tho Box Score" , "OK");
                    
                    //enable the logout button
                    enableLogoutButton();

                    //gotoHomePage();
                    //parent.history.go(-2); //not far enough
                    window.location.hash = "#home";
                } else {
                	navigator.notification.alert("Registration error.", null , "Tho Box Score" , "OK");
                }
            }
        },
        function(result) {
            navigator.notification.alert('Failed via Android Intent' + result, null , "Tho Box Score" , "OK");
        }
    ); 
    
    
};

var UpdateEmailtoRSPass = function() {
    aname = $("#yp-login-email-field").val();
    $("#yp-rs-email-field").val(aname);
};
var checkEmailtoReset=function(){
     //check email
   
    var email = $("#yp-rs-email-field").val();
    var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if(email=='')
    {
        navigator.notification.alert(
                                     'Please input your Email!',
                                     function(){},
                                     'The Box Score',
                                     'OK'
        );
    }
    else if(!email.match(emailRegex))
    {
        navigator.notification.alert(
                                     'Invalid Email!',
                                     function(){},
                                     'The Box Score',
                                     'OK'
        );

    }
    else{
         var user = "user[email]=" + email +"&authenticity_token=";
         ypReset(user);
    }
    

}
var ypReset = function(user){
    var post_url = "http://www.youplusdallas.com/password_resets";
    $.ajax({
            //this is the php file that processes the data and send mail
            url: post_url,
            data: user,
            type: "POST",
            
            //success
            success: function (result) {
            	navigator.notification.alert("A reset link has sent to your email!", null , "The Box Score" , "OK");
                hackedBackButton();
            },
            
            error: function (xhr, ajaxOptions, thrownError) {
            	navigator.notification.alert("Reset password failed!" , null , "The Box Score" , "OK");
               
            }    
    });
};

var ypGetCurrentVideopinion = function() {
    //make call to YP and return video to display on home screen    
    //show loading screen
    // render data
	doLoading();
    $.get(base_url + "videopinions.json", function(data) {
        //("Data Loaded: " + data);
          slug = data["cached_slug"];
          topicNumber = data["topic_id"];
          //alert(topicNumber);
         $("#video-topic").html(data["title"]);
          //alert(data["video"]);
          $("#video-url").attr("href",data["video"]);
          //alert("video url: " + data["video"]);
          $("iframe").attr("src", data["video"]);
          $("#video-keyframe").attr("src", data["keyframe"]);
        
          $("#video-url").click(function(e) {
          
              e.preventDefault();
            /*   
              alert("HAHAAHA");
              window.plugins.webintent.startActivity({
                      action: WebIntent.ACTION_VIEW,
                      url: data["video"],
                      type: "video/mp4",
                  },
                  function () {},
                  function () { alert("Failed to open URL"); }
              );
            */
          });
          endLoading();
         
        });
            
};

function isLoginValid() {
	readLoginData();
    var isSuccess = false;
    var login_valid_url = upd_base_url + "user_session/login_valid.json" + "?user_credentials=" + tokenLogin + "&user_email=" + aname;
    console.log("login valid url : " + login_valid_url);
    $.ajax({
        url: login_valid_url,
        type: "GET",
        async: false,
        success: function (data) {
            console.log("login_valid_res : " + JSON.stringify(data));
            if (data.status == "success") {
            	
                if (data.login == "valid") {
                    isSuccess = true;
                    loggedIn = true;
                }
            } 

        },
        error: function (xhr, ajaxOptions, thrownError) {
        	navigator.notification.alert("vote error : " + xhr.status + " - " + thrownError , null , "The Box Score" , "OK");
        }        
    });

    return isSuccess;
}

function onOfferPageClicked() {
    console.log("~!@#$%^&*");
}

//list coupon and coupon details
function loadListCoupon() {
    console.log('Goto coupon list' + JSON.stringify(list_coupon));
    $('#offers-scroll').empty();
    $('#page-offers').css('top','3.1em !important');
    if (list_coupon != null && list_coupon.length > 0) {
        for(var i = 0; i < list_coupon.length;i++) {
            var item = list_coupon[i];
            if (item != null && item.offertext != null) {
                console.log(item.offertext);
                
                $('<li onclick="Godetailcoupon('+item.id+')"><div class="title-offers">'+item.offertext+'</div><div class="content-offers">'+item.offertext2+'</div><div class="button-offers" ></div></li>').appendTo('#offers-scroll');
            }
        }
    }
    endLoading();
}


// insert function when click button go to list coupon
function golistcoupon() {

        doLoading();
        
        var store = new Lawnchair({name:'reponse'}, function(store){
            // Save it
            store.get('listcoupon', function(obj){
                if(obj) list_coupon = obj.data;
                
                console.log('Reading data : ' + JSON.stringify(obj));
                
                var nowDate = new Date();
                var newlistCoupon = [];
                total_coupon = 0;
                
                for(var i=0; i<list_coupon.length; i++)
                {
                    var exDate = new Date(list_coupon[i].offerexpire);
                    if(nowDate < exDate)
                    {
                        newlistCoupon.push(list_coupon[i]);
                        total_coupon++;
                    }
                    else
                    {
                        // Delete image
                        var entry = new FileEntry();
                        entry.fullPath = list_coupon[i].offer.replace('file:', '');
                        entry.remove(function(){ console.log('Delete file is success'); }, function(){ console.log('Delete file failed'); });
                    }
                }
                
                list_coupon = newlistCoupon;
                
                // Resave
                var update = new Lawnchair({name:'reponse'}, function(update) {
                        update.save({key:'listcoupon', data:newlistCoupon});
                });
            });
        });

        if ((isLoginValid() || loggedIn) && (list_coupon.length > 0)) {
            window.location.hash = "#home";
            window.location.hash = "#page-offers";
            loadListCoupon();
            setnavibar(2);
        } else {
            endLoading();
        	navigator.notification.alert( "Respond to the video for possible offers.", null , "The Box Score" , "OK");
        }
};

function Godetailcoupon(id)
{   
    console.log("go to coupon details with id = " + id);
    window.location.hash = "#page-offers";
    window.location.hash = "#page-details-coupon";
    var n = list_coupon.length;
    var curr_item;
    for (var i = 0;i < n;i++) {
        var item = list_coupon[i];
        if (item != null) {
            console.log("item : " + item.offertext2);
            if (item.id == id) {
                curr_item = item;
                break;
            }
        }
    }
    
    if (curr_item != null) {
        
        var details_page = $( "#page-details-coupon" ).find( ".page-details-coupon-content" );
        details_page.children().remove();
        
        details_page.html('<img id="img-detail-offer" src="' + curr_item.offer + '" alt="" />');
        
        console.log('<img id="img-detail-offer" src="' + curr_item.offer + '" alt="" />');
    }
};
//end

function saveCoupon(obj)
{
    console.log('Save coupon.');
    
    var d = new Date();
        var id = d.getTime();
        
    var save = function(filePath){
        var item = {
            id: total_coupon,
            status: 'success',
            offer: filePath,
            offertext: obj.offertext,
            offertext2: obj.offertext2,
            offerexpire: obj.offerexpire
        };
        
        list_coupon.push(item);
        
        total_coupon++;
        
        var store = new Lawnchair({name:'reponse'}, function(store) {
            store.save({key:'listcoupon', data:list_coupon});
        });
        
        endLoading();
        navigator.notification.alert("Thanks for responding, check the tab below for available offers.", null, "The Box Score", "OK");
    };
    
    var successCB = function(res) {
        console.log("download complete: " + JSON.stringify(res));
        if(res.status == 1){
            save(res.file);
        }
    };
    
    var failedCB = function(error) {
        console.log("download error source " + JSON.stringify(error));
        save(obj.offer);
    };
    
    window.plugins.downloader.downloadFile(obj.offer, {fileName:id+'.png', overwrite: true}, successCB, failedCB);
}

// Upload files to server
function uploadFile(mediaFile) {
    
    var ft = new FileTransfer(),
        path = mediaFile.fullPath,
        name = mediaFile.name;

    console.log('File : ' + path);
    
    var options = new FileUploadOptions();
    options.fileKey="comment[assets_attributes[0]][file]";
    
    options.fileName="android.3gp";
    options.mimeType="video/3gp";
    
    var params = {
                    "authenticity_token": token,
                    "comment[commentable_type]": "Topic",
                    "comment[commentable_id]": topicNumber,
                    "comment[assets_attributes[0]][type]": "Video",
                    "comment[assets_attributes[0]][do_transcode]": "1",
                    "comment[assets_attributes[0]][rotate]" : "0"
                 };
                                             
    options.params = params;
    
    var post_url = upd_base_url + "videopinions/" + slug + "/comments.json?authenticity_token=" + token;
    
    doLoading();
    
    var failedUpload = function(error){
        //alert("Upload error.");
        endLoading();
        //console.log('Error uploading file ' + path + ': ' + error.code);
        navigator.notification.alert("An error happened while uploading.", null, "The Box Score", "OK");
    };
    
    var winUpload = function(result){
    
        console.log('Server Upload Return : ' + JSON.stringify(result));
        
        //var obj = {offertext2:"Cheat", offerexpire:"2012/03/19", offer:"http://youpluspreprod.com/offers/e01d09ece4a74b8ce940c08b1c5b4dd400fd008e", offertext:"Test Offer 1", status:"success"};
        
        var rObj = '' + JSON.stringify(result.response);
        rObj = rObj.replace(/\\/g, '');
        
        if(rObj.substring(0,1) == '"') rObj = rObj.substring(1, rObj.length);
        if(rObj.substring(rObj.length-1,rObj.length) == '"') rObj = rObj.substring(0, rObj.length-1);
        
        var obj = jQuery.parseJSON(rObj);

        if(obj.status == "success")
        {
            if(obj.offerexpire)
            {
                saveCoupon(obj);
            }
            else
            {
                console.log('No Coupon return ================ ');
                endLoading();
                navigator.notification.alert("Thanks for responding, check the tab below for available offers.", null, "The Box Score", "OK");
            }
        }
        else
        {
            failedUpload(1);
        }
    };
    //winUpload();
    ft.upload(path, post_url, winUpload, failedUpload, options);   
};

var ypSignup = function() {
    var post_url = upd_base_url + "user_session/create_from_mobile.json"
    //alert("birthday: " + birth_year + birth_month + birth_day);
    var email = $("#email").val();
    var first_name = $("#first").val();
    var last_name = $("#last").val();
    var password = $("#password").val();
    var passwordc = $("#passwordc").val();
    var zip = $("#zip").val();
    var checkbox = $("#checkbox-2")[0];

    //brief validation routines
    if (email.indexOf("@") == -1) {
    	navigator.notification.alert("Invalid email address.", null, "The Score Box", "OK");
        return;
    }
    if (password != passwordc) {
    	navigator.notification.alert("Password confirmation does not match.", null, "The Score Box", "OK");
        return;
    }
    if (zip.length > 12) {
    	navigator.notification.alert("Zip code is too long.", null, "The Score Box", "OK");
        return;
    }
    if (!checkbox.checked) {
    	navigator.notification.alert("You must agree to the Terms and Conditions to use this service.", null, "The Score Box", "OK");
        return;
    }

    var post_data = "user[first_name]=" 
    + first_name + "&user[last_name]=" + last_name
    + "&user[birthday]=" + birth_year + "%2F" + birth_month + "%2F" + birth_day
    + "&user[email]=" + email
    + "&user[password]=" + password + "&user[password_confirmation]=" + passwordc
    + "&zip=" + zip;
    $.ajax({
        url: post_url,
        data: post_data,
        type: "POST",
        success: function (result) {                
            if(result["status"] == "success") {
                token = result["user_credentials"];
                uid = result["user_id"];
                loggedIn = true;
                // Save information
                savecreds(atype, email, password);
                navigator.notification.alert("Registeration successful!", null, "The Score Box", "OK");
                
                //enable the logout button
                enableLogoutButton();

                //gotoHomePage();
                //parent.history.go(-2); //not far enough
                window.location.hash = "#home";
            } else {
            	navigator.notification.alert("Registration error.", null, "The Score Box", "OK");
            }
     },
        error: function (xhr, ajaxOptions, thrownError) {
            
        	navigator.notification.alert("Registration error (connection problems).", null, "The Score Box", "OK");
        }        
    });
}
/************SIGNUP FUNCTION**********/
function inputValidation() {
    var firstname = $('#first').val();
    var lastname = $('#last').val();
    var zipcodeLength = 5;
    var emailReg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    var email = $('#email').val();
    var zipcode = $('#zip').val();
    var birthday = $('#value').html();
    var isAgreeTerm = $('#checkbox-2').is(':checked');
    var msg_error = '';
    var isValidate = true;
    if (null == firstname || firstname.split('').length <= 0) {
        msg_error += 'Please enter your firstname.\n';
        isValidate = false;
    }
    
    if (null == lastname || lastname.split('').length <= 0) {
        msg_error += 'Please enter your lastname.\n';
        isValidate = false;
    }
    
    if ((null == email) || emailReg.test(email) == false) {
        msg_error += 'Invalid email address.\n';
        isValidate = false;
    }
    if (null == zipcode || zipcode.split('').length <= 0) {
        msg_error += 'Please enter your zipcode.\n';
        isValidate = false;
    } 
    else { 
        if (zipcode.split('').length != 5) {
            msg_error += 'Invalid zipcode.zipcode has 5 numbers.\n';
            isValidate = false;
        } else if(isValidZipcode(zipcode) == false) {
            msg_error += 'Invalid zipcode.zipcode only numberic.\n';
            isValidate = false;
        }
    }

    if (null == birthday || birthday.split('').length == 21) {
        msg_error += 'Please choose your birthday.\n';
        isValidate = false;
    }
    
    if (!isAgreeTerm) {
        msg_error += 'Please agree Terms and Conditions.\n';
        isValidate = false;
    }
    
    if (isValidate) {
    	ypSignup();
    }
    else {
    	navigator.notification.alert(msg_error, null, 'Note');
    }

}

function isValidZipcode(zc) {
    var myValidChars = new Array(0,8,46,48,49,50,51,52,53,54,55,56,57);
    var n = zc.split('').length;
    var arr = zc.split('');
    for (var i = 0;i < n;i++ ) {
    /*
        if (!(arr[i].fromCharCode(64) == 0 || arr[i].fromCharCode(64) == 8 || arr[i].fromCharCode(64) == 46 ||(arr[i].fromCharCode(64) >= 48 && arr[i].fromCharCode(64) <= 57))) {
            return false;
        }
      */  
        if (false == (arr[i].charCodeAt(0) in oc(myValidChars))) {
            return false;
        }
        
    }
    return true;
}

function oc(a)
{
  var o = {};
  for(var i=0;i<a.length;i++)
  {
    o[a[i]]='';
  }
  return o;
}

function specialChars()
{ 
         var nbr;
         nbr = event.keyCode ;
         if ((nbr == 45) || (nbr >= 48 && nbr <= 57)) {
            return true;
         } else { 
            return false; 
         }
}
/************End**********************/
/************Spinner function*********/
function doLoading() {
    console.log('Begin doLoading');
    //$(imgLoading).appendTo('.slide-loading');
//    $(spinner).appendTo('.slide-loading');
    $('.slide-loading').css("visibility","visible");
}

function endLoading()
{
    console.log('End doLoading');
    $('.slide-loading').css("visibility","hidden");
}

/************End spinner function******/

/************Load response************/
function updateResponseID(res_id,type) {
    var temp = responses;
    for (var i = 0;i < temp.length;i++) {
        var item = temp[i];
        if(item["responseid"] == res_id) {
            if (type == 1) {
                item["upvotes"] += 1;
                var uv = $('#'+res_id+'').find('set-vot');
                $('#'+res_id+'').find('set-vot').html(item["upvotes"]);
            } else {
                item["downvotes"] += 1;
                var uv = $('#'+res_id+'').find('dislike');
                $('#'+res_id+'').find('dislike').html(item["downvotes"]);
            }
            temp[i] = item;
            
            break;
        }
    }
    responses = temp;
    //saveResponses(responses);
}

function vote(count,type) {
    doLoading();
    var typeNumber = type;
    var data= Data;
    var res_id = data[count]["responseid"];
	var typeAction;
	 if(type==1)
 	{
 		type="up";
 		typeAction="Vote Up ";
 	}
 	else{
 		type="down";
 		typeAction="Vote Down ";
 	}
    var vote_url = base_url + "mobile/topics/" + slug +"/vote.json";
    var post_data = "authenticity_token=" + token + "&response_id=" + res_id + "&vote="+type;
    console.log("vote_url : " + vote_url);
    console.log("post-data : " + post_data);
    $.ajax({
        url: vote_url,
        data: post_data,
        type: "POST",
        success: function (result) {                
            console.log("vote result : " + JSON.stringify(result));
            endLoading();
            
            if(result.status == "success")
            {
            	navigator.notification.alert(typeAction+"Success!", null, 'The Box Score','OK');
            //    updateResponseID(res_id,type);
                if(typeNumber==1)
             	{
                 	votes 		= data[count]["upvotes"];
                 	document.getElementById('set-vote'+count).innerHTML = parseInt(votes) + 1;
             	}
             	else{
                 	unvotes		= data[count]["downvotes"];
                 	document.getElementById('set-unvote'+count).innerHTML = parseInt(unvotes) + 1;
             	}
            }
            else {
            	navigator.notification.alert(result.reason, null, 'The Box Score');
            	if(!loggedIn){
            		isRespond = false;
            		window.location.hash = '#yp-login'; 
            	}
            }
            //alert("vote success");
        },
        error: function (xhr, ajaxOptions, thrownError) {
            endLoading();
            navigator.notification.alert("vote error : " + xhr.status + " - " + thrownError, null, "The Box Score", "OK");
        }        
    });
}

var viewOtherRespond = function(isTop){
    $('#button-respondselected').css('background','url(images/ViewMoreResponsesButtonActive.png)');
    window.location.hash = '#respon-home';
    doLoading();
    
    setTimeout(
    	function(){
            $('#button-respondselected').css('background','url(images/ViewMoreResponsesButton.png)');
            $('#refesh').css("visibility","hidden");
            $('#icon').css("visibility","hidden");
            $('#icon').css('height','4%');
            refeshViewOtherRespondService(isTop);
    	},1000
    );
};

var refeshViewOtherRespondService = function(isTop) {
    var d = new Date(); 
    stopCachingInAjaxGet = d.getTime();
    if(debugResponses) console.log('Debug Responses: ' + stopCachingInAjaxGet);
    if(isTop)
    {
        startIdx = 0;
    }
    if(debugResponses) console.log('Debug Responses: ' + startIdx);
    var responses_url = base_url + "mobile/topics/" + slug + "/responses.json?skip=" + startIdx + "&max=10" + "&dummyParameter=" + stopCachingInAjaxGet;
    if(debugResponses) console.log('Debug Responses: ' + responses_url);
    
    respondService = $.ajax({
        url: responses_url,
        type: "GET",
        async: false,
        success: function (data) {
            endLoading();
            if(debugResponses) console.log('Debug Responses: ' + JSON.stringify(data));

            if(data.length <= 0)
            {
                navigator.notification.alert("There are no more responses.", null, "The Box Score", "OK");
            }
            else
            {
                if(!Data || isTop)
                {
                    Data = data;
                    $('#respon-scroll').empty();
                    for(var i=0; i<Data.length; i++)
                    {
                        console.log('Add quite new : ' + JSON.stringify(Data[i]));
                        loadData(Data[i], i, isTop);
                    }
                }
                else
                {
                    var next = 0;
                    for(var i=0; i<data.length; i++)
                    {
                        console.log('Check in list item : ' + JSON.stringify(Data[i]));
                        var isAdded = false;
                        for(var j=0; (!isAdded)&&(j<Data.length); j++)
                        {
                            if(Data[j].responseid == data[i].responseid)
                            {
                                isAdded = true;
                            }
                        }
                        
                        if(!isAdded)
                        {
                            var index = Data.length;
                            Data.push(data[i]);
                            loadData(Data[index], index, isTop);
                            console.log('Add new item to list by refresh : ' + JSON.stringify(Data[index]));
                        }
                    }
                }
            }
            isRefesh = false;
        },

        error: function (xhr, ajaxOptions, thrownError) {
        	endLoading();
            console.log("other response error : " + xhr.status + " - " + thrownError);
        }
    }); 
};


function include(arr,obj) {
    return (arr.indexOf(obj) != -1);
}

var loadData = function(data, i, isTop){
    
  console.log('Add data : ' + JSON.stringify(data));
  startIdx++;
	videoUrl 	  = data.videoUrl;
	responseid 	= data.responseid;
	username   	= data.username;
	votes 		  = data.upvotes;
	unvotes	  	= data.downvotes;
	thumb 	  	= data.keyframeUrl;
	datetime 	  = data.datetime;

  var item = '<li id="respondId"'+i+'""><div class="border-respond"><img src="images/border.png"/></div><div><div class="set-username" id="set-username'+i+'">'+username+'</div></div><div class="set-video" id="set-video'+i+'"><img id="respond'+i+'" src="'+thumb+'"/><div class="set-play-video" onclick="playRespondVideo('+i+')"><img src="images/play.png"/></div></div><div class ="set-div-comment"><div class="button-share" onclick="buttonShare('+i+')"></div><div class="set-vote" id="set-vote'+i+'">'+votes+'<span class="vote"></span></div><div class="set-comment"><div class="button-like" onclick="vote('+i+','+1+')"></div><div class="button-dislike" onclick="vote('+i+','+0+')"></div><div class="dislike" id="set-unvote'+i+'">'+unvotes+'</div></div></div></li>';
    
	if(isTop)
  {
    $(item).appendTo('#respon-scroll');
  }
  else
  {
    $(item).appendTo('#respon-scroll');
  }

	myScrollrespond.refresh();
};


/*======================END=======================*/

var sendEmail = function(subject, body) { 
        var extras = {};
        extras[WebIntent.EXTRA_SUBJECT] = subject;
        extras[WebIntent.EXTRA_TEXT] = body;
        window.plugins.webintent.startActivity({ 
            action: WebIntent.ACTION_SEND,
            type: 'text/plain', 
            extras: extras 
        }, 
        function() {}, 
        function() {
        	navigator.notification.alert('Failed to send email via Android Intent', null, "The Box Score", "OK");
        }
        ); 
};
//
function gotoViewPlayer(id) {
    var curr_res;
    for (var i = 0;i < responses.length;i++) {
        var item = responses[i];
        if (item.responseid == id) {
            curr_res = item;
            break;
        }
    }
    
    if (curr_res != null) {
        var extra_data = {"path": curr_res.videoUrl};
        var success_callback = function(args) { /*alert("success")s*/; }
        var error_callback = function(args) { navigator.notification.alert(args, null, "The Box Score", "OK"); }
        window.plugins["ShoutzPlayerPlugin"].playVideo(success_callback, error_callback, extra_data) ;
    }
 
}


/************End**********************/
