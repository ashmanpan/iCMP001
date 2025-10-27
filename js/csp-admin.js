// CSP Admin Dashboard Logic

// Check authentication
if (!sessionStorage.getItem('role') || sessionStorage.getItem('role') !== 'csp-admin') {
    window.location.href = 'index.html';
}

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

    // Load section data
    if (sectionId === 'tenants') {
        loadTenantsList();
    } else if (sectionId === 'gpus') {
        loadGPUs();
    } else if (sectionId === 'fabric') {
        loadFabric();
    } else if (sectionId === 'logs') {
        loadLogs();
    } else if (sectionId === 'analytics') {
        loadAnalytics();
    }
}

// Load overview data
function loadOverview() {
    document.getElementById('totalTenants').textContent = mockTenants.length;
    document.getElementById('totalGPUs').textContent = getAllGPUs().length;
    document.getElementById('totalUCS').textContent = mockUCSServers.length;

    // Load tenant cards
    const tenantsOverview = document.getElementById('tenantsOverview');
    tenantsOverview.innerHTML = mockTenants.slice(0, 3).map(tenant => `
        <div class="tenant-card" onclick="viewTenantDetails('${tenant.id}')">
            <div class="tenant-header">
                <div>
                    <h4>${tenant.name}</h4>
                    <span class="badge badge-success">${tenant.status}</span>
                </div>
                <div class="text-muted">${tenant.created}</div>
            </div>
            <div class="tenant-stats">
                <div class="tenant-stat">
                    <div class="tenant-stat-value">${tenant.allocatedGPUs}</div>
                    <div class="tenant-stat-label">GPUs</div>
                </div>
                <div class="tenant-stat">
                    <div class="tenant-stat-value">${tenant.users}</div>
                    <div class="tenant-stat-label">Users</div>
                </div>
                <div class="tenant-stat">
                    <div class="tenant-stat-value">${tenant.consumptionRate.toFixed(1)}%</div>
                    <div class="tenant-stat-label">Usage</div>
                </div>
            </div>
        </div>
    `).join('');

    // Initialize charts
    createGPUChart();
    createConsumptionChart();
}

