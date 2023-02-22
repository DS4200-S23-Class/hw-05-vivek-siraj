
const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500;
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};


const SCATTER_FRAME = d3.select('.chart')
                    .append("svg")
                    .attr("height", FRAME_HEIGHT)
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame");
const SCATTER_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const SCATTER_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;

const BAR_FRAME = d3.select('.bar-chart')
                    .append("svg")
                    .attr("height", FRAME_HEIGHT)
                    .attr("width", FRAME_WIDTH)
                    .append('g')
                    .attr("class", "frame");
const BAR_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const BAR_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;

const SELECT_FRAME = d3.select('.selection')
                        .append("div")
                        .attr("class", "last-point");

d3.csv("data/scatter-data.csv").then((data) => {

    const MAX_X = 1 + d3.max(data, (d) => 
                                {return parseInt(d.x)});
    
    const MAX_Y = 1 + d3.max(data, (d) => 
                                {return parseInt(d.y)});
    const X_SCALE = d3.scaleLinear()
                            .domain([0, (MAX_X)])
                            .range([0, SCATTER_WIDTH]);
    

    const Y_SCALE = d3.scaleLinear()
                        .domain([0, (MAX_Y)])
                        .range([SCATTER_HEIGHT, 0]);


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
        (SCATTER_HEIGHT + MARGINS.top) + ")")
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



// Define the tooltip element
const TOOLTIP = d3.select("bar-chart")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

d3.csv("data/bar-data.csv").then((data) => {


    const MAX_X = 1 + d3.max(data, (d) => 
                                {return parseInt(d.x)});
    
    const MAX_Y = 1 + d3.max(data, (d) => 
                                {return parseInt(d.y)});
                                
    const X_SCALE = d3.scaleLinear()
                            .domain([0, (MAX_X)])
                            .range([0, BAR_WIDTH]);

    const Y_SCALE = d3.scaleLinear()
                        .domain([0, (MAX_Y)])
                        .range([BAR_HEIGHT, 0]);

      // Set the domain of the x and y scales
    X_SCALE.domain(data.map(d => d.name));
    Y_SCALE.domain([0, d3.max(data, d => d.value)]);


    // Create the x and y axes
    const xAxis = d3.axisBottom(X_SCALE);
    const yAxis = d3.axisLeft(Y_SCALE);

    BAR_FRAME.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + BAR_HEIGHT + ")")
    .call(xAxis);

    BAR_FRAME.append("g")
    .attr("class", "y axis")
    .call(yAxis);

    BAR_FRAME.selectAll(".bar-chart")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => X_SCALE(d.name))
        .attr("width", X_SCALE.bandwidth())
        .attr("y", d => Y_SCALE(d.value))
        .attr("height", d => BAR_HEIGHT - Y_SCALE(d.value))
        .on("mouseover", function(d) {
            // Highlight the bar and show the tooltip
            d3.select(this)
            .style("fill", "orange");

            TOOLTIP.transition()
            .duration(200)
            .style("opacity", 0.9);

            TOOLTIP.html(d.name + "<br/>" + d.value)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");

        })


});

