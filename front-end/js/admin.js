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
    const areasTBody = document.getElementById('areasTBody');
    const atividadesConcluidas = document.getElementById('atividadesConcluidas');
    const rankingAlunos = document.getElementById('rankingAlunos');
    const nivelProjeto = document.getElementById('nivelProjeto');
    addEventListener('DOMContentLoaded', async () => {
      await loadUsers();
      await loadAreas();
      await loadAtivitiesDone();
      await loadRanking();
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
              <button class="btn-apagar" id="${user.user_id}" onClick="deleteUser(${user.user_id})">Apagar</button>
            </td>
            </tr>
        `
        UsersTBody.innerHTML += card
    })
  }
  let deleteUser = async (id) => {
    const token = sessionStorage.getItem('Token');
    await axios.delete(`http://localhost:5500/users/${id}`, {
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    alert('User apagado com sucesso!');
    await loadUsers();
  }

  let loadAreas = async () => {
      let areas = await axios.get('http://localhost:5500/areas')
      const array = areas.data
      areasTBody.innerHTML = '';
      array.forEach(area => {
        let card = `
          <tr>
            <td>${area.area_id}</td>
            <td>${area.nome}</td>
            <td>${area.descricao}</td>
            <td>
              <button class="btn-editar">Editar</button>
              <button class="btn-apagar" id="${area.area_id}" onclick="deleteAreas(${area.area_id})">Apagar</button>
            </td>
            </tr>
            </tr>
        `
        areasTBody.innerHTML += card
      })
    };

    let deleteAreas = async (id) => {
       const token = sessionStorage.getItem('Token');
    await axios.delete(`http://localhost:5500/areas/${id}`, {
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    alert('Area apagado com sucesso!');
    await loadAreas();
    }

    document.getElementById('logOutBtn').addEventListener('click', () => {
          sessionStorage.removeItem('Token');
        })

    let loadAtivitiesDone = async () => {
      const res = await axios.get('http://localhost:5500/ativities')
      const ativities = res.data;
      let count = 0
      ativities.forEach(a => {
        console.log(a.estado)
        if(a.estado == 'CONCLUIDA'){
            count += 1;
        }
      });
      console.log(count)
      atividadesConcluidas.innerHTML = `<span>${count}</span>`
    }

    let loadRanking = async () => {
      const res = await axios.get('http://localhost:5500/users')
      const users = await res.data
      class Participante{
        constructor(nome, number){
          this.nome = nome;
          this.number = number;
        }
      }
      let ranking = [];
      for (const u of users) {
        const sessionRes = await axios.get(`http://localhost:5500/users/${u.user_id}/sessions`);
        const sessions = sessionRes.data;
        let number = sessions.length;
        ranking.push(new Participante(u.nome, number));
      }
    ranking.sort((a, b) => Number(b.number) - Number(a.number));
    console.log(ranking)
    ranking.forEach(u => {
      let row = `<li>${u.nome} - ${u.number}</li>`
      rankingAlunos.innerHTML += row
    })
  }

    window.deleteUser = deleteUser
    window.deleteAreas = deleteAreas
