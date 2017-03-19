window.addEventListener("load", function() {
	controleMsg = 0;
	controlePiscando = false;
	controleUsuario = 0; // qual o clique do usuário (qual é a "fase" que o usuário esta)
	fase = 0; // quantas vezes piscam (fase do usuario);
	lvl = 400; // 1 = 1000
	pisca = 0; // qual é que ele vai piscar no vetor (piscada que o jogo esta)
	vetorUsuario = []; // vetor com as cores que devem piscar
	pontuacao = {}; // objeto banco de dados (indexedDB)
	pontuacao.abrir = function() {
		var request = indexedDB.open("mecor", 1);
		
		request.onsuccess = function(e) {
			pontuacao.db = e.target.result;
		};
		
		request.onupgradeneeded = function(e) {
			var cos = e.target.result.createObjectStore("pontuacao", {autoIncrement: true});
			cos.createIndex("pontos", "pontos", {unique: false});
		};
		
		request.onerror = function(e) {
			alert("Your browser doesn't support indexedDB (data base for web app) or you disabled this functionally.\nYou can not save the scores.");
		}
	};
	pontuacao.adicionarUsuario = function(nome) {
		var os = pontuacao.db.transaction(["pontuacao"], "readwrite").objectStore("pontuacao");
		var request = os.put({
			"nome": nome,
			"pontos" : parseInt(fase)
		});

		request.onerror = function(e) {
			alert("Error 003");
		};
	};
	
	var botao = document.getElementsByClassName("botao");
	botao[0].addEventListener("click", function() {
		verificaClique(4);
	});
	botao[1].addEventListener("click", function() {
		verificaClique(3);
	});
	botao[2].addEventListener("click", function() {
		verificaClique(2);
	});
	botao[3].addEventListener("click", function() {
		verificaClique(1);
	});
	
	document.getElementById("comecar").addEventListener("click", function() {
		comecar();
	});
	document.getElementById("informacoesGravar").addEventListener("click", function() {
		informacoesGravar();
	});
	
	pontuacao.abrir();
	telaComecar();
	acendeAleatorioComecar();
	
});

function acende() {
	if(fase != pisca) {
		setTimeout(function() {
			controlePiscando = true;
			corAcende(vetorUsuario[pisca]);
			setTimeout(function() {
				corApaga(vetorUsuario[pisca]);
				pisca++;
				acende();
			}, lvl);
		}, (lvl));
	} else {
		controlePiscando = false;
		pisca = 0;
	}
}
function acendeAleatorioComecar() {
	if(fase == 0) {
		var num = Math.floor((Math.random()*4)+1);
		var comecar = document.getElementById("comecar");
		if(num == 1) {
			comecar.style.background = "rgba(255, 255, 0, 0.3)";
		} else if(num == 2) {
			comecar.style.background = "rgba(0, 0, 255, 0.3)";
		} else if(num == 3) {
			comecar.style.background = "rgba(0, 255, 0, 0.3)";
		} else if(num == 4) {
			comecar.style.background = "rgba(255, 0, 0, 0.3)";
		}
		setTimeout(function() {
			acendeAleatorioComecar();
		}, 1000);
	}
}
function atualizaListaPontos() {
	if(pontuacao.db) {
		var scoreAllLista = "";
		var nomesLista = "";
		var i = 0;
		var pessoasNome = new Array();
		var pessoasPontos = new Array();
		var os = pontuacao.db.transaction(["pontuacao"], "readwrite").objectStore("pontuacao").index("pontos");
		os.openCursor().onsuccess = function(e) {
			var result = e.target.result;
			if(!!result == false) return;
			pessoasNome[i] = result.value.nome;
			pessoasPontos[i] = result.value.pontos;
			nomesLista += '<option value="' + pessoasNome[i] + '">';
			i++;
			result.continue();
		};
		setTimeout(function() {
			for(var ii = i - 1; ((ii >= (i - 10)) && (ii >= 0)); ii--) {
				scoreAllLista += "<li>" + pessoasPontos[ii] + " - " + pessoasNome[ii] + "</li>";
			}
			document.getElementById("scoreAllLista").innerHTML = scoreAllLista;
			document.getElementById("nomes").innerHTML = nomesLista;
		}, 400);
	}
}
function corAcende(cor) {
	if(cor == 1) {
		var quadrado = document.getElementById("amarelo");
	} else if(cor == 2) {
		var quadrado = document.getElementById("azul");
	} else if(cor == 3) {
		var quadrado = document.getElementById("verde");
	} else if(cor == 4) {
		var quadrado = document.getElementById("vermelho");
	}
	quadrado.style.opacity = 1;
	quadrado.style.borderStyle = "inset";
}

