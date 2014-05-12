
Polymer('th-d3-chart', {
  chartData: [{label: 'medicaid', value: 20, display_value: '$20'},{label: 'gap', value: 40, display_value: '$40'},{label: 'sub', value: 10, display_value: '$10'}],  // default data just for demo 
  chartWidth: 200,
  chartHeight: 300,
  animationDelay: 1000,
  domReady: function() {

      this.init();

  },
  init: function() {
  },
  reset: function() {
  },
  animate: function() {
  }
});


Polymer('th-statcked-chart', {
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

      this.height = height;

      this.x = d3.scale.ordinal().rangeRoundBands([0, width], .1);

      var y = d3.scale.linear().range([0, height]);
      this.y = y;

      var chart_svg = this.$.chart;

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
        .style('fill', function(d,i) {return d.color ? d.color : colors(i);})
        .attr('x', width/2 - barWidth/2)
        //.attr('y', 0)
        .attr('y', height)
        .attr('width',barWidth)
        .attr('height', 0);

      this.labels = this.svg.selectAll('.label').data(this.chartData).enter().append('text').attr('class','label');
      //console.log(this.bars);
      this.labels
        .style('fill', function(d,i) {return d.color ? d.color : colors(i);})
        .style('opacity', 0)
        .style('text-anchor','end')
        .attr('x', width/2 - barWidth/2 - margin.label)
        .attr('y', height) //12: font size
        .text(function(d) {return d.label;});
      
      this.values = this.svg.selectAll('.value').data(this.chartData).enter().append('text').attr('class','value');
      //console.log(this.bars);
      this.values
        .style('fill', function(d,i) {return d.color ? d.color : colors(i);})
        .style('opacity', 0)
        .attr('x', width/2 + barWidth/2 + margin.label)
        .attr('y', height) //12: font size
        .text(function(d) {return d.display_value ? d.display_value : d.value ;});

        this.animate();

        /*
        var that = this;
        setTimeout(
            function() {
                that.reset();

            }
        , 5000);
*/


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


Polymer('th-spectrum-chart', {
  chartData: [{label: 'medicaid', range: { min: { value: 10, display_value: '$10'}, max: { value: 50, display_value: '$50'}}},
              {label: 'federal', color: '#888', pattern: 'stripe',  range: { min: { value: 40, display_value: '$40'}, max: { value: 60, display_value: '$60'}}},
              {label: 'medicare', range: { min: { value: 70, display_value: '$70'}, max: { value: 100, display_value: '$100'}}}],
  orientation: 'vertical',
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

      var chart_svg = this.$.chart;

      var colors = d3.scale.category10();
      colors.domain(this.chartData.length);

      console.log(d3.select(chart_svg));
      this.svg = d3.select(chart_svg).attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      var dataMargin = 0.1;  // 10% extra space     

      var minmin = d3.min(this.chartData, function(d) { return d.range.min.value;});

      var maxmax = d3.max(this.chartData, function(d) { return d.range.max.value;});

      var marginValue = (maxmax-minmin)* dataMargin;
      var wholeRange = {min : minmin-marginValue, max:  maxmax+marginValue};
      console.log(wholeRange);

      y.domain([wholeRange.min,wholeRange.max]); 

      var spectrum = this.svg.selectAll('.spectrum').data([wholeRange]).enter().append('rect').attr('class','spectrum');
      console.log('spectrum');
      console.log(spectrum);
        
      spectrum.style('fill', function(d,i) {return '#FFF';})
        .attr('x', width/2 - barWidth/2)
        .attr('y', function(d) {return y(wholeRange.min)})
        .attr('width',barWidth)
        .attr('height', function(d) {return y(wholeRange.max)});

      this.bars = this.svg.selectAll('.bar').data(this.chartData).enter().append('rect').attr('class','bar');
      //console.log(this.bars);
      this.bars
        .style('fill', function(d,i) {return d.color ? d.color : colors(i);})
        .style('mask', function(d) { return d.pattern ?  'url(#mask-stripe)' : 'none' ;})
        .attr('x', width/2 - barWidth/2)
        //.attr('y', 0)
        .attr('y', function(d) {return height - y(d.range.max.value)})
        .attr('width',barWidth)
        .attr('height', 0);


      this.labels = this.svg.selectAll('.label').data(this.chartData).enter().append('text').attr('class','label');
      //console.log(this.bars);
      this.labels
        .style('fill', function(d,i) {return d.color ? d.color : colors(i);})
        .style('opacity', 0)
        .style('text-anchor','end')
        .attr('x', width/2 - barWidth/2 - margin.label)
        .attr('y', function(d) {return height -  y(d.range.max.value) + 12;}) 
        .text(function(d) {return d.label;});
      
      this.values = this.svg.selectAll('.value').data(this.chartData).enter().append('text').attr('class','value');
      //console.log(this.bars);
      this.values
        .style('fill', function(d,i) {return d.color ? d.color : colors(i);})
        .style('opacity', 0)
        .attr('x', width/2 + barWidth/2 + margin.label)
        .attr('y', function(d) {return height - y(d.range.max.value) + 12;}) 
        .text(function(d) {return d.range.max.display_value ? d.range.max.display_value : d.range.max.value ;});

     
        this.animate();

        var that = this;
        setTimeout(
            function() {
                //that.reset();

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
        this.bars.transition().duration(this.animationDelay)//.delay(function(d,i) { return i*this.animationDelay;})
        .attr('height', function(d) {return y(d.range.max.value - d.range.min.value)});

        this.labels.transition(this.animationDelay).duration(this.animationDelay)//.delay(function(d,i) { return i*this.animationDelay;})
        .style('opacity', 1);
        //.attr('y', function(d) {return y(d.total) + 12 }); //12: font size
        
        this.values.transition(this.animationDelay).duration(this.animationDelay)//.delay(function(d,i) { return i*this.animationDelay;})
        .style('opacity', 1);
        //.attr('y', function(d) {return y(d.total) + 12 }); //12: font size

  }
  
});



