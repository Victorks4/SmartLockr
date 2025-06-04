// Smart Lock IoT Dashboard JavaScript

// IP do ESP32
const ESP32_IP = '192.168.178.110';

// Global variables
let isLocked = false;
let activityData = [];
let currentLaboratory = 1;
let todayAccessCount = 0; // Novo: contador de acessos diários

// Professores e seus IDs RFID (carregados ou inicializados)
let teachers = {};

// Tags registradas (incluindo professores) (carregadas ou inicializadas)
let registeredTags = [];

// Estado dos laboratórios
let laboratories = {
  1: { teacher: null, isLocked: false, assignedClass: null },
  2: { teacher: null, isLocked: false, assignedClass: null },
  3: { teacher: null, isLocked: false, assignedClass: null },
  4: { teacher: null, isLocked: false, assignedClass: null },
  5: { teacher: null, isLocked: false, assignedClass: null },
  6: { teacher: null, isLocked: false, assignedClass: null },
  7: { teacher: null, isLocked: false, assignedClass: null },
  8: { teacher: null, isLocked: false, assignedClass: null },
  9: { teacher: null, isLocked: false, assignedClass: null },
  10: { teacher: null, isLocked: false, assignedClass: null }
};

// Schedule management
const initialScheduleData = {
  segunda: {
    manha: [
      { time: '08:00 - 09:40', lab: 1, subject: 'Internet das Coisas', teacher: 'Icaro Alvim', status: 'Aguardando' },
      { time: '08:00 - 09:40', lab: 2, subject: 'Banco de Dados', teacher: 'Moises Lima', status: 'Aguardando' },
      { time: '10:00 - 11:40', lab: 3, subject: 'Programação de Apps', teacher: 'Icaro Alvim', status: 'Aguardando' },
      { time: '10:00 - 11:40', lab: 4, subject: 'Desenvolvimento de Sistemas', teacher: 'Moises Lima', status: 'Aguardando' }
    ],
    tarde: [
      { time: '13:30 - 15:10', lab: 5, subject: 'Análise de Dados', teacher: 'Icaro Alvim', status: 'Aguardando' },
      { time: '13:30 - 15:10', lab: 6, subject: 'Lógica de Programação', teacher: 'Moises Lima', status: 'Aguardando' },
      { time: '15:30 - 17:10', lab: 7, subject: 'Internet das Coisas', teacher: 'Icaro Alvim', status: 'Aguardando' },
      { time: '15:30 - 17:10', lab: 8, subject: 'Banco de Dados', teacher: 'Moises Lima', status: 'Aguardando' }
    ],
    noite: [
      { time: '18:30 - 20:10', lab: 9, subject: 'Programação de Apps', teacher: 'Icaro Alvim', status: 'Aguardando' },
      { time: '18:30 - 20:10', lab: 10, subject: 'Desenvolvimento de Sistemas', teacher: 'Moises Lima', status: 'Aguardando' },
      { time: '20:20 - 22:00', lab: 1, subject: 'Análise de Dados', teacher: 'Icaro Alvim', status: 'Aguardando' },
      { time: '20:20 - 22:00', lab: 2, subject: 'Lógica de Programação', teacher: 'Moises Lima', status: 'Aguardando' }
    ]
  },
  terca: {
    manha: [
      { time: '08:00 - 09:40', lab: 3, subject: 'Banco de Dados', teacher: 'Moises Lima', status: 'Aguardando' },
      { time: '08:00 - 09:40', lab: 4, subject: 'Internet das Coisas', teacher: 'Icaro Alvim', status: 'Aguardando' },
      { time: '10:00 - 11:40', lab: 5, subject: 'Desenvolvimento de Sistemas', teacher: 'Moises Lima', status: 'Aguardando' },
      { time: '10:00 - 11:40', lab: 6, subject: 'Programação de Apps', teacher: 'Icaro Alvim', status: 'Aguardando' }
    ],
    tarde: [
      { time: '13:30 - 15:10', lab: 7, subject: 'Lógica de Programação', teacher: 'Moises Lima', status: 'Aguardando' },
      { time: '13:30 - 15:10', lab: 8, subject: 'Análise de Dados', teacher: 'Icaro Alvim', status: 'Aguardando' },
      { time: '15:30 - 17:10', lab: 9, subject: 'Banco de Dados', teacher: 'Moises Lima', status: 'Aguardando' },
      { time: '15:30 - 17:10', lab: 10, subject: 'Internet das Coisas', teacher: 'Icaro Alvim', status: 'Aguardando' }
    ],
    noite: [
      { time: '18:30 - 20:10', lab: 1, subject: 'Desenvolvimento de Sistemas', teacher: 'Moises Lima', status: 'Aguardando' },
      { time: '18:30 - 20:10', lab: 2, subject: 'Programação de Apps', teacher: 'Icaro Alvim', status: 'Aguardando' },
      { time: '20:20 - 22:00', lab: 3, subject: 'Lógica de Programação', teacher: 'Moises Lima', status: 'Aguardando' },
      { time: '20:20 - 22:00', lab: 4, subject: 'Análise de Dados', teacher: 'Icaro Alvim', status: 'Aguardando' }
    ]
  },
  quarta: {
    manha: [
      { time: '08:00 - 09:40', lab: 5, subject: 'Internet das Coisas', teacher: 'Icaro Alvim', status: 'Aguardando' },
      { time: '08:00 - 09:40', lab: 6, subject: 'Banco de Dados', teacher: 'Moises Lima', status: 'Aguardando' },
      { time: '10:00 - 11:40', lab: 7, subject: 'Programação de Apps', teacher: 'Icaro Alvim', status: 'Aguardando' },
      { time: '10:00 - 11:40', lab: 8, subject: 'Desenvolvimento de Sistemas', teacher: 'Moises Lima', status: 'Aguardando' }
    ],
    tarde: [
      { time: '13:30 - 15:10', lab: 9, subject: 'Análise de Dados', teacher: 'Icaro Alvim', status: 'Aguardando' },
      { time: '13:30 - 15:10', lab: 10, subject: 'Lógica de Programação', teacher: 'Moises Lima', status: 'Aguardando' },
      { time: '15:30 - 17:10', lab: 8, subject: 'Internet das Coisas', teacher: 'Icaro Alvim', status: 'Aguardando' },
      { time: '15:30 - 17:10', lab: 2, subject: 'Banco de Dados', teacher: 'Moises Lima', status: 'Aguardando' }
    ],
    noite: [
      { time: '18:30 - 20:10', lab: 3, subject: 'Programação de Apps', teacher: 'Icaro Alvim', status: 'Aguardando' },
      { time: '18:30 - 20:10', lab: 4, subject: 'Desenvolvimento de Sistemas', teacher: 'Moises Lima', status: 'Aguardando' },
      { time: '20:20 - 22:00', lab: 5, subject: 'Análise de Dados', teacher: 'Icaro Alvim', status: 'Aguardando' },
      { time: '20:20 - 22:00', lab: 6, subject: 'Lógica de Programação', teacher: 'Moises Lima', status: 'Aguardando' }
    ]
  },
  quinta: {
    manha: [
      { time: '08:00 - 09:40', lab: 7, subject: 'Banco de Dados', teacher: 'Moises Lima', status: 'Aguardando' },
      { time: '08:00 - 09:40', lab: 8, subject: 'Internet das Coisas', teacher: 'Icaro Alvim', status: 'Aguardando' },
      { time: '10:00 - 11:40', lab: 9, subject: 'Desenvolvimento de Sistemas', teacher: 'Moises Lima', status: 'Aguardando' },
      { time: '10:00 - 11:40', lab: 10, subject: 'Programação de Apps', teacher: 'Icaro Alvim', status: 'Aguardando' }
    ],
    tarde: [
      { time: '13:30 - 15:10', lab: 1, subject: 'Lógica de Programação', teacher: 'Moises Lima', status: 'Aguardando' },
      { time: '13:30 - 15:10', lab: 2, subject: 'Análise de Dados', teacher: 'Icaro Alvim', status: 'Aguardando' },
      { time: '15:30 - 17:10', lab: 3, subject: 'Banco de Dados', teacher: 'Moises Lima', status: 'Aguardando' },
      { time: '15:30 - 17:10', lab: 4, subject: 'Internet das Coisas', teacher: 'Icaro Alvim', status: 'Aguardando' }
    ],
    noite: [
      { time: '18:30 - 20:10', lab: 5, subject: 'Desenvolvimento de Sistemas', teacher: 'Moises Lima', status: 'Aguardando' },
      { time: '18:30 - 20:10', lab: 6, subject: 'Programação de Apps', teacher: 'Icaro Alvim', status: 'Aguardando' },
      { time: '20:20 - 22:00', lab: 7, subject: 'Lógica de Programação', teacher: 'Moises Lima', status: 'Aguardando' },
      { time: '20:20 - 22:00', lab: 8, subject: 'Análise de Dados', teacher: 'Icaro Alvim', status: 'Aguardando' }
    ]
  },
  sexta: {
    manha: [
      { time: '08:00 - 09:40', lab: 9, subject: 'Internet das Coisas', teacher: 'Icaro Alvim', status: 'Aguardando' },
      { time: '08:00 - 09:40', lab: 10, subject: 'Banco de Dados', teacher: 'Moises Lima', status: 'Aguardando' },
      { time: '10:00 - 11:40', lab: 1, subject: 'Programação de Apps', teacher: 'Icaro Alvim', status: 'Aguardando' },
      { time: '10:00 - 11:40', lab: 2, subject: 'Desenvolvimento de Sistemas', teacher: 'Moises Lima', status: 'Aguardando' }
    ],
    tarde: [
      { time: '13:30 - 15:10', lab: 3, subject: 'Análise de Dados', teacher: 'Icaro Alvim', status: 'Aguardando' },
      { time: '13:30 - 15:10', lab: 4, subject: 'Lógica de Programação', teacher: 'Moises Lima', status: 'Aguardando' },
      { time: '15:30 - 17:10', lab: 5, subject: 'Internet das Coisas', teacher: 'Icaro Alvim', status: 'Aguardando' },
      { time: '15:30 - 17:10', lab: 6, subject: 'Banco de Dados', teacher: 'Moises Lima', status: 'Aguardando' }
    ],
    noite: [
      { time: '18:30 - 20:10', lab: 7, subject: 'Programação de Apps', teacher: 'Icaro Alvim', status: 'Aguardando' },
      { time: '18:30 - 20:10', lab: 8, subject: 'Desenvolvimento de Sistemas', teacher: 'Moises Lima', status: 'Aguardando' },
      { time: '20:20 - 22:00', lab: 9, subject: 'Análise de Dados', teacher: 'Icaro Alvim', status: 'Aguardando' },
      { time: '20:20 - 22:00', lab: 10, subject: 'Lógica de Programação', teacher: 'Moises Lima', status: 'Aguardando' }
    ]
  }
};


