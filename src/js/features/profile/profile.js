document.addEventListener('DOMContentLoaded', async () => {
    // Garantir que o toast manager esteja inicializado
    if (window.toastManager && !window.toastManager.container) {
        window.toastManager.init();
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '../index.html';
        return;
    }

    // Função para buscar os dados do usuário
    async function fetchUserData() {
        try {
            const response = await fetch('http://localhost:5000/api/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.mensagem || 'Erro ao buscar dados do usuário.');
            }

            const user = await response.json();
            displayUserData(user);
        } catch (error) {
            console.error('Erro ao buscar dados do usuário:', error);
            if (window.toastManager) {
                window.toastManager.error('Erro ao carregar perfil: ' + error.message);
            } else {
                alert('Erro ao carregar perfil: ' + error.message);
            }
        }
    }

    // Função para exibir os dados do usuário na página
    function displayUserData(user) {
        document.getElementById('nomeCompleto').value = user.nomeCompleto || '';
        document.getElementById('email').value = user.email || '';
        // CORRIGIDO: Puxa o nome de usuário do nome completo se não existir
        document.getElementById('nomeUsuario').value = user.nomeUsuario || user.nomeCompleto || '';
        document.getElementById('telefone').value = user.telefone || '';

        // CORRIGIDO: Adicionada lógica de carregamento da imagem de perfil
        const profileImageElement = document.getElementById('profileImage');
        if (profileImageElement && user.profileImage) {
            profileImageElement.src = user.profileImage;
        } else if (profileImageElement && user.nomeCompleto) {
            // Se não houver imagem, exibe as iniciais
            profileImageElement.src = `https://placehold.co/128x128/3B82F6/ffffff?text=${getInitials(user.nomeCompleto)}`;
        }

        // Adicionar lógica para o menu dropdown com as iniciais
        if (window.updateUserInitials) {
            window.updateUserInitials(user.nomeCompleto);
        }
    }
    
    // Função para gerar as iniciais do nome
    function getInitials(name) {
        if (!name) return '';
        const names = name.split(' ');
        let initials = names[0].charAt(0).toUpperCase();
        if (names.length > 1) {
            initials += names[names.length - 1].charAt(0).toUpperCase();
        }
        return initials;
    }

    // Função para atualizar as iniciais no dropdown
    window.updateUserInitials = function(nomeCompleto) {
        const userInitialsDiv = document.getElementById('userInitials');
        if (userInitialsDiv) {
            userInitialsDiv.textContent = getInitials(nomeCompleto);
        }
    };

    // Manipulador do formulário de atualização do perfil
    document.getElementById('profileForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const nomeCompleto = document.getElementById('nomeCompleto').value;
        const nomeUsuario = document.getElementById('nomeUsuario').value;
        const email = document.getElementById('email').value;
        const telefone = document.getElementById('telefone').value;

        try {
            const response = await fetch('http://localhost:5000/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ nomeCompleto, nomeUsuario, email, telefone })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.mensagem || 'Erro ao atualizar perfil.');
            }

            if (window.toastManager) {
                window.toastManager.success('Perfil atualizado com sucesso!');
            } else {
                alert('Perfil atualizado com sucesso!');
            }
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            if (window.toastManager) {
                window.toastManager.error('Erro ao atualizar perfil: ' + error.message);
            } else {
                alert('Erro ao atualizar perfil: ' + error.message);
            }
        }
    });

    // Manipulador do formulário de atualização de senha
    document.getElementById('passwordForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const senhaAtual = document.getElementById('currentPassword').value;
        const novaSenha = document.getElementById('newPassword').value;
        const confirmarSenha = document.getElementById('confirmPassword').value;

        if (novaSenha !== confirmarSenha) {
            if (window.toastManager) {
                window.toastManager.warning('A nova senha e a confirmação de senha não coincidem.');
            } else {
                alert('A nova senha e a confirmação de senha não coincidem.');
            }
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/profile/password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ senhaAtual, novaSenha })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.mensagem || 'Erro ao mudar senha.');
            }

            if (window.toastManager) {
                window.toastManager.success('Senha alterada com sucesso!');
            } else {
                alert('Senha alterada com sucesso!');
            }
            document.getElementById('currentPassword').value = '';
            document.getElementById('newPassword').value = '';
            document.getElementById('confirmPassword').value = '';
        } catch (error) {
            console.error('Erro ao mudar senha:', error);
            if (window.toastManager) {
                window.toastManager.error('Erro ao mudar senha: ' + error.message);
            } else {
                alert('Erro ao mudar senha: ' + error.message);
            }
        }
    });

    // Lógica para upload de imagem
    document.getElementById('imageUpload').addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (ev) => {
                const base64Image = ev.target.result;
                document.getElementById('profileImage').src = base64Image;

                try {
                    const response = await fetch('http://localhost:5000/api/profile/image', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ profileImage: base64Image })
                    });

                    const data = await response.json();
                    if (!response.ok) {
                        throw new Error(data.mensagem || 'Erro ao atualizar imagem de perfil.');
                    }
                    if (window.toastManager) {
                        window.toastManager.success('Imagem de perfil atualizada com sucesso!');
                    } else {
                        alert('Imagem de perfil atualizada com sucesso!');
                    }
                    fetchUserData(); 
                } catch (error) {
                    console.error('Erro no upload da imagem:', error);
                    if (window.toastManager) {
                        window.toastManager.error('Erro ao salvar imagem de perfil: ' + error.message);
                    } else {
                        alert('Erro ao salvar imagem de perfil: ' + error.message);
                    }
                }
            };
            reader.readAsDataURL(file);
        }
    });
    
    fetchUserData();
});