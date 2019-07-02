function changeSelectBox(object) {
    return;
}

$(function () {

    var screen = $('html,body'),
        screen_fix = 0;

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
            window.outerWidth > 1024 ? $(this).find('table').css('min-width', '') : $(this).find('table').css('min-width', table_width);
        })
    }).resize();

    /******************** 네비게이션 제어 ********************/

    var nav_open_btn = $('.header_wrap .menu'),
        nav_close_btn = $('nav .close'),
        nav = $('nav');

    //네비게이션 열기
    nav_open_btn.on('click', function () {
        screen.addClass('fixed');
        nav.addClass('on');
        screen_fix = 1;
    });

    //네비게이션 닫기
    nav_close_btn.on('click', function () {
        screen.removeClass('fixed');
        nav.removeClass('on');
        screen_fix = 0;
    });

    //네비게이션, 팝업 오픈시 스크롤 방지
    screen.on('scroll touchmove', function () {
        if (screen_fix) return false;
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
        scroll ? $('header').addClass('on') : $('header').removeClass('on');
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