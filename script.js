document.addEventListener('DOMContentLoaded', () => {
    
    // ============================================================
    // 1. CACHE INSTANTÂNEO
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
    // 3. LOGIN / REDIRECT
    // ============================================================
    if (window.location.pathname.includes('dashboard.html')) {
        auth.onAuthStateChanged(user => {
            if (user) carregarDadosUsuario(user);
            else window.location.href = 'login.html';
        });
    }

    if (window.location.pathname.includes('login.html')) {
        auth.onAuthStateChanged(user => {
            if (user) window.location.href = 'dashboard.html';
        });
    }

    // ============================================================
    // 4. CADASTRO
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

            if (password !== confirmPassword) return alert("Senhas diferentes!");
            if (!terms.checked) return alert("Aceite os termos!");

            const btn = registerForm.querySelector('button[type="submit"]');
            btn.innerText = "Criando...";
            btn.disabled = true;

            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    return db.collection('users').doc(userCredential.user.uid).set({
                        nome: nome,
                        email: email,
                        criadoEm: new Date(),
                        nivel: 1,
                        xp: 0,
                        totalEconomizado: 0,
                        metaAtual: 0,
                        sequencia: 0,
                        metasCriadas: 0,
                        photoURL: ""
                    });
                })
                .then(() => {
                    alert("Conta criada!");
                    window.location.href = 'dashboard.html';
                })
                .catch((error) => {
                    alert("Erro: " + error.message);
                    btn.innerText = "Criar conta";
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
                .then(() => window.location.href = 'dashboard.html')
                .catch((error) => {
                    alert("E-mail ou senha incorretos.");
                    btn.innerText = "Entrar";
                    btn.disabled = false;
                });
        });
    }

    // ============================================================
    // 6. CARREGAR DADOS
    // ============================================================
    function carregarDadosUsuario(user) {
        db.collection('users').doc(user.uid).onSnapshot((doc) => {
            if (doc.exists) {
                const data = doc.data();
                
                // Nome e Cache
                const nomeCompleto = data.nome || "Visitante";
                const primeiroNome = nomeCompleto.split(' ')[0];
                localStorage.setItem('invest_userName', primeiroNome);
                if(document.getElementById('user-name')) document.getElementById('user-name').innerText = primeiroNome + "!";

                // Foto
                const avatarUrl = data.photoURL || "https://cdn-icons-png.flaticon.com/512/847/847969.png";
                document.querySelectorAll('.user-avatar').forEach(img => img.src = avatarUrl);
                if(document.getElementById('current-avatar-preview')) document.getElementById('current-avatar-preview').src = avatarUrl;

                // Nível e XP
                if(document.getElementById('user-level')) document.getElementById('user-level').innerText = data.nivel || 1;
                if(document.getElementById('user-level-badge')) document.getElementById('user-level-badge').innerText = data.nivel || 1;
                
                const xpAtual = data.xp || 0;
                const nivelAtual = data.nivel || 1;
                const xpProximo = nivelAtual * 1000;
                const xpPorcent = (xpAtual / xpProximo) * 100;

                if(document.getElementById('user-xp-text')) document.getElementById('user-xp-text').innerText = `${xpAtual} / ${xpProximo} XP`;
                if(document.getElementById('user-xp-bar')) document.getElementById('user-xp-bar').style.width = `${xpPorcent}%`;

                // Dinheiro
                const total = data.totalEconomizado || 0;
                const dinheiro = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                
                if(document.getElementById('header-total-saved')) document.getElementById('header-total-saved').innerText = dinheiro;
                if(document.getElementById('stat-saved')) document.getElementById('stat-saved').innerText = dinheiro;
                if(document.getElementById('stat-streak')) document.getElementById('stat-streak').innerText = `${data.sequencia || 0} dias`;

                carregarMetas(user);
            }
        });

        // Botão Sair
        const btnSair = document.querySelector('.dash-user-actions .btn-outline');
        if (btnSair) {
            btnSair.addEventListener('click', (e) => {
                e.preventDefault();
                auth.signOut().then(() => {
                    localStorage.removeItem('invest_userName');
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
        document.getElementById('tab-' + tabName).classList.add('active');
        
        const btn = document.querySelector(`button[onclick="openTab('${tabName}')"]`);
        if(btn) btn.classList.add('active');
    };

    window.openModal = function(modalId) {
        document.getElementById('modal-' + modalId).classList.add('active');
    };

    window.closeModal = function(modalId) {
        document.getElementById('modal-' + modalId).classList.remove('active');
    };

    window.selectIcon = function(element) {
        document.querySelectorAll('.icon-option').forEach(opt => opt.classList.remove('selected'));
        element.classList.add('selected');
        document.getElementById('goal-icon').value = element.getAttribute('data-value');
    };

    // ============================================================
    // 8. LÓGICA DE METAS (CRIAÇÃO, EDIÇÃO E LISTAGEM)
    // ============================================================

    // --- CRIAR META ---
    const formNewGoal = document.getElementById('form-new-goal');
    if(formNewGoal) {
        formNewGoal.addEventListener('submit', function(e) {
            e.preventDefault();
            const user = auth.currentUser;
            if(!user) return;

            const btn = formNewGoal.querySelector('button[type="submit"]');
            btn.innerText = "Salvando...";
            btn.disabled = true;

            db.collection('users').doc(user.uid).collection('goals').add({
                nome: document.getElementById('goal-name').value,
                valorMeta: parseFloat(document.getElementById('goal-target').value),
                valorAtual: 0,
                icon: document.getElementById('goal-icon').value,
                criadoEm: new Date(),
                status: "ativa"
            }).then(() => {
                alert("Meta criada!");
                closeModal('new-goal');
                formNewGoal.reset();
                db.collection('users').doc(user.uid).update({ metasCriadas: firebase.firestore.FieldValue.increment(1) });
            }).finally(() => {
                btn.innerText = "Criar Meta";
                btn.disabled = false;
            });
        });
    }

    // --- ABRIR MODAL DE EDIÇÃO ---
    window.openEditGoalModal = function(goalId, currentTotal, currentTarget) {
        document.getElementById('edit-goal-id').value = goalId;
        // Salva o valor atual num input escondido para a gente checar depois
        document.getElementById('edit-current-val').value = currentTotal; 
        
        document.getElementById('edit-amount').value = ''; 
        document.getElementById('edit-target').value = currentTarget; 
        
        // Reseta para "Depositar"
        document.querySelector('input[name="trans-type"][value="deposit"]').checked = true;
        openModal('edit-goal');
    };

    // --- PROCESSAR EDIÇÃO (DEPOSITO/SAQUE/ALVO) ---
    const formEditGoal = document.getElementById('form-edit-goal');
    if(formEditGoal) {
        formEditGoal.addEventListener('submit', function(e) {
            e.preventDefault();
            const user = auth.currentUser;
            const goalId = document.getElementById('edit-goal-id').value;
            const currentVal = parseFloat(document.getElementById('edit-current-val').value); // Valor atual
            
            const transType = document.querySelector('input[name="trans-type"]:checked').value;
            const amountInput = document.getElementById('edit-amount').value;
            const amount = amountInput ? parseFloat(amountInput) : 0;
            const newTarget = parseFloat(document.getElementById('edit-target').value);

            if(!user || !goalId) return;

            // --- VALIDAÇÃO DE SAQUE ---
            if (transType === 'withdraw' && amount > currentVal) {
                alert(`Erro: Você só tem R$ ${currentVal.toLocaleString('pt-BR')} nesta meta. Não é possível sacar R$ ${amount.toLocaleString('pt-BR')}.`);
                return; // Para a função aqui
            }

            const btn = formEditGoal.querySelector('button[type="submit"]');
            btn.innerText = "Salvando...";
            btn.disabled = true;

            // Calcula a mudança
            let changeInValue = 0;
            if (amount > 0) {
                changeInValue = (transType === 'deposit') ? amount : -amount;
            }

            db.collection('users').doc(user.uid).collection('goals').doc(goalId).update({
                valorAtual: firebase.firestore.FieldValue.increment(changeInValue),
                valorMeta: newTarget
            }).then(() => {
                if (changeInValue !== 0) {
                    db.collection('users').doc(user.uid).update({
                        totalEconomizado: firebase.firestore.FieldValue.increment(changeInValue),
                        xp: firebase.firestore.FieldValue.increment(changeInValue > 0 ? 25 : 0) 
                    });
                }
                alert("Atualizado com sucesso!");
                closeModal('edit-goal');
            }).catch((err) => {
                console.error(err);
                alert("Erro ao atualizar.");
            }).finally(() => {
                btn.innerText = "Salvar Alterações";
                btn.disabled = false;
            });
        });
    }

    // --- CARREGAR METAS (COM SEPARAÇÃO) ---
    function carregarMetas(user) {
        db.collection('users').doc(user.uid).collection('goals')
            .orderBy('criadoEm', 'desc')
            .onSnapshot((snapshot) => {
                const containerActive = document.getElementById('goals-container');
                const containerCompleted = document.getElementById('completed-goals-container');
                const sectionCompleted = document.getElementById('completed-section');
                const congratsMsg = document.getElementById('congrats-msg');
                const congratsCount = document.getElementById('congrats-count');
                const overviewList = document.getElementById('overview-goals-list');

                if(containerActive) containerActive.innerHTML = '';
                if(containerCompleted) containerCompleted.innerHTML = '';
                if(overviewList) overviewList.innerHTML = '';

                let completedCount = 0;
                let overviewHTML = '';

                snapshot.forEach(doc => {
                    const meta = doc.data();
                    const metaID = doc.id;
                    const porcentagem = Math.min(100, (meta.valorAtual / meta.valorMeta) * 100).toFixed(0);
                    // Regra: Se o valor atual for maior ou igual a meta, está concluída
                    const isCompleted = meta.valorAtual >= meta.valorMeta && meta.valorMeta > 0;

                    let colorClass = 'text-blue', bgClass = 'bg-blue', bgLightClass = 'bg-blue-light';
                    if(meta.icon.includes('gamepad')) { colorClass = 'text-purple'; bgClass = 'bg-purple'; bgLightClass = 'bg-purple-light'; }
                    if(meta.icon.includes('car')) { colorClass = 'text-orange'; bgClass = 'bg-orange'; bgLightClass = 'bg-orange-light'; }
                    if(meta.icon.includes('house')) { colorClass = 'text-green'; bgClass = 'bg-green'; bgLightClass = 'bg-green-light'; }
                    
                    if(isCompleted) { colorClass = 'text-green'; bgClass = 'bg-green'; bgLightClass = 'bg-green-light'; }

                    const cardHTML = `
                    <div class="goal-box" style="${isCompleted ? 'border: 2px solid #10B981; background: #F0FDF4;' : ''}">
                        <div class="goal-box-header">
                            <div class="goal-icon-lg ${bgLightClass} ${colorClass}">
                                <i class="fa-solid ${meta.icon}"></i>
                            </div>
                            <span class="goal-percent ${colorClass}">${isCompleted ? '<i class="fa-solid fa-check"></i>' : porcentagem + '%'}</span>
                        </div>
                        <h4 class="goal-title">${meta.nome}</h4>
                        <div class="goal-stats">
                            <span class="stat-label">Atual</span>
                            <span class="stat-value">R$ ${meta.valorAtual.toLocaleString('pt-BR')}</span>
                        </div>
                        <div class="progress-track-lg">
                            <div class="progress-fill ${bgClass}" style="width: ${porcentagem}%;"></div>
                        </div>
                        <div class="goal-stats mt-1 mb-4">
                            <span class="stat-label">Meta</span>
                            <span class="stat-value">R$ ${meta.valorMeta.toLocaleString('pt-BR')}</span>
                        </div>
                        <button class="btn-action-outline" onclick="openEditGoalModal('${metaID}', ${meta.valorAtual}, ${meta.valorMeta})">
                            Gerenciar
                        </button>
                    </div>`;

                    if (isCompleted) {
                        if(containerCompleted) containerCompleted.innerHTML += cardHTML;
                        completedCount++;
                    } else {
                        if(containerActive) containerActive.innerHTML += cardHTML;
                    }
                    overviewHTML += cardHTML;
                });

                if (snapshot.empty) {
                    const emptyHTML = `<div style="text-align:center; padding: 2rem; color: #94A3B8; grid-column: 1/-1;">Nenhuma meta encontrada.</div>`;
                    if(containerActive) containerActive.innerHTML = emptyHTML;
                    if(overviewList) overviewList.innerHTML = emptyHTML;
                } else if(overviewList) {
                    overviewList.style.display = 'grid';
                    overviewList.style.gridTemplateColumns = 'repeat(auto-fit, minmax(280px, 1fr))';
                    overviewList.style.gap = '1.5rem';
                    overviewList.innerHTML = overviewHTML;
                }

                // Exibe ou esconde a seção de concluídas
                if (completedCount > 0) {
                    if(sectionCompleted) sectionCompleted.style.display = 'block';
                    if(congratsMsg) congratsMsg.style.display = 'block';
                    if(congratsCount) congratsCount.innerText = completedCount;
                } else {
                    if(sectionCompleted) sectionCompleted.style.display = 'none';
                    if(congratsMsg) congratsMsg.style.display = 'none';
                }
            });
    }

    // ============================================================
    // 9. PERFIL
    // ============================================================
    const formPhoto = document.getElementById('form-update-photo');
    if(formPhoto) {
        formPhoto.addEventListener('submit', function(e) {
            e.preventDefault();
            const user = auth.currentUser;
            const newPhotoURL = document.getElementById('new-photo-url').value;
            const btn = formPhoto.querySelector('button');

            if(!user || !newPhotoURL) return;
            btn.innerText = "Atualizando...";
            btn.disabled = true;

            user.updateProfile({ photoURL: newPhotoURL })
                .then(() => db.collection('users').doc(user.uid).update({ photoURL: newPhotoURL }))
                .then(() => {
                    alert("Foto atualizada!");
                    document.querySelectorAll('.user-avatar').forEach(img => img.src = newPhotoURL);
                    document.getElementById('current-avatar-preview').src = newPhotoURL;
                    formPhoto.reset();
                })
                .finally(() => { btn.innerText = "Atualizar Foto"; btn.disabled = false; });
        });
    }

    const formPass = document.getElementById('form-update-password');
    if(formPass) {
        formPass.addEventListener('submit', function(e) {
            e.preventDefault();
            const user = auth.currentUser;
            const currentPass = document.getElementById('current-password').value;
            const newPass = document.getElementById('new-password').value;
            const btn = formPass.querySelector('button');

            if(newPass.length < 6) return alert("Mínimo 6 caracteres.");
            btn.innerText = "Verificando...";
            btn.disabled = true;

            const credential = firebase.auth.EmailAuthProvider.credential(user.email, currentPass);
            user.reauthenticateWithCredential(credential)
                .then(() => {
                    btn.innerText = "Salvando...";
                    return user.updatePassword(newPass);
                })
                .then(() => {
                    alert("Senha alterada!");
                    formPass.reset();
                })
                .catch((error) => {
                    if(error.code === 'auth/wrong-password') alert("Senha atual incorreta.");
                    else alert("Erro: " + error.message);
                })
                .finally(() => { btn.innerText = "Alterar Senha"; btn.disabled = false; });
        });
    }
});