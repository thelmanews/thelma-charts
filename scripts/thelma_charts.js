

Polymer('th-statcked-chart', {
  chartData: [{label: 'medicaid', value: 20, display_value: '$20'},{label: 'gap', value: 40, display_value: '$40'},{label: 'sub', value: 10, display_value: '$10'}],  // default data just for demo 
  chartWidth: 200,
  chartHeight: 300,
  animationDelay: 500,
  domReady: function() {

      this.init();

  },

  init: function() {
    var margin = {
          top : 5,
          right : 0,
          bottom : 10,
          left : 0,
          label: 3
      }, width = this.chartWidth*0.95 - margin.left - margin.right, height = this.chartHeight*0.55 - margin.top - margin.bottom
         , barWidth = width* 0.12 , textLabelMargin = height*0.05;

      console.log(this.chartData);

      this.height = height;

      this.x = d3.scale.ordinal().rangeRoundBands([0, width], .1);

      var y = d3.scale.linear().range([0, height]);
      this.y = y;

      var chart_svg = this.$.stacked_chart;

      var colors = d3.scale.category10();
      colors.domain(this.chartData.length);

      console.log(d3.select(chart_svg));
      this.svg = d3.select(chart_svg).attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      var total = 0;
      this.chartData.forEach(function(d) {
          d.total = total;
          total+=d.value;
          console.log(d);
      });
      
      y.domain([0, total]); 


      this.bars = this.svg.selectAll('.bar').data(this.chartData).enter().append('rect').attr('class','bar');
      //console.log(this.bars);
      this.bars
        .style('fill', function(d,i) {return colors(i);})
        .attr('x', width/2 - barWidth/2)
        //.attr('y', 0)
        .attr('y', height)
        .attr('width',barWidth)
        .attr('height', 0);

      this.labels = this.svg.selectAll('.label').data(this.chartData).enter().append('text').attr('class','label');
      //console.log(this.bars);
      this.labels
        .style('fill', function(d,i) {return colors(i);})
        .style('opacity', 0)
        .style('text-anchor','end')
        .attr('x', width/2 - barWidth/2 - margin.label)
        .attr('y', height) //12: font size
        .text(function(d) {return d.label;});
      
      this.values = this.svg.selectAll('.value').data(this.chartData).enter().append('text').attr('class','value');
      //console.log(this.bars);
      this.values
        .style('fill', function(d,i) {return colors(i);})
        .style('opacity', 0)
        .attr('x', width/2 + barWidth/2 + margin.label)
        .attr('y', height) //12: font size
        .text(function(d) {return d.display_value ? d.display_value : d.value ;});

        this.animate();

        var that = this;
        setTimeout(
            function() {
                that.reset();

            }
        , 5000);


  },
  reset: function() {
      
      var height= this.height;
      this.bars.transition().duration(this.animationDelay).attr('y', height).attr('height', 0);
      this.labels.transition().duration(this.animationDelay).attr('y', height ).style('opacity', 0);
      this.values.transition().duration(this.animationDelay).attr('y', height ).style('opacity', 0);
      
  },
  
  animate: function() {

        var y = this.y;
        console.log(this.animationDelay)
        this.bars.transition().duration(this.animationDelay)//.delay(function(d,i) { return i*this.animationDelay;})
        .attr('y', function(d) {return y(d.total)})
        .attr('height', function(d) {return y(d.value)});

        this.labels.transition(this.animationDelay).duration(this.animationDelay)//.delay(function(d,i) { return i*this.animationDelay;})
        .style('opacity', 1)
        .attr('y', function(d) {return y(d.total) + 12 }); //12: font size
        
        this.values.transition(this.animationDelay).duration(this.animationDelay)//.delay(function(d,i) { return i*this.animationDelay;})
        .style('opacity', 1)
        .attr('y', function(d) {return y(d.total) + 12 }); //12: font size

  }
  

  



});