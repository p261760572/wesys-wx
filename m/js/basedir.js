window.basedir = '/p';

(function() {
	
    var flow = [];
    function start(type, flowId, param, step) {
		$$.request('/action/bm/flow_step/list', {
			type: type,
			flow_id: flowId
		}, {
			success: function(data) {
				if (data.errcode == 0) {
					flow = data.flow;
				} else {
					
				}
			}
		});
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
            //var flow = flows[flowId];

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
	/*
    var flowConfig = [{
        busi_type: 'SDZL',
        acq_inst_id: '48215500',
        flow: 'sd'
    }, {
        busi_type: 'SDJL',
        acq_inst_id: '48215500',
        flow: 'sd'
    }, {
        busi_type: 'DMF',
        acq_inst_id: '48215500',
        flow: 'dmf'
    }, {
        busi_type: 'SD',
        acq_inst_id: '48025500',
        flow: 'sd'
    }];
	
    function findFlow(busi_type, acq_inst_id) {
        for (var i = 0; i < flowConfig.length; i++) {
            var config = flowConfig[i];
            if (config.busi_type == busi_type && config.acq_inst_id == acq_inst_id) {
                return config.flow;
            }
        }

        return null;
    }*/

    function start(busi_type, acq_inst_id) {
        
		$$.request('/action/bm/acq-inst-busi/view', {
			acq_inst_id: acq_inst_id,
			busi_type: busi_type
		}, {
			success: function(data) {
				if (data.errcode == 0) {
					var flowId = data.data.flow_id;
					flows.start('BUSI', flowId, {
						busi_type: busi_type,
						acq_inst_id: acq_inst_id
					});
				} else {
					
				}
			}
		});
    }

    window.flows.busi = {
        start: start
    };
})();
