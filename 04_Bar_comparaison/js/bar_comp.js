

	
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
				
				
				var data_nest=d3.nest()
						.key(function(d) {return d.cancer;})
						.sortKeys(d3.ascending)
						.key(function(d) {return d.volume;})
						.sortKeys(d3.ascending)
						.entries(data_temp)
						
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
					.attr("transform", "translate(" +(graph_separation)   + "," + margin.top_page  + ")") 
				]
				

					add_axis_title(bar_graph[0],data_temp, 1);
					add_axis_title(bar_graph[1],data_temp,10);
					add_bar_text_line(bar_graph[0],data_nest, 1)
					add_bar_text_line(bar_graph[1],data_nest, 10)	
					add_line_link(bar_graph[0],data_nest);			
			
			}
		);
	}
	
	
	function add_axis_title(bar_graph,data,volume) {
		
		
		var data_period = data.filter(function(d){
			return (d.rank==1 & d.volume == volume )
		});
		
			bar_graph.selectAll() // add title of bar_graph (periode)
				 .data(data_period)
				 .enter()
				 .append("text")
				 .attr("class", "bar_title") 
				 .attr("text-anchor", "middle")
				 .attr("x", 10* XgridSize)     
				 .attr("y", -50)
				 .text(function(d,i) { return d.per1 + " - " + d.per2 });
				 
			bar_graph.append("g") // draw axis major
				.attr("class", "xaxis")
				.attr("transform", "translate(" + (0)+ "," + (yScale(nb_cancer+1+((nb_cancer-1)*bar_space))+2) + ")")
				.call(xAxis);
				
			bar_graph.append("g") // draw axis minor
				.attr("class", "xaxis_minor")
				.attr("transform", "translate(" + (0)+ "," + (yScale(nb_cancer+1+((nb_cancer-1)*bar_space))+2) + ")")
				.call(xAxis_minor);
				
			var x_max = d3.max(data, function(d) {return d.asr})
			var tick_list = tick_generator(x_max)
			
			bar_graph.selectAll(".xaxis")
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
				
			bar_graph.selectAll(".xaxis")
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
				
			bar_graph.append("line") // add line for x = 0
				.style("stroke", "black")  
				.attr("x1", 0)    
				.attr("y1", -20)  
				.attr("x2", 0)  
				.attr("y2", yScale(nb_cancer+1+((nb_cancer-1)*bar_space))+8);

			bar_graph.append("text") // ad x sub title
				.attr("class", "xtitle") 
				.attr("text-anchor", "middle")
				.attr("x", 10* XgridSize)     
				.attr("y", yScale(nb_cancer+1+((nb_cancer-1)*bar_space))+50)
				.text("Age standardized (W) incidence rate per 100,000");
		
		
			 			
	}

	function add_bar_text_line(bar_graph, data_nest, volume) {
		
		if (volume == 1) {
			var v_key = 0;
		} else {
			var v_key = 1;
		}
			
		
		var bar = bar_graph.selectAll() // create groupe contening (bar text and line)
			.data(data_nest)
			.enter()
			.append("g")
			.attr("class", function(d,i) {return "bar" +(v_key+1) +" "+ d.key;})
			.attr("transform",function(d,i) {
				var rank = d.values[v_key].values[0].rank
				if (rank < nb_cancer+1) {
					return "translate(0," + yScale(rank + (bar_space*(rank-1))) + ")";
				} else {
					return "translate(0," + yScale( nb_cancer+1 + (bar_space*(nb_cancer-1))) + ")";
				}	
			})
			.attr("opacity" ,function(d,i) {
				var rank = d.values[v_key].values[0].rank
				if (rank < nb_cancer+1) {
					return 1;
					}
				else {
					return 0;
				}
			 });
			 
		bar.selectAll("text") // add cancer_label to group
			.data(function(d) {return d.values[v_key].values})	
			.enter()
			.append("text")
			.attr("id",function(d) {
				return "id" + (v_key+1) + "_" + d.cancer_label;
			})
			.attr("class", "label")
			.attr("text-anchor", "end")
			.attr("transform", "translate(-5,0)")
			.each(function (d) {
				var lines = wordwrap(d.cancer_label, label_wrap)
				for (var i = 0; i < lines.length; i++) {
					d3.select(this).append("tspan").attr("dy",0).attr("x",0).attr("y",YgridSize/Math.pow(3/2, lines.length)+i*15).text(lines[i])
					}
			});	
			
		bar.selectAll("rect") // add bar to group
			.data(function(d) {return d.values[v_key].values})		
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
			
		bar.append("line")  // add line to group
			.attr("class","line" + (v_key+1))
			.attr("x1", function(d,i) { 
				if (volume == 1) {
					return xScale(d.values[v_key].values[0].asr)+5;
				} else {
					return -line_separation;
					
				}
			})
			.attr("y1", YgridSize/2)
			.attr("y2", YgridSize/2)
			.attr("x2",  function(d,i) { 
				if (volume == 1) {
					return var_width;
				} else {
					var temp_id = "id2_" + d.values[v_key].values[0].cancer_label;
					var temp = document.getElementById(temp_id).getBBox().width;
					return -(temp+10);	
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
		
	}
	
	function add_line_link(bar_graph,data_nest) {
	
		var line_link =  bar_graph.selectAll()
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
					return "translate(0," + yScale(nb_cancer+1+ (bar_space*(nb_cancer))) + ")";
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
			});
			
		line_link.append("line")
			.attr("class","line_link")
			.attr("x1", function(d,i) {
				var rank1 = d.values[0].values[0].rank
				var rank2 = d.values[1].values[0].rank
				if (rank2 < nb_cancer+1 & rank1 > nb_cancer) {
					return (graph_separation-margin.left_page)-(line_separation)-30;
				}
				else {
					return var_width;
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
					return var_width+40;
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
	}
	
		
	function update_axis_title(data,volume,tick_list) {
		
		if (volume == 1) {
			var bar_graph_class = ".bar_graph1";
		} else {
			var bar_graph_class = ".bar_graph2";
		}
	
		var data_period = data.filter(function(d){
			return (d.rank==1 & d.volume == volume )
		});
		
		var title_period = d3.select("#chart").select(bar_graph_class).selectAll(".bar_title")
			.data(data_period)
			.text(function(d,i) { return d.per1 + " - " + d.per2 });
		

		// update tick position major and minor
		 var xgrid_major=d3.select("#chart").select(bar_graph_class).selectAll(".tick_major")
			.data(tick_list.major, function(d) { return d; })
		 
		 var xgrid_minor=d3.select("#chart").select(bar_graph_class).selectAll(".tick_minor")
			.data(tick_list.minor, function(d) { return d; })
			
			xgrid_major.transition().duration(1500).ease("sin-in-out")
				.attr("x1", function(d) { 
					return xScale(d); })
				.attr("x2", function(d) { 
					return xScale(d); })
					
			xgrid_major.exit().remove()
			
			xgrid_major.enter()
			.append("line")
			.attr("class", "tick_major")
			.attr("stroke", "black")
			.attr("y1", graph_height)
		    .attr("y2", graph_height+8)
			.attr("x1", function(d) { 
				return xScale(d); })
			.attr("x2", function(d) { 
				return xScale(d); })
					
		 xgrid_minor.transition().duration(1500).ease("sin-in-out")
				.attr("x1", function(d) { 
					return xScale(d); })
				.attr("x2", function(d) { 
					return xScale(d); })
		
		xgrid_minor.exit().remove()
					
		xgrid_minor.enter()
			.append("line")
			.attr("class", "tick_major")
			.attr("stroke", "black")
			.attr("y1", graph_height)
		    .attr("y2", graph_height+6)
			.attr("x1", function(d) { 
				return xScale(d); })
			.attr("x2", function(d) { 
				return xScale(d); })
	
			
	}
	
	function update_bar_text_line(data_nest,volume ) {
		
		if (volume == 1) {
			var bar_class = ".bar1";
			var line_class = ".line1";
			var v_key = 0;
		} else {
			var bar_class = ".bar2";
			var line_class = ".line2";
			var v_key = 1;
		}
		
		var bar = d3.select("#chart").selectAll(bar_class)
			.data(data_nest)
			
		bar.transition().duration(transition_time)	
			.attr("transform",function(d,i) {
				var rank = d.values[v_key].values[0].rank
				if (rank < nb_cancer+1) {
					return "translate(0," + yScale(rank + (bar_space*(rank-1))) + ")";
				} else {
					return "translate(0," + yScale(nb_cancer+1 + (bar_space*(nb_cancer-1))) + ")";
				}
			})
			.attr("opacity" ,function(d,i) {
				var rank = d.values[v_key].values[0].rank
				if (rank < nb_cancer+1) {
					return 1;
					}
				else {
					return 0;
				}
			});
		  
		bar.selectAll("rect")
			.data(function(d) {return d.values[v_key].values;})
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
			

		d3.select("#chart").selectAll(line_class)
			.data(data_nest)
			.transition().duration(transition_time)	
			.attr("x1", function(d,i) {
				if (volume == 1) {
					return xScale(d.values[0].values[0].asr)+5;
				} else {
					return -line_separation;
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
		
	}
	
	function update_line_link(data_nest) {
		
		var link_line = d3.select("#chart").selectAll(".link1")
			.data(data_nest)
		
		link_line
			.transition().duration(transition_time)
			.attr("transform",function(d,i) {
				var rank1 = d.values[0].values[0].rank
				var rank2 = d.values[1].values[0].rank
				var rank_min = Math.min(rank1,rank2)
				if (rank_min < nb_cancer+1) {
					return "translate(0," + yScale(rank1 + (bar_space*(rank1-1))) + ")";
				} else {
					return "translate(0," + yScale(nb_cancer+1 + (bar_space*(nb_cancer))) + ")";
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
					return var_width;
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
					return var_width+40;
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
			
		var x_max = d3.max(data, function(d) {return d.asr})
		var tick_list = tick_generator(x_max)
	
		xScale.domain([0,tick_list.value_top]); // update xscale domain
		
		var xAxis = d3.svg.axis() // update grid Major
		.scale(xScale)
		.orient("bottom")
		.tickSize(-graph_height-20, 0,0)
		.tickPadding(12)
		.tickValues(tick_list.major);
		
		var xAxis_minor = d3.svg.axis() // update grid minor
		.scale(xScale)
		.orient("bottom")
		.tickSize(-graph_height-20, 0,0)
		.tickPadding(12)
		.tickValues(tick_list.minor)	
		.tickFormat("")		
		
		d3.select("#chart")  //  grid Major transition
		   .selectAll(".xaxis")
           .transition().duration(1500).ease("sin-in-out")  // https://github.com/mbostock/d3/wiki/Transitions#wiki-d3_ease
           .call(xAxis); 

		d3.select("#chart") //  grid Minor transition
		   .selectAll(".xaxis_minor")
           .transition().duration(1500).ease("sin-in-out")  // https://github.com/mbostock/d3/wiki/Transitions#wiki-d3_ease
           .call(xAxis_minor);  		   

		update_axis_title(data,1,tick_list)
		update_axis_title(data,10,tick_list)
		update_bar_text_line(data_nest, 1)
		update_bar_text_line(data_nest, 10)				
		update_line_link(data_nest)

		
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
		
	