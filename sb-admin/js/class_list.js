var coursesRef = firebase.database().ref().child("Courses");

var storage = firebase.storage();
var storageRef = storage.ref();



$(document).ready(function () {

    $('#dataTables-example tbody').on('click', '#viewBtn', function () {
        var data = courseTable.row($(this).parents('tr')).data();
        // var index = $(this).index(this);
        var index = courseTable.row($(this).parents('tr')).index();
        console.log("data index " + data.index);
        show_student(index);

        studentTableTitle.text("student in " + data[1]);
        // alert("button!");

        // alert("index " + index + " " + data[1] + " " + data[5]);
    });

    $('#dataTables-example tbody').on('click', '#filterBtn', function () {

        // var data = courseTable.row($(this).parents('tr')).data();
        // // var index = $(this).index(this);
        var index = courseTable.row($(this).parents('tr')).index();
        // console.log("data index " + data.index);
        // show_student(index);
                     //alert("index " + index);

        // studentTableTitle.text("student in " + data[1]);
        // alert("filter!");
        console.log("$('#filterStudents').val():  " + $('#filterStudents').val());
        if ($('#filterValue').val() != "" && $('#filterValue').val() != null) {
            alert("filterValue " + $('#filterValue').val());

            filter_student_1($('#filterStudents').val(), index);
        } else {
            filter_student_1(20, index);

            alert("filter value is empty!");

        }
    });

 


    courseTable.column(0).visible(false);

});
var courseTable = $('#dataTables-example').DataTable({
    responsive: true
});;
var studentTable = $('#student_table').DataTable({
    responsive: true
});;

var class_list = [];

var studentTableTitle = $('#studentTableTitle');

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

    class_list.push(new_data);

    tangRef.getDownloadURL().then(function (url) {
        console.log("get image!");
        // document.getElementById("image_preview").src = url; //
        console.log("get image! url: " + url);
        image_real_url = url;
        var imageTag = '<img src="' + image_real_url + '" width="100">';

        courseTable.row.add([
            snap.key,
            name,
            timeConverter(endDate),
            timeConverter(startdate),
            imageTag,
            totalLessons + "0",
            totalStudents + "0",
            viewButtionTag,
            filterButtionTag,
            removeButtonTag,
            editButtionTag
        ]).draw(false);




        //show next table
        $('#table_class_list').off().on('click', '.class_list_row_view', function () {
            var $row = $(this).closest('tr');
            console.log("index: " + $(this).index(this));
            var index = $(this).index(this);
            var $columns = $row.find('td');
            var once = 0;
            $columns.addClass('row-highlight');
            $.each($columns, function (i, item) {
                // values = values + 'td' + (i + 1) + ':' + item.innerHTML + '<br/>';
                // console.log("counter " + counter);
                if (once == 0) {
                    console.log("item.innerHTML: i" + item.innerHTML + " i " + i);
                    reset_class_list_student_table();
                    show_student(index);
                    // if (confirm("you sure to remove record: " + item.innerHTML + " ? ")) {
                    //     console.log("user confirmed!");
                    //     remove(item.innerHTML);
                    // } else {
                    //     console.log("user not confirmed!");
                    // }
                }
                once++;
            });
        });
    }).catch(function (error) {
        console.error(error);
    });



});

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function filter_student_1(number, index) {
    studentTable.clear().draw();
    var courseName = "Chinese Calligraphy(EVENT123510)";
    if (index == 0) {
        courseName = "Chinese Calligraphy(EVENT123510)"
    } else {
        courseName = "Fan Dancing(EVENT551489)"

    }
    for (var index = 0; index < getRandomInt(1, 20); index++) {
        var studentNID = "Student" + getRandomInt(100, 300) + "(MEM" + getRandomInt(100, 300) + ")";
        studentTable.row.add([
            studentNID, courseName,
            getRandomInt(number, 30)+"/30"
        ]).draw(false);

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
        add_student_table_fake(student_id, class_list[index].attendances);
    }
    $("#table_class_list_student_list").show();
}




// var userId = firebase.auth().currentUser.uid;

function add_student_table_fake(userId, student_attend_list) {
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
        var courseKey = "";

        for (var key in Courses) {
            // alert(blogs[i]);

            console.log("my_test key" + key);
            // Courses_list = Courses_list + key + ",";
            if (key == "EVENT123510") {
                courseKey = courseKey + "Chinese Calligraphy(" + key + "), ";
            } else {
                courseKey = courseKey + "Fan Dancing(" + key + "), ";
            }
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

                student_name + "(" + userId + ")",
                courseKey,
                counter,
                // imageTag
                // totalLessons,
                // totalStudents,
                // buttonTag
            ]).draw(false);


            // if (reward_condition != "") {
            //     if (counter > reward_condition) {
            //         $("#table_class_list_student_list").append("<tr><td>" + userId + "</td><td>" + student_name + "</td><td>" + Courses_list + "</td><td>" + counter + "</td><<td> <img id='image_test'width='100'' src='" + image_real_url + "'/> </td><td>" + +"</td><td>" + +"</td><td><button class='class_list_row_view'>view</button></td></tr>");
            //     }
            // } else {
            //     $("#table_class_list_student_list").append("<tr><td>" + userId + "</td><td>" + student_name + "</td><td>" + Courses_list + "</td><td>" + counter + "</td><<td> <img id='image_test'width='100'' src='" + image_real_url + "'/> </td><td>" + +"</td><td>" + +"</td><td><button class='class_list_row_view'>view</button></td></tr>");

            // }

        }).catch(function (error) {
            console.error(error);
        });



    });
}

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

                student_name + "(" + userId + ")",
                Courses_list,
                counter,
                imageTag
                // totalLessons,
                // totalStudents,
                // buttonTag
            ]).draw(false);


            // if (reward_condition != "") {
            //     if (counter > reward_condition) {
            //         $("#table_class_list_student_list").append("<tr><td>" + userId + "</td><td>" + student_name + "</td><td>" + Courses_list + "</td><td>" + counter + "</td><<td> <img id='image_test'width='100'' src='" + image_real_url + "'/> </td><td>" + +"</td><td>" + +"</td><td><button class='class_list_row_view'>view</button></td></tr>");
            //     }
            // } else {
            //     $("#table_class_list_student_list").append("<tr><td>" + userId + "</td><td>" + student_name + "</td><td>" + Courses_list + "</td><td>" + counter + "</td><<td> <img id='image_test'width='100'' src='" + image_real_url + "'/> </td><td>" + +"</td><td>" + +"</td><td><button class='class_list_row_view'>view</button></td></tr>");

            // }

        }).catch(function (error) {
            console.error(error);
        });



    });
}

function reset_class_list_student_table() {
    $("#table_class_list_student_list").find("tr:gt(0)").remove();
}