Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
});

Meteor.startup(function(){
  Session.set("math-mode", false)
  Session.set("enter-mode", false)
})

Meteor.autorun(function() {
  var salaAtual = Session.get("salaAtual");
  if (Meteor.userId() && salaAtual) {
      Salas.update({"_id": salaAtual},{$push:{"members": Meteor.user()}})
    }
});