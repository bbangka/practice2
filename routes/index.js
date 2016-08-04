
/**
 * Render the index page.
 */
exports.index = function(req, res) {
    res.render('product-data-ui/index');
};

/**
 * Renders angular partial views.
 */
exports.partials = function(req, res) {
    res.render('product-data-ui/' + req.params[0]);
};

