# 🎬 CineMatch Pro

Projeto desenvolvido para a disciplina **DEWFE – Desenvolvimento Web Front End** do curso Superior de Tecnologia em Análise e Desenvolvimento de Sistemas – **SENAI / UniSENAI**.

**Professor:** Me. Heber Gustavo Xavier de Castro  
**Atividade:** Reposição de Aula – 13/06/2026

---

## 📁 Estrutura de Pastas

```
/CineMatch-Pro          ← Pasta Raiz
├── index.html          ← Página de Cadastro
├── catalogo.html       ← Página da Videoteca
├── README.md
├── /css
│   └── style.css       ← Folha de estilo unificada
├── /js
│   ├── main.js         ← Lógica do formulário (index.html)
│   └── display.js      ← Renderização dinâmica (catalogo.html)
└── /img
    └── (ícones e logotipos)
```

---

## ✅ Funcionalidades

- **Formulário elegante** com `label` vinculado ao `input` por `id`
- **Classe `Filme`** para instanciar objetos com `crypto.randomUUID()`
- **Persistência com `localStorage`**: dados salvos em `index.html` aparecem em `catalogo.html`
- **Renderização dinâmica** com `forEach` + `innerHTML` (sem frameworks)
- **Filtros**: busca por título, gênero e ordenação
- **Estatísticas** com `.reduce()` (total de minutos, gênero favorito, nota média)
- **Modal de trailer** com `iframe` do YouTube gerado via embed
- **Preview de capa** em tempo real ao digitar a URL
- **Link "Sugestões"** aponta para IMDb Top Chart com `target="_blank"`
- Grid responsivo: mínimo 3 colunas no desktop, 2 no mobile
- `object-fit: cover` em todas as imagens de capa
- Apenas `const` e `let` — `var` banido
- Sem `<br>` para espaçamento — uso exclusivo de `margin`/`padding`

---

## 🧪 Critérios de Avaliação

| Peso | Critério |
|------|----------|
| 20%  | Tags HTML5 semânticas + `alt` descritivo em todas as imagens |
| 30%  | Layout responsivo, Flexbox/Grid, design "arejado" e moderno |
| 30%  | Classes, LocalStorage e renderização dinâmica corretos |
| 20%  | Código indentado, pastas organizadas, histórico de commits no GitHub |

---

## 🚀 Deploy no GitHub Pages

1. Crie um repositório no GitHub com o nome **`unisenai-cinematch-pro`**
2. Faça o push de todos os arquivos:
   ```bash
   git init
   git add .
   git commit -m "feat: projeto CineMatch Pro completo"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/unisenai-cinematch-pro.git
   git push -u origin main
   ```
3. No repositório → **Settings** → **Pages** → Source: `main` / `/ (root)` → **Save**
4. Acesse: `https://SEU_USUARIO.github.io/unisenai-cinematch-pro/`
5. Envie os dois links no AVA:
   - Link do repositório: `https://github.com/SEU_USUARIO/unisenai-cinematch-pro`
   - Link da aplicação: `https://SEU_USUARIO.github.io/unisenai-cinematch-pro/`
