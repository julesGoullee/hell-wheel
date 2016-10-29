import Clipboard from 'clipboard';
import config from './config';

export default function showLink(nodeRoot, id){

  nodeRoot.innerHTML = `
<div class="center show-anim-fast">
    <div style="margin-bottom: 24px;">Send:</div>
    <div id="link">http://${config.LINK_HOST}/${id}</div>
    <button id="copy-btn" data-clipboard-target="#link">Copy to clipboard</button>
</div>`;

  const clipboard = new Clipboard('#copy-btn'); //eslint-disable-line no-unused-vars

}
