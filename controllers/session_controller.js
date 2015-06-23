// MW autorizacion accesos
exports.loginRequired = function(req, res, next){
	if (req.session.user) {
		next();
	} else {
		res.redirect('/login');
	}

};

exports.new = function(req, res){
	var errors = req.session.errors || {};
	req.session.errors =  {};

	res.render('sessions/new', {errors: errors});
};

exports.create = function(req, res) {
	var login = req.body.login;
	var password = req.body.password;

	var userController = require('./user_controller');
	userController.autenticar(login, password, function(error, user){
		if(error){
			req.session.errors = [{"message": 'Se ha producido un error: '+error}];
			res.redirect("/login");
			return;
		}

		//crear req.sesion.user y guardar campos id y username
		//la sesion se define por la exitencia de: req.session.user
		req.session.user = {id:user.id, username: user.username};

		//redireccion a path anterior a login
		res.redirect(req.session.redir.toString());
	});

};

exports.destroy = function(req, res){
	delete req.session.user;
	res.redirect(req.session.redir.toString());
};

