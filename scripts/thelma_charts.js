
Polymer('th-d3-chart', {
  chartData: [{label: 'medicaid', value: 20, display_value: '$20'},{label: 'gap', value: 40, display_value: '$40'},{label: 'sub', value: 10, display_value: '$10'}],  // default data just for demo 
  chartWidth: 200,
  chartHeight: 300

});


Polymer('th-statcked-chart', {

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
      this.container = d3.select(chart_svg).attr('width', width + margin.left + margin.right)
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


      this.bars = this.container.selectAll('.bar').data(this.chartData).enter().append('rect').attr('class','bar');
      //console.log(this.bars);
      this.bars
        .style('fill', function(d,i) {return d.color ? d.color : colors(i);})
        .attr('x', width/2 - barWidth/2)
        //.attr('y', 0)
        .attr('y', height)
        .attr('width',barWidth)
        .attr('height', 0);

      this.labels = this.container.selectAll('.label').data(this.chartData).enter().append('text').attr('class','label');
      //console.log(this.bars);
      this.labels
        .style('fill', function(d,i) {return d.color ? d.color : colors(i);})
        .style('opacity', 0)
        .style('text-anchor','end')
        .attr('x', width/2 - barWidth/2 - margin.label)
        .attr('y', height) //12: font size
        .text(function(d) {return d.label;});
      
      this.values = this.container.selectAll('.value').data(this.chartData).enter().append('text').attr('class','value');
      //console.log(this.bars);
      this.values
        .style('fill', function(d,i) {return d.color ? d.color : colors(i);})
        .style('opacity', 0)
        .attr('x', width/2 + barWidth/2 + margin.label)
        .attr('y', height) //12: font size
        .text(function(d) {return d.display_value ? d.display_value : d.value ;});


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


      var svg = d3.select(chart_svg);

      /* adding stripe pattern and mask */

      var defs = svg.append("defs");
      defs.append("pattern")
        .attr("id","pattern-stripe")
        .attr("width", 1)
        .attr("height", 5)
        .attr("patternUnits", "userSpaceOnUse")
        .attr("patternTransform", "rotate(45)")
        .append("rect")
          .attr("width", 1)
          .attr("height", 1)
          .attr("transform", "translate(0,0)")
          .attr("fill", "white");

      defs.append("mask")
      .attr("id","mask-stripe")
      .append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("x", 0)
        .attr("y", 0)
        .attr("fill", "url(#pattern-stripe)");


      this.container = svg.attr('width', width + margin.left + margin.right)
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

      var spectrum = this.container.selectAll('.spectrum').data([wholeRange]).enter().append('rect').attr('class','spectrum');
      console.log('spectrum');
      console.log(spectrum);
        
      spectrum.style('fill', function(d,i) {return '#FFF';})
        .attr('x', width/2 - barWidth/2)
        .attr('y', function(d) {return y(wholeRange.min)})
        .attr('width',barWidth)
        .attr('height', function(d) {return y(wholeRange.max)});

      this.bars = this.container.selectAll('.bar').data(this.chartData).enter().append('rect').attr('class','bar');
      //console.log(this.bars);
      this.bars
        .style('fill', function(d,i) {return d.color ? d.color : colors(i);})
        .style('mask', function(d) { return d.pattern ?  'url(#mask-stripe)' : 'none' ;})
        .attr('x', width/2 - barWidth/2)
        //.attr('y', 0)
        .attr('y', function(d) {return height - y(d.range.max.value)})
        .attr('width',barWidth)
        .attr('height', 0);


      this.labels = this.container.selectAll('.label').data(this.chartData).enter().append('text').attr('class','label');
      //console.log(this.bars);
      this.labels
        .style('fill', function(d,i) {return d.color ? d.color : colors(i);})
        .style('opacity', 0)
        .style('text-anchor','end')
        .attr('x', width/2 - barWidth/2 - margin.label)
        .attr('y', function(d) {return height -  y(d.range.max.value) + 12;}) 
        .text(function(d) {return d.label;});
      
      this.values = this.container.selectAll('.value').data(this.chartData).enter().append('text').attr('class','value');
      //console.log(this.bars);
      this.values
        .style('fill', function(d,i) {return d.color ? d.color : colors(i);})
        .style('opacity', 0)
        .attr('x', width/2 + barWidth/2 + margin.label)
        .attr('y', function(d) {return height - y(d.range.max.value) + 12;}) 
        .text(function(d) {return d.range.max.display_value ? d.range.max.display_value : d.range.max.value ;});

  },
  reset: function() {
      
      var height= this.height;
      this.bars.transition().duration(this.animationDelay).attr('y', height).attr('height', 0);
      this.labels.transition().duration(this.animationDelay).attr('y', height ).style('opacity', 0);
      this.values.transition().duration(this.animationDelay).attr('y', height ).style('opacity', 0);
      
  },
  
  animate: function() {

        var y = this.y;
        var labels = this.labels;
        var delay = this.animationDelay;
        this.bars.transition().duration(delay).delay(function(d,i) { return i*delay;})
        .attr('height', function(d) {return y(d.range.max.value - d.range.min.value)});

        this.labels.transition(delay).duration(delay).delay(function(d,i) { return i*delay;})
        .style('opacity', 1);
        
        this.values.transition(delay).duration(delay).delay(function(d,i) { return i*delay;})
        .style('opacity', 1);

  }
  
});


