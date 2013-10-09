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
    this.overlay = new Overlay($.extend({ css: { zIndex: this.options.css.zIndex - 10 }, wrapper: this.options.wrapper }, this.options.overlay));

    this.$structure = {};
    this.$structure.$current = $('<div></div>')
      .appendTo(this.options.wrapper)
      .addClass('zlightbox-current')
      .addClass('zlightbox-theme-' + this.options.theme)
      .css({
        position: 'fixed',
        top: '50%',
        left: '50%'
      })
      .css(this.options.css)
      .fadeOut(0);
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

    if (type.category === 'image') {
      this.preload(this.$current, this._show);
    } else {
      this._show();
    }
  };

  ZLightBox.prototype._show = function () {
    this.$structure.$current.empty();

    var $element;
    switch (this.$current.data('zlightbox-type').category) {
      case 'image':
        $element = $('<img>').attr('src', this.$current.href || this.$current.attr('href'));
    }

    this.$structure.$current
      .append($element)
      .css({
        marginLeft: this.$current.image.width / -2,
        marginTop:  this.$current.image.height / -2
      })
      .fadeIn();
  };

  ZLightBox.prototype.hide = function (event) {
    if (event instanceof $.Event) {
      event.preventDefault();
    }

    this.$structure.$current.fadeOut();
    this.overlay.hide();
  };

  ZLightBox.prototype.previous = function () {

  };

  ZLightBox.prototype.next = function () {

  };

  ZLightBox.prototype.preload = function (image, callback) {
    var uri, loaded;

    if (image instanceof $) {
      uri    = image.attr('href');
      loaded = image.data('zlightbox-loaded');
    } else {
      uri    = image.href;
      loaded = image.loaded;
    }

    if (!loaded) {
      image.image = new Image();
      $(image.image).load($.proxy(callback, this));
      image.image.src = uri;
    } else {
      callback();
    }
  };