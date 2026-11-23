# BiblioTech — Operação Nuvem Literária

Aplicação web de gestão de acervo de livros (cadastro, listagem, pesquisa, edição e exclusão), publicada em produção com Docker, Docker Hub e Render.

## Tecnologias
- Frontend: React + Vite + Axios
- Backend: Node.js + Express (Service Pattern)
- Banco de dados: PostgreSQL
- Containerização: Docker (Nginx servindo o frontend)
- Hospedagem: Render (Web Services com Existing Image + PostgreSQL)

## Arquitetura
Navegador → Frontend (Nginx, Render) → API Express (Render) → PostgreSQL (Render)

A API segue o padrão Controller → Service → Repository.

## Variáveis de ambiente
**Backend**
- `DATABASE_URL`: URL de conexão do PostgreSQL
- `CORS_ORIGIN`: URL pública do frontend
- `PORT`: definida automaticamente pelo Render
- `DB_SSL`: `true` apenas se usar a URL externa do banco

**Frontend**
- `VITE_API_URL`: URL pública da API (termina em `/api`), embutida na imagem no momento do build.

## Como executar localmente
```bash
docker network create bibliotech-net
docker run -d --name pg --network bibliotech-net -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=books_db postgres:16-alpine
docker build -t bibliotech-backend ./backend
docker run -d --name api --network bibliotech-net -p 3001:3001 -e PORT=3001 -e DATABASE_URL=postgresql://postgres:postgres@pg:5432/books_db -e CORS_ORIGIN=http://localhost:8080 bibliotech-backend
docker build --build-arg VITE_API_URL=http://localhost:3001/api -t bibliotech-frontend ./frontend
docker run -d --name web -p 8080:80 bibliotech-frontend
```
Acesse http://localhost:8080

## Processo de containerização
- `backend/Dockerfile`: imagem `node:20-alpine`, instala apenas dependências de produção e executa `node src/server.js`.
- `frontend/Dockerfile`: build multi-stage. O Vite gera os arquivos estáticos (recebendo `VITE_API_URL` como build-arg) e o Nginx os serve, com fallback para `index.html` (roteamento SPA).
- As imagens foram publicadas com `docker push` e usadas no Render pela opção Existing Image.

## Links de entrega
- Docker Hub (Frontend): https://hub.docker.com/r/victorsantos01/bibliotech-frontend
- Docker Hub (Backend): https://hub.docker.com/r/victorsantos01/bibliotech-backend
- Frontend (Render): [[URL DO FRONTEND]]
- API (Render): [[URL DA API]]/api/books
- GitHub: https://github.com/[[SEU_USUARIO_GITHUB]]/bibliotech-deploy

## Maior desafio técnico
O maior desafio deste projeto foi construir o raciocínio de como levar a aplicação do localhost para a nuvem: entender o que precisava ser feito, em que ordem e como fazer. Na parte técnica, a principal dificuldade foi compreender que o frontend em Vite recebe a variável VITE_API_URL no momento do build da imagem Docker, e não em tempo de execução. Por isso, foi necessário publicar primeiro o backend no Render para obter a URL pública da API, só depois construir a imagem do frontend com essa URL e, por fim, configurar o CORS_ORIGIN no backend com o endereço do frontend para que os dois serviços se comunicassem. Também enfrentei ajustes durante a containerização, como o Docker exigir nomes de imagem em letras minúsculas ao gerar as tags para o Docker Hub. Como consegui resolver essas dúvidas com pesquisa, conciliar o tempo para concluir a atividade não foi um problema. Foi um grande desafio, mas muito divertido, pois pude colocar em prática o que aprendi em aula.
