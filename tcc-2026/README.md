🏆 SportLife

Plataforma Web para Conexão de Parceiros Esportivos

O SportLife é uma plataforma web desenvolvida como Trabalho de Conclusão de Curso (TCC) do curso Técnico em Informática para Internet da Etec Vasco Antonio Venchiarutti.

O projeto foi criado com o objetivo de conectar pessoas interessadas na prática esportiva, facilitando a formação de equipes, a organização de torneios e a divulgação de resultados esportivos, contribuindo para incentivar a prática regular de atividades físicas e combater o sedentarismo.

---

📖 Sobre o Projeto

O sedentarismo é um dos principais problemas de saúde pública da atualidade. Segundo dados do IBGE e da Organização Mundial da Saúde (OMS), grande parte da população brasileira não pratica atividade física regularmente.

O SportLife surge como uma solução tecnológica para aproximar pessoas com interesses esportivos em comum, oferecendo uma plataforma simples, responsiva e acessível diretamente pelo navegador.

---

🎯 Objetivos

- Incentivar a prática esportiva.
- Facilitar a conexão entre praticantes de esportes.
- Permitir a criação de equipes esportivas.
- Organizar torneios entre usuários.
- Divulgar resultados esportivos em formato de feed.
- Promover hábitos mais saudáveis por meio da tecnologia.

---

🚀 Funcionalidades

👤 Usuários

- Cadastro de usuários
- Login seguro
- Autenticação de sessão
- Perfil do usuário

🏅 Modalidades

- Seleção da modalidade esportiva
- Filtragem de conteúdo por esporte

📰 Feed

- Feed de resultados esportivos
- Rolagem vertical inspirada em redes sociais
- Exibição de partidas por modalidade

👥 Times

- Criar times
- Editar times (somente o criador)
- Excluir times (somente o criador)
- Cadastro de jogadores
- Registro das posições dos atletas

🏆 Torneios

- Criar torneios
- Editar torneios (somente o criador)
- Excluir torneios (somente o criador)
- Cadastro de equipes participantes
- Informações de local e modalidade

👤 Perfil

Cada usuário pode visualizar:

- Times criados
- Torneios criados
- Informações da conta

---

🛠 Tecnologias Utilizadas

Back-end

- Python
- Flask
- Flask-SQLAlchemy
- Flask-Login
- Flask-WTF
- Werkzeug
- python-dotenv
- Gunicorn

Front-end

- HTML5
- CSS3
- Bootstrap 5
- Jinja2

Banco de Dados

- SQLite

---

📁 Estrutura do Projeto

SportLife/
│
├── app.py
├── models.py
├── forms.py
├── routes.py
├── templates/
├── static/
│   ├── css/
│   ├── js/
│   └── imagens/
├── instance/
├── migrations/
└── requirements.txt

---

🔒 Segurança

O sistema utiliza boas práticas para garantir a segurança dos usuários:

- Criptografia de senhas com Werkzeug.
- Controle de sessão com Flask-Login.
- Proteção contra ataques CSRF utilizando Flask-WTF.
- Variáveis sensíveis armazenadas em arquivo ".env".
- Controle de permissões para edição e exclusão de dados.

---

📱 Responsividade

O SportLife foi desenvolvido para funcionar em:

- Computadores
- Tablets
- Smartphones

Sem necessidade de instalação.

---

🌟 Diferenciais

- Plataforma voltada exclusivamente ao esporte.
- Feed de resultados semelhante às redes sociais.
- Organização de equipes e torneios em um único ambiente.
- Interface simples e intuitiva.
- Sistema responsivo.
- Acesso gratuito pelo navegador.

---

🎯 Público-Alvo

- Atletas amadores
- Estudantes
- Equipes esportivas
- Organizadores de campeonatos
- Comunidades esportivas
- Pessoas interessadas em iniciar uma prática esportiva

---

▶️ Como Executar o Projeto

1. Clone o repositório

git clone <url-do-repositorio>

2. Entre na pasta do projeto

cd SportLife

3. Crie um ambiente virtual

python -m venv venv

4. Ative o ambiente virtual

Windows

venv\Scripts\activate

Linux/macOS

source venv/bin/activate

5. Instale as dependências

pip install -r requirements.txt

6. Configure o arquivo ".env"

Adicione as variáveis de ambiente necessárias, como a chave secreta da aplicação.

7. Execute o projeto

flask run

ou

python app.py

---

🚧 Melhorias Futuras

- Upload de imagens para usuários e times.
- Chat entre usuários.
- Busca de parceiros por geolocalização.
- Agendamento de partidas.
- Notificações automáticas.
- Aplicativo para Android e iOS.
- Sistema de gamificação.
- Integração com Google Fit e Apple Health.
- Parcerias com academias, clubes e prefeituras.

---

👨‍💻 Autor

Levi Alves

Trabalho de Conclusão de Curso (TCC)

Técnico em Informática para Internet

Etec Vasco Antonio Venchiarutti – Jundiaí/SP

---

📄 Licença

Este projeto foi desenvolvido exclusivamente para fins acadêmicos como Trabalho de Conclusão de Curso (TCC). Sua utilização para fins comerciais depende da autorização do autor. 
