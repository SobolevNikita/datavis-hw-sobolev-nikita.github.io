const b_width = 1000;
const d_width = 500;
const b_height = 1000;
const d_height = 1000;
const colors = [
    '#DB202C','#a6cee3','#1f78b4',
    '#33a02c','#fb9a99','#b2df8a',
    '#fdbf6f','#ff7f00','#cab2d6',
    '#6a3d9a','#ffff99','#b15928']

const radius = d3.scaleLinear().range([.5, 20]);
const color = d3.scaleOrdinal().range(colors);
const x = d3.scaleLinear().range([0, b_width]);

const bubble = d3.select('.bubble-chart')
    .attr('width', b_width).attr('height', b_height);
const donut = d3.select('.donut-chart')
    .attr('width', d_width).attr('height', d_height)
    .append("g")
        .attr("transform", "translate(" + d_width / 2 + "," + d_height / 2 + ")");

const donut_lable = d3.select('.donut-chart').append('text')
        .attr('class', 'donut-lable')
        .attr("text-anchor", "middle")
        .attr('transform', `translate(${(d_width/2)} ${d_height/2})`);
const tooltip = d3.select('.tooltip');
//  Part 1 - Create simulation with forceCenter(), forceX() and forceCollide()
const simulation = d3.forceSimulation()
    // ..


d3.csv('data/netflix.csv').then(data=>{
    data = d3.nest().key(d=>d.title).rollup(d=>d[0]).entries(data).map(d=>d.value).filter(d=>d['user rating score']!=='NA');
    console.log(data)
    
    const rating = data.map(d=>+d['user rating score']);
    const years = data.map(d=>+d['release year']);
    let ratings = d3.nest().key(d=>d.rating).rollup(d=>d.length).entries(data);
    let age_rating = d3.nest().key(d=>d.rating).rollup(d=>d.length).entries(data);
    console.log(age_rating)
    // Part 1 - add domain to color, radius and x scales 
    // ..
    radius.domain([d3.min(rating), d3.max(rating)]);
    color.domain(age_rating);
    x.domain([d3.min(years), d3.max(years)]);

    nodes = [];
    for (let i = 0; i < data.length; i++) { 
        nodes.push({});
    }
    

    simulation.force('x', d3.forceX().x(function(d,i) {
                        return x(years[i]);
                      }))
                .force('y', d3.forceY().y(function(d) {
                        return 0;
                      }))
                .force('collision', d3.forceCollide().radius(function(d,i) {
                        return radius(rating[i]);
                      }))
                .force('center', d3.forceCenter(b_width/2, b_height/2) );

    // Part 1 - create circles
    var node = bubble
        .selectAll("circle")
        .data(nodes)
        .enter()
        .append('circle')
        .attr("fill", (d,i) => color(data[i].rating))
        .attr('r', (d,i) => radius(rating[i]))
        .attr('class', (d,i) => data[i].rating)
        .on('mouseover', overBubble)
        .on('mouseout', outOfBubble);
    // mouseover and mouseout event listeners
            // .on('mouseover', overBubble)
            // .on('mouseout', outOfBubble);

    
    // Part 1 - add data to simulation and add tick event listener 
    // ..      
    simulation.nodes(nodes).on("tick", ticked);

    function ticked(d) {
        node
            .attr("cy", function(d) { return d.y; })
            .attr("cx", function(d) { return d.x; });
    }

    // Part 1 - create layout with d3.pie() based on rating
    // ..
    const pie = d3.pie().value((d) => d.value);
    
    // Part 1 - create an d3.arc() generator
    // ..
    var arcs = d3.arc()
                .innerRadius(100) // it'll be donut chart
                .outerRadius(180)
                .padAngle(0.01)
                .cornerRadius(3)
    
    // Part 1 - draw a donut chart inside donut
    // ..
    donut.selectAll('path')
          .data(pie(age_rating))
          .enter()
          .append('path')
          .attr('d', arcs)
          .attr('fill', d => color(d.data.key))
          .style("opacity", 1)
          .on('mouseover', overArc)
          .on('mouseout', outOfArc);
    // mouseover and mouseout event listeners
        //.on('mouseover', overArc)
        //.on('mouseout', outOfArc);

    function overBubble(d){
        // Part 2 - add stroke and stroke-width   
        // ..
        d3.select(this)
            .style("stroke", "black")
            .style("stroke-width", 3); 
        console.log(d)
        
        // Part 3 - updata tooltip content with title and year
        // ..

        // Part 3 - change visibility and position of tooltip
        // ..
    }
    function outOfBubble(){
        // Part 2 - remove stroke and stroke-width
        // ..
        d3.select(this)
            .style("stroke", "")
            .style("stroke-width", "")
        // Part 3 - change visibility of tooltip
        // ..
    }

    function overArc(d,i){
        console.log(d)
        // Part 2 - change donut_lable content
        // ..
        donut_lable.text(age_rating[i].key);

        // Part 2 - change opacity of an arc
        // ..
        d3.select(this).style('opacity', 0.5);

        // Part 3 - change opacity, stroke и stroke-width of circles based on rating
        // ..
    }
    function outOfArc(){
        // Part 2 - change content of donut_lable
        // ..
        donut_lable.text("");
        // Part 2 - change opacity of an arc
        // ..
        d3.select(this).style('opacity', 1);
        // Part 3 - revert opacity, stroke and stroke-width of circles
        // ..
    }
});
