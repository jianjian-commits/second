<?php
    header("Content-Type: text/html; charset=utf-8");

    $phone = $_POST["phone"];
    $type = $_POST["type"];
    $pass = $_POST["password"];

    $link = mysqli_connect("localhost", "root", "root", "student");
    if(!$link){
        echo '{"error:" 0, "msg": "数据库连接失败"}';
        die();
    }
    mysqli_set_charset($link,"utf8");

    if ($type === 'login') {
        $login_sql = "select * from xiaomi where phone='$phone' and password='$pass'";
        $login_res = mysqli_query($link,$login_sql);
        $login_arr = mysqli_fetch_all($login_res);
        if (count($login_arr) > 0) {
            echo '{"err":1,"msg":"√ 登录成功"}';
        } else {
             echo '{"err":-1,"msg":"× 账号或密码错误"}';
        }
     }

    if($type === "check"){
        $add_sql = "select * from xiaomi where phone='$phone'";
        $add_res = mysqli_query($link,$add_sql);
        $add_arr = mysqli_fetch_all($add_res);
        if (count($add_arr) > 0) {
            echo '{"err":2,"msg":"用户名已被占用"}';
        }else{
            echo '{"err":3,"msg":"用户名可以使用"}';
        }
        
    }
    if($type === "add"){
        $insert_sql = "insert into xiaomi(phone,password) values('$phone','$pass')";
        mysqli_query($link,$insert_sql);
        $num = mysqli_affected_rows($link);//返回受影响条数
        if ($num > 0) {
            echo '{"err":4,"msg":"注册成功"}';
        } else {
            echo '{"err":5,"msg":"注册失败"}';
        }   
    }

    mysqli_close($link);
?>