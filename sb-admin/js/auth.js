console.log("auth.js working...");
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        console.log("user logined");
        window.location.replace("index.html");



    } else {
        console.log("user not loggined!");
        $("#loginProgress").hide();

        // alert("you are not loggined!");
        // // No user is signed in.
        // alert("redirect to login page!");
        // // window.location.replace("http://localhost/login.html");
        // window.location.replace("login.html");


    }
});


$(document).ready(function () {
    //your code here
    console.log("$(document).ready");

    $("#loginBtn").click(
        function () {

            console.log("loginBtn clicked");
            var userName = $("#usernameLogin").val();
            var password = $("#passwordLogin").val();

            // var userName = "admin123@gmail.com";
            // var password = "admin123";

            console.log("userName password " + userName + "," + password);
            if (userName != "" && password != "") {
                $("#loginProgress").show();
                $("#loginBtn").hide();
                firebase.auth().signInWithEmailAndPassword(userName, password).catch(function (error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    $("#loginError").show().text(errorMessage);
                    $("#loginProgress").hide();
                    $("#loginBtn").show();



                });

            } else {
                // console.error("error");
                alert("user name or password is empty!");
            }

        }
    );




});