/* =========================================================
   Mudança de Sede | TODOS Empreendimentos — script.js
   JavaScript vanilla, sem dependências.
   ========================================================= */
(function () {
  "use strict";

  /* ---------------------------------------------------------
     1. CONFIGURAÇÃO — o que normalmente precisará ser editado
     --------------------------------------------------------- */
  const CONFIG = {
    // Janela de abertura em UTC. Brasília = UTC-3 (sem horário de verão desde 2019).
    // 24/09/2026 00:00 BRT  →  24/09/2026 03:00 UTC
    // 24/09/2026 18:00 BRT  →  24/09/2026 21:00 UTC
    inicioUTC: Date.UTC(2026, 8, 24, 3, 0, 0),   // mês 8 = setembro (0-based)
    fimUTC:    Date.UTC(2026, 8, 24, 21, 0, 0),
    offsetBrasilia: "-03:00",

    // URL do gatilho "When an HTTP request is received" do Power Automate (integração real).
    endpoint: "https://defaulte93279240f9745ba871f4a124f3343.19.environment.api.powerplatform.com:443/powerautomate/automations/direct/cu/07/workflows/e1634f0b429e4a8090d42e423cc6e6bf/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=1mDIx93IW-O22DMYVJSCxPz38_pstdWzQFeOr80JdJw",
    timeoutMs: 20000,

    // "json": envia Content-Type application/json (padrão).
    // "texto": envia text/plain (evita a checagem CORS "preflight"); use só se o teste
    //          a partir do GitHub Pages falhar por CORS — ver README, seção GitHub Pages.
    formatoEnvio: "json",

    maxCaracteresPorDuvida: 3000,

    // Permite simular data/hora via URL (?simular=2026-09-24T17:59:30).
    // ⚠️ Colocar false antes de divulgar o link aos líderes.
    permitirSimulacao: true,

    origem: "HTML",
    versaoFormulario: "1.1"
  };

  /* ---------------------------------------------------------
     2. LÍDERES (nome | e-mail). A ordem alfabética é aplicada no código.
     --------------------------------------------------------- */
  const LIDERES = [
    ["Paloma Souza de Azevedo", "paloma.azevedo@maistodos.com.br"],
    ["Aline de Goes Camargo", "alinecamargo@cartaodetodos.com"],
    ["Amanda Miranda de Carvalho", "amandamiranda@cartaodetodos.com"],
    ["Andressa Rodrigues Morato Maia", "andressarodrigues@cartaodetodos.com"],
    ["Bráulio Piovezana Rinco", "brauliorinco@cartaodetodos.com"],
    ["Brunna Karoline Queiroz Rodrigues", "brunnarodrigues@cartaodetodos.com"],
    ["Caio Targino Rodrigues Simoes Brasileiro", "caiobrasileiro@cartaodetodos.com"],
    ["Camila Da Silva Andrade", "camilaandrade@cartaodetodos.com"],
    ["Caroline Paixão Vieira de Sena", "carolinedesena@cartaodetodos.com"],
    ["Caterine Nunes Barbosa", "caterinebarbosa@cartaodetodos.com"],
    ["Dan Sabbagh", "danilosabbagh@cartaodetodos.com"],
    ["Denis Gabriel Abreu de Melo", "denisdemelo@cartaodetodos.com"],
    ["Eduardo Henrique Vicentin", "eduardovicentin@cartaodetodos.com"],
    ["Elisangela Pedro Rodrigues Oliveira", "elisangelaoliveira@cartaodetodos.com"],
    ["Elison Glauber de Castro", "elisoncastro@cartaodetodos.com"],
    ["Guilherme Oliveira Sousa", "guilhermesousa@cartaodetodos.com"],
    ["Jézi Fernando Oliveira", "jezioliveira@cartaodetodos.com"],
    ["Kettuly Fernanda Alves de Amorim Santiago", "kettulysantiago@cartaodetodos.com"],
    ["Leon Calixto", "leoncalixto@cartaodetodos.com"],
    ["Lorrayne Theza", "lorraynetheza@cartaodetodos.com"],
    ["Lucas Bicalho de Freitas", "lucasfreitas@cartaodetodos.com"],
    ["Lucas Henrique Bento Barreto", "lucasbarreto@cartaodetodos.com"],
    ["Luciana Alves Faria", "lucianafaria@cartaodetodos.com"],
    ["Luis Fernando Kalil Rosenburg de Castro", "luisdecastro@cartaodetodos.com"],
    ["Marcela Reggiani Moraes", "marcelamoraes@cartaodetodos.com"],
    ["Mariana de Albuquerque Lopes", "marianalopes@cartaodetodos.com"],
    ["Matheus Arthur Fachin", "matheusfachin@cartaodetodos.com"],
    ["Nubia Aquino", "nubiaaquino@cartaodetodos.com"],
    ["Rennan Moura", "rennanmoura@cartaodetodos.com"],
    ["Ricardo Estevão De Almeida", "ricardoalmeida@cartaodetodos.com"],
    ["Rodney Duarte dos Santos", "rodneysantos@cartaodetodos.com"],
    ["Ronaldo Bruno de Souza Santos", "ronaldosantos@cartaodetodos.com"],
    ["Thiago da Silva Chisnandes", "thiagochisnandes@cartaodetodos.com"],
    ["Ulisses Leandro Carvalho Ferreira", "ulissesferreira@cartaodetodos.com"],
    ["Victor José Alves Fernandes", "victorfernandes@cartaodetodos.com"],
    ["Vinicius Massullo Silva", "viniciussilva@cartaodetodos.com"],
    ["Vinicius Miguel Pereira Cunha", "viniciuscunha@cartaodetodos.com"],
    ["Wellyngton Alves Borges", "wellyngtonborges@cartaodetodos.com"],
    ["Caroline Andrade Santos Bacelar", "carolinebacelar@cartaodetodos.com"],
    ["Carine Santos", "carinesantos@cartaodetodos.com"],
    ["Giovanna de Araujo Giacon", "giovannagiacon@cartaodetodos.com"],
    ["Gustavo Aranda Dambroski", "gustavodambroski@cartaodetodos.com"],
    ["Larissa Rodrigues", "larissarodrigues@cartaodetodos.com"],
    ["Marcela Alves Silva Nepomuceno", "marcelanepomuceno@cartaodetodos.com"],
    ["Mariana Ribeiro da Silva", "marianasilva@cartaodetodos.com"],
    ["Raylan Nunes Barbosa", "raylanbarbosa@cartaodetodos.com"],
    ["Samuel Nunes Rios Silva", "samuelsilva@cartaodetodos.com"],
    ["Mateus Henrique Cavalcante", "mateuscavalcante@cartaodetodos.com"],
    ["Sarah Nascimento Bicalho", "sarahbicalho@cartaodetodos.com"],
    ["Renata Alvarenga da Silva Stocler", "renatastocler@cartaodetodos.com"]
  ]
    .map(([nome, email]) => ({ nome: nome.trim(), email: email.trim().toLowerCase() }))
    .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" }));

  const LIDER_POR_EMAIL = new Map(LIDERES.map((l) => [l.email, l]));

  /* ---------------------------------------------------------
     3. RELÓGIO — horário de Brasília independente do relógio do aparelho
     ---------------------------------------------------------
     - As janelas são instantes absolutos (UTC), então o fuso do aparelho não importa.
     - Para não depender de um relógio de aparelho adiantado/atrasado, sincronizamos
       com o cabeçalho HTTP "Date" do próprio servidor que hospeda a página.
     - A validação definitiva do prazo deve ser repetida no Power Automate.
  */
  let clockOffsetMs = 0;          // diferença usada pelo cronômetro (servidor ou simulação)
  let offsetServidorMs = 0;       // diferença real (servidor - aparelho), nunca simulada
  let fonteHorario = "aparelho";  // "servidor" | "aparelho" | "simulado"
  let simulado = false;

  const agora = () => Date.now() + clockOffsetMs;

  async function sincronizarHorario() {
    if (location.protocol === "file:") return;
    try {
      const t0 = Date.now();
      const resp = await fetch(location.href.split("#")[0], { method: "HEAD", cache: "no-store" });
      const t1 = Date.now();
      const header = resp.headers.get("Date");
      const servidor = header ? Date.parse(header) : NaN;
      if (!Number.isNaN(servidor)) {
        // +500 ms compensa o truncamento do cabeçalho para segundos inteiros
        offsetServidorMs = servidor + 500 - (t0 + (t1 - t0) / 2);
        if (!simulado) {
          clockOffsetMs = offsetServidorMs;
          fonteHorario = "servidor";
        }
      }
    } catch (_) { /* sem rede ou servidor sem cabeçalho Date: usa o relógio do aparelho */ }
  }

  function aplicarSimulacao() {
    if (!CONFIG.permitirSimulacao) return false;
    const valor = new URLSearchParams(location.search).get("simular");
    if (!valor) return false;
    // Aceita "2026-09-24T17:59:30" (interpretado como Brasília) ou com offset explícito
    const temOffset = /([zZ]|[+-]\d{2}:?\d{2})$/.test(valor);
    const alvo = Date.parse(temOffset ? valor : valor + CONFIG.offsetBrasilia);
    if (Number.isNaN(alvo)) return false;
    clockOffsetMs = alvo - Date.now();
    fonteHorario = "simulado";
    return true;
  }

  // ISO-8601 com offset de Brasília: 2026-09-24T09:15:02-03:00
  function isoBrasilia(ms) {
    const [h, m] = CONFIG.offsetBrasilia.slice(1).split(":").map(Number);
    const sinal = CONFIG.offsetBrasilia[0] === "-" ? -1 : 1;
    const local = new Date(ms + sinal * (h * 60 + m) * 60000);
    return local.toISOString().slice(0, 19) + CONFIG.offsetBrasilia;
  }

  function estadoJanela(ms) {
    if (ms < CONFIG.inicioUTC) return "before";
    if (ms >= CONFIG.fimUTC) return "closed";
    return "open";
  }

  /* ---------------------------------------------------------
     4. ELEMENTOS
     --------------------------------------------------------- */
  const $ = (id) => document.getElementById(id);
  const el = {
    timerCard: $("timer-card"),
    countdown: $("countdown"),
    cdBoxes: $("countdown-boxes"),
    cdH: $("cd-h"), cdM: $("cd-m"), cdS: $("cd-s"),
    timerMessage: $("timer-message"),
    formCard: $("form-card"),
    form: $("duvidas-form"),
    closedNotice: $("closed-notice"),
    closedTitle: $("closed-title"),
    closedText: $("closed-text"),
    lider: $("lider"),
    liderError: $("lider-error"),
    emailDisplay: $("email-display"),
    emailValue: $("email-value"),
    lista: $("duvidas-list"),
    duvidasError: $("duvidas-error"),
    addBtn: $("add-duvida"),
    submitBtn: $("submit-btn"),
    submitError: $("submit-error"),
    confirmation: $("confirmation"),
    newSubmission: $("new-submission"),
    template: $("duvida-template"),
    testBadge: $("test-badge"),
    testBadgeTime: $("test-badge-time")
  };

  /* ---------------------------------------------------------
     5. LISTA DE LÍDERES → SELECT
     --------------------------------------------------------- */
  function popularLideres() {
    const frag = document.createDocumentFragment();
    LIDERES.forEach((l) => {
      const opt = document.createElement("option");
      opt.value = l.email;
      opt.textContent = l.nome;
      frag.appendChild(opt);
    });
    el.lider.appendChild(frag);
    atualizarEmail();
  }

  function atualizarEmail() {
    const lider = LIDER_POR_EMAIL.get(el.lider.value);
    el.lider.classList.toggle("is-placeholder", !lider);
    if (lider) {
      el.emailValue.textContent = lider.email;
      el.emailDisplay.hidden = false;
      limparErro(el.lider, el.liderError);
    } else {
      el.emailValue.textContent = "";
      el.emailDisplay.hidden = true;
    }
  }

  /* ---------------------------------------------------------
     6. DÚVIDAS DINÂMICAS
     --------------------------------------------------------- */
  let seqId = 0;

  function criarDuvida(focar) {
    const node = el.template.content.firstElementChild.cloneNode(true);
    const id = "duvida-" + (++seqId);
    const label = node.querySelector(".duvida-label");
    const textarea = node.querySelector("textarea");
    const contador = node.querySelector(".char-count");
    const remover = node.querySelector(".btn-remove");

    label.htmlFor = id;
    textarea.id = id;
    textarea.name = "duvidas[]";
    textarea.maxLength = CONFIG.maxCaracteresPorDuvida;

    textarea.addEventListener("input", () => {
      atualizarContador(textarea, contador);
      autoAjustarAltura(textarea);
      if (textarea.value.trim()) limparErroDuvidas();
    });
    remover.addEventListener("click", () => removerDuvida(node));

    atualizarContador(textarea, contador);
    if (focar) node.classList.add("is-new");
    el.lista.appendChild(node);
    renumerar();

    if (focar) {
      textarea.focus({ preventScroll: true });
      node.scrollIntoView({ behavior: prefereMenosMovimento() ? "auto" : "smooth", block: "center" });
    }
    return node;
  }

  function removerDuvida(node) {
    const itens = el.lista.querySelectorAll(".duvida-item");
    if (itens.length <= 1) return;
    const idx = Array.prototype.indexOf.call(itens, node);
    node.remove();
    renumerar();
    // Foco vai para a dúvida anterior (ou a primeira), para não perder a posição no teclado
    const restantes = el.lista.querySelectorAll(".duvida-item textarea");
    const alvo = restantes[Math.max(0, idx - 1)];
    if (alvo) alvo.focus();
  }

  function renumerar() {
    const itens = el.lista.querySelectorAll(".duvida-item");
    const unica = itens.length === 1;
    itens.forEach((item, i) => {
      const n = i + 1;
      item.querySelector(".duvida-label").textContent = "Dúvida " + n;
      const btn = item.querySelector(".btn-remove");
      btn.hidden = unica;
      btn.setAttribute("aria-label", "Remover dúvida " + n);
    });
  }

  function atualizarContador(textarea, contador) {
    const len = textarea.value.length;
    contador.textContent = len + "/" + CONFIG.maxCaracteresPorDuvida;
    contador.classList.toggle("is-near", len >= CONFIG.maxCaracteresPorDuvida * 0.9);
  }

  function autoAjustarAltura(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight + 3, 520) + "px";
  }

  function resetarDuvidas() {
    el.lista.innerHTML = "";
    criarDuvida(false);
  }

  function coletarDuvidas() {
    return Array.from(el.lista.querySelectorAll("textarea"))
      .map((t) => t.value.replace(/\r\n/g, "\n").trim())
      .filter((v) => v.length > 0);
  }

  function temTextoNaoEnviado() {
    return !el.form.hidden && coletarDuvidas().length > 0;
  }

  /* ---------------------------------------------------------
     7. VALIDAÇÃO
     --------------------------------------------------------- */
  function mostrarErro(campo, alvo, msg) {
    alvo.textContent = msg;
    alvo.hidden = false;
    if (campo) {
      campo.classList.add("is-invalid");
      campo.setAttribute("aria-invalid", "true");
    }
  }
  function limparErro(campo, alvo) {
    alvo.hidden = true;
    alvo.textContent = "";
    if (campo) {
      campo.classList.remove("is-invalid");
      campo.removeAttribute("aria-invalid");
    }
  }
  function limparErroDuvidas() {
    limparErro(null, el.duvidasError);
    el.lista.querySelectorAll("textarea.is-invalid").forEach((t) => {
      t.classList.remove("is-invalid");
      t.removeAttribute("aria-invalid");
    });
  }

  function validar() {
    let primeiroInvalido = null;

    if (!LIDER_POR_EMAIL.has(el.lider.value)) {
      mostrarErro(el.lider, el.liderError, "Selecione seu nome na lista para continuar.");
      primeiroInvalido = el.lider;
    }

    if (coletarDuvidas().length === 0) {
      const primeira = el.lista.querySelector("textarea");
      mostrarErro(primeira, el.duvidasError, "Escreva pelo menos uma dúvida antes de enviar.");
      primeira.setAttribute("aria-describedby", "duvidas-error");
      primeiroInvalido = primeiroInvalido || primeira;
    }

    if (primeiroInvalido) {
      primeiroInvalido.focus();
      primeiroInvalido.scrollIntoView({ behavior: prefereMenosMovimento() ? "auto" : "smooth", block: "center" });
      return false;
    }
    return true;
  }

  /* ---------------------------------------------------------
     8. PAYLOAD E ENVIO (integração real com o Power Automate)
     ---------------------------------------------------------
     Corpo do POST (exatamente estes campos):
     {
       "idEnvio": "uuid",
       "dataHoraUTC": "2026-09-24T12:15:02.000Z",
       "lider": "Nome",
       "email": "email@empresa.com",
       "duvidas": ["Dúvida 1", "Dúvida 2"],
       "quantidadeDuvidas": 2,
       "origem": "HTML",
       "versao": "1.1",
       "modoTeste": "No"
     }
     O envio só é concluído com HTTP 200 + JSON { "ok": true }.
  */
  let idEnvioAtual = null;       // id da tentativa pendente (reaproveitado só em reenvio idêntico após falha)
  let assinaturaPendente = null; // conteúdo da tentativa pendente
  let enviando = false;

  // Erro de envio com tipo, para exibir a mensagem correta
  class ErroEnvio extends Error {
    constructor(tipo, detalhe) {
      super(detalhe || tipo);
      this.tipo = tipo; // "autorizacao" | "http" | "resposta" | "rede" | "timeout" | "config"
    }
  }

  function gerarId() {
    if (window.crypto && typeof crypto.randomUUID === "function") return crypto.randomUUID();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
  }

  function montarPayload() {
    const lider = LIDER_POR_EMAIL.get(el.lider.value);
    const duvidas = coletarDuvidas();

    // Novo idEnvio a cada envio. Só é reaproveitado quando o líder reenvia exatamente o mesmo
    // conteúdo após uma falha — assim o fluxo não grava em duplicidade se a 1ª tentativa chegou.
    const assinatura = JSON.stringify([lider.email, duvidas]);
    if (!idEnvioAtual || assinatura !== assinaturaPendente) {
      idEnvioAtual = gerarId();
      assinaturaPendente = assinatura;
    }

    return {
      idEnvio: idEnvioAtual,
      dataHoraUTC: new Date(Date.now() + offsetServidorMs).toISOString(), // horário real do envio
      lider: lider.nome,
      email: lider.email,
      duvidas: duvidas,
      quantidadeDuvidas: duvidas.length,
      origem: CONFIG.origem,
      versao: CONFIG.versaoFormulario,
      modoTeste: simulado ? "Yes" : "No"
    };
  }

  async function enviarPayload(payload) {
    if (!CONFIG.endpoint) throw new ErroEnvio("config", "endpoint não configurado");

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), CONFIG.timeoutMs);
    let resp;
    try {
      resp = await fetch(CONFIG.endpoint, {
        method: "POST",
        headers: { "Content-Type": CONFIG.formatoEnvio === "texto" ? "text/plain;charset=UTF-8" : "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
        cache: "no-store"
      });
    } catch (err) {
      // Bloqueio de CORS também chega aqui como TypeError ("Failed to fetch");
      // o motivo exato aparece no console do navegador (F12).
      if (err && err.name === "AbortError") throw new ErroEnvio("timeout", "tempo limite excedido");
      throw new ErroEnvio("rede", err && err.message);
    } finally {
      clearTimeout(timer);
    }

    if (resp.status === 403) throw new ErroEnvio("autorizacao", "HTTP 403");
    if (resp.status !== 200) throw new ErroEnvio("http", "HTTP " + resp.status);

    let corpo = null;
    try { corpo = JSON.parse(await resp.text()); } catch (_) { /* corpo não é JSON */ }
    if (!corpo || corpo.ok !== true) throw new ErroEnvio("resposta", "HTTP 200 sem ok=true");
  }

  function mensagemDeErro(err) {
    switch (err && err.tipo) {
      case "autorizacao":
        return "O formulário está encerrado ou o envio não foi autorizado. Suas dúvidas continuam preenchidas.";
      case "timeout":
        return "O envio não foi concluído: o servidor demorou para responder. Tente novamente. Suas dúvidas continuam preenchidas.";
      case "rede":
        return "O envio não foi concluído. Verifique sua conexão e tente novamente. Suas dúvidas continuam preenchidas.";
      case "http":
        return "O envio não foi concluído (" + err.message + "). Tente novamente. Suas dúvidas continuam preenchidas.";
      default:
        return "O envio não foi concluído. Tente novamente. Suas dúvidas continuam preenchidas.";
    }
  }

  function setCarregando(sim) {
    enviando = sim;
    el.submitBtn.disabled = sim;
    el.addBtn.disabled = sim;
    el.submitBtn.classList.toggle("is-loading", sim);
    el.submitBtn.querySelector(".btn-label").textContent = sim ? "Enviando" : "Enviar respostas";
    el.submitBtn.setAttribute("aria-busy", sim ? "true" : "false");
  }

  async function onSubmit(ev) {
    ev.preventDefault();
    if (enviando) return;
    limparErro(null, el.submitError);

    if (estadoJanela(agora()) !== "open") {
      atualizarJanela();
      return;
    }
    if (!validar()) return;

    const payload = montarPayload();
    setCarregando(true);
    try {
      await enviarPayload(payload);   // só retorna se HTTP 200 + ok=true
      idEnvioAtual = null;
      assinaturaPendente = null;
      mostrarConfirmacao();
    } catch (err) {
      console.error("[Mudança de Sede] Envio não concluído:", err && err.tipo, err && err.message);
      mostrarErro(null, el.submitError, mensagemDeErro(err));
      el.submitError.scrollIntoView({ behavior: prefereMenosMovimento() ? "auto" : "smooth", block: "center" });
    } finally {
      setCarregando(false);
    }
  }

  /* ---------------------------------------------------------
     9. CONFIRMAÇÃO E NOVO ENVIO
     --------------------------------------------------------- */
  function mostrarConfirmacao() {
    el.form.hidden = true;
    el.confirmation.hidden = false;
    el.confirmation.focus({ preventScroll: true });
    el.formCard.scrollIntoView({ behavior: prefereMenosMovimento() ? "auto" : "smooth", block: "start" });
  }

  function novoEnvio() {
    resetarDuvidas();             // o nome selecionado é mantido para agilizar o próximo envio
    limparErroDuvidas();
    el.confirmation.hidden = true;
    el.form.hidden = false;
    atualizarJanela();
    const primeira = el.lista.querySelector("textarea");
    if (primeira && !primeira.readOnly) primeira.focus();
  }

  /* ---------------------------------------------------------
     10. JANELA DE TEMPO / CRONÔMETRO
     --------------------------------------------------------- */
  let estadoAtual = null;
  const pad = (n) => String(n).padStart(2, "0");

  function atualizarJanela() {
    const ms = agora();
    const estado = estadoJanela(ms);
    el.timerCard.dataset.state = estado;

    if (simulado) el.testBadgeTime.textContent = isoBrasilia(ms).slice(0, 19).replace("T", " ");

    if (estado === "open") {
      const restante = Math.max(0, Math.floor((CONFIG.fimUTC - ms) / 1000));
      const h = Math.floor(restante / 3600);
      const m = Math.floor((restante % 3600) / 60);
      const s = restante % 60;
      el.cdH.textContent = pad(h);
      el.cdM.textContent = pad(m);
      el.cdS.textContent = pad(s);
      el.cdBoxes.setAttribute("aria-label", "Tempo restante: " + h + " horas, " + m + " minutos e " + s + " segundos");
    }

    if (estado === estadoAtual) return;
    estadoAtual = estado;

    el.countdown.hidden = estado !== "open";

    if (estado === "before") {
      el.timerMessage.textContent = "Formulário disponível em 24/09.";
      bloquearFormulario("Formulário disponível em 24/09.", "");
    } else if (estado === "closed") {
      el.timerMessage.textContent = "Formulário encerrado";
      bloquearFormulario("Formulário encerrado",
        "O prazo para envio das contribuições foi encerrado às 18h00 de 24/09/2026.");
    } else {
      el.timerMessage.textContent = "";
      desbloquearFormulario();
    }
  }

  function bloquearFormulario(titulo, texto) {
    el.formCard.classList.add("is-locked");
    el.closedTitle.textContent = titulo;
    el.closedText.textContent = texto;
    el.closedText.hidden = !texto;
    el.closedNotice.hidden = false;
    el.lider.disabled = true;
    el.addBtn.disabled = true;
    el.submitBtn.disabled = true;
    // readonly (e não disabled) para que o texto já digitado continue legível e copiável
    el.lista.querySelectorAll("textarea").forEach((t) => { t.readOnly = true; });
    el.confirmation.hidden = true;
    el.form.hidden = false;
  }

  function desbloquearFormulario() {
    el.formCard.classList.remove("is-locked");
    el.closedNotice.hidden = true;
    el.lider.disabled = false;
    el.addBtn.disabled = false;
    el.submitBtn.disabled = false;
    el.lista.querySelectorAll("textarea").forEach((t) => { t.readOnly = false; });
  }

  // Após o encerramento, novas dúvidas adicionadas também ficam somente leitura
  const observer = new MutationObserver(() => {
    if (el.formCard.classList.contains("is-locked")) {
      el.lista.querySelectorAll("textarea").forEach((t) => { t.readOnly = true; });
    }
  });

  let intervalo = null;
  function iniciarRelogio() {
    atualizarJanela();
    clearInterval(intervalo);
    // Alinha o tique ao início de cada segundo para a contagem não "pular"
    setTimeout(() => {
      atualizarJanela();
      intervalo = setInterval(atualizarJanela, 1000);
    }, 1000 - (agora() % 1000));
  }

  /* ---------------------------------------------------------
     11. UTILITÁRIOS E INICIALIZAÇÃO
     --------------------------------------------------------- */
  function prefereMenosMovimento() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  async function init() {
    popularLideres();
    resetarDuvidas();
    observer.observe(el.lista, { childList: true });

    el.lider.addEventListener("change", atualizarEmail);
    el.addBtn.addEventListener("click", () => criarDuvida(true));
    el.form.addEventListener("submit", onSubmit);
    el.newSubmission.addEventListener("click", novoEnvio);

    // Evita perda de texto ao fechar a aba sem enviar
    window.addEventListener("beforeunload", (e) => {
      if (temTextoNaoEnviado() && estadoJanela(agora()) === "open") {
        e.preventDefault();
        e.returnValue = "";
      }
    });

    simulado = aplicarSimulacao();
    if (simulado) {
      el.testBadge.hidden = false;
    } else {
      atualizarJanela();           // mostra algo imediatamente com o relógio local
      await sincronizarHorario();  // e corrige com o horário do servidor
    }
    estadoAtual = null;
    iniciarRelogio();

    // Ao voltar para a aba (celular bloqueado, troca de app), ressincroniza
    document.addEventListener("visibilitychange", async () => {
      if (document.visibilityState === "visible") {
        if (!simulado) await sincronizarHorario();
        atualizarJanela();
      }
    });

    // Exposto apenas para diagnóstico/testes no console
    window.__mudancaSede = {
      config: CONFIG,
      lideres: LIDERES,
      fonteHorario: () => fonteHorario,
      agoraBrasilia: () => isoBrasilia(agora())
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
