const express = require('express')
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const style = `
<style>
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300&display=swap');
    * {
        color: grey;
        text-align: center;
        padding: .2em 0;
        font-family: 'Roboto', sans-serif;
        letter-spacing: 0.1em;
        text-shadow:  
        0 -1px 0px darken(rgba(grey, 0.6),18%),
        0 -2px 0px darken(rgba(grey, 0.8),25%);
    }
    h1 {
        font-size: clamp(30px, 4vw, 55px);
    }
    p {
        font-size: clamp(15px, 2vw, 25px);
    }
</style>
`;

const buildMessage = msg => {
    return `${style}${msg}`
}

const methods = {
    GET: `O método <code>GET</code> solicita&nbsp;a representação de um recurso específico.&nbsp;Requisições utilizando o método <code>GET</code> devem retornar apenas dados.`,
    HEAD: `O método&nbsp;<code>HEAD</code>&nbsp;solicita uma resposta de forma idêntica ao método <code>GET</code>, porém sem conter o corpo da resposta.`,
    POST: `O método&nbsp;<code>POST</code>&nbsp;é utilizado para submeter uma entidade&nbsp;a um recurso&nbsp;específico, frequentemente causando uma mudança no estado do recurso ou efeitos colaterais no servidor.`,
    PUT: `O método <code>PUT</code> substitui todas as atuais representações do recurso de destino pela carga de dados da requisição.`,
    DELETE: `O método <code>DELETE</code> remove um recurso específico.`,
    CONNECT: `O método&nbsp;<code>CONNECT</code> estabelece um túnel para o servidor identificado pelo recurso de destino.`,
    OPTIONS: `O método&nbsp;<code>OPTIONS</code>&nbsp;é usado para descrever&nbsp;as opções de comunicação com o recurso de destino.`,
    TRACE: `O método&nbsp;<code>TRACE</code> executa um teste de chamada <em>loop-back</em> junto com o caminho para o recurso de destino.`,
    PATCH: `O método&nbsp;<code>PATCH</code>&nbsp;é utilizado para aplicar modificações parciais em um recurso.`
}

const methodMessage = method => `
    <h1>Método ${method}</h1>
    <p>${methods[method]}</p>
    <p>Saiba mais <a href="https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Methods/${method}">AQUI</a></p>`

app.get('/metodo/CONNECT', (req, res) => res.status(200).send(buildMessage(methodMessage('CONNECT'))))
app.get('/metodo/DELETE', (req, res) => res.status(200).send(buildMessage(methodMessage('DELETE'))))
app.get('/metodo/GET', (req, res) => res.status(200).send(buildMessage(methodMessage('GET'))))
app.get('/metodo/HEAD', (req, res) => res.status(200).send(buildMessage(methodMessage('HEAD'))))
app.get('/metodo/OPTIONS', (req, res) => res.status(200).send(buildMessage(methodMessage('OPTIONS'))))
app.get('/metodo/PATCH', (req, res) => res.status(200).send(buildMessage(methodMessage('PATCH'))))
app.get('/metodo/POST', (req, res) => res.status(200).send(buildMessage(methodMessage('POST'))))
app.get('/metodo/PUT', (req, res) => res.status(200).send(buildMessage(methodMessage('PUT'))))
app.get('/metodo/TRACE', (req, res) => res.status(200).send(buildMessage(methodMessage('TRACE'))));
app.get('/metodo/:method', (req, res) => res.status(200).send(buildMessage(`<p>O termo ${req.params.method.toUpperCase()} não é um método válido no HTTP</p>`)));

