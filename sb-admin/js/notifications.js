console.log("notification.js running...");

$(document).ready(function () {
    //your code here

    $('#notificationTable tbody').on('click', '#removeBtn', function () {
        var data = newsTable.row($(this).parents('tr')).data();
        // var index = $(this).index(this);
        var index = newsTable.row($(this).parents('tr')).index();
        console.log("data index " + index);

        if (confirm("are you sure to delete the news with title: " + data[1] + "?")) {
            remove_news(data[0]);
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


    $("#sendNotifBtn").click(function () {
        var removeButtonTag = ' <button id="removeBtn" type="button" class="btn btn-danger  btn-circle"><i class="fa fa-times"></i></button>';

        var viewButtonTag = '<button id="filterBtn" type="button" class="btn btn-info" data-toggle="modal" data-target="#viewStudentModal">view</button>';
        var timestamp = new Date().toLocaleDateString();
        var dt = new Date();
        var time = dt.getHours() + ":" + dt.getMinutes();
        var values = $('#selectGrop').val();
        var text = $('#selectGrop').val();
        console.log("text: " + text+ ","+values);

        notificationTable.row.add([
            $("#title").val(),
            $("#content").val(),
            values,
            time+" "+timestamp,
            //Album_list[index].dataString,
            removeButtonTag,
            viewButtonTag
            //editButtionTag
        ]).draw(false);

    })



  
});



var Album_list = [];


var notificationTable = $('#notificationTable').DataTable({
    responsive: true,
    "autoWidth": false,
    //"searching": false,

    //pageResize: true,



  
    //colReorder: true,
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



