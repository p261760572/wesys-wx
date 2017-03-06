
(function($) {
    //加载数据
    function loadData(target, data) {
        var state = $.data(target, 'select2');
        var opts = state.options;
        state.data = opts.loadFilter.call(target, data);
        data = state.data || [];

        var dd = ['<option value="">--请选择--</option>'];
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            var value = item[opts.valueField];
            var text = item[opts.textField];

            dd.push('<option value="' + value + '">');
            dd.push(opts.formatter ? opts.formatter.call(target, item) : text);
            dd.push('</option>');
        }
        $(target).html(dd.join(''));
        opts.onLoadSuccess.call(target, data);
    }

    //请求远程数据
    function request(target, url, param) {
        var opts = $.data(target, 'select2').options;
        if (url) {
            opts.url = url;
        }
        if (!opts.url)
            return;
        param = param || {};

        if (opts.onBeforeLoad.call(target, param) == false)
            return;

        $.ajax({
            type: opts.method,
            url: opts.url,
            data: $.toJSON(param),
            contentType: 'application/json',
            dataType: 'json',
            success: function(data) {
                if($$.errcode(data) == 0) {
                    loadData(target, data.rows);
                } else {
                    opts.onLoadError.call(this, data);
                }
            }
        });
    }

    $.fn.select2 = function(options, param) {
        if (typeof options == 'string') {
            return $.fn.select2.methods[options](this, param);
        }

        options = options || {};
        return this.each(function() {
            var state = $.data(this, 'select2');
            var opts;
            
            if (state) {
                opts = $.extend(state.options, options);
            } else {
                opts = $.extend({}, $.fn.select2.defaults, $.fn.select2.parseOptions(this), options);
                state = $.data(this, 'select2', {
                    options: opts,
                    data: []
                });
            }
            
            if (opts.data) {
                loadData(this, opts.data);
            }
            request(this);
        });
    };


    $.fn.select2.methods = {
        options: function(jq) {
            return $.data(jq[0], 'select2').options;
        },
        getData: function(jq) {
            return $.data(jq[0], 'select2').data;
        },
        clear: function(jq) {
            return jq.each(function() {
                $(this).html('');
            });
        },
        loadData: function(jq, data) {
            return jq.each(function() {
                loadData(this, data);
            });
        },
        reload: function(jq, url) {
            return jq.each(function() {
                request(this, url);
            });
        }
    };

    $.fn.select2.parseOptions = function(target) {
        return $.extend({}, $.parser.parseOptions(target));
    };

    $.fn.select2.defaults = {
        valueField: 'value',
        textField: 'text',
        mode: 'local', // or 'remote'
        method: 'post',
        url: null,
        data: null,
        formatter: function(row) {
            var opts = $(this).select2('options');
            return row[opts.textField];
        },
        loadFilter: function(data) {
            return data;
        },
        onBeforeLoad: function(param) {},
        onLoadSuccess: function() {},
        onLoadError: function() {}
    };
})(jQuery);
