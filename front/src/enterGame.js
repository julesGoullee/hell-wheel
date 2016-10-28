
export default function enterGame(container, names){

  return new Promise( (resolve, reject) => {

    const stringNames = names.reduce( (acc, name, i) => acc += (i === 0 ? '' : ', ') + name, '' );

    container.innerHTML = '<div class="center show-anim-fast"><div class="input-container">' + stringNames + ' Ok, pourquoi ? <input type="text" id="enterGame"></div></div>';

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
