(function() {
  var init, isMobile, setupnotices, setupHero, _Drop;

  _Drop = Drop.createContext({
    classPrefix: 'drop'
  });

  isMobile = $(window).width() < 567;

  init = function() {

    return setupnotices();
  };


  setupnotices = function() {
    return $('.notice').each(function() {
      var $notice, $target, content, drop, openOn, theme;
      $notice = $(this);
      theme = $notice.data('theme');
      openOn = $notice.data('open-on') || 'click';
      $target = $notice.find('.drop-target');
      $target.addClass(theme);
      content = $notice.find('.drop-content').html();
      return drop = new _Drop({
        target: $target[0],
        classes: theme,
        position: 'bottom center',
        constrainToWindow: true,
        constrainToScrollParent: false,
        openOn: openOn,
        content: content
      });
    });
  };

  init();

}).call(this);
