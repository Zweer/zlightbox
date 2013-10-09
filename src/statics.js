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
