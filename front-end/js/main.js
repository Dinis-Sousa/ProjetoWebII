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


function animarContador(contador) {
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

