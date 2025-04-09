;
var KEWLApp = require('./lib/kewl.js');

var UA = window.navigator.userAgent,
    IsAndroid = /Android|HTC/i.test(UA),
    IsIPad = !IsAndroid && /iPad/i.test(UA),
    IsIPhone = !IsAndroid && /iPod|iPhone/i.test(UA),
    isMac = navigator.userAgent.indexOf("Mac OS X") > 0,
    isAndroid = /Android/i.test(navigator.userAgent),
    isWeixin = /MicroMessenger/i.test(navigator.userAgent),
    IsIOS = (IsIPhone || IsIPad),
    isIOSMac = (IsIPhone || IsIPad || isMac),
    isAndroid = /Android/i.test(navigator.userAgent),
    IOSLINK = 'https://app.appsflyer.com/id1089836344?pid=Activity&c=Emoji_Challenge',
    ARDLINK = 'https://play.google.com/store/apps/details?id=com.cmcm.live&referrer=utm_source%3D340006';

(function () {
    var page = {
        apiUrl: 'https://live.ksmobile.net',
        //                apiUrl: 'http://login.feature.qa.live.ksmobile.net',
        shareConf: {
            "url": location.origin + location.pathname + location.search,
            "title": "VIP Party", //I18N REPALCE
            "desc": "VIP Party: Meet up YouTubers with Live.me!",
            "img": "http://www.liveme.com/images/logo.jpg",
            "downloadTip": "Download Live.me to watch live video streamings.",
            "cancel": "CANCEL",
            "go": "GO"
        },

        //页面初始化方法
        init: function () {
            var self = this;
            if (KEWLApp.isKEWLApp && ((IsIOS && KEWLApp.getVerCode() >= 10400000) || (IsAndroid && typeof window.android === 'object' && window.android.hasOwnProperty('getUserInfo')))) {
                KEWLApp.getUserInfo(function (data) {
                    self.userInfo = typeof data === 'string' && data !== 'null' && data !== '' ? JSON.parse(data) : data;
                    if (typeof userInfo == 'object' && userInfo.userId && userInfo.token && userInfo.deviceId) {
                        self.isLogin = true;
                        self.loginInfo = userInfo;
                        self.userInfo = userInfo;
                    }
                    self.initData();
                });

            } else {
                self.initData();
            }


        },
        //页面数据初始化入口
        initData: function () {
            this.getLangConf();
        },
        
        getLangConf: function () {
            var self = this;
            self.initFooter();
            self.bindEvent(); //绑定事件  事件代理方式
            setTimeout(function () {
                $('#loading').hide();
            }, 700);
        },
         
        initFooter: function () {
            var self = this;
            if (self.userInfo) {
                self.setShareHtml();
            } else {
                var html = $('#footerTemplate').template({
                    footerDesc: "Social Live Video Streaming",
                    footerDown: "&nbsp; JOIN &nbsp;"
                });
                $('body').append(html);
                $('.wrap').css("paddingBottom", '1.5rem');
                if (isIOSMac) {
                    $('.footer a').attr('href', IOSLINK);
                } else {
                    $('.footer a').attr('href', ARDLINK);
                }
            }
        },

        getQueryString: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            } else {
                return '';
            }
        },

        /*
         * @desc  下载提示   下载提示信息和按钮文字从shareConf获取
         **/
        downloadTip: function () {
            UI.confirm(this.shareConf.downloadTip, function () {
                if (isIOSMac) {
                    window.location.href = IOSLINK;
                } else {
                    window.location.href = ARDLINK;
                }
            }, function () {}, [{
                type: 'cancel',
                text: this.shareConf.cancel,
                style: ''
            }, {
                type: 'sure',
                text: this.shareConf.go,
                style: ''
            }]);
        },

        //设置页面底部分享栏
        setShareHtml: function () {
            var html = '',
                url = window.location.origin + window.location.pathname;
            html += '<span class="bottom-bar"><a href="';

            html += '" class="logo"></a><a href="javascript:;" class="share"></a></span>';

            html += '<div class="layer"><div class="layer-box"><div class="share-button">';
            html += '<a href="https://www.facebook.com/sharer.php?u=' + encodeURIComponent(url) + '" class="fb"><i class="icon icon-fb"></i>Facebook</a>';
            html += '<a href="https://twitter.com/intent/tweet?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(this.shareConf.desc) + '" class="tw"><i class="icon icon-tw"></i>Twitter</a>';
            html += '</div><a href="javascript:;" class="layer-btn">CANCEL</a></div></div>';
            $('body').append(html);
            if (!KEWLApp.isKEWLApp) {
                if (IsIOS) {
                    $('.logo').attr('href', IOSLINK);
                } else {
                    $('.logo').attr('href', ARDLINK);
                }
            } else {
                html += 'javascript:;';
            }
        },
        //页面事件绑定
        bindEvent: function () {
            var self = this;
            $('.share').on('click', function (e) {
                ga("send", "event", "birthday", "click", "share", 1);
                e.stopPropagation();
            });
            $('.share').on('click', function (e) {
                if (KEWLApp.hasShare) {
                    KEWLApp.openShareMenu({
                        "shareTypes": "0",
                        "url": self.shareConf.url,
                        "content": self.shareConf.desc,
                        "image": self.shareConf.img,
                        "subject": self.shareConf.title
                    }, function (data) {
                        if (data.shareType.toLowerCase() == 'facebook') {
                            if (data.success == 1) {
                                ga("send", "event", "vidconafterpartyrules", "click", "share-facebook-app", 1);
                            }
                        }
                    });
                    ga("send", "event", "vidconafterpartyrules", "click", "share-app", 1);
                    //log share  Event/SignUp/share?contest_id=2
                } else {
                    $('.layer').show();
                }
            });
            $('.layer-box').on('click', function (e) {
                e.stopPropagation();
            });

            $('.layer-btn,.layer').on('click', function (e) {
                $('.layer').hide();
            });
        }
    };
    page.init();
})();
