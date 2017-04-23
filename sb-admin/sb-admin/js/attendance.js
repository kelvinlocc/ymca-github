console.log("attendance.js begin!");

// var coursesRef = firebase.database().ref().child("Courses");

// var storage = firebase.storage();
// var storageRef = storage.ref();



$(document).ready(function () {

    $('#attendance_table tbody').on('click', 'button', function () {
        var data = attendanceTable.row($(this).parents('tr')).data();
        // var index = $(this).index(this);
        var index = attendanceTable.row($(this).parents('tr')).index();
        console.log("data index " + data.index);

        courseTable.clear().draw();
        display_all_courses(index);
        // alert("index " + index + " " + data[1] + " " + data[5]);
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
                    course_list[i].startdate,
                    course_list[i].endDate,
                    course_list[i].totalLessons,
                    course_list[i].totalStudents
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
            // var buttonTag = ' <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" id="viewBtn">view </button>';

            studentTable.row.add([
                userId,
                student_name,
                Courses_list,
                counter,
                imageTag
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