	
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

    var color_no_data = '#cccccc' ; 

    var sweden_regions = {
        0 : { 'name' : 'Norra sjukvårdsregionen' } , 
        1 : { 'name' : 'Uppsala-Örebro sjukvårdsregion' } , 
        2 : { 'name' : 'Stockholms sjukvårdsregion' } , 
        3 : { 'name' : 'Sydöstra sjukvårdsregionen' } , 
        4 : { 'name' : 'Västra sjukvårdsregionen' } , 
        5 : { 'name' : 'Södra sjukvårdsregionen' }
    } ; 

    var sweden_counties = {
        0 : { 'code' : 'K' , 'name' : 'Blekinge County' , 'region' : 5 } ,
        1 : { 'code' : 'W' , 'name' : 'Dalarna County', 'region' : 1 } ,
        2 : { 'code' : 'X' , 'name' : 'Gävleborg County', 'region' : 1 } ,
        3 : { 'code' : 'I' , 'name' : 'Gotland County', 'region' : 2 } ,
        4 : { 'code' : 'N' , 'name' : 'Halland County', 'region' : 4 } ,
        5 : { 'code' : 'Z' , 'name' : 'Jämtland County ', 'region' : 0 } ,
        6 : { 'code' : 'F' , 'name' : 'Jönköping County', 'region' : 3 } ,
        7 : { 'code' : 'H' , 'name' : 'Kalmar County', 'region' : 3 } , 
        8 : { 'code' : 'G' , 'name' : 'Kronoberg County', 'region' : 5 } , 
        9 : { 'code' : 'BD' , 'name' : 'Norrbotten County', 'region' : 0 } ,
        10 : { 'code' : 'T' , 'name' : 'Örebro County', 'region' : 1 } , 
        11 : { 'code' : 'E' , 'name' : 'Östergötland County', 'region' : 3 } , 
        12 : { 'code' : 'M' , 'name' : 'Skåne County', 'region' : 5 } , 
        13 : { 'code' : 'D' , 'name' : 'Södermanland County', 'region' : 1 } , 
        14 : { 'code' : 'AB' , 'name' : 'Stockholm County' , 'region' : 3 } , 
        15 : { 'code' : 'C' , 'name' : 'Uppsala County', 'region' : 1 } , 
        16 : { 'code' : 'S' , 'name' : 'Värmlands County', 'region' : 1 } ,  
        17 : { 'code' : 'AC' , 'name' : 'Västerbotten County', 'region' : 0 } , 
        18 : { 'code' : 'Y' , 'name' : 'Västernorrland County', 'region' : 0 } , 
        19 : { 'code' : 'U' , 'name' : 'Västmanland County', 'region' : 1 } , 
        20 : { 'code' : 'O' , 'name' : 'Västra Götaland County', 'region' : 4 } 
    } ; 

	queue()
		.defer( d3.json , "data/europe.topojson" )
	    .defer( d3.csv , "data/coverage-breast-cancer-screening.csv" )
        .defer( d3.json , "data/sweden-counties.topojson" )
        .defer( d3.json , "data/uk.topojson" )
        .defer( d3.json , "data/belgium.json" )
        .defer( d3.json , "data/portugal.json")
	    .await( function( error , europe , data , sweden , uk , belgium , portugal ) { 
    	
        // console.info( topology.objects ) ; 

    	var range_colors  = Array.prototype.slice.call( colorbrewer[ 'Reds' ][ 9 ] ) ;	
    	// range_colors.unshift('#ffffff') ;
    	// range_colors[0] = '#ffffff' ; // 0 or no value means no data = grey 

    	var quantize = d3.scale.quantize()
			.domain( [0,100] )
		    .range( range_colors ) ;

    	var g_general = svg.append("g").attr('class','general') ;

	    
	    g_general.selectAll("path")
	        .data( topojson.object( europe, europe.objects.collection ).geometries )
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
                    {
                        if ( data[item][key_val] == 0 ) return color_no_data ; 
                        
	        			// console.info( d.id ,  data[item][key_val] , quantize(data[item][key_val]) );
	        			return quantize( data[item][key_val] );
	        	    }

                return "#ffffff" ; 
	        })
	        .attr('title',function(d){ 
                if ( d.properties == undefined ) return ; 
                return d.properties.NAME ; 
            })
	    ;

        var g_sweden = svg.append("g").attr('class','sweden') ;
        g_sweden.selectAll("path")
            .data( topojson.object( sweden , sweden.objects.SWE_adm1 ).geometries )
            .enter()
            .append("path")
            .attr("d", path)
            .attr('class',function(d,i){

                return "swe_counties " + sweden_counties[i].code  ; 
            })
            .attr('fill',function(d,i){
                var id_region = sweden_counties[i].region ;

                for( var item in data )
                {
                    if ( data[item].CODE == 'SE' )
                    {
                        if ( data[item].CODE_REGION == id_region )
                        {
                            return quantize( data[item][key_val] );
                        }
                    }
                }

                return color_no_data ; 
            })
            .attr('stroke',function(d,i){
                var id_region = sweden_counties[i].region ;

                for( var item in data )
                {
                    if ( data[item].CODE == 'SE' )
                    {
                        if ( data[item].CODE_REGION == id_region )
                        {
                            return quantize( data[item][key_val] );
                        }
                    }
                }

                return "transparent" ; 
            })
        ;

        /*var g_sweden_regions = svg.append("g").attr('class','sweden') ;
        console.info( sweden_regions.objects.regions ) ; 
        g_sweden_regions.selectAll("path")
            .data( topojson.object( sweden_regions , sweden_regions.objects.regions ).geometries )
            .enter()
            .append("path")
            .attr("d", path)
            .attr('class',function(d,i){
                return "swe_regions"  ; 
            })
            .attr('fill',function(d,i){
                return "pink" ; 
            })
        ;*/


        var g_belgium = svg.append("g").attr('class','belgium') ;
        
        g_belgium.selectAll("path")
            .data( topojson.object( belgium , belgium.objects.belgium ).geometries )
            .enter()
            .append("path")
            .attr("d", path)
            .attr('class',function(d,i){
                return "belgium_regions region-be-" + i    ; 
            })
            .attr('fill',function(d,i){

                for( var item in data )
                {
                    if ( data[item].CODE == 'BE' )
                    {
                        if ( data[item].CODE_REGION == i )
                        {
                            return quantize( data[item][key_val] );
                        }
                    }
                }

                return color_no_data ; 
            })
        ;


        var g_portugal = svg.append("g").attr('class','portugal') ;
        
        g_portugal.selectAll("path")
            .data( topojson.object( portugal , portugal.objects.portugal ).geometries )
            .enter()
            .append("path")
            .attr("d", path)
            .attr('class',function(d,i){
                return "portugal_regions region_"+i   ; 
            })
            .attr('fill',function(d,i){
                for( var item in data )
                {
                    if ( data[item].CODE == 'PT' )
                    {
                        // console.info( data[item].CODE_REGION , i ) ; 
                        //if ( data[item][key_val] == 0 ) return no
                        if ( data[item].CODE_REGION == i )
                        { 
                            return quantize( data[item][key_val] );
                        }
                    }
                }
                return color_no_data ; 
            })
        ;

        var g_uk = svg.append("g").attr('class','uk') ;
        
        g_uk.selectAll("path")
            .data( topojson.object( uk , uk.objects.subunits ).geometries )
            .enter()
            .append("path")
            .attr("d", path)
            .attr('class',function(d,i){
                return "uk_subunit subunit-" + d.id  ; 
            })
            .attr('fill',function(d,i){
                var id_subunit = d.id ;

                for( var item in data )
                {
                    if ( data[item].CODE == 'GB' )
                    {
                        if ( data[item].CODE_REGION == id_subunit )
                        {
                            // if ( Math.abs( data[item][key_val] ) == 0 ) return "#cccccc" ; 

                            return quantize( data[item][key_val] );
                        }
                    }
                }

                return color_no_data ; 
            })
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

        legend
            .append('rect')
            .attr('class','rect_Legend')
            .attr("x", 100 ) 
            .attr("y", lastYRect + 15 )
            .attr("width", 25 )
            .attr("height", 10 )
            .style("stroke","#cccccc")
            .style("stroke-width", "0.5px")
            .style("fill", function(d){ return color_no_data ;})

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

        legend
            .append('text')
            .attr('class','text_Legend')
            .attr("x",  140 )  // leave 5 pixel space after the <rect>
            .attr("y", lastYText + 15 )  // + (CanMapHeight - 200);})
            .style('font-size','12px')
            .attr("dy", "0.9em") // place text one line *below* the x,y point
            .text("No data") ;
    });