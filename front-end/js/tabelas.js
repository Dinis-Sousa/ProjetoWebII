
document.addEventListener("DOMContentLoaded", () => {
  const atividades = [
    { id: 1, nome: "Limpeza da Praia", descricao: "Recolha de lixo", area: "Ambiental", estado: "PENDENTE", inicio: "2025-06-01", fim: "2025-06-10" },
    { id: 2, nome: "Palestra Nutrição", descricao: "Educação alimentar", area: "Saúde", estado: "EM PROGRESSO", inicio: "2025-06-05", fim: "2025-06-15" }
  ];

  const sessoes = [
    { id: 1, atividadeId: 1, data: "2025-06-03", hora: "10:00", vagas: 20 },
    { id: 2, atividadeId: 2, data: "2025-06-06", hora: "14:30", vagas: 15 },
    { id: 3, atividadeId: 3, data: "2025-06-06", hora: "11:30", vagas: 25 },
    { id: 4, atividadeId: 4, data: "2025-06-06", hora: "16:30", vagas: 10 }
  ];

  const tabelaAtividades = document.getElementById("tabela-atividades");
  atividades.forEach((atividade) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${atividade.id}</td>
      <td>${atividade.nome}</td>
      <td>${atividade.descricao}</td>
      <td>${atividade.area}</td>
      <td>${atividade.estado}</td>
      <td>${atividade.inicio}</td>
      <td>${atividade.fim}</td>
      <td>
        <button class="btn-editar">Editar</button>
        <button class="btn-apagar">Apagar</button>
      </td>
    `;
    tabelaAtividades.appendChild(row);
  });

  const tabelaSessoes = document.getElementById("tabela-sessoes");
  sessoes.forEach((sessao) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${sessao.id}</td>
      <td>${sessao.atividadeId}</td>
      <td>${sessao.data}</td>
      <td>${sessao.hora}</td>
      <td>${sessao.vagas}</td>
      <td>
        <button class="btn-editar">Editar</button>
        <button class="btn-apagar">Apagar</button>
      </td>
    `;
    tabelaSessoes.appendChild(row);
  });
});

//SImulação da tabvela

document.addEventListener("DOMContentLoaded", () => {
  const sessoes = [
    { id: 1, nome: "Sessão 1 - Limpeza da Praia" },
    { id: 2, nome: "Sessão 2 - Palestra Nutrição" },
    { id: 3, nome: "Sessão 3 - Visita ao Parque" }
  ];

  const utilizadores = [
    { id: 101, nome: "Ana Ribeiro" },
    { id: 102, nome: "Bruno Costa" },
    { id: 103, nome: "Carla Dias" }
  ];

  const seletorSessao = document.getElementById("selecionar-sessao");
  const corpoTabela = document.getElementById("corpo-presencas");

  sessoes.forEach(sessao => {
    const option = document.createElement("option");
    option.value = sessao.id;
    option.textContent = sessao.nome;
    seletorSessao.appendChild(option);
  });

  document.getElementById("guardar-presencas").addEventListener("click", () => {
    const sessaoId = seletorSessao.value;
    const presencas = [];

    utilizadores.forEach(user => {
      const checkbox = document.querySelector(`#presenca_${user.id}`);
      presencas.push({
        utilizadorId: user.id,
        presente: checkbox.checked
      });
    });

    console.log(`Presenças para Sessão ${sessaoId}:`, presencas);
    alert("Presenças guardadas com sucesso!");
  });

  function atualizarTabela() {
    corpoTabela.innerHTML = "";

    utilizadores.forEach(user => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.nome}</td>
        <td><input type="checkbox" id="presenca_${user.id}"></td>
      `;
      corpoTabela.appendChild(row);
    });
  }

  seletorSessao.addEventListener("change", atualizarTabela);

  atualizarTabela();
});
