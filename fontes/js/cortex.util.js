/*global Classe*/
/*global Linda*/

(function (global) {
	"use strict";

	global.Cortex.util = Classe.criarSingleton({
		existe: function (valor) {
			return Linda.existe(valor);
		}
	}).instancia();
}(this));