let scheduleData = JSON.parse(JSON.stringify(initialScheduleData)); // Initialize with a deep copy

// Dados iniciais padrão para professores e tags (usados se o localStorage estiver vazio)
const defaultTeachers = {
  'ICARO001': {
    name: 'Icaro Alvim',
    rfid: 'ICARO001',
    coordinator: 'Coordenação de TI',
    subjects: ['Internet das Coisas', 'Programação de Apps', 'Análise de Dados']
  },
  'MOISES001': {
    name: 'Moises Lima',
    rfid: 'MOISES001',
    coordinator: 'Coordenação de TI',
    subjects: ['Banco de Dados', 'Desenvolvimento de Sistemas', 'Lógica de Programação']
  }
};

const defaultRegisteredTags = [
  {
    id: 'ICARO001',
    name: 'Icaro Alvim',
    lastUsed: new Date().toLocaleString(),
    status: 'Active',
    type: 'teacher'
  },
  {
    id: 'MOISES001',
    name: 'Moises Lima',
    lastUsed: new Date().toLocaleString(),
    status: 'Active',
    type: 'teacher'
  }
];

// Adicionar event listeners quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', function() {
  // Carregar dados do localStorage
  loadDataFromStorage();

  // Inicializar a página
  const isActivityPage = window.location.pathname.includes('activity.html');
  if (isActivityPage) {
    initActivityPage();
  } else {
    console.log('Smart Lock Dashboard initialized');
    // loadActivityFeed(); // Removido: atividades de exemplo
    updateStats();
    // startRealTimeSimulation(); // Removido: simulação de conexão e eventos
    setInterval(updateTimestamps, 60000);
    updateTeacherInfo();
    populateTeacherSelect();
    // Iniciar o polling do status da porta a cada 3 segundos
    setInterval(pollDoorStatus, 3000);
  }
});

// Função para fazer polling do status da porta do ESP32
async function pollDoorStatus() {
    const labId = currentLaboratory; 
    try {
        // Endpoint do ESP32 para status. Se o seu ESP32 não diferencia labs para o status,
        // você pode remover `?lab=${labId}` ou o ESP32 pode simplesmente ignorá-lo.
        // Para o código ESP32 que fornecemos, ele não usa `labId` na rota /status.
        const response = await fetch(`http://${ESP32_IP.trim()}/status`); // .trim() adicionado ao IP para garantir

        if (!response.ok) {
            console.warn(`Erro ao buscar status do ESP32: ${response.status} ${response.statusText}`);
            // Atualizar UI para mostrar que o ESP está offline ou com erro
            const roomStatusElement = document.getElementById('roomStatus');
            if (roomStatusElement) {
                roomStatusElement.textContent = 'ESP Offline';
                roomStatusElement.className = 'card-text status-offline';
            }
            // Poderia também desabilitar/alterar o botão lockBtn visualmente
            return;
        }
        const data = await response.json();
        console.log("Dados recebidos do ESP32:", data); // Bom para debug

        // 'comando_acesso_liberado' vem do ESP32, que o obtém do Arduino
        // true = Arduino deu comando para liberar
        // false = Arduino deu comando para bloquear
        const newIsLockedBasedOnCommand = !data.comando_acesso_liberado;

        // Atualiza a UI apenas se o estado realmente mudou ou se o estado do lab não está sincronizado
        if (newIsLockedBasedOnCommand !== isLocked || laboratories[currentLaboratory].isLocked !== newIsLockedBasedOnCommand) {
            isLocked = newIsLockedBasedOnCommand;
            laboratories[currentLaboratory].isLocked = isLocked; // Atualiza o estado do laboratório específico

            const roomStatusElement = document.getElementById('roomStatus');
            const lockBtnElement = document.getElementById('lockBtn'); // Renomeado para evitar conflito

            if (roomStatusElement && lockBtnElement) {
                if (isLocked) {
                    roomStatusElement.textContent = 'Trancado';
                    roomStatusElement.className = 'card-text status-locked';
                    lockBtnElement.innerHTML = '<i class="bi bi-lock-fill me-2"></i>Destrancar Laboratório'; // Ou apenas "Trancado" se não for clicável
                    lockBtnElement.className = 'btn btn-danger'; // Ou uma classe de status
                } else {
                    roomStatusElement.textContent = 'Desbloqueado';
                    roomStatusElement.className = 'card-text status-unlocked';
                    lockBtnElement.innerHTML = '<i class="bi bi-unlock-fill me-2"></i>Trancar Laboratório'; // Ou apenas "Desbloqueado"
                    lockBtnElement.className = 'btn btn-success'; // Ou uma classe de status

                    // Só incrementa o contador de acesso se o comando foi para destravar e o estado anterior era trancado.
                    // Para evitar incrementos múltiplos se a porta permanecer destrancada e o polling continuar.
                    // Você pode precisar de uma lógica mais robusta para todayAccessCount se ele só deve contar uma vez por "evento de abertura".
                    // A lógica atual em pollDoorStatus já incrementa 'todayAccessCount' na seção 'else' (quando isLocked se torna false)
                    // E isso é chamado apenas se 'newIsLockedBasedOnCommand !== isLocked'.
                    // Isso pode ser suficiente para contar cada transição para desbloqueado.
                }
            }
            updateStats(); // Atualiza o contador de acessos na UI e outros status
            updateTeacherInfo(); // Garante que as informações do professor sejam atualizadas
            updateScheduleStatus(); // Garante que o cronograma seja atualizado
        }

        // Registrar atividade baseada na ultima_acao_mensagem do ESP32
        if (data.ultima_acao_mensagem && data.ultima_acao_mensagem !== "Aguardando status do Arduino...") {
            // Lógica para evitar adicionar logs duplicados se o timestamp da última ação do ESP não mudou
            const lastActivity = activityData.length > 0 ? activityData[0] : null;
            if (!lastActivity || 
                (lastActivity.metadata_timestamp_esp !== data.timestamp_ultima_acao || 
                 lastActivity.description_key !== data.ultima_acao_mensagem) ) {

                let activityType = 'info';
                let icon = 'bi-info-circle-fill';

                if (data.ultima_acao_mensagem.includes("Liberado")) {
                    activityType = 'success';
                    icon = data.estado_porta_fisica_aberta ? 'bi-door-open-fill' : 'bi-unlock-fill';
                } else if (data.ultima_acao_mensagem.includes("Bloqueado")) {
                    activityType = 'danger';
                    icon = !data.estado_porta_fisica_aberta ? 'bi-lock-fill' : 'bi-shield-lock-fill';
                } else if (data.ultima_acao_mensagem.includes("AVISO")) {
                    activityType = 'warning';
                    icon = 'bi-exclamation-triangle-fill';
                } else if (data.ultimo_rfid && data.ultimo_rfid !== "Nenhum" && data.ultima_acao_mensagem.includes(data.ultimo_rfid)) {
                    // Se a mensagem principal é sobre a detecção de RFID
                    activityType = 'info';
                    icon = 'bi-credit-card-fill';
                }

                let logDescription = data.ultima_acao_mensagem;
                if (data.ultimo_rfid && data.ultimo_rfid !== "Nenhum" && !logDescription.includes(data.ultimo_rfid)) {
                    logDescription += ` (RFID: ${data.ultimo_rfid})`;
                }

                addActivity(
                    activityType,
                    `Status ESP32 (Lab ${currentLaboratory})`,
                    logDescription,
                    icon,
                    { metadata_timestamp_esp: data.timestamp_ultima_acao, description_key: data.ultima_acao_mensagem }
                );
            }
        }
        syncData();

    } catch (error) {
        console.error(`Erro ao fazer polling do status do ESP32 para Lab ${labId}:`, error);
        const roomStatusElement = document.getElementById('roomStatus');
        if (roomStatusElement) {
            roomStatusElement.textContent = 'Offline ESP';
            roomStatusElement.className = 'card-text status-offline';
        }
         // Talvez adicionar uma atividade de log para erro de conexão com ESP
        // addActivity('danger', 'Erro de Conexão ESP', `Falha ao buscar status do ESP32: ${error.message}`, 'bi-wifi-off');
    }
}

