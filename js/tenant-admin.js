// Tenant Admin Dashboard Logic

// Check authentication
if (!sessionStorage.getItem('role') || sessionStorage.getItem('role') !== 'tenant-admin') {
    window.location.href = 'index.html';
}

// Get tenant ID from session
const tenantId = sessionStorage.getItem('tenantId') || 'tenant-001';
let currentTenant = null;

// Mock users for this tenant
const tenantUsers = [
    { id: 'user-001', name: 'John Doe', email: 'john@techcorp.com', role: 'User', status: 'Active' },
    { id: 'user-002', name: 'Jane Smith', email: 'jane@techcorp.com', role: 'User', status: 'Active' },
    { id: 'user-003', name: 'Bob Johnson', email: 'bob@techcorp.com', role: 'Admin', status: 'Active' }
];

// Show section
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');

    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.closest('.menu-item').classList.add('active');

    if (sectionId === 'catalog') {
        // Service catalog is static HTML, no need to load
    } else if (sectionId === 'services') {
        loadServices();
    } else if (sectionId === 'users') {
        loadUsers();
    } else if (sectionId === 'billing') {
        loadBilling();
    }
}

// Load tenant data
function loadTenantData() {
    currentTenant = getTenantById(tenantId);

    if (!currentTenant) {
        currentTenant = mockTenants[0]; // Fallback to first tenant
    }

    // Update header
    document.getElementById('tenantName').textContent = currentTenant.name;

    // Update stats
    document.getElementById('allocatedGPUs').textContent = currentTenant.allocatedGPUs;
    document.getElementById('totalUsers').textContent = currentTenant.users;
    document.getElementById('consumptionRate').textContent = currentTenant.consumptionRate.toFixed(1) + '%';
    document.getElementById('currentSpend').textContent = '$' + currentTenant.currentSpend.toLocaleString();

    // Create charts
    createUsageChart();
    createBudgetChart();
}

// Create Usage Chart
function createUsageChart() {
    const ctx = document.getElementById('usageChart').getContext('2d');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
            datasets: [{
                label: 'GPU Usage (%)',
                data: [45, 52, 48, 65, 72, 68, 75, 82, 78, currentTenant.consumptionRate],
                borderColor: '#049FD9',
                backgroundColor: 'rgba(4, 159, 217, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: { color: '#2a2a2a' },
                    ticks: { color: '#e0e0e0' }
                },
                x: {
                    grid: { color: '#2a2a2a' },
                    ticks: { color: '#e0e0e0' }
                }
            },
            plugins: {
                legend: {
                    labels: { color: '#e0e0e0' }
                }
            }
        }
    });
}

// Create Budget Chart
function createBudgetChart() {
    const ctx = document.getElementById('budgetChart').getContext('2d');
    const remaining = currentTenant.monthlyBudget - currentTenant.currentSpend;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Spent', 'Remaining'],
            datasets: [{
                data: [currentTenant.currentSpend, remaining],
                backgroundColor: ['#049FD9', '#00ff88']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#e0e0e0' }
                }
            }
        }
    });
}

// Load Services
function loadServices() {
    const servicesGrid = document.getElementById('servicesGrid');
    const enabledServices = currentTenant.services || [];

    servicesGrid.innerHTML = mockServices.map(service => {
        const isEnabled = enabledServices.includes(service.id);
        return `
            <div class="card" style="text-align: center;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">${service.icon}</div>
                <h4 style="margin-bottom: 0.5rem;">${service.name}</h4>
                <p class="text-muted text-sm" style="margin-bottom: 1rem;">${service.description}</p>
                <p class="text-sm" style="margin-bottom: 1rem;"><strong>${service.pricing}</strong></p>
                <button
                    class="btn ${isEnabled ? 'btn-secondary' : 'btn-primary'}"
                    onclick="toggleService('${service.id}')"
                    style="width: 100%;">
                    ${isEnabled ? '<i class="fas fa-check"></i> Enabled' : '<i class="fas fa-plus"></i> Enable'}
                </button>
            </div>
        `;
    }).join('');
}

