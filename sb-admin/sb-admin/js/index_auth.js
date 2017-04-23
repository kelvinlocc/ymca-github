console.log("index_auth.js working...");
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        console.log("user logined");



    } else {
        // alert("you are not loggined!");
        // No user is signed in.
        alert("sign out");
        // window.location.replace("http://localhost/login.html");
        window.location.replace("login.html");


    }
});


$(document).ready(function () {
    //your code here
    console.log("$(document).ready");

  

    $("#logoutBtn a").click(
        function () {
            console.log("logoutBtn clicked");

            firebase.auth().signOut().then(function () {
                // Sign-out successful.
                console.log("Sign-out successful.")

                // var dialog = document.querySelector('#login_dialog');
                // // var dialog = $(".login_dialog");
                // if (dialog == null) {
                //     console.error("dialog is null");
                // } else {
                //     console.log("dialog is !null");
                // }
                // if (!dialog.showModal) {
                //     console.error("!dialog.showModal!");
                //     dialogPolyfill.registerDialog(dialog);
                // }
                // dialog.showModal();
            }).catch(function (error) {
                alert(error.message);
                // An error happened.
            });
        }
    );


});

  function logout() {
        console.log("logoutBtn clicked");

        firebase.auth().signOut().then(function () {
            // Sign-out successful.
            console.log("Sign-out successful.")

            // var dialog = document.querySelector('#login_dialog');
            // // var dialog = $(".login_dialog");
            // if (dialog == null) {
            //     console.error("dialog is null");
            // } else {
            //     console.log("dialog is !null");
            // }
            // if (!dialog.showModal) {
            //     console.error("!dialog.showModal!");
            //     dialogPolyfill.registerDialog(dialog);
            // }
            // dialog.showModal();
        }).catch(function (error) {
            alert(error.message);
            // An error happened.
        });
    };