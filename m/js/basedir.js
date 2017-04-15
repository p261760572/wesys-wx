window.basedir = '/p';

(function() {
	
    function start(type, flowId, param, step) {
		$$.request('/action/bm/flow-step/list', {
			type: type,
			flow_id: flowId
		}, {
			success: function(data) {
				if (data.errcode == 0) {
					var flow = data.flow;
					var step = step || 1;
					var query = $$.parseQueryString();
					$.extend(query, param || {});

					if (flow.length >= step) {
						window.location.href = flow[step - 1].url+'?'+$.param(query)+'#step/'+type+'/'+flowId+'/'+step;
					} else {
						console.warn(flow);
					}
				}
			}
		});
    }

    function _go(diff, param) {
        var hash = window.location.hash;

        if (hash.substr(0, 6) == '#step/') {
            var arr = hash.substr(6).split('/');
            var flowId = arr[1];
            var step = parseInt(arr[2]);
			var type = arr[0];
            step += diff;

            var query = $$.parseQueryString();
			start(type, flowId, query, step);
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
