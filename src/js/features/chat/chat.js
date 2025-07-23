// Gerenciamento de Contatos
class ContactManager {
    constructor() {
        // Contatos padrão que já existiam
        const defaultContacts = [
            {
                id: 1,
                firstName: 'Raphael',
                lastName: 'Marques',
                initials: 'RM',
                lastMessage: 'Vamos discutir o novo projeto',
                lastMessageTime: '14:30',
                online: true,
                profileColor: 'blue-500'
            },
            {
                id: 2,
                firstName: 'Talisson',
                lastName: 'Leandro',
                initials: 'TL',
                lastMessage: 'Reunião amanhã às 10h',
                lastMessageTime: '13:45',
                online: true,
                profileColor: 'blue-500'
            }
        ];

        // Carrega contatos do localStorage ou usa os contatos padrão
        const savedContacts = JSON.parse(localStorage.getItem('chatContacts'));
        this.contacts = savedContacts || defaultContacts;
        
        // Se não houver contatos salvos, salva os contatos padrão
        if (!savedContacts) {
            this.saveContacts();
        }

        this.modal = document.getElementById('contactModal');
        this.form = document.getElementById('contactForm');
        this.addContactButton = document.querySelector('.add-contact-button button');
        this.closeModalButton = document.getElementById('closeModal');
        this.cancelButton = document.getElementById('cancelContact');
        this.deleteButton = document.getElementById('deleteContact');
        this.contactsList = document.querySelector('.contacts-list');
        this.contextMenu = document.getElementById('contactContextMenu');
        this.modalTitle = document.getElementById('modalTitle');
        this.contactIdInput = document.getElementById('contactId');
        this.profileColorInput = document.getElementById('profileColor');

        this.initializeEventListeners();
        this.renderContacts();
    }

