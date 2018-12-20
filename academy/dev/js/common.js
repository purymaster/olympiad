$(function() {

    var screen = $('html,body'),
        screen_fix = 0,
        is_mobile = false; //모바일 판별 변수

    /******************** 하위브라우저 접근 차단 ********************/

    if (navigator.userAgent.match(/MSIE 8/)) $('.ie8').show();

    /******************** 셀렉트박스 제어 ********************/

    var select_from = $('.select_form');

    select_from.find('button').on('click', function() {
        $(this).hasClass('on') ? $(this).removeClass('on') : $(this).addClass('on');
    })
    select_from.find('a').on('click', function() {
        $(this).closest('ul').siblings('button').html($(this).text()).removeClass('on');
    });

    /******************** 모바일 확인 ********************/

    $(window).on('load resize', function() {
        $(this).width() > 1024 ? is_mobile = false : is_mobile = true;
    });

    /******************** 상단 배너 하루 열지 않기 ********************/

    var upper_banner = $('.upper_banner');

    function set_cookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toGMTString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    };

    function get_cookie(cname) {
        var name = cname + "=";
        var decoded_cookie = decodeURIComponent(document.cookie);
        var ca = decoded_cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1);
            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }
        return "";
    }

    function close_banner() {
        upper_banner.removeClass('on');
        $('body').removeClass('upper_banner_on');
        setTimeout(function() {
            upper_banner.hide();
        }, 200);
    };

    (function check_cookie() {
        (get_cookie("no_pop") != "") ?
        (upper_banner.hide(), $('body').removeClass('upper_banner_on')) :
        (upper_banner.addClass('on'), $('body').addClass('upper_banner_on'));
    })();

    upper_banner.find('button').on('click', function() {
        if ($(this).hasClass('today')) set_cookie("no_pop", "y", "1"); // 1일동안 보지 않기
        close_banner();
    });

    /******************** 네비게이션 제어 ********************/

    var nav_open_btn = $('.header_wrap .menu'),
        nav_close_btn = $('nav .close'),
        nav = $('nav'),
        nav_1depth = $('.header_wrap .menu_1depth'), //모바일 1뎁스 메뉴
        nav_2depth = $('.header_wrap .menu_2depth'); //모바일 2뎁스 메뉴

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
        nav_2depth.slideUp();
        screen_fix = 0;
    });

    //네비게이션, 팝업 오픈시 스크롤 방지
    screen.on('scroll touchmove', function(e) {
        if (screen_fix) return false;
    });

    //모바일 네비게이션 제어
    nav_1depth.find('a').on('click', function() {
        if (is_mobile)
            console.log('a');
        $(this).next('.menu_2depth').css('display') == 'block' ?
            $('.header_wrap .menu_2depth').stop().slideUp() :
            ($('.header_wrap .menu_2depth').stop().slideUp(),
                $(this).next('.menu_2depth').stop().slideDown());
    });

    /******************** 스크롤 애니메이션 정의 ********************/

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
        top_btn.find('button').on('click', function() {
            if (top_btn_flag) return false;
            top_btn_flag = 1;
            $('html,body').animate({
                scrollTop: 0
            }, 500, function() {
                top_btn_flag = 0;
            });
            return false;
        });
    });

    $(window).on('load scroll resize', function() {

        //사이드메뉴 제어
        $('.side_menu').stop().animate({
            top: $(this).height() / 2 + $(window).scrollTop()
        }, 1000);

    });

    /******************** 헤더, 서브 페이지 헤더 제어 ********************/

    $('header,.sub_header').addClass('on');

});