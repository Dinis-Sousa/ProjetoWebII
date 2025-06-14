addEventListener('DOMContentLoaded', async () => {
    await loadAtivities();
    await loadSessions();
    await loadNumberOfSessions();
})
const ativitiesTBody = document.getElementById('ativitiesTBody');
const sessionsTBody = document.getElementById('sessionsTBody')
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
    const selecionarSessao = document.getElementById('selecionarSessao');

    let loadNumberOfSessions = async () => {
        let sessoes = await axios.get('http://localhost:5500/sessions')
        const array = sessoes.data
        array.forEach(sessao => {
            let row = `
            <option value="${sessao.sessao_id}">${sessao.sessao_id}</option>
            `
            selecionarSessao.innerHTML += row
    })
    }

    selecionarSessao.addEventListener('change', async (e) => {
        const myId = e.target.value
        await loadRegisteredBySession(myId)
    })

    const corpoPresente = document.getElementById('corpoPresente');


    let loadRegisteredBySession = async (id) => {
        const Registrations = await axios.get(`http://localhost:5500/sessions/${id}/users`)
        const array = Registrations.data
        corpoPresente.innerHTML = '';
        if (!array || array.length === 0) return;
            array.forEach(user => {
            let row = `
            <tr>
            <td>${user.nome}</td>
            <td>${user.presenca}</td>
            </tr>
            `
            corpoPresente.innerHTML += row
        })
}

const formAtividade = document.getElementById('formAtividade');
formAtividade.addEventListener('submit', async () => {
    const nomeAtividade = document.getElementById('nomeAtividade').value;
    const descricaoAtividade = document.getElementById('descricaoAtividade').value;
    const areaAtividade = document.getElementById('areaAtividade').value;
    const estadoAtividade = document.getElementById('estadoAtividade').value;
    const dataInicio = document.getElementById('dataInicio').value;
    const dataFIm = document.getElementById('dataFIm').value;

    const areaResponse = await axios.get(`http://localhost:5500/areas/nome/${areaAtividade}`);
    const area_id = areaResponse.data.area_id;

    await axios.post('http://localhost:5500/ativities', {
        nome : nomeAtividade,
        descricao : descricaoAtividade,
        area : area_id,
        estado : estadoAtividade,
        dataInicio : dataInicio,
        dataFIm : dataFIm
    })
    .then(res => {
        console.log('resposta: ', res)
    })
    .catch(err => {
        console.error('Erro ao enviar:', err);
    });
})