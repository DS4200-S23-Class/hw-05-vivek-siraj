// GLOBAL CONSTANTS
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};
const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500; 

const GRAPH_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right; 
const GRAPH_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;

// FRAMES FOR TWO VISUALIZATIONS
const SCATTER_FRAME = d3.select(".scatter")
                  .append("svg")
                    .attr("height", FRAME_HEIGHT)
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame"); 

const BAR_FRAME = d3.select(".bar") 
                  .append("svg") 
                    .attr("height", FRAME_HEIGHT)   
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame");

// read in data from csv
d3.csv("data/scatter-data.csv").then((data) => {

    //finding maxes of x and y values
    const XMAX = d3.max(data, (d) => { return parseInt(d.x); });

    const YMAX = d3.max(data, (d) => { return parseInt(d.y); });
  
    //making scales for x and y 
    const X_SCALE = d3.scaleLinear() 
                   .domain([0, (XMAX + 5)]) // Add some padding  
                   .range([0, GRAPH_WIDTH]);

    const Y_SCALE = d3.scaleLinear() 
                   .domain([0, (YMAX + 5)]) // Add some padding  
                   .range([GRAPH_HEIGHT, 0]); 

    function onHover(event, d) {
      
        d3.select(this).style("fill", "red");
    }

    // adds border on click and updates last click text
    function onClick(event, d) {

	   let selection = d3.select(this);
        selection.classed("stroke", !selection.classed("stroke"));

        let newText = d3.select(this).attr("id");
	        d3.select("#coord-list").html(newText);
	}

    function onLeave(event, d) {
        ///// still gotta change color
        d3.select(this).style("fill", "rgb(222, 173, 230)"); 
    }

    // adds more points onto graph visa user input
    function addPoint(event, d) {

   	    let X_COORD = d3.select('#x-coords').property("value");
		let Y_COORD = d3.select('#y-coords').property("value");

		let point_coords = "(" + X_COORD + ", " + Y_COORD + ")";
	
		SCATTER_FRAME.append('circle')
					 .attr("cx", X_SCALE(X_COORD) + MARGINS.left)
					 .attr("cy", Y_SCALE(Y_COORD) + MARGINS.top)
					 .attr("class", "point")
					 .attr("r", 10)
                     .attr("id", point_coords)
					 .on("mouseover", onHover)
					 .on("click", onClick)
					 .on("mouseleave", onLeave);
    } 

    SCATTER_FRAME.selectAll("points")  
        .data(data) 
        .enter()       
        .append("circle")
      	    .attr("cx", (d) => { return (X_SCALE(d.x) + MARGINS.left); }) 
            .attr("cy", (d) => { return (Y_SCALE(d.y) + MARGINS.top); }) 
            .attr("id", (d) => { return ("(" + d.x + ", " + d.y + ")"); })
            .attr("r", 10)
            .attr("class", "point")
	        .on("mouseover", onHover) 
				.on("click", onClick)
				.on("mouseleave", onLeave);

	d3.select("#subButton")
			.on("click", addPoint);

    // adds axes
    SCATTER_FRAME.append("g") 
        .attr("transform", "translate(" + MARGINS.left + 
              "," + (GRAPH_HEIGHT + MARGINS.top) + ")") 
        .call(d3.axisBottom(X_SCALE).ticks(10)) 
          .attr("font-size", '10px');

    SCATTER_FRAME.append("g") 
        .attr("transform", "translate(" + MARGINS.top + 
              "," + MARGINS.left + ")") 
        .call(d3.axisLeft(Y_SCALE).ticks(10)) 
          .attr("font-size", '10px');

});

// BAR GRAPH CONTAINER
d3.csv("data/bar-data.csv").then((data) => { 

	const YMAX = d3.max(data, (d) => { 
        return parseInt(d.amount); 
    });

	const Y_SCALE_BAR = d3.scaleLinear() 
	                   .domain([0, YMAX])  
	                   .range([GRAPH_HEIGHT, 0]);


	const X_SCALE = d3.scaleBand()
		.range([ 0, GRAPH_WIDTH ])
		.domain(data.map(function(d) { return d.category; }))
		.padding(0.2);

	const BAR_WIDTH = 25;

	// X AXIS
	BAR_FRAME.append("g")
		 .attr("transform", "translate(" + MARGINS.left + 
		  "," + (GRAPH_HEIGHT+ MARGINS.bottom) + ")")
		 .call(d3.axisBottom(X_SCALE))
		 .selectAll("text")
		   .attr("font-size", '12px');


	// Y AXIS 
	BAR_FRAME.append("g")
	   .attr("transform", "translate(" + MARGINS.left + "," + MARGINS.top + ")") 
		 .call(d3.axisLeft(Y_SCALE_BAR))
		 .selectAll("text")
		   .attr("font-size", '12px');



  // TOOLTIP CONSTRUCTOR
  const TOOLTIP = d3.select("#barplot")
                        .append("div")
					    .attr("class", "tooltip")
						.style("opacity", 0)
						.style("background-color", "lightgrey")
						.style("border", "solid")
						.style("border-width", "2px")
						.style("border-radius", "7px")
						.style("padding", "3px")
						.style("position", "absolute");

  // MOUSEOVER FUNCTIONALITY
  function onHover(event, d) {
     TOOLTIP.style("opacity", 1);

     d3.select(this).style("fill", "magenta")
      		.style("stroke", "orange")
      		.style("stroke-width", "3px");
  }

  // MOUSE MOVEMENT FUNCTIONALITY
  function onMove(event, d) {
        TOOLTIP.html("Category: " + d.category + "<br>Value: " + d.amount)
             .style("left", event.x + "px")
             .style("top", event.y + "px"); 
  }
  
  // MOUSE LEAVE FUNCTIONALITY
  function onLeave(event, d) {
     TOOLTIP.style("opacity", 0);
     d3.select(this).style("fill", "darkred")
      		.style("stroke", "none"); 
  } 

	// BAR GRAPH CONSTRUCTION
	BAR_FRAME.selectAll("bar")
        .data(data)
        .enter()
        .append("rect")
            .attr("x", function(d) { 
                return X_SCALE(d.category) + MARGINS.left; 
            })
            .attr("y", function(d) { 
                return Y_SCALE_BAR(d.amount) + MARGINS.top; 
            })
            .attr("width", BAR_WIDTH)
            .attr("height", function(d) { 
                return GRAPH_HEIGHT - Y_SCALE_BAR(d.amount); 
            })
            .attr("class", "bar")
        .on("mouseover", onHover)
        .on("mousemove", onMove)
        .on("mouseleave", onLeave);    

});