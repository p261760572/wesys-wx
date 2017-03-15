window.basedir = '/p';

var InNetPages = [
	{
		url: 'base-info.html',
		step: '0',
		_Complete: $.noop,
		_BeforeChange: $.noop,
		_Exit: $.noop,
		key: ['mchnt_id']
	},
	{
		url: 'busi-apply.html',
		step: '1',
		_Complete: $.noop,
		_BeforeChange: $.noop,
		_Exit: $.noop,
		key: ['busi_type']
	},
	{
		url: 'credit.html',
		step: '2',
		_Complete: $.noop,
		_BeforeChange: $.noop,
		_Exit: $.noop,
		key: ['mchnt_id', 'mchnt_param_id']
	},
	{
		url: 'settle.html',
		step: '3',
		_Complete: $.noop,
		_BeforeChange: $.noop,
		_Exit: $.noop,
		key: []
	}
];

function SearchPageIndex(PageArr, match, value) {
	if(!$.isArray(PageArr)) {
		return false;
	}
	PageArr.sort(function (a, b) {
		return a.step - b.step;
	});
	for(var i=0; i<PageArr.length; i++) {
		if(PageArr[i][match] == value) {
			return i;
		}
	}
	return null;
}

function _introForPage(targetElm, step) {
    var introItems = [];
	if (typeof (step) == 'undefined') {
	  step = 0;
	} 
    if (true) {
      //use steps passed programmatically
		var local_href = window.location.href.match(/[\w\-\_]+[\.](html)/)[0];
		var index = SearchPageIndex(InNetPages, 'url', local_href);
		for (var i = index-step, stepsLength = InNetPages.length; i < stepsLength; i++) {
			var currentItem = _cloneObject(InNetPages[i]);
			//set the step
			currentItem.step = introItems.length;
			//use querySelector function only when developer used CSS selector
			if (currentItem.url != null) {
				introItems.push(currentItem);
			}
		}
    } else {
      //use steps from data-* annotations
		var allIntroSteps = targetElm.querySelectorAll('*[data-intro]');
		//if there's no element to intro
		if (allIntroSteps.length < 1) {
			return false;
		}

		//first add intro items with data-step
		for (var i = 0, elmsLength = allIntroSteps.length; i < elmsLength; i++) {
			var currentElement = allIntroSteps[i];
			// skip hidden elements
			if (currentElement.style.display == 'none') {
				continue;
			}
			var step = parseInt(currentElement.getAttribute('data-step'), 10);

			if (step > 0) {
			  introItems[step - 1] = {
				  element: currentElement,
				  step: parseInt(currentElement.getAttribute('data-step'), 10)-1
			  };
			}
		}
	}
	/*	//Ok, sort all items with given steps
	introItems.sort(function (a, b) {
		return a.step - b.step;
	});*/

	//set it to the introJs object
	//add overlay layer to the page
	return introItems;
}

function _cloneObject(object) {
	if (object == null || typeof (object) != 'object' || typeof (object.nodeType) != 'undefined') {
		return object;
	}
	var temp = {};
	for (var key in object) {
		temp[key] = object[key];
	}
	return temp;
}

/**
* Go to next step on intro
*
* @api private
* @method _nextStep
*/
function _nextStep(targetElm, step, option1, option2) {
	var _currentStep = {}, nextStep = {};
	option1 = option1 || {};
	option2 = option2 || {};
	step  = step || 0;
	var _direction = 'forward';
	var _introItems = _introForPage(targetElm, step);
	$.extend(_currentStep, _introItems[step], option1);
	if (typeof (_currentStep._Complete) == 'function') {
		var params = _currentStep._Complete(_currentStep);
	}
	if (_introItems.length <= step+1) {
	  //end of the intro
	  //check if any callback is defined
		_exitIntro(_currentStep);
		return;
	}
	$.extend(nextStep, _introItems[++step], option2);
	_showElement(nextStep, params);
}

/**
* Go to previous step on intro
*
* @api private
* @method _previousStep
*/
function _previousStep(targetElm, step, option1, option2) {
	var _currentStep = {}, nextStep = {};
	option1 = option1 || {};
	option2 = option2 || {};
	step = step || 0;
	var _direction = 'backward';
	var _introItems = _introForPage(targetElm, step);
	$.extend(_currentStep, _introItems[step], option1);
	if (step == 0) {
	  return false;
	}
	if (typeof (_currentStep._Complete) == 'function') {
		var params = _currentStep._Complete(_currentStep);
	}
	
	$.extend(nextStep, _introItems[--step], option2);

	_showElement(nextStep, params);
}

/**
* Exit from intro
*
* @api private
* @method _exitIntro
* @param {Object} targetElement
*/
function _exitIntro(_currentStep) {
//remove overlay layers from the page
	//check if any callback is defined
	if (_currentStep._Exit != undefined) {
	  _currentStep._Exit(_currentStep);
	}

	//set the step to zero
	_currentStep.step = undefined;
}

function _getProgress(_introItems, step) {
// Steps are 0 indexed
	step = step || 0;
	var currentStep = parseInt((step + 1), 10);
	return ((currentStep / _introItems.length) * 100);
}

function _showElement(targetElement, params) {
	window.location.href = targetElement.url+(params?'?'+params:'');
	if (typeof (targetElement._BeforeChange) != 'undefined') {
		window.onload = targetElement._BeforeChange(targetElement);
	}
}
	