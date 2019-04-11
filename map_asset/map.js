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
});