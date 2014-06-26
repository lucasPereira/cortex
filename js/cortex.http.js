(function (contexto) {
	"use strict";

	var Cortex = contexto.Cortex;
	var Classe = contexto.Classe;
	var RequisicaoJson = contexto.RequisicaoJson;
	var MetodoHttp = contexto.MetodoHttp;
	var TipoDeMidia = contexto.TipoDeMidia;

	Cortex.http = Classe.criarSingleton({
		inicializar: function () {
			this.recursos = {};
			this.cache = true;
			this.autenticacao = {
				usuario: null,
				senha: null
			}
		},

		//publico

		habilitarCache: function () {
			this.cache = true;
		},

		desabilitarCache: function () {
			this.cache = false;
		},

		fixarAutenticacao: function (usuario, senha) {
			this.autenticacao.usuario = usuario;
			this.autenticacao.senha = senha;
		},

		requisicao: function (metodo, uri, opcoes) {
			var metodo = Linda.existe(metodo) ? metodo.paraCaixaAlta() : MetodoHttp.GET;
			var uri = Linda.existe(uri) ? uri : "/";
			var usarUriBase = Linda.existe(opcoes.usarUriBase) ? opcoes.usarUriBase : true;
			var assincrono = Linda.existe(opcoes.assincrono) ? opcoes.assincrono : true;
			var aceita = Linda.existe(opcoes.aceita) ? opcoes.aceita.paraCaixaBaixa() : TipoDeMidia.QUALQUER;
			var tipoDeConteudo = Linda.existe(opcoes.tipoDeConteudo) ? opcoes.tipoDeConteudo.paraCaixaBaixa() : TipoDeMidia.QUALQUER;
			var autenticacao = Linda.existe(opcoes.autenticacao) ? opcoes.autenticacao : this.autenticacao;
			var uriFinal = usarUriBase ? Cortex.roteamento.construirUri(uri) : uri;
			var escopo = opcoes.escopo;
			var conteudo = opcoes.conteudo;
			var requisicao = new RequisicaoHttp(uriFinal, assincrono);
			requisicao.fixarAutenticacao(autenticacao.usuario, autenticacao.senha);
			this.fixarTipoDeConteudoAceito(requisicao, aceita);
			this.fixarTipoDeConteudo(requisicao, tipoDeConteudo);
			this.fixarTratadores(requisicao, opcoes, escopo);
			this.fixarTratadoresInternos(requisicao);
			this.completarRequisicao(requisicao, metodo, conteudo);
		},

		//privado

		fixarTipoDeConteudoAceito: function (requisicao, aceita) {
			var json = TipoDeMidia.JSON.comoTexto();
			var html = TipoDeMidia.HTML.comoTexto();
			var txt = TipoDeMidia.TXT.comoTexto();
			if (aceita === json) {
				requisicao.aceitaJson();
			} else if (aceita === html) {
				requisicao.aceitaHtml();
			} else if (aceita === txt) {
				requisicao.aceitaTxt();
			} else {
				requisicao.aceitaQualquer();
			}
		},

		fixarTipoDeConteudo: function (requisicao, tipoDeConteudo) {
			var json = TipoDeMidia.JSON.comoTexto();
			var html = TipoDeMidia.HTML.comoTexto();
			var txt = TipoDeMidia.TXT.comoTexto();
			if (tipoDeConteudo === json) {
				requisicao.enviaJson();
			} else if (tipoDeConteudo === html) {
				requisicao.enviaHtml();
			} else if (tipoDeConteudo === txt) {
				requisicao.enviaTxt();
			}
		},

		fixarTratadores: function (requisicao, opcoes, escopo) {
			var informacao = opcoes.informacao;
			var sucesso = opcoes.sucesso;
			var redirecionamento = opcoes.redirecionamento;
			var erroDoCliente = opcoes.erroDoCliente;
			var erroDoServidor = opcoes.erroDoServidor;
			this.fixarTratadorDeInformacao(requisicao, informacao, escopo);
			this.fixarTratadorDeSucesso(requisicao, sucesso, escopo);
			this.fixarTratadorDeRedirecionamento(requisicao, redirecionamento, escopo);
			this.fixarTratadorDeErroDoCliente(requisicao, erroDoCliente, escopo);
			this.fixarTratadorDeErroDoServidor(requisicao, erroDoServidor, escopo);
			requisicao.tratarResposta(this.tratarResposta, this);
		},

		fixarTratadoresInternos: function (requisicao) {
			this.fixarTratadorInternoDeInicio(requisicao);
			this.fixarTratadorInternoDeProgresso(requisicao);
			this.fixarTratadorInternoDeTermino(requisicao);
			this.fixarTratadorInternoDeAborto(requisicao);
			this.fixarTratadorInternoDeEstouroDeTempo(requisicao);
			this.fixarTratadorInternoDeErro(requisicao);
			this.fixarTratadorInternoDeInformacao(requisicao);
			this.fixarTratadorInternoDeSucesso(requisicao);
			this.fixarTratadorInternoDeRedirecionamento(requisicao);
			this.fixarTratadorInternoDeErroDoCliente(requisicao);
			this.fixarTratadorInternoDeErroDoServidor(requisicao);
			requisicao.tratarResposta(this.tratarResposta, this);
		},

		fixarTratadorDeInformacao: function (requisicao, informacao, escopo) {
			if (Linda.existe(informacao)) {
				requisicao.tratarInformacao(function (resposta, codigoDeEstado, requisicaoEncerrada) {
					var dados = this.obterDados(resposta, codigoDeEstado, requisicaoEncerrada);
					informacao.chamarComEscopo(escopo, dados);
				}, this);
			}
		},

		fixarTratadorDeSucesso: function (requisicao, sucesso, escopo) {
			if (Linda.existe(sucesso)) {
				requisicao.tratarSucesso(function (resposta, codigoDeEstado, requisicaoEncerrada) {
					var dados = this.obterDados(resposta, codigoDeEstado, requisicaoEncerrada);
					sucesso.chamarComEscopo(escopo, dados);
				}, this);
			}
		},

		fixarTratadorDeRedirecionamento: function (requisicao, redirecionamento, escopo) {
			if (Linda.existe(redirecionamento)) {
				requisicao.tratarRedirecionamento(function (resposta, codigoDeEstado, requisicaoEncerrada) {
					var dados = this.obterDados(resposta, codigoDeEstado, requisicaoEncerrada);
					redirecionamento.chamarComEscopo(escopo, dados);
				}, this);
			}
		},

		fixarTratadorDeErroDoCliente: function (requisicao, erroDoCliente, escopo) {
			if (Linda.existe(erroDoCliente)) {
				requisicao.tratarErroDoCliente(function (resposta, codigoDeEstado, requisicaoEncerrada) {
					var dados = this.obterDados(resposta, codigoDeEstado, requisicaoEncerrada);
					erroDoCliente.chamarComEscopo(escopo, dados);
				}, this);
			}
		},

		fixarTratadorDeErroDoServidor: function (requisicao, erroDoServidor, escopo) {
			if (Linda.existe(erroDoServidor)) {
				requisicao.tratarErroDoServidor(function (resposta, codigoDeEstado, requisicaoEncerrada) {
					var dados = this.obterDados(resposta, codigoDeEstado, requisicaoEncerrada);
					erroDoServidor.chamarComEscopo(escopo, dados);
				}, this);
			}
		},

		fixarTratadorInternoDeInicio: function (requisicao) {
			requisicao.tratarInicio(function () {
				var dados = this.obterDadosSemResposta(requisicao);
				Cortex.comunicacao.publicarComEco("cortex.http.inicio", dados);
			}, this);
		},

		fixarTratadorInternoDeProgresso: function (requisicao) {
			requisicao.tratarProgresso(function () {
				var dados = this.obterDadosSemResposta(requisicao);
				Cortex.comunicacao.publicarComEco("cortex.http.progresso", dados);
			}, this);
		},

		fixarTratadorInternoDeTermino: function (requisicao) {
			requisicao.tratarTermino(function () {
				var dados = this.obterDadosSemResposta(requisicao);
				Cortex.comunicacao.publicarComEco("cortex.http.termino", dados);
			}, this);
		},

		fixarTratadorInternoDeAborto: function (requisicao) {
			requisicao.tratarAborto(function () {
				var dados = this.obterDadosSemResposta(requisicao);
				Cortex.comunicacao.publicarComEco("cortex.http.aborto", dados);
			}, this);
		},

		fixarTratadorInternoDeEstouroDeTempo: function (requisicao) {
			requisicao.tratarEstouroDeTempo(function () {
				var dados = this.obterDadosSemResposta(requisicao);
				Cortex.comunicacao.publicarComEco("cortex.http.estouroDeTempo", dados);
			}, this);
		},

		fixarTratadorInternoDeErro: function (requisicao) {
			requisicao.tratarErro(function () {
				var dados = this.obterDadosSemResposta(requisicao);
				Cortex.comunicacao.publicarComEco("cortex.http.erro", dados);
			}, this);
		},

		fixarTratadorInternoDeInformacao: function (requisicao)
			requisicao.tratarInformacao(function (resposta, codigoDeEstado, requisicao) {
				var dados = this.obterDados(resposta, codigoDeEstado, requisicao);
				Cortex.comunicacao.publicarComEco("cortex.http.informacao", dados);
			});
		},

		fixarTratadorInternoDeSucesso: function (requisicao)
			requisicao.tratarSucesso(function (resposta, codigoDeEstado, requisicao) {
				var dados = this.obterDados(resposta, codigoDeEstado, requisicao);
				Cortex.comunicacao.publicarComEco("cortex.http.sucesso", dados);
			});
		},

		fixarTratadorInternoDeRedirecionamento: function (requisicao)
			requisicao.tratarRedirecionamento(function (resposta, codigoDeEstado, requisicao) {
				var dados = this.obterDados(resposta, codigoDeEstado, requisicao);
				Cortex.comunicacao.publicarComEco("cortex.http.redirecionamento", dados);
			});
		},

		fixarTratadorInternoDeErroDoCliente: function (requisicao)
			requisicao.tratarErroDoCliente(function (resposta, codigoDeEstado, requisicao) {
				var dados = this.obterDados(resposta, codigoDeEstado, requisicao);
				Cortex.comunicacao.publicarComEco("cortex.http.erroDoCliente", dados);
			});
		},

		fixarTratadorInternoDeErroDoServidor: function (requisicao)
			requisicao.tratarErroDoServidor(function (resposta, codigoDeEstado, requisicao) {
				var dados = this.obterDados(resposta, codigoDeEstado, requisicao);
				Cortex.comunicacao.publicarComEco("cortex.http.erroDoServidor", dados);
			});
		},

		tratarResposta: function (resposta, codigoDeEstado, requisicao) {
			if (this.cache && requisicao.metodo === MetodoHttp.GET) {
				this.recursos.removerPropriedade(requisicao.uri);
				this.recursos[requisicao.uri] = {
					resposta: resposta,
					codigoDeEstado: codigoDeEstado
				};
			}
		},

		completarRequisicao: function (requisicao, metodo, conteudo) {
			if (metodo === MetodoHttp.GET) {
				requisicao.get(conteudo);
			} else if (metodo === MetodoHttp.POST) {
				requisicao.post(conteudo);
			} else if (metodo === MetodoHttp.PUT) {
				requisicao.put(conteudo);
			} else if (metodo === MetodoHttp.DELETE) {
				requisicao.delete(conteudo);
			}
		},

		obterDados: function (resposta, codigoDeEstado, requisicao) {
			return {
				codigoDeEstado: this.castrarCodigoDeEstado(codigoDeEstado),
				conteudo: resposta,
				uri: requisicao.uri,
				metodo: requisicao.metodo
			};
		},

		obterDadosSemResposta: function (requisicao) {
			return {
				uri: requisicao.uri,
				metodo: requisicao.metodo
			};
		},

		castrarCodigoDeEstado: function (codigoDeEstado) {
			return {
				codigo: codigoDeEstado.comoNumero(),
				texto: codigoDeEstado.comoTexto(),
				descricao: codigoDeEstado.comoTextoFormatado()
			};
		}
	}).instancia();
}(this));
