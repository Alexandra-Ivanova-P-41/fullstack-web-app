const fs = require('fs');
const express = require("express");
const app = express();
app.use(express.json());

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

function searchById(element) {
  return element.id === Number(this);
}

function getAllProducts(fileName) {
  try {
    return JSON.parse(
      fs.readFileSync(fileName, 'utf-8', (err, data) => {
        if (err) {
          console.error(err);
          return false;
        }
      })
    );
  } catch (err) {
    console.error(err);
    return false;
  }

}

function getProductById(fileName, id) {
  let list;
  try {
    list = JSON.parse(
      fs.readFileSync(fileName, 'utf-8', (err, data) => {
        if (err) {
          console.error(err);
          return false;
        }
      })
    );
  } catch (err) {
    console.error(err);
    return false;
  }
  return list.find(searchById, id);
}

function addProduct(fileName, product) {
  if (!product.id || !product.product_name || !product.product_amount || !product.product_price) {
    return false;
  }
  let list;
  try {
    list = JSON.parse(
      fs.readFileSync(fileName, 'utf-8', (err, data) => {
        if (err) {
          console.error(err);
          return false;
        }
      })
    );
  } catch (err) {
    console.error(err);
    return false;
  }
  list.push(product);
  fs.writeFileSync(fileName, JSON.stringify(list), (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
  return true;
}

function updateProduct(fileName, id, product) {
  if (!product.id || !product.product_name || !product.product_amount || !product.product_price) {
    return false;
  }
  let list;
  try {
    list = JSON.parse(
      fs.readFileSync(fileName, 'utf-8', (err, data) => {
        if (err) {
          console.error(err);
          return false;
        }
      })
    );
  } catch (err) {
    console.error(err);
    return false;
  }
  const listId = list.findIndex(searchById, id);
  if (listId === -1) {
    return false;
  }
  list[listId] = product;
  fs.writeFileSync(fileName, JSON.stringify(list), (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
  return true;
}

function deleteProduct(fileName, id) {
  let list;
  try {
    list = JSON.parse(
      fs.readFileSync(fileName, 'utf-8', (err, data) => {
        if (err) {
          console.error(err);
          return false;
        }
      })
    );
  } catch (err) {
    console.error(err);
    return false;
  }
  const listId = list.findIndex(searchById, id);
  if (listId === -1) {
    return false;
  }
  list.splice(listId, 1);
  fs.writeFileSync(fileName, JSON.stringify(list), (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
  return true;
}

const JSONFile = "server/products.json";

app.get("/product", function(req, res) {
  res.send(getAllProducts(JSONFile));
});

function isValidId(id) {
  return !isNaN(parseInt(id));
}

app.get("/product/:id", function(req, res) {
  let id = +req.params.id;
  if (!isValidId(id)) {
    res.status(443).send(`Error in id product`);
  }
  let result = getProductById(JSONFile, id);
  if (result === undefined) {
    res.status(441).send({
      error: `Product not found`
    });
  }
  res.send(result);
});

app.put("/product/:id", function(req, res) {
  let id = +req.params.id;
  if (!isValidId(id)) {
    res.status(443).send({
      error: `Error in id product`
    });
    return;
  }
  let result = updateProduct(JSONFile, id, req.body);
  if (result) {
    res.status(220).send({
      result: 'ok'
    });
  } else {
    res.status(442).send({
      error: `Failed to update product`
    });
  }
});

app.post("/product", function(req, res) {
  let result = addProduct(JSONFile, req.body);
  if (result) {
    res.status(220).send({
      result: 'ok'
    });
  } else {
    res.status(442).send({
      error: `Failed to add product`
    });
  }
});

app.delete("/product/:id", function(req, res) {
  let id = +req.params.id;
  if (!isValidId(id)) {
    res.status(440).send({
      error: `Error in id product`
    });
    return;
  }
  let result = deleteProduct(JSONFile, id);
  if (result) {
    res.status(220).send({
      result: 'ok'
    });
  } else {
    res.status(442).send({
      error: `Failed to delete product`
    });
  }
});


app.listen(5050);