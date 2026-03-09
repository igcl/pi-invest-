# Invest+ 🚀

Plataforma gamificada de educação financeira e gerenciamento de metas pessoais. O **Invest+** ajuda usuários a transformarem sonhos em realidade através de um sistema de metas, níveis (XP) e conquistas.

---

## 👥 Integrantes do Projeto

* **IGHOR GABRIEL CONSTANTINO DE LIMA** - *Frontend*
* **LUIS FELIPE ALVES FERNANDES** - *Backend*
* **SIMONE CORDEIRO RAMOS** - *Layout*
* **LUIS CARLOS DE AZEVEDO FILHO** - *Firebase*
* **YURI D AMBROSI DA SILVA** - *QA e Testes*
* **STHEPHANY RAFAELA DOS SANTOS DIAS** - *Integração e Banco de Dados*
* **VERONICA SILVEIRA DE ANDRADE** - *Documentação*

---

## 🔗 Links Importantes

* **Acesse o Projeto Online (Vercel):** [https://pi-invest.vercel.app/](https://pi-invest.vercel.app/)
* **Repositório (GitHub):** https://github.com/igcl/pi-invest-
---

## 🛠️ Tecnologias Utilizadas

Este projeto foi desenvolvido utilizando tecnologias web modernas e serviços em nuvem:

* **Frontend:** HTML5, CSS3, JavaScript (Vanilla ES6+).
* **Backend & Banco de Dados:** Google Firebase (Authentication & Firestore).
* **Hospedagem:** Vercel.
* **Ícones:** FontAwesome.

---

## ⚙️ Funcionalidades

1.  **Autenticação:** Cadastro e Login de usuários via Email/Senha (Firebase Auth).
2.  **Dashboard Gamificado:** Visualização de Saldo, Nível do Usuário e Barra de XP.
3.  **Gerenciamento de Metas:**
    * Criação de novas metas com ícones personalizados.
    * Depósito e Saque de valores em cada meta.
    * Edição do valor total da meta.
    * Separação automática entre metas "Em Andamento" e "Concluídas".
4.  **Sistema de Recompensa:** O usuário ganha XP ao economizar, subindo de nível.
5.  **Perfil:** Alteração de foto de perfil e redefinição de senha segura.
6.  **Persistência:** Todos os dados são salvos em tempo real no Firestore.

---

## 🚀 Como Executar o Projeto Localmente

Para rodar este projeto na sua máquina, você não precisa instalar dependências pesadas (como Node.js ou Docker), pois ele utiliza JavaScript puro e CDNs.

### Pré-requisitos

* Um navegador moderno (Chrome, Edge, Firefox).
* Editor de código (recomendado: **VS Code**).
* Extensão **Live Server** (opcional, mas recomendada para o VS Code).

### Passo a Passo

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/igcl/pi-invest-.git
    ```

2.  **Acesse a pasta do projeto:**
    ```bash
    cd invest-plus-
    ```

3.  **Execute a aplicação:**
    * **Opção A (Recomendada):** Abra a pasta no VS Code, clique com o botão direito no arquivo `index.html` e selecione **"Open with Live Server"**.
    * **Opção B (Simples):** Apenas dê um duplo clique no arquivo `index.html` para abrir no seu navegador.

### ⚠️ Notas Importantes sobre o Banco de Dados

Este projeto conecta-se diretamente ao **Firebase**. As chaves de API (`apiKey`, `projectId`, etc.) estão configuradas no arquivo `script.js`.

* **Bloqueadores de Anúncio/Rastreamento:** Navegadores como **Brave** ou extensões de AdBlock podem bloquear a conexão com o banco de dados do Google. Se o saldo aparecer zerado ou o login falhar:
    * Desative o "Shields/Proteção" do navegador para o `localhost` ou `127.0.0.1`.
    * Utilize o Google Chrome para testes de desenvolvimento.

---

## 📂 Estrutura de Arquivos
invest-plus/

│

├── index.html       # Landing Page (Página Inicial)

├── login.html       # Tela de Login

├── register.html    # Tela de Cadastro

├── dashboard.html   # Área Logada (Sistema Principal)

├── style.css        # Estilos globais

├── script.js        # Lógica do Frontend e Integração Firebase

└── README.md        # Documentação

---

## 📜 Licença

Este projeto é de uso educacional. Sinta-se à vontade para usar como base para estudos.
