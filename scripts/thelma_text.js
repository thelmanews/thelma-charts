Polymer('th-countup-num', {
  startFrom: 0,
  startFromSameNumberOfDigit: true,  // to make sure span with remains the same
  duration: 2,
  ready: function() {

      this.init();

  },
  init: function() {
  	var content = this.textContent;

  	//TODO validation
  	var number = content.match(/\d+/g);
  	var digits = number.toString().length;

  	var beforeAfter = content.split(/\d+/,2);

  	var beforeEl = this.$.before_num;
  	var numEl = this.$.num;
  	var afterEl = this.$.after_num;

  	if(beforeAfter && beforeAfter.length>0) {
  		beforeEl.innerText = beforeAfter[0];
  	}

  	if(beforeAfter && beforeAfter.length>1) {
  		afterEl.innerText = beforeAfter[1];
  	}
  	console.log(this.startFromSameNumberOfDigit);
  	var start = Boolean(this.startFromSameNumberOfDigit) ? Math.pow(10,digits-1) : this.startFrom;
  	console.log(start);

  	this.cnt = new countUp(numEl, start, number[0], 0, this.duration);

  },
  reset: function() {
  	this.cnt.reset();
  },
  animate: function() {
  	console.log('countup animate');
  	this.cnt.start();

  }
});


Polymer('th-reveal', {
  ready: function() {

      this.init();

  },
  init: function() {

  	console.log(this);
  	console.log(this.$);

 	this.$.container.classList.add('th-transition-slide');

  },
  reset: function() {
 	this.$.container.classList.remove('th-transition-slide-show');
 	this.$.container.classList.add('th-transition-slide');
  },
  
  animate: function() {

  	console.log('reveal animate');
  	var that = this;
  	setTimeout(function() {
		that.$.container.classList.remove('th-transition-slide');
	 	that.$.container.classList.add('th-transition-slide-show');
	},500);

  }
});