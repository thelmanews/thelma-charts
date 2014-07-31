


var horChart = document.querySelector('th-spectrum-chart');

var bubble = document.querySelector('#bubble');
console.log(bubble);

setTimeout(function() {
	console.log('timeoit');
	bubble.value=90;
	bubble.updateData();
},4000);



/*

setTimeout(function() {
	//horChart.chartHeight = 450;
},4000);



setTimeout(function() {
	horChart.chartHeight = 200;
},6000);


setTimeout(function() {
	horChart.chartWidth = 500;
},8000);


setTimeout(function() {
	horChart.chartWidth = 150;
},10000);


setTimeout(function() {

   horChart.chartData = [
		  		{label: 'Medicaid', range_min_value: 10, range_min_display_value: '$10', range_max_value: 50, range_max_display_value: '$50', color:''},
		        {label: 'Federal',  pattern: 'stripe',  range_min_value: 40, range_min_display_value: '$40', range_max_value: 60, range_max_display_value: '$60', color: ''},
		        {label: 'Medicare', range_min_value: 70, range_min_display_value: '$70', range_max_value: 100, range_max_display_value: '$100', color:''},
		        {label: 'Medicaid', range_min_value: 100,  range_max_value: 120,  color:''}];
		   },8000);

setTimeout(function() {

   horChart.chartData = [
		  		{label: 'Medicaid', range_min_value: 10, range_min_display_value: '$10', range_max_value: 50, range_max_display_value: '$50', color:''},
		        {label: 'Federal',  pattern: 'stripe',  range_min_value: 40, range_min_display_value: '$40', range_max_value: 60, range_max_display_value: '$60', color: ''}];
		   },10000);

*/
setTimeout(function() {
	horChart.chartData = [
		    {label: 'Player', value: -15},
		    {label: 'Vendor', value: 20},
		    {label: 'Cheerleader', value: 40}
		  ];
},4000);

setTimeout(function() {
	horChart.chartData = [
		    {label: 'Player', value: -5},
		    {label: 'Vendor', value: 0},
		    {label: 'Cheerleader', value: -10}
		  ];
},6000);

/*
setTimeout(function() {
	horChart.chartData = [
		    {label: 'Player of the day', value: 15, display_value: '$15', color:""},
		    {label: 'Vendor', value: 20, display_value: '$20', color:"", color:""},
		    {label: 'Cheerleader', value: 40, display_value: '$40', color:""},
		    {label: 'Vendor1', value: 95,  color:"", color:""},
		    {label: 'Vendor2', value: 90,  color:"", color:""}
		  ];
},8000);


setTimeout(function() {
	horChart.reset('hard');
},7000);

setTimeout(function() {
	horChart.animate();
},8000);
*/