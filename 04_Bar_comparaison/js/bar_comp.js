

	
    function bar_comp() // generate heatmap 
	{ 	
		var file_use = "data/CI5IvsCI5X.csv"; 
		
	

		d3.csv(file_use,
			
			function(d) {
			return {
				
				rank : +d.rank,
				cancer_label : d.cancer_label,
				cancer: +d.cancer,
				volume : +d.volume,
				sex : +d.sex,
				per1: d.per1,
				per2: d.per2,
				asr: +d.asr,
				country_label: d.country_label,
				country_code: +d.country_code

				
				
				};	
			},		
			function(data) {
			
				populateComboRegistry(data);
				
				var data_temp = data.filter(function(d){
					return (d.country_code == 124 & d.sex == 1  )
				});
				
				var data_period1 = data.filter(function(d){
					return (d.country_code == 124 & d.sex == 1 & d.rank==1 & d.volume == 1 )
				});
				
				var data_period2 = data.filter(function(d){
					return (d.country_code == 124 & d.sex == 1 & d.rank==1 & d.volume == 10 )
				});
				
				var data_nest=d3.nest()
						.key(function(d) {return d.cancer;})
						.sortKeys(d3.ascending)
						.key(function(d) {return d.volume;})
						.sortKeys(d3.ascending)
						.entries(data_temp)
					
		var bar_graph1 = d3.select("#chart").append("svg") // draw main windows
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("class", "bar_graph1")	
			.attr("transform", "translate(" + margin.left_page   + "," + margin.top_page  + ")"); 
			

		var bar_graph2 = d3.select("#chart").selectAll("svg") // draw second bar 
			.append("g")
			.attr("class", "bar_graph2")	
			.attr("transform", "translate(" +(graph_separation)   + "," + margin.top_page  + ")"); 

		
			bar_graph1.selectAll()
			 .data(data_period1)
			 .enter()
			 .append("text")
			 .attr("class", "bar_title") 
			 .attr("text-anchor", "middle")
			 .attr("x", 10* XgridSize)     // x position of the first end of the line
			 .attr("y", -50)
			 .text(function(d,i) { return d.per1 + " - " + d.per2 });
			 
			 			 
		   bar_graph2.selectAll()
			 .data(data_period2)
			 .enter()
			 .append("text")
			 .attr("class", "bar_title") 
			 .attr("text-anchor", "middle")
			 .attr("x", 10* XgridSize)     // x position of the first end of the line
			 .attr("y", -50)
			 .text(function(d,i) { return d.per1 + " - " + d.per2 });
			
			 
			 
		bar_graph1.append("g") // draw axis
			.attr("class", "xaxis")
			.attr("transform", "translate(" + (0)+ "," + (yScale(nb_cancer+1+((nb_cancer-1)*bar_space))+2) + ")")
			.call(xAxis);
			
		bar_graph1.append("g") // draw axis
			.attr("class", "xaxis_minor")
			.attr("transform", "translate(" + (0)+ "," + (yScale(nb_cancer+1+((nb_cancer-1)*bar_space))+2) + ")")
			.call(xAxis_minor);
			
		bar_graph2.append("g") // draw axis
			.attr("class", "xaxis")
			.attr("transform", "translate(" + (0)+ "," + (yScale(nb_cancer+1+((nb_cancer-1)*bar_space))+2) + ")")
			.call(xAxis);
			
		bar_graph2.append("g") // draw axis
		.attr("class", "xaxis_minor")
		.attr("transform", "translate(" + (0)+ "," + (yScale(nb_cancer+1+((nb_cancer-1)*bar_space))+2) + ")")
		.call(xAxis_minor);
			
		
			
		var x_max = d3.max(data_temp, function(d) {return d.asr})
		var tick_list = tick_generator(x_max)
		
		bar_graph1.selectAll(".xaxis")
		  .data(tick_list.major, function(d) { return d; })
		  .enter()
		  .append("line")
		  .attr("class", "tick_major")
		  .attr("stroke", "black")
		  .attr("y1", graph_height)
		  .attr("y2", graph_height+8)
		  .attr("x1", function(d) { 
			return xScale(d); })
		   .attr("x2", function(d) { 
			return xScale(d); })

		bar_graph2.selectAll(".xaxis")
		  .data(tick_list.major, function(d) { return d; })
		  .enter()
		  .append("line")
		  .attr("class", "tick_major")
		  .attr("stroke", "black")
		  .attr("y1", graph_height)
		  .attr("y2", graph_height+8)
		  .attr("x1", function(d) { 
			return xScale(d); })
		   .attr("x2", function(d) { 
			return xScale(d); })
			
		bar_graph1.selectAll(".xaxis")
		  .data(tick_list.minor, function(d) { return d; })
		  .enter()
		  .append("line")
		  .attr("class", "tick_minor")
		  .attr("stroke", "black")
		  .attr("y1", graph_height)
		  .attr("y2", graph_height+6)
		  .attr("x1", function(d) { 
			return xScale(d); })
		   .attr("x2", function(d) { 
			return xScale(d); })
			
		bar_graph2.selectAll(".xaxis")
		  .data(tick_list.minor, function(d) { return d; })
		  .enter()
		  .append("line")
		  .attr("class", "tick_minor")
		  .attr("stroke", "black")
		   .attr("y1", graph_height)
		  .attr("y2", graph_height+6)
		  .attr("x1", function(d) { 
			return xScale(d); })
		   .attr("x2", function(d) { 
			return xScale(d); })


			
		var line_link =  bar_graph1.selectAll()
			.data(data_nest)
			.enter()
			.append("g")
			.attr("class", function(d,i) { 
				return "link1 " + d.key;})
			.attr("transform",function(d,i) {
				var rank1 = d.values[0].values[0].rank
				var rank2 = d.values[1].values[0].rank
				var rank_min = Math.min(rank1,rank2)
				if (rank_min < nb_cancer+1) {
					return "translate(0," + yScale(rank1 + (bar_space*(rank1-1))) + ")";
				} else {
					return "translate(0," + yScale(11 + (bar_space*(10))) + ")";
				}
				})
			.attr("opacity" ,function(d,i) {
				var rank1 = d.values[0].values[0].rank
				var rank2 = d.values[1].values[0].rank
				var rank_min = Math.min(rank1,rank2)
				if (rank_min < nb_cancer+1) {
					return 1;
					}
				else {
					return 0;
				}
			})
	

 			line_link.append("line")
				.attr("class","line_link")
				.attr("x1", function(d,i) {
					var rank1 = d.values[0].values[0].rank
					var rank2 = d.values[1].values[0].rank
					if (rank2 < nb_cancer+1 & rank1 > nb_cancer) {
						return (graph_separation-margin.left_page)-(line_separation)-30;
					}
					else {
					}
						return 20* XgridSize;
				})
				.attr("y1",  function(d,i) {
					var rank1 = d.values[0].values[0].rank
					var rank2 = d.values[1].values[0].rank
					if (rank2 < nb_cancer+1 & rank1 > nb_cancer) {
						return yScale((nb_cancer+1-rank1)+(bar_space*(nb_cancer+1-rank1)))+YgridSize;
					}
					else {
						return YgridSize/2;
					}
				})
				.attr("x2",  function(d,i) {
					var rank1 = d.values[0].values[0].rank
					var rank2 = d.values[1].values[0].rank
					if (rank1 < nb_cancer+1 & rank2 > nb_cancer) {
						return 20* XgridSize+40;
					}
					else {
						return (graph_separation-margin.left_page)-(line_separation);
					}
				})
				.attr("y2",function(d,i) {
					var rank1 = d.values[0].values[0].rank
					var rank2 = d.values[1].values[0].rank
					var rank_min = Math.min(rank1,rank2)
					var rank_diff = (rank2-rank1)+1
					if (rank1 < nb_cancer+1 & rank2 > nb_cancer) {
						return yScale((nb_cancer+4-rank2)+(bar_space*(nb_cancer+4-rank2)))+YgridSize;
					} else if (rank_min > nb_cancer) {
						return YgridSize/2;
					}
					else {
						return yScale(rank_diff+(bar_space*(rank_diff-1)))+YgridSize/2;
					}
					})
				.attr("stroke-width", 0.5)
								.attr("stroke", function(d,i) {
					var rank1 = d.values[0].values[0].rank
					var rank2 = d.values[1].values[0].rank
					var rank_diff = rank2-rank1;
					if (rank_diff > 0) {
						return "green";
					} else if (rank_diff < 0){
						return "red"
					} else {
						return "black"
					}
				});
			  
				
			var bar1 = bar_graph1.selectAll() // make 1 group for each cancer sites 
				.data(data_nest)
				.enter()
				.append("g")
				.attr("class", function(d,i) { return "bar1 " + d.key;})
				.attr("transform",function(d,i) {
				var rank = d.values[0].values[0].rank
				if (rank < nb_cancer+1) {
					return "translate(0," + yScale(rank + (bar_space*(rank-1))) + ")";
				} else {
					return "translate(0," + yScale(11 + (bar_space*(10-1))) + ")";
				}	
				})
			  .attr("opacity" ,function(d,i) {
				var rank = d.values[0].values[0].rank
				if (rank < nb_cancer+1) {
					return 1;
					}
				else {
					return 0;
				}
			  });
	
			 bar1.selectAll("text")
			  .data(function(d) {return d.values[0].values})	
			  .enter()
			  .append("text")
			  .attr("class", "label")
			  .attr("text-anchor", "end")
			  .attr("transform", "translate(-5,0)")
			  .each(function (d) {
				var lines = wordwrap(d.cancer_label, label_wrap)
				for (var i = 0; i < lines.length; i++) {

						d3.select(this).append("tspan").attr("dy",0).attr("x",0).attr("y",YgridSize/Math.pow(3/2, lines.length)+i*15).text(lines[i])

				}
				});	
			
			bar1.selectAll("rect")
				.data(function(d) {return d.values[0].values})		
				.enter()
				.append("rect")
				.classed("bordered", true)
				.attr("x", 0)
				.attr("y", 0)
				.attr("rx", 0)
				.attr("ry", 0)
				.attr("width", function(d,i) {return xScale(d.asr);})
				.attr("height", YgridSize)
				.attr("fill", "#2c7bb6")
			  
			bar1.append("line")
				.attr("class","line1")
				.attr("x1", function(d,i) { 
					return xScale(d.values[0].values[0].asr)+5;})
				.attr("y1", function(d,i) {return YgridSize/2;})
				.attr("x2",  20* XgridSize)
				.attr("y2", function(d,i) {return YgridSize/2;})
				.attr("stroke-width", 0.5)
				.attr("stroke", function(d,i) {
					var rank1 = d.values[0].values[0].rank
					var rank2 = d.values[1].values[0].rank
					var rank_diff = rank2-rank1;
					if (rank_diff > 0) {
						return "green";
					} else if (rank_diff < 0){
						return "red"
					} else {
						return "black"
					}
				});
			  
			 var bar2 = bar_graph2.selectAll() // make 1 group for each cancer sites 
				.data(data_nest)
				.enter()
				.append("g")
				.attr("class", function(d,i) { return "bar2 " + d.key;})
				.attr("transform",function(d,i) {
				var rank = d.values[1].values[0].rank
				if (rank < nb_cancer+1) {
					return "translate(0," + yScale(rank + (bar_space*(rank-1))) + ")";
				} else {
					return "translate(0," + yScale(11 + (bar_space*(10-1))) + ")";
				}	
				})
			  .attr("opacity" ,function(d,i) {
				var rank = d.values[1].values[0].rank
				if (rank < nb_cancer+1) {
					return 1;
					}
				else {
					return 0;
				}
			  });
	
			 bar2.selectAll("text")
			  .data(function(d) {return d.values[1].values})	
			  .enter()
			  .append("text")
			  .attr("id", function(d, i) { return d.cancer_label;})
			  .attr("class", "label")
			  .attr("text-anchor", "end")
			  .attr("transform", "translate(-5,0)")
			  .each(function (d) {
				var lines = wordwrap(d.cancer_label, label_wrap)
				for (var i = 0; i < lines.length; i++) {

						d3.select(this).append("tspan").attr("dy",0).attr("x",0).attr("y",YgridSize/Math.pow(3/2, lines.length)+i*15).text(lines[i])

				}
				});	
			  
			bar2.selectAll("rect")
				.data(function(d) {return d.values[1].values})	
				.enter()
				.append("rect")
				.classed("bordered", true)
				.attr("x", 0)
				.attr("y", 0)
				.attr("rx", 0)
				.attr("ry", 0)
				.attr("width", function(d,i) {return xScale(d.asr);})
				.attr("height", YgridSize)
				.attr("fill", "#2c7bb6")
			  
			bar2.append("line")
				.attr("class","line2")
				.attr("x1", -line_separation)
				.attr("y1", YgridSize/2)
				.attr("x2", function(d,i) {
						var temp = document.getElementById(d.values[1].values[0].cancer_label).getBBox().width;
						return (temp*-1)-10;
				})
				.attr("y2", YgridSize/2)
				.attr("stroke-width", 0.5)
				.attr("stroke", function(d,i) {
					var rank1 = d.values[0].values[0].rank
					var rank2 = d.values[1].values[0].rank
					var rank_diff = rank2-rank1;
					if (rank_diff > 0) {
						return "green";
					} else if (rank_diff < 0){
						return "red"
					} else {
						return "black"
					}
				});
				
			bar_graph1.append("line")
			 .style("stroke", "black")  // colour the line
			 .attr("x1", 0)     // x position of the first end of the line
			 .attr("y1", -20)      // y position of the first end of the line
			 .attr("x2", 0)     // x position of the second end of the line
			 .attr("y2", yScale(nb_cancer+1+((nb_cancer-1)*bar_space))+8); 
			
			bar_graph2.append("line")
			 .style("stroke", "black")  // colour the line
			 .attr("x1", 0)     // x position of the first end of the line
			 .attr("y1", -20)      // y position of the first end of the line
			 .attr("x2", 0)     // x position of the second end of the line
			 .attr("y2", yScale(nb_cancer+1+((nb_cancer-1)*bar_space))+8); 
			 

			bar_graph1.append("text")
			 .attr("class", "xtitle") 
			 .attr("text-anchor", "middle")
			 .attr("x", 10* XgridSize)     // x position of the first end of the line
			 .attr("y", yScale(nb_cancer+1+((nb_cancer-1)*bar_space))+50)
			 .text("Age standardized (W) incidence rate per 100,000");
			 
			 			 
		    bar_graph2.append("text")
			 .attr("class", "xtitle") 
			 .attr("text-anchor", "middle")
			 .attr("x", 10* XgridSize)     // x position of the first end of the line
			 .attr("y", yScale(nb_cancer+1+((nb_cancer-1)*bar_space))+50)
			 .text("Age standardized (W) incidence rate per 100,000");
			

			

		
			}
		);
	}
	
	function tick_generator(value_max)	{
	
		var log_max = Math.pow(10,Math.floor(Math.log10(value_max)));
		var unit_floor_max = Math.floor(value_max/log_max)
		var tick_space = 0;
		if (unit_floor_max < 2) {
			tick_space = 0.2*log_max;	
		}
		else {
			if (unit_floor_max < 5) {
				tick_space = 0.5*log_max;
				}
			else {
			tick_space = log_max;
			}
		}
		var value_top = Math.ceil(value_max/tick_space)*tick_space;
		
		var tick_list = new Object();  
		tick_list.major = [];
		tick_list.minor = [];
		tick_list.value_top = value_top; 
		var bool_major = true;
		for (var i = 0; i <= value_top; i += tick_space) {
			
			if (bool_major) {
				tick_list.major.push(i);
			} else {
				tick_list.minor.push(i);
			}
			
			bool_major = !bool_major;
			
		}
	return (tick_list)
	}
	
	
	function update(data) {
	
		var data_nest=d3.nest()
				.key(function(d) {return d.cancer;})
				.sortKeys(d3.ascending)
				.key(function(d) {return d.volume;})
				.sortKeys(d3.ascending)
				.entries(data)
				
			var data_period1 = data.filter(function(d){
					return (d.rank==1 & d.volume == 1 )
				});
				
			var data_period2 = data.filter(function(d){
					return (d.rank==1 & d.volume == 10 )
			});
			

			
		var bar_graph1 = d3.select("#chart").select(".bar_graph1").selectAll("rect")
					.data(data_nest)// draw main windows
						
		var bar_graph2 = d3.select("#chart").select(".bar_graph2").selectAll("rect")
			.data(data_nest)// draw main windows
					
		var bar1 = d3.select("#chart").selectAll(".bar1")
			.data(data_nest)
				
		var bar2 = d3.select("#chart").selectAll(".bar2")
			.data(data_nest)
			
		var link_line = d3.select("#chart").selectAll(".link1")
			.data(data_nest)
		
		var title_period1 = d3.select("#chart").select(".bar_graph1").selectAll(".bar_title")
			.data(data_period1)
			
		var title_period2 = d3.select("#chart").select(".bar_graph2").selectAll(".bar_title")
			.data(data_period2)
			
			title_period1
			.text(function(d,i) { return d.per1 + " - " + d.per2 });
			
			title_period2
			.text(function(d,i) { return d.per1 + " - " + d.per2 });
				
			 
			 			 
		   bar_graph2.selectAll()
			 .data(data_period2)
			 .enter()
			 .append("text")
			 .attr("class", "bar_title") 
			 .attr("text-anchor", "middle")
			 .attr("x", 10* XgridSize)     // x position of the first end of the line
			 .attr("y", -35)
			 .text(function(d,i) { return d.per1 + " - " + d.per2 });
			

		
		var x_max = d3.max(data, function(d) {return d.asr})
		var tick_list = tick_generator(x_max)
		
		xScale.domain([0,tick_list.value_top]);
		
		
		var xAxis = d3.svg.axis() 
		.scale(xScale)
		.orient("bottom")
		.tickSize(-graph_height-20, 0,0)
		.tickPadding(12)
		.tickValues(tick_list.major);
		
		var xAxis_minor = d3.svg.axis() 
		.scale(xScale)
		.orient("bottom")
		.tickSize(-graph_height-20, 0,0)
		.tickPadding(12)
		.tickValues(tick_list.minor)	
		.tickFormat("")		
		
		d3.select("#chart")
		   .selectAll(".xaxis")
           .transition().duration(1500).ease("sin-in-out")  // https://github.com/mbostock/d3/wiki/Transitions#wiki-d3_ease
           .call(xAxis); 

		d3.select("#chart")
		   .selectAll(".xaxis_minor")
           .transition().duration(1500).ease("sin-in-out")  // https://github.com/mbostock/d3/wiki/Transitions#wiki-d3_ease
           .call(xAxis_minor);  		   
		 
		 var xgrid_major1=d3.select("#chart").select(".bar_graph1").selectAll(".tick_major")
			.data(tick_list.major, function(d) { return d; })
		 
		 var xgrid_minor1=d3.select("#chart").select(".bar_graph1").selectAll(".tick_minor")
			.data(tick_list.minor, function(d) { return d; })
			
			xgrid_major1.transition().duration(1500).ease("sin-in-out")
				.attr("x1", function(d) { 
					return xScale(d); })
				.attr("x2", function(d) { 
					return xScale(d); })
					
			xgrid_major1.exit()
			.remove()
			
			xgrid_major1.enter()
			.append("line")
			.attr("class", "tick_major")
			.attr("stroke", "black")
			.attr("y1", graph_height)
		    .attr("y2", graph_height+8)
			.attr("x1", function(d) { 
				return xScale(d); })
			.attr("x2", function(d) { 
				return xScale(d); })
					
		 xgrid_minor1.transition().duration(1500).ease("sin-in-out")
				.attr("x1", function(d) { 
					return xScale(d); })
				.attr("x2", function(d) { 
					return xScale(d); })
					
		  xgrid_minor1.enter()
			.append("line")
			.attr("class", "tick_major")
			.attr("stroke", "black")
			.attr("y1", graph_height)
		    .attr("y2", graph_height+6)
			.attr("x1", function(d) { 
				return xScale(d); })
			.attr("x2", function(d) { 
				return xScale(d); })
			
			xgrid_minor1.exit().remove()
			
			 var xgrid_major2=d3.select("#chart").select(".bar_graph2").selectAll(".tick_major")
			.data(tick_list.major, function(d) { return d; })
		 
		 var xgrid_minor2=d3.select("#chart").select(".bar_graph2").selectAll(".tick_minor")
			.data(tick_list.minor, function(d) { return d; })
			
			xgrid_major2.transition().duration(1500).ease("sin-in-out")
				.attr("x1", function(d) { 
					return xScale(d); })
				.attr("x2", function(d) { 
					return xScale(d); })
					
			xgrid_major2.exit()
			.remove()
			
			xgrid_major2.enter()
			.append("line")
			.attr("class", "tick_major")
			.attr("stroke", "black")
			.attr("y1", graph_height)
		    .attr("y2", graph_height+8)
			.attr("x1", function(d) { 
				return xScale(d); })
			.attr("x2", function(d) { 
				return xScale(d); })
				
				  xgrid_minor2.enter()
			.append("line")
			.attr("class", "tick_minor")
			.attr("stroke", "black")
			.attr("y1", graph_height)
		    .attr("y2", graph_height+6)
			.attr("x1", function(d) { 
				return xScale(d); })
			.attr("x2", function(d) { 
				return xScale(d); })
					
		 xgrid_minor2.transition().duration(1500).ease("sin-in-out")
				.attr("x1", function(d) { 
					return xScale(d); })
				.attr("x2", function(d) { 
					return xScale(d); });
			
			xgrid_minor2.exit().remove()
	


			
			
		   
		link_line
			.transition().duration(transition_time)
			.attr("transform",function(d,i) {
				var rank1 = d.values[0].values[0].rank
				var rank2 = d.values[1].values[0].rank
				var rank_min = Math.min(rank1,rank2)
				if (rank_min < nb_cancer+1) {
					return "translate(0," + yScale(rank1 + (bar_space*(rank1-1))) + ")";
				} else {
					return "translate(0," + yScale(11 + (bar_space*(10))) + ")";
				}
			})
			.attr("opacity" ,function(d,i) {
				var rank1 = d.values[0].values[0].rank
				var rank2 = d.values[1].values[0].rank
				var rank_min = Math.min(rank1,rank2)
				if (rank_min < nb_cancer+1) {
					return 1;
					}
				else {
					return 0;
				}
			})
			
 		 d3.select("#chart").selectAll(".line_link")
		  .data(data_nest)
		  .transition().duration(transition_time)	
		 .attr("x1", function(d,i) {
					var rank1 = d.values[0].values[0].rank
					var rank2 = d.values[1].values[0].rank
					if (rank2 < nb_cancer+1 & rank1 > nb_cancer) {
						return (graph_separation-margin.left_page)-(line_separation)-30;
					}
					else {
						return 20* XgridSize;
					}
				})
				.attr("y1",  function(d,i) {
					var rank1 = d.values[0].values[0].rank
					var rank2 = d.values[1].values[0].rank
					if (rank2 < nb_cancer+1 & rank1 > nb_cancer) {
						return yScale((nb_cancer+1-rank1)+(bar_space*(nb_cancer+1-rank1)))+YgridSize;
					}
					else {
						return YgridSize/2;
					}
				})
				.attr("x2",  function(d,i) {
					var rank1 = d.values[0].values[0].rank
					var rank2 = d.values[1].values[0].rank
					if (rank1 < nb_cancer+1 & rank2 > nb_cancer) {
						return 20* XgridSize+40;
					}
					else {
						return (graph_separation-margin.left_page)-(line_separation);
					}
				})	
				.attr("y2",function(d,i) {
					var rank1 = d.values[0].values[0].rank
					var rank2 = d.values[1].values[0].rank
					var rank_min = Math.min(rank1,rank2)
					var rank_diff = (rank2-rank1)+1
					if (rank1 < nb_cancer+1 & rank2 > nb_cancer) {
						return yScale((nb_cancer+1-rank1)+(bar_space*(nb_cancer+1-rank1)))+YgridSize;
					} else if (rank_min > nb_cancer) {
						return YgridSize/2;
					}
					else {
						return yScale(rank_diff+(bar_space*(rank_diff-1)))+YgridSize/2;
					}
					})
				.attr("stroke", function(d,i) {
					var rank1 = d.values[0].values[0].rank
					var rank2 = d.values[1].values[0].rank
					var rank_diff = rank2-rank1;
					if (rank_diff > 0) {
						return "green";
					} else if (rank_diff < 0){
						return "red"
					} else {
						return "black"
					}
				});
					
			
		  
		bar1.transition().duration(transition_time)	
		  .attr("transform",function(d,i) {
			var rank = d.values[0].values[0].rank
			if (rank < nb_cancer+1) {
				return "translate(0," + yScale(rank + (bar_space*(rank-1))) + ")";
			} else {
				return "translate(0," + yScale(11 + (bar_space*(9))) + ")";
			}
		  })
		  .attr("opacity" ,function(d,i) {
			var rank = d.values[0].values[0].rank
			if (rank < nb_cancer+1) {
				return 1;
				}
			else {
				return 0;
			}
		  });
		  	

 		d3.select("#chart").selectAll(".line1")
		  .data(data_nest)
		  .transition().duration(transition_time)	
		  .attr("x1", function(d,i) {return xScale(d.values[0].values[0].asr)+5;})
		  .attr("stroke", function(d,i) {
			var rank1 = d.values[0].values[0].rank
			var rank2 = d.values[1].values[0].rank
			var rank_diff = rank2-rank1;
			if (rank_diff > 0) {
				return "green";
			} else if (rank_diff < 0){
				return "red"
			} else {
				return "black"
			}
		});
		
		 d3.select("#chart").selectAll(".line2")
		  .data(data_nest)
		  .transition().duration(transition_time)	
		  .attr("stroke", function(d,i) {
			var rank1 = d.values[0].values[0].rank
			var rank2 = d.values[1].values[0].rank
			var rank_diff = rank2-rank1;
			if (rank_diff > 0) {
				return "green";
			} else if (rank_diff < 0){
				return "red"
			} else {
				return "black"
			}
		});
  
		bar1.selectAll("rect")
		  .data(function(d) {return d.values[0].values;})
		  .transition().duration(transition_time)	
		  .attr("width", function(d,i) { 
			return xScale(d.asr);})
		  .attr("fill", function(d,i) { 
				if (d.sex == 1) {
					return "#2c7bb6";
				} else {
					return "#b62ca1";
				}
					
			});

		bar2.transition().duration(transition_time)	
		 .attr("transform",function(d,i) {
			var rank = d.values[1].values[0].rank
			if (rank < nb_cancer+1) {
				return "translate(0," + yScale(rank + (bar_space*(rank-1))) + ")";
			} else {
				return "translate(0," + yScale(11 + (bar_space*(9))) + ")";
			}
		  })
		  .attr("opacity" ,function(d,i) {
			var rank = d.values[1].values[0].rank
			if (rank < nb_cancer+1) {
				return 1;
				}
			else {
				return 0;
			}
		  });

		bar2.selectAll("rect")
			.data(function(d) {return d.values[1].values;})
			.transition().duration(transition_time)	
			.attr("width", function(d,i) { return xScale(d.asr);})
			.attr("fill", function(d,i) { 
				if (d.sex == 1) {
					return "#2c7bb6";
				} else {
					return "#b62ca1";
				}
					
			});
			
	}
			
			

	

	
	
	var populateComboRegistry = function(data) {
		
			var datatemp = data.filter(function(d){
			return (d.volume == 1 & d.sex == 1 & d.rank == 1)
			});

			var registry_list = {};
			for (i=0;i<nb_registry; i++ ) {
				registry_list[datatemp[i].country_label]=datatemp[i].country_code;
			}

			country_text = Object.keys(registry_list);
			country_text.sort();
				
			var select  = document.getElementById("countryList")
			
			for (i=0; i < nb_registry; i++ ) {
				var el = document.createElement("option");
				var temp=country_text[i]
				el.textContent = temp;
				el.value =registry_list[temp];
				select.appendChild(el);
			}
		}
		
