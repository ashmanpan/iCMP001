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
    tenantsList.innerHTML = mockTenants.map(tenant => {
        const enabledServices = tenant.services || [];
        const allServiceIds = mockServices.map(s => s.id);
        const lockedServices = allServiceIds.filter(id => !enabledServices.includes(id));

        return `
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
                    ${getSpendingTrend(tenant)}
                </div>
                <div class="tenant-stat">
                    <div class="tenant-stat-value">$${tenant.monthlyBudget.toLocaleString()}</div>
                    <div class="tenant-stat-label">Budget</div>
                    <div style="font-size: 0.7rem; margin-top: 0.25rem;">
                        <span style="color: ${tenant.currentSpend > tenant.monthlyBudget * 0.8 ? 'var(--accent-red)' : 'var(--accent-green)'};">
                            ${((tenant.currentSpend / tenant.monthlyBudget) * 100).toFixed(0)}% Used
                        </span>
                    </div>
                </div>
                <div class="tenant-stat">
                    <div class="tenant-stat-value">${enabledServices.length}/${allServiceIds.length}</div>
                    <div class="tenant-stat-label">Active Services</div>
                </div>
            </div>

            <!-- Services Status -->
            <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border-primary);">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
                    <h4 style="margin: 0; font-size: 0.9rem; color: var(--text-secondary);">
                        <i class="fas fa-server"></i> Services Access
                    </h4>
                    <div style="display: flex; gap: 1rem; font-size: 0.75rem;">
                        <span style="color: var(--accent-green);">
                            <i class="fas fa-unlock"></i> ${enabledServices.length} Enabled
                        </span>
                        <span style="color: var(--text-muted);">
                            <i class="fas fa-lock"></i> ${lockedServices.length} Locked
                        </span>
                    </div>
                </div>

                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                    ${mockServices.map(service => {
                        const isEnabled = enabledServices.includes(service.id);
                        return `
                            <div style="
                                display: inline-flex;
                                align-items: center;
                                gap: 0.5rem;
                                padding: 0.4rem 0.75rem;
                                background: ${isEnabled ? 'rgba(0, 255, 136, 0.1)' : 'var(--bg-tertiary)'};
                                border: 1px solid ${isEnabled ? 'var(--accent-green)' : 'var(--border-primary)'};
                                border-radius: 6px;
                                font-size: 0.75rem;
                                color: ${isEnabled ? 'var(--accent-green)' : 'var(--text-muted)'};
                            ">
                                <i class="fas fa-${isEnabled ? 'unlock' : 'lock'}" style="font-size: 0.7rem;"></i>
                                <span>${service.icon} ${service.name.replace(' as a Service', '')}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </div>
        `;
    }).join('');
}

// Load GPUs
function loadGPUs() {
    const allGPUs = getAllGPUs();
    document.getElementById('nvidiaCount').textContent = mockGPUs.nvidia.length;
    document.getElementById('amdCount').textContent = mockGPUs.amd.length;
    document.getElementById('availableCount').textContent = getAvailableGPUs().length;
    document.getElementById('allocatedCount').textContent = getAllocatedGPUs().length;

    // Group GPUs by model
    loadGPUsByModel();

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

// Load GPUs grouped by model
function loadGPUsByModel() {
    // Group NVIDIA GPUs by model
    const nvidiaGrouped = {};
    mockGPUs.nvidia.forEach(gpu => {
        if (!nvidiaGrouped[gpu.model]) {
            nvidiaGrouped[gpu.model] = {
                total: 0,
                available: 0,
                allocated: 0,
                maintenance: 0,
                memory: gpu.memory
            };
        }
        nvidiaGrouped[gpu.model].total++;
        if (gpu.status === 'available') nvidiaGrouped[gpu.model].available++;
        else if (gpu.status === 'allocated' || gpu.status === 'in-use') nvidiaGrouped[gpu.model].allocated++;
        else if (gpu.status === 'maintenance') nvidiaGrouped[gpu.model].maintenance++;
    });

    // Group AMD GPUs by model
    const amdGrouped = {};
    mockGPUs.amd.forEach(gpu => {
        if (!amdGrouped[gpu.model]) {
            amdGrouped[gpu.model] = {
                total: 0,
                available: 0,
                allocated: 0,
                maintenance: 0,
                memory: gpu.memory
            };
        }
        amdGrouped[gpu.model].total++;
        if (gpu.status === 'available') amdGrouped[gpu.model].available++;
        else if (gpu.status === 'allocated' || gpu.status === 'in-use') amdGrouped[gpu.model].allocated++;
        else if (gpu.status === 'maintenance') amdGrouped[gpu.model].maintenance++;
    });

    // Display NVIDIA models
    const nvidiaGrid = document.getElementById('nvidiaModelGrid');
    nvidiaGrid.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
            ${Object.entries(nvidiaGrouped).map(([model, stats]) => `
                <div class="card" style="background: var(--bg-tertiary); padding: 1.5rem; border: 1px solid var(--border-primary);">
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                        <div style="font-size: 2rem; color: #76b900;">
                            <i class="fas fa-microchip"></i>
                        </div>
                        <div>
                            <h4 style="margin: 0; color: var(--text-primary);">NVIDIA ${model}</h4>
                            <p style="margin: 0; color: var(--text-muted); font-size: 0.875rem;">${stats.memory} Memory</p>
                        </div>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; margin-top: 1rem;">
                        <div style="text-align: center; padding: 0.5rem; background: var(--bg-secondary); border-radius: 6px;">
                            <div style="font-size: 1.5rem; font-weight: 700; color: var(--cisco-blue);">${stats.total}</div>
                            <div style="font-size: 0.75rem; color: var(--text-muted);">Total</div>
                        </div>
                        <div style="text-align: center; padding: 0.5rem; background: var(--bg-secondary); border-radius: 6px;">
                            <div style="font-size: 1.5rem; font-weight: 700; color: var(--accent-green);">${stats.available}</div>
                            <div style="font-size: 0.75rem; color: var(--text-muted);">Available</div>
                        </div>
                        <div style="text-align: center; padding: 0.5rem; background: var(--bg-secondary); border-radius: 6px;">
                            <div style="font-size: 1.5rem; font-weight: 700; color: var(--accent-yellow);">${stats.allocated}</div>
                            <div style="font-size: 0.75rem; color: var(--text-muted);">Allocated</div>
                        </div>
                        <div style="text-align: center; padding: 0.5rem; background: var(--bg-secondary); border-radius: 6px;">
                            <div style="font-size: 1.5rem; font-weight: 700; color: var(--accent-red);">${stats.maintenance}</div>
                            <div style="font-size: 0.75rem; color: var(--text-muted);">Maintenance</div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    // Display AMD models
    const amdGrid = document.getElementById('amdModelGrid');
    amdGrid.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
            ${Object.entries(amdGrouped).map(([model, stats]) => `
                <div class="card" style="background: var(--bg-tertiary); padding: 1.5rem; border: 1px solid var(--border-primary);">
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                        <div style="font-size: 2rem; color: #ed1c24;">
                            <i class="fas fa-microchip"></i>
                        </div>
                        <div>
                            <h4 style="margin: 0; color: var(--text-primary);">AMD ${model}</h4>
                            <p style="margin: 0; color: var(--text-muted); font-size: 0.875rem;">${stats.memory} Memory</p>
                        </div>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; margin-top: 1rem;">
                        <div style="text-align: center; padding: 0.5rem; background: var(--bg-secondary); border-radius: 6px;">
                            <div style="font-size: 1.5rem; font-weight: 700; color: var(--cisco-blue);">${stats.total}</div>
                            <div style="font-size: 0.75rem; color: var(--text-muted);">Total</div>
                        </div>
                        <div style="text-align: center; padding: 0.5rem; background: var(--bg-secondary); border-radius: 6px;">
                            <div style="font-size: 1.5rem; font-weight: 700; color: var(--accent-green);">${stats.available}</div>
                            <div style="font-size: 0.75rem; color: var(--text-muted);">Available</div>
                        </div>
                        <div style="text-align: center; padding: 0.5rem; background: var(--bg-secondary); border-radius: 6px;">
                            <div style="font-size: 1.5rem; font-weight: 700; color: var(--accent-yellow);">${stats.allocated}</div>
                            <div style="font-size: 0.75rem; color: var(--text-muted);">Allocated</div>
                        </div>
                        <div style="text-align: center; padding: 0.5rem; background: var(--bg-secondary); border-radius: 6px;">
                            <div style="font-size: 1.5rem; font-weight: 700; color: var(--accent-red);">${stats.maintenance}</div>
                            <div style="font-size: 0.75rem; color: var(--text-muted);">Maintenance</div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Toggle GPU detailed view
let gpuDetailedView = true;
function toggleGPUView() {
    gpuDetailedView = !gpuDetailedView;
    const gpuGrid = document.getElementById('gpuGrid');
    if (gpuDetailedView) {
        gpuGrid.style.display = 'grid';
    } else {
        gpuGrid.style.display = 'none';
    }
}

// Load Nexus Fabric
function loadFabric() {
    const fabricTable = document.getElementById('fabricTable');
    fabricTable.innerHTML = mockNexusFabric.map(sw => `
        <tr>
            <td>${sw.id}</td>
            <td>${sw.model}</td>
            <td><span class="badge badge-${sw.type === 'Spine' ? 'info' : 'success'}">${sw.type}</span></td>
            <td><strong style="color: var(--cisco-blue);">${sw.speed}</strong></td>
            <td>${sw.ports}</td>
            <td>${sw.connectedServers}</td>
            <td><span class="badge badge-${sw.status === 'healthy' ? 'success' : 'warning'}">${sw.status}</span></td>
        </tr>
    `).join('');

    const ucsTable = document.getElementById('ucsTable');
    ucsTable.innerHTML = mockUCSServers.map(server => `
        <tr>
            <td>${server.id}</td>
            <td><strong>${server.name}</strong></td>
            <td>${server.rack}</td>
            <td style="font-size: 0.85rem;">${server.nexusSwitch}</td>
            <td><strong style="color: var(--cisco-blue);">${server.gpuCount}x</strong></td>
            <td style="color: var(--text-secondary);">${server.gpuModel}</td>
            <td><span class="badge badge-${server.status === 'online' ? 'success' : 'warning'}">${server.status}</span></td>
        </tr>
    `).join('');

    // Initialize topology view (but don't render until tab is clicked)
}

// Switch Fabric Tab
function switchFabricTab(tab) {
    // Update tab buttons
    const tabs = document.querySelectorAll('.fabric-tab');
    tabs.forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');

    // Show/hide views
    const tableView = document.getElementById('fabricTableView');
    const topologyView = document.getElementById('fabricTopologyView');

    if (tab === 'table') {
        tableView.style.display = 'block';
        topologyView.style.display = 'none';
    } else {
        tableView.style.display = 'none';
        topologyView.style.display = 'block';
        renderTopologyView();
    }
}

// Render Topology View with Spine-Leaf Architecture
function renderTopologyView() {
    const container = document.getElementById('topologyContainer');
    const width = container.offsetWidth || 1000;
    const height = 600;

    // Separate switches by type
    const spineSwitches = mockNexusFabric.filter(sw => sw.type === 'Spine');
    const leafSwitches = mockNexusFabric.filter(sw => sw.type === 'Leaf');

    // Calculate positions
    const spineY = 100;
    const leafY = 450;
    const spineSpacing = width / (spineSwitches.length + 1);
    const leafSpacing = width / (leafSwitches.length + 1);

    // Create SVG
    let svg = `
        <svg width="${width}" height="${height}" style="width: 100%; height: auto;">
            <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="rgba(4, 159, 217, 0.5)" />
                </marker>
            </defs>
    `;

    // Draw links first (so they appear behind switches)
    mockFabricLinks.forEach(link => {
        const fromSwitch = mockNexusFabric.find(sw => sw.id === link.from);
        const toSwitch = mockNexusFabric.find(sw => sw.id === link.to);

        const fromIndex = fromSwitch.type === 'Leaf' ?
            leafSwitches.findIndex(sw => sw.id === link.from) :
            spineSwitches.findIndex(sw => sw.id === link.from);
        const toIndex = toSwitch.type === 'Spine' ?
            spineSwitches.findIndex(sw => sw.id === link.to) :
            leafSwitches.findIndex(sw => sw.id === link.to);

        const x1 = fromSwitch.type === 'Leaf' ?
            leafSpacing * (fromIndex + 1) :
            spineSpacing * (fromIndex + 1);
        const y1 = fromSwitch.type === 'Leaf' ? leafY : spineY;
        const x2 = toSwitch.type === 'Spine' ?
            spineSpacing * (toIndex + 1) :
            leafSpacing * (toIndex + 1);
        const y2 = toSwitch.type === 'Spine' ? spineY : leafY;

        // Color based on utilization
        let linkColor = 'rgba(0, 255, 136, 0.5)'; // Green
        if (link.utilization > 70) linkColor = 'rgba(255, 193, 7, 0.7)'; // Yellow
        if (link.utilization > 85) linkColor = 'rgba(255, 68, 68, 0.7)'; // Red

        const strokeWidth = 2;

        svg += `
            <g class="topology-link">
                <line x1="${x1}" y1="${y1 + 60}" x2="${x2}" y2="${y2 + 60}"
                      stroke="${linkColor}" stroke-width="${strokeWidth}"
                      marker-end="url(#arrowhead)" />
                <text x="${(x1 + x2) / 2}" y="${(y1 + y2) / 2 + 60}"
                      fill="var(--text-secondary)" font-size="12" text-anchor="middle"
                      style="background: var(--bg-card); padding: 2px;">
                    ${link.utilization}%
                </text>
            </g>
        `;
    });

    // Draw Spine Switches
    svg += `<text x="${width / 2}" y="30" fill="var(--cisco-blue)" font-size="18" font-weight="600" text-anchor="middle">Spine Layer (Core) - 800G</text>`;
    spineSwitches.forEach((sw, idx) => {
        const x = spineSpacing * (idx + 1);
        const y = spineY;
        const statusColor = sw.status === 'healthy' ? 'var(--accent-green)' :
                           sw.status === 'warning' ? 'var(--accent-yellow)' : 'var(--accent-red)';

        svg += `
            <g class="topology-switch" onclick="showSwitchInfo('${sw.id}')">
                <rect x="${x - 80}" y="${y}" width="160" height="110"
                      fill="var(--bg-card)" stroke="${statusColor}" stroke-width="3" rx="8" />
                <text x="${x}" y="${y + 25}" fill="var(--text-primary)" font-size="13" font-weight="600" text-anchor="middle">${sw.id}</text>
                <text x="${x}" y="${y + 45}" fill="var(--text-secondary)" font-size="10" text-anchor="middle">${sw.model}</text>
                <text x="${x}" y="${y + 65}" fill="var(--cisco-blue)" font-size="11" font-weight="600" text-anchor="middle">${sw.speed}</text>
                <text x="${x}" y="${y + 82}" fill="var(--text-muted)" font-size="9" text-anchor="middle">${sw.ports} Ports</text>
                <circle cx="${x}" cy="${y + 98}" r="6" fill="${statusColor}" />
            </g>
        `;
    });

    // Draw Leaf Switches
    svg += `<text x="${width / 2}" y="380" fill="var(--accent-green)" font-size="18" font-weight="600" text-anchor="middle">Leaf Layer (Access) - 400G</text>`;
    leafSwitches.forEach((sw, idx) => {
        const x = leafSpacing * (idx + 1);
        const y = leafY;
        const statusColor = sw.status === 'healthy' ? 'var(--accent-green)' :
                           sw.status === 'warning' ? 'var(--accent-yellow)' : 'var(--accent-red)';

        svg += `
            <g class="topology-switch" onclick="showSwitchInfo('${sw.id}')">
                <rect x="${x - 80}" y="${y}" width="160" height="110"
                      fill="var(--bg-card)" stroke="${statusColor}" stroke-width="3" rx="8" />
                <text x="${x}" y="${y + 25}" fill="var(--text-primary)" font-size="13" font-weight="600" text-anchor="middle">${sw.id}</text>
                <text x="${x}" y="${y + 45}" fill="var(--text-secondary)" font-size="10" text-anchor="middle">${sw.model}</text>
                <text x="${x}" y="${y + 65}" fill="var(--cisco-blue)" font-size="11" font-weight="600" text-anchor="middle">${sw.speed}</text>
                <text x="${x}" y="${y + 82}" fill="var(--text-muted)" font-size="9" text-anchor="middle">${sw.ports} Ports</text>
                <circle cx="${x}" cy="${y + 98}" r="6" fill="${statusColor}" />
            </g>
        `;
    });

    svg += '</svg>';
    container.innerHTML = svg;
}

// Show switch details on click
function showSwitchInfo(switchId) {
    const sw = mockNexusFabric.find(s => s.id === switchId);
    const links = mockFabricLinks.filter(l => l.from === switchId || l.to === switchId);

    const linksHtml = links.map(l => {
        const otherSwitch = l.from === switchId ? l.to : l.from;
        const direction = l.from === switchId ? '→' : '←';
        return `<div>${direction} ${otherSwitch}: ${l.utilization}%</div>`;
    }).join('');

    alert(`Switch: ${sw.id}\nModel: ${sw.model}\nType: ${sw.type}\nPorts: ${sw.ports}\nStatus: ${sw.status}\n\nLink Utilization:\n${links.map(l => {
        const otherSwitch = l.from === switchId ? l.to : l.from;
        const direction = l.from === switchId ? '→' : '←';
        return `${direction} ${otherSwitch}: ${l.utilization}%`;
    }).join('\n')}`);
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

// Load Top 10 Tenants by Revenue
function loadTopTenants() {
    // Sort tenants by current spend (descending) and take top 10
    const sortedTenants = [...mockTenants]
        .sort((a, b) => b.currentSpend - a.currentSpend)
        .slice(0, 10);

    // Calculate total revenue
    const totalRevenue = mockTenants.reduce((sum, t) => sum + t.currentSpend, 0);
    document.getElementById('totalRevenue').textContent =
        `$${totalRevenue.toLocaleString()}`;

    // Populate table
    const topTenantsTable = document.getElementById('topTenantsTable');
    topTenantsTable.innerHTML = sortedTenants.map((tenant, index) => {
        const percentage = ((tenant.currentSpend / totalRevenue) * 100).toFixed(1);
        const spendPercentage = (tenant.currentSpend / tenant.monthlyBudget) * 100;

        // Determine trend
        let trendIcon, trendColor, trendText;
        if (spendPercentage > 95) {
            trendIcon = 'fa-arrow-up';
            trendColor = 'var(--accent-red)';
            trendText = 'High';
        } else if (spendPercentage > 80) {
            trendIcon = 'fa-arrow-up';
            trendColor = 'var(--accent-yellow)';
            trendText = 'Growing';
        } else if (spendPercentage > 60) {
            trendIcon = 'fa-arrow-right';
            trendColor = 'var(--cisco-blue)';
            trendText = 'Stable';
        } else {
            trendIcon = 'fa-arrow-down';
            trendColor = 'var(--accent-green)';
            trendText = 'Low';
        }

        return `
            <tr>
                <td><strong style="color: var(--cisco-blue);">#${index + 1}</strong></td>
                <td>${tenant.name}</td>
                <td><strong>${tenant.allocatedGPUs}</strong> GPUs</td>
                <td>
                    <strong style="color: var(--accent-green); font-size: 1.1rem;">
                        $${tenant.currentSpend.toLocaleString()}
                    </strong>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">
                        of $${tenant.monthlyBudget.toLocaleString()} budget
                    </div>
                </td>
                <td>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <strong style="color: var(--cisco-blue); font-size: 1.05rem;">${percentage}%</strong>
                        <div style="flex: 1; background: var(--bg-tertiary); height: 8px; border-radius: 4px; overflow: hidden;">
                            <div style="width: ${percentage}%; height: 100%; background: linear-gradient(90deg, var(--cisco-blue), var(--accent-green)); transition: width 0.3s;"></div>
                        </div>
                    </div>
                </td>
                <td>
                    <span style="color: ${trendColor}; display: flex; align-items: center; gap: 0.25rem;">
                        <i class="fas ${trendIcon}"></i>
                        ${trendText}
                    </span>
                </td>
            </tr>
        `;
    }).join('');
}

// Load LLM Analytics
function loadLLMAnalytics() {
    // Find most popular by consumption (requests)
    const mostPopular = [...mockLLMStats].sort((a, b) => b.totalRequests - a.totalRequests)[0];
    document.getElementById('mostPopularLLM').innerHTML = `
        <div style="font-size: 1.5rem; font-weight: 700; color: var(--cisco-blue); margin-bottom: 0.5rem;">${mostPopular.model}</div>
        <div style="color: var(--text-secondary); font-size: 0.875rem;">${(mostPopular.totalRequests / 1000000).toFixed(2)}M requests</div>
        <div style="color: var(--text-muted); font-size: 0.75rem; margin-top: 0.25rem;">${mostPopular.provider}</div>
    `;

    // Find highest revenue
    const highestRevenue = [...mockLLMStats].sort((a, b) => b.revenue - a.revenue)[0];
    document.getElementById('highestRevenueLLM').innerHTML = `
        <div style="font-size: 1.5rem; font-weight: 700; color: var(--accent-green); margin-bottom: 0.5rem;">${highestRevenue.model}</div>
        <div style="color: var(--text-secondary); font-size: 0.875rem;">$${highestRevenue.revenue.toLocaleString()}/month</div>
        <div style="color: var(--text-muted); font-size: 0.75rem; margin-top: 0.25rem;">${highestRevenue.provider}</div>
    `;

    // Find best profit margin
    const bestMargin = [...mockLLMStats].sort((a, b) => b.profitMargin - a.profitMargin)[0];
    document.getElementById('bestMarginLLM').innerHTML = `
        <div style="font-size: 1.5rem; font-weight: 700; color: var(--accent-yellow); margin-bottom: 0.5rem;">${bestMargin.model}</div>
        <div style="color: var(--text-secondary); font-size: 0.875rem;">${bestMargin.profitMargin}% margin</div>
        <div style="color: var(--text-muted); font-size: 0.75rem; margin-top: 0.25rem;">${bestMargin.provider}</div>
    `;

    // Load detailed LLM stats table
    const llmStatsTable = document.getElementById('llmStatsTable');
    llmStatsTable.innerHTML = [...mockLLMStats]
        .sort((a, b) => b.revenue - a.revenue)
        .map(llm => {
            const profit = llm.revenue - llm.cost;
            let marginColor = 'var(--accent-green)';
            if (llm.profitMargin < 30) marginColor = 'var(--accent-yellow)';
            if (llm.profitMargin < 20) marginColor = 'var(--accent-red)';

            return `
                <tr>
                    <td><strong>${llm.model}</strong></td>
                    <td style="color: var(--text-muted);">${llm.provider}</td>
                    <td>${(llm.totalRequests / 1000000).toFixed(2)}M</td>
                    <td><strong style="color: var(--accent-green);">$${llm.revenue.toLocaleString()}</strong></td>
                    <td style="color: var(--text-muted);">$${llm.cost.toLocaleString()}</td>
                    <td>
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <strong style="color: ${marginColor};">${llm.profitMargin}%</strong>
                            <div style="flex: 1; background: var(--bg-tertiary); height: 6px; border-radius: 3px; overflow: hidden; max-width: 100px;">
                                <div style="width: ${llm.profitMargin}%; height: 100%; background: ${marginColor};"></div>
                            </div>
                        </div>
                    </td>
                    <td style="color: var(--cisco-blue);">${llm.avgResponseTime}s</td>
                </tr>
            `;
        }).join('');
}

// Load Analytics
function loadAnalytics() {
    // Load LLM Analytics
    loadLLMAnalytics();

    // Load Top 10 Tenants Revenue Table
    loadTopTenants();

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

// Helper function to get spending trend
function getSpendingTrend(tenant) {
    // Calculate trend based on current spending vs budget
    const spendPercentage = (tenant.currentSpend / tenant.monthlyBudget) * 100;
    const projectedSpend = tenant.currentSpend * 1.15; // Simulate 15% growth trend

    let trendIcon, trendColor, trendText;

    if (projectedSpend > tenant.monthlyBudget) {
        trendIcon = 'fa-arrow-up';
        trendColor = 'var(--accent-red)';
        trendText = '+15% ↗️';
    } else if (spendPercentage > 70) {
        trendIcon = 'fa-arrow-up';
        trendColor = 'var(--accent-yellow)';
        trendText = '+8% ↗️';
    } else if (spendPercentage > 50) {
        trendIcon = 'fa-arrow-right';
        trendColor = 'var(--cisco-blue)';
        trendText = 'Stable →';
    } else {
        trendIcon = 'fa-arrow-down';
        trendColor = 'var(--accent-green)';
        trendText = '-5% ↘️';
    }

    return `
        <div style="font-size: 0.7rem; margin-top: 0.25rem; display: flex; align-items: center; gap: 0.25rem; justify-content: center;">
            <i class="fas ${trendIcon}" style="color: ${trendColor}; font-size: 0.6rem;"></i>
            <span style="color: ${trendColor};">${trendText}</span>
        </div>
    `;
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

// Search tenants
let currentFilter = 'all';
function searchTenants(searchTerm) {
    const filtered = mockTenants.filter(tenant => {
        const matchesSearch =
            tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tenant.allocatedGPUs.toString().includes(searchTerm) ||
            tenant.monthlyBudget.toString().includes(searchTerm) ||
            tenant.users.toString().includes(searchTerm);

        const matchesFilter = applyFilter(tenant, currentFilter);

        return matchesSearch && matchesFilter;
    });

    renderFilteredTenants(filtered);
}

// Filter tenants by size
function filterTenants(filter) {
    currentFilter = filter;
    const searchTerm = document.getElementById('tenantSearch').value;
    searchTenants(searchTerm);
}

// Apply filter logic
function applyFilter(tenant, filter) {
    switch(filter) {
        case 'large':
            return tenant.allocatedGPUs >= 100;
        case 'medium':
            return tenant.allocatedGPUs >= 30 && tenant.allocatedGPUs < 100;
        case 'small':
            return tenant.allocatedGPUs < 30;
        case 'all':
        default:
            return true;
    }
}

// Render filtered tenants
function renderFilteredTenants(tenants) {
    const tenantsList = document.getElementById('tenantsList');

    if (tenants.length === 0) {
        tenantsList.innerHTML = `
            <div class="card" style="text-align: center; padding: 3rem;">
                <i class="fas fa-search" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
                <p style="color: var(--text-secondary);">No tenants found matching your search criteria</p>
            </div>
        `;
        return;
    }

    tenantsList.innerHTML = tenants.map(tenant => {
        const enabledServices = tenant.services || [];
        const allServiceIds = mockServices.map(s => s.id);
        const lockedServices = allServiceIds.filter(id => !enabledServices.includes(id));

        return `
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
                    ${getSpendingTrend(tenant)}
                </div>
                <div class="tenant-stat">
                    <div class="tenant-stat-value">$${tenant.monthlyBudget.toLocaleString()}</div>
                    <div class="tenant-stat-label">Budget</div>
                    <div style="font-size: 0.7rem; margin-top: 0.25rem;">
                        <span style="color: ${tenant.currentSpend > tenant.monthlyBudget * 0.8 ? 'var(--accent-red)' : 'var(--accent-green)'};">
                            ${((tenant.currentSpend / tenant.monthlyBudget) * 100).toFixed(0)}% Used
                        </span>
                    </div>
                </div>
                <div class="tenant-stat">
                    <div class="tenant-stat-value">${enabledServices.length}/${allServiceIds.length}</div>
                    <div class="tenant-stat-label">Active Services</div>
                </div>
            </div>

            <!-- Services Status -->
            <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border-primary);">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
                    <h4 style="margin: 0; font-size: 0.9rem; color: var(--text-secondary);">
                        <i class="fas fa-server"></i> Services Access
                    </h4>
                    <div style="display: flex; gap: 1rem; font-size: 0.75rem;">
                        <span style="color: var(--accent-green);">
                            <i class="fas fa-unlock"></i> ${enabledServices.length} Enabled
                        </span>
                        <span style="color: var(--text-muted);">
                            <i class="fas fa-lock"></i> ${lockedServices.length} Locked
                        </span>
                    </div>
                </div>

                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                    ${mockServices.map(service => {
                        const isEnabled = enabledServices.includes(service.id);
                        return `
                            <div style="
                                display: inline-flex;
                                align-items: center;
                                gap: 0.5rem;
                                padding: 0.4rem 0.75rem;
                                background: ${isEnabled ? 'rgba(0, 255, 136, 0.1)' : 'var(--bg-tertiary)'};
                                border: 1px solid ${isEnabled ? 'var(--accent-green)' : 'var(--border-primary)'};
                                border-radius: 6px;
                                font-size: 0.75rem;
                                color: ${isEnabled ? 'var(--accent-green)' : 'var(--text-muted)'};
                            ">
                                <i class="fas fa-${isEnabled ? 'unlock' : 'lock'}" style="font-size: 0.7rem;"></i>
                                <span>${service.icon} ${service.name.replace(' as a Service', '')}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </div>
        `;
    }).join('');
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