// Create GPU Distribution Chart
function createGPUChart() {
    const ctx = document.getElementById('gpuChart').getContext('2d');
    const nvidiaGPUs = mockGPUs.nvidia.length;
    const amdGPUs = mockGPUs.amd.length;
    const availableGPUs = getAvailableGPUs().length;
    const allocatedGPUs = getAllocatedGPUs().length;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['NVIDIA', 'AMD', 'Available', 'Allocated'],
            datasets: [{
                data: [nvidiaGPUs, amdGPUs, availableGPUs, allocatedGPUs],
                backgroundColor: ['#049FD9', '#ff9800', '#00ff88', '#ffc107']
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

// Create Consumption Chart
function createConsumptionChart() {
    const ctx = document.getElementById('consumptionChart').getContext('2d');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: mockConsumptionData.map(d => d.month),
            datasets: [{
                label: 'Consumption Rate (%)',
                data: mockConsumptionData.map(d => d.consumption),
                borderColor: '#049FD9',
                backgroundColor: 'rgba(4, 159, 217, 0.1)',
                tension: 0.4
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

// Load Tenants List
function loadTenantsList() {
    const tenantsList = document.getElementById('tenantsList');
    tenantsList.innerHTML = mockTenants.map(tenant => `
        <div class="tenant-card">
            <div class="tenant-header">
                <div>
                    <h3>${tenant.name}</h3>
                    <span class="badge badge-success">${tenant.status}</span>
                </div>
                <div>
                    <button class="btn btn-sm btn-secondary" onclick="viewTenantDetails('${tenant.id}')">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                </div>
            </div>
            <div class="tenant-stats">
                <div class="tenant-stat">
                    <div class="tenant-stat-value">${tenant.allocatedGPUs}</div>
                    <div class="tenant-stat-label">Allocated GPUs</div>
                </div>
                <div class="tenant-stat">
                    <div class="tenant-stat-value">${tenant.users}</div>
                    <div class="tenant-stat-label">Users</div>
                </div>
                <div class="tenant-stat">
                    <div class="tenant-stat-value">${tenant.consumptionRate.toFixed(1)}%</div>
                    <div class="tenant-stat-label">Consumption</div>
                </div>
                <div class="tenant-stat">
                    <div class="tenant-stat-value">$${tenant.currentSpend.toLocaleString()}</div>
                    <div class="tenant-stat-label">Current Spend</div>
                </div>
                <div class="tenant-stat">
                    <div class="tenant-stat-value">$${tenant.monthlyBudget.toLocaleString()}</div>
                    <div class="tenant-stat-label">Budget</div>
                </div>
                <div class="tenant-stat">
                    <div class="tenant-stat-value">${tenant.services.length}</div>
                    <div class="tenant-stat-label">Active Services</div>
                </div>
            </div>
        </div>
    `).join('');
}

// Load GPUs
function loadGPUs() {
    const allGPUs = getAllGPUs();
    document.getElementById('nvidiaCount').textContent = mockGPUs.nvidia.length;
    document.getElementById('amdCount').textContent = mockGPUs.amd.length;
    document.getElementById('availableCount').textContent = getAvailableGPUs().length;
    document.getElementById('allocatedCount').textContent = getAllocatedGPUs().length;

    const gpuGrid = document.getElementById('gpuGrid');
    gpuGrid.innerHTML = allGPUs.map(gpu => `
        <div class="gpu-card ${gpu.status}">
            <div class="stat-icon blue">
                <i class="fas fa-microchip"></i>
            </div>
            <h4>${gpu.model}</h4>
            <p class="text-muted">${gpu.memory}</p>
            <p class="text-sm">Server: ${gpu.ucsServer}</p>
            <span class="badge badge-${getBadgeClass(gpu.status)}">${gpu.status}</span>
            ${gpu.tenant ? `<p class="text-sm mt-sm">Tenant: ${getTenantById(gpu.tenant)?.name || 'Unknown'}</p>` : ''}
        </div>
    `).join('');
}

// Load Nexus Fabric
function loadFabric() {
    const fabricTable = document.getElementById('fabricTable');
    fabricTable.innerHTML = mockNexusFabric.map(sw => `
        <tr>
            <td>${sw.id}</td>
            <td>${sw.model}</td>
            <td>${sw.ports}</td>
            <td>${sw.connectedServers}</td>
            <td><span class="badge badge-${sw.status === 'healthy' ? 'success' : 'warning'}">${sw.status}</span></td>
        </tr>
    `).join('');

    const ucsTable = document.getElementById('ucsTable');
    ucsTable.innerHTML = mockUCSServers.map(server => `
        <tr>
            <td>${server.id}</td>
            <td>${server.name}</td>
            <td>${server.rack}</td>
            <td>${server.nexusSwitch}</td>
            <td>${server.gpuCount}</td>
            <td><span class="badge badge-${server.status === 'online' ? 'success' : 'warning'}">${server.status}</span></td>
        </tr>
    `).join('');
}

// Load Logs
function loadLogs() {
    const logsTable = document.getElementById('logsTable');
    logsTable.innerHTML = mockLogs.map(log => `
        <tr>
            <td>${log.timestamp}</td>
            <td>${getTenantById(log.tenant)?.name || log.tenant}</td>
            <td><span class="badge badge-info">${log.action}</span></td>
            <td>${log.gpu || log.service || log.username || '-'}</td>
            <td>${log.user}</td>
        </tr>
    `).join('');
}

// Load Analytics
function loadAnalytics() {
    // Tenant Consumption Chart
    const tenantCtx = document.getElementById('tenantConsumptionChart').getContext('2d');
    new Chart(tenantCtx, {
        type: 'bar',
        data: {
            labels: mockTenants.map(t => t.name),
            datasets: [{
                label: 'Consumption Rate (%)',
                data: mockTenants.map(t => t.consumptionRate),
                backgroundColor: '#049FD9'
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

    // GPU Type Chart
    const gpuTypeCtx = document.getElementById('gpuTypeChart').getContext('2d');
    const gpuModels = {};
    getAllGPUs().forEach(gpu => {
        gpuModels[gpu.model] = (gpuModels[gpu.model] || 0) + 1;
    });

    new Chart(gpuTypeCtx, {
        type: 'pie',
        data: {
            labels: Object.keys(gpuModels),
            datasets: [{
                data: Object.values(gpuModels),
                backgroundColor: ['#049FD9', '#00ff88', '#ffc107', '#ff9800', '#ff4444']
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

// Modal functions
function openCreateTenantModal() {
    const modal = document.getElementById('createTenantModal');
    modal.classList.add('active');

    // Populate available GPUs
    const gpuSelect = document.getElementById('newTenantGPUs');
    gpuSelect.innerHTML = getAvailableGPUs().map(gpu =>
        `<option value="${gpu.id}">${gpu.model} - ${gpu.memory} (${gpu.ucsServer})</option>`
    ).join('');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Create Tenant (will be integrated with DynamoDB via Amplify)
async function createTenant() {
    const name = document.getElementById('newTenantName').value;
    const budget = document.getElementById('newTenantBudget').value;
    const gpuSelect = document.getElementById('newTenantGPUs');
    const selectedGPUs = Array.from(gpuSelect.selectedOptions).map(opt => opt.value);

    if (!name || !budget) {
        alert('Please fill all fields');
        return;
    }

    // This will be replaced with actual Amplify API call
    const newTenant = {
        id: 'tenant-' + Date.now(),
        name: name,
        status: 'active',
        created: new Date().toISOString().split('T')[0],
        allocatedGPUs: selectedGPUs.length,
        consumptionRate: 0,
        services: [],
        users: 0,
        monthlyBudget: parseInt(budget),
        currentSpend: 0
    };

    // TODO: Add to DynamoDB via Amplify
    // await API.graphql(graphqlOperation(createTenantMutation, { input: newTenant }));

    mockTenants.push(newTenant);

    // Update GPU allocations
    selectedGPUs.forEach(gpuId => {
        const gpu = getAllGPUs().find(g => g.id === gpuId);
        if (gpu) {
            gpu.status = 'allocated';
            gpu.tenant = newTenant.id;
        }
    });

    closeModal('createTenantModal');
    loadOverview();
    alert('Tenant created successfully!');
}

// View Tenant Details
function viewTenantDetails(tenantId) {
    const tenant = getTenantById(tenantId);
    if (tenant) {
        alert(`Tenant: ${tenant.name}\nGPUs: ${tenant.allocatedGPUs}\nBudget: $${tenant.monthlyBudget}\nSpend: $${tenant.currentSpend}`);
    }
}

// Helper function for badge classes
function getBadgeClass(status) {
    const map = {
        'available': 'success',
        'allocated': 'warning',
        'in-use': 'info',
        'maintenance': 'error'
    };
    return map[status] || 'info';
}

// Logout
function logout() {
    sessionStorage.clear();
    window.location.href = 'index.html';
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadOverview();
    const savedLang = localStorage.getItem('lang') || 'en';
    document.getElementById('langSelect').value = savedLang;
});
