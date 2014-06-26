(function (contexto) {
	"use strict";

	var Cortex = contexto.Cortex;
	var Classe = contexto.Classe;
	var Dom = contexto.Dom;

	Cortex.dom = Classe.criarSingleton({
		//publico

		selecionar: function (identificador) {
			return Dom.$(String.formatar("#%@", identificador));
		}
	}).instancia();
}(this));
