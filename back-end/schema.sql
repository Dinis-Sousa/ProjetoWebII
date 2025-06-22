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

CREATE TABLE AreaTematics (
    area_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL
);

CREATE TABLE Utilizador (
    user_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    escola_id INT,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    passwordHash VARCHAR(255) NOT NULL,
    perfil ENUM('ADMIN', 'ALUNO', 'COORDENADOR') DEFAULT 'ALUNO',
    dataRegisto DATETIME DEFAULT CURRENT_TIMESTAMP,
    pontos INT DEFAULT 0,
    FOREIGN KEY (escola_id) REFERENCES Escola(escola_id) ON DELETE Cascade
);

CREATE TABLE Atividade (
    atividade_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, 
    area_id INT,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    dataInicio DATE NOT NULL,
    dataFim DATE NOT NULL,
    estado ENUM('CONCLUIDA', 'EM PROGRESSO', 'PENDENTE') DEFAULT 'PENDENTE',
    FOREIGN KEY (area_id) REFERENCES AreaTematics(area_id) ON DELETE Cascade
);

CREATE TABLE Sessao (
    sessao_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    atividade_id INT,
    dataMarcada DATE NOT NULL,
    horaMarcada TIME NOT NULL,
    vagas INT NOT NULL,
    FOREIGN KEY (atividade_id) REFERENCES Atividade(atividade_id) ON DELETE Cascade
);

CREATE TABLE InscricaoVoluntariado (
    sessao_id INT NOT NULL,
    user_id INT NOT NULL,
    presenca BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (sessao_id, user_id),
    FOREIGN KEY (sessao_id) REFERENCES Sessao(sessao_id) ON DELETE Cascade,
    FOREIGN KEY (user_id) REFERENCES Utilizador(user_id) ON DELETE Cascade
);

INSERT INTO Escola(nome, morada, codigoPostal, localidade, telefone, email, nivelCertificacao)
VALUES('Escola Superior de Media Artes e Design', 'Rua Dom Sancho 981', '4480-876', 'Vila do Conde', '252 291 700', 'geral@esmad.ipp.pt', 'AVANÇADO');

INSERT INTO Escola(nome, morada, codigoPostal, localidade, telefone, email, nivelCertificacao)
VALUES('Instituto Politécnico da Maia', 'Avenida Carlos de Oliveira Campos', '4475-690', 'Maia', '22 986 6026', 'info@umaia.pt', 'Médio');

INSERT INTO Escola(nome, morada, codigoPostal, localidade, telefone, email, nivelCertificacao)
VALUES('Faculdade de Ciências da Universidade do Porto', 'Rua do Campo Alegre', '4169-007', 'Porto', '22 040 2000', 'apoio.estudante@fc.up.pt', 'BÁSICO');

INSERT INTO AreaTematics(nome, descricao)
VALUES('AMBIENTE', 'Tipo de atividade que evitam que o ambiente piore');

INSERT INTO AreaTematics(nome, descricao)
VALUES('Limpeza', 'Tipo de atividade que limpem zonas');

INSERT INTO Utilizador(escola_id, nome, email, passwordHash, perfil)
VALUES(1, 'Admin', 'admin@gmail.com', 'Esmad', 'ADMIN');

INSERT INTO Utilizador(escola_id, nome, email, passwordHash, perfil)
VALUES(1, 'User', 'user@gmail.com', 'Esmad', 'ALUNO');

INSERT INTO Utilizador(escola_id, nome, email, passwordHash, perfil)
VALUES(2, 'chico', 'chico@gmail.com', 'chico123', 'COORDENADOR');

INSERT INTO Atividade(area_id, nome, descricao, dataInicio, dataFim, estado)
VALUES(1, 'Limpar a escola', 'Limpar o lixo da faculdade', '2025-08-26', '2025-12-27', 'PENDENTE');

INSERT INTO Atividade(area_id, nome, descricao, dataInicio, dataFim, estado)
VALUES(2, 'Limpar o pátio', 'Limpar o lixo da pátio da faculdade', '2025-07-26', '2025-11-30', 'CONCLUIDA');

INSERT INTO Sessao(atividade_id, dataMarcada, horaMarcada, vagas)
VALUES(1, '2025-05-27', '14:00:00', 100);

INSERT INTO Sessao(atividade_id, dataMarcada, horaMarcada, vagas)
VALUES(1, '2025-05-27', '16:00:00', 50);

INSERT INTO Sessao(atividade_id, dataMarcada, horaMarcada, vagas)
VALUES(2, '2025-06-10', '10:00:00', 200);
