import config from './config';

export default function showLink(root, id){

  root.innerHTML = '<div class="center show-anim-fast">Send: http://' + config.LINK_HOST + '/' + id + '</div>'

}