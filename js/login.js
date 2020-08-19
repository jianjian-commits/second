import  "../js/jquery-2.1.4.js";
import  "../js/jquery.cookie.js";
(function(){

    //切换登入方式
    $(".title .zhanghao").click(function(){
        $(this).addClass("active");
        $(".saoma").removeClass("active");
        $(".con_tab .con1").removeClass("hidden");
        $(".con_tab .con2").addClass("hidden");
    })
    $(".title .saoma").click(function(){
        $(this).addClass("active");
        $(".zhanghao").removeClass("active");
        $(".con_tab .con2").removeClass("hidden");
        $(".con_tab .con1").addClass("hidden");
    })

    $(".con1 input").keydown(function(){
        $(".message").addClass("hidden");
    })
    let isYes = true; //记录是否都输入了
    $(".btn_login").click(function(){
        let passValue = $(".password").val();
        let userValue = $(".username").val();
        let msg = $(".message");
        if(!userValue && passValue){
            msg.removeClass("hidden");
            msg.css({"color": "#ff6700"}).html("× 请输入账户名");
            isYes = false;
        }
        if(userValue && !passValue){
            msg.removeClass("hidden");
            msg.css({"color": "#ff6700"}).html("× 请输入密码");
            isYes = false;
        }
        if(!userValue && !passValue){
            msg.removeClass("hidden");
            msg.css({"color": "#ff6700"}).html("× 请输入账号和密码");
            isYes = false;
        }
        if(isYes){
            $.ajax({
                url: "../php/register.php",
                dataType: "json",
                method: "post",
                data: {
                    "phone": userValue,
                    "password": passValue,
                    "type": "login",
                },
                success: data =>{
                    console.log(userValue)
                    console.log(passValue)
                   
                    if($.cookie("userInfo")){
                        $.cookie("userInfo", null);
                        $.cookie("userInfo", `[{"username": ${userValue},"password": "${passValue}"}]`, {
                            expires: 7,
                            raw: true,
                        })
                    }else{
                        $.cookie("userInfo", `[{"username": ${userValue},"password": "${passValue}"}]`, {
                            expires: 7,
                            raw: true,
                        })
                    }
                    if(data.err == 1){
                        msg.removeClass("hidden").css("color", "green").html(data.msg);
                        setTimeout(function(){
                            location.href = "./index.html";
                        }, 500)
                    }
                    if(data.err == -1){
                        msg.removeClass("hidden").css("color", "red").html(data.msg);
                    }
                },
                error: msg =>{
                    console.log(msg);
                }
            })
        }
    })


})()