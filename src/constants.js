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