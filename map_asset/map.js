$(function () {

    //테이블 제어
    var table = $("table.list"),
        project_name,
        page_id,
        markup_src_01 = "<a class='pc' href='",
        markup_src_02 = "/dev/html/",
        markup_src_03 = ".html' target='_blank' title='새창열림'>PC</a><a class='mobile' href='mobile_viewer.html?url=",
        markup_src_04 = ".html' target='_blank' title='새창열림'>모바일</a>",
        markup_link;

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

        project_name = $(this).data('name');

        $(this).find("tr").each(function () {
            page_id = $(this).find('td:eq(5)').text();
            markup_link =
                markup_src_01 +
                project_name +
                markup_src_02 +
                page_id +
                markup_src_03 +
                project_name +
                markup_src_02 +
                page_id +
                markup_src_04;
            if ($(this).find('.ico').hasClass('end'))
                $(this).find('td:last-child').html(markup_link);
        });
    });

    //작업공정률
    $('.map_wrap').each(function () {
        $(this).find(".process dd").text(Math.ceil(($(this).find("em.end").length - 1) / $(this).find("tbody").children("tr").length * 100) + "%");
    });
});