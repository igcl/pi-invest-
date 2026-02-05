document.addEventListener('DOMContentLoaded', () => {
    
    /* =================================================================
       1. MOSTRAR / OCULTAR SENHA (Funciona para Login e Cadastro)
       ================================================================= */
    const toggleButtons = document.querySelectorAll('.toggle-password');

    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');

            if (input.type === "password") {
                input.type = "text";
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = "password";
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    /* =================================================================
       FUNÇÕES AUXILIARES DE VALIDAÇÃO
       ================================================================= */
    function setError(wrapperId, errorMsgId, isError) {
        const wrapper = document.getElementById(wrapperId);
        const msg = document.getElementById(errorMsgId);
        
        // Verifica se os elementos existem antes de tentar modificar (evita erro no console)
        if (!wrapper || !msg) return;

        if (isError) {
            wrapper.classList.add('error');
            msg.classList.add('visible');
            return false; // Retorna false indicando erro
        } else {
            wrapper.classList.remove('error');
            msg.classList.remove('visible');
            return true; // Retorna true indicando sucesso
        }
    }

    // Limpar erros automaticamente ao digitar
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', function() {
            const wrapper = this.closest('.input-wrapper');
            if (wrapper && wrapper.classList.contains('error')) {
                wrapper.classList.remove('error');
                const errorMsg = wrapper.nextElementSibling;
                if (errorMsg) errorMsg.classList.remove('visible');
            }
        });
    });

    /* =================================================================
       2. LÓGICA DO FORMULÁRIO DE CADASTRO (REGISTER)
       ================================================================= */
    const registerForm = document.getElementById('registerForm');

    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            let isValid = true;

            // Validar Nome
            const name = document.getElementById('name').value;
            if(!setError('wrapper-name', 'error-name', name.trim() === '')) isValid = false;

            // Validar Email
            const email = document.getElementById('email').value;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(!setError('wrapper-email', 'error-email', email.trim() === '' || !emailRegex.test(email))) isValid = false;

            // Validar Senha
            const password = document.getElementById('password').value;
            if(!setError('wrapper-password', 'error-password', password.trim().length < 8)) isValid = false;

            // Validar Confirmação
            const confirmPassword = document.getElementById('confirm-password').value;
            const passMismatch = confirmPassword.trim() === '' || confirmPassword !== password;
            if(!setError('wrapper-confirm-password', 'error-confirm-password', passMismatch)) isValid = false;

            // Validar Termos
            const terms = document.getElementById('terms');
            const errorTerms = document.getElementById('error-terms');
            if (!terms.checked) {
                errorTerms.classList.add('visible');
                isValid = false;
            } else {
                errorTerms.classList.remove('visible');
            }

            if (isValid) {
                const btn = registerForm.querySelector('button[type="submit"]');
                const originalText = btn.innerText;
                btn.innerText = "Criando conta...";
                btn.disabled = true;
                
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.disabled = false;
                    window.location.href = 'dashboard.html';
                }, 1500);
            }
        });
    }

    /* =================================================================
       3. LÓGICA DO FORMULÁRIO DE LOGIN
       ================================================================= */
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            let isValid = true;

            // Validar Email Login
            const email = document.getElementById('login-email').value;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(!setError('wrapper-login-email', 'error-login-email', email.trim() === '' || !emailRegex.test(email))) isValid = false;

            // Validar Senha Login
            const password = document.getElementById('login-password').value;
            if(!setError('wrapper-login-password', 'error-login-password', password.trim() === '')) isValid = false;

            if (isValid) {
                const btn = loginForm.querySelector('button[type="submit"]');
                const originalText = btn.innerText;
                btn.innerText = "Entrando...";
                btn.disabled = true;
                
                setTimeout(() => {
                    // Simulação de sucesso
                    btn.innerText = originalText;
                    btn.disabled = false;
                    window.location.href = 'dashboard.html';
                }, 1500);
            }
        });
    }
});