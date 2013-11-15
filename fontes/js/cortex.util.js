(function (contexto) {
	"use strict";

	var Cortex = contexto.Cortex;
	var Linda = contexto.Linda;
	var Classe = contexto.Classe;

	Cortex.util = Classe.criarSingleton({
		//publico

		existe: function (valor) {
			return Linda.existe(valor);
		},

		formatar: function () {
			return String.formatar.aplicarComEscopo(null, arguments);
		}
	}).instancia();
}(this));
