export default function launchWheel(rootNode){

  return new Promise( (resolve) => {

    rootNode.innerHTML = `
<div class="center show-anim-fast">
    <div class="input-container">
        <button  id="launch-wheel-btn">Launch !</button>
    </div>
</div>`;

    const btn = document.getElementById('launch-wheel-btn');

    function onClick(){

      btn.removeEventListener('click', onClick);
      rootNode.innerHTML = '';
      resolve();

    }

    btn.addEventListener('click', onClick);

  });

}
