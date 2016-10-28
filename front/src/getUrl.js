export default function getId(){

  if(document.location === '/'){

    return false;

  }

  const id = document.location.pathname.split('/')[1];

  if(typeof id === 'string' && id.length > 3){

    return id;

  }

  return false;

}
