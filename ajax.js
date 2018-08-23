function ajaxFunc(method,url,data,callback,flag){
    var xhr = null;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHttp');
    }
    if(method == 'GET'){
        xhr.open(method,url + '?' + data ,flag);
        xhr.send();
    }else if(method == 'POST'){
        xhr.open(method, url, flag);
        xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
        xhr.send(data);
    }
    // xhr.open('GET', './getNews.php?username=aimee&age=18', true);
    // xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                // console.log(JSON.parse(xhr.responseText));//字符串格式 用JSON.parse()转换成json格式
                callback(xhr.responseText);
            }
        }
    }
}
