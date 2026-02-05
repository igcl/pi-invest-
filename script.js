document.addEventListener('DOMContentLoaded', () => {
    
    // ============================================================
    // 1. CACHE INSTANTÂNEO (Carrega o nome antes do Firebase)
    // ============================================================
    const nomeEmCache = localStorage.getItem('invest_userName');
    if (nomeEmCache) {
        const nameElement = document.getElementById('user-name');
        if (nameElement) nameElement.innerText = nomeEmCache + "!";
    }

    // ============================================================
    // 2. CONFIGURAÇÃO DO FIREBASE
    // ============================================================
    const firebaseConfig = {
        apiKey: "AIzaSyAWS6mGjvwtEhACmexZ6FRx7zhfy2qo1EI",
        authDomain: "ptinvestplus.firebaseapp.com",
        projectId: "ptinvestplus",
        storageBucket: "ptinvestplus.firebasestorage.app",
        messagingSenderId: "947595504",
        appId: "1:947595504:web:e07489ce3736e1a6953a35",
        measurementId: "G-2VJ3TJ2QR7"
    };

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    
    const auth = firebase.auth();
    const db = firebase.firestore();

    // ============================================================
    // 3. GERENCIAMENTO DE LOGIN E REDIRECIONAMENTO
    // ============================================================
    
    // A. Se estiver no DASHBOARD: Protege a rota (Chuta se não tiver logado)
    if (window.location.pathname.includes('dashboard.html')) {
        auth.onAuthStateChanged(user => {
            if (user) {
                carregarDadosUsuario(user);
            } else {
                window.location.href = 'login.html';
            }
        });
    }

    // B. Se estiver no LOGIN: Redireciona se já estiver logado
    // (IMPORTANTE: Não colocamos 'register.html' aqui para evitar o bug do redirecionamento antes de salvar)
    if (window.location.pathname.includes('login.html')) {
        auth.onAuthStateChanged(user => {
            if (user) {
                window.location.href = 'dashboard.html';
            }
        });
    }

    // ============================================================
    // 4. CADASTRO (REGISTER)
    // ============================================================
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nome = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const terms = document.getElementById('terms');

            if (password !== confirmPassword) return alert("As senhas não coincidem!");
            if (!terms.checked) return alert("Você precisa aceitar os termos!");

            const btn = registerForm.querySelector('button[type="submit"]');
            btn.innerText = "Criando conta...";
            btn.disabled = true;

            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Salvar dados no Firestore
                    return db.collection('users').doc(userCredential.user.uid).set({
                        nome: nome,
                        email: email,
                        criadoEm: new Date(),
                        nivel: 1,
                        xp: 0,
                        totalEconomizado: 0,
                        metaAtual: 0,
                        sequencia: 0,
                        metasCriadas: 0
                    });
                })
                .then(() => {
                    alert("Conta criada com sucesso! Redirecionando...");
                    window.location.href = 'dashboard.html';
                })
                .catch((error) => {
                    console.error("Erro:", error);
                    let msg = "Erro ao criar conta: " + error.message;
                    if(error.code === 'auth/email-already-in-use') msg = "Este e-mail já está em uso.";
                    if(error.code === 'auth/weak-password') msg = "A senha é muito fraca.";
                    alert(msg);
                    
                    btn.innerText = "Criar conta gratuitamente";
                    btn.disabled = false;
                });
        });
    }

    // ============================================================
    // 5. LOGIN
    // ============================================================
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            const btn = loginForm.querySelector('button[type="submit"]');
            btn.innerText = "Entrando...";
            btn.disabled = true;

            auth.signInWithEmailAndPassword(email, password)
                .then(() => {
                    window.location.href = 'dashboard.html';
                })
                .catch((error) => {
                    console.error("Erro:", error);
                    alert("E-mail ou senha incorretos.");
                    btn.innerText = "Entrar";
                    btn.disabled = false;
                });
        });
    }

    // ============================================================
    // 6. CARREGAR DADOS DO USUÁRIO (DASHBOARD)
    // ============================================================
    function carregarDadosUsuario(user) {
        db.collection('users').doc(user.uid).onSnapshot((doc) => {
            if (doc.exists) {
                const data = doc.data();
                
                // --- TRATAMENTO DO NOME E ATUALIZAÇÃO DO CACHE ---
                const nomeCompleto = data.nome || "Visitante";
                const primeiroNome = nomeCompleto.split(' ')[0];
                
                // SALVA NO CACHE PARA O PRÓXIMO ACESSO SER RÁPIDO
                localStorage.setItem('invest_userName', primeiroNome);

                // ATUALIZA NA TELA
                const nameElement = document.getElementById('user-name');
                if (nameElement) nameElement.innerText = primeiroNome + "!";

                // --- RESTO DOS DADOS ---
                if(document.getElementById('user-level')) document.getElementById('user-level').innerText = data.nivel || 1;
                if(document.getElementById('user-level-badge')) document.getElementById('user-level-badge').innerText = data.nivel || 1;
                
                const xpAtual = data.xp || 0;
                const nivelAtual = data.nivel || 1;
                const xpProximo = nivelAtual * 1000;
                const xpPorcent = (xpAtual / xpProximo) * 100;

                if(document.getElementById('user-xp-text')) document.getElementById('user-xp-text').innerText = `${xpAtual} / ${xpProximo} XP`;
                if(document.getElementById('user-xp-bar')) document.getElementById('user-xp-bar').style.width = `${xpPorcent}%`;

                // Dinheiro e Sequência
                const total = data.totalEconomizado || 0;
                const dinheiro = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                
                if(document.getElementById('header-total-saved')) document.getElementById('header-total-saved').innerText = dinheiro;
                if(document.getElementById('stat-saved')) document.getElementById('stat-saved').innerText = dinheiro;
                if(document.getElementById('stat-streak')) document.getElementById('stat-streak').innerText = `${data.sequencia || 0} dias`;

            }
        });

        // Configurar botão sair
        const btnSair = document.querySelector('.dash-user-actions .btn-outline');
        if (btnSair) {
            btnSair.addEventListener('click', (e) => {
                e.preventDefault();
                auth.signOut().then(() => {
                    localStorage.removeItem('invest_userName'); // Limpa o cache ao sair
                    window.location.href = 'index.html';
                });
            });
        }
    }

    // ============================================================
    // 7. UTILITÁRIOS
    // ============================================================
    window.openTab = function(tabName) {
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        
        const target = document.getElementById('tab-' + tabName);
        if(target) target.classList.add('active');

        // Ativa o botão visualmente
        const buttons = document.querySelectorAll('.tab-btn');
        buttons.forEach(btn => {
            if(btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(tabName)) {
                btn.classList.add('active');
            }
        });
    };
});