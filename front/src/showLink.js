import config from './config';

export default function showLink(root, id){

  root.innerHTML = '<div>Send: http://' + config.LINK_ADDR + '/' + id + '</div>'

}