;
(function (ROOT) {

    var UI = {

        addEvent: function (el, ev, fn) {
            if (!el) {
                return el;
            }
            if (!!el && !!el.length) {
                for (var i = 0; i < el.length; i++) {
                    if (el[i].addEventListener) {
                        el[i].addEventListener(ev, fn, false);
                    } else if (el[i].attachEvent) {
                        el[i].attachEvent('on' + ev, fn);
                    }
                };
            } else {
                if (el.addEventListener) {
                    el.addEventListener(ev, fn, false);
                } else if (el.attachEvent) {
                    el.attachEvent('on' + ev, fn);
                }
            }
        },

        // 只弹toast
        showToast: function (text, ms) {
            if (!text) {
                return false;
            }
            var dom = $('<div class="public-toast">' + text + '</div>');
            var ms = ms || 1500;
            $('body').append(dom);
            setTimeout(function () {
                dom.addClass('public-toast-show');
            }, 10);
            setTimeout(function () {
                dom.removeClass('public-toast-show');
                dom.on('webkitTransitionEnd', function () {
                    dom.remove();
                });
            }, ms);
        },

        popHtml: function (text, type, definBtns) {
            var html = "",
                dom = document.createElement('div'),
                popHtml = document.createElement('div'),
                btns = [{
                    type: 'sure',
                    text: 'OK',
                    style: ''
                }];

            if (!!definBtns && definBtns.length > 0) {
                btns = definBtns;
            }

            dom.className = 'mask';
            dom.style.display = 'block';

            popHtml.className = 'client-pop';

            html += '<p>' + text + '</p><div class="client-btns">';

            for (var i = 0; i < btns.length; i++) {
                html += '<a href="javascript:;" data-type="' + btns[i]['type'] + '"' + ((typeof btns[i]['style'] == 'string' && !!btns[i]['style']) ? 'style="' + btns[i]['style'] + '"' : '') + '>' + btns[i]['text'] + '</a>';
            };

            html += '</div>';

            popHtml.innerHTML = html;

            dom.appendChild(popHtml);

            document.getElementsByTagName('body')[0].appendChild(dom);

            setTimeout(function () {
                popHtml.classList.add('client-pop-show');
            }, 10);

            this.addEvent(dom, 'touchmove', function (event) {
                var e = event ? event : window.event;
                if (e && e.preventDefault) {
                    e.preventDefault();
                } else {
                    e.returnValue = false;
                }
            });

            return dom;
        },

        alert: function (text, callback, definBtns) {

            var dom = this.popHtml(text, 'alert', definBtns);
            this.addEvent(dom.getElementsByTagName('a')[0], 'click', function (e) {
                dom.parentNode.removeChild(dom);
                callback && callback();
            });
        },

        confirm: function (text, callback, cancelCallback, definBtns) {
            var btns = [{
                type: 'cancel',
                text: 'Cancel',
                style: ''
            }, {
                type: 'sure',
                text: 'OK',
                style: ''
            }];

            if (!!definBtns && definBtns.length > 0) {
                btns = definBtns;
            }

            var dom = this.popHtml(text, 'confirm', btns);

            this.addEvent(dom.querySelectorAll('.client-btns a'), 'click', function (e) {
                var type = this.getAttribute('data-type');

                dom.parentNode.removeChild(dom);

                if (type == "sure") {
                    callback && callback();
                } else {
                    cancelCallback && cancelCallback();
                }

            });

            dom.addEventListener('touchmove', function (e) {
                e.preventDefault();
                return false;
            }, false);

        }
    };

	if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {

		define(function() {

			return UI;

		});

	} else if (typeof module !== 'undefined' && module.exports) {

		module.exports.UI = UI;

	} else {

		ROOT.UI = UI;

	}
})(window);