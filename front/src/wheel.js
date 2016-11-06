import d3 from 'd3';
import vibrate from './vibrate';
let onLaunch = null;

export function launch(){

  if(typeof onLaunch === 'function'){

    onLaunch();

  } else{

    console.error('onLaunch not defined');

  }

}

export function create(containerNode, gameName, names){

  return new Promise( (resolve) => {

    let rotation = 0;
    let oldrotation = 0;
    let centerCircle = null;
    let vis = null;

    const nbModulo = {
      min: 2, max: 5
    };

    const data = names.map(stringName => ({
      label: stringName,
      value: 1
    }) );

    function addTitle(){

      containerNode.innerHTML = `
<div class="center show-anim-fast" style="text-align:center;margin:12px 12px 0 12px;">It's time to (random) choose for ${gameName}</div>
<div id="wheel-container">
    <div id="chart"></div>
    <div id="result"><h1></h1>
</div>`;

    }

    function draw(){ //eslint-disable-line max-statements

      const padding = {
        top: 20,
        right: 40,
        bottom: 0,
        left: 0
      };

      const svgContainer = document.getElementById('wheel-container');

      const rSize = svgContainer.offsetHeight * 0.6;

      const w = rSize - padding.left - padding.right;
      const h = rSize - padding.top - padding.bottom;
      const r = Math.min(w, h) / 2;
      const color = d3.scale.ordinal().range([
        '#b3cde3',
        '#ccebc5',
        '#decbe4',
        '#fed9a6',
        '#ffffcc',
        '#e5d8bd',
        '#fddaec',
        '#f2f2f2'
      ]);

      const svg = d3.select('#chart')
        .append('svg')
        .attr('class', 'show-anim-fast')
        .data([data])
        .attr('width', w + padding.left + padding.right)
        .attr('height', h + padding.top + padding.bottom);

      const container = svg.append('g')
        .attr('transform', `translate(${(w / 2) + padding.left},${(h / 2) + padding.top})`);

      vis = container.append('g');

      const pie = d3.layout.pie().value(d => d.value);
      const arc = d3.svg.arc().outerRadius(r);
      const arcs = vis.selectAll('g.slice')
        .data(pie)
        .enter()
        .append('g')
        .attr('class', 'slice');

      arcs.append('path')
        .attr('fill', (d, i) => color(i) )
        .attr('d', d => arc(d) );

      // add the pie text
      arcs.append('text').attr('transform', (d) => {

        d.innerRadius = 0;
        d.outerRadius = r;
        d.angle = (d.startAngle + d.endAngle) / 2;

        return `rotate(${(d.angle * 180 / Math.PI) - 90})translate(${d.outerRadius - 10})`;

      })
        .attr('class', 'pie-title')
        .attr('text-anchor', 'end')
        .text( (d, i) => data[i].label);

      svg.append('g')
        .attr('transform', `translate(${w + padding.left + padding.right},${(h / 2) + padding.top})`)
        .append('path')
        .attr('d', `M-${r * 0.15},0L0,${r * 0.05}L0,-${r * 0.05}Z`)
        .style({ fill: 'white' });

      centerCircle = container.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 60)
        .attr('class', 'wheel-center')
        .style({
          fill: 'white', cursor: 'pointer'
        });

      const centerText = svg.append('text')
        .attr('x', (w / 2) + padding.left)
        .attr('text-anchor', 'middle')
        .attr('class', 'btn-whell')
        .text('GO');

      centerText.attr('y', function(){ //eslint-disable-line func-names

        return (h + this.getBBox().height + padding.top) / 2; //eslint-disable-line no-invalid-this

      });

    }

    function rotTween(){

      const i = d3.interpolate(oldrotation % 360, rotation);

      return t => `rotate(${i(t)})`;

    }

    function spin(){

      onLaunch = null;

      const pieslice = Math.round(360 / data.length);

      rotation = Math.floor( (Math.random() * nbModulo.max * 360) + (nbModulo.min * 360) );
      centerCircle.on('click', null);
      vibrate.launch([0, 250, 250, 200, 150, 100, 50, 100, 50, 50, 100, 100, 100, 120, 200, 150, 200, 150, 400]);

      vis.transition()
        .duration(3000)
        .attrTween('transform', rotTween)
        .each('end', () => {

          const newPiesPos = data.map( (entry, i) => {

            const newPiePos = (rotation - 90 + (i * pieslice) ) % 360;

            return {
              entry: entry,
              pos: newPiePos
            };

          });

          const sorted = newPiesPos.sort( (a, b) => { //eslint-disable-line arrow-body-style

            return a.pos > b.pos ? -1 : 1;

          });

          const win = sorted[0].entry;

          d3.select('#result h1')
            .attr('class', 'show-anim-fast')
            .text(win.label);

          oldrotation = rotation;
          resolve(win.label);

        });
    
    }

    addTitle();
    draw();
    centerCircle.on('click', spin);
    onLaunch = spin;

  });

}
