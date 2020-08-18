console.log("模块加载成功");

require.config({
    baseUrl: "../js",
    paths: {
        "jquery": "jquery-2.1.4",
        "jquery-cookie": "jquery.cookie",
        "swiper": "swiper",
        "index": "index",
        "goodsDesc": "goodsDesc",
    },
    shim: {
        "jquery-cookie": ["jquery"],
        "swiper": ["jquery"],
    }
})

require(["index", "goodsDesc"], function(index, goodsDesc){

    index.searchKey();
    index.loadTopbar();
    index.topNavTab();
    index.sideLoading();
    index.slideLoading();
    index.weixinHover();
    index.bar_msg();

    goodsDesc.allGoodsHover();
    goodsDesc.sideHover();
    goodsDesc.getID();
    goodsDesc.buy();
})

