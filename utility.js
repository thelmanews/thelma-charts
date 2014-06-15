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
		          bottom : 18,
		          left : 0,
		          label: 3
		      }, 

	    dims.width = Math.max(150,(polymerObj.chartWidth*0.95 - dims.margin.left - dims.margin.right)), 
	    dims.height = Math.max(150,(polymerObj.chartHeight*0.95 - dims.margin.top - dims.margin.bottom)),
	    // dims.barWidth = dims.width* 0.12 ,
	    dims.textLabelMargin = dims.height*0.05;

	    dims.barGap = 0.3;
	    dims.numBars = polymerObj.chartData.length;  // DEPENDANT ON CHARTDATA
	    dims.barWidth = Math.min(70,((dims.width / dims.numBars)/(1+dims.barGap)));
	    dims.maxValueLength = d3.max(polymerObj.chartData, function(d){return  d.display_value ? d.display_value.length : d.value.toString().length;}); // DEPENDANT ON CHARTDATA
	    dims.valueSize = Math.min(50,((dims.barWidth*0.8) / dims.maxValueLength / 0.6) );
	    dims.spacing = dims.valueSize * 0.25;

	    if ((dims.valueSize+dims.spacing) > dims.margin.top) { 
	    	dims.margin.top = dims.valueSize+dims.spacing;
	    }

	    return dims;

	},
	/*
	 *	builds simple x,y scales for charts. labelAccessFun and valueAccessFun are optional accessor functions.
	*/ 
	simpleScaleBuilder: function(width, height, chartData, orientation, labelAccessFun, valueAccessFun) {

		  var VERTICAL = 'vertical',
		  	  HORIZONTAL = 'horizontal';

		  var scales = {};
		  labelAccessFun = labelAccessFun || function(d) {return d.label}; 
		  valueAccessFun = valueAccessFun || function(d) {return d.value}; 
		  orientation = orientation || VERTICAL;
		  
		  scales.x = orientation===VERTICAL ? d3.scale.ordinal().rangeRoundBands([0, width], .1) 
		  									: d3.scale.linear().range([0, width], .1);
	      scales.y = orientation===VERTICAL ? d3.scale.linear().range([0, height])
	      									: d3.scale.ordinal().rangeRoundBands([0, height]);

	      var max = d3.max(chartData, valueAccessFun);

	      scales.y.domain(orientation===VERTICAL ? [0, max] : chartData.map(labelAccessFun)); 
	      scales.x.domain(orientation===VERTICAL ? chartData.map(labelAccessFun) : [0, max]);

	      return scales;

	},


}