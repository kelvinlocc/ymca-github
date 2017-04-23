

var removeButtonTag = ' <button id="removeBtn" type="button" class="btn btn-danger  btn-circle"><i class="fa fa-times"></i></button>';
var viewButtionTag = '<button id="viewBtn" type="button" class="btn btn-info">View Detail</button>';
var editButtionTag = '<button id="editBtn" type="button" class="btn btn-info">edit</button>';
var filterButtionTag = '<button id="filterBtn" type="button" class="btn btn-info">filter</button>';

function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
    return time;
}