// Activity feed functions
function addActivity(type, title, description, icon = 'bi-info-circle-fill', metadata = null) {
  const timestamp = new Date();
  const activity = {
    id: Date.now(),
    type: type,
    title: title,
    description: description,
    icon: icon,
    timestamp: timestamp,
    ...metadata // Adiciona quaisquer metadados passados
  };
  
  activityData.unshift(activity);
  
  // Keep only last 50 activities
  if (activityData.length > 50) {
    activityData = activityData.slice(0, 50);
  }
  
  renderActivityFeed();
  // updateStats(); // updateStats é chamado dentro de pollDoorStatus após a lógica de isLocked
  
  console.log('New activity added:', activity);
}

function renderActivityFeed() {
  const feedContainer = document.getElementById('activityFeed');
  
  if (activityData.length === 0) {
    feedContainer.innerHTML = `
      <div class="text-center text-muted py-4">
        <i class="bi bi-inbox" style="font-size: 3rem;"></i>
        <p class="mt-3">No recent activity</p>
      </div>
    `;
    return;
  }
  
  feedContainer.innerHTML = activityData.map(activity => `
    <div class="activity-item ${activity.type}">
      <div class="activity-icon text-${getActivityColor(activity.type)}">
        <i class="${activity.icon}"></i>
      </div>
      <div class="activity-content">
        <div class="activity-title">${activity.title}</div>
        <div class="activity-description">${activity.description}</div>
        <div class="activity-time">${formatRelativeTime(activity.timestamp)}</div>
      </div>
    </div>
  `).join('');
}

function getActivityColor(type) {
  switch(type) {
    case 'success': return 'success';
    case 'warning': return 'warning';
    case 'danger': return 'danger';
    case 'info': return 'info';
    default: return 'primary';
  }
}

function formatRelativeTime(timestamp) {
  const now = new Date();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
}

// Laboratory management
function changeLaboratory() {
  const select = document.getElementById('laboratorySelect');
  currentLaboratory = parseInt(select.value);
  
  // Update UI with current laboratory state
  const lab = laboratories[currentLaboratory];
  isLocked = lab.isLocked;
  
  // Update room status
  const roomStatus = document.getElementById('roomStatus');
  roomStatus.textContent = isLocked ? 'Trancado' : 'Desbloqueado';
  roomStatus.className = isLocked ? 'status-locked' : 'status-unlocked';
  
  // Update lock button
  const lockBtn = document.getElementById('lockBtn');
  lockBtn.innerHTML = isLocked ? 
    '<i class="bi bi-lock-fill me-2"></i>Destrancar Laboratório' :
    '<i class="bi bi-unlock-fill me-2"></i>Trancar Laboratório';
  lockBtn.className = isLocked ? 'btn btn-danger' : 'btn btn-success';
  
  // Update teacher info
  updateTeacherInfo();
  
  addActivity('info', 'Laboratório Alterado', `Laboratório ${currentLaboratory} selecionado`, 'bi-building');
  syncData();
}

function updateTeacherInfo() {
  const currentTeacher = document.getElementById('currentTeacher');
  const currentRFID = document.getElementById('currentRFID');
  
  if (!currentTeacher || !currentRFID) return;
  
  const lab = laboratories[currentLaboratory];
  
  if (lab && lab.teacher) {
    currentTeacher.textContent = lab.teacher.name;
    currentRFID.textContent = lab.teacher.rfid;
  } else {
    currentTeacher.textContent = 'Não definido';
    currentRFID.textContent = '-';
  }
}

function changeTeacher() {
  const modal = new bootstrap.Modal(document.getElementById('changeTeacherModal'));
  modal.show();
}

// Função para adicionar um novo campo de matéria
function addSubjectField() {
  const container = document.getElementById('subjectsContainer');
  if (!container) return;

  const newGroup = document.createElement('div');
  newGroup.className = 'mb-3 subject-input-group';
  newGroup.innerHTML = `
    <label class="form-label">Matéria</label>
    <div class="input-group">
      <input type="text" class="form-control subject-input" placeholder="Qual matéria você leciona?" required>
      <button type="button" class="btn btn-outline-danger remove-subject">
        <i class="bi bi-trash"></i>
      </button>
    </div>
  `;

  // Adicionar o novo grupo ao container
  container.appendChild(newGroup);

  // Mostrar botão de remover em todos os grupos exceto o primeiro
  const removeButtons = document.querySelectorAll('.remove-subject');
  removeButtons.forEach(button => {
    button.style.display = removeButtons.length > 1 ? 'block' : 'none';
  });

  // Focar no novo campo
  const newInput = newGroup.querySelector('.subject-input');
  if (newInput) {
    newInput.focus();
  }
}

// Função para remover um campo de matéria
function removeSubjectField(button) {
  const group = button.closest('.subject-input-group');
  if (!group) return;
  
  group.remove();

  // Atualizar visibilidade dos botões de remover
  const removeButtons = document.querySelectorAll('.remove-subject');
  removeButtons.forEach(btn => {
    btn.style.display = removeButtons.length > 1 ? 'block' : 'none';
  });
}

// Função para obter todas as matérias do formulário
function getSubjectsFromForm() {
  const subjectInputs = document.querySelectorAll('.subject-input');
  return Array.from(subjectInputs)
    .map(input => input.value.trim())
    .filter(subject => subject !== '');
}

// Função para inicializar os event listeners do modal de registro
function initRegisterTeacherModal() {
  const addSubjectBtn = document.getElementById('addSubjectBtn');
  if (addSubjectBtn) {
    addSubjectBtn.addEventListener('click', addSubjectField);
  }

  // Adicionar event listener para os botões de remover matéria
  document.addEventListener('click', function(e) {
    if (e.target.closest('.remove-subject')) {
      removeSubjectField(e.target.closest('.remove-subject'));
    }
  });
}

// Função para abrir o modal de registro de professor
function registerTeacherModal() {
  const modal = new bootstrap.Modal(document.getElementById('registerTeacherModal'));
  modal.show();
  
  // Inicializar os event listeners quando o modal for aberto
  initRegisterTeacherModal();
}

