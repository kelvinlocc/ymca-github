console.log("attendance.js begin!");

// var coursesRef = firebase.database().ref().child("Courses");

// var storage = firebase.storage();
// var storageRef = storage.ref();


var onClickTableIndex;
var onClickTableData;
var removeButtonTag = ' <button id="DropCourseBtn" type="button" class="btn btn-danger  btn-circle"><i class="fa fa-times"></i></button>';

$(document).ready(function () {

    $('#attendance_table tbody').on('click', '#viewBtn', function () {
        var data = attendanceTable.row($(this).parents('tr')).data();
        // var index = $(this).index(this);
        var index = attendanceTable.row($(this).parents('tr')).index();
        console.log("data index " + data.index);

        courseTable.clear().draw();
        display_all_courses(index);
        // alert("index " + index + " " + data[1] + " " + data[5]);
    });

    $('#attendance_table tbody').on('click', '#editUserBtn', function () {
        var data = attendanceTable.row($(this).parents('tr')).data();
        // var index = $(this).index(this);
        var index = attendanceTable.row($(this).parents('tr')).index();
        console.log("data index " + data.index);

        courseTable.clear().draw();
        display_all_courses(index);
        $('#student_id_editForm').val(data[0]);
        $('#student_name_editForm').val(data[1]);

        //assign to gobal data
        onClickTableIndex = index;
        onClickTableData = data;
        // alert("index " + index + " " + data[1] + " " + data[5]);
    });

    $("#updateUserBtn").click(function () {
        //alert("Handler for updateUserBtn .click() called.");
        if (onClickTableIndex != null && onClickTableData != null) {

            var myNewUserData = onClickTableData;
            myNewUserData[0] = $("#student_id_editForm").val();
            myNewUserData[1] = $('#student_name_editForm').val();
            //alert("$('#student_name_editForm').val()" + $('#student_name_editForm').val());
            attendanceTable.row(onClickTableIndex).data(myNewUserData).draw();



        } else {
            alert("error on table index");
        }
    });

    $('#attendance_table tbody').on('click', '#enrollBtn', function () {
        var data = attendanceTable.row($(this).parents('tr')).data();
        // var index = $(this).index(this);
        var index = attendanceTable.row($(this).parents('tr')).index();
        console.log("data[0]  " + data[0]);

        //courseTable.clear().draw();
        //$('#student_id_editForm2').val(data[0]);
        $('#student_name_editForm2').val(data[1]);
        display_all_courses(index);

        //assign to gobal data
        onClickTableIndex = index;
        onClickTableData = data;
        // alert("index " + index + " " + data[1] + " " + data[5]);
    });

    $("#EnrollCoursesBtn").click(function () {
        //alert("Handler for updateUserBtn .click() called.");
        if (onClickTableIndex != null && onClickTableData != null) {
            $('#Crd option:selected').text();
            var course_name = $('#Crd option:selected').text();
            courseTable.row.add([
                "EVENT123999",
                $('#enroll_course_selection option:selected').text(),
                "23 Mar 2017 8:0:0",
                "24 Mar 2017 4:0:0",
                "3",
                "2",
                removeButtonTag

            ]).draw(false);

        } else {
            alert("error on table index");
        }
    });

    $('#course_table tbody').on('click', '#DropCourseBtn', function () {
        var data = courseTable.row($(this).parents('tr')).data();
        // var index = $(this).index(this);
        var index = courseTable.row($(this).parents('tr')).index();
        console.log("data index " + data.index);

        if (confirm("are you sure to drop '" + data[1] + "'?")) {
            courseTable.row($(this).parents('tr')).remove().draw();
        } else {
            console.log("drop cancelled!");
        }
    });


});
var attendanceTable = $('#attendance_table').DataTable({
    responsive: true
});;
var courseTable = $('#course_table').DataTable({
    responsive: true
});;


