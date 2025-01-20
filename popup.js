const token = 'SEU_TOKEN_AQUI';

const customFieldValues = {
    canal: [],
    categoria: [],
    origem: [],
    nivel: [],
    motivo: [],
    setor: [],
    submotivo: [],
    company: []  // To store companies as objects with id and name
};

document.addEventListener('DOMContentLoaded', async () => {
    await fetchCustomFieldValues();
    await fetchCompanies();

    document.getElementById('addOpportunityBtn').addEventListener('click', async () => {
        const title = document.getElementById('title').value;
        const companyName = document.getElementById('companySearch').value;
        const selectedCompany = customFieldValues.company.find(c => c.name === companyName);
        const company_id = selectedCompany ? selectedCompany.id : null;
        const customFields = [
            { id: 27555, value: document.querySelector('#canalSearch').value },
            { id: 56417, value: document.querySelector('#categoriaSearch').value },
            { id: 56420, value: document.querySelector('#origemSearch').value },
            { id: 56486, value: document.querySelector('#nivelSearch').value },
            { id: 56414, value: document.querySelector('#motivoSearch').value },
            { id: 56475, value: document.querySelector('#setorSearch').value },
            { id: 56422, value: document.querySelector('#submotivoSearch').value },
        ];

        const success = await postOpportunity(title, company_id, customFields);
        if (success) {
            document.getElementById('successMessage').style.display = 'block';
        } else {
            document.getElementById('errorMessage').style.display = 'block';
        }
    });

    document.getElementById('canalSearch').addEventListener('input', () => filterOptions('canalSearch', 'canalList'));
    document.getElementById('categoriaSearch').addEventListener('input', () => filterOptions('categoriaSearch', 'categoriaList'));
    document.getElementById('origemSearch').addEventListener('input', () => filterOptions('origemSearch', 'origemList'));
    document.getElementById('nivelSearch').addEventListener('input', () => filterOptions('nivelSearch', 'nivelList'));
    document.getElementById('motivoSearch').addEventListener('input', () => filterOptions('motivoSearch', 'motivoList'));
    document.getElementById('setorSearch').addEventListener('input', () => filterOptions('setorSearch', 'setorList'));
    document.getElementById('submotivoSearch').addEventListener('input', () => filterOptions('submotivoSearch', 'submotivoList'));

    document.getElementById('companySearch').addEventListener('input', () => filterCompanies());

    document.addEventListener('click', (event) => {
        closeAllLists(event);
    });
});

async function fetchCustomFieldValues() {
    const customFields = [
        { id: 27555, key: 'canal' },
        { id: 56417, key: 'categoria' },
        { id: 56420, key: 'origem' },
        { id: 56486, key: 'nivel' },
        { id: 56414, key: 'motivo' },
        { id: 56475, key: 'setor' },
        { id: 56422, key: 'submotivo' }
    ];

    for (const field of customFields) {
        const response = await fetch(`https://api.pipe.run/v1/customFields/${field.id}`, {
            headers: { 'token': token }
        });
        const data = await response.json();
        customFieldValues[field.key] = data.data.values;
    }
}

async function fetchCompanies() {
    const response = await fetch('https://api.pipe.run/v1/companies?sort=ASC', {
        headers: { 'token': token }
    });
    const data = await response.json();
    customFieldValues.company = data.data.map(company => ({ id: company.id, name: company.name }));
}


async function postOpportunity(title, company_id, customFields) {
    const response = await fetch('https://api.pipe.run/v1/deals', {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'token': token
        },
        body: JSON.stringify({
            pipeline_id: 75757,
            stage_id: 465720,
            title: title,
            owner_id: 74927,
            company_id: company_id,
            custom_fields: customFields
        })
    });

    const data = await response.json();
    return data.success;
}

async function filterCompanies() {
    const searchValue = document.getElementById('companySearch').value.toLowerCase();
    let filteredValues;

    if (searchValue.length > 0) {
        const response = await fetch(`https://api.pipe.run/v1/companies?sort=ASC&starts_with=${searchValue}`, {
            headers: { 'token': token }
        });
        const data = await response.json();
        filteredValues = data.data.map(company => ({ id: company.id, name: company.name }));
    } else {
        filteredValues = customFieldValues.company;
    }

    const listElement = document.getElementById('companyList');
    listElement.innerHTML = ''; // Clear current list

    filteredValues.forEach(value => {
        const listItem = document.createElement('li');
        listItem.textContent = value.name;
        listItem.onclick = () => selectOption(listItem, 'companySearch');
        listElement.appendChild(listItem);
    });

    customFieldValues.company = filteredValues;
}

function filterOptions(searchId, listId) {
    const searchValue = document.getElementById(searchId).value.toLowerCase();
    const listIdKey = listId.replace('List', '').toLowerCase();
    const filteredValues = customFieldValues[listIdKey].filter(value => value.toLowerCase().includes(searchValue));

    const listElement = document.getElementById(listId);
    listElement.innerHTML = ''; // Clear current list

    filteredValues.forEach(value => {
        const listItem = document.createElement('li');
        listItem.textContent = value;
        listItem.onclick = () => selectOption(listItem, searchId);
        listElement.appendChild(listItem);
    });
}

function selectOption(listItem, searchId) {
    document.getElementById(searchId).value = listItem.textContent;

    const listElement = listItem.parentElement;
    const siblings = listElement.getElementsByTagName('li');
    for (const sibling of siblings) {
        sibling.classList.remove('selected');
    }
    listItem.classList.add('selected');

    // Hide the list after selection
    listElement.style.display = 'none';
}

function closeAllLists(event) {
    const searchIds = ['companySearch', 'canalSearch', 'categoriaSearch', 'origemSearch', 'nivelSearch', 'motivoSearch', 'setorSearch', 'submotivoSearch'];
    
    searchIds.forEach(searchId => {
        const searchInput = document.getElementById(searchId);
        const listElement = document.getElementById(searchId.replace('Search', 'List'));

        if (event.target !== searchInput && !listElement.contains(event.target)) {
            listElement.style.display = 'none';
        } else {
            listElement.style.display = 'block';
        }
    });
}
