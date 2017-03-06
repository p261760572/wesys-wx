function login() {
    var fm = $('#login-fm');
    var btn = $('#login-btn');
    var data = fm.serializeObject();

    $$.request('/action/user/ms/login', data, function(data) {
        //success
        window.location.href = 'index.html';
    }, function(data) {
        //error
    });

    window.location.href = 'index.html';
}


$(function() {
    //回车事件
    $(document).keydown(function(event) {
        if (event.keyCode == 13) {
            var jq = $('#login-fm').find(':focus');
            if (jq.length > 0) {
                $('#login-btn').click();
            }
        }
    });
});
