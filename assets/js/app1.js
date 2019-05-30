var svgwidth = 960;
var svgheight= 500;

var margin ={
    top:20,
    right:40,
    bottom:80,
    left:100
}

var width = svgwidth - margin.left - margin.right;
var height = svgheight - margin.top - margin.bottom;

var svg= d3.select("#scatter")
            .append("svg")
            .attr("width", svgwidth)
            .attr("height",height);


var chartgroup = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

var chart = svg.append("g");
d3.select("#scatter")
    .append("div")
    .attr("class","tooltip")
    .style("opacity",1);

d3.csv("/assets/data/data.csv",function(error,censusdata){
    if (error) throw error;

    censusdata.forEach(function(data){
        data.poverty=+data.poverty;
        data.healthcare = +data.healthcare;
    });

    var xlinearscale = d3.scaleLinear()
                        .domain([0,d3.max(censusdata,function(data){
                            return +data.poverty;
                            })])
                        .range([0,width]);
                    


    var ylinearscale = d3.scaleLinear()
                        .domain([0, d3.max(censusdata,function(data){
                            return +data.healthcare;
                             } )])
                        .range([height,0]);
    var bottomaxis =d3.axisBottom(xlinearscale);
    var leftaxis = d3.axisLeft(ylinearscale);

    // xlinearscale.domain([0,d3.max(censusdata,function(data){
    //     return +data.poverty;
    //     })])

    // ylinearscale.domain([0, d3.max(censusdata,function(data){
    //     return +data.healthcare;
    // } )])

    var tooltip = d3.tip()
        .attr("class","tooltip")
        .offset([80,-60])
        .html(function(data){
            var stateabbr= data.abbr;
            var povertyrate= data.poverty;
            var healthcarerate= data.healthcare;
            return(stateabbr + "<br> Poverty Rate :" + povertyrate +
        "<br> Healthcare Percentage" + healthcarerate);
        });

    chart.call(tooltip);

    chart.selectAll("circle")
        .data(censusdata)
        .enter()
        .append("circle")
        .attr("cx",function(data,index){
            //console.log(data.poverty);
            return xlinearscale(data.poverty);
        })
        .attr("cy", function(data,index){
            //console.log(data.healthcare);
            return ylinearscale(data.healthcare);
        })
        .attr("r","10")
        .attr("fill","blue")
        .style("opacity",0.5)
        .on("click",function(data){
            tooltip.show(data);
        })
        .on("mouseout",function(data){
            tooltip.hide(data);
        });

        chart.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(bottomaxis);

        chart.append("g")
            .call(leftaxis);

        
    var xaxis = chartgroup.append("g")
        .classed("x-axis", true)
        .attr("transform",`translate(0,${height}`)
        .call(bottomaxis);

    chartgroup.append("g")
        .call(leftaxis);

        chart.append("text")
            .attr("transform","rotate(-90)")
            // .attr("y",0-margin.left + 40)
            // .attr("x",0-(height))
            .attr("y", 0)
            .attr("x", 0)
            .attr("dy","1em")
            .attr("class","axis-text")
            .text("Lacks Healthcare (% )")
        
        chart.append("text")
             .attr("transform", "translate(" + (width/3) + "," + (height + margin.top + 30) + ")") 
             .attr("class", "axisText")
             .text("In Poverty (%")
});