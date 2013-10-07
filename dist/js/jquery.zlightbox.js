/**
 * -----------------------------------------------------
 * zLightBox v0.0.1 by @dotzweer
 * -----------------------------------------------------
 * Copyright 2013 Niccolò Olivieri <flicofloc@gmail.com>
 */

+function(a, b, c, d) {
    "use strict";
    var e = a(b), f = a(c), g = function(b, c) {
        this.options = c, b instanceof a && (this.$elements = b, this.refreshLinks()), this._initElements(), 
        this._initEvents();
    };
    g.DEFAULT = {
        gallery: {
            enable: !1,
            infinite: !0
        },
        shortcuts: {
            hide: 27,
            previous: 37,
            next: 39
        },
        overlay: {
            hideOnClick: !0
        },
        modal: {
            width: 640,
            height: 360,
            displayDescription: !1
        },
        elements: {
            body: a("body"),
            overlay: '<div class="zlightbox-overlay"></div>',
            hidden: '<div class="zlightbox-hidden"></div>',
            container: '<div class="zlightbox-container"></div>',
            description: '<div class="zlightbox-description"></div>'
        },
        animations: {
            overlay: {
                duration: 500,
                easing: "swing"
            },
            container: {
                duration: 500,
                easing: "swing"
            }
        },
        events: {
            onShowStart: a.noop,
            onShowEnd: a.noop,
            onHideStart: a.noop,
            onHideEnd: a.noop
        }
    }, g.REGEXP = {
        embed: {
            swf: {
                regexp: /[^\.]\.(swf)\s*$/i
            },
            collegeHumor: {
                regexp: /collegehumor\.com\/video:/i,
                split: "video:",
                url: "http://www.collegehumor.com/moogaloop/moogaloop.swf?autoplay=true&amp;fullscreen=1&amp;clip_id={ID}"
            },
            wordpress: {
                regexp: /v\.wordpress\.com/i,
                split: "v.wordpress.com/",
                url: "http://s0.videopress.com/player.swf?guid={ID}&amp;v=1.01"
            },
            vzaar: {
                regexp: /vzaar\.com\/videos/i,
                split: "vzaar.com/videos/",
                url: "http://view.vzaar.com/{ID}.flashplayer?autoplay=true&amp;border=none"
            }
        },
        iframe: {
            youtube: {
                regexp: /youtube\.com\/watch/i,
                split: "v=",
                url: "http://www.youtube.com/embed/{ID}?autoplay=1&amp;enablejsapi=1"
            },
            youtu: {
                regexp: /youtu\.be\//i,
                split: "youtu.be/",
                url: "http://www.youtube.com/embed/{ID}?autoplay=1&amp;enablejsapi=1"
            },
            vimeo: {
                regexp: /vimeo\.com/i,
                split: "vimeo.com/",
                url: "http://player.vimeo.com/video/{ID}?hd=1&amp;autoplay=1&amp;show_title=1&amp;show_byline=1&amp;show_portrait=0&amp;color=&amp;fullscreen=1"
            },
            metaCafe: {
                regexp: /metacafe\.com\/watch/i,
                split: "metacafe.com/watch/",
                url: "http://www.metacafe.com/embed/{ID}/?ap=1"
            },
            dailyMotion: {
                regexp: /dailymotion\.com\/video/i,
                split: "dailymotion.com/video/",
                secondSplit: "_",
                url: "http://www.dailymotion.com/embed/video/{ID}?autoPlay=1&forcedQuality=hd720"
            },
            daily: {
                regexp: /dai\.ly\//i,
                split: "dai.ly/",
                url: "http://www.dailymotion.com/embed/video/{ID}?autoPlay=1&forcedQuality=hd720"
            },
            collegeHumor: {
                regexp: /collegehumor\.com\/video\//i,
                split: "collegehumor.com/video/",
                url: "http://www.collegehumor.com/e/{ID}"
            },
            ustream: {
                regexp: /ustream\.tv\//i,
                split: "ustream.tv/recorded/",
                url: "http://www.ustream.tv/embed/recorded/{ID}?v=3&amp;wmode=direct&amp;autoplay=true"
            },
            twitvid: {
                regexp: /twitvid\.com/i,
                split: "twitvid.com/",
                url: "http://www.twitvid.com/player/{ID}"
            },
            telly: {
                regexp: /telly\.com\//i,
                split: "telly.com/",
                url: "http://telly.com/embed.php?guid={ID}&amp;autoplay=1"
            },
            bing: {
                regexp: /bing\.com\/maps/i,
                split: "?",
                includeAmp: !0,
                url: "http://www.bing.com/maps/embed/?emid=3ede2bc8-227d-8fec-d84a-00b6ff19b1cb&amp;w={WIDTH}&amp;h={HEIGHT}&amp;{ID}"
            },
            streetView: {
                regexp: /maps\.google\.(.*)layer=c/i,
                split: "?",
                includeAmp: !0,
                url: "http://maps.google.com/?output=svembed&amp;{ID}"
            },
            googleMapsV2: {
                regexp: /maps\.google\.(^\/)*\/maps\/ms/i,
                split: "?",
                includeAmp: !0,
                url: "https://maps.google.com/maps/ms?output=embed&amp;{ID}"
            },
            googleMaps: {
                regexp: /maps\.google\./i,
                split: "?",
                includeAmp: !0,
                url: "https://maps.google.com/maps?ie=UTF8&amp;{ID}&amp;output=embed"
            }
        },
        image: /\.(?:jpg|png|jpeg|gif|bmp|tiff)/i
    }, g.prototype._initElements = function() {
        this.$body = a(this.options.elements.body), this.$overlay = a(this.options.elements.overlay).css("opacity", 0).hide(), 
        this.$hidden = a(this.options.elements.hidden).css({
            position: "absolute",
            visibility: "hidden"
        }), this.$container = a(this.options.elements.container).css("opacity", 0).hide(), 
        this.$description = a(this.options.elements.description), this.$overlay.appendTo(this.$body).append(this.$container).append(this.$hidden);
    }, g.prototype._initEvents = function() {
        e.on("resize.zlightbox", a.proxy(this._setContainerDimensions, this)), f.on("keyup.zlightbox", a.proxy(function(a) {
            var b = a.keyCode;
            this.options.shortcuts.hide && b == this.options.shortcuts.hide ? this.hide() : this.options.shortcuts.previous && b == this.options.shortcuts.previous ? this.previous() : this.options.shortcuts.next && b == this.options.shortcuts.next && this.next();
        }, this)), this.options.overlay.hideOnClick && this.$overlay.on("click.zlightbox", a.proxy(this.hide, this));
    }, g.prototype.refreshLinks = function() {
        this.$elements instanceof a && (this.$elements.off("click.zlightbox"), this.$elements.on("click.zlightbox", a.proxy(this.show, this)));
    }, g.prototype.show = function(b) {
        var c = this, e = this.$current = b.preventDefault && b.preventDefault() || b instanceof a.Event ? a(b.currentTarget) : b;
        this.$elements.each(function(b) {
            return a(this).is(e) ? (c.currentIndex = b, !1) : !0;
        }), this.options.events.onShowStart(e);
        var f = e.attr("href"), h = e.data("zlightbox-type"), i = function(a, b) {
            return b = this ? this.regexp : b, f.match(b) ? (e.data("zlightbox-type", h = a), 
            !1) : !0;
        };
        if ((!h || g.REGEXP[h] === d && g.REGEXP.iframe[h] === d && g.REGEXP.embed[h] === d) && a.each(g.REGEXP, function(b) {
            return this instanceof RegExp ? i(b, this) : (a.each(this, i), "" != e.data("zlightbox-type"));
        }), g.REGEXP[h] === d && g.REGEXP.iframe[h] === d && g.REGEXP.embed[h] === d) return console.error("The resource to display is not a valid one."), 
        void 0;
        var j = a.extend({
            title: e.attr("title")
        }, this.options.modal, e.data());
        this._showOverlay(h, f, j);
    }, g.prototype._showOverlay = function(b, c, d) {
        this.$overlay.show().animate({
            opacity: 1
        }, this.options.animations.overlay.duration, this.options.animations.overlay.easing, a.proxy(this._preload, this, b, c, d));
    }, g.prototype._preload = function(b, c, d) {
        switch (b) {
          case "image":
            return a("<img/>").on("load", a.proxy(this._showContent, this, b, c, d)).attr("src", c), 
            void 0;

          default:
            var e = g.REGEXP.iframe[b] || g.REGEXP.embed[b];
            c = c.split(e.split)[e.index || 1].split("/")[0].split("?")[0], e.secondSplit && (c = c.split(e.secondSplit)[0]), 
            e.includeAmp || (c = c.split("&")[0]), c = e.url.replace("{ID}", c), this._showContent(b, c, d);
        }
    }, g.prototype._showContent = function(b, c, e) {
        var f;
        switch (b) {
          case "image":
            f = a("<img />").attr("src", c), this.$description.html(e.title);
            break;

          default:
            e.displayDescription ? this.$description.html(e.title) : this.$description.empty(), 
            c = c.replace("{WIDTH}", e.width).replace("{HEIGHT}", e.height), f = g.REGEXP.iframe[b] !== d ? a("<iframe>").attr("src", c).attr("frameborder", 0).width(e.width).height(e.height) : a(g.swfHtmlWrap(c, e));
        }
        this._setContainerDimensions(f), this.$container.empty().append(f).append(this.$description).show().animate({
            opacity: 1
        }, this.options.animations.container.duration, this.options.animations.container.easing, a.proxy(this.options.events.onShowEnd, this, f));
    }, g.prototype._setContainerDimensions = function(b) {
        b instanceof a.Event ? b = this.$container.children(":first") : (b.appendTo(this.$hidden), 
        b.data("width", b.width()), b.data("height", b.height()));
        var c = b.data("width"), d = b.data("height"), f = c / d, g = .9 * e.width(), h = .9 * e.height();
        c > g && (c = g, d = c / f), d > h && (d = h, c = d * f), this.$container.width(c).height(d).css({
            marginLeft: -1 * parseInt(c / 2),
            marginTop: -1 * parseInt(d / 2)
        });
    }, g.prototype.hide = function(b) {
        this.options.events.onHideStart(b), this.$container.animate({
            opacity: 0
        }, this.options.animations.container.duration, this.options.animations.container.easing, a.proxy(function() {
            this.$container.hide(), this._hideOverlay();
        }, this));
    }, g.prototype._hideOverlay = function() {
        this.$overlay.animate({
            opacity: 0
        }, this.options.animations.overlay.duration, this.options.animations.overlay.easing, a.proxy(function() {
            this.$overlay.hide(), this.options.events.onHideEnd();
        }, this));
    }, g.prototype.previous = function() {
        this.move(-1);
    }, g.prototype.next = function() {
        this.move(1);
    }, g.prototype.move = function(b) {
        if (this.options.gallery) {
            if (this.currentIndex += parseInt(b), this.currentIndex < 0) {
                if (!this.options.infinite) return;
                this.currentIndex = this.$elements.length - 1;
            } else if (this.currentIndex == this.$elements.length) {
                if (!this.options.infinite) return;
                this.currentIndex = 0;
            }
            this.show(a(this.$elements[this.currentIndex]));
        }
    }, g.swfHtmlWrap = function(b, c) {
        var d = a.extend({
            classid: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
            width: c.width,
            height: c.height,
            movie: b,
            src: b,
            style: "margin:0; padding:0;",
            allowFullScreen: "true",
            allowscriptaccess: "always",
            wmode: "transparent",
            autostart: "true",
            autoplay: "true",
            type: "application/x-shockwave-flash",
            flashvars: "autostart=1&autoplay=1&fullscreenbutton=1"
        }, c), e = "<object ", f = "<embed ", g = "";
        return a.each(d, function(a) {
            "" != this && (e += a + '="' + this + '" ', f += a + '="' + this + '" ', g += '<param name="' + a + '" value="' + this + '"></param>');
        }), e + ">" + g + f + "></embed></object>";
    }, a.zLightBox = function(a, b) {
        return new g(a, b);
    }, a.fn.zLightBox = function(b) {
        var c = a(this), d = c.data("zwe.zlightbox"), e = a.extend({}, g.DEFAULT, c.data(), "object" == typeof b && b);
        return d || c.data("zwe.zlightbox", d = a.zLightBox(this, e)), "string" == typeof b && d[b](c), 
        this;
    }, a.fn.zLightBox.Constructor = g;
}(window.jQuery, window, document);