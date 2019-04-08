$(function () {

    //테이블 제어
    var table = $("table.list");
    table.each(function () {
        $(this).find("tr:gt(0)").hover(function () {
            $(this).addClass("hover");
        }, function () {
            $(this).removeClass("hover");
        }).each(function (e) {
            $("td:eq(0)", this).text(e + 1);
            if ($("td:eq(1)", this).text() != "") $(this).addClass("part");
        }).find("td").each(function () {
            if ($(this).text() == "") $(this).addClass("nodata");
        });
    });

    //작업공정률
    $('.map_wrap').each(function () {
        $(this).find(".process dd").text(Math.ceil(($(this).find("em.end").length - 1) / $(this).find("tbody").children("tr").length * 100) + "%");
    });

    //iframe 내용 및 슬라이드 제어
    // var source;
    // $('#canvas').attr('src', $('.map_wrap:eq(0) table tbody tr:eq(0)').find('a').attr('href'));
    // $('table tbody tr').each(function () {
    //     source = $(this).find('a').attr('href');
    //     $(this).attr('data-src', source);
    // }).on('click', function () {
    //     $('#canvas').attr('src', $(this).attr('data-src'));
    //     $('.slide_wrap').removeClass('on');
    // });
    // $('.slide_wrap .map').on('click', function () {
    //     $('.slide_wrap').addClass('on');
    // });

    //iframe 해상도 제어
    // $('.view li:eq(0) button').addClass('on');
    // $('.view').find('button').on('click', function () {
    //     $('.view button').removeClass('on');
    //     $(this).addClass('on');
    //     $('#canvas').removeClass().addClass($(this).attr('data-view'));
    // });
    
});