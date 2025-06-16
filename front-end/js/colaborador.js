addEventListener('DOMContentLoaded', async () => {
    await loadAtivities();
    await loadSessions();
    await loadNumberOfSessions();
    await loadRegisteredBySession(3)
})
const ativitiesTBody = document.getElementById('ativitiesTBody');
const sessionsTBody = document.getElementById('sessionsTBody')
let loadAtivities = async () => {
      ativitiesTBody.innerHTML = '';
      let atividades = await axios.get('http://localhost:5500/ativities')
      const array = atividades.data
      array.forEach(atividade => {
        const id = atividade.atividade_id
        let card = `
          <tr>
            <td>${id}</td>
            <td>${atividade.nome}</td>
            <td>${atividade.descricao}</td>
            <td>${atividade.area_id}</td>
            <td>${atividade.dataInicio}</td>
            <td>${atividade.dataFim}</td>
            <td>${atividade.estado}</td>
            <td>
              <button class="btn-editar">Editar</button>
              <button class="btn-apagar" onclick="deleteAtivities(${id})">Apagar</button>
            </td>
            </tr>
            </tr>
        `
        ativitiesTBody.innerHTML += card
      })
    };
    let deleteAtivities = async (id) => {
      const token = sessionStorage.getItem('Token');
      await axios.delete(`http://localhost:5500/ativities/${id}`,{
        headers : {
          authorization : `Bearer ${token}`
        }
      })
      await loadAtivities(); 
    }
    let loadSessions = async () => {
      sessionsTBody.innerHTML = '';
      let sessoes = await axios.get('http://localhost:5500/sessions')
      const array = sessoes.data
      array.forEach(sessao => {
        const id = sessao.sessao_id
        let card = `
          <tr>
            <td>${id}</td>
            <td>${sessao.nome}</td>
            <td>${sessao.dataMarcada}</td>
            <td>${sessao.horaMarcada}</td>
            <td>${sessao.vagas}</td>
            <td>
              <button class="btn-editar">Editar</button>
              <button class="btn-apagar" onclick="deleteSession(${id})">Apagar</button>
            </td>
            </tr>
        `
        sessionsTBody.innerHTML += card
      })
      await loadNumberOfSessions();
    };

    let deleteSession = async (id) => {
      const token = sessionStorage.getItem('Token');
      await axios.delete(`http://localhost:5500/sessions/${id}`,{
        headers : {
          authorization : `Bearer ${token}`
        }
      })
      .then(async res => {
        await loadSessions();
      })
    }
    const selecionarSessao = document.getElementById('selecionarSessao');
    selecionarSessao.value = 1;
    let loadNumberOfSessions = async () => {
      selecionarSessao.innerHTML = '';
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
        if(id == 1){
          const Registrations = await axios.get(`http://localhost:5500/sessions/${1}/users`)
        const array = Registrations.data
        corpoPresente.innerHTML = '';
        if (!array || array.length === 0) return;
            array.forEach(user => {
            let row = `
            <tr>
            <td>${user.nome}</td>
            <td>
              <label class="circle-radio">
                <input type="checkbox" class="checkboxes" data-user-id="${user.user_id}" data-session-id="${id}">
                <span class="custom-circle">presente</span>
              </label>
            </td>
            </tr>
            `
            corpoPresente.innerHTML += row
        })
        } else {
          const Registrations = await axios.get(`http://localhost:5500/sessions/${id}/users`)
          const array = Registrations.data
          corpoPresente.innerHTML = '';
          if (!array || array.length === 0) return;
              array.forEach(user => {
              let row = `
              <tr>
              <td>${user.nome}</td>
              <td>
                <label class="circle-radio">
                  <input type="checkbox" class="checkboxes" data-user-id="${user.user_id}" data-session-id="${id}">
                  <span class="custom-circle">presente</span>
                </label>
              </td>
              </tr>
              `
              corpoPresente.innerHTML += row
          })
        }
}

guardarPresencas.addEventListener('click', async () => {
  markPresence()
})

let markPresence = () => {
  const checkboxes = document.querySelectorAll('.checkboxes');

  checkboxes.forEach(async checkbox => {
    const user_id = checkbox.dataset.userId;
    const session_id = checkbox.dataset.sessionId;
    const presenca = checkbox.checked;
    let array = await axios.get(`http://localhost:5500/users/${user_id}/sessions/${session_id}`)
    let previewsPresencaValue = array.data.presenca
    if(presenca != previewsPresencaValue){
      await axios.patch(`http://localhost:5500/users/${user_id}/sessions/${session_id}`)
    } else {
      return
    }
});
}

const formAtividade = document.getElementById('formAtividade');
formAtividade.addEventListener('submit', async (e) => {
  e.preventDefault()

    class Atividade{
      constructor(nome, descricao, area_id, dataInicio, dataFim, estado){
        this.nome = nome
        this.descricao = descricao
        this.area_id = area_id
        this.dataInicio = dataInicio
        this.dataFim = dataFim
        this.estado = estado
      }
    }
    const nomeAtividade = document.getElementById('nomeAtividade').value;
    const descricaoAtividade = document.getElementById('descricaoAtividade').value;
    const areaAtividade = document.getElementById('areaAtividade').value;
    const estadoAtividade = document.getElementById('estadoAtividade').value;
    const dataInicio = document.getElementById('dataInicio').value;
    const dataFIm = document.getElementById('dataFim').value;

    try {
    const areaResponse = await axios.get(`http://localhost:5500/areas/nome/${areaAtividade}`);
    const area_id = areaResponse.data.area_id;
    console.log(area_id)

    const newAtivity = new Atividade(nomeAtividade, descricaoAtividade, area_id, dataInicio, dataFIm, estadoAtividade)
    console.log(newAtivity)

    await axios.post('http://localhost:5500/ativities', newAtivity)
    .then(async res => {
      await loadAtivities()
    })
  } catch (err){
    console.log(err)
  }
})

const formSessao = document.getElementById('formSessao');
formSessao.addEventListener('submit', async () => {
  const atividade_id = document.getElementById('atividadeId').value;
  const dataMarcada = document.getElementById('dataMarcada').value;
  const horaMarcada = document.getElementById('horaMarcada').value;
  const vagas = document.getElementById('vagas').value;

  const newObj = {atividade_id, dataMarcada, horaMarcada, vagas}

  try{
      await axios.post('http://localhost:5500/sessions', newObj)
      .then(async res => {
        await loadSessions()
      })
  } catch (err){
    next(Err)
  }
})
document.getElementById('logOutBtn').addEventListener('click', () => {
          sessionStorage.removeItem('Token');
})
