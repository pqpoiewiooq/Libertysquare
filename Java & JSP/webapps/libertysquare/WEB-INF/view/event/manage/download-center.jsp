<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<article class="download-center-container">
    <h1 class="document-header">다운로드 센터</h1>
    <h2 class="document-title">참가자 목록</h2>
    <div class="download-center-desc">참가자 목록을 XLSX 파일로 내려받습니다. 아래 버튼을 누르면 다운로드가 시작되고 다운로드 기록이 남습니다. 파일이 유출되어 발생하는 문제는 주최자에게 책임이 있습니다. 따라서 관계자만 열람할 수 있도록 취급을 주의해주시고, 사용을 완료한 후에는 파일의 모든 복사본을 삭제해주시기 바랍니다.</div>
    <div class="download-center-text">* 참가자 정보와 티켓 옵션 결과가 포함되어 있습니다.</div>
    <button type="button" class="download-center-button">
        <svg viewBox="0 0 384 512" height="1em" width="1em" aria-hidden="true" focusable="false" fill="currentColor" class="valign-down"><path fill="currentColor" d="M369.9 97.9L286 14C277 5 264.8-.1 252.1-.1H48C21.5 0 0 21.5 0 48v416c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V131.9c0-12.7-5.1-25-14.1-34zM332.1 128H256V51.9l76.1 76.1zM48 464V48h160v104c0 13.3 10.7 24 24 24h104v288H48zm212-240h-28.8c-4.4 0-8.4 2.4-10.5 6.3-18 33.1-22.2 42.4-28.6 57.7-13.9-29.1-6.9-17.3-28.6-57.7-2.1-3.9-6.2-6.3-10.6-6.3H124c-9.3 0-15 10-10.4 18l46.3 78-46.3 78c-4.7 8 1.1 18 10.4 18h28.9c4.4 0 8.4-2.4 10.5-6.3 21.7-40 23-45 28.6-57.7 14.9 30.2 5.9 15.9 28.6 57.7 2.1 3.9 6.2 6.3 10.6 6.3H260c9.3 0 15-10 10.4-18L224 320c.7-1.1 30.3-50.5 46.3-78 4.7-8-1.1-18-10.3-18z"></path></svg>
        참가자 목록 내려받기
    </button>
</article>
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.14.3/xlsx.full.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js"></script>
<script>
(function() {
    const exportFileName = "libertysquare-attendees-for-event-<%= eventID %>.xlsx";
    const sheetName = "참가자 목록";

    var downloadButton = document.querySelector(".download-center-button");
    downloadButton.addEventListener('click', function() {
        majax.do("/attendant", "GET", "w=list&eventID=<%= eventID %>&type=APPROVE", function(xhr) {
            var json = JSON.parse(xhr.responseText);

            if(json.length != 0) {
                exportExcel(json);
                //_exportExcelHtml(json);
                //document.body.innerHTML = _createExcelHtml(json);
            } else {
                alert('참가자 정보가 없습니다.');
            }
        }, function(xhr) {
            alert("정보를 불러오는데 실패하였습니다.");
        });
    });

    function exportExcel(data) {
        var wb = XLSX.utils.book_new();
        
        var aoa = createWorksheet(data);
        var sheet = XLSX.utils.aoa_to_sheet(aoa);

        XLSX.utils.book_append_sheet(wb, sheet, sheetName);

        const xlsxOptions = {bookType: 'xlsx', type: 'binary'};
        var wb_out = XLSX.write(wb, xlsxOptions);

        const blobOptions = { type: "application/octet-stream" };
        var ab = toArrayBuffer(wb_out);

        saveAs(new Blob([ab], blobOptions), exportFileName);
    }

    function toArrayBuffer(s) {
        var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
        var view = new Uint8Array(buf);  //create uint8array as viewer
        for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
        return buf;
    }

    function createWorksheet(dataset) {
        var worksheet = [["이름", "휴대폰", "티켓", "티켓 설명", "Ticket ID", "발행시각", "체크인"]];

        for(var map of dataset) {
            var user = map.user;
            var ticket = map.ticket;
            
            for(var paymentDataList of map.payment) {
                for(var attendant of paymentDataList) {
                    var row = new Array();
                    row.push(user.nickname);
                    row.push(user.id);
                    row.push(ticket.name);
                    row.push(ticket.desc);
                    row.push(attendant.id);
                    row.push(attendant.paymentTime);
                    row.push(attendant.state == "ATTEND" ? "Yes" : "No");
                    worksheet.push(row);
                }
            }
        }

        return worksheet;
    }


    function _exportExcelHtml(dataset) {
        var html = '';
        html += '<html xmlns:x="urn:schemas-microsoft-com:office:excel">';
        html +=  '<head>';
        html +=   '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
        html +=   '<xml>';
        html +=    '<x:ExcelWorkbook>';
        html +=     '<x:ExcelWorksheets>';
        html +=      '<x:ExcelWorksheet>';
        html +=       '<x:Name>' + sheetName + '</x:Name>';
        html +=       '<x:WorksheetOptions><x:Panes></x:Panes></x:WorksheetOptions>';
        html +=      '</x:ExcelWorksheet>';
        html +=     '</x:ExcelWorksheets>';
        html +=    '</x:ExcelWorkbook>';
        html +=   '</xml>';
        html +=  '</head>';
        html +=  '<body>';

        html += _createExcelHtml(dataset);

        html +=  '</body>';
        html += '</html>';

        var data_type = 'data:application/vnd.ms-excel';
        const blobOptions = {type: "application/csv;charset=utf-8;"};
        saveAs(new Blob([html], blobOptions), exportFileName);
    }

    function _createExcelHtml(dataset) {
        var table = '';
        table += '<table border="1">';
        table +=  '<thead>';
        table +=   '<tr>';
        table +=    '<th>이름</th>';
        table +=    '<th>휴대폰</th>';
        table +=    '<th>티켓</th>';
        table +=    '<th>티켓 설명</th>';
        table +=    '<th>Ticket ID</th>';
        table +=    '<th>발행시각</th>';
        table +=    '<th>체크인</th>';
        table +=   '</tr>';
        table +=  '</thead>';
        table +=  '<tbody>';

        for(var map of dataset) {
            var user = map.user;
            var ticket = map.ticket;
            
            for(var paymentDataList of map.payment) {
                for(var attendant of paymentDataList) {
                    table += '<tr>';
                    table +=  '<td>' + user.nickname + '</td>';
                    table +=  '<td>' + user.id + '</td>';
                    table +=  '<td>' + ticket.name + '</td>';
                    table +=  '<td>' + ticket.desc + '</td>';
                    table +=  '<td>' + attendant.id + '</td>';
                    table +=  '<td>' + attendant.paymentTime + '</td>';
                    table +=  '<td>' + (attendant.state == "ATTEND" ? "Yes" : "No") + '</td>';
                    table += '</tr>';
                }
            }
        }

        table +=  '</tbody>';
        table += '</table>';

        return table;
    }
}());
</script>
<!-- https://eblo.tistory.com/84 -->
<!-- https://programmer93.tistory.com/67 -->
<!-- https://blog.acronym.co.kr/367 -->


<!-- https://royzero.tistory.com/38  하드코딩으로 엑셀-->
<!-- https://demo.grapecity.co.kr/spreadjs/learn-spreadjs/features/workbook/excel-import-export/purejs -->