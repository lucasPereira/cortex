(function (contexto) {
	"use strict";

	var Cortex = contexto.Cortex;
	var console = contexto.console;

	Cortex.criarModulo("mensagensDoSistema", {
		iniciar: function (microMundo) {
			this.microMundo = microMundo;
			this.microMundo.inscrever("http.sucesso", this.sucessoHttp, this);
			this.microMundo.inscrever("http.erroDoCliente", this.erroDoClienteHttp, this);
		},

		sucessoHttp: function (dados) {
			console.log("Sucesso.");
			console.log(dados.codigoDeEstado);
		},

		erroDoClienteHttp: function (dados) {
			console.log("Erro do cliente.");
			console.log(dados.codigoDeEstado);
		},

		destruir: function () {
			this.microMundo.desinscrever("http.sucesso");
			this.microMundo.desinscrever("http.erroDoCliente");
		}
	});

	Cortex.criarModulo("requisitor", {
		iniciar: function (microMundo) {
			microMundo.obterRecursoJson("../recursos/json/cortex.json", {
				sucesso: this.sucesso,
				escopo: this
			});
		},

		sucesso: function () {
			console.log("OK");
		}
	});
}(this));
