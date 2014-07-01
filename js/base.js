var remoteTime;
var appKey = "bb118380";
var appSecret = "24d7e1f13ee40713cb4a98986a20f3a8";
var appToken;
var paramSeparator = "?";
var user;
var md5 = function (source) {
    return $().crypt({
        method: "md5",
        source: source
    })
};
var sha1 = function (source) {
    return $().crypt({
        method: "sha1",
        source: source
    })
};
if (navigator.appName.indexOf("Internet Explorer") > 0) {
    alert(navigator.appName);
    paramSeparator = "#";
}
user = localStorage.getItem("user");
if(user ==null || user == undefined)
{
    user = {
        "uid":"",
        "uname":"",
        "ucode":""
    }
}else{
    user= $.parseJSON(user);
}
$(function(){
$("#toolbar").offset({
    top:window.innerHeight - $("#toolbar").innerHeight()
});
    if(user.uid != null && user.uid !=undefined && user.uid !="")$("#user_info_toolbar").html("<a onclick=\"localStorage.removeItem(\'user\');location.reload();\">[Log Out]</a>")
});
function getTime(callback) {
    $.getJSON("http://trow.cc/api/stats/time", null, function (json) {
        remoteTime = json.data.time;
        appToken = calcAppToken();
        callback();
    })
}

function getTopics(fid, page, callback) {
    getTime(function () {
        $.getJSON("http://trow.cc/api/topics/list", {
            "t": remoteTime,
            "apptoken": appToken,
            "appkey": appKey,
            "fid": fid,
            "start": page * 100,
            "uid":user.uid,
            "utoken":user.utoken
        }, function (json) {
            if(json.visitor!=user.uid)show_user_login();
            callback(json);
        }).fail(function (jqxhr) {
            alert(jqxhr.responseText);
        });
    });
}
function getForums(fid, page, callback) {
    if (fid == 0 || fid == null || fid == "") {
        getTime(function () {
            $.getJSON("http://trow.cc/api/forums/list", {
                "t": remoteTime,
                "apptoken": appToken,
                "appkey": appKey,
                "start": page * 100,
                "uid":user.uid,
                "utoken":user.utoken
            }, function (json) {
                if(json.visitor!=user.uid)show_user_login();
                callback(json);
            }).fail(function (jqxhr) {
                alert(jqxhr.responseText);
            });
        });
    } else {
        getTime(function () {
            $.getJSON("http://trow.cc/api/forums/list", {
                "t": remoteTime,
                "apptoken": appToken,
                "appkey": appKey,
                "fid": fid,
                "start": page * 100,
                "uid":user.uid,
                "utoken":user.utoken
            }, function (json) {
                if(json.visitor!=user.uid)show_user_login();
                callback(json);
            }).fail(function (jqxhr) {
                alert(jqxhr.responseText);
            });
        });
    }
}
function calcAppToken() {
    return md5(appKey + sha1(appSecret + remoteTime));
}
function pageWrite(thispage, allpages) {
    var htmlStr = "";
    for (var pageOffset = 0; pageOffset <= allpages; pageOffset++) {
        if (pageOffset == thispage) {
            htmlStr += "第" + (pageOffset + 1 ) + "页&nbsp;";
        } else {
            htmlStr += "<a class=\"page\" href=\"" + paramSeparator + "tid=" + get_param("tid") + "&page=" + pageOffset + "\" onclick=\"if(paramSeparator==\"#\")location.reload();\">第" + (pageOffset + 1) + "页</a>&nbsp;";

        }
    }
    $("#pageControl").html(htmlStr);
    $("#pageControl_bottom").html(htmlStr);
}
function openClose(id) {
    var obj = "";
    if (document.getElementById)
        obj = document.getElementById(id).style; else if (document.all)
        obj = document.all[id]; else if (document.layers)
        obj = document.layers[id]; else
        return 1;
    if (obj.display == "")
        obj.display = "none"; else if (obj.display != "none")
        obj.display = "none"; else
        obj.display = "block";
}

function getTopic(tid, page, callback) {
    getTime(function () {
        $.getJSON("http://trow.cc/api/topics/show", {
            "t": remoteTime,
            "apptoken": appToken,
            "appkey": appKey,
            "tid": tid,
            "start": page * 15,
            "uid":user.uid,
            "utoken":user.utoken
        }, function (json) {
            if (json.data.moved_to) {
                //alert("moved");
                if(json.visitor!=user.uid)show_user_login();
                window.location.href = "topicView.html" + paramSeparator + "tid=" + json.data.moved_to;
                if (paramSeparator == "#")location.reload();
            }
            callback(json);
        }).fail(function (jqxhr) {
            alert(jqxhr.responseText);
        });
    });
}

function get_param(param) {
    if (navigator.appName.indexOf("Internet Explorer") > 0) {
        return get_param_wp(param);
    }
    var search = window.location.search.substring(1);
    var compareKeyValuePair = function (pair) {
        var key_value = pair.split('=');
        var decodedKey = decodeURIComponent(key_value[0]);
        var decodedValue = decodeURIComponent(key_value[1]);
        if (decodedKey == param) return decodedValue;
        return null;
    };

    var comparisonResult = null;

    if (search.indexOf('&') > -1) {
        var params = search.split('&');
        for (var i = 0; i < params.length; i++) {
            comparisonResult = compareKeyValuePair(params[i]);
            if (comparisonResult !== null) {
                break;
            }
        }
    } else {
        comparisonResult = compareKeyValuePair(search);
    }

    return comparisonResult;
}


function get_param_wp(param) {
    var search = window.location.hash.substring(1);
    var compareKeyValuePair = function (pair) {
        var key_value = pair.split('=');
        var decodedKey = decodeURIComponent(key_value[0]);
        var decodedValue = decodeURIComponent(key_value[1]);
        if (decodedKey == param) return decodedValue;
        return null;
    };

    var comparisonResult = null;

    if (search.indexOf('&') > -1) {
        var params = search.split('&');
        for (var i = 0; i < params.length; i++) {
            comparisonResult = compareKeyValuePair(params[i]);
            if (comparisonResult !== null) {
                break;
            }
        }
    } else {
        comparisonResult = compareKeyValuePair(search);
    }

    return comparisonResult;
}
function show_user_login() {
    $("#user_info_toolbar").html("<a href=\"login.html\">[Log In]</a>")
}
function login(username, ucode, callback) {
    getTime(function () {
        $.post("http://trow.cc/api/users/login", {
            "t": remoteTime,
            "apptoken": appToken,
            "appkey": appKey,
            "uname": username,
            "ucode": ucode
        }, function (data, textStatus) {
            if (data.code == 42) {
                user = {
                    uid: data.data.uid,
                    user: username,
                    utoken: data.data.utoken
                };
                localStorage.setItem("user", JSON.stringify(user));
            }
            callback(data);
        }, "json");
    });
}