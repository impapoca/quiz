var path = require('path');

// Postgres DATABASE_URL = postgres://ydlvdcrloqihfu:FEoV-ELEI4qCLdu6PqWA9qo80m@ec2-54-83-36-90.compute-1.amazonaws.com:5432/d9h5ibcbmf70er
// SQLite 	DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name 	= (url[6]||null);
var user 		= (url[2]||null);
var pwd 		= (url[3]||null);
var protocol 	= (url[1]||null);
var dialect 	= (url[1]||null);
var port 		= (url[5]||null);
var host 		= (url[4]||null);
var storage		= process.env.DATABASE_STORAGE;

// Carga modelo ORM
var Sequelize = require('sequelize');

// BBDD SQLite o Postgress
var sequelize = new Sequelize(DB_name, user, pwd,
		{
			dialect: dialect,
			protocol: protocol,
			port: port,
			host: host,
			storage: storage, //SQLite
			omitNull: true //postgress
		}
);

// Importamos la definicion de la tabla Quiz -> quiz.js
var quiz_path = path.join(__dirname, 'quiz');
var Quiz = sequelize.import(quiz_path);

// Importar definicion de la tabla Comment
var comment_path = path.join(__dirname, 'comment');
var Comment = sequelize.import(comment_path);

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

// Exportamos definicion de la tabla Quiz
exports.Quiz = Quiz;
exports.Comment = Comment;

// crea e inicializa la tabla
sequelize.sync().then(function(){
	Quiz.count().then(function(count){
		if(count == 0){
			Quiz.create({
				pregunta: 'Capital de Italia',
				respuesta: 'Roma',
				tematica: 'otro'
			});
			Quiz.create({
				pregunta: 'Capital de Portugal',
				respuesta: 'Lisboa',
				tematica: 'otro'
			})
			.then(function (){
				console.log('BBDD inicializada');
			});
		}
	});
});
