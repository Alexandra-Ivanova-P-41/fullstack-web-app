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

function traalla() {
  try {
    JSON.parse(fs.read(fileName));
  } catch (err) {
    console.log(err);
  }

}

function getAllProducts(fileName) {
  return JSON.parse(
    fs.readFileSync(fileName, 'utf-8', (err, data) => {
      if (err) {
        console.error(err)
        return
      }
    })
  );
}

function getProductById(fileName, id) {
  let list = JSON.parse(
    fs.readFileSync(fileName, 'utf-8', (err, data) => {
      if (err) {
        console.error(err)
        return
      }
    })
  );
  return list.find(searchById, id);
}

function addProduct(fileName, product) {
  if (product.id === null || product.id === "" || product.id === undefined) {
    return false;
  }
  if (product.product_name === null || product.product_name === "" || product.product_name === undefined) {
    return false;
  }
  if (product.product_amount === null || product.product_amount === "" || product.product_amount === undefined) {
    return false;
  }
  if (product.product_price === null || product.product_price === "" || product.product_price === undefined) {
    return false;
  }
  let list = JSON.parse(
    fs.readFileSync(fileName, 'utf-8', (err, data) => {
      if (err) {
        console.error(err)
        return
      }
    })
  );
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
  if (product.id === null || product.id === "" || product.id === undefined) {
    return false;
  }
  if (product.product_name === null || product.product_name === "" || product.product_name === undefined) {
    return false;
  }
  if (product.product_amount === null || product.product_amount === "" || product.product_amount === undefined) {
    return false;
  }
  if (product.product_price === null || product.product_price === "" || product.product_price === undefined) {
    return false;
  }
  let list = JSON.parse(
    fs.readFileSync(fileName, 'utf-8', (err, data) => {
      if (err) {
        console.error(err)
        return
      }
    })
  );
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
  let list = JSON.parse(
    fs.readFileSync(fileName, 'utf-8', (err, data) => {
      if (err) {
        console.error(err)
        return;
      }
    })
  );
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

const JSONfile = "server/products.json";
//console.log(productById(JSONfile, 1));


app.get("/product", function(req, res) {
  res.send(getAllProducts(JSONfile));
});

function testId(id) {
  return !isNaN(parseInt(id));
}

app.get("/product/:id", function(req, res) {
  let id = +req.params.id;
  if (!testId(id)) {
    res.status(443).send(`Error in id product`);
  }
  let result = getProductById(JSONfile, id);
  if (result === undefined) {
    res.status(441).send({
      error: `Product not found`
    });
  }
  res.send(result);
});

app.put("/product/:id", function(req, res) {
  let id = +req.params.id;
  if (!testId(id)) {
    res.status(443).send({
      error: `Error in id product`
    });
    return;
  }
  let result = updateProduct(JSONfile, id, req.body);
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
  let result = addProduct(JSONfile, req.body);
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
  if (!testId(id)) {
    res.status(440).send({
      error: `Error in id product`
    });
    return;
  }
  let result = deleteProduct(JSONfile, id);
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


app.listen(8080);