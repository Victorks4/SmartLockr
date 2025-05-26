// Smart Lock IoT Dashboard JavaScript

// Global variables
let isLocked = false;
let activityData = [];
let registeredTags = [
  { id: 'RFID001', name: 'John Doe', lastUsed: '2024-05-26 09:30', status: 'Active' },
  { id: 'RFID002', name: 'Jane Smith', lastUsed: '2024-05-26 08:15', status: 'Active' },
  { id: 'RFID003', name: 'Bob Wilson', lastUsed: '2024-05-25 17:45', status: 'Active' },
  { id: 'RFID004', name: 'Alice Brown', lastUsed: '2024-05-25 14:20', status: 'Inactive' },
  { id: 'RFID005', name: 'Charlie Davis', lastUsed: '2024-05-26 11:10', status: 'Active' },
  { id: 'RFID006', name: 'Diana Green', lastUsed: '2024-05-24 16:30', status: 'Active' },
  { id: 'RFID007', name: 'Frank Miller', lastUsed: '2024-05-26 07:45', status: 'Active' }
];

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
  console.log('Smart Lock Dashboard initialized');
  
  // Load initial data
  loadActivityFeed();
  loadRegisteredTags();
  updateStats();
  
  // Start real-time simulation
  startRealTimeSimulation();
  
  // Update timestamps every minute
  setInterval(updateTimestamps, 60000);
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

// Room control functions
function toggleLock() {
  const lockBtn = document.getElementById('lockBtn');
  const roomStatus = document.getElementById('roomStatus');
  const lastAccess = document.getElementById('lastAccess');
  
  isLocked = !isLocked;
  
  if (isLocked) {
    lockBtn.innerHTML = '<i class="bi bi-lock-fill me-2"></i>Unlock Room';
    lockBtn.className = 'btn btn-danger';
    roomStatus.textContent = 'Locked';
    roomStatus.className = 'card-text status-locked';
    
    addActivity('danger', 'Room Locked', 'Room has been manually locked via dashboard', 'bi-lock-fill');
  } else {
    lockBtn.innerHTML = '<i class="bi bi-unlock-fill me-2"></i>Lock Room';
    lockBtn.className = 'btn btn-success';
    roomStatus.textContent = 'Unlocked';
    roomStatus.className = 'card-text status-unlocked';
    
    addActivity('success', 'Room Unlocked', 'Room has been manually unlocked via dashboard', 'bi-unlock-fill');
  }
  
  lastAccess.textContent = 'Last access: Just now';
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
  const todayAccess = document.getElementById('todayAccess');
  const hourlyAccess = document.getElementById('hourlyAccess');
  const weeklyAccess = document.getElementById('weeklyAccess');
  const failedAttempts = document.getElementById('failedAttempts');
  
  // Count activities for different time periods
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const hourStart = new Date(now.getTime() - 60 * 60 * 1000);
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const todayCount = activityData.filter(a => a.timestamp >= todayStart && a.type === 'success').length;
  const hourCount = activityData.filter(a => a.timestamp >= hourStart && a.type === 'success').length;
  const weekCount = activityData.filter(a => a.timestamp >= weekStart && a.type === 'success').length;
  const failedCount = activityData.filter(a => a.type === 'danger').length;
  
  todayAccess.textContent = todayCount + 12; // Add baseline
  hourlyAccess.textContent = hourCount + 3; // Add baseline
  weeklyAccess.textContent = weekCount + 47; // Add baseline
  failedAttempts.textContent = failedCount;
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
  // Simulate RFID access events
  const simulateAccess = () => {
    const users = ['John Doe', 'Jane Smith', 'Bob Wilson', 'Alice Brown', 'Charlie Davis'];
    const actions = [
      { type: 'success', title: 'Access Granted', desc: 'RFID tag authorized', icon: 'bi-check-circle-fill' },
      { type: 'success', title: 'Room Unlocked', desc: 'Door opened successfully', icon: 'bi-door-open-fill' },
      { type: 'info', title: 'Tag Scanned', desc: 'RFID tag detected', icon: 'bi-credit-card-fill' }
    ];
    
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    
    addActivity(
      randomAction.type,
      randomAction.title,
      `${randomAction.desc} - ${randomUser}`,
      randomAction.icon
    );
  };
  
  // Simulate occasional failed attempts
  const simulateFailure = () => {
    const failures = [
      'Unknown RFID tag detected',
      'Invalid access attempt',
      'Tag access denied - expired',
      'Multiple failed scan attempts'
    ];
    
    const randomFailure = failures[Math.floor(Math.random() * failures.length)];
    addActivity('danger', 'Access Denied', randomFailure, 'bi-x-circle-fill');
  };
  
  // Random events every 10-30 seconds
  setInterval(() => {
    if (Math.random() < 0.8) {
      simulateAccess();
    } else {
      simulateFailure();
    }
  }, Math.random() * 20000 + 10000);
  
  // Update connection status randomly
  setInterval(() => {
    const connectionStatus = document.getElementById('connectionStatus');
    if (Math.random() < 0.95) {
      connectionStatus.textContent = 'Online';
      connectionStatus.className = 'card-text status-online';
    } else {
      connectionStatus.textContent = 'Reconnecting...';
      connectionStatus.className = 'card-text status-offline';
      
      setTimeout(() => {
        connectionStatus.textContent = 'Online';
        connectionStatus.className = 'card-text status-online';
      }, 3000);
    }
  }, 30000);
}

// Initialize with some sample activity
function loadActivityFeed() {
  const sampleActivities = [
    { type: 'success', title: 'Access Granted', desc: 'RFID tag authorized - John Doe', icon: 'bi-check-circle-fill' },
    { type: 'success', title: 'Room Unlocked', desc: 'Door opened successfully - Jane Smith', icon: 'bi-door-open-fill' },
    { type: 'info', title: 'Tag Scanned', desc: 'RFID tag detected - Bob Wilson', icon: 'bi-credit-card-fill' },
    { type: 'warning', title: 'Low Battery', desc: 'RFID reader battery at 15%', icon: 'bi-battery-half' },
    { type: 'success', title: 'Access Granted', desc: 'RFID tag authorized - Alice Brown', icon: 'bi-check-circle-fill' }
  ];
  
  sampleActivities.forEach((activity, index) => {
    setTimeout(() => {
      addActivity(activity.type, activity.title, activity.desc, activity.icon);
    }, index * 500);
  });
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    addActivity,
    toggleLock,
    registerTag,
    formatRelativeTime
  };
}
