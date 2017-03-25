window.basedir = '/p';

(function() {

    var flows = {
        sd: [{
            url: 'mchnt.html'
        }, {
            url: 'fee.html'
        }, {
            url: 'account.html'
        }, {
            url: '../../index.html'
        }],
        dmf: [{
            url: 'mchnt.html'
        }, {
            url: 'fee.html'
        }, {
            url: 'account.html'
        }, {
            url: '../../index.html'
        }]
    };


    function start(flowId, param, step) {
        var flow = flows[flowId];
        var step = step || 1;

        var query = $$.parseQueryString();
        $.extend(query, param || {});

        if (flow.length >= step) {
            window.location.href = flow[step - 1].url + '?' + $.param(query) + '#step/' + flowId + '/' + step;
        } else {
            console.warn(flow);
        }
    }

    function _go(diff, param) {
        var hash = window.location.hash;

        if (hash.substr(0, 6) == '#step/') {
            var arr = hash.substr(6).split('/');
            var flowId = arr[0];
            var step = parseInt(arr[1]);
            var flow = flows[flowId];

            step += diff;

            console.log(flow);

            var query = $$.parseQueryString();
            $.extend(query, param || {});

            if (flow.length >= step) {
                window.location.href = flow[step - 1].url + '?' + $.param(query) + '#step/' + flowId + '/' + step;
            } else {
                console.warn(flow);
            }
        }
    }

    function next(param) {
        _go(1, param);
    }

    function prev(param) {
        _go(-1, param);
    }

    window.flows = {
        start: start,
        next: next,
        prev: prev
    };
})();


(function() {
    var flowConfig = [{
        busi_type: 'SD',
        acq_inst_id: '48215500',
        flow: 'sd'
    }, {
        busi_type: 'DMF',
        acq_inst_id: '48215500',
        flow: 'dmf'
    }];


    function findFlow(busi_type, acq_inst_id) {
        for (var i = 0; i < flowConfig.length; i++) {
            var config = flowConfig[i];
            if (config.busi_type == busi_type && config.acq_inst_id == acq_inst_id) {
                return config.flow;
            }
        }

        return null;
    }

    function start(busi_type, acq_inst_id) {
        var flowId = findFlow(busi_type, acq_inst_id);
        flows.start(flowId, {
            busi_type: busi_type,
            acq_inst_id: acq_inst_id
        });
    }

    window.flows.busi = {
        start: start
    };
})();
