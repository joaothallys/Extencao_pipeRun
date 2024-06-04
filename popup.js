
//const apiUrl = `https://api.superlogica.net/v2/financeiro/cobranca?&dtInicio=05/20/2024&dtFim=05/20/2024&status=pendentes`;
let url_sp;
const secret = 'cac596a0-f0e2-424e-89ff-8601836c5ced';
const access_token = '30a5fec1-1768-4d2d-b0d2-e6efba31df72';
const app_token = 'b6620bde-d553-4fc7-a9a8-4ba32de14d23';


const fetchCobrancas = async () => {
    const dataInicioInput = document.getElementById('dataInicio');
    const dataFimInput = document.getElementById('dataFim');

    const dataInicio = dataInicioInput.value;
    const dataFim = dataFimInput.value;


    const apiUrl = `https://api.superlogica.net/v2/financeiro/cobranca?&dtInicio=${dataInicio}&dtFim=${dataFim}&status=pendentes`;

    //url_sp = apiUrl;

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'secret': secret,
                'access_token': access_token,
                'app_token': app_token
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao obter cobranças');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar cobranças:', error);
        return null;
    }
};


function formatDateMMDDYYYY(date) {
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const dd = String(date.getDate()).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
}


function formatDateDDMMYYYY(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}


// Função para formatar a data no padrão "m/d/Y"
function formatDate(dateString) {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();

    // Adiciona zero à esquerda para garantir dois dígitos para dia e mês
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;

    return `${formattedDay}/${formattedMonth}/${year}`;
    
}

async function createCSVFile() {
    try {
        const cobrancas = await fetchCobrancas();

        if (!cobrancas) {
            throw new Error('Não foi possível obter as cobranças');
        }

        //const dt_vencimento_recb = formatDateDDMMYYYY(new Date()); // Formata a data no padrão "dia/mês/ano"
        //const link_2via = 'http://example.com'; // Atualize este link conforme necessário

        const csvRows = cobrancas.map(contact => {
            const name = contact.st_nomeref_sac || '';
            const phone = contact.st_telefone_sac || '';
            const link_2via = contact.link_2via || '';
            const parametros = `["${link_2via}"]`; // Tente assim: const parametros = `["${dt_vencimento_recb}","${link_2via}"]`;

            return `${name},${phone},${parametros}`;
        });

        csvRows.unshift('nome,telefone,parametros');

        const csvData = csvRows.join('\n');

        const blob = new Blob([csvData], { type: 'text/csv' });

        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'contacts.csv';

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        return blob;

    } catch (error) {
        console.error('Erro ao criar arquivo CSV:', error);
        document.getElementById('errorMessageCSV').innerText = 'Erro: ' + error.message;
        throw error;
    }
}

document.getElementById('listarEmpresasBtn').addEventListener('click', async () => {
    try {
        const empresas = await listarEmpresas();
        exibirEmpresas(empresas);
    } catch (error) {
        console.error('Erro ao listar empresas:', error);
    }
});

const listarEmpresas = async () => {
    const dataInicioInput = document.getElementById('dataInicio');
    const dataFimInput = document.getElementById('dataFim');

    const dataInicio = dataInicioInput.value;
    const dataFim = dataFimInput.value;


    const apiUrl = `https://api.superlogica.net/v2/financeiro/cobranca?&dtInicio=${dataInicio}&dtFim=${dataFim}&status=pendentes`;

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'secret': secret,
                'access_token': access_token,
                'app_token': app_token
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao obter empresas');
        }

        const data = await response.json();
        return data; // Retorna os nomes das empresas
    } catch (error) {
        console.error('Erro ao listar empresas:', error);
        throw error;
    }
};



function exibirEmpresas(empresas) {
    const listaEmpresas = document.getElementById('listaEmpresas');
    listaEmpresas.innerHTML = ''; // Limpa a lista de empresas antes de adicionar novas

    empresas.forEach(empresa => {
        const listItem = document.createElement('li');
        listItem.textContent = empresa.st_nomeref_sac; // Supondo que o nome da empresa esteja em 'st_nomeref_sac'
        listaEmpresas.appendChild(listItem);
    });
}



// Botão de fazer campanha
const addContactBtn = document.getElementById('addContactBtn');

addContactBtn.addEventListener('click', function () {
    // Chama a função sendCSVFile quando o botão for clicado
    sendCSVFile();
});


