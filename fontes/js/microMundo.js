/*global Cortex*/

(function () {
	"use strict";

	Cortex.criarMicroMundo({
		iniciar: function (modulo, nomeDoModulo) {
			this.modulo = modulo;
			this.nomeDoModulo = nomeDoModulo;
		},

		//publico

		inscrever: function (tipo, tratador, escopo) {
			Cortex.comunicacao.inscrever(tipo, this.nomeDoModulo, tratador, escopo);
		},

		desinscrever: function (tipo) {
			Cortex.comunicacao.publicar(tipo, this.nomeDoModulo);
		},

		publicar: function (tipo, dados) {
			Cortex.comunicacao.publicar(tipo, this.nomeDoModulo, dados);
		},

		/*
			requisicao: {
				sucesso,
				erro,
				escopo,
				autenticacao: {
					usuario,
					senha
				}
			}
		*/
		obterRecursoJson: function (uri, requisicao) {
			var requisicaoJson = this.criarRequisicaoJsonHttp(uri, requisicao);
			Cortex.http.obter(requisicaoJson, requisicao.dados);
		},

		/*
			requisicao: {
				sucesso,
				erro,
				escopo,
				autenticacao: {
					usuario,
					senha
				}
			}
		*/
		postarRecursoJson: function (uri, requisicao) {
			var requisicaoJson = this.criarRequisicaoJsonHttp(uri, requisicao);
			Cortex.http.postar(requisicaoJson, requisicao.dados);
		},

		/*
			requisicao: {
				sucesso,
				erro,
				escopo,
				autenticacao: {
					usuario,
					senha
				}
			}
		*/
		colocarRecursoJson: function (uri, requisicao) {
			var requisicaoJson = this.criarRequisicaoJsonHttp(uri, requisicao);
			Cortex.http.colocar(requisicaoJson, requisicao.dados);
		},

		/*
			requisicao: {
				sucesso,
				erro,
				escopo,
				autenticacao: {
					usuario,
					senha
				}
			}
		*/
		removerRecursoJson: function (uri, requisicao) {
			var requisicaoJson = this.criarRequisicaoJsonHttp(uri, requisicao);
			Cortex.http.remover(requisicaoJson, requisicao.dados);
		},

		//privado

		criarRequisicaoJsonHttp: function (uri, requisicao) {
			var autenticacao = requisicao.autenticacao;
			var escopo = requisicao.escopo;
			var sucesso = requisicao.sucesso;
			var erro = requisicao.erro;
			if (!Cortex.util.existe(autenticacao)) {
				autenticacao = {};
			}
			var usuario = autenticacao.usuario;
			var senha = autenticacao.senha;
			var requisicaoJson = Cortex.http.criarJson(uri, usuario, senha);
			if (Cortex.util.existe(sucesso)) {
				Cortex.http.adicionarTratadorDeSucesso(requisicaoJson, sucesso, escopo);
			}
			if (Cortex.util.existe(erro)) {
				Cortex.http.adicionarTratadorDeErroDoCliente(requisicaoJson, erro, escopo);
			}
			Cortex.http.adicionarTratadorDeInformacao(requisicaoJson, this.tratarInformacaoHttp, this);
			Cortex.http.adicionarTratadorDeSucesso(requisicaoJson, this.tratarSucessoHttp, this);
			Cortex.http.adicionarTratadorDeRedirecionamento(requisicaoJson, this.tratarRedirecionamentoHttp, this);
			Cortex.http.adicionarTratadorDeErroDoCliente(requisicaoJson, this.tratarErroDoClienteHttp, this);
			Cortex.http.adicionarTratadorDeErroDoServidor(requisicaoJson, this.tratarErroDoServidorHttp, this);
			return requisicaoJson;
		},

		tratarHttp: function (tipo, resposta, codigoDeEstado, uri, metodo) {
			this.publicar(tipo, {
				resposta: resposta,
				codigoDeEstado: codigoDeEstado,
				uri: uri,
				metodo: metodo
			});
		},

		tratarInformacaoHttp: function (resposta, codigoDeEstado, uri, metodo) {
			this.tratarHttp("http.informacao", resposta, codigoDeEstado, uri, metodo);
		},

		tratarSucessoHttp: function (resposta, codigoDeEstado, uri, metodo) {
			this.tratarHttp("http.sucesso", resposta, codigoDeEstado, uri, metodo);
		},

		tratarRedirecionamentoHttp: function (resposta, codigoDeEstado, uri, metodo) {
			this.tratarHttp("http.redirecionamento", resposta, codigoDeEstado, uri, metodo);
		},

		tratarErroDoClienteHttp: function (resposta, codigoDeEstado, uri, metodo) {
			this.tratarHttp("http.erroDoCliente", resposta, codigoDeEstado, uri, metodo);
		},

		tratarErroDoServidorHttp: function (resposta, codigoDeEstado, uri, metodo) {
			this.tratarHttp("http.erroDoServidor", resposta, codigoDeEstado, uri, metodo);
		}
	});
}());
