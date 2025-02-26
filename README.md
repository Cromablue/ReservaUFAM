<h1 align="center">
    <img src="./docs/img/banner-reserve.png" alt="Reserve" title="Reserve">
</h1>

<h4 align="center"> 
	🚧  Reserve 🌱 Em desenvolvimento...  🚧
</h4>

## 💻 Sobre o projeto
O **Reserve** tem como objetivo substituir o processo manual de agendamento de salas, auditórios e veículos na UFAM.  
Projeto desenvolvido para a disciplina de Engenharia de Aplicações Web do curso de Engenharia de Software da UFAM.

## 🛠️ Tecnologias Utilizadas  
- **Backend:** Django (REST API)  
- **Frontend:** React  
- **Banco de Dados:** PostgreSQL  
- **Autenticação:** (a definir)  
- **Containerização:** Docker  



## 🚀 Como Executar o Projeto  

### 📌 Pré-requisitos  
Antes de começar, certifique-se de ter instalado:  
**Versionamento e gerenciamento de conteiners**
   - [Git](https://git-scm.com/)  
   - [Docker](https://www.docker.com/)

**Linguagens e frameworks**
   - [Python](https://www.python.org/)  
   - [PostgreSQL](https://www.postgresql.org/)
   - [Node.js](https://nodejs.org/)  
   - [npm](https://www.npmjs.com/)  

### 🔧 Instalação e Execução  
1. Clone o repositório:  
   ```bash
   git clone https://github.com/Cromablue/ReservaUFAM.git
   cd ReservaUFAM
   ```

2. Inicie o ambiente:  
   ```bash
   docker-compose up --build -d
   ```
   Aguarde a inicialização dos containers.
   
   Caso dê um erro e queira parar o ambiente: 
   ```bash
   docker-compose down -v
   ```

3. Acesse a aplicação no navegador:  
   ```bash
   # Django
   http://localhost:8000
   # React
   http://localhost:5173
   ```
4. Para manipular as imagens do projeto
   
   **Django**
   ```bash
   docker exec -it reservaufam_backend bash
   ```

   **React**
   ```bash
   docker exec -it reservaufam_frontend bash
   ```
5. Para sair do container
   ```bash
   exit
   ```


## 📜 Licença
Este projeto é de código aberto e distribuído sob a licença MIT.
