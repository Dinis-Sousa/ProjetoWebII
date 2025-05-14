CREATE DATABASE projetoII_db;
USE projetoII_db;

CREATE TABLE Utilizador (
    user_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    escola_id INT FOREIGN KEY REFERENCES Escola(id),
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    passwordHssh VARCHAR(255) NOT NULL,
    perfil ENUM(),
    dataRegisto TIMESTAMP NOT NULL
);

CREATE TABLE Atividade (
    atividade_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    escola_id INT FOREIGN KEY REFERENCES Escola(id),
    area_id INT FOREIGN KEY REFERENCES Area(id),
    responsevalid INT FOREIGN KEY,
    nome VARCHAR(255) NOT NULL,
    descriacao TEXT NOT NULL,
    dataInicio DATE NOT NULL,
    dataFim DATE NOT NULL,
    estadio ENUM()
);

CREATE TABLE AreaTematics (
    areaid INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    descriacao TEXT NOT NULL
);

CREATE TABLE Documento (
    documentoid INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    atividade_id INT FOREIGN KEY REFERENCES Atividade(id),
    tipo ENUM(),
    caminho VARCHAR(255) NOT NULL,
    dataUpload TIMESTAMP NOT NULL
);

CREATE TABLE Voluntariado (
    sessaoid INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    escolaid INT FOREIGN KEY NOT NULL REFERENCES Escola(id),
    titulo VARCHAR(255) NOT NULL,
    descriacao TEXT NOT NULL,
    dataHora TIMESTAMP NOT NULL,
    vagas INT NOT NULL
);

CREATE TABLE InscricaoVoluntariado (
    inscricaoid INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    sessaoid INT FOREIGN KEY NOT NULL REFERENCES Voluntariado(id),
    userid INT FOREIGN KEY NOT NULL REFERENCES Utilizador(id),
    presente BOOLEAN NOT NULL
);

CREATE TABLE Escola (
    escoladid INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    morada VARCHAR(255) NOT NULL,
    codigoPostal VARCHAR(255) NOT NULL,
    localidade VARCHAR(255) NOT NULL,
    telefone VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    nivelCertificacao enum() NOT NULL,
);

CREATE TABLE Reuniao (
    reuniaoid INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    escolaid INT FOREIGN KEY NOT NULL REFERENCES Escola(id),
    titulo VARCHAR(255) NOT NULL,
    dataHora TIMESTAMP NOT NULL,
    sitio VARCHAR(255) NOT NULL,
    convocatoria VARCHAR(255) NOT NULL
);

CREATE TABLE Ata (
    ataid INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    reuniaoid INT FOREIGN KEY NOT NULL REFERENCES Reuniao(id),
    conteudo VARCHAR(255) NOT NULL,
    arquipoPath VARCHAR(255) NOT NULL,
)
