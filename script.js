// Smart Lock IoT Dashboard JavaScript

// Global variables
let isLocked = false;
let activityData = [];
let currentLaboratory = 1;

// Professores e seus IDs RFID
const teachers = {
  'ICARO001': {
    name: 'Icaro Alvim',
    rfid: 'ICARO001',
    subjects: ['Internet das Coisas', 'Programação de Apps', 'Análise de Dados']
  },
  'MOISES001': {
    name: 'Moises Lima',
    rfid: 'MOISES001',
    subjects: ['Banco de Dados', 'Desenvolvimento de Sistemas', 'Lógica de Programação']
  }
};

// Tags registradas (incluindo professores)
let registeredTags = [
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

// Estado dos laboratórios
let laboratories = {
  1: { teacher: null, isLocked: false },
  2: { teacher: null, isLocked: false },
  3: { teacher: null, isLocked: false },
  4: { teacher: null, isLocked: false },
  5: { teacher: null, isLocked: false },
  6: { teacher: null, isLocked: false },
  7: { teacher: null, isLocked: false },
  8: { teacher: null, isLocked: false },
  9: { teacher: null, isLocked: false },
  10: { teacher: null, isLocked: false }
};

// Schedule management
const scheduleData = {
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
      { time: '15:30 - 17:10', lab: 1, subject: 'Internet das Coisas', teacher: 'Icaro Alvim', status: 'Aguardando' },
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

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
  loadData();
  
  const isActivityPage = window.location.pathname.includes('activity.html');
  
  if (isActivityPage) {
    initActivityPage();
  } else {
    // Initialize dashboard
    console.log('Smart Lock Dashboard initialized');
    loadActivityFeed();
    updateStats();
  startRealTimeSimulation();
    setInterval(updateTimestamps, 60000);
  
    // Atualizar informações do professor inicial
    updateTeacherInfo();
  }
});

// Activity feed functions
function addActivity(type, title, description, icon = 'bi-info-circle-fill') {
  const timestamp = new Date();
  const activity = {
    id: Date.now(),
    type: type,
    title: title,
    description: description,
    icon: icon,
    timestamp: timestamp
  };
  
  activityData.unshift(activity);
  
  // Keep only last 50 activities
  if (activityData.length > 50) {
    activityData = activityData.slice(0, 50);
  }
  
  renderActivityFeed();
  updateStats();
  
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

  // Atualizar o horário no scheduleData
  const schedule = scheduleData[teacherDay][teacherShift];
  const classIndex = schedule.findIndex(c => c.lab === currentLaboratory);
  
  if (classIndex !== -1) {
    schedule[classIndex].teacher = teacher.name;
    schedule[classIndex].subject = subject;
  } else {
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

// Room control functions
function toggleLock() {
  const lockBtn = document.getElementById('lockBtn');
  const roomStatus = document.getElementById('roomStatus');
  const lastAccess = document.getElementById('lastAccess');
  
  isLocked = !isLocked;
  laboratories[currentLaboratory].isLocked = isLocked;
  
  if (isLocked) {
    lockBtn.innerHTML = '<i class="bi bi-lock-fill me-2"></i>Destrancar Laboratório';
    lockBtn.className = 'btn btn-danger';
    roomStatus.textContent = 'Trancado';
    roomStatus.className = 'card-text status-locked';
    
    addActivity('danger', 'Laboratório Trancado', 
      `Laboratório ${currentLaboratory} foi trancado manualmente`, 
      'bi-lock-fill');
  } else {
    lockBtn.innerHTML = '<i class="bi bi-unlock-fill me-2"></i>Trancar Laboratório';
    lockBtn.className = 'btn btn-success';
    roomStatus.textContent = 'Desbloqueado';
    roomStatus.className = 'card-text status-unlocked';
    
    addActivity('success', 'Laboratório Destrancado', 
      `Laboratório ${currentLaboratory} foi destrancado manualmente`, 
      'bi-unlock-fill');
  }
  
  lastAccess.textContent = 'Último acesso: Agora mesmo';
  syncData();
}

function registerTag() {
  const tagId = 'RFID' + String(Math.floor(Math.random() * 1000)).padStart(3, '0');
  const userName = prompt('Enter user name for new RFID tag:');
  
  if (userName && userName.trim()) {
    const newTag = {
      id: tagId,
      name: userName.trim(),
      lastUsed: new Date().toLocaleString(),
      status: 'Active'
    };
    
    registeredTags.unshift(newTag);
    loadRegisteredTags();
    updateActiveTags();
    
    addActivity('info', 'New Tag Registered', `RFID tag ${tagId} registered for ${userName}`, 'bi-plus-circle-fill');
    
    alert(`RFID tag ${tagId} has been registered for ${userName}`);
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
  if (!tagsTable) return;
  
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
          <button class="btn btn-outline-primary" onclick="editTag('${tag.id}')">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-outline-danger" onclick="deleteTag('${tag.id}')">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
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
  connectionStatus.textContent = 'Online';
  connectionStatus.className = 'status-online';
  
  // Update room status
  const roomStatus = document.getElementById('roomStatus');
  roomStatus.textContent = isLocked ? 'Trancado' : 'Desbloqueado';
  roomStatus.className = isLocked ? 'status-locked' : 'status-unlocked';
  
  // Update last access time
  const lastAccess = document.getElementById('lastAccess');
  lastAccess.textContent = 'Último acesso: ' + formatRelativeTime(new Date());
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
  loadData();
  
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
        const teacherRFID = lesson.teacher === 'Icaro Alvim' ? 'ICARO001' : 'MOISES001';
        laboratories[labNumber] = {
          ...laboratories[labNumber],
          teacher: teachers[teacherRFID]
        };
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
    const teacher = teachers[lesson.teacher === 'Icaro Alvim' ? 'ICARO001' : 'MOISES001'];
    const statusClass = getStatusBadgeClass(lesson.status);
    const isInProgress = lesson.status === 'Em andamento';
    
    return `
      <tr class="${isInProgress ? 'table-success' : ''}">
        <td>${lesson.time}</td>
        <td>
          <span class="badge bg-primary">Laboratório ${lesson.lab}</span>
        </td>
        <td>${lesson.subject}</td>
        <td>${lesson.teacher}</td>
        <td><code>${teacher.rfid}</code></td>
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
  // Salvar dados no localStorage
  localStorage.setItem('laboratories', JSON.stringify(laboratories));
  localStorage.setItem('registeredTags', JSON.stringify(registeredTags));
  localStorage.setItem('activityData', JSON.stringify(activityData));
}

// Função para carregar dados do localStorage
function loadData() {
  const savedLaboratories = localStorage.getItem('laboratories');
  const savedTags = localStorage.getItem('registeredTags');
  const savedActivity = localStorage.getItem('activityData');
  
  if (savedLaboratories) {
    laboratories = JSON.parse(savedLaboratories);
  }
  
  if (savedTags) {
    registeredTags = JSON.parse(savedTags);
  }
  
  if (savedActivity) {
    activityData = JSON.parse(savedActivity);
  }
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
        const teacherRFID = lesson.teacher === 'Icaro Alvim' ? 'ICARO001' : 'MOISES001';
        laboratories[labNumber] = {
          ...laboratories[labNumber],
          teacher: teachers[teacherRFID]
        };
      });
    }
  }
  
  syncData();
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    addActivity,
    toggleLock,
    formatRelativeTime
  };
}
