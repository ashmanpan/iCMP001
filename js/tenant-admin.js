// Tenant Admin Dashboard Logic

// Check authentication
if (!sessionStorage.getItem('role') || sessionStorage.getItem('role') !== 'tenant-admin') {
    window.location.href = 'index.html';
}

// Get tenant ID from session
const tenantId = sessionStorage.getItem('tenantId') || 'tenant-001';
let currentTenant = null;

// Deployed Services Database (localStorage)
function getDeployedServices() {
    const key = `deployedServices_${tenantId}`;
    const services = localStorage.getItem(key);
    return services ? JSON.parse(services) : [];
}

function saveDeployedService(service) {
    const services = getDeployedServices();
    service.id = 'svc-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    service.tenantId = tenantId;
    service.createdAt = new Date().toISOString();
    service.status = 'provisioning';
    services.push(service);
    localStorage.setItem(`deployedServices_${tenantId}`, JSON.stringify(services));
    return service.id;
}

function updateDeployedService(serviceId, updates) {
    const services = getDeployedServices();
    const index = services.findIndex(s => s.id === serviceId);
    if (index !== -1) {
        services[index] = { ...services[index], ...updates, updatedAt: new Date().toISOString() };
        localStorage.setItem(`deployedServices_${tenantId}`, JSON.stringify(services));
        return true;
    }
    return false;
}

function deleteDeployedService(serviceId) {
    const services = getDeployedServices();
    const filtered = services.filter(s => s.id !== serviceId);
    localStorage.setItem(`deployedServices_${tenantId}`, JSON.stringify(filtered));
    loadDeployedServices();
}

function loadDeployedServices() {
    const services = getDeployedServices();
    const servicesGrid = document.getElementById('deployedServicesGrid');

    if (!servicesGrid) return;

    if (services.length === 0) {
        servicesGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <i class="fas fa-box-open" style="font-size: 4rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
                <p class="text-muted">No services deployed yet. Visit the Deploy Services section to get started!</p>
            </div>
        `;
        return;
    }

    servicesGrid.innerHTML = services.map(service => `
        <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                <div>
                    <h4 style="margin-bottom: 0.5rem;">${service.name}</h4>
                    <span class="badge ${service.status === 'active' ? 'badge-success' : service.status === 'provisioning' ? 'badge-warning' : 'badge-secondary'}">
                        ${service.status.toUpperCase()}
                    </span>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn-icon" onclick="editService('${service.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" onclick="confirmDeleteService('${service.id}', '${service.name}')" title="Delete" style="color: var(--danger);">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>

            <div class="text-sm text-muted" style="margin-bottom: 1rem;">
                <div><strong>Type:</strong> ${service.type}</div>
                ${service.model ? `<div><strong>Model:</strong> ${service.model}</div>` : ''}
                ${service.endpoint ? `<div><strong>Endpoint:</strong> <code style="font-size: 0.75rem;">${service.endpoint}</code></div>` : ''}
                <div><strong>Created:</strong> ${new Date(service.createdAt).toLocaleString()}</div>
            </div>

            <div style="display: flex; gap: 0.5rem;">
                ${service.status === 'active' && service.endpoint ? `
                    <button class="btn btn-sm btn-secondary" onclick="viewServiceDetails('${service.id}')">
                        <i class="fas fa-info-circle"></i> Details
                    </button>
                ` : ''}
                ${service.status === 'provisioning' ? `
                    <button class="btn btn-sm btn-secondary" disabled>
                        <i class="fas fa-spinner fa-spin"></i> Provisioning...
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function confirmDeleteService(serviceId, serviceName) {
    if (confirm(`Are you sure you want to delete "${serviceName}"?\n\nThis action cannot be undone and will terminate all running instances.`)) {
        deleteDeployedService(serviceId);
        alert(`Service "${serviceName}" has been deleted successfully.`);
    }
}

function viewServiceDetails(serviceId) {
    const services = getDeployedServices();
    const service = services.find(s => s.id === serviceId);
    if (service) {
        alert(`Service Details:\n\nName: ${service.name}\nType: ${service.type}\nStatus: ${service.status}\nModel: ${service.model || 'N/A'}\nEndpoint: ${service.endpoint || 'Provisioning...'}\nAPI Key: ${service.apiKey || 'Will be sent via email'}\n\nCreated: ${new Date(service.createdAt).toLocaleString()}`);
    }
}

function editService(serviceId) {
    alert('Edit functionality will open a modal to modify service configuration.\n\nComing soon: Update GPU allocation, scaling settings, and more.');
}

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
        loadDeployedServices();  // Load deployed services
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
    const gpuCount = document.getElementById('llmGPUSlider')?.value || 2;

    if (!serviceName || !model) {
        alert('Please fill in all required fields (Service Name and Model)');
        return;
    }

    // Save to database
    const serviceId = saveDeployedService({
        name: serviceName,
        type: 'LLM as a Service',
        model: model,
        gpuCount: gpuCount,
        endpoint: `https://api.cmp.cisco.com/llm/${serviceName.toLowerCase().replace(/\s+/g, '-')}`,
        apiKey: 'llm-' + Math.random().toString(36).substr(2, 16)
    });

    // Simulate async deployment - mark as active after 3 seconds
    setTimeout(() => {
        updateDeployedService(serviceId, { status: 'active' });
        if (document.getElementById('services').classList.contains('active')) {
            loadDeployedServices();
        }
    }, 3000);

    alert(`Deploying LLM Service: ${serviceName}\nModel: ${model}\nGPUs: ${gpuCount}\n\nDeployment started! Service ID: ${serviceId}\n\nYour service will be ready in ~5 minutes.\nYou will receive an API endpoint and credentials via email.`);
    closeModal('deployLLMModal');

    // Show in deployed services
    loadDeployedServices();
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
    const vectorDB = document.getElementById('ragVectorDB')?.value;

    if (!serviceName || !llmModel) {
        alert('Please fill in all required fields (Service Name and LLM Model)');
        return;
    }

    // Save to database
    const serviceId = saveDeployedService({
        name: serviceName,
        type: 'RAG as a Service',
        model: llmModel,
        vectorDB: vectorDB || 'Pinecone',
        endpoint: `https://api.cmp.cisco.com/rag/${serviceName.toLowerCase().replace(/\s+/g, '-')}`,
        apiKey: 'rag-' + Math.random().toString(36).substr(2, 16)
    });

    setTimeout(() => {
        updateDeployedService(serviceId, { status: 'active' });
        if (document.getElementById('services').classList.contains('active')) loadDeployedServices();
    }, 5000);

    alert(`Deploying RAG Service: ${serviceName}\nLLM: ${llmModel}\n\nDeployment started!\n\nSetting up:\n- Vector database\n- Embedding model\n- Document ingestion pipeline\n- Query API\n\nEstimated time: 10 minutes`);
    closeModal('deployRAGModal');
    loadDeployedServices();
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
