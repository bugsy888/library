var express = require('express');
var bookRouter = express.Router();

oracledb.outFormat = oracledb.OBJECT;

var router = function(nav) {
    bookRouter.route('/')
        .all(function (req, res, next) {
            oracledb.getConnection(
                {
                    user: 'plural',
                    password: 'S1ght',
                    connectString: 'nodetest'
                },
                function (err, connection) {
                    if (err) {
                        console.error(err.message);
                        return;
                    }
                    connection.execute(
                        'SELECT * FROM books ',
                        function (err, result) {
                            if (err) {
                                console.error(err.message);
                                return;
                            } else {
                                req.books = result.rows;
                                next();
                            }
                        }
                    );
                }
            );
        })
        .get(function (req, res) {
            res.render('bookListView', {
                title: 'Books',
                nav: nav,
                books: req.books
            });
        });

    bookRouter.route('/:id')
        .all(function(req, res, next) {
            oracledb.getConnection(
                {
                    user: 'plural',
                    password: 'S1ght',
                    connectString: 'nodetest'
                },
                function (err, connection) {
                    if (err) {
                        console.error(err.message);
                        return;
                    }
                    connection.execute(
                        'SELECT * FROM books WHERE ID = :id',
                        [req.params.id],
                        function (err, result) {
                            if (err) {
                                console.error(err.message);
                                return;
                            } else {
                                req.book = result.rows[0];
                                next();
                            }
                        }
                    );
                }
            );
        })
        .get(function(req, res) {
            res.render('bookView', {
                title: 'Book',
                nav: nav,
                book: req.book
            });
        });

    return bookRouter;
};

module.exports = router;