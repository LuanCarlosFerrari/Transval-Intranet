const quickContactsData = [
    {
        title: "Recursos Humanos",
        contacts: [
            {
                name: "Ruan",
                icon: "fa-user",
                info: "tel: (18)98177-0855\nEmail:\nruan@transval.net.br"
            },
            { name: "Fabrícia", icon: "fa-user", info: "" },
            { name: "Ana", icon: "fa-user", info: "" }
        ]
    },
    {
        title: "Contas a Receber",
        contacts: [
            {
                name: "Elizabete",
                icon: "fa-money-bill",
                info: "Tel: (18)98185-1049\nEmail: financeirorinopolis@transval.net.br"
            },
            { name: "Fernanda (SP)", icon: "fa-money-bill", info: "" },
            { name: "Beatriz (SP)", icon: "fa-money-bill", info: "" },
            { name: "Faiella (SP)", icon: "fa-money-bill", info: "" },
            { name: "Renata T (MT)", icon: "fa-money-bill", info: "" },
            { name: "Renata (MT)", icon: "fa-money-bill", info: "" },
            { name: "Priscila (MT)", icon: "fa-money-bill", info: "" }
        ]
    },
    {
        title: "Faturamento",
        contacts: [
            {
                name: "Maria Helena",
                icon: "fa-file-invoice",
                info: "Tel: (19)99925-0103\nEmail: faturamentosumare@transval.net.br"
            },
            {
                name: "Silvania",
                icon: "fa-file-invoice",
                info: "Tel: (19)99876-9816\nEmail: faturamentosumare8@transval.net.br"
            },
            {
                name: "Amanda Inacio",
                icon: "fa-file-invoice",
                info: "Tel: (19)98292-0003\nEmail: faturamentosumare4@transval.net.br"
            }
        ]
    },
    {
        title: "Estadia",
        contacts: [
            {
                name: "Anne",
                icon: "fa-hotel",
                info: "Tel: (66)99665-1265\nEmail: estadia@transval.net.br"
            },
            {
                name: "Leomar",
                icon: "fa-hotel",
                info: "Tel: (66)99665-1265\nEmail: estadia@transval.net.br"
            }
        ]
    },
    {
        title: "Gestor de Frota",
        contacts: [
            {
                name: "Atirson (Frota SP)",
                icon: "fa-truck",
                info: "Tel: (18)98185-0214\nEmail: atirson@transval.net.br"
            },
            {
                name: "Vitor (Frota SP)",
                icon: "fa-truck",
                info: "Tel: (18)98184-0288\nEmail: vitor@transval.net.br"
            },
            {
                name: "Ronaldo Balestrin Gomes (Frota MT)",
                icon: "fa-truck",
                info: "Tel: (66)98129-0092\nEmail: logistica2@transval.net.br"
            }
        ]
    },
    {
        title: "Controladoria",
        contacts: [
            {
                name: "Mislaine Resende",
                icon: "fa-chart-line",
                info: "Tel: (66)99622-3227"
            },
            {
                name: "Gislaine Rocha",
                icon: "fa-chart-line",
                info: "Tel: (66)99719-8331"
            },
            {
                name: "Taissa Lorayne",
                icon: "fa-chart-line",
                info: "Tel: (66)99909-7207"
            },
            {
                name: "Lorrayne Cristina",
                icon: "fa-chart-line",
                info: "Tel: (66)99243-1018"
            },
            {
                name: "Lilian Payão",
                icon: "fa-chart-line",
                info: "Tel: (66)99220-8501"
            }
        ]
    },
    {
        title: "Marketing",
        contacts: [
            {
                name: "Crislaine",
                icon: "fa-bullhorn",
                info: "Tel: (18)99726-6639"
            }
        ]
    },
    {
        title: "GR",
        contacts: [
            {
                name: "Cassyklei",
                icon: "fa-truck-loading",
                info: "Tel: (66)99628-2538\nEmail: cassyklei@transval.net.br"
            },
            {
                name: "João Elias Mercia Costa",
                icon: "fa-truck-loading",
                info: "Tel: (66)98467-7870\nEmail: logistica7@transval.net.br"
            },
            {
                name: "Luiz Felippe Claudino da Silva",
                icon: "fa-truck-loading",
                info: "Tel: (66)99224-8420\nEmail: logistica8@transval.net.br"
            }
        ]
    },
    {
        title: "Contábil / Fiscal",
        contacts: [
            {
                name: "Alex",
                icon: "fa-calculator",
                info: "Tel: (14)99663-5979\nEmail: contabilmatriz@transval.net.br"
            },
            {
                name: "Daniella",
                icon: "fa-calculator",
                info: "Tel: (14)99850-3891\nEmail: contabilmatriz1@transval.net.br"
            },
            {
                name: "Jonatas",
                icon: "fa-calculator",
                info: "Tel: (18)99743-4469\nEmail: contabilmatriz2@transval.net.br"
            },
            {
                name: "Rafaela",
                icon: "fa-calculator",
                info: "Tel: (18)99603-8990\nEmail: contabilmatriz4@transval.net.br"
            }
        ]
    },
    {
        title: "Conferência e Controle",
        contacts: [
            {
                name: "Emerson Luciano Tomasela",
                icon: "fa-check-double",
                info: "Tel: (18)98177-0239\nEmail: faturamentosp@transval.net.br"
            },
            {
                name: "Naiara Cristina R. Sanchez",
                icon: "fa-check-double",
                info: "Tel: (18)99797-9474\nEmail: faturamentosp3@transval.net.br"
            },
            {
                name: "Bruno Henrique",
                icon: "fa-check-double",
                info: "Tel: (18)99818-5606\nEmail: faturamentosp5@transval.net.br"
            }
        ]
    }
];

export function initQuickContactsSection() {
    if (!sessionStorage.getItem('isLoggedIn')) {
        return `
            <div class="contacts-container">
                <h2>Acesso Restrito</h2>
                <p>Por favor, faça login para acessar os contatos.</p>
            </div>
        `;
    }

    return `
        <div class="contacts-container">
            <h2>Contatos Rápidos</h2>
            ${quickContactsData.map(department => `
                <div class="department-group">
                    <h3 class="department-title">${department.title}</h3>
                    <div class="contacts-grid">
                        ${department.contacts.map(contact => `
                            <div class="contact-item">
                                <i class="fas ${contact.icon}"></i>
                                <h3>${contact.name}</h3>
                                ${contact.info ? `<p>${contact.info.replace('\n', '<br>')}</p>` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function filterContacts() {
    const searchTerm = document.getElementById('contactSearch').value.toLowerCase();
    const department = document.getElementById('departmentFilter').value;
    const departments = document.querySelectorAll('.department-section');

    departments.forEach(dept => {
        const isDepartmentMatch = !department || dept.dataset.department === department;
        const contacts = dept.querySelectorAll('.contact-card');
        let hasVisibleContacts = false;

        contacts.forEach(contact => {
            const matchesSearch = contact.textContent.toLowerCase().includes(searchTerm);
            contact.style.display = matchesSearch ? 'block' : 'none';
            if (matchesSearch) hasVisibleContacts = true;
        });

        dept.style.display = isDepartmentMatch && hasVisibleContacts ? 'block' : 'none';
    });
}

export function initQuickContactsEvents() {
    const searchInput = document.getElementById('contactSearch');
    const departmentFilter = document.getElementById('departmentFilter');

    if (searchInput) {
        searchInput.addEventListener('input', filterContacts);
    }
    if (departmentFilter) {
        departmentFilter.addEventListener('change', filterContacts);
    }
}