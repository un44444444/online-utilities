function json2csv(objArray, opts) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var options = {
        "header" : true,
        "quote" : true
    };
    for(var key in opts)
        if(opts.hasOwnProperty(key))
            options[key] = opts[key]

    var str = '';
    var line = '';

    if (options.header) {
        var head = array[0];
        if (options.quote) {
            for (var index in array[0]) {
                var value = index + "";
                line += '"' + value.replace(/"/g, '""') + '",';
            }
        } else {
            for (var index in array[0]) {
                line += index + ',';
            }
        }

        line = line.slice(0, -1);
        str += line + '\r\n';
    }

    for (var i = 0; i < array.length; i++) {
        var line = '';

        if (options.quote) {
            for (var index in array[i]) {
                var value = array[i][index] + "";
                line += '"' + value.replace(/"/g, '""') + '",';
            }
        } else {
            for (var index in array[i]) {
                line += array[i][index] + ',';
            }
        }

        line = line.slice(0, -1);
        str += line + '\r\n';
    }
    return str;
}