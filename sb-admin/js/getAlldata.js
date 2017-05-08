console.log("getAllData.js begin");
var coursesRef = firebase.database().ref().child("Courses");
var usersRef = firebase.database().ref().child("Users");
var attendancesRef = firebase.database().ref().child("Attendances");
var albumsRef = firebase.database().ref().child("Album");

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
        "Courses": Courses,
        "ChName": snap.child("ChName").val(),
        "EngName": snap.child("EngName").val(),
        "address": snap.child("address").val(),
        "birthdate": snap.child("birthdate").val(),
        "career": snap.child("career").val(),
        "education": snap.child("education").val(),
        "isTutor": snap.child("isTutor").val(),
        "nation": snap.child("nation").val(),
        "registerDate": snap.child("registerDate").val(),
        "religion": snap.child("religion").val(),
        "sex": snap.child("sex").val(),
        "status": snap.child("status").val(),
        "tel": snap.child("tel").val(),
        "token": snap.child("token").val(),
        "urgentContactName": snap.child("urgentContactName").val(),
        "urgentTel": snap.child("urgentTel").val(),
   

    }

    user_list.push(new_data);
    var editUserButtonTag = '<button id="editUserBtn" type="button" class="btn btn-info" data-toggle="modal" data-target="#editUserModal">Edit</button>';
    var enrollButtionTag = '<button id="enrollBtn" type="button" class="btn btn-info"  data-toggle="modal" data-target="#enrollCoursesModal">Enroll</button>';
    var viewButtionTag = '<button id="viewBtn" type="button" class="btn btn-info">View</button>';
    var removeButtonTag = ' <button id="removeBtn" type="button" class="btn btn-danger  btn-circle"><i class="fa fa-times"></i></button>';
    var viewDetailButtionTag = '<button id="viewDetailBtn" type="button" class="btn btn-info" data-toggle="modal" data-target="#viewDetailModel">View</button>';


    attendanceTable.row.add([
        new_data.key,
        new_data.name,
        viewDetailButtionTag,
        viewButtionTag,
       
        editUserButtonTag,
        enrollButtionTag,
        removeButtonTag,

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







var Album_list = [];
albumsRef.on("child_added", snap => {
    console.log("albumsRef on");
    var coverageRef = snap.child("coverStorageRefChild").val();
    var dataString = snap.child("dateString").val();
    var name = snap.child("name").val();
    var imgRef = snap.child("storageRefChilds").val();
    console.log("name " + name);
    console.log("imgRef " ,imgRef);

    var new_data = {
        "key": snap.key,
        "students": students,
        "name": name,
        "startTime": startTime,
        "endTime": endTime
    }

    Album_list.push(new_data);

  
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