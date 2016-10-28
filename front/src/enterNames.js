import legend from './legend';

export default function enterNames(container){

  return new Promise( (resolve) => {

    const names = [];

    container.innerHTML = `
<div class="center show-anim-fast">
    <div class="input-container">Y a quoi ?<input type="text" id="enterName">
    </div>
    <div id="namesContainer"></div>
</div>${legend}`;

    const input = document.getElementById('enterName');
    const namesContainer = document.getElementById('namesContainer');

    input.focus();

    function onKeyDown(e){

      if(e.which === 13){

        if(input.value.length >= 2){

          names.push(input.value);
          namesContainer.innerHTML += `<div class="show-anim-fast">${names.length === 1 ? '' : ','}${input.value}</div>`;
          input.value = '';

        } else if(e.shiftKey && names.length >= 2){

          document.removeEventListener('keydown', onKeyDown);
          container.innerHTML = '';
          resolve(names);

        }

      }

    }

    document.addEventListener('keydown', onKeyDown);

  });

}
