(function (contexto) {
	"use strict";

	var Dom = contexto.Dom;
	var Linda = contexto.Linda;
	var Classe = contexto.Classe;
	var RequisicaoHttp = contexto.RequisicaoHttp;
	var documento = contexto.documento;
	var jsHint = contexto.JSHINT;

	var Verifica = Classe.criar({
		inicializar: function (arquivos) {
			this.arquivos = arquivos;
			this.opcoes = {
				bitwise: true,
				camelcase: true,
				curly: true,
				eqeqeq: true,
				forin: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				noempty: true,
				nonew: false,
				plusplus: false,
				quotmark: "double",
				regexp: true,
				undef: true,
				unused: true,
				strict: true,
				trailing: true,
				indent: 4,
				asi: false,
				boss: false,
				debug: false,
				eqnull: false,
				es5: true,
				esnext: false,
				evil: true,
				expr: false,
				funcscope: false,
				globalstrict: false,
				iterator: false,
				lastsemic: false,
				laxbreak: false,
				laxcomma: false,
				loopfunc: false,
				multistr: false,
				proto: false,
				scripturl: false,
				smarttabs: false,
				shadow: false,
				sub: false,
				supernew: false,
				nomen: true,
				onevar: false,
				passfail: false,
				browser: true
			};
		},

		verificar: function () {
			var listaSecaoDeErros = this.criarListaSecaoDeErros();
			this.arquivos.paraCada(function (arquivo) {
				jsHint(this.obterArquivo(arquivo), this.opcoes);
				var erros = jsHint.errors;
				var listaErros = this.criarListaErros(arquivo, listaSecaoDeErros);
				erros.paraCada(function (erro) {
					if (!Linda.nulo(erro)) {
						this.criarItemErro(erro, listaErros);
					}
				},this);
			}, this);
			Dom.$("div.verificaJs").adicionarNodo(listaSecaoDeErros);
		},

		obterArquivo: function (nome) {
			var requisicao = new RequisicaoHttp(nome, false);
			requisicao.aceitaTxt();
			return requisicao.get();
		},

		criarListaSecaoDeErros: function () {
			var listaSecaoDeErros = Dom.$(documento).criarElemento("ul");
			return listaSecaoDeErros;
		},

		criarListaErros: function (nome, listaSecaoDeErros) {
			var itemSecaoDeErros = Dom.$(documento).criarElemento("li");
			var tituloSecaoDeErros = Dom.$(documento).criarElemento("h1");
			var listaErros = Dom.$(documento).criarElemento("ul");
			tituloSecaoDeErros.texto = nome;
			itemSecaoDeErros.adicionarNodo(tituloSecaoDeErros);
			itemSecaoDeErros.adicionarNodo(listaErros);
			listaSecaoDeErros.adicionarNodo(itemSecaoDeErros);
			return listaErros;
		},

		criarItemErro: function(erro, listaErros) {
			var itemErro = Dom.$(documento).criarElemento("li");
			var textoLinhaErro = Dom.$(documento).criarElemento("span");
			var textoRazaoErro = Dom.$(documento).criarElemento("span");
			var textoEvidenciaErro = Dom.$(documento).criarElemento("span");
			textoLinhaErro.texto = erro.line;
			textoRazaoErro.texto = erro.reason;
			textoEvidenciaErro.texto = erro.evidence;
			textoLinhaErro.adicionarClasse("linha");
			textoRazaoErro.adicionarClasse("razao");
			textoEvidenciaErro.adicionarClasse("evidencia");
			itemErro.adicionarNodo(textoLinhaErro);
			itemErro.adicionarNodo(textoRazaoErro);
			itemErro.adicionarNodo(textoEvidenciaErro);
			listaErros.adicionarNodo(itemErro);
		}
	});

	contexto.Verifica = Verifica;
}(this));
