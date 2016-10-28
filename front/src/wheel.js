import d3 from 'd3';

export default function launch(containerNode, gameName, names){

  return new Promise( (resolve) => {

    let rotation = 0;
    let oldrotation = 0;
    let centerCircle = null;
    let vis = null;
    const nbModulo = {
      'min': 2, 'max': 5
    };
    const timerWin = 2500;
    const data = names.map(stringName => ({
      'label': stringName,
      'value': 1
    }) );

    function addTitle(){

      containerNode.innerHTML = `
<div class="center show-anim-fast">It's time to (random) choose for ${gameName}</div>
<div class="wheel-container">
    <div id="chart"></div>
    <div id="result"><h1></h1>
</div>`;

    }

    function draw(){ //eslint-disable-line max-statements

      const padding = {
        'top': 20,
        'right': 40,
        'bottom': 0,
        'left': 0
      };
      const w = 500 - padding.left - padding.right;
      const h = 500 - padding.top - padding.bottom;
      const r = Math.min(w, h) / 2;
      const color = d3.scale.category10();

      const svg = d3.select('#chart')
        .append('svg')
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
        .style({ 'fill': 'white' });

      centerCircle = container.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 60)
        .attr('class', 'wheel-center')
        .style({
          'fill': 'white', 'cursor': 'pointer'
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

      const pieslice = Math.round(360 / data.length);

      rotation = Math.floor( (Math.random() * nbModulo.max * 360) + (nbModulo.min * 360) );
      centerCircle.on('click', null);

      vis.transition()
        .duration(3000)
        .attrTween('transform', rotTween)
        .each('end', () => {

          const newPiesPos = data.map( (entry, i) => {

            const newPiePos = (rotation - 90 + (i * pieslice) ) % 360;

            return {
              'entry': entry,
              'pos': newPiePos
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

          setTimeout( () => {

            resolve(win.label);

          }, timerWin);

        });
    
    }

    addTitle();
    draw();
    centerCircle.on('click', spin);

  });

}
