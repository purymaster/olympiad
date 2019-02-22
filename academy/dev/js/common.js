$(function() {

    var screen = $('html,body'),
        screen_fix = false,
        is_mobile = false, //모바일 판별 변수
        is_android_user = false, // useragent 안드로이드 판별 변수
        table_width;

    /******************** Useragent 체크 ********************/

    var android_validator = new Array('Android', 'LG', 'MOT', 'SAMSUNG', 'SonyEricsson');
    for (var word in android_validator) {
        if (navigator.userAgent.match(android_validator[word]) !== null) is_android_user = true;
    }

    /******************** 하위브라우저 접근 차단 ********************/

    if (navigator.userAgent.match(/MSIE 8/)) $('.ie8').show();

    /******************** 셀렉트박스 제어 ********************/

    var select_form = $('.select_form');

    select_form.on('click', 'button', function() {
        $(this).toggleClass('on');
    }).on('click', 'a', function() {
        $(this).closest('ul').siblings('button').html($(this).text()).removeClass('on');
    });
    $(document).on('mouseup', function(e) {
        if (!select_form.is(e.target) && select_form.has(e.target).length === 0)
            select_form.find('button').removeClass('on');
    });

    /******************** 모바일 판별 및 데이터 테이블 너비 적용 ********************/

    $(window).on('load resize', function() {
        window.outerWidth > 1024 ? is_mobile = false : is_mobile = true;
        $('.data_table').each(function() {
            table_width = $(this).data('width');
            window.outerWidth > 1024 ? $(this).find('table').css('width', '') : $(this).find('table').css('width', table_width);
        })
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
            while (c.charAt(0) === ' ') c = c.substring(1);
            if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
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
        get_cookie("no_pop") !== "" ?
            (upper_banner.hide(),
                $('body').removeClass('upper_banner_on')) :
            (upper_banner.addClass('on'),
                $('body').addClass('upper_banner_on'));
    })();

    upper_banner.find('button').on('click', function() {
        if ($(this).hasClass('today')) set_cookie("no_pop", "y", "1"); // 1일동안 보지 않기
        close_banner();
    });

    /******************** 네비게이션 제어 ********************/

    var nav = $('nav'),
        nav_2depth = $('.header_wrap .menu_2depth'); //모바일 2뎁스 메뉴

    //네비게이션 제어
    $('.header_wrap').on('click', 'button', function() {
        $('.group_nav').find('input').val('');
        nav_2depth.hide();
        $(this).hasClass('menu') ?
            (screen.addClass('fixed'),
                nav.addClass('on'),
                screen_fix = true) :
            (screen.removeClass('fixed'),
                nav.removeClass('on'),
                screen_fix = false)
    });

    //네비게이션, 팝업 오픈시 스크롤 방지
    screen.on('scroll touchmove', function(e) {
        if (screen_fix) return false;
    });

    //모바일 네비게이션 제어
    $('.header_wrap .menu_1depth > li > a').on('click', function() {
        if (is_mobile) {
            $(this).next('.menu_2depth').css('display') === 'block' ?
                nav_2depth.stop().slideUp() :
                (nav_2depth.stop().slideUp(),
                    $(this).next('.menu_2depth').stop().slideDown());
            return false;
        };
    });

    $(window).on('resize', function() {
        if (!is_android_user)
            is_mobile ?
            (nav.removeClass('on'),
                $('.header_wrap .menu').blur(),
                $('.group_nav').find('input').val === '',
                nav_2depth.hide()) :
            nav_2depth.show();
    });

    /******************** 서브 페이지 내용 탭메뉴 정의 ********************/

    //페이지 이동이 필요없는 탭메뉴는 button 태그 사용
    //페이지 이동이 필요한 탭메뉴는 a 태그 사용하고 페이지 링크로 처리
    //아래의 스크립트는 button 태그로 구성한 페이지에만 대응

    var view_btn = $('.sub_lower_wrap .tab_menu button'),
        view_list = $('.sub_lower_wrap .tab_menu li'),
        view_data;

    $('.tab_view:eq(0)').show();
    if (view_list.has('button')) view_list.eq(0).addClass('on');

    view_btn.on('click', function() {
        view_data = $(this).parents('li').index();
        $('.tab_view').hide();
        view_list.removeClass('on');
        $('.tab_view:eq(' + view_data + ')').show();
        $(this).parents('li').addClass('on');
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
            TweenLite.to($('html,body'), .5, {
                scrollTop: 0,
                onComplete: function() {
                    top_btn_flag = 0;
                }
            })
            return false;
        });
    });

    $(window).on('load scroll resize', function() {

        //사이드메뉴 제어
        TweenLite.to($('.side_menu'), 3, {
            top: $(this).height() / 2 + $(window).scrollTop(),
            ease: Elastic.easeOut.config(.25, .25)
        })
    });
});