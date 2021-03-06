var mainText = document.getElementById("mainText");
var submitButton = document.getElementById("submitButton");



var storage = firebase.storage();
var storageRef = storage.ref();
var tangRef = storageRef.child('images/news/fandance.jpg');
var albumsRef = firebase.database().ref().child("Album");


var timestamp = new Date().toLocaleDateString();
var news_table_index_remove;
var myIndex;
var myNewsData = [];
$(document).ready(function () {
    //your code here
    var newsTable = $('#albums_table').DataTable({
        responsive: true,
        "autoWidth": false,
        "searching": false,
        pageResize: true,
        processing: true,
        colReorder: true,
        "aLengthMenu": [[5, 10, 25, 50, 75, -1], [5, 10, 25, 50, 75, "All"]],

        "iDisplayLength": 75,
    });

    $('#albums_table tbody').off('click', 'tr').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            newsTable.$('tr.selected').removeClass('selected').css('background', '#167691').css('color', 'white');
            $(this).removeClass('selected').css('background', '').css('color', '');
            console.log("remove selected");
            //$(this).addClass('selected').css('background', 'Aqua');
            $(this).addClass('selected').css('background', '#167691').css('color', 'white');

        }
        else {
            newsTable.$('tr.selected').removeClass('selected').css('background', '').css('color', '');
            console.log($(this).text());
            $(this).addClass('selected').css('background', '#167691').css('color', 'white');
        }

    });


    $("#news_timeStamp").text(timestamp);
    $('#albums_table tbody').on('click', '#removeBtn', function () {
        var data = newsTable.row($(this).parents('tr')).data();
        // var index = $(this).index(this);
        var index = newsTable.row($(this).parents('tr')).index();
        console.log("data index " + index);

        if (confirm("are you sure to delete ?")) {
            
            newsTable.row($(this).parents('tr')).remove().draw();
        } else {
            console.log("deletion cancelled!");
        }
    });

    $(document).on('change', "#albumSelect", function () {
        //alert($(this).val());  // will display selected option's value
        //alert($(this).find('option:selected').text()); //will display selected option's text
        updateAlum($(this).val());
        $("#albumsName").val($(this).find('option:selected').text());
    });


    $("#delete_albums").click(function () {
        if (confirm("Confirm to delete?")) {
            //alert("delete");
        } else {
            //alert("cancel");
        }


    })

    $("#UploadImgBtn").click(function () {

        //console.log("url " + url);
        var removeButtonTag = ' <button id="removeBtn" type="button" class="btn btn-danger  btn-circle"><i class="fa fa-times"></i></button>';
        var imageTag = '<img src="' + reader.result + '" width="100">';
        newsTable.row.add([
            //"123",
            //"",
            //"",
            imageTag,
            //Album_list[index].dataString,
            removeButtonTag,
            //editButtionTag
        ]).draw(false);


    })



    $("#addAlbumBtn").click(function () {
        var select = document.getElementById("albumSelect");

        //alert('$("#newAlbumName").val()' + $("#newAlbumName").val());
        var option = document.createElement('option');
        //option.text = option.value = $("#newAlbumName").val();
        //option.text = option.value = "123";
        option.textContent = option.value = "(2017.5.9) "+$("#newAlbumName").val();

        select.appendChild(option);


    })

    function addAlbumSelectOption() {
        var option = document.createElement('option');
        //option.text = option.value = $("#newAlbumName").val();
        option.text = option.value = "123";
        $('#albumSelect').add(option, 0);
    }

    window.onload = function () {
        alert(" window.onload");
        var option = document.createElement('option');
        //option.text = option.value = $("#newAlbumName").val();
        option.text = option.value = "123";
        $('#albumSelect').add(option, 0);
    }

    $('#albums_table tbody').on('click', '#editBtn', function () {
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

    function updateAlum(index) {
        newsTable.clear().draw();
        if (Album_list[index] == null) {
            return;
        }
        if (Album_list[index].imgRef == null) {
            return;
        }
        var obj = Album_list[index].imgRef;

        var result = Object.keys(obj).map(function (e) {
            return [String(e), obj[e]];
        });
        console.log("result ", result);
        console.log("result " + result[1]);
        console.log("result " + result.length);
        var imageList = result;
        var str = imageList[1].toString();
        var res = str.split(",");
        console.log("res " + res[1]);

        for (var i = 0; i < imageList.length; i++) {
            var tangRef = storageRef.child(imageList[i].toString().split(",")[1]);
            var removeButtonTag = ' <button id="removeBtn" type="button" class="btn btn-danger  btn-circle"><i class="fa fa-times"></i></button>';

            tangRef.getDownloadURL().then(function (url) {
                image_real_url = url;
                //console.log("url " + url);
                var imageTag = '<img src="' + image_real_url + '" width="100">';
                newsTable.row.add([
                    imageTag,
                    removeButtonTag,
                ]).draw(true);
            }).catch(function (error) {
                console.error(error);

            });
        }


    }

});



var Album_list = [];
albumsRef.on("child_added", snap => {
    console.log("albumsRef on");
    var coverageRef = snap.child("coverStorageRefChild").val();
    var dataString = snap.child("dateString").val();
    var name = snap.child("name").val();
    var imgRef = snap.child("storageRefChilds").val();
    console.log("name " + name);
    console.log("imgRef ", imgRef);

    var new_data = {
        "key": snap.key,
        "dataString": dataString,
        "name": name,
        "imgRef": imgRef,
    }

    Album_list.push(new_data);
    $('#albumSelect').val("0").change();

});




  







function getImage() {
    var image_name = $("#upload_news_image").val();

    var lastIndex = image_name.lastIndexOf("\\");
    if (lastIndex >= 0) {
        image_name = image_name.substring(lastIndex + 1);
    }
    return image_name;
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
        //console.log("reader.result " + reader.result);
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


function countTableRowLength(table_name) {

    var x = document.getElementById("table_news").rows.length;
    return x;
    // document.getElementById("demo").innerHTML = "Found " + x + " tr elements in the table.";
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