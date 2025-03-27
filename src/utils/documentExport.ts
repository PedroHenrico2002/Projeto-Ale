
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';

export const exportToWord = async () => {
  // Create document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: "Documentação do Sistema - Be Legendary",
            heading: HeadingLevel.HEADING_1,
          }),
          
          // Escopo do Projeto
          new Paragraph({
            text: "Escopo do Projeto",
            heading: HeadingLevel.HEADING_2,
            spacing: {
              after: 200,
            },
          }),
          new Paragraph({
            text: "O objetivo deste projeto é desenvolver uma plataforma de delivery de comida que permite aos usuários navegar por restaurantes, selecionar itens do cardápio, fazer pedidos online e acompanhar a entrega em tempo real.",
          }),
          
          // Sumário
          new Paragraph({
            text: "Sumário",
            heading: HeadingLevel.HEADING_2,
            spacing: {
              before: 400,
              after: 200,
            },
          }),
          new Paragraph({
            text: "• Sistema de autenticação de usuários com múltiplas opções de login",
          }),
          new Paragraph({
            text: "• Catálogo de restaurantes com categorização",
          }),
          new Paragraph({
            text: "• Sistema de pedidos com acompanhamento em tempo real",
          }),
          new Paragraph({
            text: "• Gerenciamento de endereços de entrega",
          }),
          new Paragraph({
            text: "• Histórico de pedidos para usuários autenticados",
          }),
          new Paragraph({
            text: "• Integração com serviços de pagamento",
          }),
          
          // Arquitetura do Sistema
          new Paragraph({
            text: "Arquitetura do Sistema",
            heading: HeadingLevel.HEADING_2,
            spacing: {
              before: 400,
              after: 200,
            },
          }),
          new Paragraph({
            text: "O sistema utiliza uma arquitetura de múltiplas camadas, incluindo:",
          }),
          new Paragraph({
            text: "• Frontend (Cliente): React + Vite, Tailwind CSS, React Router, Tanstack Query",
          }),
          new Paragraph({
            text: "• Autenticação: Auth Local (Email/Senha), Google Auth, Facebook Auth",
          }),
          new Paragraph({
            text: "• Armazenamento de Dados: Local Storage (Cliente), Banco de Dados (Servidor)",
          }),
          new Paragraph({
            text: "• Camada de API e Serviços: API de Autenticação, API de Pedidos, API de Restaurantes",
          }),
          
          // Requisitos/Funcionalidades
          new Paragraph({
            text: "Requisitos/Funcionalidades",
            heading: HeadingLevel.HEADING_2,
            spacing: {
              before: 400,
              after: 200,
            },
          }),
          
          // Autenticação de Usuário
          new Paragraph({
            text: "Autenticação de Usuário",
            heading: HeadingLevel.HEADING_3,
            spacing: {
              after: 100,
            },
          }),
          new Paragraph({
            text: "Regras da Funcionalidade:",
          }),
          new Paragraph({
            text: "• Usuários podem se registrar com email/senha ou contas sociais",
          }),
          new Paragraph({
            text: "• Usuários autenticados têm acesso a funções adicionais como histórico de pedidos",
          }),
          new Paragraph({
            text: "• Dados de usuário são armazenados localmente e em banco de dados",
          }),
          new Paragraph({
            text: "Campos Necessários:",
          }),
          new Paragraph({
            text: "• Nome completo (obrigatório)",
          }),
          new Paragraph({
            text: "• Email (obrigatório)",
          }),
          new Paragraph({
            text: "• Senha (obrigatório para login tradicional)",
          }),
          new Paragraph({
            text: "Validações:",
          }),
          new Paragraph({
            text: "• Email deve ser válido",
          }),
          new Paragraph({
            text: "• Senha deve ter no mínimo 6 caracteres",
          }),
          
          // Gestão de Pedidos
          new Paragraph({
            text: "Gestão de Pedidos",
            heading: HeadingLevel.HEADING_3,
            spacing: {
              before: 300,
              after: 100,
            },
          }),
          new Paragraph({
            text: "Regras da Funcionalidade:",
          }),
          new Paragraph({
            text: "• Usuários podem adicionar itens ao carrinho",
          }),
          new Paragraph({
            text: "• Pedidos são confirmados com endereço e método de pagamento",
          }),
          new Paragraph({
            text: "• Status do pedido é atualizado em tempo real",
          }),
          new Paragraph({
            text: "Campos Necessários:",
          }),
          new Paragraph({
            text: "• Itens do pedido (obrigatório)",
          }),
          new Paragraph({
            text: "• Endereço de entrega (obrigatório)",
          }),
          new Paragraph({
            text: "• Método de pagamento (obrigatório)",
          }),
          new Paragraph({
            text: "• Instruções especiais (opcional)",
          }),
          
          // Catálogo de Restaurantes
          new Paragraph({
            text: "Catálogo de Restaurantes",
            heading: HeadingLevel.HEADING_3,
            spacing: {
              before: 300,
              after: 100,
            },
          }),
          new Paragraph({
            text: "Regras da Funcionalidade:",
          }),
          new Paragraph({
            text: "• Restaurantes são categorizados por tipo de culinária",
          }),
          new Paragraph({
            text: "• Cada restaurante possui seu próprio cardápio",
          }),
          new Paragraph({
            text: "• Itens do cardápio incluem detalhes como preço, descrição e opções",
          }),
          new Paragraph({
            text: "Campos Necessários:",
          }),
          new Paragraph({
            text: "• Nome do restaurante (obrigatório)",
          }),
          new Paragraph({
            text: "• Categoria (obrigatório)",
          }),
          new Paragraph({
            text: "• Itens do cardápio (obrigatório)",
          }),
          new Paragraph({
            text: "• Horário de funcionamento (obrigatório)",
          }),
          new Paragraph({
            text: "• Tempo médio de entrega (obrigatório)",
          }),
          
          // Modelo de Dados Físico
          new Paragraph({
            text: "Modelo de Dados Físico",
            heading: HeadingLevel.HEADING_2,
            spacing: {
              before: 400,
              after: 200,
            },
          }),
          
          // Creating a table for database structure
          new Table({
            width: {
              size: 100,
              type: "pct",
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("Tabela")],
                    shading: {
                      fill: "F2F2F2",
                    },
                  }),
                  new TableCell({
                    children: [new Paragraph("Descrição")],
                    shading: {
                      fill: "F2F2F2",
                    },
                  }),
                  new TableCell({
                    children: [new Paragraph("Campos Principais")],
                    shading: {
                      fill: "F2F2F2",
                    },
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("users")],
                  }),
                  new TableCell({
                    children: [new Paragraph("Armazena dados dos usuários registrados")],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph("• id (PK)"),
                      new Paragraph("• name"),
                      new Paragraph("• email"),
                      new Paragraph("• auth_type"),
                      new Paragraph("• created_at"),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("addresses")],
                  }),
                  new TableCell({
                    children: [new Paragraph("Endereços cadastrados pelos usuários")],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph("• id (PK)"),
                      new Paragraph("• user_id (FK)"),
                      new Paragraph("• street"),
                      new Paragraph("• number"),
                      new Paragraph("• complement"),
                      new Paragraph("• city"),
                      new Paragraph("• is_default"),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("restaurants")],
                  }),
                  new TableCell({
                    children: [new Paragraph("Informações dos restaurantes")],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph("• id (PK)"),
                      new Paragraph("• name"),
                      new Paragraph("• category_id (FK)"),
                      new Paragraph("• image_url"),
                      new Paragraph("• delivery_time"),
                      new Paragraph("• min_order"),
                      new Paragraph("• rating"),
                    ],
                  }),
                ],
              }),
            ],
          }),
          
          // Script de Criação do Banco de Dados
          new Paragraph({
            text: "Script de Criação do Banco de Dados",
            heading: HeadingLevel.HEADING_2,
            spacing: {
              before: 400,
              after: 200,
            },
          }),
          new Paragraph({
            text: "CREATE TABLE users (\n  id VARCHAR(36) PRIMARY KEY,\n  name VARCHAR(100) NOT NULL,\n  email VARCHAR(100) NOT NULL UNIQUE,\n  auth_type VARCHAR(20) NOT NULL DEFAULT 'email',\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\nCREATE TABLE addresses (\n  id VARCHAR(36) PRIMARY KEY,\n  user_id VARCHAR(36) NOT NULL,\n  street VARCHAR(100) NOT NULL,\n  number VARCHAR(20) NOT NULL,\n  complement VARCHAR(100),\n  city VARCHAR(50) NOT NULL,\n  is_default BOOLEAN DEFAULT FALSE,\n  FOREIGN KEY (user_id) REFERENCES users(id)\n);",
            spacing: {
              before: 200,
              after: 200,
            },
          }),
        ],
      },
    ],
  });

  // Generate and save document
  const buffer = await Packer.toBuffer(doc);
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
  saveAs(blob, "documentacao-be-legendary.docx");

  return true;
};
