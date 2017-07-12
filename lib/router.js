Router.configure({
  notFoundTemplate: "notfound"
});

Router.route('/', function () {
  this.render('Home');
});
