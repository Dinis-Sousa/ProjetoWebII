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
