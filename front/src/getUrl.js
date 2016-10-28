export default function getId(){

  return new Promise( (resolve, reject) => {

    if(document.location !== '/'){

      const id = document.location.pathname.split('/')[1];

      if(typeof id === 'string' && id.length > 3){

        resolve(id);

      } else {

        resolve(false);

      }

    } else {

      resolve(false);

    }

  });

}
