
define(["jquery", "jquery-cookie"], function($){

    //判断cookie中有没有用户信息，有就显示出来
    function pullInfo(){
        if($.cookie("userInfo")){
            let cookieStr = $.cookie("userInfo");
            let cookieArr = JSON.parse(cookieStr);
            $(".login").addClass("hidden");
            $(".register").addClass("hidden");
            $(".username").css("float", "left").removeClass("hidden").html(`欢迎您! ${cookieArr[0].username}`);
        }else{
            $(".login").removeClass("hidden");
            $(".register").removeClass("hidden");
            $(".username").addClass("hidden");
        }
    }
    
    //logo图标切换
    function tabLogo(){
        $("#topbar .topbar_logo a").hover(function(){
            $(this).find("p").stop(true).animate({
                left: 0
            }, "fast", "swing")
        }, function(){
            $(this).find("p").stop(true).animate({
                left: -55
            }, "fast", "swing")
        })
    }

    //百度关键字搜索框
    /* 节流操作 */
    function searchKey(){
        $("#search").focus(function(){
            $(this).css("border", "1px solid #ff6700");
            $("#submit").css("border", "1px solid #ff6700");
            $(".search_list").addClass("show");
        });
        var lastTime,timer;
        $("#search").on("input",function(){
            var nowTime = Date.now();// 当前的时间
            if (lastTime && (nowTime - lastTime) < 1000) {
                clearTimeout(timer);
                timer = setTimeout(function (){
                    lastTime = Date.now();
                    loadData();
                },1000)
            } else {
                lastTime = nowTime;
                loadData();
            }
        });
        function loadData(){
            $.ajax({
                url: "http://suggestion.baidu.com/su",
                menthod: "get",
                data: 'wd=' + $("#search").val(),
                dataType: "jsonp",
                jsonp: "cb",
                success: data =>{
                    var searchStr = "";
                    for(var i = 0; i < data.s.length; i++){
                        $(".search_list").empty();
                        searchStr+= `
                            <li>
                                <a href="http://www.baidu.com">${data.s[i]}</a>
                            </li>
                        `
                    }
                    $(".search_list").html(searchStr);
                }
            })
        }

        //点击除了输入框和列表项外清除列表项
        $(document).click(function(e){
            if(e.target !== $("#search")[0] && e.target !== $(".search_list li")[0]){
                $("#search").css("border", "1px solid #e0e0e0");
                $("#submit").css("border", "1px solid #e0e0e0");
                $(".search_list").removeClass("show");
            }
        })
        


    }

    //点击列表导航加载并弹出对应的子菜单
    function loadTopbar(){

        //先创建列表导航栏
        $.ajax({
            url: "../data/nav.json",
            dataType: "json",
            success: data =>{
                var topNavArr = data.topNav;
                topNavArr.push({title: "服务"}, {title: "社区"});
        
                for(var i = 0; i < topNavArr.length; i++){
                    $(`
                        <li class="nav-item">
                            <a class="" href="javascript:;">
                                <span class="text">${topNavArr[i].title}</span>
                            </a>
                        </li>
                    `).appendTo(".nav_list");

                    
                    var node = $(`
                    <div class="children_box clear_fix" style = "display: ${i == 0 ? 'block' : 'none'}">
                        
                    </div>
                    `);

                    node.appendTo(".children_container");

                    if(topNavArr[i].childs){
                        var childsArr = topNavArr[i].childs;
                        for(var j = 0; j < childsArr.length; j++){
                            $(`
                                <li id="${childsArr[j].id}">
                                    <a href="javascript:;">
                                        <div class = 'figure'>
                                            <img src="${childsArr[j].img}" alt=""/>
                                        </div>
                                        <div class = 'title'>${childsArr[j].a}</div>
                                        <p class = 'price'>${childsArr[j].i}</p>
                                    </a>
                                </li>
                            `).appendTo(node);
                            $(".children_box").eq(j).find("li").eq(0).addClass("first");
                        }
                    }
                } 
            },
            error: msg =>{
                console.log(msg);
            }
        })
    }
    
    // 给顶部导航添加移入移出效果
    function topNavTab(){
        $(".topbar_nav .nav_list").on("mouseenter", ".nav-item", function(){
            var index = $(this).index() - 1;
            if(index >= 0 && index <= 6){
                $(".children_container").find(".children_box").eq(index).css({display: "block"}).siblings(".children_box").css({display: "none"});
                $(".children_list").css({"border-top": "1px solid #e0e0e0"}).stop(true).slideDown();
  
            }
        })
        $("#topbar").mouseleave(function(){
        
            $(".children_list").css({"border-top": "none"}).stop(true).slideUp();
    })

    }

    //轮播图
    function lunbotu(){
        var showIndex = 0;
        var prevIndex = 0;
        var flag = false;
        var aImgs = null;
        var aBtns = null;
        var myTimer = null;
        if(!aImgs){
            aImgs = $(".banner_box").find("a");
        }
       
        if(!aBtns){
            aBtns = $(".cirecle_box").find("a");
        }
        
        autoPlay("right")
        //自动播放轮播图
        function autoPlay(direc){
            clearInterval(myTimer);
            myTimer = setInterval(function(){
                if(direc == "right"){
                    showIndex++;
                    if(showIndex > aBtns.length - 1){
                        showIndex = 0;
                    }
                }
                if(direc == "left"){
                    showIndex--;
                    if(showIndex < 0){
                        showIndex = 4;
                    }
                }
                tab();
            }, 4000)
        }

        function tab(){
            aBtns.eq(prevIndex).removeClass("circle_active");
            aImgs.eq(prevIndex).stop(true).animate({"opacity": 0},1000);
            aBtns.eq(showIndex).addClass("circle_active");
            aImgs.eq(showIndex).stop(true).animate({"opacity": 1},1000);
            prevIndex = showIndex;
        }

        // 鼠标移入移出时停止和继续播放
        $(".banner-wrap, .banner_l, .banner_r, .cirecle_box").mouseenter(function(){
            clearInterval(myTimer);
        })
        $(".banner-wrap, .banner_l, .banner_r").mouseleave(function(){
            if(!flag){
                autoPlay("right");
            }else{
                autoPlay("left");
            }
            
        })

       // 点击圆圈切换对应图片
        $(".cirecle_box").on("click", "li", function(){
            clearInterval(myTimer);
            showIndex = $(this).index();
            tab();
            /* return false;  *///因为圆圈是a有默认事件，return false阻止默认事件
            if(flag){
                autoPlay("left");
            }else{
                autoPlay("right");
            }
        })

        // //点击左右箭头切换图片 
        $(".banner_l").click(function(){
            clearInterval(myTimer);
            showIndex--;
            if(showIndex < 0){
                showIndex = aBtns.length - 1;
            }
            tab();
            flag = true;
            autoPlay("left");
        })
        $(".banner_r").click(function(){
            clearInterval(myTimer);
            showIndex++;
            if(showIndex > aBtns.length - 1){
                showIndex = 0;
            }
            tab();
            flag = false;
            autoPlay("right");
        })
    }

    //加载侧边栏
    function sideLoading(){
        $.ajax({
            url: "../data/nav.json",
            dataType: "json",
            success: data =>{
                var data = data.sideNav;
                for(var i = 0; i < data.length; i ++){
                   var parNode = $(`
                    <li class = "category-item">
                        <a href="../html/index.html" class = 'title'>
                            ${data[i].title}
                            <em>></em>
                        </a>
                        <div class="category_children clearfix" style = 'display: none'>
                           
                        </div>
                    </li>
                    `)
                    parNode.appendTo($(".category_list"))
                    
                    var childData = data[i].child;
                    var col = Math.ceil(childData.length / 6);

                    for(var j = 0; j < childData.length; j++){
                        if(j % 6 == 0){
                            var node = $(`
                                <ul class="children-list">
                                </ul>
                            `)
                            node.appendTo(parNode.find(".category_children"));
                        }
                        $(`
                            <li>
                                <a href="javascipt:;">
                                    <img src="${childData[j].img}" width="40" height="40" alt="" class="thumb">
                                    <span class="text">${childData[j].title}</span>
                                </a>
                            </li>
                        `).appendTo(node);
                    }
                }
            }
            
        })
    }

    //给侧边栏添加鼠标移入移除事件
    function sideHover(){
        $(".category_list").on("mouseenter", ".category-item", function(){
            $(this).addClass("category_list_bg");
            /* let index =  $(".category-item").index(this); */
            $(this).children(".category_children").show();
        })
        $(".category_list").on("mouseleave", ".category-item", function(){
            $(this).removeClass("category_list_bg");
            /* let index =  $(".category-item").index(this); */
            $(this).children(".category_children").hide();
        })
    }
    
    //加载小米闪购数据
    function slideLoading(){
        $.ajax({
            url: "../data/slide.json",
            dataType: "json",
            success: data =>{
                var arr = data.data.list.list;
                var listStr = "";
                for(var i = 0; i < arr.length; i++){
                    listStr +=`
                        <li class="li_item" id="${arr[i].goods_id}">
                            <a href="javascript:;">
                                <div class="content">
                                    <div class="thumb"><img src="${arr[i].pc_img}" alt=""></div>
                                    <h3 class="title">${arr[i].goods_name}</h3>
                                    <p class="desc">${arr[i].desc}</p>
                                    <p class="price">
                                        <span>${arr[i].seckill_Price}元</span>
                                        <del>${arr[i].goods_price}元</del>
                                    </p>
                                </div>
                            </a>
                        </li>
                    `
                }
                
                
                $(".shopp_banner").html(listStr);
                $(".shopp_banner li").each(function(index, elem){
                    $(".shopp_banner li").eq(index).css("border-top", `1px solid ${randomColor()}`);
                })
                $(".shopp_banner li:nth-child(4n)").css("margin", 0);
                //得到一共多少组
                counts = Math.ceil($(".shopp_banner li").length / 4);
                let list_width = parseInt($(".shopp_banner").css("width")) * counts;
                $(".shopp_banner").css("width", list_width);

            
            }
        })
  
    }

    //随机颜色
    function randomColor(){
        var str = "#";
        for(let i = 0; i < 6; i++){
            str+= parseInt(Math.random() * 16).toString(16).toUpperCase();
        }
        return str;
    }
    
    //小米闪购轮播图
    function xmsgBanner(){

      
        var showIndex = 0;
        var myTimer = null;
        /* 因为我们需要让图片四个为一组滚动，json数据中只有26个数据 */
        var count = Math.ceil(26 / 4) - 1;
        var aSpans = $(".shopping_btn").find("span");
        autoPlay("right");
        function autoPlay(dire){
            clearInterval(myTimer);
            myTimer = setInterval(function(){
                if(dire === "right"){
                    showIndex++;
                    if(showIndex == count){
                        $(".shopp_list ul").eq(0).animate({
                            left: showIndex * -978 + 489,
                        })
                    }else if(showIndex > count){
                        showIndex = 0;
                        $(".shopp_list ul").eq(0).animate({
                            left: showIndex * -978 ,
                        })
                    }else{
                        $(".shopp_list ul").eq(0).animate({
                            left: showIndex * -978 ,
                        })
                    }
                }
            },2000)
        }
        //鼠标移入移出大盒子
        $(".shopp_list ul").mouseenter(function(){
            clearInterval(myTimer);
        })
        $(".shopp_list ul").mouseleave(function(){
            autoPlay("right");
        })

        //鼠标移入移出箭头
        aSpans.mouseenter(function(){
            clearInterval(myTimer);
        })
        aSpans.mouseleave(function(){
            autoPlay("right");
        })

        //点击左右箭头按钮切换图
        aSpans.click(function(){
            clearInterval(myTimer);
            if($(this).index() == 0){ 
                showIndex--;
                showIndex = Math.max(0, showIndex);
                $(".shopp_list ul").eq(0).animate({
                    left: showIndex * -978 ,
                })
            }
            if($(this).index() == 1){
                showIndex++;
                showIndex = Math.min(showIndex, count);
                if(showIndex == count){
                    $(".shopp_list ul").eq(0).animate({
                        left: showIndex * -978 + 489,
                    })
                }else{
                    $(".shopp_list ul").eq(0).animate({
                        left: showIndex * -978 ,
                    })
                }
            }
        })
            

    }

    //小米闪购倒计时
    function daojishi(){
        
        function timer(){
            var d1 = new Date("2020/8/12");
            let d = new Date();
            let resHour = d1.getHours();
            resHour = doubleNum(resHour)
            let resMin = d1.getMinutes();
            resMin = doubleNum(resMin)
            let diffMinSecs = d1.getTime() - d.getTime();
            let hours = parseInt(diffMinSecs / 1000 / 3600);
            hours = doubleNum(hours);
            let min = parseInt(diffMinSecs % (1000 * 3600) / (1000 * 60));
            min = doubleNum(min);
            let sec = parseInt(diffMinSecs % (1000 * 60) / 1000);
            sec = doubleNum(sec);
            $(".round").html(`${resHour}:${resMin}场`);
            $(".timer").find("span").eq(0).html( `${hours}`);
            $(".timer").find("span").eq(1).html( `${min}`);
            $(".timer").find("span").eq(2).html( `${sec}`);
            $(".shopp_ms .desc").html("本场活动结束倒计时");
            if(diffMinSecs <= 0){
                clearInterval(timer);
                $(".shopp_ms .desc").html("本场已结束");
                $(".timer").find("span").eq(0).html( `00`);
            $(".timer").find("span").eq(1).html( `00`);
            $(".timer").find("span").eq(2).html( `00`);
            }
        }

        function doubleNum(str){
            if(str <= 9){
                str = `0${str}`;
            }
            return str;
        }

        setInterval(function(){
    
            timer()
            
        },1000)
    }
    

    //加载主商品数据
    var video_arr = null;
    function phoneData(){
        $.ajax({
            url: "../data/data.json",
            dataType: "json",
            async: false,
            success: data =>{
                var allArr = data;
                var arr = data[0].childs
                //加载手机栏数据
                $(`
                    <div class="first_box">
                        <div class="first_box_hd">
                            <h2 class="title">${data[0].title}</h2>
                            <div class="more">
                                <a href="./goodsList.html">
                                    查看全部
                                    <i>></i>
                                </a>
                            </div>
                        </div>
                        <div class="first_box_bd clear_fix">
                            <div class="first_l float_left">
                                <a href="javascript:;">
                                    <img src="${data[0].img}" alt="">
                                </a>
                            </div>
                            <ul class="first_list float_left">
                                
                            </ul>                        
                        </div>
                    </div>
                `).appendTo($(".mainGoods-wrap"));

                for(var i = 0; i < arr.length; i++){
                    
                    $(`
                        <li class="flo">
                            <a target="_blank" href="./goodsList.html">
                                <div class="figure">
                                    <img src="${arr[i].img}" alt="">
                                </div>
                                <h3 class="title">${arr[i].title}</h3>
                                <p class="desc">${arr[i].desc}</p>
                                <p class="price">
                                    <span class="nowPrice">${arr[i].price}元起</span>
                                    ${arr[i].del == 0 ? "" : '<del class="delPrice">' + arr[i].del + '元</del>'}
                                </p>
                            </a>
                        </li>
                    `).appendTo($(".first_list"));
                }

                //加载其他栏
                for(var i = 1; i < allArr.length; i++){
                    var str1 = $(`
                        <div class="banner-box">
                            <a href="javascript:;">
                                <img src="${allArr[i].topImg}" alt="">
                            </a>
                        </div>

                        <div class="main_list">
                            <div class="main_top">
                                <h2 class="title">${allArr[i].title}</h2>
                                <ul class="tab_list">
                                    <li class="tab_active">热门</li>
                                    <li>${allArr[i].subTitle}</li>
                                </ul>
                            </div>

                            <div class="list_box clear_fix">
                                <div class="list_box_l float_left">
                                    <ul>
                                        <li>
                                            <a href="javascript:;">
                                                <img src="${allArr[i].leftChilds[0]}" alt="">
                                            </a>
                                        </li>
                                        <li>
                                            <a href="javascript:;">
                                                <img src="${allArr[i].leftChilds[1]}" alt="">
                                            </a>
                                        </li>
                                    </ul>
                                </div>

                                <div class="list_box_r float_left clear_fix">
                                    <ul class="ul1 clear_fix">

                                    </ul>

                                    <ul class="ul2 clear_fix hidden">
                                    
                                    </ul>   
                                </div>
                            </div>
                        </div>
                    `)
                    str1.appendTo(".mainGoods-wrap")
                    for(var j = 0; j < allArr[i].hotChilds.length; j++){
                        $(`
                            <li class="${j == 7 ? 'flo spe_li' : 'flo'}">
                                <a target="_blank" href="./goodsList.html">
                                    <div class="figure">
                                        <img src="${allArr[i].hotChilds[j].img}" alt="">
                                    </div>
                                    <h3 class="title">${allArr[i].hotChilds[j].title}</h3>
                                    
                                    <p class="${j == 7 ? 'desc hidden' : 'desc'}">${allArr[i].hotChilds[j].desc}</p>
                                    <p class="price">
                                        <span class="nowPrice">${allArr[i].hotChilds[j].price}元</span>
                                        ${allArr[i].hotChilds[j].del == 0 ? "" : '<del class="delPrice">' + allArr[i].hotChilds[j].del + '元</del>'}
                                    </p>
                                </a>
                            </li>
                        `).appendTo(str1.find(".ul1").eq(0));
                    }
                    $(`
                        <li class="lanlan_more flo">
                            <a href="./goodsList.html">
                                <div class="figure">
                                    <img class"imgmore" src="../images/indexImg/xm_more_03.jpg" alt="">
                                </div>
                                <p class="more">
                                    
                                    浏览更多<br>
                                    <span>${allArr[i].subTitle}</span>
                                </p>
                            </a>
                        </li>
                    `).appendTo(str1.find(".ul1").eq(0));
                    for(var j = 0; j < allArr[i].childs.length; j++){
                        $(`
                            <li class="${j == 7 ? 'flo spe_li' : 'flo'}" id="${allArr[i].childs[j].id}">
                                <a target="_blank" href="./goodsDec.html?id=${allArr[i].childs[j].id}">
                                    <div class="figure">
                                        <img src="${allArr[i].childs[j].img}" alt="">
                                    </div>
                                    <h3 class="title">${allArr[i].childs[j].title}</h3>
                                    <p class="${j == 7 ? 'desc hidden' : 'desc'}">${allArr[i].childs[j].desc}</p>
                                    <p class="price">
                                        <span class="nowPrice">${allArr[i].childs[j].price}元</span>
                                        ${allArr[i].hotChilds[j].del == 0 ? "" : '<del class="delPrice">' + allArr[i].hotChilds[j].del + '元</del>'}
                                    </p>
                                </a>
                            </li>
                        `).appendTo(str1.find(".ul2").eq(0));
                    }
                    $(`
                        <li class="lanlan_more flo">
                            <a href="./goodsList.html">
                                <div class="figure">
                                    <img class"imgmore" src="../images/indexImg/xm_more_03.jpg" alt="">
                                </div>
                                <p class="more">
                                    浏览更多<br>
                                    <span>${allArr[i].subTitle}</span>
                                </p>
                            </a>
                        </li>
                    `).appendTo(str1.find(".ul2").eq(0));

                    
                }
                var dom = $(`
                    <div class="banner-box">
                        <a href="javascript:;">
                            <img src="../images/indexImg/xm_topbanner.webp" alt="">
                        </a>
                    </div>
                    <div class="first_box">
                    <div class="first_box_hd">
                        <h2 class="title">视频</h2>
                        <div class="more">
                            <a href="./goodsList.html">
                                查看全部
                                <i>></i>
                            </a>
                        </div>
                    </div>
                    <div class="vedio_box">
                        <ul>
                            
                        </ul>
                    </div>
                `).appendTo(".mainGoods-wrap");
            }
        })
      
        $.ajax({
            url: "../data/video.json",
            dataType: "json",
            menthod: "get",
            async: false,
            beforeSend: (xml) =>{
                $(".vedio-box").find(".loading").removeClass("hidden");
            },
            success: data =>{
                video_arr = data;
                $(data).each(function(index, element){
                    $(`
                        <li class="flo video-item">
                            <a href="javascript:;">
                                <div class="vedio_img">
                                    <img src="${data[index].img}" alt="">
                                    <span class="play">
                                        <i class="icon-play">▲</i>
                                    </span>
                                </div>
                                <p class="vedio_tit">
                                    ${data[index].title}
                                </p>
                                <p class="vedio_desc" style="opacity: ${data[index].name ? "1" :"0"} ">
                                    ${data[index].name}
                                </p>
                            </a>
                        </li>  
                    `).appendTo($(".vedio_box").find("ul"))
                })
            },
            complete: (xhr) =>{
                $(".vedio-box").find(".loading").addClass("hidden");
            },
            error: msg =>{
                console.log(msg);
            }
        })
    }

    //给视频添加点击事件
    $(".mainGoods-wrap").on("click", ".video-item", function(){
        //拿到我点击的按钮所在的li的下标用来确定加载哪个视频
        let index = $(this).index();
        $(".vedio-box").find("video").attr("src", video_arr[index].vedio);
        $(".vedio-box").find(".mi-header").find("span").html(video_arr[index].title);
        $("#miPlayerVideo")[0].play();
        $(".mi-popup").removeClass("hidden");
    })

    //给视频上的关闭按钮添加关闭功能
    $(".mi-popup").on("click", ".mi-btn", function(){
        $(this).closest(".mi-wrap").addClass("hidden");
        $("#miPlayerVideo")[0].pause();
    })

    //给主商品添加划入切换效果
    function main_tab(){
        $(".mainGoods-wrap").on("mouseenter", ".tab_list li", function(){
            if($(this).index() == 0){
                $(this).addClass("tab_active").siblings().removeClass("tab_active");
                $(this).closest(".main_list").find(".ul1").eq(0).removeClass("hidden");
                $(this).closest(".main_list").find(".ul2").eq(0).addClass("hidden");
            }
            if($(this).index() == 1){
                $(this).addClass("tab_active").siblings().removeClass("tab_active");
                $(this).closest(".main_list").find(".ul1").eq(0).addClass("hidden");
                $(this).closest(".main_list").find(".ul2").eq(0).removeClass("hidden");
            }
        })
    }

    //划过微信显示图片
    function weixinHover(){
        $(".wx").eq(0).hover(function(){
            $(this).siblings("img").css("display", "block");
        }, function(){
            $(this).siblings("img").css("display", "none");
        })
    }


    //侧边信息栏 
    function bar_msg(){
        $(".home-tool-bar .ico .first").css("opacity",1);
        $(".home-tool-bar a").hover(function(){
           $(this).find("span").css("color", "#ff6700")
           $(this).css("color", "#ff6700").find(".first").siblings("img").css("opacity",1);
        }, function(){
            $(this).find("span").css("color", "#757575")
            $(this).find(".first").siblings("img").css("opacity",0);
        })
        $(".home-tool-bar .go_top").click(function(){
            $("html,body").animate({
                scrollTop: 0
            });
        })
        $(window).scroll(function(){
            if($("html,body").scrollTop() > 400){
                $(".home-tool-bar .go_top").css("opacity", 1);
            }else{
                $(".home-tool-bar .go_top").css("opacity", 0);
            }
        } );
    }

    return{
        tabLogo,
        searchKey,
        loadTopbar,
        topNavTab,
        lunbotu,
        sideLoading,
        sideHover,
        slideLoading,
        xmsgBanner,
        daojishi,
        phoneData,
        main_tab,
        weixinHover,
        bar_msg,
        pullInfo,
    }

})