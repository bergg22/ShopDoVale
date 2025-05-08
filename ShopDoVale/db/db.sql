-- Criação do Banco de Dados
CREATE DATABASE IF NOT EXISTS shopdovale;
USE shopdovale;

-- Tabela de usuários (informações comuns a compradores e produtores)
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    tipo ENUM('comprador', 'produtor') NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de compradores (específica para compradores)
CREATE TABLE compradores (
    id INT PRIMARY KEY,
    endereco_entrega TEXT,
    FOREIGN KEY (id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabela de produtores (específica para produtores)
CREATE TABLE produtores (
    id INT PRIMARY KEY,
    nome_negocio VARCHAR(100) NOT NULL,
    descricao TEXT,
    endereco TEXT NOT NULL,
    entrega_disponivel BOOLEAN DEFAULT FALSE,
    retirada_disponivel BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabela de categorias de produtos
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    descricao TEXT
);

-- Tabela de produtos
CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    estoque INT NOT NULL DEFAULT 0,
    imagem VARCHAR(255),
    categoria_id INT,
    produtor_id INT NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id),
    FOREIGN KEY (produtor_id) REFERENCES produtores(id) ON DELETE CASCADE
);

-- Tabela de carrinho
CREATE TABLE carrinho (
    id INT AUTO_INCREMENT PRIMARY KEY,
    comprador_id INT NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (comprador_id) REFERENCES compradores(id) ON DELETE CASCADE
);

-- Tabela de itens do carrinho
CREATE TABLE itens_carrinho (
    id INT AUTO_INCREMENT PRIMARY KEY,
    carrinho_id INT NOT NULL,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL DEFAULT 1,
    preco_unitario DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (carrinho_id) REFERENCES carrinho(id) ON DELETE CASCADE,
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

-- Tabela de pedidos
CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    comprador_id INT NOT NULL,
    tipo_entrega ENUM('entrega', 'retirada') NOT NULL,
    endereco_entrega TEXT,
    valor_produtos DECIMAL(10,2) NOT NULL,
    valor_frete DECIMAL(10,2) DEFAULT 0,
    valor_total DECIMAL(10,2) NOT NULL,
    status ENUM('pendente', 'confirmado', 'em_preparo', 'em_transito', 'entregue', 'cancelado') DEFAULT 'pendente',
    data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (comprador_id) REFERENCES compradores(id) ON DELETE CASCADE
);

-- Tabela de itens do pedido
CREATE TABLE itens_pedido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    produto_id INT NOT NULL,
    produtor_id INT NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (produto_id) REFERENCES produtos(id),
    FOREIGN KEY (produtor_id) REFERENCES produtores(id)
);

-- Tabela de logs para registrar alterações (para o trigger)
CREATE TABLE logs_alteracoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tabela VARCHAR(50) NOT NULL,
    operacao ENUM('inserção', 'atualização', 'exclusão') NOT NULL,
    registro_id INT NOT NULL,
    dados_antigos TEXT,
    dados_novos TEXT,
    usuario_id INT,
    data_alteracao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger para registrar alterações nos produtos
DELIMITER //
CREATE TRIGGER trigger_produtos_alteracoes
AFTER UPDATE ON produtos
FOR EACH ROW
BEGIN
    INSERT INTO logs_alteracoes (tabela, operacao, registro_id, dados_antigos, dados_novos, usuario_id)
    VALUES (
        'produtos',
        'atualização',
        NEW.id,
        CONCAT('{"nome":"', OLD.nome, '", "preco":', OLD.preco, ', "estoque":', OLD.estoque, ', "ativo":', OLD.ativo, '}'),
        CONCAT('{"nome":"', NEW.nome, '", "preco":', NEW.preco, ', "estoque":', NEW.estoque, ', "ativo":', NEW.ativo, '}'),
        NEW.produtor_id
    );
END//
DELIMITER ;

-- Índices para otimização de consultas
CREATE INDEX idx_produtos_categoria ON produtos(categoria_id);
CREATE INDEX idx_produtos_produtor ON produtos(produtor_id);
CREATE INDEX idx_produtos_ativo ON produtos(ativo);
CREATE INDEX idx_pedidos_comprador ON pedidos(comprador_id);
CREATE INDEX idx_pedidos_status ON pedidos(status);
CREATE INDEX idx_itens_pedido_pedido ON itens_pedido(pedido_id);
CREATE INDEX idx_itens_pedido_produtor ON itens_pedido(produtor_id);

-- Inserção de categorias padrão
INSERT INTO categorias (nome, descricao) VALUES
('Frutas', 'Frutas frescas de produtores locais'),
('Legumes', 'Legumes frescos de produtores locais'),
('Verduras', 'Verduras frescas de produtores locais'),
('Orgânicos', 'Produtos orgânicos certificados'),
('Processados', 'Produtos processados artesanalmente'),
('Outros', 'Outros produtos locais');