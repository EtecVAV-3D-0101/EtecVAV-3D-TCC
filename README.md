🏅 SportLife

Plataforma Social para Organização e Integração Esportiva

O SportLife é uma aplicação web desenvolvida como Trabalho de Conclusão de Curso (TCC) do curso Técnico em Informática para Internet. Seu objetivo é conectar praticantes de esportes por meio de uma plataforma moderna que reúne recursos de rede social, organização de partidas, criação de times, torneios, estatísticas e comunicação em tempo real.


---

📋 Objetivo do Projeto

Criar uma plataforma que incentive a prática esportiva e facilite a interação entre atletas amadores e entusiastas de diferentes modalidades, permitindo organizar atividades esportivas de forma simples e acessível.


---

🚀 Principais Funcionalidades

✅ Cadastro e autenticação de usuários

✅ Login seguro com Firebase Authentication

✅ Feed social para compartilhamento de publicações

✅ Curtidas e comentários em postagens

✅ Perfil personalizado do usuário

✅ Criação e gerenciamento de times

✅ Organização de partidas esportivas

✅ Criação e gerenciamento de torneios

✅ Sistema de convites para usuários

✅ Chat privado em tempo real

✅ Sistema de notificações

✅ Ranking de jogadores

✅ Estatísticas individuais

✅ Histórico esportivo completo

✅ Sistema de conquistas (achievements)

✅ Registro de resultados e MVP das partidas

✅ Upload de imagens utilizando Firebase Storage



---

🛠️ Tecnologias Utilizadas

Front-end

React

Vite

JavaScript (ES6+)

HTML5

CSS3

Tailwind CSS


Back-end e Serviços

Firebase Authentication

Cloud Firestore

Firebase Storage


Bibliotecas

React Router

Context API

Recharts (gráficos e estatísticas)

Lucide Icons



---

📁 Estrutura do Projeto

src/
├── assets/
├── components/
├── contexts/
├── hooks/
├── pages/
├── routes/
├── services/
├── utils/
├── firebase/
├── App.jsx
└── main.jsx


---

🗄️ Estrutura do Banco de Dados (Firestore)

Principais coleções:

users

posts

comments

likes

matches

match_participants

match_results

teams

team_members

tournaments

tournament_participants

invites

notifications

chats

messages

rankings

player_stats

achievements

user_achievements

sport_history



---

🔒 Segurança

O projeto utiliza regras de segurança do Firebase para garantir que:

Apenas usuários autenticados possam acessar recursos protegidos.

Cada usuário possa editar somente seus próprios dados.

Apenas autores possam alterar ou excluir suas publicações.

Mensagens privadas sejam acessíveis somente aos participantes da conversa.

Uploads de arquivos sejam limitados por tipo e tamanho.



---

📊 Diferenciais do SportLife

Plataforma inspirada em redes sociais esportivas modernas.

Atualizações em tempo real utilizando Firebase.

Sistema de ranking e estatísticas automáticas.

Histórico completo das atividades esportivas.

Sistema de conquistas para incentivar o engajamento.

Interface responsiva para dispositivos móveis e desktop.



---

🎯 Público-Alvo

Atletas amadores

Estudantes

Organizadores de eventos esportivos

Equipes esportivas

Comunidades esportivas locais

Pessoas interessadas em praticar esportes e encontrar parceiros para atividades



---

▶️ Como Executar o Projeto

1. Clone o repositório:



git clone <url-do-repositorio>

2. Instale as dependências:



npm install

3. Configure as credenciais do Firebase no projeto.


4. Execute em modo de desenvolvimento:



npm run dev

5. Acesse a aplicação pelo navegador no endereço exibido pelo Vite.




---

👨‍💻 Autor

Levi Alves

Trabalho de Conclusão de Curso (TCC)
Técnico em Informática para Internet


---

📄 Licença

Este projeto foi desenvolvido exclusivamente para fins acadêmicos como Trabalho de Conclusão de Curso (TCC). 
