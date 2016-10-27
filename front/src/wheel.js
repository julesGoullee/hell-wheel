import d3 from 'd3';

export default function launch(containerNode, gameName, names){

  return new Promise( (resolve, reject) => {

    const stringNames = names.reduce( (acc, name, i) => acc += (i === 0 ? '' : ', ') + name, '' );

    containerNode.innerHTML = '<div class="center show-anim-fast">' + stringNames + ' joue a ' + gameName +'</div><div class="wheel-container"><div id="chart"></div><div id="question"><h1></h1></div>';
    var padding = {top:20, right:40, bottom:0, left:0},
      w = 500 - padding.left - padding.right,
      h = 500 - padding.top  - padding.bottom,
      r = Math.min(w, h)/2,
      rotation = 0,
      oldrotation = 0,
      picked = 100000,
      color = d3.scale.category20();//category20c()
//randomNumbers = getRandomNumbers();

//http://osric.com/bingo-card-generator/?title=HTML+and+CSS+BINGO!&words=padding%2Cfont-family%2Ccolor%2Cfont-weight%2Cfont-size%2Cbackground-color%2Cnesting%2Cbottom%2Csans-serif%2Cperiod%2Cpound+sign%2C%EF%B9%A4body%EF%B9%A5%2C%EF%B9%A4ul%EF%B9%A5%2C%EF%B9%A4h1%EF%B9%A5%2Cmargin%2C%3C++%3E%2C{+}%2C%EF%B9%A4p%EF%B9%A5%2C%EF%B9%A4!DOCTYPE+html%EF%B9%A5%2C%EF%B9%A4head%EF%B9%A5%2Ccolon%2C%EF%B9%A4style%EF%B9%A5%2C.html%2CHTML%2CCSS%2CJavaScript%2Cborder&freespace=true&freespaceValue=Web+Design+Master&freespaceRandom=false&width=5&height=5&number=35#results

    var data = names.map(name => {

      return {
        label: name,
        value: 1,
        question: ''
      }
    });
    // var data = [
    //   {"label":"Question 1",  "value":1,  "question":"What CSS property is used for specifying the area between the content and its border?"}, // padding
    //   {"label":"Question 2",  "value":1,  "question":"What CSS property is used for changing the font?"}, //font-family
    //   {"label":"Question 3",  "value":1,  "question":"What CSS property is used for changing the color of text?"} //color
    // ];


    var svg = d3.select('#chart')
      .append("svg")
      .data([data])
      .attr("width",  w + padding.left + padding.right)
      .attr("height", h + padding.top + padding.bottom);

    var container = svg.append("g")
      .attr("class", "chartholder")
      .attr("transform", "translate(" + (w/2 + padding.left) + "," + (h/2 + padding.top) + ")");

    var vis = container
      .append("g");

    var pie = d3.layout.pie().sort(null).value(function(d){return d.value;});

// declare an arc generator function
    var arc = d3.svg.arc().outerRadius(r);

// select paths, use arc generator to draw
    var arcs = vis.selectAll("g.slice")
      .data(pie)
      .enter()
      .append("g")
      .attr("class", "slice");


    arcs.append("path")
      .attr("fill", function(d, i){ return color(i); })
      .attr("d", function (d) { return arc(d); });

// add the text
    arcs.append("text").attr("transform", function(d){
      d.innerRadius = 0;
      d.outerRadius = r;
      d.angle = (d.startAngle + d.endAngle)/2;
      return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")translate(" + (d.outerRadius -10) +")";
    })
      .attr("text-anchor", "end")
      .text( function(d, i) {
        return data[i].label;
      });



    function spin(d){

      var  ps       = 360/data.length,
        pieslice = Math.round(1440/data.length),
        rng      = Math.floor((Math.random() * 1440) + 360);

      rotation = (Math.round(rng / ps) * ps);

      //TODO: click rightmost slice
      picked = 0;
      console.log(picked+1);

      rotation += 90 - Math.round(ps/2);

      vis.transition()
        .duration(3000)
        .attrTween("transform", rotTween)
        .each("end", function(){
          // //mark question as seen
          // d3.select(".slice:nth-child(" + (picked + 1) + ") path")
          //     .attr("fill", "#111");

          //populate question TODO
          d3.select("#question h1")
            .attr('class', 'show-anim-fast')
            .text(data[picked].label);

          oldrotation = rotation;

          setTimeout(() => {
            resolve(data[picked].label);
          }, 1000);

        });
    }

//make arrow
    svg.append("g")
      .attr("transform", "translate(" + (w + padding.left + padding.right) + "," + ((h/2)+padding.top) + ")")
      .append("path")
      .attr("d", "M-" + (r*.15) + ",0L0," + (r*.05) + "L0,-" + (r*.05) + "Z")
      .style({"fill":"white"});

//draw spin circle
    var spinButt = container.append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 60)
      .style({"fill":"white","cursor":"pointer"});
    spinButt.on("click", spin);

//spin text
    var spinText = svg.append("text")
      .attr("x", w/2 + padding.left)
      .attr("y", h/2 + padding.top)
      .attr("text-anchor", "middle")
      .attr('class', 'btn-whell')
      .text("GO")
      .style({"font-weight":"bold", "font-size":"40px"});


    function rotTween(to) {
      var i = d3.interpolate(oldrotation % 360, rotation);
      return function(t) {
        return "rotate(" + i(t) + ")";
      };
    }


    function getRandomNumbers(){
      var array = new Uint16Array(1000);
      var scale = d3.scale.linear().range([360, 1440]).domain([0, 100000]);

      if(window.hasOwnProperty("crypto") && typeof window.crypto.getRandomValues === "function"){
        window.crypto.getRandomValues(array);
        console.log("works");
      } else {
        //no support for crypto, get crappy random numbers
        for(var i=0; i < 1000; i++){
          array[i] = Math.floor(Math.random() * 100000) + 1;
        }
      }

      return array;
    }

  });

}