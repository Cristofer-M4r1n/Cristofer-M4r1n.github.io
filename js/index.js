const btnAgregar = document.querySelector('#contenido-libros');// esto nos dará todas las clases que buscaremos en todo el contenido del div
const carrito = document.querySelector('#tabla-carrito tbody');// esto nos ayudara a ver las clases de tabla carrtito y poder interactuar con el tbdoy en si
const btnBorrar = document.querySelector('#tabla-carrito');
const btnBorarTodo = document.querySelector('#btn-borrar-todo');// este const nos ayuda a interactuar con el boton vaciar carrito
let todoslosLibros = []// un objeto vacio para luego agregar los datos;

CargarEventsListennes();//en esta funcion llamaremos a todos los eventos 

function CargarEventsListennes() {
    btnAgregar.addEventListener('click',agregarLibro)//este evento hace interaccion con el mouse al darle click y hara lo que esta en la funcion
    btnBorrar.addEventListener('click',borrarLibro);//este evento hace la inteccion con el mouse al darle click y hara lo que esta en la funcion
    
    btnBorarTodo.addEventListener('click',() =>{//este evento hace la inteccion con el mouse al darle click y hara lo que esta en la funcion,como la funcion es muy pequeña, se hace de esta manera para ahorrar código
        todoslosLibros = []; // cuando se le de click el arreglo pasara hacer sin datos
        console.log('Se elimino Todos los libros');
        LimpiarHTML();//llamamos la funcion para que se vea en el html
        alert('Todos los libros fueron Borrados....');// alerta  que se mostrara luego de eliminar todos los libros como mensaje!
    });
}

function agregarLibro(e) {
    if (e.target.classList.contains('agregar-carrito')) {//Si la clase existe entoces busqueme dentro de ella
        const libro = e.target.parentElement.parentElement//aqui buscamos la clase con el contenido que vayamos a ocupar,sacamos datos de aqui!!!
        e.preventDefault();// ya que contiene links entonces para no que nos suba al principio
        AgregarDatosLibro(libro);// aqui llamamos una funcion que se encargara de generar los datos que se encuentren en buscarClase!!
        
    }
}

function AgregarDatosLibro(libro) {
    //como hay un poco de dificulta para sacar el precio se hizo lo siguiente
    const precioTexto = libro.querySelector("#precio").textContent;// se crea una const que va a recibir el precio mediante el textContent
    const precioNumerico = parseFloat(precioTexto.replace(/[^\d.]/g, ''));//como es texto lo pasamos a un flotante con .replace(/[^\d.]/g, ''

    const datosLibro = {//creamos un arreglo para mandarle todos los datos cuales vayamos a utilizar 
        imagen:  libro.querySelector('img').src,//saca el src de la imagen      
        titulo: libro.querySelector('h5').textContent,//saca el texto del h5    
        descripcion: libro.querySelector('p', ".card-text").textContent,//saca el texto de p quue contiene .card-text
        precio: precioNumerico,//llamamos a la const precioNumero ya que le sacamos el dato númerico
        id: libro.querySelector('a').getAttribute('data-id'),//sacamos el id de cada libro
        cantidad: 1//cantidad la iniciamos en 1 para todos los libros
    }
    

    //aumentar la cantidad +1 en base al boton
    //lo primero en hacer es comprobar si ya existe el datos, esto se hace con .some()
    const existe = todoslosLibros.some(libro => libro.id === datosLibro.id);// pasamos a un variable si el datos id del libro es el mismo que esta en el arreglo datosLibros
    if (existe) {//preguntamos si es el mismo,si existe entonces,Sí es el mismo entonces hagame esto:

        //vamos a crear un nuevo objeto con .map() pasandoles todos los datos de libro
        const biblioteca = todoslosLibros.map(libro =>{// se crea una variable que es igual al objeto que contiene todos los datos de los libros
            if (libro.id === datosLibro.id) {//preguntamos si el id del libro es igual al que esta en el arreglo, si es asi hagame esto
                libro.cantidad++;//a la cantidad del libro agreguele 1+
                libro.precio += datosLibro.precio// se le suma el precio
                libro.precio = parseFloat(libro.precio.toFixed(2)); 
                return libro//actualiceme el libro con la cantidad 1+ agregada
            } else {///caso contrario,sino solo actualiceme el libro a como esta
                return libro;
            }
        });//Una vez que se haya realizado
        todoslosLibros = [...biblioteca];//el objeto va a copiar todo lo que esta en el objeto.map()/si hubo cambios lops copia y los manda, sino hubo cambios tambien los copia y se los manda
    } else {//sino existe el mismo id
        todoslosLibros = [...todoslosLibros, datosLibro];//el objeto copia todo lo que esta actualmente en los datos del libro 
        
    }
    //console.log(todoslosLibros);
    carritoHTML();
}


