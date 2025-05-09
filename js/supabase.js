import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Criar cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Funções auxiliares para autenticação
export async function cadastrarUsuario({ email, senha, nome, telefone, tipo, ...dadosAdicionais }) {
  try {
    // Cadastrar usuário na autenticação
    const { data: { user }, error: authError } = await supabase.auth.signUp({
      email,
      password: senha
    });

    if (authError) throw authError;

    // Criar perfil do usuário
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        user_id: user.id,
        name: nome,
        phone: telefone,
        type: tipo
      })
      .select()
      .single();

    if (profileError) throw profileError;

    // Se for produtor, criar registro de produtor
    if (tipo === TIPOS_USUARIO.PRODUTOR) {
      const { error: producerError } = await supabase
        .from('producers')
        .insert({
          profile_id: profile.id,
          business_name: dadosAdicionais.nomeNegocio,
          description: dadosAdicionais.descricaoNegocio,
          address: dadosAdicionais.endereco,
          delivery_available: dadosAdicionais.opcoesEntrega.includes(OPCOES_ENTREGA.ENTREGA),
          pickup_available: dadosAdicionais.opcoesEntrega.includes(OPCOES_ENTREGA.RETIRADA)
        });

      if (producerError) throw producerError;
    }

    return { user, profile };
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    throw error;
  }
}

export async function fazerLogin({ email, senha }) {
  try {
    const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password: senha
    });

    if (authError) throw authError;

    // Buscar perfil do usuário
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select(`
        *,
        producers (*)
      `)
      .eq('user_id', user.id)
      .single();

    if (profileError) throw profileError;

    return { user, profile };
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }
}

export async function fazerLogout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// Funções para gerenciamento de produtos
export async function buscarProdutos() {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (name),
      producers (
        *,
        profiles (name)
      )
    `)
    .eq('active', true);

  if (error) throw error;
  return data;
}

export async function buscarProdutosProdutor(produtorId) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (name)
    `)
    .eq('producer_id', produtorId);

  if (error) throw error;
  return data;
}

export async function adicionarProduto(dadosProduto) {
  const { data, error } = await supabase
    .from('products')
    .insert(dadosProduto)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function atualizarProduto(id, dadosProduto) {
  const { data, error } = await supabase
    .from('products')
    .update(dadosProduto)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function excluirProduto(id) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
}