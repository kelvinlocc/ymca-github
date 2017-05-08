var coursesRef = firebase.database().ref().child("Courses");

var storage = firebase.storage();
var storageRef = storage.ref();


var GlobalTableIndexClick;
var GlobalTableDataClick;

$(document).ready(function () {

    $('#dataTables-example tbody').on('click', '#viewBtn', function () {
        var data = courseTable.row($(this).parents('tr')).data();
        // var index = $(this).index(this);
        var index = courseTable.row($(this).parents('tr')).index();
        console.log("data[1] " + data[1]);
        //show_student(index);

        studentTableTitle.text("student in " + data[1]);

    });

    $('#dataTables-example tbody').on('click', '#filterBtn', function () {

         var data = courseTable.row($(this).parents('tr')).data();
        var index = courseTable.row($(this).parents('tr')).index();

        GlobalTableIndexClick = index;
        GlobalCourseNameClick = data[1];
        GlobalTableDataClick = data;
 
    });

    $("#addCourseBtn").click(function () {

        if ($('#course_name_addCourse').val() != null) {

                var imageTag = '<img src="' + globalImgSrc + '" width="100">';

           

            courseTable.row.add([
                "123456",
                $('#course_name_addCourse').val(),
                $('#start_date_addCourse').val(),
                $('#end_date_addCourse').val(),
                imageTag,
                $('#totalL_addCourse').val(),
                $('#totalS_addCourse').val(),
                viewButtionTag,
                filterButtionTag,
                removeButtonTag,
                editButtionTag
            ]).draw(false);
        }else{
            alert("please fill in the information");
        }
   
    });

    $("#doFilterBtn").click(function () {

        filter_student_1(20, GlobalTableDataClick);
        

    });


    courseTable.column(0).visible(false);

});

var globalImgSrc;
function previewFile() {
    console.log("previewFile");
    var preview = document.querySelector('img'); //selects the query named img
    // var preview =  $("#image_preview"); //selects the query named img
    file = document.querySelector('input[type=file]').files[0]; //sames as here
    reader = new FileReader();
    // console.log("file: " + file);

    reader.onloadend = function () {

        $("#image_preview").attr("src", reader.result);
        globalImgSrc = reader.result;
    }

    if (file) {
        reader.readAsDataURL(file); //reads the data as a URL
    } else {
        preview.src = "";
    }
    console.log("getImage();" + getImage());



}
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

function filter_student_1(number, data) {
    studentTable.clear().draw();
    //var courseName = "Chinese Calligraphy(EVENT123510)";
    //if (index == 0) {
    //    courseName = "Chinese Calligraphy(EVENT123510)"
    //} else {
    //    courseName = "Fan Dancing(EVENT551489)"

    //}
    var courseName = data[1];
    var totalLessons = parseInt(data[5]);
    var totalStudents = parseInt(data[6]);
    var number = totalLessons / 2;

    for (var index = 0; index < getRandomInt(1, totalStudents); index++) {
        var studentNID = "Student" + getRandomInt(100, 300) + "(MEM" + getRandomInt(100, 300) + ")";
        var att = getRandomInt(number, totalLessons);
        var attPrecentage = att / totalLessons*100
        studentTable.row.add([
            studentNID, courseName,
            att + "/" + totalLessons + " (" + attPrecentage.toFixed(1) + "%)"
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