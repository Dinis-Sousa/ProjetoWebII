import jwt_decode from "https://cdn.jsdelivr.net/npm/jwt-decode/build/jwt-decode.esm.js";
document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll('.menu a');
  const currentPage = window.location.pathname.split("/").pop();

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
});


export function animarContador(contador) {
    const alvo = +contador.getAttribute('data-alvo');
    let atual = 0;
    const duracao = 2000;
    const passo = Math.ceil(alvo / (duracao / 20));

    const interval = setInterval(() => {
      atual += passo;
      if (atual >= alvo) {
        contador.innerText = alvo.toLocaleString('pt-PT');
        clearInterval(interval);
      } else {
        contador.innerText = atual.toLocaleString('pt-PT');
      }
    }, 20);
  }

  // Só ativa quando entra na viewport
  const opcoes = {
    threshold: 0.6
  };

  const observer = new IntersectionObserver((entradas, observer) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        animarContador(entrada.target);
        observer.unobserve(entrada.target); // Só anima uma vez
      }
    });
  }, opcoes);

  document.querySelectorAll('.contador').forEach(contador => {
    observer.observe(contador);
});


document.querySelectorAll('.acordeao-titulo').forEach(botao => {
  botao.addEventListener('click', () => {
    const conteudo = botao.nextElementSibling;

    botao.classList.toggle('active');

    if (conteudo.style.maxHeight) {
      conteudo.style.maxHeight = null;
    } else {
      conteudo.style.maxHeight = conteudo.scrollHeight + "px";
    }
  });
});

const myTBody = document.getElementById('ativityTBody')
    const myTBody1 = document.getElementById('sessionTBody')
    document.addEventListener('DOMContentLoaded', async () => {
      await loadAtivities()
      await loadSessions()
    })
    let loadAtivities = async () => {
      let atividades = await axios.get('http://localhost:5500/ativities')
      const array = atividades.data
      array.forEach(atividade => {
        let card = `
          <tr>
            <td>${atividade.nome}</td>
            <td>${atividade.area_id}</td>
            <td>${atividade.descricao}</td>
            <td>${atividade.dataInicio}</td>
            <td>${atividade.dataFim}</td>
            <td>${atividade.estado}</td>
            </tr>
        `
        myTBody.innerHTML += card
      })
    }
    let loadSessions = async () => {
      myTBody1.innerHTML = '';
      let sessoes = await axios.get('http://localhost:5500/sessions')
      const array = sessoes.data
      array.forEach(sessao => {
        let card = `
          <tr>
            <td>${sessao.sessao_id}</td>
            <td>${sessao.nome}</td>
            <td>${sessao.dataMarcada}</td>
            <td>${sessao.horaMarcada}</td>
            <td>${sessao.vagas}</td>
            <td>
            <button class="styleBtn" onclick="registerInSession(${sessao.sessao_id})">Inscrever-me</button>
            <button class="styleBtn" onclick="removeRegister(${sessao.sessao_id})">Remover Inscrição</button>
            </td>
            </tr>
        `
        myTBody1.innerHTML += card
      })
    }

    let registerInSession = async (id) => {
        const token = sessionStorage.getItem('Token');
        const decode = jwt_decode(token);
        const user_id = decode.user_id;
        const theRegistration = await axios.get(`http://localhost:5500/users/${user_id}/sessions/${id}`)
        console.log(theRegistration)
        if (!theRegistration.data || theRegistration.data.length == 0){
          await axios.put(`http://localhost:5500/users/${user_id}/sessions/${id}`)
          .then(async res => {
            await loadSessions()
          })
        } else {
          alert('Já está inscrito nessa sessao!')
        }
    }
    
    let removeRegister = async (id) => {
      const token = sessionStorage.getItem('Token');
      const decode = jwt_decode(token);
      const user_id = decode.user_id;
      const theRegistration = await axios.get(`http://localhost:5500/users/${user_id}/sessions/${id}`)
      if (!theRegistration.data || theRegistration.data.length == 0){
        alert('A sua inscrição não existe!')
      } else {
        await axios.delete(`http://localhost:5500/users/${user_id}/sessions/${id}`)
        .then(async res => {
          await loadSessions()
        })
      }
    }
    
    
        document.getElementById('logOutBtn').addEventListener('click', () => {
          sessionStorage.removeItem('Token');
        })
        
    window.registerInSession = registerInSession
    window.removeRegister = removeRegister