    initializeEventListeners() {
        // Abrir modal para novo contato
        this.addContactButton.addEventListener('click', () => this.openModal());

        // Fechar modal
        this.closeModalButton.addEventListener('click', () => this.closeModal());
        this.cancelButton.addEventListener('click', () => this.closeModal());

        // Fechar modal ao clicar fora
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // Submeter formulário
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveContact();
        });

        // Botão de excluir
        this.deleteButton.addEventListener('click', () => {
            const contactId = parseInt(this.contactIdInput.value);
            if (contactId) {
                this.deleteContact(contactId);
            }
        });

        // Opções de cor
        document.querySelectorAll('.color-option').forEach(option => {
            option.addEventListener('click', () => {
                const color = option.dataset.color;
                this.profileColorInput.value = color;
                document.querySelectorAll('.color-option').forEach(opt => {
                    opt.classList.remove('ring-2', 'ring-white');
                });
                option.classList.add('ring-2', 'ring-white');
            });
        });

        // Menu de contexto
        document.addEventListener('contextmenu', (e) => {
            const contactItem = e.target.closest('.contact-item');
            if (contactItem) {
                e.preventDefault();
                this.showContextMenu(e, contactItem);
            }
        });

        // Fechar menu de contexto ao clicar fora
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#contactContextMenu') && !e.target.closest('.contact-item')) {
                this.contextMenu.classList.add('hidden');
            }
        });

        // Eventos do menu de contexto
        this.contextMenu.querySelector('.edit-contact').addEventListener('click', () => {
            const contactId = parseInt(this.contextMenu.dataset.contactId);
            this.editContact(contactId);
            this.contextMenu.classList.add('hidden');
        });

        this.contextMenu.querySelector('.delete-contact').addEventListener('click', () => {
            const contactId = parseInt(this.contextMenu.dataset.contactId);
            this.deleteContact(contactId);
            this.contextMenu.classList.add('hidden');
        });

        // Event listener para o botão de voltar em telas menores
        const backToContactsBtn = document.getElementById('backToContactsBtn');
        if (backToContactsBtn) {
            backToContactsBtn.addEventListener('click', () => {
                this.showContactList();
            });
        }
    }

    showContextMenu(e, contactItem) {
        const contactId = contactItem.dataset.contactId;
        this.contextMenu.dataset.contactId = contactId;
        this.contextMenu.style.left = `${e.pageX}px`;
        this.contextMenu.style.top = `${e.pageY}px`;
        this.contextMenu.classList.remove('hidden');
    }

    openModal(contact = null) {
        this.modalTitle.textContent = contact ? 'Editar Contato' : 'Adicionar Novo Contato';
        this.deleteButton.classList.toggle('hidden', !contact);
        
        if (contact) {
            this.contactIdInput.value = contact.id;
            document.getElementById('firstName').value = contact.firstName;
            document.getElementById('lastName').value = contact.lastName;
            this.profileColorInput.value = contact.profileColor;
            
            // Selecionar a cor atual
            document.querySelectorAll('.color-option').forEach(option => {
                option.classList.remove('ring-2', 'ring-white');
                if (option.dataset.color === contact.profileColor) {
                    option.classList.add('ring-2', 'ring-white');
                }
            });
        } else {
            this.form.reset();
            this.contactIdInput.value = '';
            this.profileColorInput.value = 'blue-500';
            document.querySelector('.color-option[data-color="blue-500"]').classList.add('ring-2', 'ring-white');
        }

        this.modal.classList.remove('hidden');
        this.modal.classList.add('flex');
        document.getElementById('firstName').focus();
    }

    closeModal() {
        this.modal.classList.add('hidden');
        this.modal.classList.remove('flex');
        this.form.reset();
        this.contactIdInput.value = '';
        this.deleteButton.classList.add('hidden');
    }

    getInitials(firstName, lastName) {
        return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
    }

    saveContact() {
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const contactId = this.contactIdInput.value;
        const profileColor = this.profileColorInput.value;

        if (firstName && lastName) {
            if (contactId) {
                // Editar contato existente
                const index = this.contacts.findIndex(c => c.id === parseInt(contactId));
                if (index !== -1) {
                    this.contacts[index] = {
                        ...this.contacts[index],
                        firstName,
                        lastName,
                        initials: this.getInitials(firstName, lastName),
                        profileColor
                    };
                }
            } else {
                // Adicionar novo contato
                const newContact = {
                    id: Date.now(),
                    firstName,
                    lastName,
                    initials: this.getInitials(firstName, lastName),
                    lastMessage: 'Nova conversa iniciada',
                    lastMessageTime: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                    online: true,
                    profileColor: profileColor
                };
                this.contacts.push(newContact);
            }

            this.saveContacts();
            this.renderContacts();
            this.closeModal();
        }
    }

    editContact(contactId) {
        const contact = this.contacts.find(c => c.id === contactId);
        if (contact) {
            this.openModal(contact);
        }
    }

    deleteContact(contactId) {
        if (confirm('Tem certeza que deseja excluir este contato?')) {
            this.contacts = this.contacts.filter(c => c.id !== contactId);
            this.saveContacts();
            this.renderContacts();
            this.closeModal();
        }
    }

    saveContacts() {
        localStorage.setItem('chatContacts', JSON.stringify(this.contacts));
    }

    createContactElement(contact) {
        return `
            <div class="contact-item" data-contact-id="${contact.id}">
                <div class="contact-avatar bg-${contact.profileColor}">
                    <span>${contact.initials}</span>
                    ${contact.online ? '<div class="online-indicator"></div>' : ''}
                </div>
                <div class="contact-info">
                    <div class="contact-name">
                        <span>${contact.firstName} ${contact.lastName}</span>
                        <span class="text-xs text-gray-400">${contact.lastMessageTime}</span>
                    </div>
                    <div class="contact-last-message">
                        ${contact.lastMessage}
                    </div>
                </div>
            </div>
        `;
    }

    renderContacts() {
        this.contactsList.innerHTML = '';
        this.contacts.forEach(contact => {
            const contactElement = document.createElement('div');
            contactElement.innerHTML = this.createContactElement(contact).trim();
            const item = contactElement.firstChild;
            this.contactsList.appendChild(item);

            // Adicionar evento de clique para exibir a conversa em telas menores
            item.addEventListener('click', () => {
                this.showConversationArea();
                this.selectContact(item, contact);
            });
        });

        // Seleciona o primeiro contato por padrão ao carregar a página
        if (this.contacts.length > 0) {
            const firstContactItem = this.contactsList.querySelector('.contact-item');
            if (firstContactItem) {
                this.selectContact(firstContactItem, this.contacts[0]);
            }
        }
    }

    selectContact(item, contact) {
        // Remove a classe 'active' de todos os itens de contato
        document.querySelectorAll('.contact-item').forEach(i => i.classList.remove('active'));
        // Adiciona a classe 'active' ao item clicado
        item.classList.add('active');

        // Atualiza o cabeçalho do chat com as informações do contato selecionado
        const chatHeader = document.querySelector('.chat-header');
        if (chatHeader) {
            const headerName = chatHeader.querySelector('h2');
            const headerAvatar = chatHeader.querySelector('.contact-avatar');
            const headerAvatarInitials = headerAvatar ? headerAvatar.querySelector('span') : null;
            const headerOnlineStatus = chatHeader.querySelector('p');

            if (headerName) {
                headerName.textContent = `${contact.firstName} ${contact.lastName}`;
            }
            if (headerAvatar) {
                // Garante a remoção de classes de cor existentes e adiciona a nova
                headerAvatar.className = 'contact-avatar'; // Reseta para a classe base
                headerAvatar.classList.add(`bg-${contact.profileColor}`);
            }
            if (headerAvatarInitials) {
                headerAvatarInitials.textContent = contact.initials;
            }
            if (headerOnlineStatus) {
                headerOnlineStatus.textContent = contact.online ? 'online' : 'offline';
            }
        }
    }

    // Funções para alternar a visualização em telas menores
    showContactList() {
        if (window.innerWidth <= 768) { // Apenas em telas menores
            document.body.classList.remove('show-chat-conversation');
        }
    }

    showConversationArea() {
        if (window.innerWidth <= 768) { // Apenas em telas menores
            document.body.classList.add('show-chat-conversation');
        }
    }
}

