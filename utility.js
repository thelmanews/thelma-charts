var Thelma = window.Thelma || {};

Thelma.util = {

}


Thelma.chartValidation = {

	errors : [],
	validateChartData: function(polymerObj) {
		// polymerObj is passed to the function to make chartValidation not dependant on polymer
		
		console.log(' ---- chart validation ---- ')

		var errors = polymerObj.errors;
		var i = 0;
		if(!polymerObj.chartData) {
			errors.push('no chart data');
		}
		errors = errors.concat(polymerObj.chartSpecificDataValidate());
		console.log(errors);

		if(errors.length>0) {
			polymerObj.$.chart.style.opacity = 0.5; // this is for testing
			polymerObj.$.data_errors.style.display = 'block'; // this is for testing
			
			for (i; i < errors.length; i++){	
				polymerObj.$.data_errors.appendChild(document.createElement('li')).innerHTML = errors[i].msg; // this is for testing
				polymerObj.asyncFire('error', errors[i]); // where error is an object containing details
			}
		}
		

	},
	chartSpecificDataValidate: function() {
		/* each chart needs to implement this method */
		return [];
	}



}

Thelma.chartUtils = {

	setupDimensions: function(polymerObj) {
		var dims = {};

		//TODO there needs to be height and visHeight?! later for drawing area (excluding labels and axis)?!
		dims.margin = {
		          top : 16,
		          right : 0,
		          bottom : 16,
		          left : 0,
		          label: 3
		      }, 
	    dims.width = polymerObj.chartWidth*0.95 - dims.margin.left - dims.margin.right, 
	    dims.height = polymerObj.chartHeight*0.55 - dims.margin.top - dims.margin.bottom,
	    dims.barWidth = dims.width* 0.12 ,
	    dims.textLabelMargin = dims.height*0.05;

	    return dims;

	},
	/*
	 *	builds simple x,y scales for charts. xAccessFun and yAccessFun are optional accessor functions.
	*/ 
	simpleScaleBuilder: function(width, height, chartData, xAccessFun, yAccessFun) {

		  var scales = {};
		  xAccessFun = xAccessFun || function(d) {return d.label}; 
		  yAccessFun = yAccessFun || function(d) {return d.value}; 
		  
		  scales.x = d3.scale.ordinal().rangeRoundBands([0, width], .1);
	      scales.y = d3.scale.linear().range([0, height]);

	      var max = d3.max(this.chartData, yAccessFun);

	      scales.y.domain([0, max]); 
	      scales.x.domain(this.chartData.map(xAccessFun));

	      scales.colors = d3.scale.category10();
		      
		  scales.colors.domain(this.chartData.length);


	      return scales;

	}

}