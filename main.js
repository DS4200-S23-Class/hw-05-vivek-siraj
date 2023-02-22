const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500;
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

const SCATTER_FRAME = d3.select('.scatter')
                    .append("svg")
                    .attr("height", FRAME_HEIGHT)
                    .attr("width", FRAME_WIDTH)
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



const BAR_FRAME = d3.select(".bar")
                    .append("svg")
                    .attr("width", FRAME_WIDTH + MARGINS.left + MARGINS.right)
                    .attr("height", FRAME_HEIGHT + MARGINS.top + MARGINS.bottom)
                    .append("g")
                    .attr("transform",
                    "translate(" + MARGINS.left + "," + MARGINS.top + ")");


d3.csv("data/bar-data.csv").then((data) => {
    
  const X = d3.scaleBand()
  .range([ 0, FRAME_WIDTH])
  .domain(data.map(d => d.column1))
  .padding(0.2);

  BAR_FRAME.append("g")
        .attr("transform", "translate(0," + FRAME_HEIGHT + ")")
        .call(d3.axisBottom(X))
        .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");


  const Y = d3.scaleLinear()
        .domain([0, d3.max(data, d => parseInt(d.column2))])
        .range([ FRAME_HEIGHT, 0]);

  BAR_FRAME.append("g")
        .call(d3.axisLeft(Y));
 

  BAR_FRAME.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("X", (d) => (X_SCALE(d.category) + MARGINS.left))
        .attr("y", (d) => (Y_SCALE(d.amount) + MARGINS.top))
        .attr("width", X_SCALE.bandwidth())
        .attr("height", (d) => GRAPH_HEIGHT - Y_SCALE(d.amount));

})