// Inicializar o gerenciador de contatos
const contactManager = new ContactManager();

// Menu mobile principal
document.getElementById('mobile-menu-button').addEventListener('click', function() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('-translate-x-full');
});

// Menu do usuário
const userAvatar = document.querySelector('.dropdown');
const dropdownMenu = document.querySelector('.dropdown-content');

// Elementos do chat
const chatInput = document.querySelector('.chat-input');
const sendButton = document.querySelector('.send-button');
const messagesContainer = document.querySelector('.messages-container');

userAvatar.addEventListener('click', () => {
    dropdownMenu.classList.toggle('active');
});

// Fechar dropdown ao clicar fora
document.addEventListener('click', (e) => {
    if (!userAvatar.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.classList.remove('active');
    }
});

// Seleção de contato
const contactItems = document.querySelectorAll('.contact-item');
contactItems.forEach(item => {
    item.addEventListener('click', () => {
        contactItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
    });
});

// Simulação de mensagens antigas (em um caso real, isso viria do backend)
const oldMessages = [
    {
        type: 'incoming',
        content: 'Vamos marcar uma reunião para discutir o projeto?',
        time: '14:25'
    },
    {
        type: 'outgoing',
        content: 'Claro! Que tal amanhã às 10h?',
        time: '14:26'
    },
    {
        type: 'incoming',
        content: 'Perfeito! Vou preparar a apresentação.',
        time: '14:27'
    },
    {
        type: 'outgoing',
        content: 'Ótimo! Vou revisar o código até lá.',
        time: '14:28'
    },
    {
        type: 'incoming',
        content: 'Não esqueça de atualizar a documentação.',
        time: '14:29'
    }
];

let currentPage = 1;
const messagesPerPage = 10;
let isLoading = false;
let noMoreMessagesCount = 0; // Contador para controlar quantas vezes a mensagem apareceu
const MAX_NO_MORE_MESSAGES = 4; // Limite máximo de exibição da mensagem

// Função para criar elemento de mensagem
function createMessageElement(message, isOutgoing = true) {
    const avatar = isOutgoing ? 'YF' : 'RM'; // Em um caso real, isso viria do usuário atual
    const messageHTML = `
        <div class="message-wrapper ${isOutgoing ? 'outgoing' : 'incoming'}">
            <div class="message-avatar">${avatar}</div>
            <div class="message ${isOutgoing ? 'outgoing' : 'incoming'}">
                <div class="message-content">
                    ${message.content}
                </div>
                <span class="message-time">${message.time}</span>
            </div>
        </div>
    `;
    return messageHTML;
}

