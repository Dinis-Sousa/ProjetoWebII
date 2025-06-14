function gerarRelatorioPDF() {
   const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Relatório Final - Eco-Escolas", 20, 20);

    doc.setFontSize(12);
    doc.text("Atividades Concluídas: " + document.getElementById("atividades-concluidas").textContent, 20, 40);
    doc.text("Fotos Partilhadas: " + document.getElementById("fotos-partilhadas").textContent, 20, 50);
    doc.text("Progresso Geral: " + document.getElementById("progresso-geral").textContent, 20, 60);
    doc.text("Áreas Abrangidas: " + document.getElementById("areas-abrangidas").textContent, 20, 70);

    doc.save("Relatorio_EcoEscolas.pdf");
    }

    window.onload = function() {
      // Configurar o ano atual no footer
      document.getElementById("ano-atual").textContent = new Date().getFullYear();
    };

    const UsersTBody = document.getElementById('UsersTBody');
    const ativitiesTBody = document.getElementById('ativitiesTBody');
    const sessionsTBody = document.getElementById('sessionsTBody');
    addEventListener('DOMContentLoaded', async () => {
      await loadUsers();
      await loadAtivities();
      await loadSessions();
    })

    let loadUsers = async () => {
      const Users = await axios.get('http://localhost:5500/users');
      const array = Users.data
      UsersTBody.innerHTML = '';
      array.forEach(user => {
        let card = `
          <tr>
            <td>${user.user_id}</td>
            <td>${user.nome}</td>
            <td>${user.email}</td>
            <td>${user.perfil}</td>
            <td>
              <button class="btn-editar">Editar</button>
              <button class="btn-apagar" onClick="deleteUser(${user.user_id})">Apagar</button>
            </td>
            </tr>
        `
        UsersTBody.innerHTML += card
    })
  }
  let deleteUser = async (id) => {
    await axios.delete(`http://localhost:5500/users/${id}`)
    alert('User apagado com sucesso!')
    await loadUsers();
  }

  let loadAtivities = async () => {
      let atividades = await axios.get('http://localhost:5500/ativities')
      const array = atividades.data
      console.log(array)
      array.forEach(atividade => {
        let card = `
          <tr>
            <td>${atividade.atividade_id}</td>
            <td>${atividade.nome}</td>
            <td>${atividade.descricao}</td>
            <td>${atividade.area_id}</td>
            <td>${atividade.estado}</td>
            <td>${atividade.dataInicio}</td>
            <td>${atividade.dataFim}</td>
            <td>
              <button class="btn-editar">Editar</button>
              <button class="btn-apagar">Apagar</button>
            </td>
            </tr>
            </tr>
        `
        ativitiesTBody.innerHTML += card
      })
    };
    let loadSessions = async () => {
      let sessoes = await axios.get('http://localhost:5500/sessions')
      const array = sessoes.data
      array.forEach(sessao => {
        console.log(sessao)
        let card = `
          <tr>
            <td>${sessao.sessao_id}</td>
            <td>${sessao.atividade_id}</td>
            <td>${sessao.dataMarcada}</td>
            <td>${sessao.horaMarcada}</td>
            <td>${sessao.Vagas}</td>
            <td>
              <button class="btn-editar">Editar</button>
              <button class="btn-apagar">Apagar</button>
            </td>
            </tr>
        `
        sessionsTBody.innerHTML += card
      })
    };

    window.deleteUser = deleteUser
