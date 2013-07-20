 function formatText(el, tagstart, novovalor, tagend){
  if (el.setSelectionRange) {
    if(el.selectionStart == el.selectionEnd){
      valor = novovalor
    }else{
      valor = el.value.substring(el.selectionStart,el.selectionEnd)
    }
    el.value = el.value.substring(0,el.selectionStart) + tagstart + valor + tagend + el.value.substring(el.selectionEnd,el.value.length)
  }else{
    var selectedText = document.selection.createRange().text;
    if (selectedText != "") {
      var newText = tagstart + selectedText + tagend;
      document.selection.createRange().text = newText;
    }else{
      var newText = tagstart + novovalor + tagend;
      document.selection.createRange().text = newText;
    }
  }
}

function criarNovaSala(){
  return Salas.insert({});
}

function entrarSala(salaId){
  Session.set("salaAtual",salaId);
}

function sairSala(){
  Session.set("salaAtual")
}

function enviarMensagem(mensagem){
  mensagem_enviada = {"sala": Session.get("salaAtual"),
                      "body": mensagem,
                      "sender": Meteor.user().username}
  Messages.insert(mensagem_enviada)
}

function salaAtual(){
  return Session.get("salaAtual") && Salas.findOne(Session.get("salaAtual"))
}

function mandarMensagemDigitada(){
    mensagem = $('#mensagem-enviar').val()
    if(Session.get("math-mode")){
      enviarMensagem("\\["+mensagem+"\\]")
    }else{
      enviarMensagem(mensagem)
    }
    $('#mensagem-enviar').val("")

}

Meteor.startup(function(){
  Session.set("math-mode", false)
  Session.set("enter-mode", false)
})

Meteor.setInterval(function(){
  
},1000)

Template.corpo.events({
  'click #criar-sala' : function () {
    sala_id = criarNovaSala();
    entrarSala(sala_id);
  },
  'click #entrar-sala': function(){
    sala_id = $('#codigo-sala').val();
    entrarSala(sala_id);
  }
});

Template.topo.dentrodesala = function(){
  return Meteor.user() && salaAtual();
}

Template.topo.events({
  'click #sair-sala': function(){
    sairSala()
  }
})

Template.sala.events({
  'click #enviar-mensagem' : mandarMensagemDigitada,
  'keypress #mensagem-enviar': function(event){
    if(Session.get("enter-mode")){
      if(event.which == 13){
        mandarMensagemDigitada()
        event.preventDefault()
      }
    }
  },
  'click #mode-enter': function(){
    Session.set("enter-mode",!Session.get("enter-mode"))
    $("#mode-enter").button("toggle")
  },
  'click #mode-math': function(){
    Session.set("math-mode",!Session.get("math-mode"))
    $("#mode-math").button("toggle")
  },
  'click #button-inline-math': function(){
    formatText(document.getElementById("mensagem-enviar"), "\\(","expressao","\\)");
  },
  'click #button-math': function(){
    formatText(document.getElementById("mensagem-enviar"), "\\[","expressao","\\]");
  },
  'click #button-integral': function(){
    formatText(document.getElementById("mensagem-enviar"), "\\int_{inicio}^{fim} \\!","f(x)","\\, dx");
  },
  'click #button-fraction': function(){
    formatText(document.getElementById("mensagem-enviar"), "\\frac{","x","}{y}");
  },
  'click #button-alpha': function(){
    formatText(document.getElementById("mensagem-enviar"),"", "","\\alpha");
  },
  'click #button-theta': function(){
    formatText(document.getElementById("mensagem-enviar"),"","", "\\theta");
  },
  'click #button-sum': function(){
    formatText(document.getElementById("mensagem-enviar"),"\\sum_{inicio}^{fim}", "a_n", "");
  },
  'click #button-sqrt': function(){
    formatText(document.getElementById("mensagem-enviar"),"\\sqrt{", "n", "}");
  },
  'click #button-beta': function(){
    formatText(document.getElementById("mensagem-enviar"),"", "\\beta", "");
  },
  'click #button-limit': function(){
    formatText(document.getElementById("mensagem-enviar"),"\\lim_{x \\to \\infty}", "f(x)", "");
  }
})

Template.sala.rendered = function() {
  var el = document.getElementById("mensagens")
  MathJax.Hub.Queue(["Typeset",MathJax.Hub, el]);
}

Template.corpo.dentrodesala = function(){
  return Meteor.user() && salaAtual();
}

Template.corpo.foradesala = function(){
  return !Template.corpo.dentrodesala();
}

Template.sala.membros = function(){
  return salaAtual().members
}

Template.sala.messages = function(){
  return Messages.find({"sala": Session.get("salaAtual")})
}

Template.sala.codigo = function(){
  return salaAtual()._id
}

Template.painel.enterModeActivated = function(){
  return Session.get("enter-mode") ? "active" : "";
}

Template.painel.mathModeActivated = function(){
  return Session.get("math-mode") ? "active" : "";
}

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
});

page("/sala/:id", function(ctx){
  console.log(ctx.params.id)
  entrarSala(ctx.params.id)
})

Meteor.autorun(function() {
  console.log("atualizando")
  var salaAtual = Session.get("salaAtual");
  if (Meteor.userId() && salaAtual) {
      Salas.update({"_id": salaAtual},{$push:{"members": Meteor.user()}})
    }
});

Meteor.autorun(function(){
  var messages = Salas.findOne(Session.get("salaAtual"))
  console.log("AAAAAAAAAAAAAAAAAAAA")
})