console.log("模块加载成功");
require.config({
    baseUrl: "../js",
    paths: {
        "jquery": "jquery-2.1.4",
        "jquery-cookie": "jquery.cookie",
        "index": "index",
    },
    shim: {
        "jquery-cookie": ["jquery"],
    }
})

require(["index"], function(index){
    index.tabLogo();
    index.searchKey();
    index.loadTopbar();
    index.topNavTab();
    index.lunbotu();
    index.sideLoading();
    index.sideHover();
    index.slideLoading();
    index.xmsgBanner();
    index.daojishi();
    index.phoneData();
    index.main_tab();
    index.weixinHover();
    index.bar_msg();
    index.pullInfo();
})

