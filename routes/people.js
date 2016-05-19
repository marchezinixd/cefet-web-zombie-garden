var express = require('express');
var db = require('../db');

var router = express.Router();

/* GET lista de pessoas. */
router.get('/', function(req, res, next) {

  db.query({
    sql: 'SELECT * FROM person LEFT OUTER JOIN zombie ON eatenBy = zombie.id',
    nestTables: true
    }, function(err, rows) {
      if (err) res.status(500).send('Problema ao recuperar pessoas.');

      res.render('listPeople', {
        people: rows,
        success: req.flash('success'),
        error: req.flash('error')
      });
  });
});


/* PUT altera pessoa para morta por um certo zumbi */
router.put('/eaten/', function(req, res) {
  db.query('UPDATE person ' +
           'SET alive = false, eatenBy = ' + db.escape(req.body.zombie) + ' ' +
           'WHERE id = ' + db.escape(req.body.person),
    function(err, result) {
      if (result.affectedRows !== 1) {
        req.flash('error', 'Nao ha pessoa para ser comida');
      } else {
        req.flash('success', 'A pessoa foi inteiramente (nao apenas cerebro) engolida.');
      }
      res.redirect('/');
  });
});


/* GET formulario de registro de nova pessoa */
router.get('/new/', function(req, res) {
  res.render('newPerson');
});


/* POST registra uma nova pessoa */
// IMPLEMENTAR AQUI
router.post('/', function(req, res) {
 db.query('INSERT INTO `zombies`.`person` (name) VALUES(' + db.escape(req.body.name) +')', function(err, result) {
  req.flash('success', 'A pessoa adentrou o cemitério com uma garrafa de Sangue de boi.');
  res.redirect('/people');
 } );

});

/* DELETE uma pessoa */
// IMPLEMENTAR AQUI
router.delete('/:id', function(req, res) {
 db.query('DELETE from  `zombies`.`person` WHERE id=' + db.escape(req.params.id) , function(err, result) {
  req.flash('success', 'A pessoa Fugiu deste cemiterio com medo dos zumbis.');
  res.redirect('/people');
 } );

});

module.exports = router;