function display_all_courses(index) {
    this_user = user_list[index];
    for (var course_id in user_list[index].Courses) {
        console.log("key Courses " + course_id);
        var data;
        for (var i = 0; i < course_list.length; i++) {
            console.log("key " + course_list[i].key);
            if (course_id == course_list[i].key) {
                // $("#attendance_user_course_list").append("<tr><td>" + course_id + "</td><td>" + course_list[i].name + "</td><td>" + course_list[i].startdate + "</td><td>" + course_list[i].endDate + "</td><<td> <img id='image_test'width='100'' src='" + course_list[i].storageRefChild + "'/> </td><td>" + course_list[i].totalLessons + "</td><td>" + course_list[i].totalStudents + "</td><td><button class='courses_list_row_view'>view</button></td></tr>");



                courseTable.row.add([
                    course_id,
                    course_list[i].name,
                    timeConverter(course_list[i].startdate),
                    timeConverter(course_list[i].endDate),
                    course_list[i].totalLessons,
                    course_list[i].totalStudents,
                    removeButtonTag

                ]).draw(false);





            }
        }

    }
}

function show_student(index) {
    console.log("show_student");
    //class_list[index]

    for (var student_id in class_list[index].students) {
        // alert(blogs[i]);
        var course_id = class_list[index].key;
        console.log("student_id " + student_id);
        console.log("student_id 2" + class_list[index].key);

        studentTable.clear().draw();
        add_student_table(student_id, class_list[index].attendances);
    }
    $("#table_class_list_student_list").show();


}


// var userId = firebase.auth().currentUser.uid;

//this function no use, use get_all_data.js
function add_student_table(userId, student_attend_list) {
    return firebase.database().ref('/Users/' + userId).once('value').then(function (snap) {
        // var username = snapshot.val().name;
        var student_name = snap.child("name").val();
        var attendances = snap.child("Attendances").val();
        var Courses = snap.child("Courses").val();
        var storageRefChild = snap.child("storageRefChild").val();
        var tangRef = storageRef.child(storageRefChild);

        console.log("my_test" + attendances);
        var counter = 0;

        var temp = [];
        for (var attendances_id in student_attend_list) {
            console.log("attendances " + attendances_id);
            temp.push(attendances_id);
        }

        for (var attendances_id in attendances) {
            // alert(blogs[i]);

            // student_attend_list.includes("");
            if (temp.includes(attendances_id)) {
                console.log("attendances match" + attendances_id);

                console.log("true");
                counter++;
            } else {
                console.log("false ");
            }
            console.log("my_test " + counter);

        }

        var Courses_list = "";
        var match_course_id = false;
        for (var key in Courses) {
            // alert(blogs[i]);

            console.log("my_test key" + key);
            Courses_list = Courses_list + key + ",";
        }
        console.log("my_test_key" + Courses_list);

        var reward_condition = $("#reward_condition").val();
        console.log("reward_condition" + reward_condition);
        tangRef.getDownloadURL().then(function (url) {
            console.log("get image!");
            console.log("get image! url: " + url);
            image_real_url = url;

            var imageTag = '<img src="' + image_real_url + '" width="100">';
            var testTag = '<button id="add_albums" type="button" class="btn btn-info btn-lg" data-toggle="modal" data-target="#addUserModal">Add User</button>';

            // var buttonTag = ' <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" id="viewBtn">view </button>';

            studentTable.row.add([
                userId,
                student_name,
                Courses_list,
                counter,
                imageTag,
                removeButtonTag,
                editUserButtonTag,
                
                // totalLessons,
                // totalStudents,
                // buttonTag
            ]).draw(false);


            if (reward_condition != "") {
                if (counter > reward_condition) {
                    $("#table_class_list_student_list").append("<tr><td>" + userId + "</td><td>" + student_name + "</td><td>" + Courses_list + "</td><td>" + counter + "</td><<td> <img id='image_test'width='100'' src='" + image_real_url + "'/> </td><td>" + +"</td><td>" + +"</td><td><button class='class_list_row_view'>view</button></td></tr>");
                }
            } else {
                $("#table_class_list_student_list").append("<tr><td>" + userId + "</td><td>" + student_name + "</td><td>" + Courses_list + "</td><td>" + counter + "</td><<td> <img id='image_test'width='100'' src='" + image_real_url + "'/> </td><td>" + +"</td><td>" + +"</td><td><button class='class_list_row_view'>view</button></td></tr>");

            }

        }).catch(function (error) {
            console.error(error);
        });



    });
}