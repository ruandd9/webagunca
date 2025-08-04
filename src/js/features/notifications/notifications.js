class NotificationManager {
  constructor() {
    this.currentPage = 1;
    this.currentFilter = 'all';
    this.hasMore = true;
    this.notifications = [];
    this.init();
  }

  async init() {
    await this.loadNotifications();
    this.setupEventListeners();
    this.updateUnreadCount();
  }

  setupEventListeners() {
    // Filtros
    document.querySelectorAll('[onclick^="filterNotifications"]').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const filter = e.target.getAttribute('onclick').match(/'([^']+)'/)[1];
        this.filterNotifications(filter);
      });
    });

    // Carregar mais
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => this.loadMore());
    }

    // Marcar como lida ao clicar
    document.addEventListener('click', (e) => {
      if (e.target.closest('.notification')) {
        const notificationId = e.target.closest('.notification').dataset.id;
        if (notificationId) {
          this.markAsRead(notificationId);
        }
      }
    });
  }

  async loadNotifications(page = 1, filter = 'all') {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token não encontrado');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/notifications?page=${page}&filter=${filter}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar notificações');
      }

      const data = await response.json();
      
      if (page === 1) {
        this.notifications = data.notifications;
        this.renderNotifications();
      } else {
        this.notifications = [...this.notifications, ...data.notifications];
        this.appendNotifications(data.notifications);
      }

      this.hasMore = data.pagination.hasMore;
      this.currentPage = data.pagination.currentPage;
      this.currentFilter = filter;

      // Atualizar botão "Carregar mais"
      this.updateLoadMoreButton();

    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
      this.showError('Erro ao carregar notificações');
    }
  }

  async loadMore() {
    if (this.hasMore) {
      await this.loadNotifications(this.currentPage + 1, this.currentFilter);
    }
  }

  async filterNotifications(filter) {
    this.currentPage = 1;
    this.hasMore = true;
    await this.loadNotifications(1, filter);
    
    // Atualizar botões ativos
    document.querySelectorAll('[onclick^="filterNotifications"]').forEach(btn => {
      btn.classList.remove('active');
    });
    
    // Encontrar o botão correto baseado no filtro
    const activeButton = document.querySelector(`[onclick*="'${filter}'"]`);
    if (activeButton) {
      activeButton.classList.add('active');
    }
  }

  renderNotifications() {
    const container = document.querySelector('#notifications-container .space-y-4');
    const loadingElement = document.getElementById('loading-notifications');
    const emptyElement = document.getElementById('empty-notifications');
    
    if (!container) {
      console.error('Container de notificações não encontrado');
      return;
    }

    // Esconder loading
    if (loadingElement) {
      loadingElement.style.display = 'none';
    }

    // Mostrar estado vazio se não há notificações
    if (this.notifications.length === 0) {
      if (emptyElement) {
        emptyElement.classList.remove('hidden');
      }
      return;
    }

    // Esconder estado vazio
    if (emptyElement) {
      emptyElement.classList.add('hidden');
    }

    container.innerHTML = this.notifications.map(notification => 
      this.createNotificationHTML(notification)
    ).join('');
  }

  appendNotifications(newNotifications) {
    const container = document.querySelector('#notifications-container .space-y-4');
    if (!container) {
      console.error('Container de notificações não encontrado para append');
      return;
    }

    const html = newNotifications.map(notification => 
      this.createNotificationHTML(notification)
    ).join('');
    
    container.insertAdjacentHTML('beforeend', html);
  }

  createNotificationHTML(notification) {
    const iconClass = this.getIconClass(notification.type);
    const borderColor = this.getBorderColor(notification.type);
    const opacity = notification.read ? 'opacity-75' : '';
    const border = notification.read ? '' : `border-l-4 ${borderColor}`;
    
    const timeAgo = this.formatTimeAgo(notification.createdAt);
    
    return `
      <div class="notification bg-gray-800 p-4 rounded-lg ${border} ${opacity}" data-id="${notification._id}">
        <div class="flex items-start gap-3">
          <div class="flex-shrink-0 w-10 h-10 ${this.getIconBgColor(notification.type)} rounded-full flex items-center justify-center">
            <i class="${iconClass} text-white"></i>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm">${notification.message}</p>
            <span class="text-xs text-gray-400">${timeAgo}</span>
          </div>
          <button class="text-gray-400 hover:text-white flex-shrink-0">
            <i class="fas fa-ellipsis-v"></i>
          </button>
        </div>
      </div>
    `;
  }

  getIconClass(type) {
    const icons = {
      'board_added': 'fas fa-user-plus',
      'card_due_soon': 'fas fa-clock',
      'card_mentioned': 'fas fa-at',
      'card_moved': 'fas fa-arrows-alt',
      'list_created': 'fas fa-list-alt'
    };
    return icons[type] || 'fas fa-bell';
  }

  getIconBgColor(type) {
    const colors = {
      'board_added': 'bg-blue-500',
      'card_due_soon': 'bg-yellow-500',
      'card_mentioned': 'bg-purple-500',
      'card_moved': 'bg-green-500',
      'list_created': 'bg-red-500'
    };
    return colors[type] || 'bg-gray-500';
  }

  getBorderColor(type) {
    const colors = {
      'board_added': 'border-blue-500',
      'card_due_soon': 'border-yellow-500',
      'card_mentioned': 'border-purple-500',
      'card_moved': 'border-green-500',
      'list_created': 'border-red-500'
    };
    return colors[type] || 'border-gray-500';
  }

  formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Agora mesmo';
    if (diffInMinutes < 60) return `Há ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Há ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Ontem';
    if (diffInDays < 7) return `Há ${diffInDays} dia${diffInDays > 1 ? 's' : ''}`;
    
    return date.toLocaleDateString('pt-BR');
  }

  async markAsRead(notificationId) {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`http://localhost:5000/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Atualizar visual da notificação
        const notificationElement = document.querySelector(`[data-id="${notificationId}"]`);
        if (notificationElement) {
          notificationElement.classList.add('opacity-75');
          notificationElement.classList.remove('border-l-4');
        }
        
        // Atualizar contador
        this.updateUnreadCount();
      }
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  }

  async updateUnreadCount() {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:5000/api/notifications/unread-count', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        this.updateNotificationBadge(data.unreadCount);
      }
    } catch (error) {
      console.error('Erro ao atualizar contador de notificações:', error);
    }
  }

  updateNotificationBadge(count) {
    // Atualizar badge no menu lateral
    const notificationLink = document.querySelector('a[href="./notifications.html"]');
    if (notificationLink) {
      let badge = notificationLink.querySelector('.notification-badge');
      
      if (count > 0) {
        if (!badge) {
          badge = document.createElement('span');
          badge.className = 'notification-badge bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-2';
          notificationLink.appendChild(badge);
        }
        badge.textContent = count;
      } else if (badge) {
        badge.remove();
      }
    }
  }

  updateLoadMoreButton() {
    const loadMoreContainer = document.getElementById('load-more-container');
    const loadMoreBtn = document.getElementById('load-more-btn');
    
    if (this.hasMore && this.notifications.length > 0) {
      loadMoreContainer.classList.remove('hidden');
    } else {
      loadMoreContainer.classList.add('hidden');
    }
  }

  showError(message) {
    // Implementar exibição de erro
    console.error(message);
  }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  new NotificationManager();
});

// Função global para compatibilidade com o HTML existente
function filterNotifications(type) {
  // Esta função será chamada pelo HTML existente
  // O evento será capturado pelo NotificationManager
} 