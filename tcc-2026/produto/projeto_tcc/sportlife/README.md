# SportLife 🏅

Rede social esportiva — migrada de Base44 para Firebase.

## Stack
- **React 18** + **Vite 6**
- **Firebase 10** (Authentication, Firestore, Storage)
- **TanStack Query v5**
- **React Router v6**
- **shadcn/ui** + **Tailwind CSS**

## Funcionalidades
- Login / Cadastro (Email + Google)
- Feed de publicações com curtidas e comentários
- Explorar partidas e torneios
- Criar partidas
- Chat em tempo real
- Perfil editável
- Upload de fotos

## Estrutura
```
src/
  contexts/       # AuthContext (Firebase Auth)
  services/       # firebase.js (Firestore: posts, likes, comments, matches, tournaments, chat, users)
  pages/          # Feed, Login, Register, Chat, Profile, Explore, Tournaments, ...
  components/
    feed/         # PostCard, CreatePostBox, SportStories
    chat/         # ChatListItem
    explore/      # MatchCard, TournamentCard, SportFilter
    layout/       # AppLayout, BottomNav
    ui/           # shadcn/ui components
  hooks/          # useIsMobile
  lib/            # firebase.js (init), utils.js, query-client.js
```

## Setup

### 1. Criar projeto Firebase
1. Acesse https://console.firebase.google.com
2. Crie um novo projeto
3. Ative **Authentication** → Métodos: Email/Senha + Google
4. Ative **Firestore Database** (modo teste para desenvolvimento)
5. Ative **Storage**
6. Em Project Settings > Your Apps, copie as credenciais

### 2. Configurar variáveis de ambiente
Copie `.env.example` para `.env` e preencha:
```env
VITE_FIREBASE_API_KEY=sua_chave
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
```

### 3. Instalar e rodar
```bash
npm install
npm run dev
```

## Regras Firestore (recomendadas)
```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == uid;
    }
    match /posts/{doc} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.created_by;
    }
    match /{collection}/{doc} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Regras Storage
```js
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```