function wordwrap(text, max) {
    var regex = new RegExp(".{0,"+max+"}(?:\\s|$)","g");
    var lines = []
    var line
    while ((line = regex.exec(text))!="") {
        lines.push(line);
    } 
	 return lines
}
		
	function combo_sex(sex) {
		
		if (sex == 'Men') {
			var sex_select = 1;
		} else {
			var sex_select = 2;
		}

		var file_use = "data/CI5IvsCI5X.csv"; 
		var country_select = document.getElementById('countryList').value;

			 d3.csv(file_use,
				function(d) {
				return {
					
					rank : +d.rank,
					cancer_label : d.cancer_label,
					cancer: +d.cancer,
					volume : +d.volume,
					sex : +d.sex,
					per1: d.per1,
					per2: d.per2,
					asr: +d.asr,
					country_label: d.country_label,
					country_code: +d.country_code

					
					
					};	
				},		
				function(data) {
		

				
				var datatemp = data.filter(function(d){
					return (d.country_code == country_select & d.sex == sex_select)
				});
				
				update(datatemp)
				
				}

			)

			
		}
		
	
	function combo_registry(thelist)
	    {
			if (document.getElementById('radio_sex_male').checked) {
				sex_select = 1;
			} else {
				sex_select = 2;
			}
		
		
		var file_use = "data/CI5IvsCI5X.csv"; 

			d3.csv(file_use,
				function(d) {
				return {
					
					rank : +d.rank,
					cancer_label : d.cancer_label,
					cancer: +d.cancer,
					volume : +d.volume,
					sex : +d.sex,
					per1: d.per1,
					per2: d.per2,
					asr: +d.asr,
					country_label: d.country_label,
					country_code: +d.country_code

					
					
					};	
				},		
				function(data) {
		
				var idx_1 = thelist.selectedIndex;
				country_select = thelist.options[idx_1].value;
				
				var datatemp = data.filter(function(d){
					return (d.country_code == country_select & d.sex == sex_select)
				});
				
				update(datatemp)
				
				}

			)

			
		}
		
	