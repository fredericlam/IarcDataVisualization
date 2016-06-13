	
	var width 	= 1024;
	var height 	= 800 ;
	var scale0 = (width - 1) / 2 / Math.PI; 
	var provinces = [9,10,19,18,45,47] ;
	var div_datas = '#datas' ; 
	var cumul ; 
	var center = [5, 70] ;

	var Cancers = [] ; 

	var projection = d3.geo.mercator()
	    .scale(700)
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


	d3.json( "data/europe.topojson", function(error, topology) {

	    var g_general = svg.append("g").attr('class','general') ;
	    
	    g_general.selectAll("path")
	        .data(topojson.object(topology, topology.objects.europe ).geometries)
	        .enter()
	        .append("path")
	        .attr("d", path)
	        .attr('id',function(d){ return 'CODE_' + d.id ; })
	        .attr('class',function(d){ return 'country';})
	        .attr('fill',function(d){
	        	return "red" ; 
	        })
	        /*.append("title").text(function(d){ 
	        	console.info( d ) ; 
	        	return d.properties.NAME_1 ; 
	        })*/
	    ;

	    var label_regions = svg.selectAll(".place-label")
		    .data(topojson.object(topology, topology.objects.europe ).geometries)
		  	.enter().append("text")
		  	.attr('id',function(d){ return 'TXT_' + d.id ; })
		    .attr("class", function(d) { return "subunit-label " + d.id; })
		    .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
		    .attr("dy", ".35em")
		    .text(function(d) { 
		    	return d.id; 
		    });

	});
	
	queue()
	    .defer( d3.csv , "data/coverage-breast-cancer-screening.csv" )
	    .await(function(error, data ) { 
    	
    	console.info( data ) ; 
    	
    });