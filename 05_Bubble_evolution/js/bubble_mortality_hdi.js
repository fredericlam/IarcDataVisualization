

	
    function bubble_evo() // generate heatmap 
	{ 	
		var file_use = "data/bochen_table_data.csv"; 
		
	

		d3.csv(file_use,
			
			function(d) {
			return {
				
				hdi_group : +d.hdi_group,
				sex : +d.sex,
				cancer_label : d.cancer_label,
				cancer_code: +d.cancer_code,
				volume : +d.volume,
				rate1: +d.rate1,
				rate2: +d.rate2,

				};	
			},		
			function(data) {
			
				
				// Keep men , very high HDI 
				var data_temp = data.filter(function(d){
					return (d.hdi_group == 0)
				});
				
				// create graph
										
				var bar_graph=[ // create array with both bargraph
				d3.select("#chart").append("svg") // draw main windows
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom)
					.append("g")
					.attr("class", "bar_graph1")	
					.attr("transform", "translate(" + margin.left_page   + "," + margin.top_page  + ")") 
				,
				d3.select("#chart").selectAll("svg") // draw second bar 
					.append("g")
					.attr("class", "bar_graph2")	
					.attr("transform", "translate(" +( margin.left_page + graph_width + graph_separation)   + "," + margin.top_page  + ")") 
				]
				
				var graph_legend =
				d3.select("#chart").selectAll("svg")
					.append("g")
					.attr("width", 100)
					.attr("height", 30)
					.append("g")
					.attr("class", "graph_legend")	
					.attr("transform", "translate(" + ( margin.left_page + (graph_width*2) + graph_separation + 110)   + "," + (margin.top_page-40)  + ")") 
					
				

				add_axis_title(bar_graph,data_temp,true);
				add_axis_title(bar_graph,data_temp,false);
				add_bar_text_line(bar_graph,data_temp, true);
				add_bar_text_line(bar_graph,data_temp, false);
				add_legend(graph_legend);
				
				
			
			
			}
		);
	}
	
	function add_legend(graph) {
		
		graph_select = graph
		
		 graph_select.append("circle")
			.attr("class","circle_legend1")
			.attr("r", 20)
			.style("stroke", "#b7b7b7")   // set the line colour
			.style("stroke-width", 2)
			.attr("fill", "none");
			
		graph_select.append("circle")
			.attr("class","circle_legend2")
			.attr("r", 20)
			.style("stroke", "#b7b7b7")   // set the line colour
			//.attr("cy", function(d, i) {return yScale(d.rate2)- yScale(d.rate1)})
			.style("stroke-width", 2)
			.attr("fill", "#b7b7b7");
			
		graph_select.append("text")
			.attr("class","text_legend1")
			.attr("text-anchor", "left")
			.attr("x", 25)
			.text("1981-1985")
			.attr("dy", "0.25em")
			
		graph_select.append("text")
			.attr("class","text_legend2")
			.attr("text-anchor", "left")
			.attr("x", 25)
			.text("2006-2010")
			.style("opacity",0)
			.attr("dy", "0.25em")

		
	}
	
	function add_axis_title(graph,data,bool_left_graph) { 
	// Add axis, title and x-title to the graph
		// graph to add axis and title 
		// data 
		// boolean: True:left graph, False: Right bar graph
		
		


		var y_max1 = d3.max(data, function(d) {return d.rate1})
		var y_max2 = d3.max(data, function(d) {return d.rate2})
		var y_max = d3.max([y_max1,y_max2])
		var tick_list = tick_generator(y_max)
		
		
		yScale.domain([0,tick_list.value_top]); // update xscale domain
		
		if (bool_left_graph) {
			v_key = 0 //volume key for the array or nest data
			axis_orient = "left"
			axis_x = 0
			axis_tick1 = 10
			axis_tick2 = 0
			graph_title = "Males"
		} else {
			v_key = 1 
			axis_orient = "right"
			axis_x = graph_width
			axis_tick1 = -graph_width
			axis_tick2 = graph_width+10
			graph_title = "Females"
			
		}
		

		var yAxis = d3.svg.axis() 
			.scale(yScale)
			.orient(axis_orient)
			.tickSize(-graph_width, 0,0)
			.tickPadding(12)
			.tickValues(tick_list.major)	
			
					
	    var yAxis_minor = d3.svg.axis() 
			.scale(yScale)
			.orient(axis_orient)
			.tickSize(-graph_width, 0,0)
			.tickPadding(12)
			.tickValues(tick_list.minor)	
			.tickFormat("")	;
			

		
		graph_select = graph[v_key]	
		
		graph_select.append("text")
			.attr("class", "bar_title") 
			.attr("text-anchor", "middle")
			.attr("x", graph_width/2)     
			.attr("y", -35)
			.text(graph_title);
			
		graph_select.append("g") // draw axis major
			.attr("class", "yaxis")
			.attr("transform", "translate(" + (axis_x)+ "," +(0) + ")")
			.call(yAxis);

		graph_select.append("g") // draw axis minor
			.attr("class", "yaxis_minor")
			.attr("transform", "translate(" + (axis_x)+ "," +(0) + ")")
			.call(yAxis_minor);
				
	
		graph_select.selectAll(".yaxis") // add Big tick
			.data(tick_list.major, function(d) { return d; })
			.enter()
			.append("line")
			.attr("class", "tick_major")
			.attr("stroke", "black")
			.attr("x2",  axis_tick2 )
			.attr("x1", -axis_tick1)
			.attr("y2", function(d) { return yScale(d); })
			.attr("y1", function(d) { return yScale(d); })
			
		graph_select.selectAll(".yaxis") // add small tick
			.data(tick_list.minor, function(d) { return d; })
			.enter()
			.append("line")
			.attr("class", "tick_minor")
			.attr("stroke", "black")
			.attr("x2",  axis_tick2)
			.attr("x1", -axis_tick1)
			.attr("y2", function(d) { return yScale(d); })
			.attr("y1", function(d) { return yScale(d); })
		
			
		graph_select.append("line") // add line for y = 0
			.style("stroke", "black")  
			.attr("x1", 0)
			.attr("y1", yScale(0))  
			.attr("x2", graph_width+5)
			.attr("y2", yScale(0));
			

		if (bool_left_graph) {
			graph_select.append("text") // add x axis subtitle
				.attr("class", "y_title")
				.attr("text-anchor", "middle")
				.attr("transform", "translate(-60," +var_height/2 + ") rotate(-90)")
				.text("Age-standardized (W) mortality rate per 100,000")
		} else {
			graph_select.append("text") // add x axis subtitle
				.attr("class", "y_title")
				.attr("text-anchor", "middle")
				.attr("transform", "translate("+(graph_width+75)+"," +var_height/2 + ") rotate(-90)")
				.text("Age-standardized (W) mortality rate per 100,000")
			
		}
		

			 			
	}

	function add_bar_text_line(graph, data,bool_left_graph) {

			
		if (bool_left_graph) {
			sex = 1
			v_key = 0 //volume key for the array or nest data
			axis_y_line = 0 
		} else {
			sex = 2
			v_key = 1 
			axis_y_line = graph_width
		}
		
		graph_select = graph[v_key]
		var data_temp = data.filter(function(d){
			return (d.sex==sex)
		});
		
		var nodes = graph_select.append("g")
		   .attr("id","nodes_id")
           .attr("class", "nodes")
           .selectAll("circle")
           .data(data_temp)
           .enter()
           .append("g")
		   .attr("transform", function(d, i) {
		   return "translate(" + xScale((i+1)*(bar_space+1)) + ",0)";}) 
		   
		nodes.append("line") // add line for each group
			.style("stroke", "black")  
			.attr("y1", yScale(0))  
			.attr("y2", yScale(0) - var_height)
			.style("opacity", 0.1);
			
	   nodes.append("line") // add tick for each group
			.style("stroke", "black")  
			.attr("y1", yScale(0) + 10)  
			.attr("y2", yScale(0))
			.style("opacity", 1);
		    

			
		 nodes.append("circle")
			.attr("class","circle1")
			.attr("r", 20)
			.style("stroke", function(d,i) {return color_cancer[d.cancer_label];})   // set the line colour
			.style("stroke-width", 2)
			.attr("transform", function(d, i) {return "translate(0," + (yScale(d.rate1)) + ")";}) 
			.attr("fill", "none");
			
	   nodes.append("svg:path")
		.attr("class","arrow_link")
		.attr("fill", function(d,i) {return color_cancer[d.cancer_label];})
		.attr("d", function(d,i) {
			var update_range = yScale(d.rate2)- yScale(d.rate1)
			if (update_range > 0) {
				return (d3.svg.symbol().type("triangle-down")(10,1))
			} 
			else {
				return (d3.svg.symbol().type("triangle-up")(10,1))
			}
		})
		.attr("transform",  function(d,i) {
				var update_range = yScale(d.rate2)- yScale(d.rate1)
				var offset = Math.sign(update_range)*14
				return ( "translate(0," + ( offset + yScale(d.rate1))+ ")");
		})

		
				
	  nodes.append("line")
			.attr("class","line_link")
	  		.style("stroke", function(d,i) {return color_cancer[d.cancer_label];}) 
			.style("stroke-width", 2)				
			.attr("y1", function(d,i) {
				var update_range = yScale(d.rate2)- yScale(d.rate1)
				return (Math.sign(update_range)*20) + yScale(d.rate1)
			})
			.attr("y2", function(d,i) {
				var update_range = yScale(d.rate2)- yScale(d.rate1)
				return (Math.sign(update_range)*20) + yScale(d.rate1)
			});
			
		graph_select.append("line") // add line for x = 0
			.style("stroke", "black")  
			.attr("x1", axis_y_line)
			.attr("y1", yScale(0))  
			.attr("x2", axis_y_line)
			.attr("y2", 0);

			

		nodes.append("circle")
			.attr("class","circle2")
			.attr("r", 20)
			.style("stroke", function(d,i) {return color_cancer[d.cancer_label];})    // set the line colour
			.style("stroke-width", 2)
			.attr("transform", function(d, i) {return "translate(0," + (yScale(d.rate1)) + ")";}) 
			.attr("fill", function(d,i) {return color_cancer[d.cancer_label];});
		   
		nodes.append("text")
			.attr("class","text1")
			.attr("text-anchor", "middle")
			.text(function(d,i) {return d.rate1})
			.attr("transform", function(d, i) {return "translate(0," + (yScale(d.rate1)) + ")";}) 
			.attr("dy", "0.25em")
			.attr("fill", function(d,i) {return color_cancer[d.cancer_label];});    // set the line colour
			
		nodes.append("text")
		    .attr("class","text2")
			.attr("text-anchor", "middle")
			.attr("transform", function(d, i) {return "translate(0," + (yScale(d.rate1)) + ")";}) 
			.text(function(d,i) {return d.rate1})
			.attr("dy", "0.25em")
			.attr("fill", "#000000");    // set the line colour
			
	   nodes.append("text")
			.attr("class","cancer_label")
			.attr("text-anchor", "middle")
			.attr("y", function(d, i) {return  yScale(0) + 20 })
			.text(function(d,i) {return d.cancer_label})
			.attr("dy", "0.25em")
			.attr("fill", "#000000");    // set the line colour
			


			
		
		nodes.append("text")
			.attr("class", "text_percent")
			.attr("text-anchor", "left")
			.attr("x",function(d,i) {
				var update_range = yScale(d.rate2)- yScale(d.rate1)
				if (update_range  > 50 || update_range  < -50 ) {
					return 8;
				}
				else {
					return 22;
				}
			})
			.text(function(d,i) {
				return d3.format("+.0%")((d.rate2-d.rate1)/d.rate1)
			})
			.attr("transform", function(d, i) {return "translate(0," + (yScale(d.rate1)) + ")";}) 
			.attr("dy", "0.25em")
			//.attr("fill", function(d,i) {return color_cancer[d.cancer_label];})
			.attr("fill", "#000000")
			.style("opacity",0); 
			

		

		
	}
	
	function update(bool) {
		

			document.getElementById('radio_old').disabled = true;
			document.getElementById('radio_new').disabled = true;
			document.getElementById('radio_HDI1').disabled = true;
			document.getElementById('radio_HDI2').disabled = true;
			
			update_circle(".bar_graph1", bool);
			update_circle(".bar_graph2", bool);
			update_legend(bool);
			
		
	}
	
	
	function update_legend(bool) {
		
		d3.select("#chart").select(".graph_legend").selectAll(".circle_legend2")
			.transition().duration(transition_time).ease(ease_effect)
						.attr("transform",function(d,i) {
				if (bool) {
					return "translate(0,50)";
				}
				else {
					return "translate(0,0)";
				}
			})
			
		d3.select("#chart").select(".graph_legend").selectAll(".text_legend2")
			.transition().duration(transition_time).ease(ease_effect)
			.attr("transform",function(d,i) {
				if (bool) {
					return "translate(0,50)";
				}
				else {
					return "translate(0,0)";
				}
			})
			.style("opacity",function() {
				if (bool) {
					return 1;
				}
				else {
					return 0;
				}
			})
			.each("end", function() {
				document.getElementById('radio_old').disabled = false;
				document.getElementById('radio_new').disabled = false;
				document.getElementById('radio_HDI1').disabled = false;
				document.getElementById('radio_HDI2').disabled = false;});
	}
	
	
	function update_circle(bar_graph_class, bool) {
	
		var nodes = d3.select("#chart")
		
		
			
		nodes.selectAll(".circle2")
			.transition().duration(transition_time).ease(ease_effect)
			.attr("transform",function(d,i) {
				if (bool) {
					update_range = yScale(d.rate2)
				}
				else {
					update_range = yScale(d.rate1)
				}
				return "translate(0," + (update_range) + ")";
			});
			
		nodes.selectAll(".text1")
			.transition().duration(transition_time).ease(ease_effect)
			.style("opacity", function(d,i) {
				var update_range = yScale(d.rate2)- yScale(d.rate1)
				if (update_range  <= 25 && update_range  >= -25 ) {
					return (0);
				} 
			});
			
			
		nodes.selectAll(".text2")
			.transition().duration(transition_time).ease(ease_effect)
			.text(function(d,i) {
				if (bool) {
					temp_text = d.rate2
				}
				else {
					temp_text = d.rate1
				}
				
				return temp_text})
			.attr("transform",function(d,i) {
				if (bool) {
					update_range = yScale(d.rate2)
				}
				else {
					update_range = yScale(d.rate1)
				}
				return "translate(0," + (update_range) + ")";
			});
			
		nodes.selectAll(".line_link")
			.style("opacity", function(d,i) {
				var update_range = yScale(d.rate2)- yScale(d.rate1)
				if (update_range <= 50 && update_range  >= -50 ) {
					return (0);
				} 
			})
			
			
		nodes.selectAll(".line_link")
			.transition().duration(transition_time).ease(ease_effect)
			.attr("y2", function(d,i) {
				
				update_range = yScale(d.rate2)- yScale(d.rate1)
				var offset = Math.sign(update_range)*(-20)
				
				if (bool) {
					offset = Math.sign(update_range)*(-25)
					if (update_range  > 50 || update_range  < -50 ) {
						return(yScale(d.rate2) + offset);
					} else {
						return(yScale(d.rate1) + offset);
					}
				}
				else {
					return(yScale(d.rate1) + offset);
				}
				
			});


		nodes.selectAll(".arrow_link")
			.style("opacity", function(d,i) {
				var update_range = yScale(d.rate2)- yScale(d.rate1)
				if (update_range <= 50 && update_range >= -50 ) {
					return (0);
				} 
			})	
			
		nodes.selectAll(".arrow_link")
			.transition().delay(0).duration(transition_time).ease(ease_effect)
			.attr("transform",  function(d,i) {
				var update_range = yScale(d.rate2)- yScale(d.rate1)
				var offset = Math.sign(update_range)*14
				
				if (bool) {
					 offset = Math.sign(update_range)* (-27)
					if (update_range  > 50 || update_range  < -50 ) {
						return ( "translate(0," + (yScale(d.rate2) + offset)+ ")");
					}
					else {
						return ( "translate(0," + (yScale(d.rate1) +offset)+ ")");
					}
				}
				else {
					return ( "translate(0," + (yScale(d.rate1) +offset)+ ")");
				}				
			})
			
			
		nodes.selectAll(".text_percent")
			.transition().duration(transition_time).ease(ease_effect)
			.attr("transform",function(d,i) {
				if (bool) {
					var update_range = (yScale(d.rate2) + yScale(d.rate1)) / 2
				}
				else {
					var update_range = yScale(d.rate1)
				}
				return "translate(0," + (update_range) + ")";
			})
			.style("opacity",function() {
				if (bool) {
					return 1;
				}
				else {
					return 0;
				}
			});
	}
			

	function update_data(group_label,group_value){
		
		var file_use = "data/bochen_table_data.csv"; 
		
		if (group_value == 0) {
			subtitle = "Very high HDI"
		}
		else {
			subtitle = "Medium & High HDI"
		}
		
		d3.select("#header").select(".desc").text(subtitle)
	
		d3.csv(file_use,
			
			function(d) {
			return {
				
				hdi_group : +d.hdi_group,
				sex : +d.sex,
				cancer_label : d.cancer_label,
				cancer_code: +d.cancer_code,
				volume : +d.volume,
				rate1: +d.rate1,
				rate2: +d.rate2,

				};	
			},		
			function(data) {
				
				document.getElementById('radio_old').checked= true;
				document.getElementById('radio_new').checked= false;

			
				var data_temp = data.filter(function(d){
					return (d[group_label] == group_value)
				});
				
				var bar_graph=[
					d3.select("#chart").select(".bar_graph1"),
					d3.select("#chart").select(".bar_graph2")
					]
				
				var graph_legend = d3.select("#chart").select(".graph_legend")
				
				//add_axis_title(bar_graph,data_temp,true);
				//add_axis_title(bar_graph,data_temp,false);
				document.getElementById('radio_old').disabled = true;
				document.getElementById('radio_new').disabled = true;
				document.getElementById('radio_HDI1').disabled = true;
				document.getElementById('radio_HDI2').disabled = true;
				
				if (document.getElementById('check_axis').checked) {
					update_axis(bar_graph,data_temp,true);
					update_axis(bar_graph,data_temp,false);
				}

				update_data_circle(bar_graph,data_temp, true);
				update_data_circle(bar_graph,data_temp, false);
				update_legend( false);
				

			}
		)
			
	}
					
	function update_axis(graph,data,bool_left_graph) {
		
		var y_max1 = d3.max(data, function(d) {return d.rate1})
		var y_max2 = d3.max(data, function(d) {return d.rate2})
		var y_max = d3.max([y_max1,y_max2])
		var tick_list = tick_generator(y_max)
		
		yScale.domain([0,tick_list.value_top]); // update xscale domain
		
		if (bool_left_graph) {
			v_key = 0 //volume key for the array or nest data
			axis_orient = "left"
			axis_x = 0
			axis_tick1 = 10
			axis_tick2 = 0
			graph_title = "Males"
		} else {
			v_key = 1 
			axis_orient = "right"
			axis_x = graph_width
			axis_tick1 = -graph_width
			axis_tick2 = graph_width + 10
			graph_title = "Females"
		}
		

		var yAxis = d3.svg.axis() 
			.scale(yScale)
			.orient(axis_orient)
			.tickSize(-graph_width, 0,0)
			.tickPadding(12)
			.tickValues(tick_list.major)	
			
					
	    var yAxis_minor = d3.svg.axis() 
			.scale(yScale)
			.orient(axis_orient)
			.tickSize(-graph_width, 0,0)
			.tickPadding(12)
			.tickValues(tick_list.minor)	
			.tickFormat("")	;
			
		graph_select = graph[v_key]	
		
		graph_select  //  grid Major transition
		   .selectAll(".yaxis")
           .transition().duration(transition_time).ease(ease_effect)  
           .call(yAxis); 

		graph_select //  grid Minor transition
		   .selectAll(".yaxis_minor")
            .transition().duration(transition_time).ease(ease_effect)
           .call(yAxis_minor);  
		
		
		
		// update tick position major
		 var xgrid_major=graph_select.selectAll(".tick_major")
			.data(tick_list.major, function(d) { return d; })
			
		xgrid_major.transition().duration(transition_time).ease(ease_effect)
			.attr("y1", function(d) {return yScale(d); })
			.attr("y2", function(d) {return yScale(d); })
					
		xgrid_major.exit().remove()
			
		xgrid_major.enter()
			.append("line")
			.attr("class", "tick_major")
			.attr("stroke", "black")
			.attr("x2",  axis_tick2 )
		    .attr("x1", -axis_tick1)
			.attr("y1", function(d) { return yScale(d); })
			.attr("y2", function(d) { return yScale(d); })
			
		var xgrid_minor=graph_select.selectAll(".tick_minor")
			.data(tick_list.minor, function(d) { return d; })		
			
		 xgrid_minor.transition().duration(transition_time).ease(ease_effect)
			.attr("y1", function(d) { return yScale(d); })
			.attr("y2", function(d) { return yScale(d); })
		
		xgrid_minor.exit().remove()
					
		xgrid_minor.enter()
			.append("line")
			.attr("class", "tick_minor")
			.attr("stroke", "black")
			.attr("x2",  axis_tick2)
			.attr("x1", -axis_tick1)
			.attr("y2", function(d) { return yScale(d); })
			.attr("y1", function(d) { return yScale(d); })
		
	
	}		
	function update_data_circle(graph, data,bool_left_graph) {
		
		if (bool_left_graph) {
			sex = 1
			v_key = 0 //volume key for the array or nest data
		} else {
			sex = 2
			v_key = 1 
		}
		
		graph_select = graph[v_key]
		var data_temp = data.filter(function(d){
			return (d.sex==sex)
		});
		
		graph_select.selectAll(".circle1")
			.data(data_temp)
			.transition().duration(transition_time).ease(ease_effect)
			.style("stroke", function(d,i) {return color_cancer[d.cancer_label];})   
			.attr("transform", function(d, i) {
				return "translate(" + 0 + "," + yScale(d.rate1) + ")";
			}); 
		
		graph_select.selectAll(".circle2")
			.data(data_temp)
			.transition().duration(transition_time).ease(ease_effect)
			.attr("transform", function(d, i) {
				return "translate(" + 0 + "," + yScale(d.rate1) + ")";
			})
			.attr("fill", function(d,i) {return color_cancer[d.cancer_label];});
			
		graph_select.selectAll(".arrow_link")
			.data(data_temp)
			.transition().duration(transition_time).ease(ease_effect)
			.attr("fill", function(d,i) {return color_cancer[d.cancer_label];})
			.attr("d", function(d,i) {
				var update_range = yScale(d.rate2)- yScale(d.rate1)
				if (update_range > 0) {
					return (d3.svg.symbol().type("triangle-down")(10,1))
				} 
				else {
					return (d3.svg.symbol().type("triangle-up")(10,1))
				}
			})
			.attr("transform",  function(d,i) {
				var update_range = yScale(d.rate2)- yScale(d.rate1)
				var offset = Math.sign(update_range)*14
				return ( "translate(0," + ( offset + yScale(d.rate1))+ ")");	
			})
			.style("opacity",1);
		
		graph_select.selectAll(".line_link")
			.data(data_temp)
			.transition().duration(transition_time).ease(ease_effect)
	  		.style("stroke", function(d,i) {return color_cancer[d.cancer_label];}) 			
			.attr("y1", function(d,i) {
				var update_range = yScale(d.rate2)- yScale(d.rate1)
				return ((Math.sign(update_range)*20) + yScale(d.rate1))
			})
			.attr("y2", function(d,i) {
				var update_range = yScale(d.rate2)- yScale(d.rate1)
				return ((Math.sign(update_range)*20) + yScale(d.rate1))
			})
			.style("opacity",1);
			
		graph_select.selectAll(".text1")
			.data(data_temp)
			.transition().duration(transition_time).ease(ease_effect)
			.text(function(d,i) {return d.rate1})
			.attr("transform", function(d, i) {return "translate(0," + (yScale(d.rate1)) + ")";}) 
			.attr("fill", function(d,i) {return color_cancer[d.cancer_label];});    // set the line colour
			
		graph_select.selectAll(".text2")
			.data(data_temp)
			.transition().duration(transition_time).ease(ease_effect)
			.attr("transform", function(d, i) {return "translate(0," + (yScale(d.rate1)) + ")";}) 
			.text(function(d,i) {return d.rate1})

			
		graph_select.selectAll(".cancer_label")
			.data(data_temp)
			.transition().duration(transition_time).ease(ease_effect)
			.text(function(d,i) {return d.cancer_label})

		
		graph_select.selectAll(".text_percent")
			.data(data_temp)
			.transition().duration(transition_time).ease(ease_effect)
			.attr("x",function(d,i) {
				var update_range = yScale(d.rate2)- yScale(d.rate1)
				if (update_range  > 50 || update_range  < -50 ) {
					return 8;
				}
				else {
					return 22;
				}
			})
			.text(function(d,i) {
				return d3.format("+.0%")((d.rate2-d.rate1)/d.rate1)
			})
			.attr("transform", function(d, i) {return "translate(0," + (yScale(d.rate1)) + ")";}) 
			.style("opacity",0); 
			
	}
	
	
	function tick_generator(value_max, value_min = 0, log_scale=false )	{
	//generate tick on the axis 
		//max of the value
			//Return array if element
			//tick_list.major: Major tick 
			//tick_list.minor: Minor tick 
			//tick_list.value_top: Last tick
		
		var tick_list = new Object();  
		tick_list.major = [];
		tick_list.minor = [];
		tick_list.value_top = value_max; // Will change according to the last tick
			
		var log_max = Math.pow(10,Math.floor(Math.log10(value_max))); // order of magnitude of max (power of 10)
		var unit_floor_max = Math.floor(value_max/log_max) // left digit of max 
		
		if (!log_scale) {
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
			// to create major and minor list
			for (var i = 0; i <= value_top; i += tick_space) {
				if (bool_major) {
					tick_list.major.push(i);
				} else {
					tick_list.minor.push(i);
				}
				
				bool_major = !bool_major;
				
			}
		} else {
		
			var temp = 0;
			var log_min = Math.pow(10,Math.floor(Math.log10(value_min))); // order of magnitude of max (power of 10)
			var unit_floor_min = Math.floor(value_min/log_min) // left digit of max 
			
			if (log_min == log_max) { // if min and max same magnitude
			
				for (var i = unit_floor_min; i <= unit_floor_max+1; i++) {
					temp = i*log_min;
					tick_list.major.push(temp);
				}
				if (unit_floor_min == unit_floor_max) { // min and max same first digit
				
					for (var i = 0; i <= 9; i++) {
						temp = (i*log_min/10); 
						temp = (unit_floor_min*log_min) + temp;
						tick_list.minor.push(temp);
					}
				}
				else {
					
					for (var i = 0; i <= 19; i++) {
						temp = (i*log_min/10); 
						temp = (unit_floor_min*log_min) + temp;
						tick_list.minor.push(temp);
					}
				}
			} else if ((log_max/log_min) < 1000){  //if max and min difference magnitude < 1000
				
				if (unit_floor_min < 6) {
					for (var i = unit_floor_min; i <= 5; i++) {
						temp = i*log_min;
						tick_list.major.push(temp);
					}
				
				tick_list.major.push(7*log_min);
				
				}
				else {
					tick_list.major.push(unit_floor_min*log_min);
				}
				
				for (var i = unit_floor_min; i <= 19; i++) {
						temp = (i*log_min); 
						tick_list.minor.push(temp);
				}
				
				while (log_min != (log_max/10)) {
					
					log_min = log_min*10;
					tick_list.major.push(log_min);
					tick_list.major.push(2*log_min);
					tick_list.major.push(3*log_min);
					tick_list.major.push(5*log_min);
					tick_list.major.push(7*log_min);
					
					for (var i = 2; i <= 19; i++) {
						temp = (i*log_min); 
						tick_list.minor.push(temp);
					}	
				}
				for (var i = 2; i <= unit_floor_max+1; i++) {
						temp = (i*log_max); 
						tick_list.minor.push(temp);
				}

				if (unit_floor_max < 5 ) {
					for (var i = 1; i <= unit_floor_max+1; i++) {
						temp = (i*log_max); 
						tick_list.major.push(temp);
					}
					
				} else if (unit_floor_max < 7) {
					tick_list.major.push(log_max);
					tick_list.major.push(2*log_max);
					tick_list.major.push(3*log_max);
					tick_list.major.push(5*log_max);
					tick_list.major.push((unit_floor_max+1)*log_max);
					
				} else {
					tick_list.major.push(log_max);
					tick_list.major.push(2*log_max);
					tick_list.major.push(3*log_max);
					tick_list.major.push(5*log_max);
					tick_list.major.push(7*log_max);
					tick_list.major.push((unit_floor_max+1)*log_max);
				}
				
			} else { //if max and min difference magnitude > 1000
				
				if (unit_floor_min == 1) {
					tick_list.major.push(log_min);
					tick_list.major.push(2*log_min);
					tick_list.major.push(3*log_min);
					tick_list.major.push(5*log_min);
				} else if (unit_floor_min == 2) {
					tick_list.major.push(2*log_min);
					tick_list.major.push(3*log_min);
					tick_list.major.push(5*log_min);
				} else if (unit_floor_min < 6) {
					tick_list.major.push(5*log_min);
					tick_list.major.push(7*log_min);	
				} else {
					tick_list.major.push(7*log_min);	
				}
				
				for (var i = unit_floor_min; i <= 9; i++) {
						temp = (i*log_min); 
						tick_list.minor.push(temp);
				}
				
				while (log_min != (log_max/10)) {
					
					log_min = log_min*10;
					tick_list.major.push(log_min);
					tick_list.major.push(2*log_min);
					tick_list.major.push(5*log_min);
					
					for (var i = 2; i <= 9; i++) {
						temp = (i*log_min); 
						tick_list.minor.push(temp);
					}	
				}
				
				for (var i = 2; i <= unit_floor_max+1; i++) {
					temp = (i*log_max); 
					tick_list.minor.push(temp);
				}	
				
				if (unit_floor_max < 5) {
					tick_list.major.push(log_max);
					tick_list.major.push(2*log_max);
					tick_list.major.push((unit_floor_max+1)*log_max);
				} else if (unit_floor_min < 6) {
					tick_list.major.push(1*log_max);
					tick_list.major.push(2*log_max);
					tick_list.major.push(5*log_max);
				} else if (unit_floor_min < 7) {
					tick_list.major.push(1*log_max);
					tick_list.major.push(2*log_max);
					tick_list.major.push(5*log_max);	
					tick_list.major.push(7*log_max);	
				} else {
					tick_list.major.push(1*log_max);
					tick_list.major.push(2*log_max);
					tick_list.major.push(5*log_max);	
					tick_list.major.push(7*log_max);
					tick_list.major.push((unit_floor_max+1)*log_max);					
				}		
			}
		
		var max_major = tick_list.major[tick_list.major.length-1];
		var max_minor = tick_list.minor[tick_list.minor.length-1];
		
		
		tick_list.value_top = Math.max(max_major,max_minor)	
		}
	return (tick_list)
	}
	
		
		
	function wordwrap(text, max) { // to wrap label (not from me, forget the link)
		var regex = new Regelastic(".{0,"+max+"}(?:\\s|$)","g");
		var lines = []
		var line
		while ((line = regex.exec(text))!="") {
			lines.push(line);
		} 
		return lines
	}
		

	

	
	
	
		
		
	
	
	
	