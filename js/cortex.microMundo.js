(function (contexto) {
	"use strict";

	var Cortex = contexto.Cortex;
	var Linda = contexto.Linda;
	var Classe = contexto.Classe;

	contexto.Cortex.microMundo = Classe.criarSingleton({
		iniciar: function (modulo, nomeDoModulo) {
			this.modulo = modulo;
			this.nomeDoModulo = nomeDoModulo;
			Cortex.roteamento.fixarRotaPadrao(this.tratarUriNaoRoteada, this);
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

		obterRecursoJson: function (uri, requisicao) {
			var requisicaoJson = Cortex.microMundo.criarRequisicaoJsonHttp(uri, requisicao);
			Cortex.http.obter(requisicaoJson, requisicao.dados);
		},

		postarRecursoJson: function (uri, requisicao) {
			var requisicaoJson = Cortex.microMundo.criarRequisicaoJsonHttp(uri, requisicao);
			Cortex.http.postar(requisicaoJson, requisicao.dados);
		},

		colocarRecursoJson: function (uri, requisicao) {
			var requisicaoJson = Cortex.microMundo.criarRequisicaoJsonHttp(uri, requisicao);
			Cortex.http.colocar(requisicaoJson, requisicao.dados);
		},

		removerRecursoJson: function (uri, requisicao) {
			var requisicaoJson = Cortex.microMundo.criarRequisicaoJsonHttp(uri, requisicao);
			Cortex.http.remover(requisicaoJson, requisicao.dados);
		},

		adicionarRota: function (uri, tratador) {
			Cortex.roteamento.adicionarRota(uri, tratador, this.modulo);
		},

		redirecionar: function (uri) {
			Cortex.roteamento.redirecionar(uri);
		},

		solicitarAcre: function (identificador) {
			var acre = identificador || this.nomeDoModulo;
			this.raizDom = Cortex.dom.selecionar(acre);
			return this.raizDom;
		},

		criarRequisicaoJsonHttp: function (uri, requisicao) {
			var autenticacao = requisicao.autenticacao;
			var escopo = requisicao.escopo;
			var sucesso = requisicao.sucesso;
			var erro = requisicao.erro;
			if (!Linda.existe(autenticacao)) {
				autenticacao = {};
			}
			var usuario = autenticacao.usuario;
			var senha = autenticacao.senha;
			var requisicaoJson = Cortex.http.criarRequisicaoJson(uri, usuario, senha);
			this.adicionarTratadorHttpDeSucesso(requisicaoJson, sucesso, escopo);
			this.adicionarTratadorHttpDeErroDoCliente(requisicaoJson, erro, escopo);
			this.adicionarTratadoresHttpInternos(requisicaoJson);
			return requisicaoJson;
		},

		//privado

		publicar: function (tipo, dados) {
			Cortex.comunicacao.publicar(tipo, "microMundo", dados);
		},

		adicionarTratadorHttpDeSucesso: function (requisicao, sucesso, escopo) {
			if (Linda.existe(sucesso)) {
				Cortex.http.adicionarTratadorDeSucesso(requisicao, sucesso, escopo);
			}
		},

		adicionarTratadorHttpDeErroDoCliente: function (requisicao, erroDoCliente, escopo) {
			if (Linda.existe(erroDoCliente)) {
				Cortex.http.adicionarTratadorDeErroDoCliente(requisicao, erroDoCliente, escopo);
			}
		},

		adicionarTratadoresHttpInternos: function (requisicao) {
			Cortex.http.adicionarTratadorDeInformacao(requisicao, this.tratarInformacaoHttp, this);
			Cortex.http.adicionarTratadorDeSucesso(requisicao, this.tratarSucessoHttp, this);
			Cortex.http.adicionarTratadorDeRedirecionamento(requisicao, this.tratarRedirecionamentoHttp, this);
			Cortex.http.adicionarTratadorDeErroDoCliente(requisicao, this.tratarErroDoClienteHttp, this);
			Cortex.http.adicionarTratadorDeErroDoServidor(requisicao, this.tratarErroDoServidorHttp, this);
		},

		tratarInformacaoHttp: function (resposta, codigoDeEstado, uri, metodo) {
			this.publicar("http.informacao", {
				resposta: resposta,
				codigoDeEstado: codigoDeEstado,
				uri: uri,
				metodo: metodo
			});
		},

		tratarSucessoHttp: function (resposta, codigoDeEstado, uri, metodo) {
			this.publicar("http.sucesso", {
				resposta: resposta,
				codigoDeEstado: codigoDeEstado,
				uri: uri,
				metodo: metodo
			});
		},

		tratarRedirecionamentoHttp: function (resposta, codigoDeEstado, uri, metodo) {
			this.publicar("http.redirecionamento", {
				resposta: resposta,
				codigoDeEstado: codigoDeEstado,
				uri: uri,
				metodo: metodo
			});
		},

		tratarErroDoClienteHttp: function (resposta, codigoDeEstado, uri, metodo) {
			this.publicar("http.erroDoCliente", {
				resposta: resposta,
				codigoDeEstado: codigoDeEstado,
				uri: uri,
				metodo: metodo
			});
		},

		tratarErroDoServidorHttp: function (resposta, codigoDeEstado, uri, metodo) {
			this.publicar("http.erroDoServidor", {
				resposta: resposta,
				codigoDeEstado: codigoDeEstado,
				uri: uri,
				metodo: metodo
			});
		},

		tratarUriNaoRoteada: function (uri, estado) {
			this.publicar("roteamento.semRota", {
				uri: uri,
				estado: estado
			});
		}
	}).instancia();
}(this));
