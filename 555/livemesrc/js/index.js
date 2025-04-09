;
var KEWLApp = require('./lib/kewl.js');
var UI = require('./common/ui.js');

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
            var self = this;
            self.getData();
            self.initFooter();
            self.bindEvent(); //绑定事件  事件代理方式

            setTimeout(function () {
                $('#loading').hide();
            }, 700);
        },
        /*
         * @desc 使用简易模版 数据需要提前处理好，模版只负责渲染
         * @param  data  对象数组   [{},{}]   
         * @page  int  num   
         * @return   data
         * */
        handleData: function (data, pageStart, page, action,tab) {
            var self = this;
            for (var i = 0, len = data.length; i < len; i++) {
                //sort  序列号
                data[i].tab = tab;
                data[i].sort = i + 1 + parseInt(pageStart) + (page - 1) * 100;
                data[i].action = action;
                //关注状态
                if (!!self.userInfo && data[i].uid == self.userInfo.userId) {
                    data[i].followClass = 'none';
                } else {
                    data[i].followClass = data[i].relation == '0' ? 'follow' : 'follow followed';
                }
                //认证 达人
                '3' == data[i].is_verified ? data[i].verifiedClass = "icon_v" : ('6' == data[i].is_verified ? data[i].verifiedClass = "icons_s" : '');
            }
            return data;
        },
        handleSelfData: function (data, action,noRank, giftID) {
            data.verifiedClass = '3' == data.is_verified ? "verified-v" : ('6' == data.is_verified ? "verified-star" : '');
            
            if(data.rank < 0){
                data.rank = noRank;
            }
            data.giftID = giftID;
            data.action = action;
            return data;
        },
        handleSelfRankData: function (data, action) {
            data.verifiedClass = '3' == data.is_verified ? "verified-v" : ('6' == data.is_verified ? "verified-star" : '');
            data.action = action;
            //            data.rank = data.rank > 100 ? '100+' : data.rank;
            console.info("test");
            console.info(data);
            return data;
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
        getData: function () {
            var self = this;
        },
        getSelfData: function (tab) {
            //http://live.ksmobile.net/ComRankH5/receiver_amount_self?act_id=8&uid=
             var self = this;
            var act_id = '';
            switch (tab) {
                case 1:
                    act_id = self.cCode == 'us' ? 8 : 14;
                    break;
                case 2:
                    act_id = self.cCode == 'us' ? 9 : 12;
                    break;
                case 3:
                    act_id = self.cCode == 'us' ? 10 : 15;
                    break;
            }
           
            var data = self.userInfo ? {
                uid: self.userInfo.userId,
                token: self.userInfo.token,
                androidid: self.userInfo.deviceId,
                act_id: act_id

            } : {
                uid: '', //841112106031251456
                act_id: act_id
            }

            var container = $('.tab-content').eq(tab - 1);

            $.ajax({
                url: self.apiUrl + "/ComRankH5/receiver_amount_self",
                type: "GET",
                data: data,
                dataType: 'json',
                success: function (data) {
                    if (data.status == '200') {
                        var html = $('#selfTemplate').template(self.handleSelfData(data.data, self.i18n.Received, self.i18n.noRank,tab));
                        container.append(html);
                        //如果达到了得奖标准  显示pass
                        if(tab == 1 && data.data.cnt >= 2000){
                            $('.reward_wrap .reward'+tab).addClass('pass');
                        }else if(tab == 2 && data.data.cnt >= 30){
                            $('.reward_wrap .reward'+tab).addClass('pass');
                        }else if(tab == 3 && data.data.cnt >= 10){
                            $('.reward_wrap .reward'+tab).addClass('pass');
                        }
                    }
                },
                error: function (err) {}
            });
        },
        //
        getRankData: function (actId, page) {
            //US   8  9  10
            //vn   14 12 17
            var self = this;
            var self = this;
            var pk = actId;
            var act_id = null;
            switch (actId) {
                case 0:
                    act_id = self.cCode == 'us' ? 8 : 14;
                    break;
                case 1:
                    act_id = self.cCode == 'us' ? 9 : 12;;
                    break;
                case 2:
                    act_id = self.cCode == 'us' ? 10 : 15;;
                    break;
            }
            var data = self.userInfo ? {
                act_id: act_id,
                uid: self.userInfo.userId,
                token: self.userInfo.token,
                androidid: self.userInfo.deviceId,
                country: self.cCode == 'ar' ? 'sa'.toUpperCase() : self.cCode.toUpperCase(),
                page: page
            } : {
                uid: '', //841112106031251456
                act_id: act_id,
                country: self.cCode == 'ar' ? 'sa'.toUpperCase() : self.cCode.toUpperCase(),
                page: page
            }

            var tabContainer = $('.rank .tab-content').eq(parseInt(pk));
            console.info(tabContainer);
            if (tabContainer.attr('data-loading') == 'yes') {
                return;
            }
            tabContainer.attr('data-loading', 'yes');

            $.ajax({
                url: self.apiUrl + "/ComRankH5/receiver_amount_rank",
                type: "GET",
                data: data,
                dataType: 'json',
                success: function (data) {
                    tabContainer.attr('data-loading', 'no');
                    if (data.status == '200' && data.data.length > 0) {
                        // voters top3
                        tabContainer.attr('data-page', parseInt(page) + 1);
                        var html = $('#itemTemplate').template(self.handleData(data.data, 0, page, self.i18n.Received,parseInt(pk)+1));

                        tabContainer.find('ul').append(html);

                    } else if (data.data.length == 0) {
                        tabContainer.find('.no-data').show();
                    }
                    console.info('data.data.length:' + data.data.length);
                    if (data.data.length == 100) {
                        tabContainer.attr('data-more', 'yes');
                    } else {
                        tabContainer.attr('data-more', 'no');
                    }
                },
                error: function (err) {}
            });
        },
        loadMore: function (target) {
            var self = this;
            console.info(target);
            var action = target.attr('data-tab');
            var pagestart = target.attr('data-page') ? target.attr('data-page') : 2;
            this.getRankData(self.pk, pagestart);
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
                                ga("send", "event", "vidconafterparty", "click", "share-facebook-app", 1);
                            }
                        }
                    });
                    ga("send", "event", "vidconafterparty", "click", "share-app", 1);
                    //log share  Event/SignUp/share?contest_id=2
                } else {
                    $('.layer').show();
                }
            });
            $('.wrap').on('click', '.rules-btn', function (e) {
                $('.rules').show();
            });
            $('.wrap').on('click', '.rules .close', function (e) {
                $('.rules').hide();
            });
            $('.layer-box').on('click', function (e) {
                e.stopPropagation();
            });

            $('.layer-btn,.layer').on('click', function (e) {
                $('.layer').hide();
            });
            $('.wrap').on('click', '.toggle-btn', function (e) {
                $(this).parent().find('.other').toggleClass('none');
                $(this).toggleClass('up');
            });
            
            $('.wrap').on('click','.detail_btn',function(e){
                $('.wrap .details').show();
            });
            $('.wrap').on('click','.close_btn',function(e){
                $('.wrap .details').hide();
            });
            
            
            //item
            $('.wrap').on('click', '.item', function (e) {
                itemHandle(e);
            });

            var tabTimer = setInterval(function () {
                var currentTab = $('.tab-nav .tab.current');
                var index = currentTab.parent().find('.tab').index(currentTab);
                var tab = $('.tab-nav .tab').eq(index + 1);
                if (tab.length > 0) {
                    tab.trigger('click', 'robot');
                } else {
                    $('.tab-nav .tab').eq(0).trigger('click', 'robot');
                }
            }, 5000);
            //tab
            $('.tab-nav').on('click', '.tab', function (event, from) {
                var target = $(this);
                if (tabTimer && !from) {
                    clearInterval(tabTimer);
                }
                target.addClass('current');
                target.siblings().removeClass('current');
                var index = target.parent().find('.tab').index(target);
                //设置当前tab
                self.pk = index;
                console.info(self.pk);
                var tabContent = target.parent().siblings('.tab-content').eq(index);
                tabContent.show().siblings('.tab-content').hide();
                ga("send", "event", "vidconafterparty", "click", "tab " + target.text(), 1);
            });

            function itemHandle(e) {
                e.stopPropagation();
                e.preventDefault();
                var target = $(e.target);
                var uid = target.attr('data-uid') || target.parents('[data-uid]').attr('data-uid');
                //点击follow  关注
                if (target.hasClass('follow') || target.parents('.follow').length > 0) {
                    e.stopPropagation();
                    e.preventDefault();
                    if (target.hasClass('followed') || target.parents('.followed').length > 0) {
                        return false;
                    }

                    if (KEWLApp.isKEWLApp) {
                        try {
                            ga("send", "event", 'vidconafterparty', "click", "follow-app", 1);
                        } catch (e) {}
                    } else {
                        try {
                            ga("send", "event", 'vidconafterparty', "click", "follow-web", 1);
                        } catch (e) {}
                    }

                    if (!!self.userInfo) {
                        $.ajax({
                            url: self.apiUrl + '/follow/followingUsersH5',
                            type: 'GET',
                            data: {
                                uid: self.userInfo.userId,
                                token: self.userInfo.token,
                                androidid: self.userInfo.deviceId,
                                open_id: uid
                            },
                            dataType: 'json',
                            success: function (data) {
                                if (data.status == 200) {
                                    target.closest('.follow').addClass('follow-disabled');
                                }
                            }
                        });
                    } else {
                        KEWLApp.androidTryOpenAppOrDownload({
                            other: {
                                fn: 'openBoZhuPage',
                                param: [uid]
                            },
                            success: function () {
                                if (IsIOS) {
                                    self.downloadTip();
                                }
                            },
                            fail: function () {
                                self.downloadTip();
                            }
                        });

                    }
                    return;
                }

                if (KEWLApp.isKEWLApp) {
                    ga('send', 'event', "vidconafterparty", 'click', 'openBoZhuPage_' + uid, 1);
                    KEWLApp.openBoZhuPage(uid);
                } else {
                    ga('send', 'event', "vidconafterparty", 'click', 'openBoZhuPage_' + uid, 1);
                    if (isWeixin && isIOSMac) {
                        UI.alert(self.i18n.wechatTip);
                    } else {
                        self.downloadTip();
                    }
                }
            }

            //翻页
            $(document).scroll(function (e) {
                var target = $(e.target);
                //                var scrollTop = target.scrollTop();
                var scrollTop = window.pageYOffset;
                var containerHeight = target.height();
                var contentHeight = target.children().height();
                console.info(target);
                console.info(scrollTop);
                console.info(containerHeight);
                console.info(contentHeight);
                var container = $('.rank .tab-content').eq(self.pk);

                if (containerHeight - scrollTop - contentHeight < 1000 && (container.attr('data-more') == 'yes')) {
                    console.info('more');
                    self.loadMore(container);
                    return;
                }
            });
        }
    };
    page.init();
})();
