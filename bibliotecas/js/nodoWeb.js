var http = require("http");
var sistemaDeArquivos = require("fs");
var url = require("url");

http.createServer(function (requisicao, resposta) {
	var metodo = requisicao.method;
	if (metodo === "GET") {
		var uri = url.parse(requisicao.url, true);
		var caminho = "." + uri.pathname;
		sistemaDeArquivos.exists(caminho, function (existe) {
			if (existe) {
				sistemaDeArquivos.stat(caminho, function (erro, estado) {
					if (!erro && estado.isFile()) {
						responderComoArquivo(resposta, caminho);
					} else {
						responderComoNaoEncontrado(resposta, caminho);
					}
				});
			} else {
				responderComoNaoEncontrado(resposta, caminho);
			}
		});
	} else {
		responderComoMetodoNaoPermitido(resposta);
	}
}).listen(7000);

var tiposDeMidiaPorExtensao = {
	"js": "application/javascript",
	"json": "application/json",
	"css": "text/css",
	"html": "text/html",
	"txt": "text/plain",
	"png": "image/png"
}

function responderComoArquivo(resposta, caminho) {
	sistemaDeArquivos.readFile(caminho, function (erro, arquivo) {
		if (erro) {
			responderComoErroDoServidor();
		} else {
			var extensao = caminho.split(".").pop();
			var tipoDeMidia = tiposDeMidiaPorExtensao[extensao];
			if (tipoDeMidia == null) {
				tipoDeMidia = "text/plain";
			}
			resposta.writeHeader(200, {
				"Content-Type": tipoDeMidia
			});
			resposta.end(arquivo);
		}
	});
}

function responderComoNaoEncontrado(resposta, caminho) {
	resposta.writeHeader(404, {
		"Content-Type": "text/plain"
	});
	resposta.end(caminho);
}

function responderComoMetodoNaoPermitido(resposta) {
	resposta.statusCode = 405;
	resposta.end();
}

function responderComoErroDoServidor(resposta) {
	resposta.statusCode = 500;
	resposta.end();
}

