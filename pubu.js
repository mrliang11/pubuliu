// 请求方式：get
// 请求地址：getPics.php
// 传递参数：cpage=1
// 		传递1，代表获取第一页的数据，
// 		传递2，代表获取第二页的数据，以此类推

// 新浪微相册广场
// http://photo.weibo.com/welcome/hot?nologin=1


//会有缓存的 所以后台必须给过来的时候更新链接
// 想要数据加密，就要后台加密，前端负责存
// chorme 必须是http协议才能设置cookie
(function () {//封闭作用域
    var oLi = document.getElementsByTagName('li'),
        itemWidth = 200,//宽度要为固定的200，高度等比换算
        page = 1,
        flag = false;
        
    function getData() {//拿数据的函数
        if (!flag) {
            flag = true;
            ajaxFunc('GET', 'getPics.php', 'cpage=' + page, addDom, true);//这里执行了addDOM
            // 需要是字符串
            page++;
        }
    }
    getData();
    function addDom(data) {
        var dataList = JSON.parse(data);
        //    console.log(dataList);
        dataList.forEach(function (ele, index) {//图片还没加载完成就计算高度所以有的长，有的短
            var oItem = document.createElement('div'),
                oImg = new Image(),
                oP = document.createElement('p'),
                minIndex = getMinList(oLi),
                oBox = document.createElement('div');

            oItem.className = 'item';
            // 把图片区域给它空出来就行了
            oBox.className = 'box';
            // itemWidth/itemHeight = width/height;
            oImg.width = itemWidth;
            oImg.height = ele.height / ele.width * oImg.width;
            oImg.src = ele.preview;
            oP.innerText = ele.title;

            oImg.onerror = function(){
                this.style.margin = '-1px';
                this.style.width = '202px';
                this.style.height = ele.height / ele.width * oImg.width + 2 + 'px';
                // this.parentNode.parentNode.style.display = 'none';
            }
            
            oBox.appendChild(oImg);
            oItem.appendChild(oBox);
            oItem.appendChild(oP);
            // 然后将oItem插入到最短的li中
            oLi[minIndex].appendChild(oItem);
        })
        flag = false;//等全部循环完  dom加载完之后才可以在滚动渲染下一个页面
    }
    function getMinList(dom) {
        var minHeight = dom[0].offsetHeight,
            index = 0,
            i = 1;
        for (; i < dom.length; i++) {//但是是异步加载，没有加载完就获取到height，所以每次index不同
            var h = dom[i].offsetHeight;
            if (h < minHeight) {
                minHeight = h;
                index = i;
            }
        }
        return index;
    }
    window.onscroll = function () { //需要加锁 因为每往下滚一次 因为网速问题就会多加载一页 所以有可能一下加载多个页面
        var minValue = oLi[getMinList(oLi)].offsetHeight,
            //因为返回的是一个index 最短的li 获取最短的高度值
            scrollHeight = document.documentElement.scrollTop || document.body.scrollTop,
            //获取滚动条高度  做一个兼容处理 浏览器要么有前面一个要么有后面一个
            pageHeight = document.documentElement.clientHeight || document.body.clientHeight;
        if (minValue < scrollHeight + pageHeight) {
            //页面高度加上滚动条距离 如果大于最低的li的高度那么久滚动到空白区域了
            getData();//如果滚到了空白区域 开始渲染下面的图片
        }

    }
})()
// data.txt是一个假数据 调试的时候用它调试，因为如果请求加载过多有可能会报错(滚动多了，加载多了就会出错)
// 加载失败会有一个小边框  是chrome的问题 那么失败的图片放一个自定义的效果