//Importar módulo express
const express = require("express");

//Importar módulo fileupload
const fileupload = require("express-fileupload");


//Importar módulo express-handlebars
const { engine } = require("express-handlebars");

//Importar Mysql
const mysql = require("mysql2");

//App
const app = express();

//Habilitando o upload de arquivos
app.use(fileupload());

//Adicionar Bootstrap
app.use("/bootstrap", express.static("./node_modules/bootstrap/dist"));

//Adicionar css
app.use("/css", express.static("./css"));

//Referenciar a pasta de imagens
app.use("/imagens", express.static("./imagens"));

//Configuração do express-handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views')

//Manipulação de dados via rota
app.use(express.json());
app.use(express.urlencoded({extended:false}));

//Configuração de conexão
const conexao = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"1983",
    database:"projeto"
});

//Teste de conexão
conexao.connect(function(erro){
    if(erro) throw erro;
    console.log("Conexão com servidor OK👍🏾");
});


//Rota principal
app.get("/", function(req, res){
    //SQL
    let sql = "SELECT * FROM produtos";

    //Executar comando SQL
    conexao.query(sql, function(erro, retorno){
        res.render("formulario", {produtos:retorno});
    });
});

//Rota de cadastro
app.post("/cadastrar", function(req, res){
    //Obter os dados que serão utilizados para cadastro
    let nome = req.body.nome;
    let valor = req.body.valor;
    let imagem = req.files.imagem.nome;

    //SQL
    let sql = `INSERT INTO produtos (nome, valor, imagem) VALUES ("${nome}", ${valor}, "${imagem}")`;

    //Executar comando SQL
    conexao.query(sql, function(erro, retorno){
        //Caso ocorra algum erro
        if(erro) throw erro;

        //Caso ocorra o cadastro
        req.files.imagem.mv(__dirname+"/imagens/"+req.files.imagem.name);
        console.log(retorno);

    });

    //Retornar para a rota principal
    res.redirect("/");
});



//Servidor
app.listen(8080);