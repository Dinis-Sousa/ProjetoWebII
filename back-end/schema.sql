CREATE DATABASE projetoii_db;
USE projetoii_db;

CREATE TABLE Escola (
    escola_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    morada VARCHAR(255) NOT NULL,
    codigoPostal VARCHAR(255) NOT NULL,
    localidade VARCHAR(255) NOT NULL,
    telefone VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    nivelCertificacao ENUM('BÁSICO', 'MÉDIO', 'AVANÇADO') NOT NULL
);

CREATE TABLE AreaTematica (
    area_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    descriacao TEXT NOT NULL
);

CREATE TABLE Utilizador (
    user_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    escola_id INT,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    passwordHash VARCHAR(255) NOT NULL,
    perfil ENUM('ADMIN', 'ALUNO', 'COLABORADOR'),
    dataRegisto DATETIME DEFAULT CURRENT_TIMESTAMP,
    pontos INT NOT NULL,
    FOREIGN KEY (escola_id) REFERENCES Escola(escola_id)
);

CREATE TABLE Atividade (
    atividade_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, 
    area_id INT,
    nome VARCHAR(255) NOT NULL,
    descriacao TEXT NOT NULL,
    dataInicio DATE NOT NULL,
    dataFim DATE NOT NULL,
    estado ENUM('CONCLUIDA', 'EM PROGRESSO', 'PENDENTE'),
    FOREIGN KEY (area_id) REFERENCES AreaTematica(area_id)
);

CREATE TABLE Sessao (
    sessao_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    atividade_id INT,
    dataMarcada DATE NOT NULL,
    horaMarcada TIME NOT NULL,
    vagas INT NOT NULL,
    FOREIGN KEY (atividade_id) REFERENCES Atividade(atividade_id)
);

CREATE TABLE InscricaoVoluntariado (
    sessao_id INT NOT NULL,
    user_id INT NOT NULL,
    presença BOOLEAN NOT NULL,
    PRIMARY KEY (sessao_id, user_id),
    FOREIGN KEY (sessao_id) REFERENCES Sessao(sessao_id),
    FOREIGN KEY (user_id) REFERENCES Utilizador(user_id)
);

CREATE TABLE AdesaoAtividade (
    atividade_id INT NOT NULL,
    escola_id INT NOT NULL,
    aderiu BOOLEAN NOT NULL,
    PRIMARY KEY (atividade_id, escola_id),
    FOREIGN KEY (atividade_id) REFERENCES Atividade(atividade_id),
    FOREIGN KEY (escola_id) REFERENCES Escola(escola_id)
);

CREATE TABLE Conquistas (
    conquista_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    pontosN INT NOT NULL,
    badge INT NOT NULL
);

CREATE TABLE ConUser (
    user_id INT NOT NULL,
    conquista_id INT NOT NULL,
    estado BOOLEAN NOT NULL,
    PRIMARY KEY (user_id, conquista_id),
    FOREIGN KEY (user_id) REFERENCES Utilizador(user_id),
    FOREIGN KEY (conquista_id) REFERENCES Conquistas(conquista_id)
);
