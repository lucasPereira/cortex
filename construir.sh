#!/bin/bash

projeto=Cortex
pacoteDoProjeto=cortex

bibliotecas=bibliotecas
binarios=binarios
construcao=construcao
documentacao=documentacao
fontes=fontes
recursos=recursos
testes=testes
integracao=/var/www/$pacoteDoProjeto

bibliotecasCss=$bibliotecas/css
bibliotecasHtml=$bibliotecas/html
bibliotecasJs=$bibliotecas/js
bibliotecasJson=$bibliotecas/json

binariosCss=$binarios/css
binariosHtml=$binarios/html
binariosJs=$binarios/js
binariosJson=$binarios/json

fontesCss=$fontes/css
fontesHtml=$fontes/html
fontesJs=$fontes/js
fontesJson=$fontes/json

testesCss=$testes/css
testesHtml=$testes/html
testesJs=$testes/js
testesJson=$testes/json

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
	mkdir -p $bibliotecasHtml
	mkdir -p $bibliotecasJs
	mkdir -p $bibliotecasJson
	mkdir -p $binariosCss
	mkdir -p $binariosHtml
	mkdir -p $binariosJs
	mkdir -p $binariosJson
	mkdir -p $fontesCss
	mkdir -p $fontesHtml
	mkdir -p $fontesJs
	mkdir -p $fontesJson
	mkdir -p $testesCss
	mkdir -p $testesHtml
	mkdir -p $testesJs
	mkdir -p $testesJson
}

adicionarBibliotecas() {
	echo ":adicionarBibliotecas"
	cp -rf ../lindaJs/construcao/linda.js $bibliotecasJs
	cp -rf ../verificaJs/construcao/verifica.css $bibliotecasCss
	cp -rf ../verificaJs/construcao/verifica.js $bibliotecasJs
	cp -rf ../verificaJs/construcao/jsHint.js $bibliotecasJs
}

compilar() {
	limpar
	criarEstrutura
	adicionarBibliotecas
	echo ":compilar"
	cp -rf $bibliotecasCss/* $binariosCss
	# cp -rf $bibliotecasHtml/* $binariosHtml
	cp -rf $bibliotecasJs/* $binariosJs
	# cp -rf $bibliotecasJson/* $binariosJson
	# cp -rf $fontesCss/* $binariosCss
	cp -rf $fontesHtml/* $binariosHtml
	cp -rf $fontesJs/* $binariosJs
	cp -rf $fontesJson/* $binariosJson
	# cp -rf $testesCss/* $binariosCss
	cp -rf $testesHtml/* $binariosHtml
	# cp -rf $testesJs/* $binariosJs
	# cp -rf $testesJson/* $binariosJson
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
	chromium-browser $binariosHtml/testeDeCodigo.html --allow-file-access-from-files
}

executar() {
	construir
	echo ":executar"
	chromium-browser $binariosHtml/$pacoteDoProjeto.html
}

integrar() {
	construir
	echo ":integrar"
	sudo rm -rf $integracao
	sudo mkdir -p $integracao
	sudo cp -r $binarios/* $integracao
	sudo cp -r $construcao/* $integracao
}

echo :$pacoteDoProjeto
if [ -n "$1" ]
then
	$1
else
	construir
fi
