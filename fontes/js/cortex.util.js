/*global Classe*/
/*global Linda*/

(function (global) {
	"use strict";

	global.Cortex.util = Classe.criarSingleton({
		//publico

		existe: function (valor) {
			return Linda.existe(valor);
		}
	}).instancia();
}(this));
