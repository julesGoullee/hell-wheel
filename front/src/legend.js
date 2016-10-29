function isMob(){

  return window.innerWidth <= 800 && window.innerHeight <= 600;

}

export default `<div class="legend-container">
    <div>Enter: valid</div>
    <div>${isMob() ? 'Double tap' : 'Enter + shift'}: next</div>
</div>`;
