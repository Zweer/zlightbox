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