// Função para confirmar o registro de um novo professor
function confirmRegisterTeacher() {
  const name = document.getElementById('registerTeacherName').value.trim();
  const coordinator = document.getElementById('registerTeacherCoordinator').value.trim();
  const rfid = document.getElementById('registerTeacherRFID').value.trim().toUpperCase();
  const subjects = getSubjectsFromForm();

  if (!name || !coordinator || !rfid || subjects.length === 0) {
    alert('Por favor, preencha todos os campos para registrar o professor.');
    return;
  }

  // Verificar se o RFID já existe
  if (teachers[rfid]) {
    alert(`O ID RFID "${rfid}" já está registrado para o professor ${teachers[rfid].name}.`);
    return;
  }

  // Adicionar o novo professor ao objeto teachers
  teachers[rfid] = {
    name: name,
    rfid: rfid,
    coordinator: coordinator,
    subjects: subjects
  };

  // Adicionar a nova tag RFID à lista registeredTags
  registeredTags.unshift({
    id: rfid,
    name: name,
    lastUsed: new Date().toLocaleString(),
    status: 'Active',
    type: 'teacher'
  });

  // Sincronizar dados antes de atualizar a interface
  syncData();

  // Atualizar a interface
  populateTeacherSelect();
  loadRegisteredTags();
  updateActiveTags();

  // Registrar a atividade
  addActivity(
    'success',
    'Professor Registrado',
    `Novo professor ${name} (Coordenador: ${coordinator}, RFID: ${rfid}) registrado com as matérias: ${subjects.join(', ')}`,
    'bi-person-plus-fill'
  );

  // Fechar o modal
  const modal = bootstrap.Modal.getInstance(document.getElementById('registerTeacherModal'));
  modal.hide();

  // Limpar o formulário
  document.getElementById('registerTeacherForm').reset();
  // Remover campos extras de matérias
  const container = document.getElementById('subjectsContainer');
  while (container.children.length > 1) {
    container.removeChild(container.lastChild);
  }

  console.log('Professor registrado com sucesso:', { rfid, name, subjects });
}

// Função para atualizar as opções de matérias baseado no professor selecionado
function updateSubjectOptions() {
  const teacherSelect = document.getElementById('teacherSelect');
  const subjectSelect = document.getElementById('subjectSelect');
  const selectedTeacher = teachers[teacherSelect.value];

  // Limpar opções atuais
  subjectSelect.innerHTML = '<option value="">Selecione uma matéria...</option>';

  if (selectedTeacher) {
    // Adicionar as matérias do professor selecionado
    selectedTeacher.subjects.forEach(subject => {
      const option = document.createElement('option');
      option.value = subject;
      option.textContent = subject;
      subjectSelect.appendChild(option);
    });
  }
}

function confirmTeacherChange() {
  const teacherRFID = document.getElementById('teacherSelect').value;
  const subject = document.getElementById('subjectSelect').value;
  const teacherDay = document.getElementById('teacherDay').value;
  const teacherShift = document.getElementById('teacherShift').value;
  const teacherTime = document.getElementById('teacherTime').value;

  if (!teacherRFID) {
    alert('Por favor, selecione um professor.');
    return;
  }

  if (!subject) {
    alert('Por favor, selecione uma matéria.');
    return;
  }

  const teacher = teachers[teacherRFID];

  // Atualizar o professor no laboratório atual
  laboratories[currentLaboratory].teacher = teacher;
  laboratories[currentLaboratory].assignedClass = {
    day: teacherDay,
    shift: teacherShift,
    time: teacherTime,
    subject: subject,
    teacherName: teacher.name // Store teacher name for easier lookup
  };

  // Atualizar o horário no scheduleData
  const schedule = scheduleData[teacherDay][teacherShift];
  const classIndex = schedule.findIndex(c => c.lab === currentLaboratory && c.time === teacherTime);
  
  if (classIndex !== -1) {
    // Update existing class
    schedule[classIndex].teacher = teacher.name;
    schedule[classIndex].subject = subject;
  } else {
    // Add new class
    schedule.push({
      time: teacherTime,
      lab: currentLaboratory,
      subject: subject,
      teacher: teacher.name,
      status: 'Aguardando'
    });
  }

  // Atualizar a interface
  updateTeacherInfo();
  
  // Registrar a atividade
  addActivity(
    'info',
    'Professor Alterado',
    `Professor ${teacher.name} alocado para o Laboratório ${currentLaboratory} - ${subject} - ${teacherDay} ${teacherShift} ${teacherTime}`,
    'bi-person-plus-fill'
  );

  // Atualizar o cronograma se estiver na página de atividade
  if (window.location.pathname.includes('activity.html')) {
    updateSchedule();
  } else {
    // Se estiver na página principal, atualizar o localStorage para sincronizar com a página de atividade
    syncData();
    // Forçar atualização do cronograma na página de atividade
    localStorage.setItem('forceUpdateSchedule', 'true');
  }

  // Sincronizar dados entre as páginas
  syncData();

  // Fechar o modal
  const modal = bootstrap.Modal.getInstance(document.getElementById('changeTeacherModal'));
  modal.hide();

  // Limpar o formulário
  document.getElementById('changeTeacherForm').reset();
}

function removeTeacher() {
  const lab = laboratories[currentLaboratory];

  if (!lab.teacher) {
    alert('Não há professor alocado para remover neste laboratório.');
    return;
  }

  const teacherName = lab.teacher.name;

  if (!confirm(`Tem certeza que deseja remover o professor ${teacherName} do Laboratório ${currentLaboratory}? Isso removerá apenas as aulas agendadas para este laboratório.`)) {
    return;
  }

  // Remover o professor do laboratório atual
  lab.teacher = null;
  lab.assignedClass = null;

  // Remover as aulas agendadas para este laboratório, independentemente do professor
  // (se o objetivo é limpar o agendamento do laboratório)
  // Ou, se o objetivo é remover APENAS as aulas daquele professor naquele laboratório:
  Object.keys(scheduleData).forEach(day => {
    Object.keys(scheduleData[day]).forEach(shift => {
      scheduleData[day][shift] = scheduleData[day][shift].filter(lesson =>
        !(lesson.lab === currentLaboratory && lesson.teacher === teacherName)
      );
    });
  });

  // Atualizar a interface
  updateTeacherInfo();
  // Não precisa atualizar populateTeacherSelect, loadRegisteredTags, updateActiveTags
  // pois o professor não é removido do sistema, apenas desvinculado do laboratório.

  // Registrar a atividade
  addActivity(
    'warning',
    'Professor Desalocado',
    `Professor ${teacherName} desalocado do Laboratório ${currentLaboratory}. Aulas agendadas para este laboratório foram removidas.`,
    'bi-person-x-fill'
  );

  // Sincronizar dados entre as páginas
  syncData();

  // Forçar atualização do cronograma na página de atividade
  localStorage.setItem('forceUpdateSchedule', 'true');
}

// Room control functions
function toggleLock() {
  console.warn("toggleLock foi chamado, mas o envio de comando para o ESP32 está desabilitado. O status é atualizado apenas via pollDoorStatus.");
  addActivity('warning', 'Comando Desabilitado', 'O botão de trancar/destrancar está desabilitado. O status da porta é controlado pelo ESP32.', 'bi-exclamation-triangle-fill');
  alert("O botão de trancar/destrancar está desabilitado. O status da porta é controlado pelo ESP32.");
}

// Função para lidar com eventos RFID recebidos do ESP32 (mantida para compatibilidade, mas o polling agora é o principal)
// Esta função seria chamada se o ESP32 enviasse dados diretamente para o frontend (ex: via WebSockets ou um endpoint de webhook)
function handleRFIDEvent(data) {
  const { rfid, status, lab } = data;

  // Registrar a tentativa de acesso (se o ESP32 enviar o RFID)
  // Se o ESP32 apenas envia 0/1, esta parte pode ser removida ou adaptada
  if (rfid) {
    registerAccessAttempt(rfid);
  }

  // Encontrar a tag RFID nos dados registrados (se o RFID for enviado)
  const detectedTag = rfid ? registeredTags.find(tag => tag.id === rfid) : null;

  if (lab === currentLaboratory) {
    // Atualizar o status da porta no UI com base no status do ESP32
    const roomStatus = document.getElementById('roomStatus');
    const lockBtn = document.getElementById('lockBtn');

    const newIsLocked = (status === 0); // 0 para trancado, 1 para desbloqueado

    if (newIsLocked !== isLocked) { // Apenas atualiza se o status mudou
      isLocked = newIsLocked;
      laboratories[currentLaboratory].isLocked = isLocked;

      if (isLocked) {
        roomStatus.textContent = 'Trancado';
        roomStatus.className = 'card-text status-locked';
        lockBtn.innerHTML = '<i class="bi bi-lock-fill me-2"></i>Destrancar Laboratório';
        lockBtn.className = 'btn btn-danger';
        addActivity('danger', 'Porta Trancada', `Porta do Laboratório ${lab} trancada${detectedTag ? ` por ${detectedTag.name} (${rfid})` : ''}`, 'bi-lock-fill');
      } else {
        roomStatus.textContent = 'Desbloqueado';
        roomStatus.className = 'card-text status-unlocked';
        lockBtn.innerHTML = '<i class="bi bi-unlock-fill me-2"></i>Trancar Laboratório';
        lockBtn.className = 'btn btn-success';
        addActivity('success', 'Porta Aberta', `Porta do Laboratório ${lab} aberta${detectedTag ? ` por ${detectedTag.name} (${rfid})` : ''}`, 'bi-door-open-fill');
        todayAccessCount++;
      }
      updateStats();
    }
  } else {
    // Se o ESP32 enviar RFID, mas para outro laboratório
    if (rfid) {
      addActivity('warning', 'RFID Detectado (Outro Lab)', `RFID ${rfid} detectado no Laboratório ${lab}, mas o laboratório atual é ${currentLaboratory}. Status: ${status}`, 'bi-exclamation-triangle-fill');
    }
  }
  syncData();
}

