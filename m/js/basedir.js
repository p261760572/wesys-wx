window.basedir = '/p';

var InNetPages = [
	{
		url: 'base-info.html',
		step: '1',
		next: 'acq-busi.html',
		pre: '',
		before_call: '',
		after_call: '',
		key: ['mchnt_id']
	},
	{
		url: 'busi-apply.html',
		step: '',
		next: 'credit.html',
		pre: 'base-info.html',
		before_call: '',
		after_call: '',
		key: []
	},
	{
		url: 'credit.html',
		step: '2',
		next: 'settle.html',
		pre: 'busi-apply.html',
		before_call: '',
		after_call: '',
		key: ['mchnt_id', 'mchnt_param_id']
	},
	{
		url: 'settle.html',
		step: '3',
		next: '',
		pre: 'credit.html',
		before_call: '',
		after_call: '',
		key: []
	}
];

function SearchPageIndex(PageArr, match, value, index) {
	if(!$.isArray(PageArr)) {
		return false;
	}
	PageArr.sort(function (a, b) {
		return a.step - b.step;
	});
	for(var i=0; i<PageArr.length; i++) {
		if(PageArr[i][match] === value) {
			index = i;
			return PageArr[i];
		}
	}
	return null;
}

function _introForPage(targetElm) {
    var introItems = [];

    if (true) {
      //use steps passed programmatically
		var index;
		var local_href = window.location.href.match('/[\w]+[\.](html)/');
		SearchPageIndex(InNetPages, 'url', local_href, index);
		for (var i = index, stepsLength = InNetPages.length; i < stepsLength; i++) {
			var currentItem = _cloneObject(InNetPages[i]);
			//set the step
			currentItem.step = introItems.length;
			//use querySelector function only when developer used CSS selector
			if (currentItem.url !== null) {
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
function _nextStep(_introItems, step) {
	var _direction = 'forward';
	var index;
	if (typeof (step) !== 'undefined') {
		var _currentStep = SearchPageIndex(_introItems, 'step', step, index);
	} else{
	  step = 0;
	} 
	
	if (_introItems.length <= index) {
	  //end of the intro
	  //check if any callback is defined
	  if (typeof (_currentStep._Complete) === 'function') {
		_currentStep._Complete.call(_currentStep);
	  }
	  _exitIntro.call(_currentStep);
	  return;
	}

	var nextStep = _introItems[++index];
	if (typeof (nextStep._BeforeChange) !== 'undefined') {
	  nextStep._BeforeChange.call(nextStep);
	}

	_showElement.call(nextStep);
}

/**
* Go to previous step on intro
*
* @api private
* @method _previousStep
*/
function _previousStep(_introItems, step) {
	var _direction = 'backward';

	if (step == 0) {
	  return false;
	}

	var nextStep = _introItems[--this._currentStep];
	if (typeof (nextStep._BeforeChange) !== 'undefined') {
	  nextStep._BeforeChange.call(nextStep);
	}

	_showElement.call(nextStep);
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
	  _currentStep._Exit.call(_currentStep);
	}

	//set the step to zero
	_currentStep.step = undefined;
}

function _getProgress() {
// Steps are 0 indexed
	var currentStep = parseInt((this._currentStep + 1), 10);
	return ((currentStep / this._introItems.length) * 100);
}

function _showElement(targetElement) {
    if (typeof (this._Change) !== 'undefined') {
      this._Change.call(this, targetElement.element);
    }
	var self = this,
	if (typeof (this._AfterChange) !== 'undefined') {
      this._AfterChange.call(this, targetElement.element);
    }
	window.location.href = '';
}
	