function borrarLibro(e) {
    if (e.target.classList.contains('borrar-libro')) {///Buscamos la clase  para poder interactuar en ella
        const eliminar = e.target.getAttribute('data-id');//Buscamos el datos unico que representa cada dato en este caso el id
        todoslosLibros.forEach((libro,index) => {//Recorremos el objeto y ya que vamos a  buscar un dato en concreto utilizamos un idex
            if (libro.id === eliminar) {//preguntamois si el dato que esta en el objeto es igual al data-id
                if (libro.cantidad > 1) {//Si es mayor, si dato.cantidad que esta en el arreglo es  mayor a 1
                    const precioLibro = libro.precio / libro.cantidad; // Precio unitario del libro
                    todoslosLibros[index].precio -= precioLibro;
                    todoslosLibros[index].cantidad--;//si es mayor al dato.cantidad eliminele 1 
                    todoslosLibros[index].precio = parseFloat(todoslosLibros[index].precio.toFixed(2)); // Redondeamos el precio a 2 decimales
                } else {//sino  creamos un nuevo arreglo con filter diciendole que 
                    todoslosLibros = todoslosLibros.filter(libro => libro.id !== eliminar);// el dato.id es diferente a el dato a liminar no lo inlcuya 
                }
            }
        });
        carritoHTML();//llamamos la funcion html para que haga los cambios dentro del html
    }
}

function carritoHTML() {
    LimpiarHTML();//llamamos a la funcion limpiarHTML para que limpie todo el contenido html
    ///recorremos el objeto con todos los datos
    todoslosLibros.forEach(dato => {//creamos un metodo llamado dato para poder interactuar con el contenido que tiene el objeto
        const {imagen, titulo, descripcion, precio, id, cantidad } = dato; //aqui referenciamos los datos del objeto diciendole que  igual al metodo 
        const tr = document.createElement('tr'); // creamos un const con el elemento html a crear con el createElement
        //con el innerHTML creamos la estructura y le pasamos los datos con "${dato}"
        //en el id creamos una clase llamada borrar-ibro y tambien le pasamos las otras clases para que agarre la edicion de css
        tr.innerHTML = `
        <td>
            <img src="${imagen}" width = "100">          
        </td>
        <td>${titulo}</td>
        <td>${descripcion}</td>
        <td>${precio}</td>
        <td>${cantidad}</td>
        <td>
            <a class="btn btn-primary agregar-carrito borrar-libro" data-id="${id}">X</a>      
        </td>

        `;
        carrito.appendChild(tr); // le pasamos la estructura y los datos con un appendChild
    });
    
}



function LimpiarHTML() {//para limpiar carrito hay que tener referenciado la clase o id que contiene los datos a los cuales se les van a pasar los datos de los libros en este caso seria tbody 
   //llamamos la const al cual le iran los datos al html 
    while (carrito.firstChild) {// mientras el primer valor que tenga carrito(tbdoy) sea verdadero
        carrito.removeChild(carrito.firstChild);//elimineme el primer valor
    }
}