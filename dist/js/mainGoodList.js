console.log("模块加载成功");

require.config({
    baseUrl: "../js",
    paths: {
        "jquery": "jquery-2.1.4",
        "jquery-cookie": "jquery.cookie",
        "index": "index",
        "goodsList": "goodsList",
    },
    shim: {
        "jquery-cookie": ["jquery"],
    }
})

require(["index", "goodsList"], function(index, goodsList){

    index.searchKey();
    index.loadTopbar();
    index.topNavTab();
    index.sideLoading();
    index.slideLoading();
    index.weixinHover();
    index.bar_msg();
    index.pullInfo();
})

