// json2csv
$(document).delegate('#json2csv', 'pageinit', function(event){
    // convert
    $("#json2csv_convert").click(function() {
        var json = $.parseJSON($("#json2csv_json").val());
        var opts = {
          "header" : $("#json2csv_labels").is(':checked'),
          "quote" : $("#json2csv_quote").is(':checked')
        };
        var csv = json2csv(json, opts);
        $("#json2csv_csv").val(csv);
        //$("#json2csv_csv").trigger('propertychange');
        $("#json2csv_csv").trigger('keyup');
    });
    // download
    $("#json2csv_download").click(function() {
        var json = $.parseJSON($("#json2csv_json").val());
        var opts = {
          "header" : $("#json2csv_labels").is(':checked'),
          "quote" : $("#json2csv_quote").is(':checked')
        };
        var csv = json2csv(json, opts);
        //
        var uri = 'data:text/csv;charset=utf-8,' + escape(csv);
        $a = $('<a id="downloadcsv"></a>').attr('href',uri).attr('download',"data.csv").appendTo('body');
        if (typeof($('#downloadcsv').get(0).click) === 'function') {
          $('#downloadcsv').get(0).click();
        } else {
          window.open(uri);
        }
        $('#downloadcsv').remove();
    });
});

// base64encode
$(document).delegate('#base64encode', 'pageinit', function(event){
    // convert
    $("#base64encode_convert").on('click', function() {
        $("#base64encode_result").val( Base64.encode($("#base64encode_content").val()) );
        $("#base64encode_result").trigger('keyup');
    });
});

// base64decode
$(document).delegate('#base64decode', 'pageinit', function(event){
    // convert
    $("#base64decode_convert").on('click', function() {
        $("#base64decode_result").val( Base64.decode($("#base64decode_content").val()) );
        $("#base64decode_result").trigger('keyup');
    });
});

// urlencode
$(document).delegate('#urlencode', 'pageinit', function(event){
    // encodeURI
    $("#urlencode_encodeURI").click(function() {
        $("#urlencode_result").val( encodeURI($("#urlencode_content").val()) );
        $("#urlencode_result").trigger('keyup');
    });
    // encodeURIComponent
    $("#urlencode_encodeURIComponent").click(function() {
        $("#urlencode_result").val( encodeURIComponent($("#urlencode_content").val()) );
        $("#urlencode_result").trigger('keyup');
    });
});

// urldecode
$(document).delegate('#urldecode', 'pageinit', function(event){
    // convert
    $("#urldecode_convert").click(function() {
        $("#urldecode_result").val( decodeURIComponent($("#urldecode_content").val()) );
        $("#urldecode_result").trigger('keyup');
    });
});
