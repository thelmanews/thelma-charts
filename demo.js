

var horChart = document.querySelector('th-n-bar-chart-horizontal');

/*
setTimeout(function() {
	horChart.chartWidth = 500;
},4000);


setTimeout(function() {
	horChart.chartHeight = 150;
},8000);



setTimeout(function() {
	horChart.chartHeight = 400;
},12000);


setTimeout(function() {
	horChart.chartData = [
		    {label: 'Player of the day', value: 15, display_value: '$15', color:""},
		    {label: 'Vendor', value: 20, display_value: '$20', color:"", color:""},
		    {label: 'Cheerleader', value: 40, display_value: '$40', color:""}
		  ];
},10000);

setTimeout(function() {
	horChart.chartData = [
		    {label: 'Player of the day', value: 15, display_value: '$15', color:""},
		    {label: 'Vendor', value: 20, display_value: '$20', color:"", color:""},
		    {label: 'Cheerleader', value: 40, display_value: '$40', color:""},
		    {label: 'Vendor1', value: 95,  color:"", color:""},
		    {label: 'Vendor2', value: 90,  color:"", color:""}
		  ];
},14000);
*/

setTimeout(function() {
	horChart.reset();
},3000);

setTimeout(function() {
	horChart.animate();
},5000);

setTimeout(function() {
	horChart.reset('hard');
},7000);

setTimeout(function() {
	horChart.animate();
},9000);

