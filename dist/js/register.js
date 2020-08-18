import  "../js/jquery-2.1.4.js";

(function register(){

    //登录第一个页面验证手机
    let isYes = false;
    let tel = null;
    $(".zhuce_1 .tel").blur(function(){
        tel = $(this).val();
        let reg = /^(13|15|17|18)\d{9}$/;
        if(tel == ""){
            $(".zhuce_1 .user_msg").removeClass("hidden");
            $(".zhuce_1 .user_msg span").html("请输入手机号码");
            isYes = false;
        }else if(reg.test(tel)){
            $(".zhuce_1 .user_msg").addClass("hidden");
            isYes = true;
        }else{
            $(".zhuce_1 .user_msg").removeClass("hidden");
            $(".zhuce_1 .user_msg span").html("请输入正确的手机");
            isYes = false;
        }
    })

    $(".zhuce_1 .tel").keydown(function(){
        $(".zhuce_1 .user_msg").addClass("hidden");

    })
    $(".zhuce_1 .btn_register").click(function(){
        console.log(tel)

        if(isYes){
            /* setTimeout(() =>{
                $(this).closest(".zhuce_1").addClass("hidden");
                $(".zhuce_2 .phone em").html(tel);
                $(".zhuce_2").removeClass("hidden");
            },300) */
            $.ajax({
                url: "../php/register.php",
                type: "post",
                dataType: "json",
                data: {
                    "phone": tel,
                    "type": "check",
                },
                success: (data) =>{
                    console.log(data)
                    if(data.err == 2){
                        $(".zhuce_1 .user_msg").removeClass("hidden");
                        $(".zhuce_1 .user_msg span").html(data.msg);
                    }else{
                        setTimeout(() =>{
                            $(this).closest(".zhuce_1").addClass("hidden");
                            $(".zhuce_2 .phone em").html(tel);
                            $(".zhuce_2").removeClass("hidden");
                        },300)
                    }
                },
                error: (msg) =>{
                    console.log(msg);
                }
            })
        }
    })

        


    //登录第二个页面验证密码

    let isTrue = false;
    let sum = 0;
    let reg1 = /\d{1,}/;
    let reg2 = /[a-z]{1,}/g;
    let reg3 = /[^\[a-z0-9\]]/g;
    let reg4 = /^.{8,16}$/;
    let password  = null;
    let checkPass = null;
    $(".zhuce_2 .password").blur(function(){
        password = $(this).val();
        if(password == ""){
            return false;
        }
        if(reg1.test(password)){
            sum++;
        }
        if(reg2.test(password)){
            sum++;
        }
        if(reg3.test(password)){
            sum++;
        }
        if(sum < 2 || !reg4.test(password)){
            $(".zhuce_2 .check_msg").html("× 密码长度8~16位,数字、字母、字符至少包含两种").css("color","#ff7d00");  
            isTrue = false;
        }else{
            $(".zhuce_2 .check_msg").html("√ 密码可以使用").css("color","green");  
            isTrue = true;
        }
        
    })
    $(".zhuce_2 .checkPass").blur(function(){
        checkPass =  $(this).val();
        if($(this).val() === password){
            $(".zhuce_2 .check_msg").html("√ 密码可以使用").css("color","green");  
            isTrue = true;
        }else{
            $(".zhuce_2 .check_msg").html("× 两次密码不一致").css("color","#ff7d00");  
            isTrue = true;
        }
    })

    $(".zhuce_2 .sub_btn").click(function(){
        $(".password").val("");
        $(".checkPass").val("");
        $(".zhuce_2 .check_msg").html("密码长度8~16位,数字、字母、字符至少包含两种").css("color","#707076");
        if(isTrue && isYes){
            $.ajax({
                url: "../php/register.php",
                type: "post",
                dataType: "json",
                data: {
                    "phone": tel,
                    "password": password,
                    "type": "add",
                },
                success: data =>{
                    console.log(data)
                    if(data.err == 5){
                        $(".zhuce_2 .check_msg").removeClass("hidden").html(data.msg);
                    }else{
                        setTimeout(() =>{
                            $(this).closest(".zhuce_2").addClass("hidden");
                            $(".zhuce_3 .id").html(tel);
                            $(".zhuce_3").removeClass("hidden");
                        },300)
                    }
                },
                error: msg =>{
                    console.log(msg);
                }
            })
        }
    })

    $(".login_btn").click(function(){
        location.href = "./login.html";
    })
})()