// Função para registrar uma nova tag
function registerTag() {
  const tagId = prompt('Por favor, insira o ID RFID da nova tag (ex: ABCD123):');
  if (!tagId || tagId.trim() === '') {
    alert('ID RFID inválido.');
    return;
  }
  const userName = prompt('Por favor, insira o nome do usuário para a nova tag RFID:');
  
  if (userName && userName.trim()) {
    const newTag = {
      id: tagId.trim().toUpperCase(),
      name: userName.trim(),
      lastUsed: new Date().toLocaleString(),
      status: 'Active',
      type: 'student' // Assumindo que tags registradas manualmente são de alunos
    };
    
    // Verificar se a tag já existe
    if (registeredTags.some(tag => tag.id === newTag.id)) {
      alert(`A tag RFID "${newTag.id}" já está registrada.`);
      return;
    }

    registeredTags.unshift(newTag);
    loadRegisteredTags();
    updateActiveTags();
    
    addActivity('info', 'Nova Tag Registrada', `Tag RFID ${newTag.id} registrada para ${userName}`, 'bi-plus-circle-fill');
    
    alert(`Tag RFID ${newTag.id} foi registrada para ${userName}`);
  }
}

function viewLogs() {
  const logWindow = window.open('', '_blank', 'width=800,height=600');
  logWindow.document.write(`
    <html>
      <head>
        <title>Smart Lock Activity Logs</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
      </head>
      <body>
        <div class="container mt-4">
          <h2>Complete Activity Logs</h2>
          <div class="table-responsive">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Type</th>
                  <th>Event</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                ${activityData.map(activity => `
                  <tr>
                    <td>${activity.timestamp.toLocaleString()}</td>
                    <td><span class="badge bg-${getActivityColor(activity.type)}">${activity.type}</span></td>
                    <td>${activity.title}</td>
                    <td>${activity.description}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </body>
    </html>
  `);
}

function clearActivity() {
  if (confirm('Are you sure you want to clear all activity logs?')) {
    activityData = [];
    renderActivityFeed();
    addActivity('info', 'Activity Cleared', 'All activity logs have been cleared', 'bi-trash3');
  }
}

// Tags management
function loadRegisteredTags() {
  const tagsTable = document.getElementById('tagsTable');
  if (!tagsTable) {
    console.log('Tabela de tags não encontrada');
    return;
  }

  // Garantir que todos os professores estejam nas tags registradas
  Object.values(teachers).forEach(teacher => {
    const tagExists = registeredTags.some(tag => tag.id === teacher.rfid);
    if (!tagExists) {
      registeredTags.push({
        id: teacher.rfid,
        name: teacher.name,
        lastUsed: new Date().toLocaleString(),
        status: 'Active',
        type: 'teacher'
      });
    }
  });

  // Ordenar tags: professores primeiro, depois alunos
  registeredTags.sort((a, b) => {
    if (a.type === 'teacher' && b.type !== 'teacher') return -1;
    if (a.type !== 'teacher' && b.type === 'teacher') return 1;
    return a.name.localeCompare(b.name);
  });
  
  tagsTable.innerHTML = registeredTags.map(tag => `
    <tr>
      <td><code>${tag.id}</code></td>
      <td>${tag.name}</td>
      <td>${tag.lastUsed}</td>
      <td>
        <span class="badge ${tag.status === 'Active' ? 'bg-success' : 'bg-secondary'}">
          ${tag.status}
        </span>
      </td>
      <td>
        <span class="badge ${tag.type === 'teacher' ? 'bg-primary' : 'bg-info'}">
          ${tag.type === 'teacher' ? 'Professor' : 'Aluno'}
        </span>
      </td>
      <td>
        <div class="btn-group btn-group-sm">
          ${tag.type === 'teacher' ? `
            <button class="btn btn-outline-primary" onclick="editTeacher('${tag.id}')">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-outline-danger" onclick="deleteTeacher('${tag.id}')">
              <i class="bi bi-trash"></i>
            </button>
          ` : `
            <button class="btn btn-outline-primary" onclick="editTag('${tag.id}')">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-outline-danger" onclick="deleteTag('${tag.id}')">
              <i class="bi bi-trash"></i>
            </button>
          `}
        </div>
      </td>
    </tr>
  `).join('');

  console.log('Tags carregadas:', {
    total: registeredTags.length,
    professores: registeredTags.filter(tag => tag.type === 'teacher').length,
    alunos: registeredTags.filter(tag => tag.type !== 'teacher').length
  });
}

function editTag(tagId) {
  const tag = registeredTags.find(t => t.id === tagId);
  if (tag) {
    const newName = prompt('Enter new name:', tag.name);
    if (newName && newName.trim()) {
      tag.name = newName.trim();
      loadRegisteredTags();
      addActivity('info', 'Tag Updated', `RFID tag ${tagId} updated`, 'bi-pencil-fill');
    }
  }
}

function deleteTag(tagId) {
  if (confirm(`Are you sure you want to delete tag ${tagId}?`)) {
    registeredTags = registeredTags.filter(tag => tag.id !== tagId);
    loadRegisteredTags();
    updateActiveTags();
    addActivity('warning', 'Tag Deleted', `RFID tag ${tagId} has been removed`, 'bi-trash-fill');
  }
}

// Statistics and updates
function updateStats() {
  // Update connection status
  const connectionStatus = document.getElementById('connectionStatus');
  if (connectionStatus) {
    connectionStatus.textContent = 'Online';
    connectionStatus.className = 'status-online';
  }
  
  // Update room status
  const roomStatus = document.getElementById('roomStatus');
  if (roomStatus) {
    roomStatus.textContent = isLocked ? 'Trancado' : 'Desbloqueado';
    roomStatus.className = isLocked ? 'status-locked' : 'status-unlocked';
  }
  
  // Update last access time
  const lastAccess = document.getElementById('lastAccess');
  if (lastAccess) {
    lastAccess.textContent = 'Último acesso: ' + formatRelativeTime(new Date());
  }

  // Update today access count
  const todayAccessElement = document.getElementById('todayAccess');
  if (todayAccessElement) {
    todayAccessElement.textContent = todayAccessCount;
  }
}

function updateActiveTags() {
  const activeTags = document.getElementById('activeTags');
  const activeCount = registeredTags.filter(tag => tag.status === 'Active').length;
  activeTags.textContent = activeCount;
}

function updateTimestamps() {
  renderActivityFeed();
  document.getElementById('lastAccess').textContent = `Last access: ${formatRelativeTime(new Date(Date.now() - 2 * 60 * 1000))}`;
}

// Real-time simulation
function startRealTimeSimulation() {
  // Remover a simulação automática de eventos
  // As atividades agora serão registradas apenas quando houver interações reais
  
  // Atualizar status da conexão a cada 30 segundos
  setInterval(() => {
    const connectionStatus = document.getElementById('connectionStatus');
    if (Math.random() < 0.95) {
      connectionStatus.textContent = 'Online';
      connectionStatus.className = 'card-text status-online';
    } else {
      connectionStatus.textContent = 'Reconectando...';
      connectionStatus.className = 'card-text status-offline';
      
      setTimeout(() => {
        connectionStatus.textContent = 'Online';
        connectionStatus.className = 'card-text status-online';
      }, 3000);
    }
  }, 30000);
}

// Função para registrar acesso
function registerAccess(success, message) {
  const lab = laboratories[currentLaboratory];
  
  if (success) {
    if (!lab.teacher) {
      addActivity('danger', 'Acesso Negado', 'Nenhum professor responsável definido', 'bi-x-circle-fill');
      return;
    }

    addActivity('success', 'Acesso Autorizado', 
      `RFID autorizado - ${lab.teacher.name} (${lab.teacher.rfid})`, 
      'bi-check-circle-fill');
    
    addActivity('success', 'Laboratório Desbloqueado', 
      `Porta aberta com sucesso - Laboratório ${currentLaboratory}`, 
      'bi-door-open-fill');
  } else {
    addActivity('danger', 'Acesso Negado', message, 'bi-x-circle-fill');
  }
}

// Função para registrar tentativa de acesso
function registerAccessAttempt(rfid) {
  addActivity('info', 'Tag Detectada', 
    `RFID detectado: ${rfid}`, 
    'bi-credit-card-fill');
}

// Initialize with some sample activity
function loadActivityFeed() {
  const sampleActivities = [
    { type: 'info', title: 'Sistema Iniciado', desc: 'Painel de controle inicializado', icon: 'bi-power' },
    { type: 'info', title: 'Laboratório Selecionado', desc: 'Laboratório 1 selecionado', icon: 'bi-building' },
    { type: 'warning', title: 'Professor Não Definido', desc: 'Nenhum professor responsável definido', icon: 'bi-person-x-fill' }
  ];
  
  sampleActivities.forEach((activity, index) => {
    setTimeout(() => {
      addActivity(activity.type, activity.title, activity.desc, activity.icon);
    }, index * 500);
  });
}

// Clock functions
function updateClock() {
  const now = new Date();
  const timeElement = document.getElementById('currentTime');
  const dateElement = document.getElementById('currentDate');
  
  if (timeElement && dateElement) {
    timeElement.textContent = now.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    dateElement.textContent = now.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

// Initialize activity page
function initActivityPage() {
  // No need to call loadData() here, it's called in DOMContentLoaded
  
  // Verificar se há necessidade de atualização forçada
  const forceUpdate = localStorage.getItem('forceUpdateSchedule');
  if (forceUpdate === 'true') {
    updateSchedule();
    localStorage.removeItem('forceUpdateSchedule');
  }
  
  // Atualizar status inicial
  updateScheduleStatus();
  
  // Atualizar a cada minuto
  setInterval(updateScheduleStatus, 60000);
  
  // Iniciar relógio
  updateClock();
  setInterval(updateClock, 1000);

  // Carregar e popular a tabela de tags e o select de professores na página de atividade
  loadRegisteredTags();
  populateTeacherSelect();
}

// Função para converter horário em minutos
function timeToMinutes(timeStr) {
  const [time] = timeStr.split(' - ');
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

// Função para verificar se uma aula está em andamento
function isClassInProgress(startTime, endTime, currentTime) {
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  return currentTime >= startMinutes && currentTime <= endMinutes;
}

// Função para verificar se uma aula já foi concluída
function isClassCompleted(endTime, currentTime) {
  const endMinutes = timeToMinutes(endTime);
  return currentTime > endMinutes;
}

// Função para verificar se um dia já passou
function isDayPassed(day) {
  const days = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
  const today = new Date();
  const currentDay = days[today.getDay()];
  
  const dayIndex = days.indexOf(day);
  const currentDayIndex = days.indexOf(currentDay);
  
  return dayIndex < currentDayIndex;
}

// Função para verificar se é o dia atual
function isCurrentDay(day) {
  const days = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
  const today = new Date();
  const currentDay = days[today.getDay()];
  
  return day === currentDay;
}

// Função para verificar se um turno já passou
function isShiftPassed(shift) {
  const now = new Date();
  const currentHour = now.getHours();
  
  if (shift === 'manha' && currentHour >= 12) return true;
  if (shift === 'tarde' && currentHour >= 18) return true;
  if (shift === 'noite' && currentHour >= 22) return true;
  
  return false;
}

// Função para obter o turno atual
function getCurrentShift() {
  const currentHour = new Date().getHours();
  
  if (currentHour >= 8 && currentHour < 12) return 'manha';
  if (currentHour >= 13 && currentHour < 18) return 'tarde';
  if (currentHour >= 18 && currentHour < 22) return 'noite';
  
  return 'manha';
}

// Função para atualizar o status das aulas
function updateScheduleStatus() {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTime = currentHour * 60 + currentMinutes;
  
  // Obter dia e turno atual
  const days = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
  const currentDay = days[now.getDay()];
  const currentShift = getCurrentShift();
  
  // Atualizar display do cronograma
  const daySelect = document.getElementById('scheduleDay');
  const shiftSelect = document.getElementById('scheduleShift');
  
  if (daySelect && shiftSelect) {
    daySelect.value = currentDay;
    shiftSelect.value = currentShift;
  }
  
  // Atualizar status das aulas para todos os dias e turnos
  Object.keys(scheduleData).forEach(day => {
    Object.keys(scheduleData[day]).forEach(shift => {
      const classes = scheduleData[day][shift];
      if (classes) {
        classes.forEach(lesson => {
          // Se o dia já passou, todas as aulas são concluídas
          if (isDayPassed(day)) {
            lesson.status = 'Concluído';
          }
          // Se é o dia atual
          else if (isCurrentDay(day)) {
            // Se o turno já passou, todas as aulas são concluídas
            if (isShiftPassed(shift)) {
              lesson.status = 'Concluído';
            }
            // Se é o turno atual
            else if (shift === currentShift) {
              const [startTime, endTime] = lesson.time.split(' - ');
              if (isClassInProgress(startTime, endTime, currentTime)) {
                lesson.status = 'Em andamento';
              } else if (isClassCompleted(endTime, currentTime)) {
                lesson.status = 'Concluído';
              } else {
                lesson.status = 'Aguardando';
              }
            }
            // Se é um turno futuro do dia atual
            else {
              lesson.status = 'Aguardando';
            }
          }
          // Se é um dia futuro
          else {
            lesson.status = 'Aguardando';
          }
        });
      }
    });
  });
  
  // Atualizar professores baseado no cronograma atual
  if (currentDay !== 'domingo' && currentDay !== 'sabado') {
    const currentClasses = scheduleData[currentDay][currentShift];
    if (currentClasses) {
      currentClasses.forEach(lesson => {
        const labNumber = lesson.lab;
        // Buscar o professor pelo nome no objeto teachers
        const teacherEntry = Object.values(teachers).find(t => t.name === lesson.teacher);
        if (teacherEntry) {
          laboratories[labNumber] = {
            ...laboratories[labNumber],
            teacher: teacherEntry
          };
        } else {
          // Se o professor não for encontrado (foi removido), defina como null
          laboratories[labNumber] = {
            ...laboratories[labNumber],
            teacher: null
          };
        }
      });
    }
  }
  
  updateSchedule();
  syncData();
}

// Função para atualizar o cronograma
function updateSchedule() {
  const day = document.getElementById('scheduleDay')?.value;
  const shift = document.getElementById('scheduleShift')?.value;
  const scheduleTable = document.getElementById('scheduleTable');
  
  if (!day || !shift || !scheduleTable) return;
  
  const classes = scheduleData[day][shift];
  
  if (!classes || classes.length === 0) {
    scheduleTable.innerHTML = `
      <tr>
        <td colspan="6" class="text-center text-muted py-4">
          <i class="bi bi-calendar-x" style="font-size: 2rem;"></i>
          <p class="mt-2">Nenhuma aula agendada para este período</p>
        </td>
      </tr>
    `;
    return;
  }
  
  // Ordenar aulas por horário
  classes.sort((a, b) => {
    const aStart = timeToMinutes(a.time);
    const bStart = timeToMinutes(b.time);
    return aStart - bStart;
  });
  
  scheduleTable.innerHTML = classes.map(lesson => {
    // Buscar o professor pelo nome no objeto teachers
    const teacher = Object.values(teachers).find(t => t.name === lesson.teacher);
    const teacherRFID = teacher ? teacher.rfid : 'N/A'; // Se o professor foi removido, exibe N/A
    const statusClass = getStatusBadgeClass(lesson.status);
    const isInProgress = lesson.status === 'Em andamento';
    
    return `
      <tr class="${isInProgress ? 'table-success' : ''}">
        <td>${lesson.time}</td>
        <td>
          <span class="badge bg-primary">Laboratório ${lesson.lab}</span>
        </td>
        <td>${lesson.subject}</td>
        <td>${lesson.teacher || 'Professor Removido'}</td>
        <td><code>${teacherRFID}</code></td>
        <td>
          <span class="badge ${statusClass}">
            ${lesson.status}
          </span>
        </td>
      </tr>
    `;
  }).join('');
}

// Função para obter a classe do badge de status
function getStatusBadgeClass(status) {
  switch(status) {
    case 'Em andamento':
      return 'bg-success';
    case 'Aguardando':
      return 'bg-warning';
    case 'Concluído':
      return 'bg-secondary';
    default:
      return 'bg-primary';
  }
}

// Função para sincronizar os dados entre as páginas
function syncData() {
  try {
    localStorage.setItem('teachers', JSON.stringify(teachers));
    localStorage.setItem('registeredTags', JSON.stringify(registeredTags));
    localStorage.setItem('laboratories', JSON.stringify(laboratories));
    localStorage.setItem('activityData', JSON.stringify(activityData));
    localStorage.setItem('scheduleData', JSON.stringify(scheduleData));
    localStorage.setItem('todayAccessCount', todayAccessCount.toString());
    
    console.log('Dados sincronizados com localStorage:', {
      professores: Object.keys(teachers).length,
      tags: registeredTags.length,
      laboratorios: Object.keys(laboratories).length,
      atividades: activityData.length,
      cronograma: Object.keys(scheduleData).length,
      acessosHoje: todayAccessCount
    });
  } catch (error) {
    console.error('Erro ao sincronizar dados com localStorage:', error);
  }
}

// Função para carregar dados do localStorage
function loadDataFromStorage() {
  try {
    const savedTeachers = localStorage.getItem('teachers');
    teachers = savedTeachers ? JSON.parse(savedTeachers) : JSON.parse(JSON.stringify(defaultTeachers));

    const savedTags = localStorage.getItem('registeredTags');
    registeredTags = savedTags ? JSON.parse(savedTags) : JSON.parse(JSON.stringify(defaultRegisteredTags));
    // Assegurar que as datas em registeredTags sejam objetos Date após carregar do JSON
    registeredTags.forEach(tag => {
      if (tag.lastUsed && typeof tag.lastUsed === 'string') {
        tag.lastUsed = new Date(tag.lastUsed).toLocaleString();
      }
    });

    const savedLaboratories = localStorage.getItem('laboratories');
    if (savedLaboratories) {
      laboratories = JSON.parse(savedLaboratories);
      // Precisamos garantir que a referência do professor em laboratories aponte para o objeto em teachers
      Object.values(laboratories).forEach(lab => {
        if (lab.teacher && lab.teacher.rfid && teachers[lab.teacher.rfid]) {
          lab.teacher = teachers[lab.teacher.rfid]; // Atualiza para a referência correta
        } else if (lab.teacher) { // Se o professor no laboratório não existe mais em teachers
          lab.teacher = null;
          lab.assignedClass = null;
        }
      });
    } else {
      // Inicializa laboratories se não existir no localStorage
      laboratories = {
        1: { teacher: null, isLocked: false, assignedClass: null },
        2: { teacher: null, isLocked: false, assignedClass: null },
        3: { teacher: null, isLocked: false, assignedClass: null },
        4: { teacher: null, isLocked: false, assignedClass: null },
        5: { teacher: null, isLocked: false, assignedClass: null },
        6: { teacher: null, isLocked: false, assignedClass: null },
        7: { teacher: null, isLocked: false, assignedClass: null },
        8: { teacher: null, isLocked: false, assignedClass: null },
        9: { teacher: null, isLocked: false, assignedClass: null },
        10: { teacher: null, isLocked: false, assignedClass: null }
      };
    }

    const savedActivity = localStorage.getItem('activityData');
    activityData = savedActivity ? JSON.parse(savedActivity) : [];
    // Assegurar que timestamps em activityData sejam objetos Date
     activityData.forEach(activity => {
      if (activity.timestamp && typeof activity.timestamp === 'string') {
        activity.timestamp = new Date(activity.timestamp);
      }
    });

    const savedSchedule = localStorage.getItem('scheduleData');
    scheduleData = savedSchedule ? JSON.parse(savedSchedule) : JSON.parse(JSON.stringify(initialScheduleData));

    const savedTodayAccessCount = localStorage.getItem('todayAccessCount');
    todayAccessCount = savedTodayAccessCount ? parseInt(savedTodayAccessCount) : 0;

    console.log('Dados carregados do localStorage com sucesso.');

    // É importante chamar loadRegisteredTags e populateTeacherSelect APÓS carregar teachers
    if (!window.location.pathname.includes('activity.html')) { // Evitar chamar em activity.html se não necessário
        loadRegisteredTags();
        populateTeacherSelect();
        updateTeacherInfo(); // Garante que o professor do laboratório atual seja exibido corretamente
    }

  } catch (error) {
    console.error('Erro ao carregar dados do localStorage:', error);
    // Se houver erro, reinicializa com os dados padrão para evitar que a aplicação quebre
    initializeDefaultDataIfEmpty();
  }
}

// Função para inicializar dados padrão se o localStorage estiver vazio
function initializeDefaultDataIfEmpty() {
  // Inicializar com os professores padrão
  teachers = JSON.parse(JSON.stringify(defaultTeachers));
  registeredTags = JSON.parse(JSON.stringify(defaultRegisteredTags));
  
  // Salvar no localStorage
  localStorage.setItem('teachers', JSON.stringify(teachers));
  localStorage.setItem('registeredTags', JSON.stringify(registeredTags));
  
  // Inicializar outros dados se necessário
  if (!localStorage.getItem('scheduleData')) {
    scheduleData = JSON.parse(JSON.stringify(initialScheduleData));
    localStorage.setItem('scheduleData', JSON.stringify(scheduleData));
  }
  
  if (!localStorage.getItem('laboratories')) {
    laboratories = {
      1: { teacher: null, isLocked: false, assignedClass: null },
      2: { teacher: null, isLocked: false, assignedClass: null },
      3: { teacher: null, isLocked: false, assignedClass: null },
      4: { teacher: null, isLocked: false, assignedClass: null },
      5: { teacher: null, isLocked: false, assignedClass: null },
      6: { teacher: null, isLocked: false, assignedClass: null },
      7: { teacher: null, isLocked: false, assignedClass: null },
      8: { teacher: null, isLocked: false, assignedClass: null },
      9: { teacher: null, isLocked: false, assignedClass: null },
      10: { teacher: null, isLocked: false, assignedClass: null }
    };
    localStorage.setItem('laboratories', JSON.stringify(laboratories));
  }
}

// Função para popular o select de professores no modal
function populateTeacherSelect() {
  const teacherSelect = document.getElementById('teacherSelect');
  if (!teacherSelect) {
    console.log('Select de professores não encontrado');
    return;
  }

  // Limpar opções existentes
  teacherSelect.innerHTML = '<option value="">Selecione um professor...</option>';

  // Adicionar professores ao select
  Object.values(teachers).forEach(teacher => {
    const option = document.createElement('option');
    option.value = teacher.rfid;
    option.textContent = `${teacher.name} (${teacher.rfid})`;
    teacherSelect.appendChild(option);
  });

  // Se houver um professor selecionado no laboratório atual, selecioná-lo
  const currentLab = laboratories[currentLaboratory];
  if (currentLab && currentLab.teacher) {
    teacherSelect.value = currentLab.teacher.rfid;
    // Atualizar as opções de matérias
    updateSubjectOptions();
  }

  console.log('Select de professores atualizado:', Object.keys(teachers).length, 'professores');
}

// Função para atualizar o professor no laboratório baseado no cronograma
function updateTeacherFromSchedule() {
  const now = new Date();
  const days = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
  const currentDay = days[now.getDay()];
  
  let currentShift;
  const currentHour = now.getHours();
  if (currentHour >= 8 && currentHour < 12) {
    currentShift = 'manha';
  } else if (currentHour >= 13 && currentHour < 18) {
    currentShift = 'tarde';
  } else if (currentHour >= 18 && currentHour < 22) {
    currentShift = 'noite';
  } else {
    currentShift = 'manha';
  }
  
  // Atualizar professores baseado no cronograma atual
  if (currentDay !== 'domingo' && currentDay !== 'sabado') {
    const currentClasses = scheduleData[currentDay][currentShift];
    if (currentClasses) {
      currentClasses.forEach(lesson => {
        const labNumber = lesson.lab;
        // Buscar o professor pelo nome no objeto teachers
        const teacherEntry = Object.values(teachers).find(t => t.name === lesson.teacher);
        if (teacherEntry) {
          laboratories[labNumber] = {
            ...laboratories[labNumber],
            teacher: teacherEntry
          };
        } else {
          // Se o professor não for encontrado (foi removido), defina como null
          laboratories[labNumber] = {
            ...laboratories[labNumber],
            teacher: null
          };
        }
      });
    }
  }
  
  syncData();
}

// Função para editar um professor
function editTeacher(rfid) {
  const teacher = teachers[rfid];
  if (!teacher) return;

  // Criar modal de edição
  const modalHtml = `
    <div class="modal fade" id="editTeacherModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Editar Professor</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form id="editTeacherForm">
              <div class="mb-3">
                <label class="form-label">Nome</label>
                <input type="text" class="form-control" id="editTeacherName" value="${teacher.name}" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Coordenador</label>
                <input type="text" class="form-control" id="editTeacherCoordinator" value="${teacher.coordinator}" required>
              </div>
              <div class="mb-3">
                <label class="form-label">RFID</label>
                <input type="text" class="form-control" id="editTeacherRFID" value="${teacher.rfid}" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Matérias</label>
                <div id="editSubjectsContainer">
                  ${teacher.subjects.map((subject, index) => `
                    <div class="mb-3 subject-input-group">
                      <div class="input-group">
                        <input type="text" class="form-control subject-input" value="${subject}" required>
                        ${index > 0 ? `
                          <button type="button" class="btn btn-outline-danger remove-subject">
                            <i class="bi bi-trash"></i>
                          </button>
                        ` : ''}
                      </div>
                    </div>
                  `).join('')}
                </div>
                <button type="button" class="btn btn-outline-primary mt-2" id="addEditSubjectBtn">
                  <i class="bi bi-plus-circle"></i> Adicionar Outra Matéria
                </button>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-primary" onclick="confirmEditTeacher('${rfid}')">Salvar Alterações</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Adicionar modal ao DOM
  const modalContainer = document.createElement('div');
  modalContainer.innerHTML = modalHtml;
  document.body.appendChild(modalContainer);

  // Inicializar modal
  const modal = new bootstrap.Modal(document.getElementById('editTeacherModal'));
  modal.show();

  // Adicionar event listeners
  document.getElementById('addEditSubjectBtn').addEventListener('click', () => {
    const container = document.getElementById('editSubjectsContainer');
    const newGroup = document.createElement('div');
    newGroup.className = 'mb-3 subject-input-group';
    newGroup.innerHTML = `
      <div class="input-group">
        <input type="text" class="form-control subject-input" placeholder="Qual matéria você leciona?" required>
        <button type="button" class="btn btn-outline-danger remove-subject">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    `;
    container.appendChild(newGroup);
  });

  // Event listener para remover matérias
  document.getElementById('editSubjectsContainer').addEventListener('click', (e) => {
    if (e.target.closest('.remove-subject')) {
      const group = e.target.closest('.subject-input-group');
      if (group) {
        group.remove();
      }
    }
  });

  // Limpar modal quando fechado
  document.getElementById('editTeacherModal').addEventListener('hidden.bs.modal', function () {
    this.remove();
  });
}

// Função para confirmar a edição do professor
function confirmEditTeacher(oldRfid) {
  const name = document.getElementById('editTeacherName').value.trim();
  const coordinator = document.getElementById('editTeacherCoordinator').value.trim();
  const newRfid = document.getElementById('editTeacherRFID').value.trim().toUpperCase();
  const subjectInputs = document.querySelectorAll('#editSubjectsContainer .subject-input');
  const subjects = Array.from(subjectInputs)
    .map(input => input.value.trim())
    .filter(subject => subject !== '');

  if (!name || !coordinator || !newRfid || subjects.length === 0) {
    alert('Por favor, preencha todos os campos.');
    return;
  }

  if (newRfid !== oldRfid && teachers[newRfid]) {
    alert(`O ID RFID "${newRfid}" já está registrado para outro professor.`);
    return;
  }

  const oldTeacherData = teachers[oldRfid]; // Guardar dados antigos para atualização do schedule

  // Remover o professor antigo se o RFID mudou
  if (oldRfid !== newRfid) {
    delete teachers[oldRfid];
  }

  // Atualizar ou adicionar o professor com o novo RFID
  teachers[newRfid] = {
    name: name,
    rfid: newRfid,
    coordinator: coordinator,
    subjects: subjects
  };

  // Atualizar tag RFID
  const tagIndex = registeredTags.findIndex(tag => tag.id === oldRfid);
  if (tagIndex !== -1) {
    registeredTags[tagIndex] = {
      ...registeredTags[tagIndex], // Manter outros dados da tag se houver
      id: newRfid,
      name: name,
      lastUsed: new Date().toLocaleString(), // Atualizar lastUsed
      status: 'Active', // Garantir que o status esteja ativo
      type: 'teacher'
    };
  } else {
    // Se a tag antiga não existia (caso raro), adiciona uma nova
     registeredTags.unshift({
        id: newRfid,
        name: name,
        lastUsed: new Date().toLocaleString(),
        status: 'Active',
        type: 'teacher'
      });
  }

  // Atualizar referências em laboratórios
  Object.keys(laboratories).forEach(labId => {
    const lab = laboratories[labId];
    if (lab.teacher && lab.teacher.rfid === oldRfid) {
      lab.teacher = teachers[newRfid]; // Atualiza para o novo objeto professor
      if (lab.assignedClass && lab.assignedClass.teacherName === oldTeacherData.name) {
        lab.assignedClass.teacherName = name; // Atualiza o nome do professor na aula atribuída
      }
    }
  });

  // Atualizar referências no cronograma (scheduleData)
  Object.keys(scheduleData).forEach(day => {
    Object.keys(scheduleData[day]).forEach(shift => {
      scheduleData[day][shift].forEach(lesson => {
        if (lesson.teacher === oldTeacherData.name) { // Comparar pelo nome antigo
          lesson.teacher = name; // Atualizar para o novo nome
        }
      });
    });
  });

  // Atualizar interface
  populateTeacherSelect();
  loadRegisteredTags();
  updateTeacherInfo();

  addActivity(
    'info',
    'Professor Atualizado',
    `Professor ${name} (${newRfid}) atualizado com sucesso`,
    'bi-pencil-fill'
  );

  syncData();

  const modal = bootstrap.Modal.getInstance(document.getElementById('editTeacherModal'));
  if (modal) {
    modal.hide();
  }

  // Forçar atualização do cronograma na página de atividade, se ela existir
  if (window.location.pathname.includes('activity.html')) {
    updateSchedule();
  } else {
    localStorage.setItem('forceUpdateSchedule', 'true');
  }
}

// Função para excluir um professor
function deleteTeacher(rfid) {
  const teacher = teachers[rfid];
  if (!teacher) {
    console.warn(`Tentativa de excluir professor com RFID ${rfid} não encontrado.`);
    return;
  }

  if (!confirm(`Tem certeza que deseja excluir o professor ${teacher.name} (${rfid})? Esta ação removerá todas as suas informações e aulas agendadas.`)) {
    return;
  }

  const teacherName = teacher.name; // Guardar o nome para usar na remoção do schedule

  // 1. Remover professor do objeto `teachers`
  delete teachers[rfid];

  // 2. Remover tag RFID da lista `registeredTags`
  registeredTags = registeredTags.filter(tag => tag.id !== rfid);

  // 3. Remover professor dos laboratórios e suas aulas atribuídas
  Object.keys(laboratories).forEach(labId => {
    const lab = laboratories[labId];
    if (lab.teacher && lab.teacher.rfid === rfid) {
      lab.teacher = null;
      lab.assignedClass = null;
    }
  });

  // 4. Remover todas as aulas do professor no `scheduleData`
  Object.keys(scheduleData).forEach(day => {
    Object.keys(scheduleData[day]).forEach(shift => {
      scheduleData[day][shift] = scheduleData[day][shift].filter(
        lesson => lesson.teacher !== teacherName // Filtra pelo nome do professor
      );
    });
  });

  // Atualizar interface
  populateTeacherSelect();
  loadRegisteredTags();
  updateTeacherInfo();

  addActivity(
    'danger',
    'Professor Excluído',
    `Professor ${teacherName} (${rfid}) foi excluído do sistema. Todas as suas aulas foram removidas.`,
    'bi-trash-fill'
  );

  // 5. Salvar todas as alterações no localStorage
  syncData();

  // Forçar atualização do cronograma na página de atividade
  if (window.location.pathname.includes('activity.html')) {
    updateSchedule();
  } else {
    localStorage.setItem('forceUpdateSchedule', 'true');
  }

  // Se o professor excluído era o professor atual do laboratório selecionado, limpar os campos
  const currentLab = laboratories[currentLaboratory];
  if (!currentLab || !currentLab.teacher || currentLab.teacher.rfid === rfid) {
     const currentTeacherEl = document.getElementById('currentTeacher');
     const currentRFIDEl = document.getElementById('currentRFID');
     if(currentTeacherEl) currentTeacherEl.textContent = 'Não definido';
     if(currentRFIDEl) currentRFIDEl.textContent = '-';
  }
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    addActivity,
    toggleLock,
    formatRelativeTime
  };
}
