var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var Question = require('../models/questions');
var questionCount = 0;

// Login
router.get('/login', function (req, res) {
	res.render('login.html');
});

router.post('/admin' , function (req, res) {
	var choice = req.body.action;
	console.log(choice);
	  if(choice === "0")
	  res.render('register.html');
	  else
	  res.render('addQuestion.html');
});

router.get('/admin' , function (req, res) {
	res.render('admin.html');
});

router.get('/register', function (req, res) {
	res.render('register.html');
});

router.get('/addQuestion', function (req, res) {
	res.render('addQuestion.html');
});

router.post('/addQuestion' , function (req, res) {
	var text = req.body.questionText;
	var a = req.body.a;
	var b = req.body.b;
	var c = req.body.c;
	var d = req.body.d;
	var answer = req.body.answer;
	var number = questionCount++;
//	var topic = req.body.topic;
	var options = [a,b,c,d];
	var newQuestion = new Question({
		text: text,
		options: options,
		number: number,
		answer: answer
 		//topic: topic
	});

	newQuestion.save(function (err) {
	  			if (err) return handleError(err);
	  			console.log(newQuestion);
				});
});

router.post('/register', function (req, res) {
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;
	var group = req.body.group;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
	req.checkBody('group', 'Enter 1 for admin and 0 for non-admin').notEmpty();

		//checking for email and username are already taken
		User.findOne({ username: {
			"$regex": "^" + username + "\\b", "$options": "i"
	}}, function (err, user) {
			User.findOne({ email: {
				"$regex": "^" + email + "\\b", "$options": "i"
		}}, function (err, mail) {
				if (user || mail) {
					res.render('register.html', {
						user: user,
						mail: mail
					});
				}
				else {
					var newUser = new User({
						name: name,
						email: email,
						username: username,
						password: password,
						group: group
					});
					User.createUser(newUser, function (err, user) {
						if (err) throw err;
						console.log(user);
					});
         				req.flash('success_msg', 'You are registered and can now login');
					res.redirect('/users/login');

				}
			});
		});
});

router.post('/student',function(req, res){
	res.render('exam.html');
});

passport.use(new LocalStrategy(
	function (username, password, done) {
		User.getUserByUsername(username, function (err, user) {
			if (err) throw err;
			if (!user) {
				return done(null, false, { message: 'Unknown User' });
			}

			User.comparePassword(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {

					return done(null, user);
				} else {
					return done(null, false, { message: 'Invalid password' });
				}
			});
		});
	}));

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});

// router.get('/student', function(req, res){
// 	res.render('student');
// });

router.post('/student', function(req, res){
	res.redirect('/users/exam');
});

router.get('/exam', function(req, res){
	res.render('exam.html');
});


router.post('/login', function(req, res) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) {
	return res.redirect('/users/login'); }
    else {
	if(user.group == 1)
		res.render('register.html');
	else
		res.render('student.html');
}
})(req, res);
});

router.get('/logout', function (req, res) {
	req.logout();
	req.flash('success_msg', 'You are logged out');
	res.redirect('/users/login');

});

module.exports = router;
//mongod -dbpath C:\Users\Shivani\Desktop\Projects\online-exam\data\db
