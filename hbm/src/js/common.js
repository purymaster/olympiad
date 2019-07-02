function changeSelectBox(object) {
    return;
}

$(function () {

    var screen = $('html,body'),
        screen_fix = false,
        is_mobile = false, //모바일 판별 변수
        is_mobile_user = false, //useragent 모바일 판별 변수
        table_width;

    /******************** Useragent 체크 ********************/

    var mobile_validator = new Array('iPhone', 'iPod', 'iPad', 'BlackBerry', 'Android', 'Windows CE', 'LG', 'MOT', 'SAMSUNG', 'SonyEricsson');
    for (var word in mobile_validator) {
        if (navigator.userAgent.match(mobile_validator[word]) !== null) is_mobile_user = true;
    }

    /******************** 모달 팝업창 제어 ********************/

    var modal_src;

    $('.open_modal').on('click', function () {
        modal_src = $(this).data('modal');
        $('.modal_wrap').addClass('on');
        $('.modal').hide();
        $('#' + modal_src).fadeIn();
    });

    $('.modal').find('button[data-move="close"]').on('click', function () {
        modal_src = '';
        $('.modal_wrap').removeClass('on');
        $('.modal').fadeOut();
    });

    /******************** 셀렉트박스 제어 ********************/

    var select_form = $('.select_form');

    select_form.on('click', 'button[type="button"]', function () {
        ($(this).hasClass('on')) ?
            select_form.find('button').removeClass('on') :
            (select_form.find('button').removeClass('on'), $(this).addClass('on'));
    }).on('click', 'a', function () {
        $(this).closest('ul').siblings('button').removeClass('on').find('span').html($(this).text());
        $(this).closest('.select_form').find('input[type=hidden]').val($(this).attr('value'));
        changeSelectBox($(this).closest('.select_form').find('input[type=hidden]'));
        if (!$(this).parents('ol').hasClass('hyper')) return false;
    });

    $(document).on('mouseup touchend', function (e) {
        if (!select_form.is(e.target) && select_form.has(e.target).length === 0)
            select_form.find('button').removeClass('on');
    });

    /******************** 모바일 판별 및 데이터 테이블 너비 적용 ********************/

    $(window).on('load resize', function () {
        window.outerWidth > 1024 ? is_mobile = false : is_mobile = true;
        $('.data_table').each(function () {
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
        setTimeout(function () {
            upper_banner.hide();
        }, 200);
    };

    (function check_cookie() {
        get_cookie("no_pop_hbm") !== "" ?
            (upper_banner.hide(),
                $('body').removeClass('upper_banner_on')) :
            (upper_banner.addClass('on'),
                $('body').addClass('upper_banner_on'));
    })();

    upper_banner.find('button').on('click', function () {
        if ($(this).hasClass('today')) set_cookie("no_pop_hbm", "y", "1"); // 1일동안 보지 않기
        close_banner();
    });

    /******************** 헤더 검색창 제어 ********************/

    var search_box = $('header .search_keyword .search_box');

    $('.search_keyword').on('click', '.search', function () {
        $(this).toggleClass('on');
        search_box.toggleClass('on').find('input[type="text"]').val('');
    });

    /******************** 네비게이션 제어 ********************/

    var nav = $('nav'),
        nav_2depth = $('.header_wrap .menu_2depth'); //모바일 2뎁스 메뉴

    //네비게이션 제어
    $('.header_wrap').on('click', 'button[type="button"]', function () {
        $('.group_nav').find('input').val('');
        $(this).hasClass('open_menu') ?
            (nav_2depth.hide(),
                screen.addClass('fixed'),
                nav.addClass('on'),
                screen_fix = true) :
            (screen.removeClass('fixed'),
                nav.removeClass('on'),
                $('.navigation a').removeClass('on'),
                screen_fix = false)
    });

    //네비게이션, 팝업 오픈시 스크롤 방지
    screen.on('scroll touchmove', function (e) {
        if (screen_fix) return false;
    });

    //모바일 네비게이션 제어
    $('.navigation a').each(function () {
        if ($(this).next().is('ul')) $(this).addClass('has_sub');
    });

    $('.header_wrap .menu_1depth > li > a').on('click', function () {
        if (is_mobile) {
            $(this).next('.menu_2depth').css('display') === 'block' ?
                (nav_2depth.stop().slideUp(),
                    $('.menu_1depth').find('a').removeClass('on')) :
                (nav_2depth.stop().slideUp(),
                    $('.menu_1depth').find('a').removeClass('on'),
                    $(this).addClass('on').next('.menu_2depth').stop().slideDown());
            return false;
        }
    });

    $(window).on('resize', function () {
        if (!is_mobile_user)
            is_mobile ?
                (nav.removeClass('on'),
                    $('.header_wrap .menu').blur(),
                    $('.group_nav').find('input').val === '',
                    nav_2depth.hide(),
                    $('.navigation a').removeClass('on')) :
                (nav_2depth.show(),
                    screen.removeClass('fixed'),
                    screen_fix = false,
                    $('.modal').find('button[data-move="close"]').trigger('click')
                );
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

    view_btn.on('click', function () {
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
    $(window).on('load scroll', function () {
        scroll = $(this).scrollTop();

        //순차 애니메이션 제어
        move_el.each(function () {
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

        //헤더 배경 제어
        scroll ? $('.header,.search_keyword').addClass('on') : $('.header,.search_keyword').removeClass('on');

    });

    /******************** Datepicker ********************/

    $('.datepicker').datepicker({
        dateFormat: 'yy-mm-dd',
        showMonthAfterYear: true,
        monthNamesShort: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
        dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
        buttonText: "선택",
        yearSuffix: "년"
    });

    /******************** FAQ 제어 ********************/

    var faq_list = $('.faq_list .faq');

    faq_list.find('dt').on('click', function () {
        $(this).parents('.faq').hasClass('on') ?
            faq_list.removeClass('on').find('dd').stop().slideUp() :
            (
                faq_list.removeClass('on').find('dd').stop().slideUp(),
                $(this).parents('.faq').addClass('on').find('dd').stop().slideDown()
            );
    });

});