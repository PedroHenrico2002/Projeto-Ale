import React from 'react';
import { Layout } from '@/components/Layout';
import { SystemArchitecture } from '@/components/SystemArchitecture';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import { exportToWord } from '@/utils/documentExport';
import { useToast } from '@/components/ui/use-toast';

const SystemDocumentation: React.FC = () => {
  const { toast } = useToast();

  const handleExport = async () => {
    try {
      await exportToWord();
      toast({
        title: "Documento exportado com sucesso!",
        description: "O arquivo foi salvo em sua pasta de downloads.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error exporting document:', error);
      toast({
        title: "Erro ao exportar o documento",
        description: "Ocorreu um erro ao gerar o arquivo. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="min-h-screen pt-20 pb-16">
        <div className="page-container">
          <div className="max-w-4xl mx-auto space-y-8">
            <section className="bg-white shadow-md rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Documentação do Sistema - Be Legendary</h1>
                <Button 
                  onClick={handleExport} 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <FileDown size={18} className="mr-2" />
                  Exportar para Word
                </Button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Escopo do Projeto</h2>
                  <p>O objetivo deste projeto é desenvolver uma plataforma de delivery de comida que permite aos usuários navegar por restaurantes, selecionar itens do cardápio, fazer pedidos online e acompanhar a entrega em tempo real.</p>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mb-2">Sumário</h2>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Sistema de autenticação de usuários com múltiplas opções de login</li>
                    <li>Catálogo de restaurantes com categorização</li>
                    <li>Sistema de pedidos com acompanhamento em tempo real</li>
                    <li>Gerenciamento de endereços de entrega</li>
                    <li>Histórico de pedidos para usuários autenticados</li>
                    <li>Integração com serviços de pagamento</li>
                  </ul>
                </div>
                
                <SystemArchitecture />
                
                <div>
                  <h2 className="text-xl font-semibold mb-2">Requisitos/Funcionalidades</h2>
                  
                  <div className="space-y-4 mt-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h3 className="font-medium mb-2">Autenticação de Usuário</h3>
                      
                      <div className="mb-2">
                        <h4 className="text-sm font-semibold">Regras da Funcionalidade:</h4>
                        <ul className="list-disc pl-6 text-sm">
                          <li>Usuários podem se registrar com email/senha ou contas sociais</li>
                          <li>Usuários autenticados têm acesso a funções adicionais como histórico de pedidos</li>
                          <li>Dados de usuário são armazenados localmente e em banco de dados</li>
                        </ul>
                      </div>
                      
                      <div className="mb-2">
                        <h4 className="text-sm font-semibold">Campos Necessários:</h4>
                        <ul className="list-disc pl-6 text-sm">
                          <li>Nome completo (obrigatório)</li>
                          <li>Email (obrigatório)</li>
                          <li>Senha (obrigatório para login tradicional)</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold">Validações:</h4>
                        <ul className="list-disc pl-6 text-sm">
                          <li>Email deve ser válido</li>
                          <li>Senha deve ter no mínimo 6 caracteres</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="border-l-4 border-green-500 pl-4">
                      <h3 className="font-medium mb-2">Gestão de Pedidos</h3>
                      
                      <div className="mb-2">
                        <h4 className="text-sm font-semibold">Regras da Funcionalidade:</h4>
                        <ul className="list-disc pl-6 text-sm">
                          <li>Usuários podem adicionar itens ao carrinho</li>
                          <li>Pedidos são confirmados com endereço e método de pagamento</li>
                          <li>Status do pedido é atualizado em tempo real</li>
                        </ul>
                      </div>
                      
                      <div className="mb-2">
                        <h4 className="text-sm font-semibold">Campos Necessários:</h4>
                        <ul className="list-disc pl-6 text-sm">
                          <li>Itens do pedido (obrigatório)</li>
                          <li>Endereço de entrega (obrigatório)</li>
                          <li>Método de pagamento (obrigatório)</li>
                          <li>Instruções especiais (opcional)</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="border-l-4 border-purple-500 pl-4">
                      <h3 className="font-medium mb-2">Catálogo de Restaurantes</h3>
                      
                      <div className="mb-2">
                        <h4 className="text-sm font-semibold">Regras da Funcionalidade:</h4>
                        <ul className="list-disc pl-6 text-sm">
                          <li>Restaurantes são categorizados por tipo de culinária</li>
                          <li>Cada restaurante possui seu próprio cardápio</li>
                          <li>Itens do cardápio incluem detalhes como preço, descrição e opções</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold">Campos Necessários:</h4>
                        <ul className="list-disc pl-6 text-sm">
                          <li>Nome do restaurante (obrigatório)</li>
                          <li>Categoria (obrigatório)</li>
                          <li>Itens do cardápio (obrigatório)</li>
                          <li>Horário de funcionamento (obrigatório)</li>
                          <li>Tempo médio de entrega (obrigatório)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mb-4">Modelo de Dados Físico</h2>
                  
                  <div className="overflow-x-auto border rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tabela</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campos Principais</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">users</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">Armazena dados dos usuários registrados</td>
                          <td className="px-6 py-4 text-sm">
                            <ul className="list-disc pl-4">
                              <li>id (PK)</li>
                              <li>name</li>
                              <li>email</li>
                              <li>auth_type</li>
                              <li>created_at</li>
                            </ul>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">addresses</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">Endereços cadastrados pelos usuários</td>
                          <td className="px-6 py-4 text-sm">
                            <ul className="list-disc pl-4">
                              <li>id (PK)</li>
                              <li>user_id (FK)</li>
                              <li>street</li>
                              <li>number</li>
                              <li>complement</li>
                              <li>city</li>
                              <li>is_default</li>
                            </ul>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">restaurants</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">Informações dos restaurantes</td>
                          <td className="px-6 py-4 text-sm">
                            <ul className="list-disc pl-4">
                              <li>id (PK)</li>
                              <li>name</li>
                              <li>category_id (FK)</li>
                              <li>image_url</li>
                              <li>delivery_time</li>
                              <li>min_order</li>
                              <li>rating</li>
                            </ul>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">menu_items</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">Itens do cardápio dos restaurantes</td>
                          <td className="px-6 py-4 text-sm">
                            <ul className="list-disc pl-4">
                              <li>id (PK)</li>
                              <li>restaurant_id (FK)</li>
                              <li>name</li>
                              <li>description</li>
                              <li>price</li>
                              <li>image_url</li>
                              <li>category</li>
                            </ul>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">orders</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">Pedidos realizados pelos usuários</td>
                          <td className="px-6 py-4 text-sm">
                            <ul className="list-disc pl-4">
                              <li>id (PK)</li>
                              <li>user_id (FK)</li>
                              <li>restaurant_id (FK)</li>
                              <li>address_id (FK)</li>
                              <li>status</li>
                              <li>total</li>
                              <li>created_at</li>
                            </ul>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">order_items</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">Itens incluídos em cada pedido</td>
                          <td className="px-6 py-4 text-sm">
                            <ul className="list-disc pl-4">
                              <li>id (PK)</li>
                              <li>order_id (FK)</li>
                              <li>item_id (FK)</li>
                              <li>quantity</li>
                              <li>unit_price</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mb-4">Script de Criação do Banco de Dados</h2>
                  <div className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto text-sm">
                    <pre>{`
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  auth_type VARCHAR(20) NOT NULL DEFAULT 'email',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE addresses (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  street VARCHAR(100) NOT NULL,
  number VARCHAR(20) NOT NULL,
  complement VARCHAR(100),
  city VARCHAR(50) NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE categories (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  icon VARCHAR(200)
);

CREATE TABLE restaurants (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category_id VARCHAR(36) NOT NULL,
  image_url VARCHAR(200),
  cuisine VARCHAR(50),
  delivery_time VARCHAR(20),
  min_order VARCHAR(20),
  rating DECIMAL(2,1),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE menu_items (
  id VARCHAR(36) PRIMARY KEY,
  restaurant_id VARCHAR(36) NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url VARCHAR(200),
  category VARCHAR(50),
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);

CREATE TABLE orders (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  restaurant_id VARCHAR(36) NOT NULL,
  address_id VARCHAR(36) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
  FOREIGN KEY (address_id) REFERENCES addresses(id)
);

CREATE TABLE order_items (
  id VARCHAR(36) PRIMARY KEY,
  order_id VARCHAR(36) NOT NULL,
  item_id VARCHAR(36) NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (item_id) REFERENCES menu_items(id)
);
                    `}</pre>
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
