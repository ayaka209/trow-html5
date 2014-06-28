var remoteTime;
var appKey = "bb118380";
var appSecret = "24d7e1f13ee40713cb4a98986a20f3a8";
var appToken;
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
            "start": page * 100
        }, function (json) {
            callback(json);
        }).fail(function (jqxhr) {
            alert(jqxhr.responseText);
        });
    });
}
function getForums(fid, page, callback) {
    if(fid==0 || fid==null || fid==""){
    getTime(function () {
        $.getJSON("http://trow.cc/api/forums/list", {
            "t": remoteTime,
            "apptoken": appToken,
            "appkey": appKey,
            "start": page * 100
        }, function (json) {
            callback(json);
        }).fail(function (jqxhr) {
            alert(jqxhr.responseText);
        });
    });}else{
        getTime(function () {
            $.getJSON("http://trow.cc/api/forums/list", {
                "t": remoteTime,
                "apptoken": appToken,
                "appkey": appKey,
                "fid": fid,
                "start": page * 100
            }, function (json) {
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
            htmlStr += "<a href=\"#tid=" + get_param_wp("tid") + "&page=" + pageOffset + "\" onclick=\"location.reload();\">第" + (pageOffset + 1) + "页</a>&nbsp;";
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
            "start": page * 15
        }, function (json) {
            if (json.data.moved_to) {
                //alert("moved");
                window.location.href = "topicView.html#tid=" + json.data.moved_to;
                location.reload();
            }
            callback(json);
        }).fail(function (jqxhr) {
            alert(jqxhr.responseText);
        });
    });
}

function get_param(param) {
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