Polymer('th-donut-chart', {
  chartData: {value: 65},
  init: function() {
    var margin = {
          top : 8,
          right : 0,
          bottom : 10,
          left : 0,
          label: 3
      }, width = this.chartWidth*0.95 - margin.left - margin.right, height = this.chartHeight*0.95 - margin.top - margin.bottom,
      twoPi = 2 * Math.PI,
      progress = 0,
      total = 100,
      formatPercent = d3.format(".0%"),
      outerRadius = height*0.39,
      innerRadius = height*0.25;
      this._prevProgress = 0;

      this.height = height;

      var foreground, text, arc;


      arc = d3.svg.arc()
        .startAngle(0)
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);


      var chart_svg = this.$.chart;

      var svg = d3.select(chart_svg);

      // adding shadow 

      var defs = svg.append("defs");

      var filter = defs.append("filter")
          .attr("id", "dropshadow")

      filter.append("feGaussianBlur")
          .attr("in", "SourceAlpha")
          .attr("stdDeviation", 4)
          .attr("result", "blur");
      filter.append("feOffset")
          .attr("in", "blur")
          .attr("dx", 2)
          .attr("dy", 2)
          .attr("result", "offsetBlur");

      var feMerge = filter.append("feMerge");

      feMerge.append("feMergeNode")
          .attr("in", "offsetBlur")
      feMerge.append("feMergeNode")
          .attr("in", "SourceGraphic");



      var container = svg.attr("width", width)
          .attr("height", height)
          .append("g")
          .attr("transform", "translate(" +(width / 2 ) + "," + (height * 0.4) + ")");
      
      var meter = container.append("g")
          .attr("class", "progress-meter");
      
      meter.append("circle")
          .attr("class", "center-background")
          .attr("r", outerRadius);

      
      meter.append("path")
          .attr("class", "background")
          .attr("d", arc.endAngle(twoPi));
      
      foreground = meter.append("path")
          .attr("class", "foreground")
          .attr("filter", "url(#dropshadow)");
      
      text = meter.append("text")
          .attr('class','percent')
          .attr("text-anchor", "middle")
          .attr("dy", ".35em");

      this.foreground = foreground;
      this.formatPercent = formatPercent;
      this.arc = arc;
      this.twoPi = twoPi;
      this.text = text;


  },
  reset: function() {
      
      
  },
  
  animate: function() {

        var progress = this.chartData.value;
        var total = 100;
        var that = this;
        console.log('total');
        console.log(total);
        var i = d3.interpolate(that._prevProgress/total, progress/total);//d3.event.loaded / total);
        d3.transition().delay(1000).duration(1000).tween("progress", function() {
          return function(t) {
            progress = i(t);
            that.foreground.attr("d", that.arc.endAngle(that.twoPi * progress));
            that.text.text(that.formatPercent(progress));
          };
        });

        this._prevProgress = progress; 
  }
  
});




