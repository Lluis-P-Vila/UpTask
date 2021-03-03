import Swal from 'sweetalert2';
import axios from 'axios';

const btnEliminar= document.querySelector('#eliminar-proyecto');

if(btnEliminar){
    btnEliminar.addEventListener('click', e => {
        const urlProyecto=e.target.dataset.proyectoUrl;

        //console.log(urlProyecto);


        Swal.fire({
            title: 'Desitges eliminar aquest projecte?',
            text: "Un projecte eliminat no es pot recuperar!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, elimina\'l!',
            cancelButtonText: 'No. Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                //Enviar peticion a axios
                const url= `${location.origin}/proyectos/${urlProyecto}`;
                
                axios.delete(url, {params: {urlProyecto}})
                    .then(function(respuesta){
                        Swal.fire(
                            'Projecte eliminat!',
                            respuesta.data,
                            'success'
                        );
                        //Redireccionar a l'inici
                        setTimeout(()=>{
                            window.location.href='/'
                        }, 3000);
                    })
                    .catch(()=> {
                        Swal.fire({
                            type: 'error',
                            title: "Hubo un error",
                            text:'No se pudo eliminar el proyecto'
                        })

                    })
                
                
            }
        })
    })
}
export default btnEliminar;