// js/requisiciones.js

// Función para realizar una requisición GET a un servidor falso
const obtenerProductos = async () => {
  try {
    const response = await fetch("http://localhost:3000/products"); // Cambia la URL a tu servidor fake
    if (!response.ok) {
      throw new Error("Error al obtener los productos");
    }
    const data = await response.json();
    return data; // Retorna los datos recibidos
  } catch (error) {
    console.error("Error:", error);
  }
};

// Función para generar las tarjetas de productos dinámicamente
const cargarProductos = async () => {
  const productos = await obtenerProductos(); // Obtenemos los productos

  // Si no hay productos, mostramos un mensaje
  if (!productos || productos.length === 0) {
    document.querySelector(".product__container").innerHTML =
      "<p>No se encontraron productos.</p>";
    return;
  }

  const contenedorProductos = document.querySelector(".product__container"); // Seleccionamos el contenedor donde se agregarán las tarjetas

  // Iteramos sobre los productos para crear las tarjetas
  productos.forEach((producto) => {
    // Creamos una nueva tarjeta de producto
    const productoElemento = document.createElement("div");
    productoElemento.classList.add("row");

    productoElemento.innerHTML = `
      <div class="product__card">
        <img class="card__image" src="${producto.image}" alt="${producto.name}" />
        <div class="card__description">
          <h2 class="card__title">${producto.name}</h2>
          <div class="card__tag">
            <p class="card__price">$ ${producto.price}</p>
            <button class="delete__button" data-id="${producto.id}"></button>
          </div>
        </div>
      </div>
    `;

    // Agregamos la tarjeta al contenedor
    contenedorProductos.appendChild(productoElemento);
  });
};

// Ejecutar la función para cargar los productos al cargar la página
cargarProductos();

// Función para obtener el último id desde el servidor fake
const obtenerUltimoId = async () => {
  try {
    const response = await fetch("http://localhost:3000/products");
    if (!response.ok) {
      throw new Error("Error al obtener los productos");
    }
    const productos = await response.json();

    // Si hay productos, encontrar el máximo id
    if (productos.length > 0) {
      const ultimoProducto = productos.reduce(
        (max, producto) => (producto.id > max ? producto.id : max),
        0
      );
      return ultimoProducto; // Devuelve el id más alto
    }
    return 0; // Si no hay productos, comenzamos desde id 0
  } catch (error) {
    console.error("Error al obtener el último id:", error);
    return 0; // En caso de error, comenzamos desde 0
  }
};

// Función para enviar el nuevo producto al servidor
const crearProducto = async (producto) => {
  try {
    const response = await fetch("http://localhost:3000/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(producto),
    });

    if (!response.ok) {
      throw new Error("Error al crear el producto");
    }

    const data = await response.json();
    console.log("Producto creado:", data);
  } catch (error) {
    console.error("Error al crear el producto:", error);
  }
};
// Manejo del envío del formulario
const manejarEnvioFormulario = async (event) => {
  event.preventDefault(); // Prevenir la recarga del formulario

  // Capturar valores de los campos del formulario
  const nombre = document.getElementById("name").value;
  const precio = document.getElementById("price").value;
  const imagen = document.getElementById("image").value;

  // Obtener el próximo id
  const ultimoId = await obtenerUltimoId();
  const nuevoId = ultimoId + 1;

  // Crear objeto producto
  if (!nombre || !precio || !imagen) {
    alert("Por favor, completa todos los campos.");
    return;
  } else {
    const nuevoProducto = {
      id: nuevoId, // id calculado
      name: nombre,
      price: parseFloat(precio), // Convertir precio a número
      image: imagen,
    };
    // Enviar producto al servidor
    await crearProducto(nuevoProducto);
    // Limpiar formulario después de enviar
    event.target.reset();
  }
};

// Asignar evento al formulario
document
  .querySelector("form")
  .addEventListener("submit", manejarEnvioFormulario);

/*Borrar producto*/
const deleteProduct = async (id) => {
  try {
    const response = await fetch(`http://localhost:3000/products/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Error al eliminar el producto con ID ${id}`);
    }

    console.log(`Producto con ID ${id} eliminado con éxito.`);
    return true;
  } catch (error) {
    console.error("Error en DELETE:", error.message);
    return false;
  }
};
// Función para manejar la eliminación del producto
// Función para manejar la eliminación del producto
const handleDelete = async (event) => {
  // Verificar si el clic ocurrió en un botón con la clase "delete__button"
  if (event.target.classList.contains("delete__button")) {
    const id = event.target.getAttribute("data-id"); // Obtener ID del producto
    const isDeleted = await deleteProduct(id); // Llamar al método DELETE

    if (isDeleted) {
      // Elimina la card del DOM
      const productCard = event.target.closest(".row"); // Cambiar a ".row" si es el contenedor correcto
      if (productCard) {
        productCard.remove();
      }
    } else {
      console.log(id);
      alert("Error al eliminar el producto.");
    }
  }
};

// Vincular el event listener al contenedor principal
const productContainer = document.querySelector(".product__container");
productContainer.addEventListener("click", handleDelete);