// Toggle Service
function toggleService(serviceId) {
    if (!currentTenant.services) {
        currentTenant.services = [];
    }

    const index = currentTenant.services.indexOf(serviceId);
    if (index > -1) {
        currentTenant.services.splice(index, 1);
        alert('Service disabled successfully!');
    } else {
        currentTenant.services.push(serviceId);
        alert('Service enabled successfully!');
    }

    loadServices();
}

// Load Users
function loadUsers() {
    const usersTable = document.getElementById('usersTable');

    usersTable.innerHTML = tenantUsers.map(user => `
        <tr>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td><span class="badge badge-info">${user.role}</span></td>
            <td><span class="badge badge-success">${user.status}</span></td>
            <td>
                <button class="btn btn-sm btn-secondary" onclick="editUser('${user.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteUser('${user.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Modal functions
function openModal(modalId) {
    console.log('Opening modal:', modalId);
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        console.log('Modal opened successfully');
    } else {
        console.error('Modal not found:', modalId);
        alert('Error: Modal not found. Please refresh the page and try again.');
    }
}

function openAddUserModal() {
    document.getElementById('addUserModal').classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Add User
function addUser() {
    const name = document.getElementById('newUserName').value;
    const email = document.getElementById('newUserEmail').value;
    const role = document.getElementById('newUserRole').value;

    if (!name || !email) {
        alert('Please fill all fields');
        return;
    }

    const newUser = {
        id: 'user-' + Date.now(),
        name: name,
        email: email,
        role: role.charAt(0).toUpperCase() + role.slice(1),
        status: 'Active'
    };

    tenantUsers.push(newUser);
    currentTenant.users = tenantUsers.length;

    closeModal('addUserModal');
    loadUsers();
    loadTenantData();

    alert('User added successfully!');
}

// Edit User
function editUser(userId) {
    const user = tenantUsers.find(u => u.id === userId);
    if (user) {
        alert(`Edit user: ${user.name}\n(Feature coming soon)`);
    }
}

// Delete User
function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        const index = tenantUsers.findIndex(u => u.id === userId);
        if (index > -1) {
            tenantUsers.splice(index, 1);
            currentTenant.users = tenantUsers.length;
            loadUsers();
            loadTenantData();
            alert('User deleted successfully!');
        }
    }
}

// Load Billing
function loadBilling() {
    document.getElementById('monthlyBudget').textContent = currentTenant.monthlyBudget.toLocaleString();
    document.getElementById('billingCurrentSpend').textContent = currentTenant.currentSpend.toLocaleString();
    document.getElementById('remaining').textContent = (currentTenant.monthlyBudget - currentTenant.currentSpend).toLocaleString();

    // Create cost breakdown chart
    const ctx = document.getElementById('costChart').getContext('2d');

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['GPU Compute', 'LLM Services', 'Storage', 'Network'],
            datasets: [{
                data: [40, 35, 15, 10],
                backgroundColor: ['#049FD9', '#00ff88', '#ffc107', '#ff9800']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#e0e0e0' }
                }
            }
        }
    });
}

// Service Deployment Functions

function deployLLMService() {
    const serviceName = document.getElementById('llmServiceName').value;
    const model = document.getElementById('llmModel').value;

    if (!serviceName || !model) {
        alert('Please fill in all required fields (Service Name and Model)');
        return;
    }

    // Simulate deployment
    alert(`Deploying LLM Service: ${serviceName}\nModel: ${model}\n\nDeployment started! Your service will be ready in ~5 minutes.\nYou will receive an API endpoint and credentials via email.`);
    closeModal('deployLLMModal');

    // Refresh services list
    if (document.getElementById('services').classList.contains('active')) {
        loadServices();
    }
}

function deployFineTuningService() {
    const jobName = document.getElementById('ftJobName').value;
    const baseModel = document.getElementById('ftBaseModel').value;

    if (!jobName || !baseModel) {
        alert('Please fill in all required fields (Job Name and Base Model)');
        return;
    }

    alert(`Starting Fine-Tuning Job: ${jobName}\nBase Model: ${baseModel}\n\nJob queued successfully! Training will begin shortly.\nYou will be notified when the job completes.`);
    closeModal('deployFineTuningModal');
}

function deployComputerVisionService() {
    const serviceName = document.getElementById('cvServiceName')?.value || 'CV Service';

    alert(`Deploying Computer Vision Service: ${serviceName}\n\nDeployment started! Your CV service will be ready in ~3 minutes.\nAPI endpoint will be sent to your email.`);
    closeModal('deployComputerVisionModal');
}

function deployVMService() {
    const vmName = document.getElementById('vmName')?.value || 'GPU VM';

    alert(`Deploying GPU VM: ${vmName}\n\nVM provisioning started!\n\nYou will receive:\n- SSH access credentials\n- Public IP address\n- Connection instructions\n\nEstimated time: 10 minutes`);
    closeModal('deployVMModal');
}

function deployBareMetalService() {
    const serverName = document.getElementById('bareMetalName')?.value || 'Bare Metal Server';

    alert(`Deploying Bare Metal Server: ${serverName}\n\nServer provisioning started!\n\nYou will receive:\n- IPMI/BMC access\n- Root SSH credentials\n- Serial console access\n- Network configuration\n\nEstimated time: 20-30 minutes`);
    closeModal('deployBareMetalModal');
}

function deployBYOMService() {
    const serviceName = document.getElementById('byomServiceName')?.value || 'Custom Model';

    alert(`Deploying BYOM Service: ${serviceName}\n\nDeployment started! Your custom model service will be containerized and deployed.\n\nEstimated time: 8-15 minutes\nYou will receive API endpoint and documentation.`);
    closeModal('deployBYOMModal');
}

function deployRAGService() {
    const serviceName = document.getElementById('ragServiceName')?.value || 'RAG Service';
    const llmModel = document.getElementById('ragLLMModel')?.value;

    if (!serviceName || !llmModel) {
        alert('Please fill in all required fields (Service Name and LLM Model)');
        return;
    }

    alert(`Deploying RAG Service: ${serviceName}\nLLM: ${llmModel}\n\nDeployment started!\n\nSetting up:\n- Vector database\n- Embedding model\n- Document ingestion pipeline\n- Query API\n\nEstimated time: 10 minutes`);
    closeModal('deployRAGModal');
}

function deployAgenticService() {
    const serviceName = document.getElementById('agenticServiceName')?.value || 'AI Agent';
    const agentType = document.getElementById('agenticType')?.value;
    const llm = document.getElementById('agenticLLM')?.value;

    if (!serviceName || !agentType || !llm) {
        alert('Please fill in all required fields (Service Name, Agent Type, and LLM)');
        return;
    }

    alert(`Deploying Agentic AI: ${serviceName}\nType: ${agentType}\nLLM: ${llm}\n\nDeployment started!\n\nConfiguring:\n- Agent framework\n- Tool integrations\n- Memory system\n- API endpoint\n\nEstimated time: 12 minutes`);
    closeModal('deployAgenticModal');
}

function deployBuildAIService() {
    const envName = document.getElementById('buildAIEnvName')?.value || 'AI Workspace';

    alert(`Deploying Build Your Own AI Environment: ${envName}\n\nDeployment started!\n\nSetting up:\n- Development environment\n- MLOps tools\n- Jupyter/VS Code access\n- Persistent storage\n- GPU allocation\n\nEstimated time: 15 minutes\nYou will receive access URLs and credentials.`);
    closeModal('deployBuildAIModal');
}

// Logout
function logout() {
    sessionStorage.clear();
    window.location.href = 'index.html';
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadTenantData();
    const savedLang = localStorage.getItem('lang') || 'en';
    document.getElementById('langSelect').value = savedLang;
});
