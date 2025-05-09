// Configuração da API
const API_BASE_URL = 'http://localhost:3000/api';

// Endpoints da API
const API_ENDPOINTS = {
  // Autenticação
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  
  // Produtos
  PRODUTOS: `${API_BASE_URL}/produtos`,
  PRODUTOS_DESTAQUE: `${API_BASE_URL}/produtos/destaque`,
  PRODUTO_DETALHE: (id) => `${API_BASE_URL}/produtos/${id}`,
  PRODUTOS_PRODUTOR: (produtorId) => `${API_BASE_URL}/produtos/produtor/${produtorId}`,
  
  // Produtores
  PRODUTORES: `${API_BASE_URL}/produtores`,
  PRODUTORES_DESTAQUE: `${API_BASE_URL}/produtores/destaque`,
  PRODUTOR_DETALHE: (id) => `${API_BASE_URL}/produtores/${id}`,
  
  // Carrinho
  CARRINHO: `${API_BASE_URL}/carrinho`,
  CARRINHO_ADICIONAR: `${API_BASE_URL}/carrinho/adicionar`,
  CARRINHO_ATUALIZAR: `${API_BASE_URL}/carrinho/atualizar`,
  CARRINHO_REMOVER: `${API_BASE_URL}/carrinho/remover`,
  
  // Pedidos
  PEDIDOS: `${API_BASE_URL}/pedidos`,
  PEDIDO_DETALHE: (id) => `${API_BASE_URL}/pedidos/${id}`,
  CRIAR_PEDIDO: `${API_BASE_URL}/pedidos/criar`,
};

// Chaves do Local Storage
const STORAGE_KEYS = {
  USUARIO: 'shopdovale_usuario',
  CARRINHO: 'shopdovale_carrinho',
  TOKEN_AUTH: 'shopdovale_token',
};

// Categorias de Produtos
const CATEGORIAS_PRODUTOS = [
  { id: 'frutas', nome: 'Frutas' },
  { id: 'legumes', nome: 'Legumes' },
  { id: 'verduras', nome: 'Verduras' },
  { id: 'organicos', nome: 'Orgânicos' },
  { id: 'processados', nome: 'Processados' },
  { id: 'outros', nome: 'Outros' }
];

// Tipos de Usuário
const TIPOS_USUARIO = {
  COMPRADOR: 'comprador',
  PRODUTOR: 'produtor'
};

// Opções de Entrega
const OPCOES_ENTREGA = {
  ENTREGA: 'entrega',
  RETIRADA: 'retirada'
};

// Custo padrão do frete
const CUSTO_FRETE_PADRAO = 10.00;

// Formatar moeda
function formatarMoeda(valor) {
  return parseFloat(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}