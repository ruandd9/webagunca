class NotificationBadge {
  constructor() {
    this.unreadCount = 0;
    this.init();
  }

  async init() {
    await this.updateUnreadCount();
    this.setupPolling();
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
        this.unreadCount = data.unreadCount;
        this.updateBadge();
      }
    } catch (error) {
      console.error('Erro ao atualizar contador de notificações:', error);
    }
  }

  updateBadge() {
    // Atualizar badge no menu lateral
    const notificationLink = document.querySelector('a[href="./notifications.html"]');
    if (notificationLink) {
      let badge = notificationLink.querySelector('.notification-badge');
      
      if (this.unreadCount > 0) {
        if (!badge) {
          badge = document.createElement('span');
          badge.className = 'notification-badge bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-2';
          notificationLink.appendChild(badge);
        }
        badge.textContent = this.unreadCount > 99 ? '99+' : this.unreadCount;
      } else if (badge) {
        badge.remove();
      }
    }

    // Atualizar badge no header (se existir)
    const headerNotificationIcon = document.querySelector('.header-notification-icon');
    if (headerNotificationIcon) {
      let headerBadge = headerNotificationIcon.querySelector('.notification-badge');
      
      if (this.unreadCount > 0) {
        if (!headerBadge) {
          headerBadge = document.createElement('span');
          headerBadge.className = 'notification-badge absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1 py-0.5 min-w-[16px] text-center';
          headerNotificationIcon.appendChild(headerBadge);
        }
        headerBadge.textContent = this.unreadCount > 99 ? '99+' : this.unreadCount;
      } else if (headerBadge) {
        headerBadge.remove();
      }
    }
  }

  setupPolling() {
    // Atualizar contador a cada 30 segundos
    setInterval(() => {
      this.updateUnreadCount();
    }, 30000);
  }

  // Método para incrementar contador localmente (para notificações em tempo real)
  incrementCount() {
    this.unreadCount++;
    this.updateBadge();
  }

  // Método para decrementar contador localmente
  decrementCount() {
    if (this.unreadCount > 0) {
      this.unreadCount--;
      this.updateBadge();
    }
  }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  new NotificationBadge();
});

// Exportar para uso em outros módulos
window.NotificationBadge = NotificationBadge; 