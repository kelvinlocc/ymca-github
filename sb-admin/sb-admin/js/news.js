var mainText = document.getElementById("mainText");
var submitButton = document.getElementById("submitButton");



var storage = firebase.storage();
var storageRef = storage.ref();
var tangRef = storageRef.child('images/news/fandance.jpg');


var timestamp = new Date().toLocaleDateString();
var news_table_index_remove;


$(document).ready(function () {
    //your code here

    $("#dummy").hide();
    $("#news_timeStamp").text(timestamp);
    $('#table_news tbody').on('click', 'button', function () {
        var data = newsTable.row($(this).parents('tr')).data();
        // var index = $(this).index(this);
        var index = newsTable.row($(this).parents('tr')).index();
        console.log("data index " + data.index);

        // alert("index " + index + " " + data[1] + " " + data[5]);
        // alert("key " + data[0]);
        if (confirm("are you sure to delete the news with title: " + data[1] + "?")) {
            remove_news(data[0]);
            newsTable.row($(this).parents('tr')).remove().draw();
        } else {
            console.log("deletion cancelled!");
        }


    });
    newsTable.column( 0 ).visible( false );
});


var calcDataTableHeight = function () {
    return $(window).height() * 55 / 100;
};

var oTable = $('#reqAllRequestsTable').dataTable({
    "sScrollY": calcDataTableHeight()
});
$(window).resize(function () {
    var oSettings = newsTable.fnSettings();
    oSettings.oScroll.sY = calcDataTableHeight();
    oTable.fnDraw();
});



var newsTable = $('#table_news').DataTable({
    responsive: true,
    "autoWidth": false,
    // scrollY: '50vh',
    // "sScrollY": calcDataTableHeight(),
    // scrollCollapse: true,
    // paging: false,
    //  "sScrollY": "550px",

    // "scrollX": true,
    // scrollY: "300px",

    "aoColumnDefs": [{
        "bVisible": false,
        "aTargets": [0]
    }],


    // scrollCollapse: true,
    dom: 'Blfrtip',
    // buttons: ['copy', 'csv', 'excel', 'pdf', 'print',
    //     {
    //         text: 'add news',
    //         action: function (e, dt, node, config) {
    //             addNews();
    //             // window.location.href = "../pages/window.html"
    //             // alert('Button activated');
    //         }
    //     }
    // ],
    buttons: [{
        text: 'add news',
        action: function (e, dt, node, config) {
            addNews();
        }
    }],

    colReorder: true,
});

function addNews() {
    console.log("addNews ");
    $('[data-popup-open]').click();



}


function getImage() {
    var image_name = $("#upload_news_image").val();

    var lastIndex = image_name.lastIndexOf("\\");
    if (lastIndex >= 0) {
        image_name = image_name.substring(lastIndex + 1);
    }
    return image_name;
    console.log("image_name " + image_name);
}
var file;
var reader;

function previewFile() {
    console.log("previewFile");
    var preview = document.querySelector('img'); //selects the query named img
    // var preview =  $("#image_preview"); //selects the query named img
    file = document.querySelector('input[type=file]').files[0]; //sames as here
    reader = new FileReader();
    // console.log("file: " + file);

    reader.onloadend = function () {
        // preview.src = reader.result;
        $("#image_preview").attr("src", reader.result);

    }

    if (file) {
        reader.readAsDataURL(file); //reads the data as a URL
    } else {
        preview.src = "";
    }
    console.log("getImage();" + getImage());



}

var rootRef = firebase.database().ref();
var newsRef = firebase.database().ref().child("News");


newsRef.on("child_added", snap => {
    console.log("newsRef on ");
    $("#uploadNewsProgress").hide();

    var itermId = snap.key;
    var title = snap.child("title").val();
    var content = snap.child("content").val();
    var storageRefChild = snap.child("storageRefChild").val();
    var timestamp = snap.child("timestamp").val();
    var tangRef = storageRef.child(storageRefChild);
    var image_real_url;
    tangRef.getDownloadURL().then(function (url) {

        $('#table_news').off().on('click', '.delbtn', function () {
            var $row = $(this).closest('tr');
            console.log("index: " + $(this).index(this));
            var $columns = $row.find('td');
            var once = 0;
            $columns.addClass('row-highlight');
            $.each($columns, function (i, item) {
                // values = values + 'td' + (i + 1) + ':' + item.innerHTML + '<br/>';
                // console.log("counter " + counter);
                if (once == 0) {
                    console.log("item.innerHTML: i" + item.innerHTML + " i " + i);
                    if (confirm("you sure to remove record: " + item.innerHTML + " ? ")) {
                        console.log("user confirmed!");
                        remove_news(item.innerHTML);
                    } else {
                        console.log("user not confirmed!");
                    }
                }
                once++;
            });
        });


        image_real_url = url;
        var imageTag = '<img src="' + image_real_url + '" width="100">';
        newsTable.row.add([
            itermId,
            title,
            content,
            imageTag,
            timeConverter(timestamp),
            removeButtonTag
        ]).draw(false);


        // document.querySelector('img').src = url;
        // $("#table_news").append("<tr class='two'  ><td>" + itermId + "</td><td>" + title + "</td> <td>" + content + "</td> <td> <img id='image_test'width='100'' src='" + image_real_url + "'/> </td><td>" + timeConverter(timestamp) + "</td><td><button class='delbtn'>remove</button></td></tr>");

        // $('#table_news tr').off().on('click', function () {
        //     console.log("rowIndex: ");
        //     var rowIndex = $('#table_news tr').index(this); //index relative to the #tableId rows
        //     console.log("table_news rowIndex: " + rowIndex);
        //     // document.getElementById("table_news").deleteRow(rowIndex);
        //     news_table_index_remove = rowIndex;
        // });


    }).catch(function (error) {
        console.error(error);
        // if (error != null) {
        //     update_local_news_table();
        // }
    });



});


