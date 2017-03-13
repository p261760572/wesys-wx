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

function SearchPageIndex(PageArr, match, value) {
	if(!$.isString(match)) return;
	for(var i=0; i<PageArr.length; i++) {
		if(PageArr[i][match] == value) {
			return PageArr[i];
		}
	}
	return null;
}

function _introForPage(targetElm) {
    var introItems = [],self = this;

    if (true) {
      //use steps passed programmatically
	  InNetPages.sort(function (a, b) {
      	return a.step - b.step;
      });
	  var local_href = window.location.href.match('/(*[^\/])?$/');
	  
      for (var i = 0, stepsLength = InNetPages.length; i < stepsLength; i++) {
        var currentItem = _cloneObject(InNetPages[i]);
        //set the step
        currentItem.step = InNetPages[i].step;
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

      //next add intro items without data-step
      //todo: we need a cleanup here, two loops are redundant
      var nextStep = 0;
      for (var i = 0, elmsLength = allIntroSteps.length; i < elmsLength; i++) {
        var currentElement = allIntroSteps[i];

        if (currentElement.getAttribute('data-step') == null) {

          while (true) {
            if (typeof introItems[nextStep] == 'undefined') {
              break;
            } else {
              nextStep++;
            }
          }

          introItems[nextStep] = {
            element: currentElement,
            step: nextStep-1
          };
        }
      }
    }
    //Ok, sort all items with given steps
    introItems.sort(function (a, b) {
      return a.step - b.step;
    });

    //set it to the introJs object
    self._introItems = introItems;
    //add overlay layer to the page
    return false;
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
* Go to specific step of introduction
*
* @api private
* @method _goToStep
*/
function _goToStep(step) {
//because steps starts with zero
	this._currentStep = step - 1;
	if (typeof (this._introItems) !== 'undefined') {
	  _nextStep.call(this);
	}
}

/**
* Go to the specific step of introduction with the explicit [data-step] number
*
* @api private
* @method _goToStepNumber
*/
function _goToStepNumber(step) {
	this._currentStepNumber = step-1;
	if (typeof (this._introItems) !== 'undefined') {
	  _nextStep.call(this);
	}
}

/**
* Go to next step on intro
*
* @api private
* @method _nextStep
*/
function _nextStep() {
	this._direction = 'forward';

	if (typeof (this._currentStepNumber) !== 'undefined') {
		for( var i = 0, len = this._introItems.length; i < len; i++ ) {
			var item = this._introItems[i];
			if( item.step === this._currentStepNumber ) {
				this._currentStep = i - 1;
				this._currentStepNumber = undefined;
			}
		}
	}

	if (typeof (this._currentStep) === 'undefined') {
	  this._currentStep = 0;
	} else {
	  ++this._currentStep;
	}

	if ((this._introItems.length) <= this._currentStep) {
	  //end of the intro
	  //check if any callback is defined
	  if (typeof (this._introCompleteCallback) === 'function') {
		this._introCompleteCallback.call(this);
	  }
	  _exitIntro.call(this, this._targetElement);
	  return;
	}

	var nextStep = this._introItems[this._currentStep];
	if (typeof (this._introBeforeChangeCallback) !== 'undefined') {
	  this._introBeforeChangeCallback.call(this, nextStep.element);
	}

	_showElement.call(this, nextStep);
}

/**
* Go to previous step on intro
*
* @api private
* @method _previousStep
*/
function _previousStep() {
	this._direction = 'backward';

	if (this._currentStep === 0) {
	  return false;
	}

	var nextStep = this._introItems[--this._currentStep];
	if (typeof (this._introBeforeChangeCallback) !== 'undefined') {
	  this._introBeforeChangeCallback.call(this, nextStep.element);
	}

	_showElement.call(this, nextStep);
}

/**
* Exit from intro
*
* @api private
* @method _exitIntro
* @param {Object} targetElement
*/
function _exitIntro(targetElement) {
//remove overlay layers from the page
	//check if any callback is defined
	if (this._introExitCallback != undefined) {
	  this._introExitCallback.call(self);
	}

	//set the step to zero
	this._currentStep = undefined;
}

function _getProgress() {
// Steps are 0 indexed
	var currentStep = parseInt((this._currentStep + 1), 10);
	return ((currentStep / this._introItems.length) * 100);
}

function _showElement(targetElement) {
    if (typeof (this._introChangeCallback) !== 'undefined') {
      this._introChangeCallback.call(this, targetElement.element);
    }
	var self = this,
	if (typeof (this._introAfterChangeCallback) !== 'undefined') {
      this._introAfterChangeCallback.call(this, targetElement.element);
    }
	window.location.href = ;
}
	