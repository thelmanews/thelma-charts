var Thelma = window.Thelma || {};

Thelma.util = {

}


Thelma.chartValidation = {

	errors : [],
	validateChartData: function(polymerObj) {
		// polymerObj is passed to the function to make chartValidation not dependant on polymer
		
		var errors = polymerObj.errors;
		var i = 0;
		if(!polymerObj.chartData) {
			errors.push('no chart data');
		}
		errors = errors.concat(polymerObj.chartSpecificDataValidate());

		if(errors.length>0) {
			// polymerObj.$.chart.style.opacity = 0.5; // this is for testing
			// polymerObj.$.data_errors.style.display = 'block'; // this is for testing
			
			for (i; i < errors.length; i++){	
				// polymerObj.$.data_errors.appendChild(document.createElement('li')).innerHTML = errors[i].msg; // this is for testing
				polymerObj.asyncFire('th-error', errors[i]); // where th-error is an object containing details
			}
		}
		

	},
	chartSpecificDataValidate: function() {
		/* each chart needs to implement this method */
		return [];
	}



}

Thelma.BarFamilyPrivateStaticMethods = function() {

	  this.setupBarLabelDims = function(dims, chartData, overlap, gap) {
        
        // bars margin and dims

        dims.bars = {};
        dims.bars.count = chartData.length;
        dims.bars.overlap = overlap || 1; // the higher the number, the more overlap
        dims.bars.gap = gap || 1;


        dims.bars.width = (dims.width / dims.bars.count)* dims.bars.overlap / dims.bars.gap;
        dims.bars.widthOverlap = dims.bars.width*dims.bars.overlap;



        // value margin and dims (depending on bars.width)
        
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



        // label margins and dims

        dims.labels = {};
        dims.labels.maxLength = d3.max(chartData, function(d){ return  d.label.length;}); 
	    dims.labels.width = dims.labels.maxLength * 5.25; // This calc works with the font-size 13px

	      // If labels are long, angle them and adjust margin 
	      // 1.1 worked with well with different labels but it might be a little bit too aggressive. (larger->more conservative)
	    if (dims.labels.width > dims.bars.width/dims.bars.overlap/1.3) { 
	        dims.labels.angle = 25;
	        dims.margin.bottom = dims.labels.width + dims.margin.label;
	        dims.margin.right = dims.labels.width;
	        
	        // need to adjust margin right when last label is long, so it does not cut off
	    } else {
	        dims.labels.angle = 0;
	    }

        return dims;

        
        

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
          if (dims.labels.width > dims.bars.width/dims.bars.overlap/1.3) { 
            dims.labels.angle = 25;
            dims.margin.bottom = dims.labels.width + dims.margin.label;
            dims.margin.right = dims.labels.width;
            
            // need to adjust margin right when last label is long, so it does not cut off
          } else {
            dims.labels.angle = 0;
          }
          return dims.labels;
      },
    getBoundaryValue: function(polymerObj, property, d3boundary){
        return d3boundary(polymerObj.chartData, function(d){
          return d[property];
        });
    },
    setupStackedDims: function(polymerObj){
      var dims = {},
          chartData = polymerObj.chartData;
      dims.margin = {
              top : 0,
              right : 0,
              bottom : 0,
              left : 0,
              label: 10,
          }, 

      dims.width = Math.max(100,(polymerObj.chartWidth*0.95 - dims.margin.left - dims.margin.right)), 
      dims.height = Math.max(150,(polymerObj.chartHeight*0.95 - dims.margin.top - dims.margin.bottom)),
      
      dims.labels = {};
      dims.labels.maxLength = d3.max(chartData, function(d){ return  d.label.length;}); 
      dims.labels.width = dims.labels.maxLength * 8; // This calc usually works?  Might need more sophistication
      
      dims.values = {};
      dims.values.maxLength = d3.max(chartData, function(d){ 
        if (d.range_min_display_value && d.range_max_display_value){ // for spectrum
          return  d.range_min_display_value.length + d.range_max_display_value.length + 3;
        } else if (d.range_min_value && d.range_max_value){ // for spectrum
          return  d.range_min_value.toString().length + d.range_max_value.toString().length + 3; // 3 is for the characters separating min and max " - "
        } else { // for stacked
          return d.display_value ? d.display_value.length : d.value.toString().length;
        }
      }); 
      dims.values.width = dims.values.maxLength * 8; // This calc usually works? Might need more sophistication
      
      dims.bar = {};
      dims.bar.minWidth = 10;
      dims.bar.maxWidth = 100;
      dims.bar.width = Math.min(dims.bar.maxWidth, ( (dims.width/2 - (Math.max(dims.values.width,dims.labels.width))-dims.margin.label) *2)); 
      dims.bar.width = dims.bar.width < dims.bar.minWidth ? dims.bar.minWidth : dims.bar.width; 
      
      dims.minWidth = dims.bar.minWidth + (Math.max(dims.values.width,dims.labels.width)*2);
      dims.width = dims.width < dims.minWidth ? dims.minWidth : dims.width;  // cannot resize to smaller than this;
      // dims.labels.charLimit - calculate the character limit for labels, given the min width of the bar and the width of the component
      // dims.minHeight - need to set this also

      return dims;

    }

}