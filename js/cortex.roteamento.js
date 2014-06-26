(function (contexto) {
	"use strict";

	var Cortex = contexto.Cortex;
	var Linda = contexto.Linda;
	var Classe = contexto.Classe;

	Cortex.roteamento = Classe.criarSingleton({
		inicializar: function () {
			this.uriBase = "";
			this.rotas = [];
			this.rotaPadrao = null;
			Dom.$(janela).tratarAlteracaoNoHistorico(this.rotear, this);
		},

		//publico

		inicializar: function () {
			this.uriBase = "";
			this.rotas = [];
			this.rotaPadrao = null;
			Dom.$(janela).tratarAlteracaoNoHistorico(this.rotear, this);
		},

		adicionarRota: function (uri, tratador, escopo) {
			var padrao = uri
				.substituirTodos("{alfa}", "[a-zA-Z0-9]")
				.substituirTodos("{baixa}", "[a-z]")
				.substituirTodos("{alta}", "[A-Z]")
				.substituirTodos("{numero}", "[0-9]");
			padrao = this.construirUri(padrao);
			this.rotas.adicionar({
				caminho: padrao,
				tratador: tratador,
				escopo: escopo
			});
		},

		redirecionar: function (uri) {
			Dom.$(historico).adicionarEstado(this.construirUri(uri));
			this.rotear();
		},

		rotear: function () {
			var rotasEscolhidas = [];
			this.rotas.paraCada(function (rota) {
				var destino = Dom.$(localizacao).caminho;
				var caminhoDaRota = rota.caminho;
				var combinacoes = destino.combinar(caminhoDaRota);
				if (!Linda.nulo(combinacoes) && combinacoes.quantidadeIgual(1) && combinacoes.primeiro == destino) {
					rotasEscolhidas.adicionar(rota);
				}
			}, this);
			var uri = Dom.$(localizacao).caminho;
			var estado = Dom.$(historico).estado;
			if (rotasEscolhidas.vazio()) {
				if (Linda.existe(this.rotaPadrao)) {
					this.rotaPadrao(uri, estado);
				}
			} else {
				rotasEscolhidas.paraCada(function (rotaEscolhida) {
					rotaEscolhida.tratador.chamarComEscopo(rotaEscolhida.escopo, uri, estado);
				});
			}
		},

		construirUri: function (uri) {
			return String.concatenar(this.uriBase, uri);
		},

		removerUriBase: function (uri) {
			return uri.substituir(this.uriBase, "");
		},

		fixarUriBase: function (uriBase) {
			this.uriBase = uriBase;
		},

		fixarRotaPadrao: function (tratador, escopo) {
			this.rotaPadrao = tratador.vincularEscopo(escopo);
		}

		// privado

		tratarUriNaoRoteada: function () {
			Cortex.comunicacao.publicarSemEco("roteamento.semRota", {
				uri: uri,
				estado: estado
			});
		}
	}).instancia();
}(this));
