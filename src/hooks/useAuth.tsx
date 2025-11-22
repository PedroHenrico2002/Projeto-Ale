/**
 * Hook de Autenticação
 * 
 * Gerencia o estado de autenticação do usuário usando Supabase Auth.
 * Fornece acesso ao usuário atual, sessão e função de logout.
 */

// Importa as dependências necessárias
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// ===== INTERFACE DO CONTEXTO =====

/**
 * Define a estrutura do contexto de autenticação
 */
interface AuthContextType {
  user: User | null;            // Dados do usuário autenticado ou null
  session: Session | null;      // Sessão ativa ou null
  loading: boolean;             // Indica se está verificando autenticação
  signOut: () => Promise<void>; // Função para fazer logout
}

// Cria o contexto de autenticação (inicialmente undefined)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ===== PROVIDER DE AUTENTICAÇÃO =====

/**
 * Componente Provider que envolve a aplicação e fornece o contexto de autenticação
 * @param children - Componentes filhos que terão acesso ao contexto
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Estado que armazena os dados do usuário autenticado
  const [user, setUser] = useState<User | null>(null);
  
  // Estado que armazena a sessão ativa do usuário
  const [session, setSession] = useState<Session | null>(null);
  
  // Estado que indica se está carregando os dados de autenticação
  const [loading, setLoading] = useState(true);

  // ===== EFEITO: CONFIGURAR LISTENER DE AUTENTICAÇÃO =====
  
  /**
   * Efeito executado uma vez na montagem do componente
   * Configura o listener para mudanças no estado de autenticação
   * e verifica se já existe uma sessão ativa
   */
  useEffect(() => {
    // Configura listener para mudanças no estado de autenticação
    // Este listener é chamado sempre que o usuário faz login, logout, etc.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Atualiza o estado da sessão
        setSession(session);
        
        // Atualiza o estado do usuário (extrai de session ou define como null)
        setUser(session?.user ?? null);
        
        // Marca o carregamento como concluído
        setLoading(false);
      }
    );

    // Verifica se já existe uma sessão ativa ao carregar a aplicação
    supabase.auth.getSession().then(({ data: { session } }) => {
      // Atualiza o estado da sessão
      setSession(session);
      
      // Atualiza o estado do usuário
      setUser(session?.user ?? null);
      
      // Marca o carregamento como concluído
      setLoading(false);
    });

    // Função de limpeza: remove o listener quando o componente é desmontado
    return () => subscription.unsubscribe();
  }, []); // Array vazio = executa apenas uma vez na montagem

  // ===== FUNÇÃO: FAZER LOGOUT =====
  
  /**
   * Função assíncrona para fazer logout do usuário
   * Remove a sessão ativa e limpa os dados do usuário
   */
  const signOut = async () => {
    // Chama a função de logout do Supabase
    await supabase.auth.signOut();
    
    // Nota: O listener configurado acima irá automaticamente
    // atualizar os estados user e session para null
  };

  // ===== VALOR DO CONTEXTO =====
  
  // Objeto com todos os valores e funções que serão disponibilizados
  const value = {
    user,       // Dados do usuário autenticado
    session,    // Sessão ativa
    loading,    // Estado de carregamento
    signOut,    // Função de logout
  };

  // ===== RENDERIZAÇÃO DO PROVIDER =====
  
  // Retorna o Provider com o contexto disponível para todos os filhos
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ===== HOOK CUSTOMIZADO =====

/**
 * Hook customizado para acessar o contexto de autenticação
 * Lança erro se usado fora do AuthProvider
 * @returns Contexto de autenticação com user, session, loading e signOut
 */
export const useAuth = () => {
  // Obtém o contexto atual
  const context = useContext(AuthContext);
  
  // Verifica se o hook está sendo usado dentro do provider
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  // Retorna o contexto válido
  return context;
};
