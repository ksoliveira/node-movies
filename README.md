# Golden Raspberry Awards API

API desenvolvida em Node.js para análise de produtores vencedores do **Golden Raspberry Awards**, com foco em identificar os menores e maiores intervalos entre vitórias consecutivas.

---

## **Funcionalidades**

- Processar dados de filmes a partir de um arquivo CSV.
- Calcular os menores e maiores intervalos entre vitórias consecutivas de produtores.
- Retornar os resultados em formato JSON através de um endpoint.

---

## **Tecnologias Utilizadas**

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) para manipulação do banco de dados SQLite.
- [csv-parser](https://www.npmjs.com/package/csv-parser) para leitura de arquivos CSV.
- [Jest](https://jestjs.io/) e [Supertest](https://github.com/ladjs/supertest) para testes automatizados.

---

## **Como Executar o Projeto**

1. Clone o repositório:
   ```bash
   git clone https://github.com/ksoliveira/node-movies.git
   ```
2. Acesse o diretório do projeto:
   ```bash
   cd node-movies
   ```
3. Certifique-se de estar na branch 'main'
4. Recomenda-se usar a versão do 20 ou superior do nodejs  
5. Instale as dependências:

   ```bash
   npm install
   ```
6. Certifique-se de que o arquivo `movielist.csv` está localizado em `src/csv/data/movielist.csv`.
7. Inicie o servidor:
   ```bash
   npm run start
   ```

---

## **Uso**

Em ambiente de desenvolvimento, a API estará disponível em `http://localhost:3000`.

### **Exemplo de Requisição**
Faça uma requisição `GET` para o endpoint `/producers/intervals`:
```bash
curl http://localhost:3000/producers/intervals
```

#### **Resposta de Exemplo**
```json
{
  "min": [
    {
      "producer": "Producer 1",
      "interval": 1,
      "previousWin": 1980,
      "followingWin": 1981
    }
  ],
  "max": [
    {
      "producer": "Producer 2",
      "interval": 60,
      "previousWin": 1920,
      "followingWin": 1980
    }
  ]
}
```

#### **Códigos de Status**
- **200**: Dados retornados com sucesso.
- **204**: Nenhum intervalo encontrado.
- **404**: Rota inexistente.
- **405**: Método HTTP não permitido.
- **500**: Erro interno no servidor.

---

## **Testes**

O projeto inclui testes automatizados para validar o comportamento da API.

### **Como Executar os Testes**
1. Execute o comando:
   ```bash
   npm run test
   ```

2. Os testes cobrem os seguintes cenários:
   - Retorno de **200** com intervalos calculados corretamente.
   - Retorno de **204** quando não há intervalos.
   - Retorno de **404** para rotas inexistentes.
   - Retorno de **405** para métodos HTTP não permitidos.
   - Retorno de **500** em caso de erro interno ou tabela ausente.

---

## **Estrutura do Projeto**

```
node-movies/
├── src/
│   ├── app.js                     # Configuração principal do servidor Express
│   ├── database/
│   │   └── database.js            # Configuração do banco de dados SQLite
│   ├── routes/
│   │   └── intervals.js           # Rota principal para análise de intervalos
│   ├── utils/
│   │   ├── calculateIntervals.js  # Lógica para calcular intervalos
│   │   └── parseWinnersAwards.js  # Acessa o banco em memória e organiza produtores e intervalos
│   └── csv/
│       ├── data/
│       │   └── movielist.csv      # Arquivo de entrada com dados dos filmes
│       └── moviesFromCSV.js       # Arquivo que lê o CSV e insere no banco de dados em memória
├── tests/
│   └── routes/
│       └── intervals.test.js      # Testes automatizados para o endpoint
├── .gitignore
├── index.js                       # Início de tudo: chama insertMoviesFromCSV e inicia o server
├── jest.config.js
├── package.lock.json
├── package.json
└── README.md
```

