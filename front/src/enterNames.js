import legend from './legend';

export default function enterNames(container){

  return new Promise( (resolve) => {

    const names = [];
    let timer = 0;

    container.innerHTML = `
<div class="center show-anim-fast">
    <div class="input-container">
        What ?<input type="text" id="enterName">
    </div>
    <div id="namesContainer"></div>
</div>${legend}`;

    const input = document.getElementById('enterName');
    const namesContainer = document.getElementById('namesContainer');

    input.focus();

    function next(){

      if(names.length >= 2){

        document.removeEventListener('keydown', onKeyDown); //eslint-disable-line no-use-before-define
        document.removeEventListener('touchstart', onTouch); //eslint-disable-line no-use-before-define
        container.innerHTML = '';
        resolve(names);

      }

    }

    function onKeyDown(e){

      if(e.which === 13){

        if(input.value.length >= 2){

          names.push(input.value);
          namesContainer.innerHTML += `<div class="show-anim-fast">${names.length === 1 ? '' : ','}${input.value}</div>`;
          input.value = '';

        } else if(e.shiftKey){

          next();

        }

      }

    }

    function onTouch(){

      if(timer === 0){

        timer = 1;
        timer = setTimeout( () => {

          timer = 0;

        }, 600);

      } else{

        timer = 0;

        next();

      }

    }

    document.addEventListener('touchstart', onTouch);
    document.addEventListener('keydown', onKeyDown);

  });

}
