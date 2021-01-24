async function deleteProduct(id, port) {
  let response = await fetch('http://localhost:' + port + '/product/' + id, {
    method: 'DELETE'
  });
  return await response.json();
}

async function updateProduct(id, product, port) {
  let response = await fetch('http://localhost:' + port + '/product/' + id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(product)
  });
  return await response.json();
}

async function addProduct(product, port) {
  let response = await fetch('http://localhost:' + port + '/product', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(product)
  });
  return await response.json();
}

function getMaxId(list) {
  let maxId = 0;
  list.forEach(function(item) {
    if (item.id > maxId) {
      maxId = item.id;
    }
  });
  return maxId;
}

window.onload = async function() {
  const port = 8080;
  async function update() {
    const productTableTemplateSource = document.querySelector(".table-template").innerHTML;
    const productTableTemplate = Handlebars.compile(productTableTemplateSource);
    const tableHTML = productTableTemplate({ list });
    document.querySelector(".table").innerHTML = tableHTML;
    const buttons = document.querySelectorAll(".table-row-cell__button");
    buttons.forEach((button) => {
      button.addEventListener('click', async function() {
        const elementId = +button.getAttribute('id');
        let productListId = list.findIndex((item) => item.id === elementId);
        if (button.classList.contains('table-row-cell__button--edit')) {
          const form = document.querySelector(".edit-form");
          const formNameInput = document.querySelector(".edit-form__input--name");
          const formAmountInput = document.querySelector(".edit-form__input--amount");
          const formPriceInput = document.querySelector(".edit-form__input--price");
          const formUpdateButton = document.querySelector(".edit-form__button--update");
          const formSaveButton = document.querySelector(".edit-form__button--save");
          formNameInput.value = list[productListId].product_name;
          formAmountInput.value = list[productListId].product_amount;
          formPriceInput.value = list[productListId].product_price;
          formUpdateButton.setAttribute('id', elementId);
          formUpdateButton.style.display = "block";
          formSaveButton.style.display = "none";
          form.style.display = "flex";
        } else if (button.classList.contains('table-row-cell__button--delete')) {
          let result = await deleteProduct(elementId, port);
          if (result.result === 'ok') {
            list.splice(productListId, 1);
          } else {
            alert(result.error);
          }
        }
        update();
      });
    });
  }

  let response = await fetch('http://localhost:' + port + '/product');
  let list = await response.json();
  update();

  const formUpdateButton = document.querySelector(".edit-form__button--update");
  const formNameInput = document.querySelector(".edit-form__input--name");
  const formAmountInput = document.querySelector(".edit-form__input--amount");
  const formPriceInput = document.querySelector(".edit-form__input--price");
  const form = document.querySelector(".edit-form");
  formUpdateButton.addEventListener('click', async function(event) {
    let productId = +event.target.getAttribute("id");
    let newProduct = {
      id: productId,
      product_name: formNameInput.value,
      product_amount: formAmountInput.value,
      product_price: formPriceInput.value
    }
    let result = await updateProduct(productId, newProduct, port);
    if (result.result === 'ok') {
      let productListId = list.findIndex((item) => item.id === productId);
      list[productListId] = newProduct;
      update();
      form.style.display = "none";
    } else {
      alert(result.error);
    }
  });
  const formSaveButton = document.querySelector(".edit-form__button--save");
  formSaveButton.addEventListener('click', async function(event) {
    let newProduct = {
      id: getMaxId(list) + 1,
      product_name: formNameInput.value,
      product_amount: formAmountInput.value,
      product_price: formPriceInput.value
    }
    let result = await addProduct(newProduct, port);
    if (result.result === 'ok') {
      list.push(newProduct);
      update();

      formSaveButton.style.display = "none";
      form.style.display = "none";
    } else {
      alert(result.error);
    }
  });
  const addProductButton = document.querySelector(".add-product-button");
  addProductButton.addEventListener('click', async function(event) {
    formNameInput.value = "";
    formAmountInput.value = "";
    formPriceInput.value = "";
    formUpdateButton.style.display = "none";
    formSaveButton.style.display = "block";
    form.style.display = "flex";
  });
}