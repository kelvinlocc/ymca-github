console.log("getAllData.js begin");
var coursesRef = firebase.database().ref().child("Courses");
var usersRef = firebase.database().ref().child("Users");
var attendancesRef = firebase.database().ref().child("Attendances");
var storage = firebase.storage();
var storageRef = storage.ref();

var counterData = 0;

//courses
var course_list = [];
coursesRef.on("child_added", snap => {
    console.log("coursesRef on");
    var attendances = snap.child("Attendances").val();
    var students = snap.child("Students").val();

    var tutors = snap.child("tutors");

    var endDate = snap.child("endDate").val();
    var name = snap.child("name").val();
    var startdate = snap.child("startDate").val();
    var totalLessons = snap.child("totalLessons").val();
    var totalStudents = snap.child("totalStudents").val();
    var storageRefChild = snap.child("storageRefChild").val();
    var tangRef = storageRef.child(storageRefChild);



    var new_data = {
        "key": snap.key,
        "attendances": attendances,
        "students": students,
        "tutors": tutors,
        "endDate": endDate,
        "name": name,
        "startdate": startdate,
        "storageRefChild": storageRefChild,
        "totalLessons": totalLessons,
        "totalStudents": totalStudents
    }

    course_list.push(new_data);

});

//users
var user_list = [];
usersRef.on("child_added", snap => {
    console.log("usersRef on");
    var attendances = snap.child("Attendances").val();
    var name = snap.child("name").val();
    var Courses = snap.child("Courses").val();
    var storageRefChild = snap.child("storageRefChild").val();
    var tangRef = storageRef.child(storageRefChild);

    var new_data = {
        "key": snap.key,
        "attendances": attendances,
        "name": name,
        "storageRefChild": storageRefChild,
        "Courses": Courses
    }

    user_list.push(new_data);

    attendanceTable.row.add([
        new_data.key,
        new_data.name,
        viewButtionTag
    ]).draw(false);


});

//Attendances:
var Attendances_list = [];
attendancesRef.on("child_added", snap => {
    console.log("attendancesRef on");
    var students = snap.child("Students").val();
    var startTime = snap.child("startTime").val();
    var endTime = snap.child("endTime").val();


    var new_data = {
        "key": snap.key,
        "students": students,
        "name": name,
        "startTime": startTime,
        "endTime": endTime
    }

    Attendances_list.push(new_data);

    counterData++;
});


$(document).ready(function () {
    //your code here
    // $("#news_timeStamp").text(timestamp);


    // previewFile(); //calls the function named previewFile()
});

function debug() {
    console.log("debug");
    // test_userList(user_list);
    // test_courseList();
    // test_attendanceList();
    $("#attendance_user_course_list").find("tr:gt(0)").remove();

}


function test_attendanceList() {
    var list = Attendances_list;
    for (var i = 0; i < list.length; i++) {
        console.log("key " + list[i].key);
        for (var j in list[i].students) {
            console.log("key students " + j);
        }

    }
}


function test_userList(list) {
    for (var i = 0; i < list.length; i++) {
        console.log("key " + list[i].key);
        for (var j in list[i].attendances) {
            console.log("key attendances " + j);
        }
        for (var j in list[i].Courses) {
            console.log("key Courses " + j);
        }
    }
}

function test_courseList() {
    for (var i = 0; i < course_list.length; i++) {
        console.log("key " + course_list[i].key);
        for (var j in course_list[i].attendances) {
            console.log("key attendances " + j);
        }
        for (var j in course_list[i].students) {
            console.log("key students " + j);
        }
    }
}