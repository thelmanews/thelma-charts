var Thelma = window.Thelma || {};

Thelma.utilities = {

	


}


Thelma.chartValidation = {

	errors : [],
	validateChartData: function(polymerObject) {
		// polymerObject is passed to the function to make chartValidation not dependant on polymer
		
		console.log(' ---- chart validation ---- ')

		var errors = polymerObject.errors;
		if(!polymerObject.chartData) {
			errors.push('no chart data');
		}
		errors = errors.concat(polymerObject.chartSpecificDataValidate());
		console.log(errors);

		if(errors.length>0) {
			console.log(polymerObject.$.chart);
			polymerObject.$.chart.style.opacity = 0.5;
			polymerObject.$.data_errors.innerHTML = errors[0];
			polymerObject.$.data_errors.style.display = 'block';
		}

	},
	chartSpecificDataValidate: function() {
		/* each chart needs to implement this method */
		return [];
	}



}