Polymer('th-n-bar-chart', {
  chartData: [
    {label: 'Player', value: 15, display_value: '$15'},
    {label: 'Vendor', value: 20, display_value: '$20'},
    {label: 'Mascot', value: 45, display_value: '$45'}
  ],
  init: function() {
    var margin = {
          top : 15,
          right : 0,
          bottom : 20,
          left : 0,
          label: 3
      }, width = this.chartWidth*0.95 - margin.left - margin.right, height = this.chartHeight*0.55 - margin.top - margin.bottom
         , barWidth = width* 0.12 , textLabelMargin = height*0.05;

      this.height = height;


      var barInfos = this.querySelectorAll('th-bar');
      var dataFromElements = [];
      [].forEach.call(barInfos, function(info) {
          var bardata = {value: info.getAttribute('value'), label: info.getAttribute('label'),
                      color: info.getAttribute('color'), display_value: info.getAttribute('displayValue')};
          console.log(bardata);
          dataFromElements.push(bardata);
      });

      //TODO validate dataFromElements
      if(dataFromElements.length>0) {
        this.chartData= dataFromElements;
      }


      

      var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);


      var y = d3.scale.linear().range([0, height]);
      this.y = y;

      var chart_svg = this.$.chart;

      var colors = d3.scale.category10();
      colors.domain(this.chartData.length);

      this.container = d3.select(chart_svg).attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      //TODO replace with d3.max
      var max = d3.max(this.chartData, function(d) {return d.value});

      y.domain([0, max]); 
      x.domain(this.chartData.map(function(d) {
            return d.label;
      }));


      this.bars = this.container.selectAll('.bar').data(this.chartData).enter().append('rect').attr('class','bar');
      //console.log(this.bars);
      this.bars
        .style('fill', function(d,i) {return d.color ? d.color : colors(i);})
        .attr('x', function(d) { return x(d.label); })
        .attr('y', function(d) { return height; })
        .attr('width',barWidth)
        .attr('height', 0);

      
      this.labels = this.container.selectAll('.label').data(this.chartData).enter().append('text').attr('class','label');
      //console.log(this.bars);
      this.labels
        .style('fill', function(d,i) {return d.color ? d.color : colors(i);})
        //.style('opacity', 0)
        .style('text-anchor','left')
        .attr('x', function(d) { return x(d.label); })
        .attr('y', height + 12) //12: font size
        .text(function(d) {return d.label;});
      
      this.values = this.container.selectAll('.value').data(this.chartData).enter().append('text').attr('class','value');
      //console.log(this.bars);
      this.values
        .style('fill', function(d,i) {return d.color ? d.color : colors(i);})
        .style('text-anchor','middle')
        //.style('opacity', 0)
        .attr('x', function(d) { return x(d.label) + barWidth/2; })
        .attr('y', height) //12: font size
        .text(function(d) {return d.display_value ? d.display_value : d.value ;});


        


  },
  reset: function() {
      
      var height= this.height;
      this.bars.transition().duration(this.animationDelay).attr('y', height).attr('height', 0);
      this.values.transition().duration(this.animationDelay).attr('y', height );
      
  },
  
  animate: function() {

        var y = this.y;
        var height= this.height;
        this.bars.transition().duration(this.animationDelay)//.delay(function(d,i) { return i*this.animationDelay;})
        .attr('y', function(d) { console.log(d.value); return height-y(d.value);})
        .attr('height', function(d) {return y(d.value)});
        
        this.values.transition(this.animationDelay).duration(this.animationDelay)//.delay(function(d,i) { return i*this.animationDelay;})
        //.style('opacity', 1)
        .attr('y', function(d) {return height - y(d.value) - 2;});

  }
  
});





