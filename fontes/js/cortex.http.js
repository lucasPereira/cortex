(function (contexto) {
	"use strict";

	var Cortex = contexto.Cortex;
	var Classe = contexto.Classe;
	var RequisicaoJson = contexto.RequisicaoJson;
	var MetodoHttp = contexto.MetodoHttp;

	Cortex.http = Classe.criarSingleton({
		inicializar: function () {
			this.recursos = {};
			this.cache = true;
		},

		//publico

		habilitarCache: function () {
			this.cache = true;
		},

		desabilitarCache: function () {
			this.cache = false;
		},

		criarRequisicaoJson: function (uri, usuario, senha) {
			var requisicaoJson = new RequisicaoJson(uri);
			requisicaoJson.fixarAutenticacao(usuario, senha);
			requisicaoJson.tratarResposta(this.receberResposta, this);
			return requisicaoJson;
		},

		obter: function (requisicao, dados) {
			requisicao.get(dados);
		},

		postar: function (requisicao, dados) {
			requisicao.post(dados);
		},

		colocar: function (requisicao, dados) {
			requisicao.put(dados);
		},

		remover: function (requisicao, dados) {
			requisicao.delete(dados);
		},

		adicionarTratadorDeInformacao: function (requisicao, tratador, escopo) {
			requisicao.tratarInformacao(function (resposta, codigoDeEstado, requisicao) {
				var codigoDeEstadoCastrado = this.castrarCodigoDeEstado(codigoDeEstado);
				var uri = requisicao.uri;
				var metodo = requisicao.metodo;
				tratador.chamarComEscopo(escopo, resposta, codigoDeEstadoCastrado, uri, metodo);
			}, this);
		},

		adicionarTratadorDeSucesso: function (requisicao, tratador, escopo) {
			requisicao.tratarSucesso(function (resposta, codigoDeEstado, requisicao) {
				var codigoDeEstadoCastrado = this.castrarCodigoDeEstado(codigoDeEstado);
				var uri = requisicao.uri;
				var metodo = requisicao.metodo;
				tratador.chamarComEscopo(escopo, resposta, codigoDeEstadoCastrado, uri, metodo);
			}, this);
		},

		adicionarTratadorDeRedirecionamento: function (requisicao, tratador, escopo) {
			requisicao.tratarRedirecionamento(function (resposta, codigoDeEstado, requisicao) {
				var codigoDeEstadoCastrado = this.castrarCodigoDeEstado(codigoDeEstado);
				var uri = requisicao.uri;
				var metodo = requisicao.metodo;
				tratador.chamarComEscopo(escopo, resposta, codigoDeEstadoCastrado, uri, metodo);
			}, this);
		},

		adicionarTratadorDeErroDoCliente: function (requisicao, tratador, escopo) {
			requisicao.tratarErroDoCliente(function (resposta, codigoDeEstado, requisicao) {
				var codigoDeEstadoCastrado = this.castrarCodigoDeEstado(codigoDeEstado);
				var uri = requisicao.uri;
				var metodo = requisicao.metodo;
				tratador.chamarComEscopo(escopo, resposta, codigoDeEstadoCastrado, uri, metodo);
			}, this);
		},

		adicionarTratadorDeErroDoServidor: function (requisicao, tratador, escopo) {
			requisicao.tratarErroDoServidor(function (resposta, codigoDeEstado, requisicao) {
				var codigoDeEstadoCastrado = this.castrarCodigoDeEstado(codigoDeEstado);
				var uri = requisicao.uri;
				var metodo = requisicao.metodo;
				tratador.chamarComEscopo(escopo, resposta, codigoDeEstadoCastrado, uri, metodo);
			}, this);
		},

		//privado

		castrarCodigoDeEstado: function (codigoDeEstado) {
			return {
				codigo: codigoDeEstado.comoNumero(),
				texto: codigoDeEstado.comoTexto(),
				descricao: codigoDeEstado.comoTextoFormatado()
			};
		},

		receberResposta: function (resposta, codigoDeEstado, requisicao) {
			if (this.cache && requisicao.metodo === MetodoHttp.GET) {
				this.recursos.removerPropriedade(requisicao.uri);
				this.recursos[requisicao.uri] = {
					resposta: resposta,
					codigoDeEstado: codigoDeEstado
				};
			}
		}
	}).instancia();
}(this));
