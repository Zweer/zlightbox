/**
 * -----------------------------------------------------
 * zLightBox v0.0.1 by @dotzweer
 * -----------------------------------------------------
 * Copyright 2013 Niccolò Olivieri <flicofloc@gmail.com>
 */

if (typeof jQuery === 'undefined') { 
  throw new Error('ZLightBox requires jQuery');
}

(function ($) { 'use strict';

  var $window   = $(window);
  var $document = $(document);
  var Overlay = function (options) {
    this.options  = $.extend({},  Overlay.DEFAULT, options);
    this.$element = $('<div></div>')
      .addClass(this.options.name)
      .css(this.options.css)
      .css('display', 'none')
      .appendTo($(this.options.wrapper));
    this.hidden = true;

    if (this.options.modal) {
      this.$element.on('click.zlightbox', $.proxy(function (e) {
        if ($.isFunction(this.options.callback)) {
          this.options.callback();
        } else {
          this.hide();
        }
      }, this));
    }
  };

  Overlay.prototype.show = function (callback) {
    if (!this.hidden) {
      return this;
    }

    this.$element.css({
      display: 'block',
      opacity: 0
    });

    this.hidden = false;
    this.$element.fadeTo(this.options.animations.in.duration, this.options.css.opacity, this.options.animations.in.easing, $.proxy(function () {
      this.$element.css('opacity', this.options.css.opacity);
      this.options.onShow();

      if ($.isFunction(callback)) {
        callback();
      }
    }, this));

    return this;
  };

  Overlay.prototype.hide = function (callback) {
    if (this.hidden) {
      return this;
    }

    this.hidden = true;
    this.$element.fadeTo(this.options.animations.out.duration, 0, this.options.animations.out.easing, $.proxy(function () {
      this.$element.css({
        display: 'none',
        opacity: 0
      });
      
      this.options.onHide();

      if ($.isFunction(callback)) {
        callback();
      }
    }, this));

    return this;
  };

  Overlay.DEFAULT = {
    name: 'zlightbox-overlay',
    wrapper: $('body'),
    callback: null,
    modal: true,
    css: {
      position: 'fixed',
      
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,

      opacity: 0.6,

      background: 'black',

      zIndex: 2040 // Never used, always inherited
    },
    animations: {
      in: {
        duration: 200,
        easing: 'swing'
      },

      out: {
        duration: 200,
        easing: 'swing'
      }
    },

    onShow: $.noop,
    onHide: $.noop
  };
  var ZLightBox = function (elements, options) {
    this.options = options;

    if (elements instanceof $) {
      this.$elements = elements;
      this._refreshLinks();
    } else {
      // TODO: it could also be an array
    }

    this._initElements();
    this._initEvents();
  };

  ZLightBox.prototype._refreshLinks = function () {
    if (this.$elements instanceof $) {
      this.$elements.off('click.zlightbox');
      this.$elements.on('click.zlightbox', $.proxy(this.show, this));
    }
  };

  ZLightBox.prototype._initElements = function () {
    // TODO: wrapper and overlay.wrapper must be the same

    this.overlay = new Overlay($.extend({ css: { zIndex: this.options.css.zIndex - 10 } }, this.options.overlay));
    this.$container = $(this.options.elements.container).css(this.options.css).appendTo($(this.options.elements.wrapper)).fadeOut(0);
  };

  ZLightBox.prototype._initEvents = function () {
    $window[0].onorientationchange = function () {

    };

    $window.on('resize.zlightbox', function () {

    });

    $document.on('keydown.zlightbox', $.proxy(function (event) {
      var keyCode = event.keyCode;

      if (this.options.shortcuts.hide && keyCode == this.options.shortcuts.hide) {
        this.hide();
      } else if (this.options.shortcuts.previous && keyCode == this.options.shortcuts.previous) {
        this.previous();
      } else if (this.options.shortcuts.next && keyCode == this.options.shortcuts.next) {
        this.next();
      }
    }, this));
  };

  ZLightBox.prototype.show = function (event) {
    if (event instanceof $.Event) {
      event.preventDefault();

      this.$current = $(event.delegateTarget);
      this.index    = $.inArray(event.delegateTarget, this.$elements);
    } else if(typeof event === 'number') {
      this.$current = $(this.$elements[event]);
      this.index    = event;
    }

    var type = this.$current.data('zlightbox-type');
    if (!type) {
      this.$current.data('zlightbox-type', type = ZLightBox.searchType(this.$current.attr('href')));
    }

    this.overlay.show();
  };

  ZLightBox.prototype.hide = function (event) {

    return false;
  };

  ZLightBox.prototype.previous = function () {

  };

  ZLightBox.prototype.next = function () {

  };

  ZLightBox.DEFAULT = {
    elements: {
      wrapper: $('body'),

      overlay: '<div class="zlightbox-overlay"></div>',
      container: '<div class="zlightbox-container"></div>'
    },

    css: {
      zIndex: 2050
    },

    overlay: {
      hideOnClick: true
    }
  };

  ZLightBox.REGEXP = {
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

    image: {
      image: {
        regexp: /\.(?:jpg|png|jpeg|gif|bmp|tiff)/i
      }
    }
  };
  ZLightBox.searchType = function (href) {
    for (var category in ZLightBox.REGEXP) {
      for (var type in ZLightBox.REGEXP[category]) {
        if (href.match(ZLightBox.REGEXP[category][type].regexp)) {
          return {
            category: category,
            type: type
          };
        }
      }
    }

    throw new Error('Undefined category/type for uri: "' + href + '"');
  };

  $.zLightBox = function (elements, options) {
    return new ZLightBox(elements, $.extend({}, ZLightBox.DEFAULT, options));
  };

  $.fn.zLightBox = function (option) {
    var $this   = $(this);
    var data    = $this.data('zlightbox');
    var options = $.extend({}, $this.data(), typeof option === 'object' && option);

    if (!data) {
      $this.data('zlightbox', (data = $.zLightBox(this, options)));
    }

    if (typeof option === 'string') {
      data[option]($this);
    }

    return this;
  };


}(jQuery));