/*global Classe*/
/*global Linda*/

(function (global) {
	"use strict";

	global.Cortex = Classe.criarSingleton({
		inicializar: function () {
			this.modulos = {};
			this.microMundo = null;
		},

		criarMicroMundo: function (microMundo) {
			microMundo.SuperClasse = MicroMundo;
			var MicroMundoCortex = Classe.criar(microMundo);
			this.microMundo = MicroMundoCortex;
			return MicroMundoCortex;
		},

		criarModulo: function (nomeDoModulo, modulo) {
			modulo.SuperClasse = Modulo;
			var ModuloCortex = Classe.criar(modulo);
			this.modulos[nomeDoModulo] = {
				classe: ModuloCortex,
				instancia: null
			};
			return ModuloCortex;
		},

		iniciarModulo: function (nomeDoModulo) {
			var modulo = this.modulos[nomeDoModulo];
			var MicroMundoCortex = this.microMundo;
			var ModuloCortex = modulo.classe;
			var instanciaDoMicroMundo = new MicroMundoCortex();
			var instanciaDoModulo = new ModuloCortex();
			modulo.instancia = instanciaDoModulo;
			instanciaDoMicroMundo.iniciar(instanciaDoModulo, nomeDoModulo);
			instanciaDoModulo.iniciar(instanciaDoMicroMundo);
		},

		destruirModulo: function (nomeDoModulo) {
			var modulo = this.modulos[nomeDoModulo];
			if (Linda.existe(modulo.instancia)) {
				modulo.instancia.destruir();
				modulo.instancia = null;
			}
		}
	}).instancia();

	var MicroMundo = Classe.criar({
		iniciar: function () {}
	});

	var Modulo = Classe.criar({
		iniciar: function () {},

		destruir: function () {}
	});
}(this));
