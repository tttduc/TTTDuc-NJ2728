var express = require('express');
var router = express.Router();

let data = require('../data/customers.json')

let fileName = './data/customers.json';

let {write} = require('../helpers/FileHelper');

// Methods: POST / PATCH / GET / DELETE / PUT

//get
router.get('/', function (req, res, next) {
  res.send(data);
});

//post
router.post('/',function (req, res, next) {
  const newItem = req.body;

  let max = 0;
  data.forEach((item) => {
    if (max < item.id) {
      max = item.id;
    }
  });

  newItem.id = max + 1;

  data.push(newItem);
  write(fileName,data);
  res.send({ ok: true, message: 'Created' });
});
// Delete data
router.delete('/:id', function (req, res, next) {
  const id = req.params.id;
  data = data.filter((x) => x.id != id);

  res.send({ ok: true, message: 'Deleted' });
});
module.exports = router;
