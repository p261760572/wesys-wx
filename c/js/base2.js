(function() {
    window.$$ = {};
    window.basedir = '/p';

    $$.wrapUrl = function(url) {
        return window.basedir ? window.basedir + url : url;
    }

    $$.errcode = function(data) {
        return data.errcode;
    };

    $$.errmsg = function(data) {
        return data.errmsg;
    };

    //解析查询字符串
    $$.parseQueryString = function() {
        var query = {};
        var queryString = window.location.search.substr(1);
        if (queryString.length > 0) {
            var pairs = queryString.split('&');
            for (var i = 0; i < pairs.length; i++) {
                var pair = pairs[i].split('=');
                if (pair.length < 2) {
                    pair[1] = "";
                }
                query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1].replace(/\+/g, ' '));
            }
        }
        return query;
    };

    //POST请求
    $$.request = function(url, data, success, error) {
        axios.post($$.wrapUrl(url), data).then(function(response) {
            var data = response.data;
            if ($$.errcode(data) == 0) {
                success(data)
            } else if (error) {
                error(data);
            } else if (vm) {
                vm.$message({
                    showClose: true,
                    message: $$.errmsg(data),
                    type: 'error'
                });
            }
        }).catch(function(error) {
            console.log(error);
        });
    };

    $$.extend = function(target) {
        var args = Array.prototype.slice.call(arguments, 1);
        for (var i = 0; i < args.length; i++) {
            var source = args[i];
            for (var key in source) {
                if (source[key] !== undefined) target[key] = source[key];
            }
        }

        return target
    }

    $$.formatField = function(rows, value, valueField, textField) {
        valueField = valueField || 'value';
        textField = textField || 'text';
        for (var i = 0; i < rows.length; i++) {
            if (rows[i][valueField] == value) {
                return rows[i][textField];
            }
        }
        return null;
    };
})();
