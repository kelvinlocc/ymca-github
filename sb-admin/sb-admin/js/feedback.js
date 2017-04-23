var mainText = document.getElementById("mainText");
var submitButton = document.getElementById("submitButton");



var storage = firebase.storage();
var storageRef = storage.ref();
var tangRef = storageRef.child('images/news/fandance.jpg');


var timestamp = new Date().toLocaleDateString();
var news_table_index_remove;


$(document).ready(function () {
    $('#table_feedback tbody').on('click', 'button', function () {
        var data = feedbackTable.row($(this).parents('tr')).data();
        // var index = $(this).index(this);
        var index = feedbackTable.row($(this).parents('tr')).index();
        console.log("data index " + data.index);

        // alert("index " + index + " " + data[1] + " " + data[5]);
        // alert("key " + data[0]);
        if (confirm("are you sure to delete the this msg?")) {
            remove_feedback(data[0]);
            feedbackTable.row($(this).parents('tr')).remove().draw();
        } else {
            console.log("deletion cancelled!");
        }


    });
    // feedbackTable.column(0).visible(false);

});

var feedbackTable = $('#table_feedback').DataTable({
    responsive: true,
    "autoWidth": false,
    scrollCollapse: true,
    dom: 'Blfrtip',
    buttons: ['csv', 'excel'],
});

var rootRef = firebase.database().ref();
var feedbacksRef = firebase.database().ref().child("Feedbacks");


feedbacksRef.on("child_added", snap => {
    console.log("feedbacksRef on ");
    console.log("test: " + snap.key);
    var itermId = snap.key;
    var userId = snap.child("userId").val();
    var msg = snap.child("msg").val();
    var timestamp = snap.child("timestamp").val();
    console.log("name: " + userId);
    console.log("msg: " + msg);
    console.log("startdate: " + timestamp);

    feedbackTable.row.add([
        
        // userId,
        "Student1(MEM1234)",
        msg,
        timeConverter(timestamp),
        removeButtonTag
    ]).draw(true);
});

function remove_feedback(key) {
    console.log("removed() ");
    feedbacksRef.child(key).remove();
    console.log("removed key:" + key);

}