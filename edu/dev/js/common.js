$(function() {

    var screen = $('html,body'),
        screen_fix = 0;

    /******************** 하위브라우저 접근 차단 ********************/

    if (navigator.userAgent.match(/MSIE 8/)) $('.ie8').show();

    /******************** 네비게이션 제어 ********************/

    var nav_open_btn = $('.header_wrap .menu'),
        nav_close_btn = $('nav .close'),
        nav = $('nav');

    //네비게이션 열기
    nav_open_btn.on('click', function() {
        screen.addClass('fixed');
        nav.addClass('on');
        screen_fix = 1;
    });

    //네비게이션 닫기
    nav_close_btn.on('click', function() {
        screen.removeClass('fixed');
        nav.removeClass('on');
        screen_fix = 0;
    });

    //네비게이션, 팝업 오픈시 스크롤 방지
    screen.on('scroll touchmove', function(e) {
        if (screen_fix) return false;
    });

    /******************** 애니메이션 정의 ********************/

    var move_el = $('*[data-animation]'), //무빙 요소
        move_name, //무빙 정의
        move_delay, //순차무빙 딜레이
        move_duration, //순차무빙 시간
        scroll, //스크롤 값
        start_point = $(window).height() * 0.95, //애니메이션 시작 높이(밑에서부터 화면 높이의 5%)
        top_btn = $('.move_top'), //TOP 버튼
        top_btn_flag = 0; //TOP 버튼 상태

    move_el.addClass('wait-animation');
    $(window).on('load scroll', function() {
        scroll = $(this).scrollTop();

        //순차 애니메이션 제어
        move_el.each(function() {
            move_name = $(this).data('animation');
            move_delay = $(this).data('delay') * 100; //단위 0.1초
            move_duration = $(this).data('duration') * 1000; //단위 1초
            $(this).addClass('animated ' + move_name);
            if (move_delay >= 0)
                $(this).css({
                    '-webkit-animation-delay': move_delay + 'ms',
                    'animation-delay': move_delay + 'ms'
                });
            if (move_duration >= 0)
                $(this).css({
                    '-webkit-animation-duration': move_duration + 'ms',
                    'animation-duration': move_duration + 'ms'
                });
            if (scroll > $(this).offset().top - start_point)
                $(this).removeClass('wait-animation');
        });

        //TOP 버튼 제어
        scroll > $(window).height() / 2 ? //TOP 버튼 출현 시점(반 페이지 이상 스크롤)
            top_btn.addClass('on') :
            top_btn.removeClass('on');
        top_btn.find('a').on('click', function() {
            if (top_btn_flag) return false;
            top_btn_flag = 1;
            $('html,body').animate({
                scrollTop: 0
            }, 500, function() {
                top_btn_flag = 0;
            });
            return false;
        });

        //헤더 배경 제어
        scroll ? $('header').addClass('on') : $('header').removeClass('on');
    });

    /******************** 서브 페이지 헤더 제어 ********************/

    $('.sub_header').addClass('on');

});