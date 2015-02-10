'use strict';

angular.module('core').directive('statisticsChart', ['$window',
    function($window) {
        return {
            restriction: 'E',
            require: 'ngModel',
            scope: {
                model: '=ngModel'
            },
            link: function(scope, element, attrs) {

                function getValue(value) {
                    if (!value) return 0;
                    else return value;
                }

                function generateDateRange(start, stop) {
                    var dateArray = d3.time.day.range(start, stop);
                    var newData = [];

                    dateArray.forEach(function(value) {

                        var obj = {
                            date: value
                        };
                        obj[dataAttribute] = 0;
                        newData.push(obj);

                    });

                    return newData;
                }

                function interpolateDataInRange(data, range, aggregate) {

                    for (var i = 0; i < range.length; i++) {
                        var value = 0;

                        for (var j = 0; j < data.length; j++) {
                            data[j].date = new Date(data[j].date);

                            if (data[j].date.getTime() === range[i].date.getTime()) {
                                value = getValue(data[j][dataAttribute]);
                                break;
                            }

                        }

                        if (i === 0 || !aggregate) {
                            range[i][dataAttribute] = value;
                        } else if (i > 0 && aggregate) {
                            range[i][dataAttribute] = range[i - 1][dataAttribute] + value;
                        }

                    }

                }

                var d3 = $window.d3;
                var dataAttribute = attrs.value;
                var startDate = new Date();
                startDate = startDate.setDate(startDate.getDate() - 30);
                var range = generateDateRange(startDate, new Date());
                var aggregateAttr = attrs.aggregate === 'true';

                scope.$watch('model', function(newValue) {

                    if (newValue.length > 0) {
                        interpolateDataInRange(newValue, range, aggregateAttr);
                        drawChart(range);
                    }
                });

                function drawChart(data) {

                    console.log(data);
                    console.log(dataAttribute);

                    var margin = {
                            top: 20,
                            right: 30,
                            bottom: 30,
                            left: 30
                        },
                        width = element.parent().outerWidth() - margin.left - margin.right - 55,
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

                    var keyAccessor = function(d) {
                        return new Date(d.date);
                    };
                    var valueAccessor = function(d) {
                        return +d[dataAttribute];
                    };

                    var line = d3.svg.line()
                        .x(function(d) {
                            return x(keyAccessor(d));
                        })
                        .y(function(d) {
                            return y(valueAccessor(d));
                        })
                        .interpolate('monotone');

                    var svg = d3.select(element[0]).append('svg')
                        .attr('width', width + margin.left + margin.right)
                        .attr('height', height + margin.top + margin.bottom)
                        .append('g')
                        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                    x.domain(d3.extent(data, keyAccessor));
                    y.domain(d3.extent(data, valueAccessor));

                    svg.append('g')
                        .attr('class', 'x axis')
                        .attr('transform', 'translate(0,' + height + ')')
                        .call(xAxis);

                    svg.append('g')
                        .attr('class', 'y axis')
                        .call(yAxis);

                    svg.append('path')
                        .datum(data)
                        .attr('class', 'line')
                        .attr('d', line);

                    svg.append('g')
                        .selectAll('circle')
                        .data(data)
                        .enter().append('circle')
                        .attr('class', 'data-point')
                        .attr('cx', function(d) {
                            return x(keyAccessor(d));
                        })
                        .attr('cy', function(d) {
                            return y(valueAccessor(d));
                        })
                        .attr('r', 3.5);
                }

            }
        };
    }
]);
