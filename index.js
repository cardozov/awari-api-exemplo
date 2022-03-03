const express = require('express')
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const style = `
<style>
    @import "compass/css3";

    @import url(https://fonts.googleapis.com/css?family=Stoke:400);

    .style-class {
        color: grey;
        font-size: 4vw;
        text-align: center;
        padding: 1em 0;
        font-family: 'stoke';
        letter-spacing: 0.1em;
        text-shadow:  
        0 -1px 0px darken(rgba(grey, 0.6),18%),
        0 -2px 0px darken(rgba(grey, 0.8),25%);
    }
</style>
`;

const buildMessage = msg => {
    return `${style}<h1 class="style-class">${msg}</h1>`
}

const methodMessage = method => `Sucesso, você acessou essa URL utilizando o verbo <a href="https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Methods/${method}">${method}</a>`

app.route('/metodo-http')
    .connect((req, res) => res.status(200).send(buildMessage(methodMessage('CONNECT'))))
    .delete((req, res) => res.status(200).send(buildMessage(methodMessage('DELETE'))))
    .get((req, res) => res.status(200).send(buildMessage(methodMessage('GET'))))
    .head((req, res) => res.status(200).send(buildMessage(methodMessage('HEAD'))))
    .options((req, res) => res.status(200).send(buildMessage(methodMessage('OPTIONS'))))
    .patch((req, res) => res.status(200).send(buildMessage(methodMessage('PATCH'))))
    .post((req, res) => res.status(200).send(buildMessage(methodMessage('POST'))))
    .put((req, res) => res.status(200).send(buildMessage(methodMessage('PUT'))))
    .trace((req, res) => res.status(200).send(buildMessage(methodMessage('TRACE'))));

app.get('/status/:status', (req, res) => {
    const { status } = req.params
    const statusList = {
        '100': `Continue`,
        '101': `Switching Protocols`,
        '103': `Early Hints`,
        '200': `OK`,
        '201': `Created`,
        '202': `Accepted`,
        '203': `Non-Authoritative Information`,
        '204': `No Content`,
        '205': `Reset Content`,
        '206': `Partial Content`,
        '300': `Multiple Choices`,
        '301': `Moved Permanently`,
        '302': `Found`,
        '303': `See Other`,
        '304': `Not Modified`,
        '307': `Temporary Redirect`,
        '308': `Permanent Redirect`,
        '400': `Bad Request`,
        '401': `Unauthorized`,
        '402': `Payment Required`,
        '403': `Forbidden`,
        '404': `Not Found`,
        '405': `Method Not Allowed`,
        '406': `Not Acceptable`,
        '407': `Proxy Authentication Required`,
        '408': `Request Timeout`,
        '409': `Conflict`,
        '410': `Gone`,
        '411': `Length Required`,
        '412': `Precondition Failed`,
        '413': `Payload Too Large`,
        '414': `URI Too Long`,
        '415': `Unsupported Media Type`,
        '416': `Range Not Satisfiable`,
        '417': `Expectation Failed`,
        '418': `I'm a teapot`,
        '422': `Unprocessable Entity`,
        '425': `Too Early`,
        '426': `Upgrade Required`,
        '428': `Precondition Required`,
        '429': `Too Many Requests`,
        '431': `Request Header Fields Too Large`,
        '451': `Unavailable For Legal Reasons`,
        '500': `Internal Server Error`,
        '501': `Not Implemented`,
        '502': `Bad Gateway`,
        '503': `Service Unavailable`,
        '504': `Gateway Timeout`,
        '505': `HTTP Version Not Supported`,
        '506': `Variant Also Negotiates`,
        '507': `Insufficient Storage`,
        '508': `Loop Detected`,
        '510': `Not Extended`,
        '511': `Network Authentication Required`
    }

    const mensagem = (statusList[status] === undefined)
    ? buildMessage(`O valor ${status} não corresponde a um status HTTP válido`)
    : buildMessage(`Status ${status} significa (${statusList[status]}). Saiba mais <a href="https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Status/${status}">AQUI</a>`)
    res.status(statusList[status] ? 200 : 500).send(style+mensagem)
})

app.listen(process.env.PORT || 3005, () => console.log('Server is running...'))