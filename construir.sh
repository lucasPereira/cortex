#!/bin/bash

projeto=Cortex
pacoteDoProjeto=cortex

css=css
html=html
js=js
json=json
txt=txt
construcao=construcao

limpar() {
	echo ":limpar"
	rm -rf ${construcao}
}

criarEstrutura() {
	echo ":criarEstrutura"
	mkdir -p ${css}
	mkdir -p ${css}/bibliotecas
	mkdir -p ${html}
	mkdir -p ${html}/testes
	mkdir -p ${js}
	mkdir -p ${js}/bibliotecas
	mkdir -p ${json}
	mkdir -p ${txt}
	mkdir -p ${construcao}
}

adicionarBibliotecas() {
	echo ":adicionarBibliotecas"
	cp -rf ../lindaJs/construcao/linda.js ${js}/bibliotecas
	cp -rf ../verificaJs/construcao/verifica.css ${css}/bibliotecas
	cp -rf ../verificaJs/construcao/verifica.js ${js}/bibliotecas
	cp -rf ../verificaJs/construcao/jsHint.js ${js}/bibliotecas
	cp -rf ../nodoWeb/construcao/nodoWeb.js ${js}/bibliotecas
}

construir() {
	limpar
	criarEstrutura
	adicionarBibliotecas
	echo ":construir"
	cat ${js}/cortex.js > ${construcao}/${pacoteDoProjeto}.js
	cat ${js}/cortex.comunicacao.js >> ${construcao}/${pacoteDoProjeto}.js
	cat ${js}/cortex.dom.js >> ${construcao}/${pacoteDoProjeto}.js
	cat ${js}/cortex.http.js >> ${construcao}/${pacoteDoProjeto}.js
	cat ${js}/cortex.roteamento.js >> ${construcao}/${pacoteDoProjeto}.js
	cat ${js}/cortex.util.js >> ${construcao}/${pacoteDoProjeto}.js
	cat ${js}/microMundo.js >> ${construcao}/${pacoteDoProjeto}.js
}

testar() {
	echo ":testar"
	testes=`find ${html}/testes -name teste*.html`
	testes=`echo ${testes} | sed -e s@html/@http://localhost:7000/html/@g`
	chromium-browser ${testes} --allow-file-access-from-files
}

executar() {
	construir
	echo ":executar"
	chromium-browser ${html}/$pacoteDoProjeto.html
}

integrar() {
	construir
	echo ":integrar"
	node ${js}/bibliotecas/nodoWeb.js
}

echo :$pacoteDoProjeto
if [ -n "$1" ]
then
	$1
else
	construir
fi
