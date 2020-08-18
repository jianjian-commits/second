import "./jquery-2.1.4.js";
import "./jquery.cookie.js";

//logo图标切换
(function(){
    tabLogo();
    //头部logo
    function tabLogo(){
        $(".header_l a").hover(function(){
            $(this).find("p").stop(true).animate({
                left: 0
            }, "fast", "swing")
        }, function(){
            $(this).find("p").stop(true).animate({
                left: -48
            }, "fast", "swing")
        })
    }


   loading();
   function loading(){
        $(".list_body").empty();
        $(".other_list .recommend-list").empty();
       if($.cookie("goods")){
            var arr1;
            $.ajax({
                url:"../data/goodsList.json",
                dataType: "json",
                type: "get",
                async: false, //使ajax为同步代码
                success: data =>{
                    arr1 = data;
                },
                error: msg =>{
                    console.log(msg);
                }
            })
    
            //拿到购物车列表的数据和商品列表的数据合并在一个数组
            var a = otherGoods();
            var conArr = arr1.concat(a);
            console.log(conArr)
            var cookieStr = $.cookie("goods");
            var cookieArr = JSON.parse(cookieStr);
            var newArr = [];//用来接收加入购物车的数据
            for(var i = 0; i < conArr.length; i++){
                for(var j = 0; j < cookieArr.length; j++){
                    if(cookieArr[j].id == conArr[i].product_id){
                        conArr[i].num = cookieArr[j].num;
                        newArr.push(conArr[i]);
                    }
                }
            }
            for(var i = 0; i < newArr.length; i++){
                $(`
                    <div class="item-box" id="${newArr[i].product_id}">
                        <div class="col col-check">
                            <i class="checkbox check-select">√</i>
                        </div>
                        <div class="col col-img">
                            <a href="javascript:;">
                                <img src="${newArr[i].image}" alt="">
                            </a>
                        </div>
                        <div class="col col-name">
                            <h3 class="name">
                                <a href="javascript:;">
                                    ${newArr[i].name}
                                </a>
                            </h3>
                        </div>
                        <div class="col col-price">${newArr[i].price}元</div>
                        <div class="col num col-num">
                            <div class="change_num">
                                <a href="javascript:;">-</a><input type="text" value="${newArr[i].num}" class="goods-num" autocomplete="off"><a href="javascript:;">+</a>
                            </div>
                        </div>
                        <div class="col col-total">${newArr[i].price * newArr[i].num}元</div>
                        <div class="col col-action">
                            <a href="javascript:;" class="del">×</a>
                        </div>
                    </div> 
                `).appendTo(".list_body");
            }
            sum();
            btnEve();
       }else{
            otherGoods()
       }
    }

    select();
    //单选全选
    function select(){
   
        $(".list_body").on("click", ".checkbox", function(){
            var isAll = true;
            $(this).toggleClass("check-select");
            console.log($(".list_body .checkbox").length);
            $(".list_body .checkbox").each(function(index, element){
                if(!$(element).hasClass("check-select")){
                    $(".list_header .checkbox").removeClass("check-select");
                    isAll = false;
                    return;
                }
            })
            console.log(isAll)
            if(isAll){
                $(".list_header .checkbox").addClass("check-select");
            }
            sum();
        })
        //全选
        $(".list_header .check-select").click(function(){
            $(this).toggleClass("check-select");
            if(this.classList.contains("check-select")){
                $(".list_body .checkbox").each(function(index,element){
                    $(element).addClass("check-select");
                })
            }else{
                $(".list_body .checkbox").each(function(index,element){
                    $(element).removeClass("check-select");
                })
            }
            sum();
        })

    }


    //计算总价格 选中商品数 总商品数
    function sum(){
        var total = 0;
        var select_total = 0;
        var sum_price = 0;
        $(".list_body .item-box .goods-num").each(function(index, element){
            total += parseInt($(this).val());
        })
        $(".cart_bar .sum_num").html(`${total}`);

        $(".list_body .item-box").each(function(index, element){
            if($(this).find(".checkbox")[0].classList.contains("check-select")){
                select_total += parseInt($(this).find(".goods-num").val());
                var str = $(this).find(".col-total").html();
                sum_price += parseFloat(str);
            }
        })
        $(".cart_bar .selec_num").html(`${select_total}`);
        $(".cart_bar .sum_price").html(`${sum_price}`);
    }

    //给加减按钮添加事件
    function btnEve(){
        $(".list_body .change_num").on("click", "a", function(){
            var parentDom = $(this).siblings(".goods-num");
            if($(this).html() == "-"){
                parentDom[0].value--;
                if(parentDom[0].value < 1){
                    alert("亲，不能再减了，请删除商品");
                    parentDom[0].value = 1;
                }
                
            }
            if($(this).html() == "+"){
                parentDom[0].value++;
            }
            //存入cookie中
            let cookieStr = $.cookie("goods");
            let cookieArr = JSON.parse(cookieStr);
            let id = parentDom.closest(".item-box").attr("id");
            $(cookieArr).each(function(index, element){
                if(id == cookieArr[index].id){
                    cookieArr[index].num = parentDom.val();
                }
            })
            $.cookie("goods", JSON.stringify(cookieArr), {
                expires: 7,
                raw: true
            })

            loading();
        })
    }


    ipt();
    //输入框的内容
    function ipt(){      
        $(".list_body").on("blur", ".goods-num", function(){
            var value = $(this).val();
            if(value > 0){
                //存入cookie中
                var cookieStr = $.cookie("goods");
                var cookieArr = JSON.parse(cookieStr);
                var id = $(this).closest(".item-box").attr("id");
                $(cookieArr).each(function(index, element){
                    if(id == cookieArr[index].id){
                        cookieArr[index].num = value;
                        $.cookie("goods", JSON.stringify(cookieArr), {
                            expires: 7,
                            raw: true
                        })
                    }
                })
                loading();
            }else{
                alert("请输入正确的数量");
                $(this).val(1);
            }

        })
    }

    
    //加载购物车页面的推荐商品
    function otherGoods(){
        var arr;
        $.ajax({
            url: "../data/goodsCar.json",
            dataType: "json",
            type: "get",
            async:false,
            success: data =>{
                arr = data.data;
                $(arr).each(function(index, element){
                    $(`
                    <li>
                        <a href="javascript:;">
                            <img src="${arr[index].image}" alt="">
                            <div class="recommend-name">${arr[index].name}</div>
                            <div class="recommend-price">${arr[index].price}元</div>
                            <div class="recommend-tips">${arr[index].comments}人好评</div>
                        </a>
                        <div class="recommend-action">
                            <a href="javascript:;" class="btn_small" id=${arr[index].product_id}>加入购物车</a>
                        </div>
                    </li>
                    `).appendTo(".other_list .recommend-list");
                })
                
            },
            error: msg =>{
                console.log(msg);
            },
        })
        return arr;
    }

    joinCar();
    //给推荐商品加入购物车添加事件
    function joinCar(){
        $(".recommend-list").on("click", ".btn_small", function(){
            //取下商品的ID
            var id = this.id;
            console.log(id)
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
           loading();
        })
    }

    //点击删除按钮实现删除功能
    removeGood();
    function removeGood(){
        $(".list_body").on("click", ".del", function(){
           console.log( confirm("您确定要删除该商品嘛？"));
            let parDom = $(this).closest(".item-box");
            parDom.remove();
            //清楚cookie中对应的
            let id = parDom.attr("id");
            console.log(id)
            var cookieStr = $.cookie("goods");
            var cookieArr = JSON.parse(cookieStr);
            console.log(cookieArr)
            for(var i = 0; i < cookieArr.length; i++){
                if(cookieArr[i].id == id){
                    cookieArr.splice(i,1);
                    break;
                }
            }
            if(!cookieArr.length){
                $.cookie("goods", null);
            }else{
                $.cookie("goods", JSON.stringify(cookieArr), {
                    expires: 7,
                    raw: true,
                })
            }
            sum();
        })
    }
})()











