CREATE DATABASE projetoii_db;
USE projetoii_db;

CREATE TABLE Utilizador (
    user_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    escola_id INT,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    passwordHssh VARCHAR(255) NOT NULL,
    perfil ENUM('ADMIN', 'ALUNO', 'COLABORADOR'),
    dataRegisto DATETIME DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (escola_id) REFERENCES Escola(id)
);

CREATE TABLE Atividade (
    atividade_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    escola_id INT, 
    area_id INT,
    nome VARCHAR(255) NOT NULL,
    descriacao TEXT NOT NULL,
    dataInicio DATE NOT NULL,
    dataFim DATE NOT NULL,
    estado ENUM('CONCLUIDA', 'EM PROGRESSO', 'PENDENTE'),
    FOREIGN kEY (escola_id) REFERENCES Escola(id),
    FOREIGN KEY (area_id) REFERENCES Area(id),
);

CREATE TABLE AreaTematics (
    areaid INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    descriacao TEXT NOT NULL
);
CREATE TABLE Voluntariado (
    sessaoid INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    escolaid INT,
    titulo VARCHAR(255) NOT NULL,
    descriacao TEXT NOT NULL,
    dataHora TIMESTAMP NOT NULL,
    vagas INT NOT NULL,
    FOREIGN KEY (escolaid) REFERENCES Escola(id),
);

CREATE TABLE InscricaoVoluntariado (
    inscricaoid INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    sessaoid INT,
    userid INT,
    presente BOOLEAN NOT NULL,
    FOREIGN KEY (sessaoid) REFERENCES Voluntariado(id),
    FOREIGN KEY (userid) REFERENCES Utilizador(id),
);

CREATE TABLE Escola (
    escolaid INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    morada VARCHAR(255) NOT NULL,
    codigoPostal VARCHAR(255) NOT NULL,
    localidade VARCHAR(255) NOT NULL,
    telefone VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    nivelCertificacao enum('BÁSICO', 'MÉDIO', 'AVANÇADO') NOT NULL
);

CREATE TABLE Reuniao (
    reuniaoid INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    escolaid INT,
    titulo VARCHAR(255) NOT NULL,
    dataHora TIMESTAMP NOT NULL,
    sitio VARCHAR(255) NOT NULL,
    convocatoria VARCHAR(255) NOT NULL,
    FOREIGN KEY (escolaid) REFERENCES Escola(id),
);

CREATE TABLE Ata (
    ataid INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    reuniaoid INT,
    conteudo VARCHAR(255) NOT NULL,
    arquipoPath VARCHAR(255) NOT NULL,
    FOREIGN KEY (reuniaoid) REFERENCES Reuniao(id),
)