function countTableRowLength(table_name) {

    var x = document.getElementById("table_news").rows.length;
    return x;
    // document.getElementById("demo").innerHTML = "Found " + x + " tr elements in the table.";
}





function createNews() {
    console.log("createNews()");
    var timestamp = Math.round((new Date()).getTime() / 1000);
    // var timestamp = new Date().getTime();
    // Timestamp timestamp = new Timestamp(System.currentTimeMillis());
    console.log("timestamp " + timestamp);
    console.log("timestamp timeConverter " + timeConverter(timestamp));

    var title = $("#news_title").val();
    var content = $("#news_content").val();
    var newStoreRef = rootRef.child("News").push();
    if (title == "" || content == "") {
        alert("title or content is empty!");
        return;
    }
    console.log("newStoreRef " + newStoreRef.key);
    newStoreRef.set({
        "title": title,
        "content": content,
        "storageRefChild": "images/news/" + getImage(),
        "timestamp": timestamp
    })

    //get data for local:
    new_news_data = {
        "itemId": newStoreRef.key,
        "title": title,
        "content": content,
        "storageRefChild": "images/news/" + getImage(),
        "timestamp": timestamp
    }


    if (file != null) {
        console.log("file not null");
        upload_image(file);

    } else {
        console.log("file is null");
        alert("no image!");
    }

}

var new_news_data;

function upload_image(file) {

    console.log("upload_image...");
    var uploadTask = storageRef.child('images/news/' + getImage()).put(file);

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on('state_changed', function (snapshot) {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        // console.log('Upload is ' + progress + '% done');
        if (progress != 100) {
            // $("#uploadNewsProgress").show();
            // $("#uploadNewsButton").hide();
        } else {
            // $("#uploadNewsProgress").hide();
            // $("#uploadNewsButton").show();
            alert('Upload is done!');

        }
        switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
        }
    }, function (error) {
        // Handle unsuccessful uploads
        console.log("error: " + error);
    }, function () {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        var downloadURL = uploadTask.snapshot.downloadURL;
        console.log("complete: ");
        // update_local_news_table();
        window.location.reload();



    });


}

function update_local_news_table() {
    console.log("update_local_news_table");
    var title = $("#news_title").val();
    var content = $("#news_content").val();

    console.log("content; " + content);
    console.log("title; " + title);

    $("#table_news").append("<tr class='two'  ><td>" + new_news_data.itemId + "</td><td>" + new_news_data.title + "</td> <td>" + new_news_data.content + "</td> <td> <img id='image_test'width='100'' src='" + reader.result + "'/> </td><td>" + new_news_data.timestamp + "</td><td><button class='delbtn'>remove</button></td></tr>");
}



function remove_news(key) {
    console.log("removed() ");
    newsRef.child(key).remove();
    console.log("removed key:" + key);
    // if (news_table_index_remove != null) {
    //     console.log("news_table_index_remove " + news_table_index_remove);
    //     document.getElementById("table_news").deleteRow(news_table_index_remove);

    // } else {
    //     console.log("news_table_index_remove is null");
    // }
}


// open a pop up window for add news:
$('[data-popup-open]').on('click', function (e) {
    $("#wrapper").hide();
    var targeted_popup_class = jQuery(this).attr('data-popup-open');
    $('[data-popup="' + targeted_popup_class + '"]').fadeIn(350);

    e.preventDefault();
});

//----- CLOSE
$('[data-popup-close]').on('click', function (e) {
    console.log("model close");
    var targeted_popup_class = jQuery(this).attr('data-popup-close');
    $('[data-popup="' + targeted_popup_class + '"]').fadeOut(350);
    $("#wrapper").show();
    e.preventDefault();
});