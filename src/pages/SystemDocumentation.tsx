
import React from 'react';
import { Layout } from '@/components/Layout';
import { SystemArchitecture } from '@/components/SystemArchitecture';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import { exportToWord } from '@/utils/documentExport';
import { useToast } from '@/components/ui/use-toast';

// Componente principal da página de documentação do sistema
const SystemDocumentation: React.FC = () => {
  // Hook para exibir notificações toast
  const { toast } = useToast();

  // Função para exportar a documentação para arquivo Word
  const handleExport = async () => {
    try {
      // Gera e faz download do documento Word
      await exportToWord();
      // Exibe notificação de sucesso
      toast({
        title: "Documento exportado com sucesso!",
        description: "O arquivo foi salvo em sua pasta de downloads.",
        variant: "default",
      });
    } catch (error) {
      // Log do erro no console para debugging
      console.error('Error exporting document:', error);
      // Exibe notificação de erro
      toast({
        title: "Erro ao exportar o documento",
        description: "Ocorreu um erro ao gerar o arquivo. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      {/* Container principal da página com espaçamento */}
      <div className="min-h-screen pt-20 pb-16">
        <div className="page-container">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Card principal da documentação */}
            <section className="bg-card shadow-md rounded-lg p-6">
              {/* Cabeçalho com título e botão de exportação */}
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-foreground">Documentação do Sistema - Be Legendary</h1>
                <Button 
                  onClick={handleExport} 
                  className="bg-primary hover:bg-primary/90"
                >
                  <FileDown size={18} className="mr-2" />
                  Exportar para Word
                </Button>
              </div>
              
              <div className="space-y-8">
                {/* Seção: Escopo do Projeto */}
                <div>
                  <h2 className="text-xl font-semibold mb-2 text-foreground">Escopo do Projeto</h2>
                  <p className="text-muted-foreground">O objetivo deste projeto é desenvolver uma plataforma de delivery de comida que permite aos usuários navegar por restaurantes, selecionar itens do cardápio, fazer pedidos online e acompanhar a entrega em tempo real.</p>
                </div>
                
                {/* Seção: Sumário das Funcionalidades */}
                <div>
                  <h2 className="text-xl font-semibold mb-2 text-foreground">Sumário</h2>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Sistema de autenticação de usuários com múltiplas opções de login (Email/Senha e Google)</li>
                    <li>Catálogo de restaurantes com categorização</li>
                    <li>Sistema de pedidos com acompanhamento em tempo real</li>
                    <li>Gerenciamento de endereços de entrega</li>
                    <li>Histórico de pedidos para usuários autenticados</li>
                    <li>Integração com serviços de pagamento</li>
                  </ul>
                </div>

                {/* Seção: Componentes de Software e Ferramentas */}
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-foreground">Componentes de Software, Ferramentas e Integrações</h2>
                  
                  {/* Tabela de Componentes Frontend */}
                  <h3 className="text-lg font-medium mb-2 text-foreground">Frontend</h3>
                  <div className="overflow-x-auto border rounded-lg mb-4">
                    <table className="min-w-full divide-y divide-border">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Componente</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Versão</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Descrição</th>
                        </tr>
                      </thead>
                      <tbody className="bg-card divide-y divide-border">
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-foreground">React</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">^18.3.1</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">Biblioteca para construção de interfaces de usuário</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-foreground">Vite</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">^5.x</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">Ferramenta de build e desenvolvimento rápido</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-foreground">TypeScript</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">^5.x</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">Superset tipado de JavaScript</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-foreground">Tailwind CSS</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">^3.x</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">Framework CSS utilitário para estilização</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-foreground">React Router DOM</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">^6.26.2</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">Roteamento e navegação entre páginas</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-foreground">TanStack Query</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">^5.56.2</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">Gerenciamento de estado e cache de dados</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-foreground">React Hook Form</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">^7.53.0</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">Gerenciamento de formulários</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-foreground">Zod</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">^3.23.8</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">Validação de schemas e tipos</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-foreground">Lucide React</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">^0.462.0</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">Biblioteca de ícones</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-foreground">Radix UI</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">^1.x - ^2.x</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">Componentes UI acessíveis e customizáveis</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-foreground">date-fns</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">^3.6.0</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">Manipulação de datas</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-foreground">Recharts</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">^2.12.7</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">Biblioteca de gráficos</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Tabela de Backend e Integrações */}
                  <h3 className="text-lg font-medium mb-2 text-foreground">Backend e Integrações</h3>
                  <div className="overflow-x-auto border rounded-lg mb-4">
                    <table className="min-w-full divide-y divide-border">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Serviço/Integração</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Versão</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Descrição</th>
                        </tr>
                      </thead>
                      <tbody className="bg-card divide-y divide-border">
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-foreground">Supabase JS</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">^2.57.4</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">Cliente para banco de dados PostgreSQL e autenticação</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-foreground">Supabase Auth</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">Integrado</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">Sistema de autenticação (Email/Senha, Google OAuth)</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-foreground">Supabase Storage</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">Integrado</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">Armazenamento de arquivos e imagens</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-foreground">Supabase Edge Functions</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">Deno Runtime</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">Funções serverless para lógica de backend</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-foreground">Google OAuth 2.0</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">v2</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">Autenticação social com conta Google</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-foreground">Resend</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">API v1</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">Serviço de envio de emails transacionais</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Tabela de Sistema Operacional e Ambiente */}
                  <h3 className="text-lg font-medium mb-2 text-foreground">Sistema Operacional e Ambiente</h3>
                  <div className="overflow-x-auto border rounded-lg">
                    <table className="min-w-full divide-y divide-border">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Componente</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Versão/Requisito</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Descrição</th>
                        </tr>
                      </thead>
                      <tbody className="bg-card divide-y divide-border">
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-foreground">Node.js</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">≥18.x LTS</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">Runtime JavaScript para desenvolvimento</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-foreground">Navegadores Suportados</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">Chrome 90+, Firefox 88+, Safari 14+, Edge 90+</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">Navegadores modernos com suporte a ES2020+</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-foreground">Sistema Operacional</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">Windows 10+, macOS 10.15+, Linux (Ubuntu 20.04+)</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">Sistemas operacionais compatíveis para desenvolvimento</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-foreground">Hospedagem</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">Lovable Cloud</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">Plataforma de hospedagem e deploy automático</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-foreground">Banco de Dados</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">PostgreSQL 15.x (Supabase)</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">Banco de dados relacional gerenciado</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Arquitetura do Sistema */}
                <SystemArchitecture />
                
                {/* Seção: Requisitos e Funcionalidades */}
                <div>
                  <h2 className="text-xl font-semibold mb-2 text-foreground">Requisitos/Funcionalidades</h2>
                  
                  <div className="space-y-6 mt-4">
                    {/* Funcionalidade: Autenticação de Usuário */}
                    <div className="border-l-4 border-primary pl-4">
                      <h3 className="font-medium mb-2 text-foreground">Autenticação de Usuário</h3>
                      
                      {/* Regras da Funcionalidade */}
                      <div className="mb-3">
                        <h4 className="text-sm font-semibold text-foreground">Regras da Funcionalidade:</h4>
                        <ul className="list-disc pl-6 text-sm text-muted-foreground">
                          <li>Usuários podem se registrar com email/senha ou conta Google</li>
                          <li>Usuários autenticados têm acesso a funções adicionais como histórico de pedidos</li>
                          <li>Dados de usuário são armazenados no Supabase (PostgreSQL)</li>
                          <li>Email de confirmação é enviado após cadastro</li>
                        </ul>
                      </div>
                      
                      {/* Campos e Validações detalhadas */}
                      <div className="mb-3">
                        <h4 className="text-sm font-semibold text-foreground">Campos e Validações:</h4>
                        <div className="overflow-x-auto border rounded-lg mt-2">
                          <table className="min-w-full divide-y divide-border text-sm">
                            <thead className="bg-muted">
                              <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Campo</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Tipo</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Tamanho</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Obrigatório</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Validação</th>
                              </tr>
                            </thead>
                            <tbody className="bg-card divide-y divide-border">
                              <tr>
                                <td className="px-3 py-2 font-medium text-foreground">Nome Completo</td>
                                <td className="px-3 py-2 text-muted-foreground">text</td>
                                <td className="px-3 py-2 text-muted-foreground">3-100 caracteres</td>
                                <td className="px-3 py-2"><span className="text-destructive font-medium">Sim</span></td>
                                <td className="px-3 py-2 text-muted-foreground">Não pode estar vazio, mínimo 3 caracteres</td>
                              </tr>
                              <tr>
                                <td className="px-3 py-2 font-medium text-foreground">Email</td>
                                <td className="px-3 py-2 text-muted-foreground">email</td>
                                <td className="px-3 py-2 text-muted-foreground">até 255 caracteres</td>
                                <td className="px-3 py-2"><span className="text-destructive font-medium">Sim</span></td>
                                <td className="px-3 py-2 text-muted-foreground">Formato válido de email (regex), único no sistema</td>
                              </tr>
                              <tr>
                                <td className="px-3 py-2 font-medium text-foreground">Senha</td>
                                <td className="px-3 py-2 text-muted-foreground">password</td>
                                <td className="px-3 py-2 text-muted-foreground">6-128 caracteres</td>
                                <td className="px-3 py-2"><span className="text-destructive font-medium">Sim</span></td>
                                <td className="px-3 py-2 text-muted-foreground">Mínimo 6 caracteres</td>
                              </tr>
                              <tr>
                                <td className="px-3 py-2 font-medium text-foreground">Telefone</td>
                                <td className="px-3 py-2 text-muted-foreground">tel</td>
                                <td className="px-3 py-2 text-muted-foreground">10-15 dígitos</td>
                                <td className="px-3 py-2"><span className="text-muted-foreground">Não</span></td>
                                <td className="px-3 py-2 text-muted-foreground">Formato: (XX) XXXXX-XXXX ou internacional</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Código de Validação */}
                      <div className="mb-3">
                        <h4 className="text-sm font-semibold text-foreground">Código de Validação (Zod Schema):</h4>
                        <div className="bg-muted p-3 rounded-lg overflow-x-auto text-xs mt-2">
                          <pre className="text-foreground">{`// Schema de validação para cadastro de usuário
import { z } from 'zod';

export const signUpSchema = z.object({
  // Validação do nome completo
  name: z.string()
    .min(3, { message: "Nome deve ter pelo menos 3 caracteres" })
    .max(100, { message: "Nome deve ter no máximo 100 caracteres" })
    .regex(/^[a-zA-ZÀ-ÿ\\s]+$/, { message: "Nome deve conter apenas letras" }),
  
  // Validação do email
  email: z.string()
    .email({ message: "Email inválido" })
    .max(255, { message: "Email deve ter no máximo 255 caracteres" }),
  
  // Validação da senha
  password: z.string()
    .min(6, { message: "Senha deve ter pelo menos 6 caracteres" })
    .max(128, { message: "Senha deve ter no máximo 128 caracteres" }),
  
  // Validação do telefone (opcional)
  phone: z.string()
    .regex(/^\\(?\\d{2}\\)?[\\s-]?\\d{4,5}[\\s-]?\\d{4}$/, { 
      message: "Telefone inválido. Use o formato (XX) XXXXX-XXXX" 
    })
    .optional()
    .or(z.literal('')),
});`}</pre>
                        </div>
                      </div>
                    </div>
                    
                    {/* Funcionalidade: Cadastro de Endereço */}
                    <div className="border-l-4 border-accent pl-4">
                      <h3 className="font-medium mb-2 text-foreground">Cadastro de Endereço</h3>
                      
                      {/* Regras da Funcionalidade */}
                      <div className="mb-3">
                        <h4 className="text-sm font-semibold text-foreground">Regras da Funcionalidade:</h4>
                        <ul className="list-disc pl-6 text-sm text-muted-foreground">
                          <li>Usuários podem cadastrar múltiplos endereços</li>
                          <li>Um endereço pode ser definido como padrão</li>
                          <li>Endereços são vinculados ao usuário autenticado</li>
                          <li>CEP pode ser consultado para preenchimento automático</li>
                        </ul>
                      </div>
                      
                      {/* Campos e Validações detalhadas */}
                      <div className="mb-3">
                        <h4 className="text-sm font-semibold text-foreground">Campos e Validações:</h4>
                        <div className="overflow-x-auto border rounded-lg mt-2">
                          <table className="min-w-full divide-y divide-border text-sm">
                            <thead className="bg-muted">
                              <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Campo</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Tipo</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Tamanho</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Obrigatório</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Validação</th>
                              </tr>
                            </thead>
                            <tbody className="bg-card divide-y divide-border">
                              <tr>
                                <td className="px-3 py-2 font-medium text-foreground">CEP</td>
                                <td className="px-3 py-2 text-muted-foreground">text</td>
                                <td className="px-3 py-2 text-muted-foreground">8 dígitos</td>
                                <td className="px-3 py-2"><span className="text-destructive font-medium">Sim</span></td>
                                <td className="px-3 py-2 text-muted-foreground">Formato XXXXX-XXX, apenas números</td>
                              </tr>
                              <tr>
                                <td className="px-3 py-2 font-medium text-foreground">Rua/Logradouro</td>
                                <td className="px-3 py-2 text-muted-foreground">text</td>
                                <td className="px-3 py-2 text-muted-foreground">3-200 caracteres</td>
                                <td className="px-3 py-2"><span className="text-destructive font-medium">Sim</span></td>
                                <td className="px-3 py-2 text-muted-foreground">Não pode estar vazio</td>
                              </tr>
                              <tr>
                                <td className="px-3 py-2 font-medium text-foreground">Número</td>
                                <td className="px-3 py-2 text-muted-foreground">text</td>
                                <td className="px-3 py-2 text-muted-foreground">1-20 caracteres</td>
                                <td className="px-3 py-2"><span className="text-destructive font-medium">Sim</span></td>
                                <td className="px-3 py-2 text-muted-foreground">Aceita "S/N" para sem número</td>
                              </tr>
                              <tr>
                                <td className="px-3 py-2 font-medium text-foreground">Complemento</td>
                                <td className="px-3 py-2 text-muted-foreground">text</td>
                                <td className="px-3 py-2 text-muted-foreground">até 100 caracteres</td>
                                <td className="px-3 py-2"><span className="text-muted-foreground">Não</span></td>
                                <td className="px-3 py-2 text-muted-foreground">Opcional (Apto, Bloco, etc)</td>
                              </tr>
                              <tr>
                                <td className="px-3 py-2 font-medium text-foreground">Bairro</td>
                                <td className="px-3 py-2 text-muted-foreground">text</td>
                                <td className="px-3 py-2 text-muted-foreground">2-100 caracteres</td>
                                <td className="px-3 py-2"><span className="text-destructive font-medium">Sim</span></td>
                                <td className="px-3 py-2 text-muted-foreground">Não pode estar vazio</td>
                              </tr>
                              <tr>
                                <td className="px-3 py-2 font-medium text-foreground">Cidade</td>
                                <td className="px-3 py-2 text-muted-foreground">text</td>
                                <td className="px-3 py-2 text-muted-foreground">2-100 caracteres</td>
                                <td className="px-3 py-2"><span className="text-destructive font-medium">Sim</span></td>
                                <td className="px-3 py-2 text-muted-foreground">Não pode estar vazio</td>
                              </tr>
                              <tr>
                                <td className="px-3 py-2 font-medium text-foreground">Estado (UF)</td>
                                <td className="px-3 py-2 text-muted-foreground">text</td>
                                <td className="px-3 py-2 text-muted-foreground">2 caracteres</td>
                                <td className="px-3 py-2"><span className="text-destructive font-medium">Sim</span></td>
                                <td className="px-3 py-2 text-muted-foreground">Sigla do estado brasileiro (SP, RJ, etc)</td>
                              </tr>
                              <tr>
                                <td className="px-3 py-2 font-medium text-foreground">Padrão</td>
                                <td className="px-3 py-2 text-muted-foreground">boolean</td>
                                <td className="px-3 py-2 text-muted-foreground">-</td>
                                <td className="px-3 py-2"><span className="text-muted-foreground">Não</span></td>
                                <td className="px-3 py-2 text-muted-foreground">Define se é o endereço padrão do usuário</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Código de Validação */}
                      <div className="mb-3">
                        <h4 className="text-sm font-semibold text-foreground">Código de Validação (Zod Schema):</h4>
                        <div className="bg-muted p-3 rounded-lg overflow-x-auto text-xs mt-2">
                          <pre className="text-foreground">{`// Schema de validação para cadastro de endereço
import { z } from 'zod';

export const addressSchema = z.object({
  // Validação do CEP
  zip_code: z.string()
    .regex(/^\\d{5}-?\\d{3}$/, { message: "CEP inválido. Use o formato XXXXX-XXX" }),
  
  // Validação da rua/logradouro
  street: z.string()
    .min(3, { message: "Rua deve ter pelo menos 3 caracteres" })
    .max(200, { message: "Rua deve ter no máximo 200 caracteres" }),
  
  // Validação do número
  number: z.string()
    .min(1, { message: "Número é obrigatório" })
    .max(20, { message: "Número deve ter no máximo 20 caracteres" }),
  
  // Validação do complemento (opcional)
  complement: z.string()
    .max(100, { message: "Complemento deve ter no máximo 100 caracteres" })
    .optional()
    .or(z.literal('')),
  
  // Validação do bairro
  neighborhood: z.string()
    .min(2, { message: "Bairro deve ter pelo menos 2 caracteres" })
    .max(100, { message: "Bairro deve ter no máximo 100 caracteres" }),
  
  // Validação da cidade
  city: z.string()
    .min(2, { message: "Cidade deve ter pelo menos 2 caracteres" })
    .max(100, { message: "Cidade deve ter no máximo 100 caracteres" }),
  
  // Validação do estado
  state: z.string()
    .length(2, { message: "Estado deve ter exatamente 2 caracteres (UF)" })
    .regex(/^[A-Z]{2}$/, { message: "Estado inválido. Use a sigla (SP, RJ, etc)" }),
  
  // Campo de endereço padrão
  is_default: z.boolean().optional().default(false),
});`}</pre>
                        </div>
                      </div>
                    </div>
                    
                    {/* Funcionalidade: Gestão de Pedidos */}
                    <div className="border-l-4 border-green-500 pl-4">
                      <h3 className="font-medium mb-2 text-foreground">Gestão de Pedidos</h3>
                      
                      {/* Regras da Funcionalidade */}
                      <div className="mb-3">
                        <h4 className="text-sm font-semibold text-foreground">Regras da Funcionalidade:</h4>
                        <ul className="list-disc pl-6 text-sm text-muted-foreground">
                          <li>Usuários podem adicionar itens ao carrinho</li>
                          <li>Pedidos são confirmados com endereço e método de pagamento</li>
                          <li>Status do pedido é atualizado em tempo real</li>
                        </ul>
                      </div>
                      
                      {/* Campos e Validações */}
                      <div className="mb-3">
                        <h4 className="text-sm font-semibold text-foreground">Campos e Validações:</h4>
                        <div className="overflow-x-auto border rounded-lg mt-2">
                          <table className="min-w-full divide-y divide-border text-sm">
                            <thead className="bg-muted">
                              <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Campo</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Tipo</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Obrigatório</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Validação</th>
                              </tr>
                            </thead>
                            <tbody className="bg-card divide-y divide-border">
                              <tr>
                                <td className="px-3 py-2 font-medium text-foreground">Itens do pedido</td>
                                <td className="px-3 py-2 text-muted-foreground">array</td>
                                <td className="px-3 py-2"><span className="text-destructive font-medium">Sim</span></td>
                                <td className="px-3 py-2 text-muted-foreground">Mínimo 1 item no carrinho</td>
                              </tr>
                              <tr>
                                <td className="px-3 py-2 font-medium text-foreground">Endereço de entrega</td>
                                <td className="px-3 py-2 text-muted-foreground">uuid (FK)</td>
                                <td className="px-3 py-2"><span className="text-destructive font-medium">Sim</span></td>
                                <td className="px-3 py-2 text-muted-foreground">Endereço válido do usuário</td>
                              </tr>
                              <tr>
                                <td className="px-3 py-2 font-medium text-foreground">Método de pagamento</td>
                                <td className="px-3 py-2 text-muted-foreground">text</td>
                                <td className="px-3 py-2"><span className="text-destructive font-medium">Sim</span></td>
                                <td className="px-3 py-2 text-muted-foreground">Opção válida selecionada</td>
                              </tr>
                              <tr>
                                <td className="px-3 py-2 font-medium text-foreground">Instruções especiais</td>
                                <td className="px-3 py-2 text-muted-foreground">text</td>
                                <td className="px-3 py-2"><span className="text-muted-foreground">Não</span></td>
                                <td className="px-3 py-2 text-muted-foreground">Até 500 caracteres</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    
                    {/* Funcionalidade: Catálogo de Restaurantes */}
                    <div className="border-l-4 border-purple-500 pl-4">
                      <h3 className="font-medium mb-2 text-foreground">Catálogo de Restaurantes</h3>
                      
                      {/* Regras da Funcionalidade */}
                      <div className="mb-3">
                        <h4 className="text-sm font-semibold text-foreground">Regras da Funcionalidade:</h4>
                        <ul className="list-disc pl-6 text-sm text-muted-foreground">
                          <li>Restaurantes são categorizados por tipo de culinária</li>
                          <li>Cada restaurante possui seu próprio cardápio</li>
                          <li>Itens do cardápio incluem detalhes como preço, descrição e opções</li>
                        </ul>
                      </div>
                      
                      {/* Campos Necessários */}
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">Campos Necessários:</h4>
                        <ul className="list-disc pl-6 text-sm text-muted-foreground">
                          <li>Nome do restaurante (<span className="text-destructive">obrigatório</span>)</li>
                          <li>Categoria (<span className="text-destructive">obrigatório</span>)</li>
                          <li>Itens do cardápio (<span className="text-destructive">obrigatório</span>)</li>
                          <li>Horário de funcionamento (<span className="text-destructive">obrigatório</span>)</li>
                          <li>Tempo médio de entrega (<span className="text-destructive">obrigatório</span>)</li>
                        </ul>
                      </div>
                    </div>

                    {/* Funcionalidade: Integração com Google */}
                    <div className="border-l-4 border-red-500 pl-4">
                      <h3 className="font-medium mb-2 text-foreground">Integração com Google OAuth</h3>
                      
                      {/* Regras da Funcionalidade */}
                      <div className="mb-3">
                        <h4 className="text-sm font-semibold text-foreground">Regras da Funcionalidade:</h4>
                        <ul className="list-disc pl-6 text-sm text-muted-foreground">
                          <li>Usuários podem fazer login com sua conta Google</li>
                          <li>Dados do perfil Google são importados automaticamente (nome, email, avatar)</li>
                          <li>Não requer confirmação de email quando usa Google OAuth</li>
                          <li>Perfil do usuário é criado automaticamente via trigger do banco</li>
                        </ul>
                      </div>
                      
                      {/* Configuração necessária */}
                      <div className="mb-3">
                        <h4 className="text-sm font-semibold text-foreground">Configuração Necessária:</h4>
                        <ul className="list-disc pl-6 text-sm text-muted-foreground">
                          <li>Criar projeto no Google Cloud Console</li>
                          <li>Configurar OAuth 2.0 Client ID</li>
                          <li>Adicionar URLs autorizadas no Google Console</li>
                          <li>Configurar provider Google no Supabase Dashboard</li>
                          <li>Definir Site URL e Redirect URLs no Supabase Auth</li>
                        </ul>
                      </div>

                      {/* Código de Implementação */}
                      <div className="mb-3">
                        <h4 className="text-sm font-semibold text-foreground">Código de Implementação:</h4>
                        <div className="bg-muted p-3 rounded-lg overflow-x-auto text-xs mt-2">
                          <pre className="text-foreground">{`// Função para login com Google
const handleGoogleSignIn = async () => {
  try {
    // Chamar método de login OAuth do Supabase
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google', // Provider Google
      options: {
        // URL para redirecionamento após autenticação
        redirectTo: \`\${window.location.origin}/\`,
        // Escopos de permissão do Google
        scopes: 'email profile',
      },
    });

    // Verificar se houve erro
    if (error) throw error;
    
    // Redirecionamento é automático pelo Supabase
  } catch (error) {
    console.error('Erro ao fazer login com Google:', error);
    // Exibir mensagem de erro ao usuário
  }
};`}</pre>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Seção: Modelo de Dados Físico */}
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-foreground">Modelo de Dados Físico</h2>
                  
                  <div className="overflow-x-auto border rounded-lg">
                    <table className="min-w-full divide-y divide-border">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Tabela</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Descrição</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Campos Principais</th>
                        </tr>
                      </thead>
                      <tbody className="bg-card divide-y divide-border">
                        <tr>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-foreground">profiles</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">Perfis dos usuários registrados</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            <ul className="list-disc pl-4">
                              <li>id (PK) - uuid</li>
                              <li>user_id (FK auth.users) - uuid</li>
                              <li>name - text NOT NULL</li>
                              <li>display_name - text</li>
                              <li>phone - text</li>
                              <li>avatar_url - text</li>
                              <li>created_at - timestamp</li>
                            </ul>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-foreground">addresses</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">Endereços cadastrados pelos usuários</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            <ul className="list-disc pl-4">
                              <li>id (PK) - uuid</li>
                              <li>user_id (FK) - uuid</li>
                              <li>street - text NOT NULL</li>
                              <li>number - text NOT NULL</li>
                              <li>complement - text</li>
                              <li>neighborhood - text NOT NULL</li>
                              <li>city - text NOT NULL</li>
                              <li>state - text NOT NULL</li>
                              <li>zip_code - text NOT NULL</li>
                              <li>is_default - boolean</li>
                            </ul>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-foreground">restaurants</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">Informações dos restaurantes</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            <ul className="list-disc pl-4">
                              <li>id (PK) - uuid</li>
                              <li>name - text NOT NULL</li>
                              <li>category_id (FK) - uuid</li>
                              <li>cuisine - text NOT NULL</li>
                              <li>image_url - text</li>
                              <li>delivery_time - text NOT NULL</li>
                              <li>delivery_fee - numeric NOT NULL</li>
                              <li>min_order - numeric NOT NULL</li>
                              <li>rating - numeric</li>
                              <li>is_open - boolean</li>
                            </ul>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-foreground">menu_items</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">Itens do cardápio dos restaurantes</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            <ul className="list-disc pl-4">
                              <li>id (PK) - uuid</li>
                              <li>restaurant_id (FK) - uuid NOT NULL</li>
                              <li>name - text NOT NULL</li>
                              <li>description - text</li>
                              <li>price - numeric NOT NULL</li>
                              <li>image_url - text</li>
                              <li>category - text NOT NULL</li>
                              <li>is_available - boolean</li>
                              <li>rating - numeric</li>
                            </ul>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-foreground">orders</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">Pedidos realizados pelos usuários</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            <ul className="list-disc pl-4">
                              <li>id (PK) - uuid</li>
                              <li>user_id (FK) - uuid NOT NULL</li>
                              <li>restaurant_id (FK) - uuid NOT NULL</li>
                              <li>delivery_address_id (FK) - uuid NOT NULL</li>
                              <li>status - text NOT NULL</li>
                              <li>items - jsonb NOT NULL</li>
                              <li>subtotal - numeric NOT NULL</li>
                              <li>delivery_fee - numeric NOT NULL</li>
                              <li>total - numeric NOT NULL</li>
                              <li>payment_method - text</li>
                              <li>notes - text</li>
                              <li>rating - integer</li>
                              <li>created_at - timestamp</li>
                            </ul>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-foreground">payment_methods</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">Métodos de pagamento dos usuários</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            <ul className="list-disc pl-4">
                              <li>id (PK) - uuid</li>
                              <li>user_id (FK) - uuid NOT NULL</li>
                              <li>type - text NOT NULL</li>
                              <li>card_name - text</li>
                              <li>card_number - text</li>
                              <li>expiry_date - text</li>
                              <li>is_default - boolean</li>
                            </ul>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-foreground">categories</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">Categorias de restaurantes</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            <ul className="list-disc pl-4">
                              <li>id (PK) - uuid</li>
                              <li>name - text NOT NULL</li>
                              <li>icon - text NOT NULL</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Seção: Script de Criação do Banco de Dados */}
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-foreground">Script de Criação do Banco de Dados (PostgreSQL - Supabase)</h2>
                  <div className="bg-muted text-foreground p-4 rounded-lg overflow-x-auto text-sm">
                    <pre>{`-- Tabela de perfis de usuários (vinculada ao auth.users do Supabase)
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  name TEXT NOT NULL,
  display_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para profiles
CREATE POLICY "Users can view their own profile" ON public.profiles 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles 
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Tabela de endereços
CREATE TABLE public.addresses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  restaurant_id UUID,
  street TEXT NOT NULL,
  number TEXT NOT NULL,
  complement TEXT,
  neighborhood TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  is_restaurant_address BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela addresses
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para addresses
CREATE POLICY "Users can view their own addresses" ON public.addresses 
  FOR SELECT USING ((auth.uid() = user_id) OR (is_restaurant_address = true));
CREATE POLICY "Users can insert their own addresses" ON public.addresses 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own addresses" ON public.addresses 
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own addresses" ON public.addresses 
  FOR DELETE USING (auth.uid() = user_id);

-- Tabela de categorias
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de restaurantes
CREATE TABLE public.restaurants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.categories(id),
  address_id UUID REFERENCES public.addresses(id),
  cuisine TEXT NOT NULL,
  image_url TEXT,
  delivery_time TEXT NOT NULL,
  delivery_fee NUMERIC NOT NULL,
  min_order NUMERIC NOT NULL,
  rating NUMERIC DEFAULT 0,
  is_open BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de itens do cardápio
CREATE TABLE public.menu_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  rating NUMERIC,
  preparation_time TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de pedidos
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id),
  delivery_address_id UUID NOT NULL REFERENCES public.addresses(id),
  items JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  subtotal NUMERIC NOT NULL,
  delivery_fee NUMERIC NOT NULL,
  total NUMERIC NOT NULL,
  payment_method TEXT,
  notes TEXT,
  rating INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para orders
CREATE POLICY "Users can view their own orders" ON public.orders 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own orders" ON public.orders 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own orders" ON public.orders 
  FOR UPDATE USING (auth.uid() = user_id);

-- Tabela de métodos de pagamento
CREATE TABLE public.payment_methods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  card_name TEXT,
  card_number TEXT,
  expiry_date TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela payment_methods
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

-- Função para criar perfil automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger para criar perfil ao registrar usuário
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Função para atualizar timestamp de updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;`}</pre>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SystemDocumentation;
