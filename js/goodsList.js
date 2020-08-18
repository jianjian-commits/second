define(["jquery"], function($){

    $.ajax({
        url: "../data/goodsList.json",
        type: "get",
        dataType: "json",
        success: data =>{
            console.log(data);
            for(let j = 0; j < data.length; j++){
                if(j < 4){
                    $(`<div class="list-box">
                            <div class="list-banner" style="display: ${j == 0 ? 'block' : 'none'}">
                                <a href="javascript:;"><img src="../images/listImg/list_1.jpg" alt=""></a>
                            </div>

                            <div class="con_box">
                                <div class="item">
                                    <div class="img-box float_left">
                                        <a href="./goodsDec.html?product_id=${data[j].product_id}"><img src="${data[j].image}" alt=""></a>
                                    </div>
                                    <div class="item-con float_right">
                                             <a class="title" href="">${data[j].name}</a>
                                        <p class="desc">${data[j].desc}</p>
                                        <p class="price">
                                            <sup>￥</sup><span>${data[j].price}<em>起</em></span>
                                        </p>
                                        <a class="btn_buy" target="_blank" href="./goodsDec.html?product_id=${data[j].product_id}">立即购买</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).appendTo($(".app"))
                }
                if(j < 10 && j >= 4){
                    if(j % 2 == 0){
                        var dom =  $(`
                            <div class="list-box">
                                <div class="list-banner" style="display: ${j == 4 ? 'block' : 'none'}">
                                    <a href="javascript:;"><img src="../images/listImg/list_2.jpg" alt=""></a>
                                </div>
                                <div class="con_box2 clear_fix">
                                    
                                </div>
                            </div>
                        `)
                        dom.appendTo($(".app"))
                    }
                    $(`
                        <li class="item1 item-left float_left">
                            <a class="s_img" href="./goodsDec.html?product_id=${data[j].product_id}"><img src="${data[j].image}" alt=""></a>
                            <div class="item-con">
                                <div class="con-l">
                                    <a href="">${data[j].name}</a>
                                    <p class="desc">${data[j].desc}</p>
                                </div>
                                <div class="con-r">
                                    <p class="price">
                                        <sup>￥</sup><span>${data[j].price}</span>
                                    </p>
                                    <a target="_blank" href="./goodsDec.html?product_id=${data[j].product_id}" class="btn_buy">立即购买</a>
                                </div>
                            </div>
                        </li>
                    `).appendTo(dom.find(".con_box2"))
                } 
                if(j >= 10){
                    $(`<div class="list-box">
                            <div class="con_box">
                                <div class="item">
                                    <div class="img-box float_left">
                                        <a href="./goodsDec.html?product_id=${data[j].product_id}"><img src="${data[j].image}" alt=""></a>
                                    </div>
                                    <div class="item-con float_right">
                                                <a class="title" href="">${data[j].name}</a>
                                        <p class="desc">${data[j].desc}</p>
                                        <p class="price">
                                            <sup>￥</sup><span>${data[j].price}<em>起</em></span>
                                        </p>
                                        <a target="_blank" class="btn_buy" href="./goodsDec.html?product_id=${data[j].product_id}">立即购买</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).appendTo($(".app"))
                }
            }
        },
        error: msg =>{
            console.log(msg);
        }
    })

    

})