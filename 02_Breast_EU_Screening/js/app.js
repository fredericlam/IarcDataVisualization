	
	var width 	= 1024;
	var height 	= 850 ;
	var scale0 = (width - 1) / 2 / Math.PI; 
	var provinces = [9,10,19,18,45,47] ;
	var div_datas = '#datas' ; 
	var cumul ; 
	var center = [5, 70] ;

	var Cancers = [] ; 

	var projection = d3.geo.mercator()
	    .scale(720)
	  	// Customize the projection to make the center of Thailand become the center of the map
	  	.translate([width/2,50])
	  	.center(center)
	;
	  
	var svg = d3.select("#map").append("svg")
	      .attr("width", width)
	      .attr("height", height);
	var path = d3.geo.path()
	      .projection(projection);
	  
	var json_file = 'general' ; // general , maskline_general

	var key_val = 'PERCENT_T' ; 

	queue()
		.defer( d3.json , "data/europe.topojson" )
	    .defer( d3.csv , "data/coverage-breast-cancer-screening.csv" )
	    .await( function( error , topology , data ) { 
    	
    	var range_colors  = Array.prototype.slice.call( colorbrewer[ 'PuRd' ][ 9 ] ) ;	
    	range_colors.unshift('#ffffff') ;
    	// range_colors[0] = '#ffffff' ;

    	var quantize = d3.scale.quantize()
			.domain( [0,100] )
		    .range( range_colors ) ;

    	var g_general = svg.append("g").attr('class','general') ;
	    
	    g_general.selectAll("path")
	        .data( topojson.object(topology, topology.objects.europe ).geometries )
	        .enter()
	        .append("path")
	        .attr("d", path)
	        .attr('id',function(d){ return 'CODE_' + d.id ; })
	        .attr('class',function(d){ 
	        	var extra_css = '' ; 
	        	for( var item in data )
	        		if ( data[item].CODE == d.id )
	        		{
	        			extra_css = quantize(data[item][key_val]) ;
	        			break ; 
	        		}
	        	return 'country '+extra_css.replace('#','');
	        })
	        .attr('fill',function(d){
	        	for( var item in data )
	        		if ( data[item].CODE == d.id )
	        			// console.info( d.id ,  data[item][key_val] , quantize(data[item][key_val]) );
	        			return quantize(data[item][key_val]);
	        	return "#ffffff" ; 
	        })
	        .attr('title',function(d){ return d.properties.NAME ; })
	    ;

	    /*var label_regions = svg.selectAll(".place-label")
		    .data(topojson.object(topology, topology.objects.europe ).geometries)
		  	.enter().append("text")
		  	.attr('id',function(d){ return 'TXT_' + d.id ; })
		    .attr("class", function(d) { return "subunit-label " + d.id; })
		    .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
		    .attr("dy", ".35em")
		    .text(function(d) { 
		    	return d.properties.NAME; 
		    });*/

		// legend 
		var legend = svg.append('g').attr('class','groupLegend') ;

		var x_legend = 700 ; 

		var data_colors = Array.prototype.slice.call( range_colors );
        data_colors.reverse(); 

		var containerLegend = legend.append('rect')
            .attr('class','containerLegend')
            .attr("x", 100 ) 
            .attr("y", 400 )
            .style('width', 140 )
            .style('height', 200 )
            .style('fill','transparent') 
        ;

        var legendEntries = legend.selectAll('g.legendEntry')
            .data( data_colors )
            .enter()
            .append('g')
            .attr('class', 'legendEntry') ;

        var lastYRect = 0 , lastYText = 0 ; 

        legendEntries
            .append('rect')
            .attr('class','rect_Legend')
            .attr("x", 100 ) 
            .attr("y", function(d, i) {
            	lastYRect = (i * 15) + 2 + 400 ;
                return lastYRect ; 
            })
           .attr("width", 25 )
           .attr("height", 10 )
           .style("stroke","#cccccc")
           .style("stroke-width", "0.5px")
           .attr('color', function(d){ return d;})
           .style("fill", function(d){return d;}) ; 

        /*legend
            .append('rect')
            .attr('class','rect_Legend')
            .attr("x", 100 ) 
            .attr("y", lastYRect + 15 )
            .attr("width", 25 )
            .attr("height", 10 )
            .style("stroke","#cccccc")
            .style("stroke-width", "0.5px")
            .style("fill", function(d){ return '#ffffff' ;})*/

        legendEntries
            .append('text')
            .attr('class','text_Legend')
            .attr("x",  140 )  // leave 5 pixel space after the <rect>
            .attr("y", function(d, i) {
               lastYText =  (i * 15) + 400  ; // + (CanMapHeight - 200);
               return lastYText ; 
            })
            .style('font-size','12px')
            .attr("dy", "0.9em") // place text one line *below* the x,y point
            .text(function(d,i) {
                
                var extent = quantize.invertExtent(d) ;

                //extent will be a two-element array, format it however you want:
                var format = d3.format("0f") ;

                if ( i == 0 )
                    return format(extent[0])+ "%–" + format(extent[1])+'%' ;
                else if (i == (data_colors.length-1) )
                    return format(extent[0])+ "%–" + format(extent[1])+'%' ;
                else
                    return format(extent[0]+1)+ "%–" + format(extent[1])+'%' ;
            
            })
        ;

        /*legend
            .append('text')
            .attr('class','text_Legend')
            .attr("x",  140 )  // leave 5 pixel space after the <rect>
            .attr("y", lastYText + 15 )  // + (CanMapHeight - 200);})
            .style('font-size','12px')
            .attr("dy", "0.9em") // place text one line *below* the x,y point
            .text("No data") ;*/
    });