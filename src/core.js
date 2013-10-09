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