app.get('/status/:status', (req, res) => {
    const { status } = req.params
    const statusList = {
        100: ['Continuar', `<p>Isso significa que o servidor recebeu os cabeçalhos da solicitação; e que o cliente deve proceder para enviar o corpo do pedido (no caso de haver um pedido, um corpo deve ser enviado, por exemplo, um POST pedido).</p><p>Se este corpo é grande, enviá-lo a um servidor, se o pedido já foi rejeitado, com base em cabeçalhos inadequados, é ineficiente.</p><p>Para ter um cheque do servidor se o pedido pode ser aceito com base no pedido de cabeçalhos sozinho, o cliente deve enviar: Esperar 100-continue, como um cabeçalho no seu pedido inicial e verificar se a "100 Continuar", código de status, é recebido em resposta antes de permanente (ou receber "417 Falha" na expectativa e não continuar).</p>`],
        101: ['Mudando protocolos', `<p>Isso significa que o solicitante pediu ao servidor para mudar os protocolos; e este está reconhecendo que irá fazê-lo.</p>`],
        102: ['Processamento (WebDAV) (RFC 2518)', `<p>Como uma solicitação WebDAV pode conter muitos sub-pedidos que envolvam operações de arquivo, pode demorar muito tempo para concluir o pedido.</p><p>Este código indica que o servidor recebeu e está processando o pedido, mas ainda nenhuma resposta está disponível.</p><p>Isso impede que o cliente ultrapasse o tempo limite e assuma que a requisição tenha sido perdida.</p>`],
        122: ['Pedido-URI muito longo', `<p>Este é um padrão IE7.</p><p>Somente código não significa que o URI é mais do que um máximo de 2083 caracteres.</p><p>(Ver código 414).</p>`],
        200: ['OK', `<p>Estas requisição foi bem sucedida. O significado do sucesso varia de acordo com o método HTTP</p>`],
        201: ['Criado', `<p>O pedido foi cumprido e resultou em um novo recurso que está sendo criado.</p>`],
        202: ['Aceito', `<p>O pedido foi aceito para processamento, mas o tratamento não foi concluído.</p><p>O pedido poderá ou não vir a ser posto em prática, pois pode ser anulado quando o processamento ocorre realmente.</p>`],
        203: ['não-autorizado (desde HTTP/1.1)', `<p>O servidor processou a solicitação com sucesso, mas está retornando informações que podem ser de outra fonte.</p>`],
        204: ['Nenhum conteúdo', `<p>O servidor processou a solicitação com sucesso, mas não é necessária nenhuma resposta.</p>`],
        205: ['Reset', `<p>O servidor processou a solicitação com sucesso, mas não está retornando nenhum conteúdo.</p><p>Ao contrário da 204, esta resposta exige que o solicitante redefina a exibição de documento.</p>`],
        206: ['Conteúdo parcial', `<p>O servidor está entregando apenas parte do recurso devido a um "cabeçalho intervalo" enviado pelo cliente.</p><p>O cabeçalho do intervalo é usado por ferramentas como wget para permitir retomada de downloads interrompidos; ou dividir um download em vários fluxos simultâneos.</p>`],
        207: ['Status Multi (WebDAV) (RFC 4918)', `<p>O corpo da mensagem que se segue é um XML da mensagem e pode conter um número de códigos de resposta individual, dependendo de quantos sub-pedidos foram feitos.</p>`],
        300: ['Múltipla escolha', `<p>Indica várias opções para o recurso que o cliente pode acompanhar.</p><p>É, por exemplo, usado para apresentar opções de formato diferente para o vídeo; arquivos de lista com diferentes extensões; ou desambiguação do sentido da palavra.</p>`],
        301: ['Movido', `<p>Esta e todas as solicitações futuras devem ser direcionadas para o URL.</p>`],
        302: ['Encontrado', `<p>Este é um exemplo de boas práticas industriais contradizendo a norma.</p><p>A especificação HTTP/1.0 (RFC 1945) exigia ao cliente executar um redirecionamento temporário (a frase original que descreve o método era "Movido temporariamente"), mas os browsers populares executavam o 302 com a funcionalidade de um "303 Consulte Outros".</p><p>Por isso, o HTTP/1.1 acrescentou os códigos de status 303 e 307 para distinguir entre os dois comportamentos.</p><p>No entanto, a maioria das aplicações Web e os frameworks ainda usam o código de status 302 como se fosse o 303.</p>`],
        303: ['Consulte Outros', `<p>A resposta a esta requisição pode ser encontrada sob outro URI usando o método GET.</p><p>Quando recebido em resposta a um POST (ou PUT/DELETE), o cliente deve presumir que o servidor recebeu os dados e deve enviar uma nova requisição GET para o URI dado.[1]</p>`],
        304: ['Não modificado', `<p>Indica que o recurso não foi modificado desde o último pedido.</p><p>Normalmente, o cliente fornece um cabeçalho HTTP do tipo If-Modified-Since ou If-None-Match para proporcionar um tempo contra o qual para comparar.</p><p>Usar este cabeçalho poupa largura de banda e reprocessamento no servidor e cliente, uma vez que apenas os dados do cabeçalho são enviados e recebidos; e são utilizados os dados armazenados em cache.</p>`],
        305: ['Use Proxy (desde HTTP/1.1)', `<p>Muitos clientes HTTP (como o Mozilla e Internet Explorer) podem não tratar corretamente as respostas com este código de status, principalmente por razões de segurança.</p>`],
        306: ['Proxy Switch', `<p>Mudança de proxy.</p><p>Deixou de ser usado.</p>`],
        307: ['Redirecionamento temporário (desde HTTP/1.1)', `<p>Nesta ocasião, o pedido deve ser repetido com outro URI, mas futuras solicitações ainda pode usar o URI original.</p><p>Em contraste com o 303, o método de pedido não deve ser mudado quanto à reedição do pedido original.</p><p>Por exemplo, uma solicitação POST deve ser repetida com outro pedido POST.</p>`],
        308: ['Redirecionamento permanente (RFC 7538[2])', `<p>Indica que o recurso foi movido para um novo URI permanente e todas as requisições futuras devem usar um dos URIs retornados.</p><p>Os códigos 307 e 308 são similares ao comportamento dos códigos 302 e 301, mas não permitem que o método HTTP seja modificado.</p>`],
        400: ['Requisição inválida', `<p>O pedido não pôde ser entregue devido à sintaxe incorreta.</p>`],
        401: ['Não autorizado', `<p>Semelhante ao 403 Proibido, mais especificamente para o uso quando a autenticação é possível, mas não conseguiu ou ainda não foram fornecidos.</p><p>A resposta deve incluir um cabeçalho do campo www-authenticate contendo um desafio aplicável ao recurso solicitado.</p><p>Veja autenticação de acesso Basic e Digest.</p>`],
        402: ['Pagamento necessário', `<p>Reservado para uso futuro.</p><p>A intenção original era que esse código pudesse ser usado como parte de alguma forma de dinheiro digital ou esquema de micro pagamento, mas isso não aconteceu; e esse código não é usado normalmente.</p>`],
        403: ['Proibido', `<p>O pedido é reconhecido pelo servidor, mas este recusa-se a executá-lo.</p><p>Ao contrário da resposta "401 Não Autorizado", aqui a autenticação não fará diferença e o pedido não deve ser requisitado novamente.</p>`],
        404: ['Não encontrado', `<p>O recurso requisitado não foi encontrado, mas pode ser disponibilizado novamente no futuro.</p><p>As solicitações subsequentes pelo cliente são permitidas.</p>`],
        405: ['Método não permitido', `<p>Foi feita uma solicitação de um recurso usando um método de pedido que não é compatível com esse recurso, por exemplo, usando GET em um formulário, que exige que os dados sejam apresentados via POST, PUT; ou usados em um recurso somente de leitura.</p>`],
        406: ['Não Aceitável', `<p>O recurso solicitado é apenas capaz de gerar conteúdos não aceitáveis ​​de acordo com os cabeçalhos Accept enviados na solicitação.</p>`],
        407: ['Autenticação de proxy necessária', `<p>O acesso está vinculado a um túnel de proxy e deve ser autenticado por meio de credenciais.</p><p>Este vínculo pode ter sido configurado pelos administradores do conteúdo ao qual o acesso foi solicitado pelo usuário; ou pelos administradoras da rede a qual o usuário está conectado.</p><p>Este último exige a autenticação para acesso a todos os conteúdos listados pelos administradores da rede.</p>`],
        408: ['Tempo de requisição esgotou (Timeout)', `<p>O servidor sofreu timeout ao aguardar a solicitação.</p><p>De acordo com as especificações HTTP W3: "O cliente não apresentou um pedido dentro do tempo que o servidor estava preparado para esperar.</p><p>O cliente PODE repetir o pedido sem modificações a qualquer momento mais tarde."</p>`],
        409: ['Conflito geral', `<p>Indica que a solicitação não pôde ser processada por causa do conflito no pedido, como um conflito de edição.</p>`],
        410: ['Gone', `<p>Indica que o recurso solicitado não está mais disponível; e também não estará novamente.</p><p>Isto deve ser usado quando um recurso foi intencionalmente removido e os recursos devem ser removidos.</p><p>Ao receber um código de estado 410, o cliente não deverá solicitar o recurso novamente no futuro.</p><p>Clientes como motores de busca devem remover o recurso de seus índices.</p><p>A maioria dos casos de uso não necessitam de clientes e motores de busca para purgar o recurso, e um "404 Not Found" pode ser utilizado.</p>`],
        411: ['Comprimento necessário', `<p>O pedido não especifica o comprimento do seu conteúdo, o que é exigido pelo recurso solicitado.</p>`],
        412: ['Pré-condição falhou', `<p>O servidor não cumpre uma das condições que o solicitante coloca na solicitação.</p>`],
        413: ['Entidade de solicitação muito grande', `<p>A solicitação é maior do que o servidor está disposto ou capaz de processar.</p>`],
        414: ['Pedido-URI Too Long', `<p>O URI fornecido foi muito longo para ser processado pelo servidor.</p>`],
        415: ['Tipo de mídia não suportado', `<p>A entidade tem um pedido tipo de mídia que o servidor ou o recurso não tem suporte.</p><p>Por exemplo, o cliente carrega uma imagem como image / svg + xml, mas o servidor requer que as imagens usem um formato diferente.</p>`],
        416: ['Solicitação de Faixa Não Satisfatória', `<p>O cliente solicitou uma parte do arquivo, mas o servidor não pode fornecer essa parte.</p><p>Por exemplo, se o cliente pediu uma parte do arquivo que está para além do final deste.</p>`],
        417: ['Falha na expectativa', `<p>O servidor não pode cumprir as exigências do campo de cabeçalho "Espere-pedido".</p>`],
        418: ['Eu sou um bule de chá', `<p>Este código foi definido em 1998 como uma das tradicionais brincadeiras de 1º de abril da IETF, na RFC 2324, Hyper Text Cafeteira Control Protocol; e não é esperado para ser implementado por servidores HTTP reais.</p>`],
        422: ['Entidade improcessável (WebDAV) (RFC 4918)', `<p>O pedido foi bem formado, mas era incapaz de ser seguido devido a erros de semântica.</p>`],
        423: ['Fechado (WebDAV) (RFC 4918)', `<p>O recurso que está sendo acessado está bloqueado.</p>`],
        424: ['Falha de Dependência (WebDAV) (RFC 4918)', `<p>A solicitação falhou devido à falha de uma solicitação anterior (por exemplo, um PROPPATCH).</p>`],
        425: ['Coleção não ordenada (RFC 3648)', `<p>Definido em projectos de "WebDAV Protocolo de Coleções Avançadas", mas não está presente no "Web Distributed Authoring and Versioning (WebDAV) Protocolo de Coleções Ordenadas".</p>`],
        426: ['Upgrade Obrigatório (RFC 2817)', `<p>O cliente deve mudar para um outro protocolo, como TLS/1.0.</p><p>Resposta n º 444 Uma extensão Nginx do servidor HTTP.</p><p>O servidor não retorna nenhuma informação para o cliente e fecha a conexão (útil como um impedimento para malware).</p><p>Com 449 Repetir Uma extensão da Microsoft.</p><p>O pedido deve ser repetido após a realização da ação apropriada.</p>`],
        429: ['Pedidos em excesso', `<p>O usuário enviou muitas solicitações em um determinado período de tempo ("limitação de taxa").</p>`],
        450: ['Bloqueados pelo Controle de Pais do Windows', `<p>Uma extensão da Microsoft.</p><p>Este erro é dado quando Parental Controls do Windows estão ativados e estão bloqueando o acesso à determinada página da web.</p>`],
        499: ['Cliente fechou Pedido (utilizado em ERPs/VPSA)', `<p>Uma extensão Nginx do servidor HTTP.</p><p>Este código é introduzido para registrar o caso em que a conexão fechada pelo cliente ao servidor HTTP é o processamento de seu pedido, fazendo com que o servidor não consiga enviar o cabeçalho HTTP de volta.</p>`],
        500: ['Erro interno do servidor (Internal Server Error)', `<p>Indica um erro do servidor ao processar a solicitação. Indica que  encontrou uma condição inesperada e que o impediu de atender à solicitação.`],
        501: ['Não implementado (Not implemented)', `<p>O servidor ainda não suporta a funcionalidade ativada.</p>`],
        502: ['Bad Gateway', `<p>Indica que o servidor, enquanto atuando como um servidor intermediário (gateway ou proxy), recebeu uma resposta inválida do servidor para o qual a requisição foi encaminhada (upstream server).</p>`],
        503: ['Serviço indisponível (Service Unavailable)', `<p>O servidor está em manutenção ou não consegue dar conta dos processamentos de recursos devido à sobrecarga do sistema.</p><p>Isto deve ser uma condição temporária.</p>`],
        504: ['Gateway Time-Out', `<p>É caracterizado por erros particulares do site em questão.</p><p>Pode ser que este esteja em manutenção ou não exista.</p>`],
        505: ['HTTP Version not supported', `<p>A maioria dos browsers assumem que os servidores de rede suportam versões 1.x do protocolo HTTP.</p><p>Na prática, as versões muito antigas como a 0.9 são pouco utilizadas atualmente, não apenas porque eles fornecem pouca segurança e desempenho mais baixo do que as versões mais recentes do protocolo.</p><p>Então, se acontecer esse erro no seu navegador de rede, a única opção é fazer o upgrade do software do servidor de rede.</p><p>Se a versão da solicitação 1.x falhar, pode ser porque o servidor de rede está suportando versões incorretas do protocolo 1.x, em vez de não suportá-las.</p>`],
    }

    const mensagem = (statusList[status] === undefined)
    ? `<p>O valor ${status} não corresponde a um status HTTP válido</p>`
    : `<h1>Status ${status} - ${statusList[status][0]}</h1>
        <p>${statusList[status][1]}</p>
        <p>Saiba mais <a href="https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Status/${status}">AQUI</a></p>`
    res.status(statusList[status] ? 200 : 500).send(buildMessage(mensagem))
})

app.listen(process.env.PORT || 3005, () => console.log('Server is running...'))