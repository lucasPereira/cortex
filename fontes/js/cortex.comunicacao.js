(function (contexto) {
	"use strict";

	var Cortex = contexto.Cortex;
	var Linda = contexto.Linda;
	var Classe = contexto.Classe;

	Cortex.comunicacao = Classe.criarSingleton({
		inicializar: function () {
			this.topicos = {};
		},

		//publico

		inscrever: function (topico, inscrito, tratador, escopo) {
			if (!Linda.existe(this.topicos[topico])) {
				this.topicos[topico] = {};
			}
			this.topicos[topico][inscrito] = tratador.vincularEscopo(escopo);
		},

		desinscrever: function (topico, inscrito) {
			var inscritos = this.topicos[topico];
			if (Linda.existe(inscritos)) {
				inscritos.removerPropriedade(inscrito);
			}
		},

		publicar: function (topico, publicador, dados) {
			var inscritos = this.topicos[topico];
			if (Linda.existe(inscritos)) {
				inscritos.paraCada(function (tratador) {
					tratador(dados);
				}, this);
			}
		},

		publicarSemEco: function (topico, publicador, dados) {
			var inscritos = this.topicos[topico];
			if (Linda.existe(inscritos)) {
				inscritos.paraCada(function (tratador, inscrito) {
					if (inscrito !== publicador) {
						tratador(dados);
					}
				}, this);
			}
		}
	}).instancia();
}(this));
