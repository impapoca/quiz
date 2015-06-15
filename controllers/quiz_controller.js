var models = require('../models/models.js');

//Autoload -factoriza el codigo si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.find(quizId).then(
		function(quiz) {
			if (quiz) {
				req.quiz = quiz;
				next();
			} else {
				next(new Error('No existe quizId=' + quizId));
			}
		}
	).catch(function(error) {next(error); });
};

// GET /quizes
exports.index = function(req, res) {  
	var search = '';

	if ( req.query.search )
		search = req.query.search.replace(/\s+/g, '%');

	var options = {
		where: ["pregunta like ?", '%' + search + '%' ] 
	};
	console.log(options);

	models.Quiz.findAll(options).then(
    function(quizes) {
    	res.render('quizes/index', {quizes: quizes, search: search});
    }
  ).catch(function (error) { next(error); });
};

// get /quizes/:id
exports.show = function(req, res) {
	res.render('quizes/show', { quiz: req.quiz });	
};

// get /quizes/:id/answer
exports.answer = function(req, res) {
	var resultado = 'Incorrecto';
	if ( req.query.respuesta === req.quiz.respuesta) {
		resultado = 'Correcto';
	}

	res.render('quizes/answer', 
		{
			quiz: req.quiz, respuesta: resultado
		}
	);
};
