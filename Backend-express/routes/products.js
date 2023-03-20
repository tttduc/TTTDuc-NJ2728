const express = require("express");
const router = express.Router();
const yup = require("yup");

let data = require("../data/products.json");

const fileName = "./data/products.json";

const { write } = require("../helpers/FileHelper");

// Methods: POST / PATCH / GET / DELETE / PUT
// Get all
router.get('/', function (req, res, next) {
  res.send(data);
});

// router.get('/:id', function (req, res, next) {
//   const id = req.params.id;

//   let found = data.find((x) => x.id == id);

//   if (found) {
//     return res.send({ ok: true, result: found });
//   }

//   return res.sendStatus(410);
// });

router.get('/:id', function (req, res, next) {
  // Validate
  const validationSchema = yup.object().shape({
    params: yup.object({
      id: yup.number(),
    }),
  });

  validationSchema
    .validate({ params: req.params }, { abortEarly: false })
    .then(() => {
      const id = req.params.id;

      let found = data.find((x) => x.id == id);

      if (found) {
        return res.send({ ok: true, result: found });
      }

      return res.send({ ok: false, message: 'Object not found' });
    })
    .catch((err) => {
      return res.status(400).json({ type: err.name, errors: err.errors, message: err.message, provider: 'yup' });
    });
});

// Create new data
router.post('/', function (req, res, next) {
  // Validate
  const validationSchema = yup.object({
    body: yup.object({
      name: yup.string().required(),
      price: yup.number().positive().required(),
      discount: yup.number().positive().required(),
      stock: yup.number().positive().required(),
      description: yup.string().required(),
    }),
  });

  validationSchema
    .validate({ body: req.body }, { abortEarly: false })
    .then(() => {
      const newItem = req.body;

      // Get max id
      let max = 0;
      data.forEach((item) => {
        if (max < item.id) {
          max = item.id;
        }
      });

      newItem.id = max + 1;

      data.push(newItem);

      // Write data to file
      write(fileName, data);

      res.send({ ok: true, message: 'Created' });
    })
    .catch((err) => {
      return res.status(400).json({ type: err.name, errors: err.errors, provider: 'yup' });
    });
});

// Delete data
router.delete("/:id", function (req, res, next) {
  const id = req.params.id;
  data = data.filter((x) => x.id != id);
  write(fileName, data);
  res.send({ ok: true, message: "Deleted" });
});

router.patch("/:id", function (req, res, next) {
  const id = req.params.id;
  const patchData = req.body;

  let found = data.find((x) => x.id == id);

  if (found) {
    for (let propertyName in patchData) {
      found[propertyName] = patchData[propertyName];
    }
  }
  write(fileName, data);
  res.send({ ok: true, message: "Updated" });
});

router.get("/search", function (req, res, next) {
  res.send("This is search router of products");
});

router.get("/details", function (req, res, next) {
  res.send("This is details router of products");
});

module.exports = router;
