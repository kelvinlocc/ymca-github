var mainText = document.getElementById("mainText");
var submitButton = document.getElementById("submitButton");



var storage = firebase.storage();
var storageRef = storage.ref();
var tangRef = storageRef.child('images/news/fandance.jpg');


var timestamp = new Date().toLocaleDateString();
var news_table_index_remove;
var myIndex;
var myNewsData = [];
$(document).ready(function () {
    //your code here

    $("#dummy").hide();
    $("#news_timeStamp").text(timestamp);
    $('#table_news tbody').on('click', '#removeBtn', function () {
        var data = newsTable.row($(this).parents('tr')).data();
        // var index = $(this).index(this);
        var index = newsTable.row($(this).parents('tr')).index();
        console.log("data index " + index);

        // alert("index " + index + " " + data[1] + " " + data[5]);
        // alert("key " + data[0]);
        if (confirm("are you sure to delete the news with title: " + data[1] + "?")) {
            remove_news(data[0]);
            newsTable.row($(this).parents('tr')).remove().draw();
        } else {
            console.log("deletion cancelled!");
        }
    });

    $('#table_news tbody').on('click', '#editBtn', function () {
        var data = newsTable.row($(this).parents('tr')).data();
        // var index = $(this).index(this);
        var index = newsTable.row($(this).parents('tr')).index();
        console.log("data index " + index);
        // var newData = [];

        // reference = this;
        // editRowData = data;
        $('[data-popup-open]').click();
        $('#submit_news').hide();
        $('#edit_news').show();
        // alert("$('#createEditNews').val"+$('#createEditNews').val());
        $('h2#createEditNews').text("edit news");
        myNewsData = data;

        $('#news_title').val(data[1]);
        $('#news_content').val(data[2]);
        // newsTable.row( index ).data( newData ).draw();
        myIndex = index;

    });
    newsTable.column(0).visible(false);
});

// var reference;
// var editRowData;

// function setUpdateNews(data) {

//     if (reference != null) {
//         newsTable.row($(reference).parents('tr')).data(newData).draw();
//     }

// }

// var calcDataTableHeight = function () {
//     return $(window).height() * 55 / 100;
// };

// var oTable = $('#reqAllRequestsTable').dataTable({
//     "sScrollY": calcDataTableHeight()
// });




var newsTable = $('#table_news').DataTable({
    responsive: true,
    "autoWidth": false,
    // "aoColumnDefs": [{
    //     "bVisible": false,
    //     "aTargets": [0]
    // }],
    // "scrollY": "200px",
    // "scrollCollapse": true,
    // "paging": false,
    pageResize: true,

    dom: 'Blfrtip',
    buttons: [{
        text: 'add news',
        action: function (e, dt, node, config) {
            addNews();
        }
    }],

    // buttons: [{
    //         extend: "create",
    //         editor: editor
    //     },
    //     {
    //         extend: "edit",
    //         editor: editor
    //     },
    //     {
    //         extend: "remove",
    //         editor: editor
    //     }
    // ],

    colReorder: true,
});

function addNews() {
    console.log("addNews ");
    // resizeElementHeight(newsTable);
    // update();
    // $("#table_news").height($(window).height());
    $('[data-popup-open]').click();
    $('#submit_news').show();
    $('#edit_news').hide();
    $('#createEditNews').val("create a news");
    $('#news_title').val("");
    $('#news_content').val("");
    $("#image_preview").attr("src", "");


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
        console.log("reader.result " + reader.result);
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
var news_list = [];

newsRef.on("child_added", snap => {
    console.log("newsRef on ");



    var itermId = snap.key;
    var title = snap.child("title").val();
    var content = snap.child("content").val();
    var storageRefChild = snap.child("storageRefChild").val();
    var timestamp = snap.child("timestamp").val();
    var tangRef = storageRef.child(storageRefChild);
    var image_real_url;


    tangRef.getDownloadURL().then(function (url) {
        image_real_url = url;
        var imageTag = '<img src="' + image_real_url + '" width="100">';
        newsTable.row.add([
            itermId,
            title,
            content,
            imageTag,
            timeConverter(timestamp),
            removeButtonTag,
            editButtionTag
        ]).draw(false);


        var new_data = {
            "key": snap.key,
            "title": title,
            "content": content,
            "timestamp": timestamp,
            "image_real_url": image_real_url
        }



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

function editNews() {
    console.log("editNews()");
    var timestamp = Math.round((new Date()).getTime() / 1000);
    // var timestamp = new Date().getTime();
    // Timestamp timestamp = new Timestamp(System.currentTimeMillis());
    console.log("timestamp " + timestamp);
    console.log("timestamp timeConverter " + timeConverter(timestamp));


    var title = $("#news_title").val();
    var content = $("#news_content").val();

    myNewsData[1] = title;
    myNewsData[2] = content;
    var imageTag = '<img src="' + reader.result + '" width="100">';
    myNewsData[3] = imageTag;
    myNewsData[4] = timeConverter(timestamp);

    if (myIndex != "") {
        newsTable.row(myIndex).data(myNewsData).draw();
        $('[data-popup-close]').click();

    }

}



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