function corApaga(cor) {
	if(cor == 1) {
		var quadrado = document.getElementById("amarelo");
	} else if(cor == 2) {
		var quadrado = document.getElementById("azul");
	} else if(cor == 3) {
		var quadrado = document.getElementById("verde");
	} else if(cor == 4) {
		var quadrado = document.getElementById("vermelho");
	}
	quadrado.style.opacity = 0.3;
	quadrado.style.borderStyle = "outset";
}

function comecar() {
	setTimeout(function() {
		document.getElementById("jogo").style.display = "block";
		document.getElementById("comecar").style.display = "none";
	}, 400);
	setTimeout(function() {
		corAcende(1);
		corAcende(2);
		corAcende(3);
		corAcende(4);
	}, 1000);
	setTimeout(function() {
		corApaga(1);
		corApaga(2);
		corApaga(3);
		corApaga(4);
	}, 2000);
	setTimeout(function() {
		vetorUsuario = [];
		montarVetor();
		fase = 1;
		pisca = 0;
		controleUsuario = 0;
		document.getElementById("pontos").innerHTML = fase;
		acende();
	}, 3000);
	msg321();
}
function informacoesGravar() {
	var nome = document.getElementById("nome").value;
	if(nome == "" || !pontuacao.db) {
		if(!pontuacao.db) {
			alert("Your browser doesn't support indexedDB (data base for web app) or you disabled this functionally.\nYou can not save the scores.");
		}
		fase = 0;
		telaComecar();
		acendeAleatorioComecar();
	} else {
		pontuacao.adicionarUsuario(nome);
		fase = 0;
		telaComecar();
		acendeAleatorioComecar();
	}
}
function msg321() {
	fase = -1;
	var msgTxt = document.getElementById("msgTxt");
	var msg = document.getElementById("msg");
	if(controleMsg == 0) {
		msg.style.display = "block";
		msgTxt.innerHTML = "3";
		setTimeout(function() {
			controleMsg++;
			msg321();
		}, 990);
	} else if(controleMsg == 1) {
		msg.style.display = "block";
		msgTxt.innerHTML = "2";
		setTimeout(function() {
			controleMsg++;
			msg321();
		}, 990);
	} else if(controleMsg == 2) {
		msg.style.display = "block";
		msgTxt.innerHTML = "1";
		setTimeout(function() {
			msg.style.display = "none";
			msgTxt.innerHTML = "";
			controleMsg = 0;
		}, 990);
	}
}
function montarVetor() {
	for(var i = 0; i <= 200; i++) {
		vetorUsuario[i] = Math.floor((Math.random()*4)+1);
	}
}
function telaComecar() {
	document.getElementById("pontos").innerHTML = fase;
	document.getElementById("jogo").style.display = "none";
	document.getElementById("comecar").style.display = "inline-block";
	document.getElementById("informacoes").style.display = "none";
	setTimeout(function() {
		atualizaListaPontos();
	}, 400);
}
function verificaClique(clicado) {
	if(fase == 0) {
		alert("You don't start the game.");
	} else if(!controlePiscando) {
		if(vetorUsuario[controleUsuario] == clicado) {
			corAcende(clicado);
			controleUsuario++;
			setTimeout(function() {
				corApaga(clicado);
			}, 100);
			if(controleUsuario == fase) {
				setTimeout(function() {
					controleUsuario = 0;
					fase++;
					document.getElementById("pontos").innerHTML = fase;
					acende();
				}, 800);
			}
		} else {
			document.getElementById("jogo").style.display = "none";
			document.getElementById("informacoes").style.display = "inline-block";
			window.navigator.vibrate(1200);
		}
	}
}