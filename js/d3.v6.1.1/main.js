
const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500;
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};


const SCATTER_FRAME = d3.select('.chart')
                    .append("svg")
                    .attr("height", FRAME_HEIGHT)
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame");

const SELECT_FRAME = d3.select('.selection')
                        .append("div")
                        .attr("class", "last-point");

const SCATTER_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const SCATTER_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;

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
                .attr("r", 10)
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
                        .attr("r", 10)
                        .attr("class", "scatter-point")
                        .on("click", pointClickHandler);
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