const apiUrl2 = 'https://disparador.poli.digital/trigger/broker/47715/56509/85038';
const token2 = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjA3MzVkZDI0NWNhOTU0MDA2YmM0OTYwMmE0ODgyNmE0ZDNkOGNlY2FmOTA3NjExZDE4MGNlYWZhYmIxNTgwMjc1MTYyNzBiMGRiNGZkNWY4In0.eyJhdWQiOiIxMTAiLCJqdGkiOiIwNzM1ZGQyNDVjYTk1NDAwNmJjNDk2MDJhNDg4MjZhNGQzZDhjZWNhZjkwNzYxMWQxODBjZWFmYWJiMTU4MDI3NTE2MjcwYjBkYjRmZDVmOCIsImlhdCI6MTcxMjU5NDIzNywibmJmIjoxNzEyNTk0MjM3LCJleHAiOjE3NDQxMzAyMzcsInN1YiI6IjgyNTAwIiwic2NvcGVzIjpbXX0.UVcAqGHo14nfOjC8CPghcPrSyd0H4YFvnSqLGYwmTx9oOQE72FkD3tL1WxRor_86PfpuOWgPYWFtpybHgDpGsqMxUTDunu0SpAKsemgHnOveWKVwl-ifckHZaP38_X6BQealVJNcAECUTgWkOZVsQll1phbXvZO5DLMlUYnLEhEZsFW-P9QaYMXd53FnnVk7RfU1t_GDIDQuLZBGNTpGuAYwqvSO00ztyfRsaG5cQT0qr_vsFgimnbJTQvvCyqZMm3eZ8qRIpNZoNBx9mfAn2E8ihN2sSMGNaMGI9ASauiGS61ihpyjHB70JZJ5XCOj_MNxuCebk6ASCAVwDHeh51IAO62LvkFnSxquBNMD8EqP5m_2Jg9nhap3W7xtNV2y6W-ZXIgPyQ9ume337L7PlbfeEi7c7IZ5TRNCI1TcCvBqnJcI8vRxIGseFsQm1bd6K0sNqE5D9gmAOteWyJlDnvKkRtwa-NR8DjioIYESMM6bMKgaTRrXFIDvL-HZ8D7NVa6hvPH2Kk6WigM63yFf92pTOENfxfuIroieVfu_Gvlog-fIqVhy5RUYTMoMmmaZ5xf4zA-38lvEPm4RDjbFU6X7Zae68LpAUppW_mInVLd6gw4_JdGBXiWMKPvkeMPnKUsFnUxPblsl_PNEOZ6S6EtgxknpQvgcS5YkcdxwNwng';

const sendCSVFile = async () => {

    try {

        addContactBtn.classList.add('loading');
        addContactBtn.disabled = true
        const cobrancas = await fetchCobrancas(fetchCobrancas);
        if (!cobrancas) {
            console.error('Erro ao obter cobranças');
            return;
        }
        const blob = await createCSVFile();


        // Chama a função createCSVFile para obter o Blob do CSV

        const campo1 = document.getElementById('campo1').value;
        const campo2 = document.getElementById('campo2').value;
        const campo3 = document.getElementById('campo3').value;
        //const send_text = document.getElementById('mensagem').value;
        const email = document.getElementById('email').value;

        const entry_msg = `*Mensagem Automática*\n\nOlá prezado(a) cliente, para sua comodidade, deixaremos o link do seu boleto abaixo:\n\n[custom]`;


        const formData = new FormData();
        formData.append('entry_link_image', '');
        formData.append('entry_create_tag', campo3);
        formData.append('entry_file', blob, 'contacts.csv');
        formData.append('entry_tag', '');
        formData.append('entry_image', '');
        formData.append('entry_email', 'jlemes796@gmail.com');
        formData.append('entry_international_phone', true);
        formData.append('entry_msg', entry_msg);
        formData.append('entry_chat_close', campo1);
        formData.append('entry_deduplicate_contact', campo2);



        const response = await fetch(apiUrl2, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'entry-authorization-token': `Bearer ${token2}`,
                'Connection': 'keep-alive',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept': "*/*"
            },
            body: formData

        });

        if (response.ok) {
            console.log('Solicitação POST bem-sucedida.');
            document.getElementById('successMessage').style.display = 'block';
            document.getElementById('errorMessage').style.display = 'none';
            document.getElementById('errorMessage2').style.display = 'none';
        } else {
            console.error('Erro ao enviar solicitação POST:', response.statusText);
            document.getElementById('successMessage').style.display = 'none';
            document.getElementById('errorMessage').style.display = 'block';
            document.getElementById('errorMessage2').style.display = 'none';
        }
    } catch (error) {
        console.error('Erro ao enviar solicitação POST:', error);
        document.getElementById('successMessage').style.display = 'none';
        document.getElementById('errorMessage').style.display = 'none';
        document.getElementById('errorMessage2').innerText = 'Erro: ' + error.message;
        document.getElementById('errorMessage2').style.display = 'block';
    } finally {
        addContactBtn.classList.remove('loading');
        addContactBtn.disabled = false; // Re-enable the button after loading
    }
}
