const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500;
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

const SCATTER_FRAME = d3.select('.scatter')
                    .append("svg")
                    .attr("height", FRAME_HEIGHT)
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame");

const BAR_FRAME = d3.select(".bar")
                    .append("svg")
                    .attr("width", FRAME_WIDTH)
                    .attr("height", FRAME_HEIGHT)
                    .attr("class", "frame");
                    
const SELECT_FRAME = d3.select('.selection')
                        .append("div")
                        .attr("class", "last-point");

const GRAPH_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const GRAPH_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;

d3.csv("data/scatter-data.csv").then((data) => {

    const MAX_X = 1 + d3.max(data, (d) => 
                                {return parseInt(d.x)});
    
    const MAX_Y = 1 + d3.max(data, (d) => 
                                {return parseInt(d.y)});
    const X_SCALE = d3.scaleLinear()
                            .domain([0, (MAX_X)])
                            .range([0, GRAPH_WIDTH]);
    

    const Y_SCALE = d3.scaleLinear()
                        .domain([0, (MAX_Y)])
                        .range([GRAPH_HEIGHT, 0]);


    SCATTER_FRAME.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
                .attr("cx", (d) => {return (X_SCALE(parseInt(d.x)) + MARGINS.left)})
                .attr("cy", (d) => {return (MARGINS.top + (Y_SCALE(parseInt(d.y))))})
                .attr("r", 12)
                .attr("class", "scatter-point");

    SCATTER_FRAME.append("g")
        .attr("transform", "translate(" + MARGINS.top + "," + 
        (GRAPH_HEIGHT + MARGINS.top) + ")")
        .call(d3.axisBottom(X_SCALE).ticks(10))
            .attr("font-size", "15px");
    

    SCATTER_FRAME.append("g")
        .attr("transform", "translate(" + 
        (MARGINS.left) + "," + (MARGINS.top) + ")")
        .call(d3.axisLeft(Y_SCALE).ticks(10))
            .attr("font-size", "15px");

    function addPoint(event, d) {

        let new_x = d3.selectAll("#x-cord").node().value;
        let new_y =  d3.selectAll("#y-cord").node().value;

        SCATTER_FRAME.append("circle")
                        .attr("cx", (d) => {return (X_SCALE(parseInt(new_x)) + MARGINS.left)})
                        .attr("cy", (d) => {return (MARGINS.top + (Y_SCALE(parseInt(new_y))))})
                        .attr("r", 12)
                        .attr("class", "scatter-point")
                        .on("click", onClick);
    }
    
    const BUTTON = d3.selectAll(".add-point").on("click", addPoint);

    function pointText(pointReference) {
        let x_point = d3.select(pointReference).attr("cx");
        let y_point = d3.select(pointReference).attr("cy");
        
        x_point = Math.round(X_SCALE.invert(x_point - MARGINS.left));
        y_point = Math.round(Y_SCALE.invert(y_point - MARGINS.top));
        
        SELECT_FRAME.html("<br>Last Point Click: " + "(" + x_point + "," + y_point + ")")
        
        }

    function addBorder(pointReference) {
        d3.select(pointReference).classed("border-point", !(d3.select(pointReference).classed("border-point")));
        
    }

    function onClick() {
        addBorder(this)
        pointText(this)
    }

    const SCATTER_CLICK = d3.selectAll(".scatter-point");
    SCATTER_CLICK.on("click", onClick)
    
    
});

d3.csv("data/bar-data.csv").then((data) => {
     // X axis
  const x = d3.scaleBand()
  .range([ 0, width ])
  .domain(data.map(d => d.column1))
  .padding(0.2);

svg.append("g")
  .attr("transform", "translate(0," + FRAME_HEIGHT + ")")
  .call(d3.axisBottom(x))
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

// Add Y axis
const y = d3.scaleLinear()
  .domain([0, d3.max(data, d => parseInt(d.column2))])
  .range([ height, 0]);
svg.append("g")
  .call(d3.axisLeft(y));

// Bars
const bars = svg.selectAll("bar")
  .data(data)
  .enter()
  .append("rect")
    .attr("class", "bar")
    .attr("x", d => x(d.column1))
    .attr("y", d => y(d.column2))
    .attr("width", x.bandwidth())
    .attr("height", d => height - y(d.column2))
    .on("mouseover", function(d) {
      // Highlight the bar and show the tooltip
      d3.select(this)
        .style("fill", "orange");

      const tooltip = d3.select("#tooltip");
      tooltip.transition()
        .duration(200)
        .style("opacity", 0.9);

      tooltip.html(d.column1 + "<br/>" + d.column2)
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
    })
    .on("mouseout", function(d) {
      // Unhighlight the bar and hide the tooltip
      d3.select(this)
        .style("fill", "steelblue");

      const tooltip = d3.select("#tooltip");
      tooltip.transition()
        .duration(500)
        .style("opacity", 0);
    });
});
