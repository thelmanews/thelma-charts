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
		          label: 16
		      }, 

	    dims.width = Math.max(100,(polymerObj.chartWidth*0.95 - dims.margin.left - dims.margin.right)), 
	    dims.height = Math.max(150,(polymerObj.chartHeight*0.95 - dims.margin.top - dims.margin.bottom)),
	    dims.textLabelMargin = dims.height*0.05;

	    // Bar dimensions 
	    // dims.barGap = 0.3;
	    // dims.numBars = polymerObj.chartData.length;  // DEPENDANT ON CHARTDATA
	    // dims.barWidth = Math.min(70,((dims.width / dims.numBars)/(1+dims.barGap)));

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
	setupValueDims: function(polymerObj){ 
        var dims = polymerObj.dims,
            chartData = polymerObj.chartData;
        
        dims.values = {};
        dims.values.maxLength = d3.max(chartData, function(d){  
          return  d.display_value ? d.display_value.length : d.value.toString().length;
         });
        dims.values.size = Math.min(30,((dims.bars.width/dims.bars.overlap) / dims.values.maxLength / 0.6) );
        dims.values.margin = dims.values.size * 0.25;

        // Adjust top margin as necessary
        if ((dims.values.size+dims.values.margin) > dims.margin.top) { 
          dims.margin.top = dims.values.size+dims.values.margin;
        }

        
        return dims.values;

      },

   setupBarDims: function(polymerObj, overlap, gap){ 
          var dims = polymerObj.dims,
              chartData = polymerObj.chartData;

          dims.bars = {};
          dims.bars.count = chartData.length;
          dims.bars.overlap = overlap || 1; // the higher the number, the more overlap
          dims.bars.gap = gap || 1;
          dims.bars.width = (dims.width / dims.bars.count)* dims.bars.overlap / dims.bars.gap;
          dims.bars.widthOverlap = dims.bars.width*dims.bars.overlap;
       
          return dims.bars
      },
    setupLabelDims: function(polymerObj){ // MOVE TO UTILS?
          // Check if labels overlap and angle them if they do
          var chartData = polymerObj.chartData,
              dims = polymerObj.dims;
          
          dims.labels = {};
          dims.labels.maxLength = d3.max(chartData, function(d){ return  d.label.length;}); 
          dims.labels.width = dims.labels.maxLength * 5.25; // This calc works with the font-size 13px

          // If labels are long, angle them and adjust margin 
          // 1.1 worked with well with different labels but it might be a little bit too aggressive. (larger->more conservative)
          if (dims.labels.width > dims.bars.width/1.1) { 
            dims.labels.angle = 25;
            dims.margin.bottom = dims.labels.width + dims.margin.label;
            dims.margin.right = dims.labels.width;
            
            // need to adjust margin right when last label is long, so it does not cut off
          } else {
            dims.labels.angle = 0;
          }
          console.log("^^^^^^^^^");
          console.log(dims);
          return dims.labels;
      },

}