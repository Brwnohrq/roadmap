// ---------- configuração ----------
const CHAVE = "roadmap-java";
const CORES = ["#d9822b", "#3f7fc4", "#3a9a6b", "#8a5fc0", "#c4503f", "#2f9aa8"];

// trilha inicial (edite à vontade)
const INICIAL = [
    {
        secao: "Java",
        itens: [
            { texto: "Classes Abstratas", feito: false },
            { texto: "Exceptions", feito: false },
            { texto: "Collections List e Set", feito: false },
            { texto: "Interfaces", feito: false },
            { texto: "Collections Map", feito: false },
            { texto: "Enum", feito: false },
            { texto: "Generics", feito: false },
            { texto: "Lambda, Stream e Optional", feito: false }
        ]
    },
    {
        secao: "Banco de dados",
        itens: [
            { texto: "JDBC Clássico", feito: false },
            { texto: "CRUD", feito: false },
            { texto: "JOIN e Chave estrangeira", feito: false },
            { texto: "Transação", feito: false }
        ]
    },
    {
        secao: "Projeto: sistema bancário",
        itens: [
            { texto: "Cliente: Listar, Buscar, Cadastrar e Deletar", feito: false },
            { texto: "Depósito e Saque", feito: false },
            { texto: "Classe Abstrata de Conta", feito: false },
            { texto: "Transferência", feito: false },
            { texto: "Extrato Financeiro", feito: false },
            { texto: "Menu em loop com opção Sair", feito: false }
        ]
    },
    {
        secao: "Ferramentas e web",
        itens: [
            { texto: "Git", feito: false },
            { texto: "Maven", feito: false },
            { texto: "JUnit", feito: false },
            { texto: "HTTP e REST", feito: false },
            { texto: "Spring Boot", feito: false }
        ]
    }
];

// ---------- elementos da página ----------
let areaCartoes = document.getElementById("cartoes");
let resumo = document.getElementById("resumo");
let caixaMaterial = document.getElementById("caixaEstudo");
let caixaEscolha = document.getElementById("caixaEscolha");
let botao = document.getElementById("botao");
let botaoRestaurar = document.getElementById("restaurar");

// ---------- dados (guardados no navegador) ----------
let dados = carregar();

function copiaDoInicial() {
    return JSON.parse(JSON.stringify(INICIAL));
}

function carregar() {
    try {
        let salvo = localStorage.getItem(CHAVE);
        if (salvo) {
            return JSON.parse(salvo);
        }
    } catch (e) {
        // sem armazenamento: usa a trilha inicial
    }
    return copiaDoInicial();
}

function salvar() {
    try {
        localStorage.setItem(CHAVE, JSON.stringify(dados));
    } catch (e) {
        // se não der pra salvar, a página continua funcionando
    }
}

// ---------- desenhar a página a partir dos dados ----------
function desenhar() {
    areaCartoes.textContent = "";
    let total = 0;
    let feitosTotal = 0;

    for (let i = 0; i < dados.length; i++) {
        let secao = dados[i];
        let cor = CORES[i % CORES.length];
        let feitosSecao = 0;

        let cartao = document.createElement("div");
        cartao.className = "cartao";

        let cabecalho = document.createElement("div");
        cabecalho.className = "cabecalho";
        cabecalho.style.backgroundColor = cor;
        let titulo = document.createElement("h2");
        titulo.textContent = secao.secao;
        let contagem = document.createElement("span");
        cabecalho.append(titulo, contagem);
        cartao.append(cabecalho);

        for (let item of secao.itens) {
            let linha = document.createElement("label");
            linha.className = "item";
            if (item.feito) {
                linha.classList.add("feito");
                feitosSecao++;
            }

            let caixa = document.createElement("input");
            caixa.type = "checkbox";
            caixa.checked = item.feito;
            caixa.style.accentColor = cor;
            caixa.addEventListener("change", function () {
                item.feito = caixa.checked;
                salvar();
                desenhar();
            });

            let texto = document.createElement("span");
            texto.textContent = item.texto;

            linha.append(caixa, texto);
            cartao.append(linha);
        }

        contagem.textContent = feitosSecao + "/" + secao.itens.length;
        total += secao.itens.length;
        feitosTotal += feitosSecao;
        areaCartoes.append(cartao);
    }

    let porcento = total === 0 ? 0 : Math.round((feitosTotal / total) * 100);
    resumo.textContent = feitosTotal + " de " + total + " tópicos concluídos (" + porcento + "%)";
}

// ---------- adicionar matéria ----------
botao.addEventListener("click", function () {
    let materia = caixaMaterial.value.trim();
    let nomeSecao = caixaEscolha.value.trim();

    if (materia === "" || nomeSecao === "") {
        return;
    }

    // procura uma seção com esse nome (sem diferenciar maiúscula de minúscula)
    let encontrada = null;
    for (let s of dados) {
        if (s.secao.toLowerCase() === nomeSecao.toLowerCase()) {
            encontrada = s;
        }
    }

    // se não achou, cria a seção
    if (encontrada === null) {
        encontrada = { secao: nomeSecao, itens: [] };
        dados.push(encontrada);
    }

    encontrada.itens.push({ texto: materia, feito: false });

    salvar();
    desenhar();

    caixaMaterial.value = "";
    caixaEscolha.value = "";
    caixaMaterial.focus();
});

// Enter nas caixas de texto também adiciona
function aoApertarEnter(evento) {
    if (evento.key === "Enter") {
        botao.click();
    }
}
caixaMaterial.addEventListener("keydown", aoApertarEnter);
caixaEscolha.addEventListener("keydown", aoApertarEnter);

// ---------- restaurar ----------
botaoRestaurar.addEventListener("click", function () {
    if (confirm("Voltar para a trilha original? O que você adicionou e marcou será perdido.")) {
        dados = copiaDoInicial();
        salvar();
        desenhar();
    }
});

desenhar();
