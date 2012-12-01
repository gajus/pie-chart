/**
 * Pie Chart v0.0.7
 * https://github.com/gajus/pie-chart
 *
 * Licensed under the BSD.
 * https://github.com/gajus/pie-chart/blob/master/LICENSE
 *
 * Author: Gajus Kuizinas <g.kuizinas@anuary.com>
 */
var ay = ay || {};

ay.pie_chart	= function (name, data, options, debug) {
	'use strict';
	
	if(window.d3 === undefined)
	{
		throw 'Pie Chart requires presence of the d3.js library.'
	}
	
	var svg = d3.select('svg.' + name),
		chart_size = svg[0][0].clientWidth || svg[0][0].parentNode.clientWidth,
		settings = {
		radius: {inner: 50, outer: chart_size/3, label: chart_size/3+20},
		percentage: true,
		chart_label_margin: 5,
		label_margin: 10,
		label: []
	};
	
	var populate_chart_label = function(){
		var chart_label_group,
			top_offset,
			bb_height = 0,
			bb_height_array = [];
			
			
		chart_label_group	= svg
				.append('g')
					.attr('class', 'label')
					.attr('transform', 'translate(' + ((chart_size/2)-settings.radius.inner) + ', ' + ((chart_size/2)-settings.radius.inner) + ')');
			
			chart_label_group
				.selectAll('text')
				.data(options.label)
				.enter()
				.append('text')
				.attr('class', function(e, i){
					return 'label i-' + i;
				})
				.text(function(e){ return e; })
				.attr('dx', settings.radius.inner)
				.each(function(){
					var height = this.getBBox().height;
				
					bb_height += height;
				
					bb_height_array.push( height );
				})
			
			bb_height	+= settings.chart_label_margin*bb_height_array.length;
			
			top_offset			= (settings.radius.inner*2-bb_height)/2;
			
			
			chart_label_group
				.selectAll('text')
					.attr('dy', function(e, i){ top_offset += bb_height_array[i]; return top_offset + i*settings.chart_label_margin; });
	};
	
	if(options !== undefined)
	{
		for(var parameter in options)
		{
			if(options.hasOwnProperty(parameter) && settings[parameter] !== undefined)
			{
				settings[parameter]		= options[parameter];
			}
		}
		
		if(settings.label.length)
		{
			if(!settings.radius.inner)
			{
				throw 'Pie Inner Radius must be present no utilise the graph label.'
			}
		
			populate_chart_label(settings.label);
		}
	}
	
	// static
	var donut	= svg
		.append('g')
		.attr('class', 'donut')
		.attr('transform', 'translate(' + (chart_size/2) + ', ' + (chart_size/2) +  ')');
	
	var arc		= d3.svg.arc()
		.innerRadius(settings.radius.inner)
		.outerRadius(settings.radius.outer);
	
	var data	= d3.layout.pie()
		.value(function(e){
			return e.value;
		})
		.sort(function(a, b){
			return b.index - a.index;
		})(data);
	
	var slices	= donut	
		.selectAll('path')
		.data(data)
		.enter()
		.append('path')
		.attr('class', function(d){
			return 'g-' + d.data.index;
		})
		.attr('d', arc)
		.on('mouseover', function(d, i){
			d3.select(labels[0][i])
				.classed('active', true);
		})
		.on('mouseout', function(d, i){
			d3.select(labels[0][i])
				.classed('active', false);
		});
	
	var labels_group	= svg
		.append('g')
		.attr('class', 'labels');
	
	var grouped_labels	= {left: [], right: []};
	
	var labels			= labels_group
		.selectAll('g.label')
		.data(data)
		.enter()
		.append('g')
		.attr('class', 'label');
	
	var label_boxes	= labels
		.append('rect');
	
	var label_texts	= labels
		.append('text').text(function(e){
			return settings.percentage ? e.data.name + ' ' + (((e.endAngle - e.startAngle)/(2*Math.PI))*100).toFixed(2) + '%' : e.data.name;
		})
		.each(function(d, i) {
			var center = arc.centroid(d),
				x = center[0],
				y = center[1],
				h = Math.sqrt(x*x + y*y),
				lx = x/h * settings.radius.label + 300,
				ly = y/h * settings.radius.label + 300;
			
			var end 	= (d.endAngle - d.startAngle)*0.5 + d.startAngle > Math.PI;
			
			var text	= d3.select(this);
			
			var bb		= this.getBBox();
			
			var box	= {
				index: i,
				width: bb.width,
				height: bb.height,
				x: end ? lx - bb.width : lx,
				y: ly,
				textNode: text
			};
			
			grouped_labels[box.x <= 300 ? 'left' : 'right'].push(box);
		});
	
	var reposition_colliding_labels = function(group){
		group
			.sort(function(a, b){
				return (a.y+a.height) - (b.y+b.height);
			})
			.forEach(function(e, i){
				
				if(group[i+1]){
					if(group[i+1].y-(e.y+e.height) < settings.label_margin){
						group[i+1].y = (e.y+e.height) + settings.label_margin;
					}
				}
				
				if(e.x < settings.label_margin){
					e.x	= settings.label_margin;
				}
				else if(e.x+e.width > chart_size-settings.label_margin){
					e.x = chart_size-e.width-settings.label_margin;
				}
				
				d3.select(labels[0][e.index])
					.attr('transform', 'translate(' + e.x + ', ' + e.y + ')')
				
				d3.select(label_boxes[0][e.index])
					.attr('x', 0)
					.attr('y', -e.height+2)
					.attr('width', e.width+4)
					.attr('height', e.height+4);
								
				e.textNode
					.attr('x', 2)
					.attr('y', 2);
				
			});
	};
	
	reposition_colliding_labels(grouped_labels.left);
	reposition_colliding_labels(grouped_labels.right);
};