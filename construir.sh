#!/bin/bash

projeto=Cortex
pacoteDoProjeto=cortex

bibliotecas=bibliotecas
binarios=binarios
construcao=construcao
fontes=fontes
recursos=recursos
testes=testes
integracao=$binarios/js/nodoWeb.js

bibliotecasCss=$bibliotecas/css
bibliotecasJs=$bibliotecas/js
binariosCss=$binarios/css
binariosHtml=$binarios/html
binariosJs=$binarios/js
fontesHtml=$fontes/html
fontesJs=$fontes/js
testesHtml=$testes/html

limpar() {
	echo ":limpar"
	rm -rf $binarios
	rm -rf $construcao
}

criarEstrutura() {
	echo ":criarEstrutura"
	mkdir -p $bibliotecas
	mkdir -p $binarios
	mkdir -p $construcao
	mkdir -p $documentacao
	mkdir -p $fontes
	mkdir -p $recursos
	mkdir -p $testes
	mkdir -p $bibliotecasCss
	mkdir -p $bibliotecasJs
	mkdir -p $binariosCss
	mkdir -p $binariosHtml
	mkdir -p $binariosJs
	mkdir -p $fontesHtml
	mkdir -p $fontesJs
	mkdir -p $testesHtml
}

adicionarBibliotecas() {
	echo ":adicionarBibliotecas"
	cp -rf ../lindaJs/construcao/linda.js $bibliotecasJs
	cp -rf ../verificaJs/construcao/verifica.css $bibliotecasCss
	cp -rf ../verificaJs/construcao/verifica.js $bibliotecasJs
	cp -rf ../verificaJs/construcao/jsHint.js $bibliotecasJs
	cp -rf ../nodoWeb/construcao/nodoWeb.js $bibliotecasJs
}

compilar() {
	limpar
	criarEstrutura
	adicionarBibliotecas
	echo ":compilar"
	cp -rf $bibliotecasCss/* $binariosCss
	cp -rf $bibliotecasJs/* $binariosJs
	cp -rf $fontesHtml/* $binariosHtml
	cp -rf $fontesJs/* $binariosJs
	cp -rf $testesHtml/* $binariosHtml
	cp -rf $recursos $binarios
}

construir() {
	compilar
	echo ":construir"
	cat $binariosJs/cortex.js > $construcao/$pacoteDoProjeto.js
	cat $binariosJs/microMundo.js >> $construcao/$pacoteDoProjeto.js
}

testar() {
	construir
	echo ":testar"
	chromium-browser `find $binariosHtml -name teste*.html` --allow-file-access-from-files
}

depurar() {
	construir
	echo ":depurar"
}

executar() {
	construir
	echo ":executar"
	google-chrome $binariosHtml/$pacoteDoProjeto.html --allow-file-access-from-files
}

integrar() {
	construir
	echo ":integrar"
	node $integracao
}

echo :$pacoteDoProjeto
if [ -n "$1" ]
then
	$1
else
	construir
fi
