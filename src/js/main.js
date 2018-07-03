const formstyler = require('./jquery.formstyler.min');

const settingsNavItem = $('.settings__nav-item'),
      settingsInnerItem = $('.settings__inner-item'),
      playItem = $('#play-item'),
      newsItem = $('#news-item'),
      donatItem = $('#donat-item'),
      helpItem = $('#help-item'),
      startPlayTitle = $('.start-play__title'),
      news = $('.main__news'),
      donat = $('.main__donat'),
      summInput = $('#summ'),
      helpPopup = $('.help-popup'),
      helpClose = $('.help-popup__close'),
      newsArrowLeft = $('.news__arrow-left'),
      newsArrowRight = $('.news__arrow-right'),
      newsList = $('.news__list'),
      formSelect = $('.form__select');

settingsNavItem.on('click', function(e) {
  settingsNavItem.removeClass('settings__nav-item--active');
  $(this).addClass('settings__nav-item--active');

  const index = $(this).index();
  settingsInnerItem.removeClass('settings__inner-item--active');
  settingsInnerItem.eq(index).addClass('settings__inner-item--active');
})

playItem.on('click', function(e) {
  e.preventDefault();

  $('html, body').animate({ scrollTop: (startPlayTitle.offset().top - 20) }, 500);
})

newsItem.on('click', function(e) {
  e.preventDefault();

  $('html, body').animate({ scrollTop: news.offset().top }, 500);
})

donatItem.on('click', function(e) {
  e.preventDefault();

  $('html, body').animate({ scrollTop: donat.offset().top }, 500);
})

summInput.on('keydown', function(e) {
  if (e.ctrlKey || e.altKey || e.metaKey) return;

  var chr = e.key;

  if (chr == null) return;

  if (chr != 'ArrowLeft' && chr != 'ArrowRight' && chr != 'Backspace' && chr != 'Enter' && chr != 'Tab' && (chr < '0' || chr > '9')) {
    return false;
  }
})

var isActive = false;

helpItem.on('click', function(e) {
  
  if(!isActive) {
    isActive = true;
    helpPopup.animate({'z-index':'100'}, 10, function() {
      $('.help-popup__bg-left').animate({'left':'0'}, 400, function() {});
      $('.help-popup__bg-right').animate({'right':'0'}, 400, function() {
        $('.help-popup__content').animate({'opacity':'1'}, 300, function() {});
      });
    });
  }
})

helpClose.on('click', function(e) {
  isActive = false;
  $('.help-popup__content').animate({'opacity':'0'}, 300, function() {
    $('.help-popup__bg-left').animate({'left':'-55%'}, 400, function() {});
    $('.help-popup__bg-right').animate({'right':'-55%'}, 400, function() {
      helpPopup.animate({'z-index':'-1'}, 10, function() {});
    });
  });
})

$('.help-popup__bg').on('click', function(e) {
  isActive = false;
  $('.help-popup__content').animate({'opacity':'0'}, 300, function() {
    $('.help-popup__bg-left').animate({'left':'-55%'}, 400, function() {});
    $('.help-popup__bg-right').animate({'right':'-55%'}, 400, function() {
      helpPopup.animate({'z-index':'-1'}, 10, function() {});
    });
  });
})

$('body').on('wheel', function(e) {
  if(isActive)
    e.preventDefault();
});

var transform = 0;

newsList.on('wheel DOMMouseScroll', function(e) {
  e.preventDefault();

  var delta = parseInt(e.originalEvent.wheelDelta || -e.originalEvent.detail || (e.originalEvent.deltaY * -40));

  if(($('.news__item--active').next().length) && delta < 0) {
    transform -= 100;

    const active = $('.news__item--active');
    $('.news__item').removeClass('news__item--active');
    active.next().addClass('news__item--active');

    $('.news__item').css({'-webkit-transform' : 'translateX(' + transform + '%)', 'transform' : 'translateX(' + transform + '%)'});
  }

  if(($('.news__item--active').prev().length) && delta > 0) {
    transform += 100;

    const active = $('.news__item--active');
    $('.news__item').removeClass('news__item--active');
    active.prev().addClass('news__item--active');

    $('.news__item').css({'-webkit-transform' : 'translateX(' + transform + '%)', 'transform' : 'translateX(' + transform + '%)'});
  }
});

newsArrowLeft.on('click', function(e) {
  e.preventDefault();

  if($('.news__item--active').prev().length) {
    transform += 100;

    const active = $('.news__item--active');
    $('.news__item').removeClass('news__item--active');
    active.prev().addClass('news__item--active');

    $('.news__item').css({'-webkit-transform' : 'translateX(' + transform + '%)', 'transform' : 'translateX(' + transform + '%)'});
  }
});

newsArrowRight.on('click', function(e) {
  e.preventDefault();

  if($('.news__item--active').next().length) {
    transform -= 100;
  
    const active = $('.news__item--active');
    $('.news__item').removeClass('news__item--active');
    active.next().addClass('news__item--active');
  
    $('.news__item').css({'-webkit-transform' : 'translateX(' + transform + '%)', 'transform' : 'translateX(' + transform + '%)'});
  }
});

formSelect.styler();
