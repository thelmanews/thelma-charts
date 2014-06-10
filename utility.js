var Thelma = window.Thelma || {};

Thelma.utilities = {

	


}


Thelma.chartValidation = {

	errors : [],
	validateChartData: function(polymerObject) {
		// polymerObject is passed to the function to make chartValidation not dependant on polymer
		
		console.log(' ---- chart validation ---- ')

		var errors = polymerObject.errors;
		var i = 0;
		if(!polymerObject.chartData) {
			errors.push('no chart data');
		}
		errors = errors.concat(polymerObject.chartSpecificDataValidate());
		console.log(errors);

		if(errors.length>0) {
			polymerObject.$.chart.style.opacity = 0.5; // this is for testing
			polymerObject.$.data_errors.style.display = 'block'; // this is for testing
			
			for (i; i < errors.length; i++){
				polymerObject.$.data_errors.innerHTML = errors[i].msg; // this is for testing
				polymerObject.asyncFire('error', errors[i]); // where error is an object containing details
			}
		}
		

	},
	chartSpecificDataValidate: function() {
		/* each chart needs to implement this method */
		return [];
	}



}