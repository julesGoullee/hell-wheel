
export default function enterNames(container){

  return new Promise( (resolve, reject) => {

    const names = [];
    container.innerHTML = '<div><input type="text" id="enterName"><div id="namesContainer"></div></div>';

    const input = document.getElementById('enterName');
    const namesContainer = document.getElementById('namesContainer');

    input.focus();

    function onKeyDown(e){

      if(e.which === 13){

        if(input.value.length >= 2){

          names.push(input.value);
          namesContainer.innerHTML += `<div>${input.value}</div>`;
          input.value = '';

        } else if(e.shiftKey){

          document.removeEventListener('keydown', onKeyDown);
          container.innerHTML = '';
          resolve(names);

        }

      }

    }

    document.addEventListener('keydown', onKeyDown);

  });

}
