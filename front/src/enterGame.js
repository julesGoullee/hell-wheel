import legend from './legend';

export default function enterGame(container, names){

  return new Promise( (resolve) => {

    const stringNames = names.reduce( (acc, stringName, i) => {

      acc += (i === 0 ? '' : ', ') + stringName; //eslint-disable-line no-param-reassign

      return acc;

    }, '');

    container.innerHTML = `
<div class="center show-anim-fast">
    <div class="input-container">
         Ok, Why ?<input type="text" id="enterGame">
    </div>
    <div id="namesContainer">${stringNames}</div>
</div>${legend}`;

    const input = document.getElementById('enterGame');

    input.focus();

    function onKeyDown(e){

      if(e.which === 13){

        if(input.value.length > 2){

          document.removeEventListener('keydown', onKeyDown);
          container.innerHTML = '';
          resolve(input.value);

        }

      }

    }

    document.addEventListener('keydown', onKeyDown);

  });

}
