import config from './config';

export default function showLink(nodeRoot, id){

  nodeRoot.innerHTML = `<div class="center show-anim-fast">Send: http://${config.LINK_HOST}/${id}</div>`;

}
