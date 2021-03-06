+function ($, window, document, undefined) { "use strict";

    var $window   = $(window);
    var $document = $(document);
    var zLightBox = function(elements, options) {
        this.options = options;

        if (elements instanceof $) {
            this.$elements = elements;
            this.refreshLinks();
        }

        this._initElements();
        this._initEvents();
    };

    zLightBox.DEFAULT = {
        gallery: {
            enable: false,
            infinite: true
        },

        shortcuts: {
            hide: 27,     // ESC

            previous: 37, // Left Arrow
            next: 39      // Right Arrow
        },

        overlay: {
            hideOnClick: true
        },

        modal: {
            width: 640,
            height: 360,

            displayDescription: false
        },

        elements: {
            body: $('body'),

            overlay: '<div class="zlightbox-overlay"></div>',

            hidden: '<div class="zlightbox-hidden"></div>',

            container: '<div class="zlightbox-container"></div>',
            description: '<div class="zlightbox-description"></div>'
        },

        animations: {
            overlay: {
                duration: 500,
                easing: 'swing'
            },

            container: {
                duration: 500,
                easing: 'swing'
            }
        },

        events: {
            onShowStart: $.noop, // ($target)
            onShowEnd: $.noop,   // ($element)

            onHideStart: $.noop, // (event)
            onHideEnd: $.noop    // ()
        }
    };

    zLightBox.REGEXP = {
        embed: {
            swf: {
                regexp: /[^\.]\.(swf)\s*$/i
            },
            // Videos
            collegeHumor: {
                regexp: /collegehumor\.com\/video:/i,
                split: 'video:',
                url: "http://www.collegehumor.com/moogaloop/moogaloop.swf?autoplay=true&amp;fullscreen=1&amp;clip_id={ID}"
            },
            wordpress: {
                regexp: /v\.wordpress\.com/i,
                split: 'v.wordpress.com/',
                url: "http://s0.videopress.com/player.swf?guid={ID}&amp;v=1.01"
            },
            vzaar: {
                regexp: /vzaar\.com\/videos/i,
                split: 'vzaar.com/videos/',
                url: "http://view.vzaar.com/{ID}.flashplayer?autoplay=true&amp;border=none"
            }
        },
        iframe: {
            // Videos
            youtube: {
                regexp: /youtube\.com\/watch/i,
                split: 'v=',
                url: 'http://www.youtube.com/embed/{ID}?autoplay=1&amp;enablejsapi=1'
            },
            youtu: {
                regexp: /youtu\.be\//i,
                split: 'youtu.be/',
                url: 'http://www.youtube.com/embed/{ID}?autoplay=1&amp;enablejsapi=1'
            },
            vimeo: {
                regexp: /vimeo\.com/i,
                split: 'vimeo.com/',
                url: 'http://player.vimeo.com/video/{ID}?hd=1&amp;autoplay=1&amp;show_title=1&amp;show_byline=1&amp;show_portrait=0&amp;color=&amp;fullscreen=1'
            },
            metaCafe: {
                regexp: /metacafe\.com\/watch/i,
                split: 'metacafe.com/watch/',
                url: 'http://www.metacafe.com/embed/{ID}/?ap=1'
            },
            dailyMotion: {
                regexp: /dailymotion\.com\/video/i,
                split: 'dailymotion.com/video/',
                secondSplit: '_',
                url: 'http://www.dailymotion.com/embed/video/{ID}?autoPlay=1&forcedQuality=hd720'
            },
            daily: {
                regexp: /dai\.ly\//i,
                split: 'dai.ly/',
                url: 'http://www.dailymotion.com/embed/video/{ID}?autoPlay=1&forcedQuality=hd720'
            },
            collegeHumor: {
                regexp: /collegehumor\.com\/video\//i,
                split: 'collegehumor.com/video/',
                url: 'http://www.collegehumor.com/e/{ID}'
            },
            ustream: {
                regexp: /ustream\.tv\//i,
                split: 'ustream.tv/recorded/',
                url: 'http://www.ustream.tv/embed/recorded/{ID}?v=3&amp;wmode=direct&amp;autoplay=true'
            },
            twitvid: {
                regexp: /twitvid\.com/i,
                split: 'twitvid.com/',
                url: "http://www.twitvid.com/player/{ID}"
            },
            telly: {
                regexp: /telly\.com\//i,
                split: 'telly.com/',
                url: 'http://telly.com/embed.php?guid={ID}&amp;autoplay=1'
            },
            // Maps
            bing: {
                regexp: /bing\.com\/maps/i,
                split: '?',
                includeAmp: true,
                url: "http://www.bing.com/maps/embed/?emid=3ede2bc8-227d-8fec-d84a-00b6ff19b1cb&amp;w={WIDTH}&amp;h={HEIGHT}&amp;{ID}"
            },
            streetView: {
                regexp: /maps\.google\.(.*)layer=c/i,
                split: '?',
                includeAmp: true,
                url: "http://maps.google.com/?output=svembed&amp;{ID}"
            },
            googleMapsV2: {
                regexp: /maps\.google\.(^\/)*\/maps\/ms/i,
                split: '?',
                includeAmp: true,
                url: 'https://maps.google.com/maps/ms?output=embed&amp;{ID}'
            },
            googleMaps: {
                regexp: /maps\.google\./i,
                split: '?',
                includeAmp: true,
                url: 'https://maps.google.com/maps?ie=UTF8&amp;{ID}&amp;output=embed'
            }
        },
        image: /\.(?:jpg|png|jpeg|gif|bmp|tiff)/i
    };

    zLightBox.prototype._initElements = function () {
        this.$body      = $(this.options.elements.body);
        this.$overlay   = $(this.options.elements.overlay).css('opacity', 0).hide();
        this.$hidden    = $(this.options.elements.hidden).css({
            position: 'absolute',
            visibility: 'hidden'
        });
        this.$container = $(this.options.elements.container).css('opacity', 0).hide();
        this.$description = $(this.options.elements.description);

        this.$overlay.appendTo(this.$body).append(this.$container).append(this.$hidden);
    };

    zLightBox.prototype._initEvents = function () {
        $window.on('resize.zlightbox', $.proxy(this._setContainerDimensions, this));

        $document.on('keyup.zlightbox', $.proxy(function (event) {
            var keyCode = event.keyCode;

            if (this.options.shortcuts.hide && keyCode == this.options.shortcuts.hide) {
                this.hide();
            } else if (this.options.shortcuts.previous && keyCode == this.options.shortcuts.previous) {
                this.previous();
            } else if (this.options.shortcuts.next && keyCode == this.options.shortcuts.next) {
                this.next();
            }

        }, this));

        if (this.options.overlay.hideOnClick) {
            this.$overlay.on('click.zlightbox', $.proxy(this.hide, this));
        }
    };

    zLightBox.prototype.refreshLinks = function () {
        if (this.$elements instanceof $) {
            this.$elements.off('click.zlightbox');
            this.$elements.on('click.zlightbox', $.proxy(this.show, this));
        }
    };

    zLightBox.prototype.show = function (event) {
        var that = this;
        var $target = this.$current = event['preventDefault'] && event.preventDefault() || event instanceof $.Event ? $(event.currentTarget) : event;

        this.$elements.each(function (index) {
            if ($(this).is($target)) {
                that.currentIndex = index;
                return false; // break
            }

            return true; // Added to prevent warnings
        });

        this.options.events.onShowStart($target);

        var href = $target.attr('href');
        var type = $target.data('zlightbox-type');
        var checkType = function (testType, test) {
            test = this ? this.regexp : test;

            if (href.match(test)) {
                $target.data('zlightbox-type', (type = testType));

                return false; // break
            }

            return true; // Added to prevent warnings
        };

        if (!type || (zLightBox.REGEXP[type] === undefined && zLightBox.REGEXP.iframe[type] === undefined && zLightBox.REGEXP.embed[type] === undefined)) {
            $.each(zLightBox.REGEXP, function(testType) {
                if (this instanceof RegExp) {
                    return checkType(testType, this);
                } else {
                    $.each(this, checkType);
                }

                return $target.data('zlightbox-type') != '';
            });
        }

        if (zLightBox.REGEXP[type] === undefined && zLightBox.REGEXP.iframe[type] === undefined && zLightBox.REGEXP.embed[type] === undefined) {
            console.error('The resource to display is not a valid one.');
            return;
        }

        var options = $.extend({ title: $target.attr('title') }, this.options.modal, $target.data());

        this._showOverlay(type, href, options);
    };

    zLightBox.prototype._showOverlay = function (type, href, options) {
        // Show overlay
        this.$overlay.show().animate(
            {
                opacity: 1
            },
            this.options.animations.overlay.duration,
            this.options.animations.overlay.easing,
            $.proxy(this._preload, this, type, href, options)
        );
    };

    zLightBox.prototype._preload = function (type, href, options) {
        switch (type) {
            case 'image':
                $('<img/>').on('load', $.proxy(this._showContent, this, type, href, options)).attr('src', href);
                return;
                break;

            default:
                var parser = zLightBox.REGEXP.iframe[type] || zLightBox.REGEXP.embed[type];

                href = href.split(parser.split)[parser.index || 1].split('/')[0].split('?')[0];
                if (parser.secondSplit) {
                    href = href.split(parser.secondSplit)[0];
                }
                if (!parser.includeAmp) {
                    href = href.split('&')[0];
                }

                href = parser.url.replace('{ID}', href);

                this._showContent(type, href, options);
                break;
        }
    };

    zLightBox.prototype._showContent = function (type, href, options) {
        var $element;

        switch (type) {
            case 'image':
                $element = $('<img />').attr('src', href);
                this.$description.html(options.title);
                break;

            default:
                if (options.displayDescription) {
                    this.$description.html(options.title);
                } else {
                    this.$description.empty();
                }

                href = href.replace('{WIDTH}', options.width).replace('{HEIGHT}', options.height);

                if (zLightBox.REGEXP.iframe[type] !== undefined) {
                    $element = $('<iframe>').attr('src', href).attr('frameborder', 0).width(options.width).height(options.height);
                } else {
                    $element = $(zLightBox.swfHtmlWrap(href, options));
                }
        }

        this._setContainerDimensions($element);


        this.$container
            .empty()
            .append($element)
            .append(this.$description)
            .show()
            .animate(
            {
                opacity: 1
            },
            this.options.animations.container.duration,
            this.options.animations.container.easing,
            $.proxy(this.options.events.onShowEnd, this, $element)
        );
    };

    zLightBox.prototype._setContainerDimensions = function ($element) {
        if ($element instanceof $.Event) {
            $element = this.$container.children(':first');
        } else {
            $element.appendTo(this.$hidden);
            $element.data('width', $element.width());
            $element.data('height', $element.height());
        }

        var width  = $element.data('width');
        var height = $element.data('height');
        var ratio  = width / height;
        var windowWidth  = $window.width() * .9;
        var windowHeight = $window.height() * .9;

        if (width > windowWidth) {
            width  = windowWidth;
            height = width / ratio;
        }
        if (height > windowHeight) {
            height = windowHeight;
            width  = height * ratio;
        }

        this.$container.width(width).height(height).css({
            marginLeft: parseInt(width / 2) * -1,
            marginTop: parseInt(height / 2) * -1
        });
    };

    zLightBox.prototype.hide = function (event) {
        this.options.events.onHideStart(event);

        this.$container.animate(
            {
                opacity: 0
            },
            this.options.animations.container.duration,
            this.options.animations.container.easing,
            $.proxy(function () {
                this.$container.hide();
                this._hideOverlay();
            }, this)
        )
    };

    zLightBox.prototype._hideOverlay = function () {
        this.$overlay.animate(
            {
                opacity: 0
            },
            this.options.animations.overlay.duration,
            this.options.animations.overlay.easing,
            $.proxy(function () {
                this.$overlay.hide();
                this.options.events.onHideEnd();
            }, this)
        )
    };

    zLightBox.prototype.previous = function () {
        this.move(-1);
    };

    zLightBox.prototype.next = function () {
        this.move(1);
    };

    zLightBox.prototype.move = function (add) {
        if (!this.options.gallery) {
            return;
        }

        this.currentIndex += parseInt(add);

        if (this.currentIndex < 0) {
            if (this.options.infinite) {
                this.currentIndex = this.$elements.length - 1;
            } else {
                return;
            }
        } else if (this.currentIndex == this.$elements.length) {
            if (this.options.infinite) {
                this.currentIndex = 0;
            } else {
                return;
            }
        }

        this.show($(this.$elements[this.currentIndex]));
    };

    zLightBox.swfHtmlWrap = function (href, options) {
        var attributes = $.extend({
            classid: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
            width: options.width,
            height: options.height,
            movie: href,
            src: href,
            style: "margin:0; padding:0;",
            allowFullScreen: "true",
            allowscriptaccess: "always",
            wmode: "transparent",
            autostart: "true",
            autoplay: "true",
            type: "application/x-shockwave-flash",
            flashvars: "autostart=1&autoplay=1&fullscreenbutton=1"
        }, options);
        var objectHtml = '<object ';
        var embedHtml  = '<embed ';
        var parameters = '';
        $.each(attributes, function(name) {
            if (this != '') {
                objectHtml += name + '="' + this + '" ';
                embedHtml  += name + '="' + this + '" ';
                parameters += '<param name="' + name + '" value="' + this + '"></param>';
            }
        });

        return objectHtml + '>' + parameters + embedHtml + '></embed></object>';
    };

    $.zLightBox = function (elements, options) {
        return new zLightBox(elements, options);
    };

    $.fn.zLightBox = function (option) {
        var $this   = $(this);
        var data    = $this.data('zwe.zlightbox');
        var options = $.extend({}, zLightBox.DEFAULT, $this.data(), typeof option == 'object' && option);

        if (!data) {
            $this.data('zwe.zlightbox', (data = $.zLightBox(this, options)));
        }

        if (typeof option == 'string') {
            data[option]($this);
        }

        return this;
    };

    $.fn.zLightBox.Constructor = zLightBox;

}(window.jQuery, window, document);