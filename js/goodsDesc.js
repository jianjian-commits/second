define(["jquery", "swiper", "jquery-cookie"], function($, Swiper){
    
    //滑入所有商品显示子菜单
    function allGoodsHover(){
        $(".topbar_nav .nav-category").mouseenter(function(){
            $(".category_menu").show().find(".category_list").css({
                "height": "418",
                "border": "1px solid #ff6700",
                "background": "#fff",
            }).find("a").css({
                "color": "#424242",
                "transition": "none",
            });
        })
        $(".topbar_nav .nav-category").mouseleave(function(){
            $(".category_menu").hide().find("a").css({
                "color": "#424242",
                "transition": "none",
            });
        })
    }

    //给侧边栏添加鼠标移入移除事件
    function sideHover(){
        $(".category_list").on("mouseenter", ".category-item", function(){
            $(this).addClass("category_list_bg").find("a").css("color","#fff");
            $(this).children(".category_children").show();
        })
        $(".category_list").on("mouseleave", ".category-item", function(){
            $(this).removeClass("category_list_bg").find("a").css("color","#424242");
            $(this).children(".category_children").hide();
        })
    }

    //Swiper轮播图
    function swiper(){
        var mySwiper = new Swiper ('.swiper-container', {
            direction: 'horizontal', // 垂直切换选项
            loop: true, // 循环模式选项
            effect : 'fade',//切换效果
            speed:500,
            autoplay:true,//等同于以下设置
            autoplay : {
              delay:2000
            },
            // 如果需要分页器
            pagination: {
                el: '.swiper-pagination',
                
                clickable :true,
                bulletClass : 'my-bullet',//需设置.my-bullet样式+
                bulletActiveClass: 'my-bullet-active',
            },
            
            // 如果需要前进后退按钮
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            
            
        })     
        //鼠标覆盖停止自动切换
        mySwiper.el.onmouseover = function(){
            mySwiper.autoplay.stop();
        }
        
        //鼠标离开开始自动切换
        mySwiper.el.onmouseout = function(){
            mySwiper.autoplay.start();
        } 
    }

    //获取地址栏的中的id值与数据进行对比
    function getID(){
        let url = location.href;
        let index = url.indexOf("?");
        //拿到商品的ID
        var id = url.substr(index + 1,).split("=")[1];
        console.log(url.substr(index + 1,).split("=")[1]);
        //把拿到的商品ID和数据进行对比取出对应的数据进行展示
        $.ajax({
            url: "../data/goodsDec.json",
            type: "get",
            dataType: "json",
            success: data =>{
                console.log(data);
                for(let i = 0; i < data.length; i++){
                    if(id == data[i].product_id){
                        let dom = $(`
                            <div class="img-box">
                                <div class="swiper-container">
                                    <div class="swiper-wrapper">
                                        
                                    </div>
                                    <div class="swiper-pagination" style="display: ${data[i].images.length == 1 ? "none" : "block"}"></div>          
                
                                    <div class="swiper-button-prev" style="display: ${data[i].images.length == 1 ? "none" : "block"}"></div>
                                    <div class="swiper-button-next" style="display: ${data[i].images.length == 1 ? "none" : "block"}"></div>
                                </div>
                            </div>
                            <div class="product-con">
                                <h2 class="title">${data[i].name}</h2>
                                <p class="sale-desc">${data[i].product_desc_ext}</p>
                                <p class="company-info">小米自营</p>
                                <p class="price-info"><span>${data[i].name}</span></p>
                                <div class="line"></div>
                                <div class="subscribe-info">
                                    <div class="left">
                                        <span class="name">热卖中</span>
                                        <span class="price"><em>￥</em>${data[i].price_max}</span>
                                    </div>
                                    <div class="right">
                                        <div class="time-box">
                                            <span class="tips">距结束</span>
                                            <span class="time">
                                                <span data-v-c6210cf2="" class="hour"> 14</span>:
                                                <span data-v-c6210cf2="" class="minite">07</span>:
                                                <span data-v-c6210cf2="" class="second">07</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div class="selected-list">
                                    <li>${data[i].title} ${data[i].value}<span>${data[i].price_max}元</span></li>
                                    <div class="total-price">总计：${data[i].price_max}</div>
                                </div>
                                <div class="btn-box">
                                    <div class="sale-btn">
                                        <a class="buy_btn" id=${data[i].product_id} href="javascript:;">
                                            立即购买
                                        </a>
                                    </div>
                                    <div class="favorite-btn">
                                        <a href="./goodsCar.html">
                                            <i>查看购物车</i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        `).appendTo(".product-show .product-container");
                        for(let j = 0; j < data[i].images.length; j++){
                            $(`
                                <div class="swiper-slide">
                                    <img src="${data[i].images[j]}" alt="">
                                </div>
                            `).appendTo(dom.find(".swiper-wrapper"));
                        }
                    }
                }
                swiper();
            },
            error: msg =>{
                console.log(msg);
            }
        })
    }

    // 点击加入购物车提示成功加入购物车并且存到cookie中
    function buy(){
        $(".product-container").on("click", ".buy_btn", function(){
            //取下商品的ID
            var id = this.id;
            alert("成功加入购物车");
            //判断cookie是否存在
            var isYes = $.cookie("goods") == null ? true : false;
            if(isYes){
                $.cookie("goods", `[{"id": ${id}, "num": 1}]`, {
                    expires: 7,
                    raw: true,
                })
            }else{
                var hasSame = false; //假设没有同类商品
                var cookieStr = $.cookie("goods");
                var cookieArr = JSON.parse(cookieStr);
                // cookieArr.forEach(element => {
                //     if(id == element.id){
                //         element.num++;
                //         hasSame = true;
                //         break;
                //     }
                // });
                for(var i = 0; i < cookieArr.length; i++){
                    if(cookieArr[i].id == id){
                        cookieArr[i].num++;
                        hasSame = true;
                        break;
                    }
                }
                if(!hasSame){
                    var obj = {"id": id, "num": 1};
                    cookieArr.push(obj);
                }
                $.cookie("goods", JSON.stringify(cookieArr), {
                    expires: 7,
                    raw: true,
                })
            }
        })
    }


    return{
        allGoodsHover,
        sideHover,
        getID,
        buy
    }
    
})