const yup = require('yup');
const express = require('express');
const router = express.Router();
const { Product } = require('../models');
const ObjectId = require('mongodb').ObjectId;

const { validateSchema, getProductsSchema, } = require('../validation/products');

// Methods: POST / PATCH / GET / DELETE / PUT

// ------------------------------------------------------------------------------------------------
// Get all
router.get('/', validateSchema(getProductsSchema), async (req, res, next) => {
  try {
    const { category, supplier, productName, stockStart, stockEnd, priceStart, priceEnd, discountStart, discountEnd, skip, limit = 10 } = req.query;
    const conditionFind = {};
    console.log(conditionFind);

    if (category) {
      conditionFind.categoryId = category;
    }
    if (supplier) {
      conditionFind.supplierId = supplier;
    }
    if (productName) {
      conditionFind.name = new RegExp(`${productName}`)
    }
    if (stockStart || stockEnd) {
      const stockGte = stockStart ? { $gte: stockStart } : {};
      const stockLte = stockEnd ? { $lte: stockEnd } : {};
      conditionFind.stock = {
        ...stockGte,
        ...stockLte,
        $exists: true
      }
    }
    if (priceStart || priceEnd) {
      const priceGte = priceStart ? { $gte: priceStart } : {};
      const priceLte = priceEnd ? { $lte: priceEnd } : {};
      conditionFind.price = {
        ...priceGte,
        ...priceLte,
        $exists: true
      }
    }
    if (discountStart || discountEnd) {
      const discountGte = discountStart ? { $gte: discountStart } : {};
      const discountLte = discountEnd ? { $lte: discountEnd } : {};
      conditionFind.discount = {
        ...discountGte,
        ...discountLte,
        $exists: true
      }
    }


    console.log('««««« conditionFind »»»»»', conditionFind);

    let results = await Product.find(conditionFind).populate('category').populate('supplier').skip(skip).limit(limit).lean({ virtuals: true });

    const totalResults = await Product.countDocuments(conditionFind);

    res.json({
      payload: results,
      total: totalResults,
    });
  } catch (error) {
    console.log('««««« error »»»»»', error);
    res.status(500).json({ ok: false, error });
  }
});

// Get by id
router.get('/:id', async (req, res, next) => {
  const validationSchema = yup.object().shape({
    params: yup.object({
      id: yup.string().test('Validate ObjectID', '${path} is not valid ObjectID', (value) => {
        return ObjectId.isValid(value);
      }),
    }),
  });


  validationSchema.validate({ params: req.params }, { abortEarly: false })
    .then(async () => {
      const { id } = req.params;

      let results = await Product.findById(id).populate('category').populate('supplier').lean({ virtuals: true });

      if (results) {
        return res.send({ ok: true, result: results });
      }

      return res.send({ ok: false, message: 'Object not found' });
    })
    .catch((err) => {
      return res.status(400).json({ type: err.name, errors: err.errors, message: err.message, provider: 'yup' });
    });
});

// ------------------------------------------------------------------------------------------------
// Create new data
router.post('/', function (req, res, next) {
  // Validate
  const validationSchema = yup.object({
    body: yup.object({
      name: yup.string().required(),
      price: yup.number().positive().required(),
      discount: yup.number().positive().max(75).required(),
      stock: yup.number().positive().min(0).max(50).required(),
      categoryId: yup
        .string()
        .required()
        .test('Validate ObjectID', '${path} is not valid ObjectID', (value) => {
          return ObjectId.isValid(value);
        }),
      supplierId: yup
        .string()
        .required()
        .test('Validate ObjectID', '${path} is not valid ObjectID', (value) => {
          return ObjectId.isValid(value);
        }),
    }),
  });

  validationSchema
    .validate({ body: req.body }, { abortEarly: false })
    .then(async () => {
      const data = req.body;

      // let category = await Category.findOne({ _id: data.categoryId });
      // if (!category) return res.status(404).json({ message: 'Not found' });

      // let supplier = await Supplier.findOne({ _id: data.supplierId });
      // if (!supplier) return res.status(404).json({ message: 'Not found' });

      let newItem = new Product(data);
      await newItem.save();
      res.send({ ok: true, message: 'Created', result: newItem });
    })
    .catch((err) => {
      return res.status(400).json({ type: err.name, errors: err.errors, message: err.message, provider: 'yup' });
    });
});
// ------------------------------------------------------------------------------------------------
// Delete data
router.delete('/:id', function (req, res, next) {
  const validationSchema = yup.object().shape({
    params: yup.object({
      id: yup.string().test('Validate ObjectID', '${path} is not valid ObjectID', (value) => {
        return ObjectId.isValid(value);
      }),
    }),
  });

  validationSchema
    .validate({ params: req.params }, { abortEarly: false })
    .then(async () => {
      try {
        const id = req.params.id;

        let found = await Product.findByIdAndDelete(id);

        if (found) {
          return res.send({ ok: true, result: found });
        }

        return res.status(410).send({ ok: false, message: 'Object not found' });
      } catch (err) {
        return res.status(500).json({ error: err });
      }
    })
    .catch((err) => {
      return res.status(400).json({ type: err.name, errors: err.errors, message: err.message, provider: 'yup' });
    });
});

router.patch('/:id', async function (req, res, next) {
  try {
    const id = req.params.id;
    const data = req.body;
    await Product.findByIdAndUpdate(id, data);
    res.send({ ok: true, message: 'Updated' });
  } catch (error) {
    res.status(500).send({ ok: false, error });
  }
});

module.exports = router;