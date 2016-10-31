import { isMob } from './utils';

export default `<div class="legend-container">
    <div>Enter: valid</div>
    <div>${isMob() ? 'Double tap' : 'Enter + shift'}: next</div>
</div>`;
