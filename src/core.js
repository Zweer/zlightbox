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
