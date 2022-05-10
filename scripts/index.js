const d = document;
const btnPayStyled = d.querySelectorAll('.btn-pay');
const ls = localStorage;
const API = "https://prod-off.herokuapp.com/productosOferta/";

/* Containers */
const $containerOffers = d.getElementById("containerOffers");
const $containerWithoutOffers = d.getElementById("containerWithoutOffers");
const $containerSugerencias = d.getElementById("containerSugerencias");
const $containerBoxDetail = d.getElementById("containerBoxDetail"); 
const $conteoCarrito = d.getElementById("conteo-carrito");
const $checkmarkSuccess = d.getElementById("checkmarkSuccess");

const $containerCarrito = document.getElementById("containerCarrito");
const $btnPay = document.getElementById("btnPay");
const $btnVaciar = document.getElementById("btnVaciar");
const $totalPrice = document.getElementById("span-total-price");



const $closeModal = document.getElementById("modal__close");
const modal = document.querySelector(".modal");

const $fragment = d.createDocumentFragment();

const getData = async () => {
  try {
    const resp = await fetch(`${API}`);
    const data = await resp.json();
    console.log(data);
    return data;

  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};
getData();
const showData = async (container, data) => {
  if (!data) {
    data = await getData();
  }

  container.innerHTML = "";

  data.forEach((el) => {
    const { nombre, img, description, precios, dto, ofert, id } = el;

    container.innerHTML += `
        <div class="grid-item">
            <span class="span-dto">$3.25 dto.</span>
                <img class="grid-img" src="${img}" alt="${nombre}">
                    <div class="grid-item-container">
                        <h4>$26.82/kg <span class="span-price-old">$${precios}/kg</span></h4>
                        <p>${nombre}</p>
                    </div>
            <button class="btn btn-primary" onclick="showModalProduct(${id})">Agregar</button>
        </div>
        `;
  });
};

const showModalProduct = async (id) => {
  const data = await getData();
  const result = data.filter((el) => el.id === id);
  const sugerencias = data.filter((el) => el.id !== result);
  localStorage.setItem("producto", JSON.stringify(result));
  modal.classList.add("modal--show");
  $containerBoxDetail.innerHTML = '';
  result.forEach((el) => {
      const {id, nombre, img, precios} = el;
      $containerBoxDetail.innerHTML = `
      <div class="modal__box" id="containerBoxDetail">
                    <img src="${img}" class="modal__img" alt="${nombre}">
                    <article class="modal__box-text"> 
                        <h2 class="modal__title">${nombre}</h2>
                        <h3 class="modal__price">- $${precios} /Kg</h3>
                        <span>Precios con IVA incluido</span>
                        <p class="modal__paragraph">Por la Compra de este producto obtienes un descuento del 35% de dto</p>
                        <div class="modal__box-details">
                            <label for="quality"><b>Selecciona la madurez que desees</b></label>
                            <select class="modal__select" name="" id="">
                                <option value="">Normal</option>
                                <option value="">Maduro</option>
                                <option value="">Reciente</option>
                            </select>
                            <div class="modal__box-actions">
                                <button class="btn">+</button>
                                <span>250g</span>
                                <button class="btn">-</button>
                                <button type="submit" class="btn" onclick="addCarrito(${id})">Agregar</button>
                            </div>
                        </div>
                    </article>
                </div>
      `;
  })

  $containerSugerencias.innerHTML = '';

  sugerencias.forEach((el) => {
    const { id, nombre,  img, precios } = el;
    $containerSugerencias.innerHTML += `
        <div class="grid-item">
                            <span class="span-dto">$3.25 dto.</span>
                            <img src="${img}" alt="${nombre}">
                            <div class="grid-item-container">
                                <h4>$26.82/kg <span class="span-price-old">${precios}/kg</span></h4>
                                <p>${nombre}</p>
                            </div>
                            <button class="btn btn-primary" onclick="showModalProduct(${id})">Agregar</button>
                        </div>
        `;
  });

};


const getCategory = async (category) => {
  const data = await getData(`${API}`);
  const filter = data.filter((el) => el.ofert === category);
  return filter;
};

d.addEventListener("DOMContentLoaded", async () => {
  let dataOffers = await getCategory(true);
  let dataWithoutOffers = await getCategory(false);

  showData($containerOffers, dataOffers);
  showData($containerWithoutOffers, dataWithoutOffers);
});

$closeModal.addEventListener("click", (e) => {
  e.preventDefault();
  modal.classList.remove("modal--show");
});


//Clase carrito de compra

class Carrito {
  constructor() {
      this.clave = "carrito";
      this.products = this.getProducts();

  }


  addProduct(id) {
      let product = JSON.parse(localStorage.getItem("producto"));
      if(this.exist(id)) {
          this.products.push(product[0]);
          return this.saved();
      }
      document.querySelectorAll('.btn-pay')[0].classList.remove('none');
      document.querySelectorAll('.btn-pay')[1].classList.remove('none');

      this.products.push(product[0]);
      return this.saved();
  }

  getProducts() {
      const parseProducts = localStorage.getItem("carrito");
      return JSON.parse(parseProducts) || []; 
  }

  deleteProduct(id) {
      const index = this.products.findIndex(p => p.id === id);
      if(index != -1) {
          this.products.splice(index, 1);
          this.saved();
      }
  }

  exist(id) {
      let productos = JSON.parse(ls.getItem("carrito"));
      if(!productos) {
          return false;
      } else {
          let product = productos.filter(data => data.id === id);
          return product[0];
      }
  }

  saved() {
      ls.setItem("carrito", JSON.stringify(this.products));
      showProductsCarrito();
      $checkmarkSuccess.style.opacity = "1";
      $checkmarkSuccess.style.pointerEvents = "all";
      setTimeout(() => {
        $checkmarkSuccess.style.opacity = "0";
        $checkmarkSuccess.style.pointerEvents = "none";
      }, 2000)
      
  }

  getCount() {
      return this.products.length;
  }
}


const updateCount = count => {
  if(!count) {
      $conteoCarrito.textContent = "";
  } else {
      $conteoCarrito.textContent = count;
  }
}

/* Carrito */

const refrescarConteoDeCarrito = () => {
  const carritoEncabezado = new Carrito();
  const conteo = carritoEncabezado.getCount();
  if (conteo > 0) {
      $conteoCarrito.textContent = conteo;
  } else {
      $conteoCarrito.textContent = "";
  }
};

const addCarrito = (product) => {

  const c = new Carrito();

  c.addProduct(product);
  getProducts();

}

const getProducts = async () => {    

  const c = new Carrito();
  refrescarConteoDeCarrito();

  
};

getProducts();

//---------------------------- CARRITO ---------------------------/

//------boton actions

const initialCarrito = null;
const showProductsCarrito = async () => {
    const productsLocalStorage = JSON.parse(localStorage.getItem("carrito"));
    const $carritoBoxActions = document.getElementById("carrito__box-actions");

   
    if(productsLocalStorage == initialCarrito) {
        $carritoBoxActions.classList.add("none");
        $containerCarrito.innerHTML = `
        <article class="aside__product-vacio">
        <img class="imagen_baner_carrito" src="https://res.cloudinary.com/dke83t4p2/image/upload/v1652152381/tiendita/Images/FamilyValuesShopping_udlphs.png" alt="carrito vacio"/>
        <h2>Tu canasta está vacía</h2>
        <button class="btn btn-primary">Agregar productos</button>
    </article>
        `
    } else {
        $carritoBoxActions.classList.remove("none");
        $containerCarrito.innerHTML = "";
        productsLocalStorage.forEach((el) => {
            const {img, id, precios, nombre} = el;
            $containerCarrito.innerHTML += `
            <article class="aside__product-container">
            <div class="aside__product">
             <img src="${img}" alt="${nombre}" class="aside__product-image">
             <div class="aside__product-text">
                 <h3>${nombre}</h3>
                 <span><b>$${precios}</b></span>
             </div>
            </div>
            <div class="aside__box-actions btn btn-shadow">
             <button class="btn">+</button>
             <span>250g</span>
             <button class="btn">-</button>
         </div>
         </article>
            `;
        })
        let totalPrice = productsLocalStorage.reduce((total, product) => total + product.precios, 0);
        $totalPrice.textContent = `$${totalPrice.toFixed(2)}`;
    }

    return
}

window.addEventListener("DOMContentLoaded",() => {
    showProductsCarrito();
})

$btnVaciar.addEventListener("click", () => {
  ls.setItem("carrito",initialCarrito);
  showProductsCarrito();
  document.querySelectorAll('.btn-pay')[0].classList.add('none');
  document.querySelectorAll('.btn-pay')[1].classList.add('none');
  refrescarConteoDeCarrito();
})

$btnPay.addEventListener("click", () => {
    ls.setItem("carrito",initialCarrito);
    showProductsCarrito();
    document.querySelectorAll('.btn-pay')[0].classList.add('none');
    document.querySelectorAll('.btn-pay')[1].classList.add('none');
    refrescarConteoDeCarrito();
})




