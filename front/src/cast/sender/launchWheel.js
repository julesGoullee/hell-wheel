export default function launchWheel(rootNode){

  return new Promise( (resolve) => {

    rootNode.innerHTML += `
<div id="container-btn">
    <div class="center show-anim-fast">
        <div class="input-container">
            <button  id="launch-wheel-btn" class="btn scale-anim">Launch !</button>
        </div>
    </div>
</div>`;

    const btn = document.getElementById('launch-wheel-btn');
    const container = document.getElementById('container-btn');

    rootNode.style.display = 'flex';

    function onClick(){

      btn.removeEventListener('click', onClick);
      container.parentNode.removeChild(container);
      rootNode.style.display = 'none';
      resolve();

    }

    btn.addEventListener('click', onClick);

  });

}