// Função para carregar mensagens antigas
function loadOldMessages() {
    if (isLoading) return;
    
    isLoading = true;
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-messages';
    loadingIndicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Carregando mensagens...';
    messagesContainer.insertBefore(loadingIndicator, messagesContainer.firstChild);

    setTimeout(() => {
        const start = (currentPage - 1) * messagesPerPage;
        const end = start + messagesPerPage;
        const messagesToLoad = oldMessages.slice(start, end);

        if (messagesToLoad.length > 0) {
            const fragment = document.createDocumentFragment();
            messagesToLoad.forEach(message => {
                const messageElement = document.createElement('div');
                messageElement.innerHTML = createMessageElement(message, message.type === 'outgoing');
                fragment.appendChild(messageElement.firstElementChild);
            });

            messagesContainer.removeChild(loadingIndicator);
            const firstMessage = messagesContainer.firstChild;
            messagesContainer.insertBefore(fragment, firstMessage);

            currentPage++;
            noMoreMessagesCount = 0; // Reseta o contador quando novas mensagens são carregadas
        } else {
            messagesContainer.removeChild(loadingIndicator);
            
            // Só exibe a mensagem se não atingiu o limite
            if (noMoreMessagesCount < MAX_NO_MORE_MESSAGES) {
                const noMoreMessages = document.createElement('div');
                noMoreMessages.className = 'no-more-messages';
                noMoreMessages.textContent = 'Não há mais mensagens para carregar';
                messagesContainer.insertBefore(noMoreMessages, messagesContainer.firstChild);
                noMoreMessagesCount++;
            }
        }

        isLoading = false;
    }, 1000);
}

// Observador de scroll para detectar quando chegar ao topo
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !isLoading) {
            loadOldMessages();
        }
    });
}, {
    root: messagesContainer,
    threshold: 0.1
});

// Adicionar elemento observador no topo do container
const observerElement = document.createElement('div');
observerElement.className = 'scroll-observer';
messagesContainer.insertBefore(observerElement, messagesContainer.firstChild);
observer.observe(observerElement);

// Função de envio de mensagem
function sendMessage() {
    const message = chatInput.value.trim();
    if (message) {
        const messageHTML = createMessageElement({
            content: message,
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        }, true);
        
        const messageElement = document.createElement('div');
        messageElement.innerHTML = messageHTML;
        messagesContainer.appendChild(messageElement.firstElementChild);
        
        chatInput.value = '';
        messageElement.firstElementChild.scrollIntoView({ behavior: 'smooth' });
    }
}

// Event listeners para envio de mensagem
sendButton.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Scroll automático para a última mensagem ao carregar
messagesContainer.scrollTop = messagesContainer.scrollHeight;

// Controle do menu de temas
const themeButton = document.getElementById('theme-button');
const themeDropdown = document.getElementById('theme-dropdown');
const chatMessagesArea = document.querySelector('.chat-messages-area');

// Tema atual
let currentTheme = 'default';

// Função para aplicar o tema
function applyTheme(theme) {
    const themes = {
        'default': 'var(--bg-dark)',
        'light': '#F3F4F6',
        'dark-blue': '#1f547e',           // Azul escuro mais intenso
        'dark-purple': '#1e1b4b',         // Roxo escuro mais intenso
        'dark-green': '#1b2d1b'
    };

    chatMessagesArea.style.backgroundColor = themes[theme];
    currentTheme = theme;
    localStorage.setItem('chatTheme', theme);
}

// Carregar tema salvo
const savedTheme = localStorage.getItem('chatTheme');
if (savedTheme) {
    applyTheme(savedTheme);
}

// Toggle do dropdown
themeButton.addEventListener('click', (e) => {
    e.stopPropagation();
    themeDropdown.classList.toggle('active');
});

// Fechar dropdown ao clicar fora
document.addEventListener('click', (e) => {
    if (!themeButton.contains(e.target) && !themeDropdown.contains(e.target)) {
        themeDropdown.classList.remove('active');
    }
});

// Seleção de tema
document.querySelectorAll('.theme-option').forEach(option => {
    option.addEventListener('click', () => {
        const theme = option.dataset.theme;
        applyTheme(theme);
        themeDropdown.classList.remove('active');
    });
}); 