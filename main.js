
define('src/overlay',['jquery'], function ($) {
  

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
    if (this.hidden) {
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
    if (!this.hidden) {
      return this;
    }

    this.hidden = true;
    this.$element.fadeTo(this.options.animations.out.duration, 0, this.options.animations.out.easing, $.proxy(function () {
      this.$element.css('opacity', 0);
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

  return Overlay;
});