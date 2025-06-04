document.addEventListener('DOMContentLoaded', () => {
  loadUsers()
})

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

const usersTBody = document.getElementById('usersTBody');

let loadUsers = async () => {
      let Utilizadores = await axios.get('http://localhost:5500/users')
      const array = Utilizadores.data
      console.log(array)
      array.forEach(user => {
        let card = `
          <tr>
            <td>${user.user_id}</td>
            <td>${user.escola_id}</td>
            <td>${user.nome}</td>
            <td>${user.email}</td>
            <td>${user.passwordHash}</td>
            <td>${user.perfil}</td>
            <td>${user.dataRegisto }</td>
            <td>${user.pontos}</td>
            <td>
              <button class="btn-editar">Editar</button>
              <button class="btn-apagar">Apagar</button>
            </td>
            </tr>
        `
        usersTBody.innerHTML += card
      })
    }
