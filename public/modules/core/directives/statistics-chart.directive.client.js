'use strict';

angular.module('core').directive('statisticsChart', [ '$window',
  function($window) {
    return {
        restriction: 'E',
        require: 'ngModel',
        scope: {
          model: '=ngModel'
        },
        link: function(scope, element, attrs) {

          function generateDateRange(start, stop) {
            var dateArray = d3.time.day.range(start, stop);
            var newData = [];

            dateArray.forEach(function(value) {

              var obj = { date: value };
              obj[dataAttribute] = 0;
              newData.push(obj);

            });

            return newData;
          }

          function interpolateDataInRange(data, range) {
            
            range.forEach(function(rangeObject) {

              data.forEach(function(dataObject) {
                dataObject.date = new Date(dataObject.date);

                if (dataObject.date.getTime() === rangeObject.date.getTime()) {
                  rangeObject[dataAttribute] = dataObject[dataAttribute];
                }

              });

            });            

          }

          var d3 = $window.d3;
          var dataAttribute = attrs.value;
          var startDate = new Date();
          startDate = startDate.setDate(startDate.getDate() - 30);
          var range = generateDateRange(startDate, new Date());

          scope.$watch('model', function(newValue) {

            if (newValue.length > 0) {
              interpolateDataInRange(newValue, range);
              drawChart(range);
            }
          });

          function drawChart(data) {

            var margin = {top: 20, right: 20, bottom: 30, left: 50},
                width = 800 - margin.left - margin.right,
                height = 200 - margin.top - margin.bottom;

            var x = d3.time.scale()
                .range([0, width]);

            var y = d3.scale.linear()
                .range([height, 0]);

            var xAxis = d3.svg.axis()
                .scale(x)
                .orient('bottom');

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient('left')
                .tickSize(-width)
                .ticks(5)
                .tickFormat(d3.format('d'));

            var line = d3.svg.line()
                .x(function(d) { return x( new Date(d.date) ); })
                .y(function(d) { return y( +d[dataAttribute] ); })
                .interpolate('monotone');

            var svg = d3.select(element[0]).append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
              .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            x.domain(d3.extent(data, function(d) { return new Date(d.date); }));
            y.domain(d3.extent(data, function(d) { return d[dataAttribute]; }));

            svg.append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,' + height + ')')
                .call(xAxis);

            svg.append('g')
                .attr('class', 'y axis')
                .call(yAxis)
              .append('text')
                .attr('transform', 'rotate(-90)')
                .attr('y', 6)
                .attr('dy', '.71em')
                .style('text-anchor', 'end')
                .text(dataAttribute);

            svg.append('path')
                .datum(data)
                .attr('class', 'line')
                .attr('d', line);

            svg.append('g')
              .selectAll('circle')
                .data(data)
              .enter().append('circle')
                .attr('class', 'data-point')
                .attr('cx', function(d) { return x( new Date(d.date) ); })
                .attr('cy', function(d) { return y( +d[dataAttribute] ); })
                .attr('r', 3.5)
                .attr('tooltip', 'JHDFISDHFSF');
          }

        }
    };
  }
]);