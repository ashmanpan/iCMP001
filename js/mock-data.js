// Mock Data for Cisco CMP Portal

// GPU Data
const mockGPUs = {
    nvidia: [
        { id: 'gpu-001', model: 'A100', memory: '80GB', ucsServer: 'UCS-001', status: 'available', tenant: null },
        { id: 'gpu-002', model: 'A100', memory: '80GB', ucsServer: 'UCS-001', status: 'allocated', tenant: 'tenant-001' },
        { id: 'gpu-003', model: 'H100', memory: '80GB', ucsServer: 'UCS-002', status: 'available', tenant: null },
        { id: 'gpu-004', model: 'H100', memory: '80GB', ucsServer: 'UCS-002', status: 'allocated', tenant: 'tenant-002' },
        { id: 'gpu-005', model: 'V100', memory: '32GB', ucsServer: 'UCS-003', status: 'available', tenant: null },
        { id: 'gpu-006', model: 'V100', memory: '32GB', ucsServer: 'UCS-003', status: 'allocated', tenant: 'tenant-001' },
        { id: 'gpu-007', model: 'T4', memory: '16GB', ucsServer: 'UCS-004', status: 'available', tenant: null },
        { id: 'gpu-008', model: 'T4', memory: '16GB', ucsServer: 'UCS-004', status: 'in-use', tenant: 'tenant-003' },
        { id: 'gpu-009', model: 'A100', memory: '40GB', ucsServer: 'UCS-005', status: 'available', tenant: null },
        { id: 'gpu-010', model: 'A100', memory: '40GB', ucsServer: 'UCS-005', status: 'allocated', tenant: 'tenant-002' }
    ],
    amd: [
        { id: 'gpu-011', model: 'MI250X', memory: '128GB', ucsServer: 'UCS-006', status: 'available', tenant: null },
        { id: 'gpu-012', model: 'MI250X', memory: '128GB', ucsServer: 'UCS-006', status: 'allocated', tenant: 'tenant-001' },
        { id: 'gpu-013', model: 'MI210', memory: '64GB', ucsServer: 'UCS-007', status: 'available', tenant: null },
        { id: 'gpu-014', model: 'MI210', memory: '64GB', ucsServer: 'UCS-007', status: 'maintenance', tenant: null }
    ]
};

// UCS Servers
const mockUCSServers = [
    { id: 'UCS-001', name: 'UCS-C240-M6', rack: 'Rack-1', nexusSwitch: 'Nexus-9K-01', status: 'online', gpuCount: 2 },
    { id: 'UCS-002', name: 'UCS-C480-M5', rack: 'Rack-1', nexusSwitch: 'Nexus-9K-01', status: 'online', gpuCount: 2 },
    { id: 'UCS-003', name: 'UCS-C240-M6', rack: 'Rack-2', nexusSwitch: 'Nexus-9K-02', status: 'online', gpuCount: 2 },
    { id: 'UCS-004', name: 'UCS-C220-M6', rack: 'Rack-2', nexusSwitch: 'Nexus-9K-02', status: 'online', gpuCount: 2 },
    { id: 'UCS-005', name: 'UCS-C480-M5', rack: 'Rack-3', nexusSwitch: 'Nexus-9K-03', status: 'online', gpuCount: 2 },
    { id: 'UCS-006', name: 'UCS-C240-M6', rack: 'Rack-3', nexusSwitch: 'Nexus-9K-03', status: 'online', gpuCount: 2 },
    { id: 'UCS-007', name: 'UCS-C220-M6', rack: 'Rack-4', nexusSwitch: 'Nexus-9K-04', status: 'maintenance', gpuCount: 2 }
];

// Nexus Fabric
const mockNexusFabric = [
    { id: 'Nexus-9K-01', model: 'Nexus 9336C-FX2', ports: 36, connectedServers: 2, status: 'healthy' },
    { id: 'Nexus-9K-02', model: 'Nexus 9364C', ports: 64, connectedServers: 2, status: 'healthy' },
    { id: 'Nexus-9K-03', model: 'Nexus 9336C-FX2', ports: 36, connectedServers: 2, status: 'healthy' },
    { id: 'Nexus-9K-04', model: 'Nexus 9364C', ports: 64, connectedServers: 1, status: 'warning' }
];

// Tenants
const mockTenants = [
    {
        id: 'tenant-001',
        name: 'TechCorp AI Division',
        status: 'active',
        created: '2024-01-15',
        allocatedGPUs: 3,
        consumptionRate: 85.5,
        services: ['llm', 'fineTuning', 'cv'],
        users: 15,
        monthlyBudget: 50000,
        currentSpend: 42500
    },
    {
        id: 'tenant-002',
        name: 'FinanceAI Solutions',
        status: 'active',
        created: '2024-02-10',
        allocatedGPUs: 2,
        consumptionRate: 72.3,
        services: ['llm', 'rag', 'byom'],
        users: 8,
        monthlyBudget: 35000,
        currentSpend: 25300
    },
    {
        id: 'tenant-003',
        name: 'HealthTech Research',
        status: 'active',
        created: '2024-03-05',
        allocatedGPUs: 1,
        consumptionRate: 45.8,
        services: ['cv', 'agentic'],
        users: 5,
        monthlyBudget: 20000,
        currentSpend: 9160
    }
];

// AI Services
const mockServices = [
    {
        id: 'llm',
        name: 'LLM as a Service',
        description: 'Deploy and manage Large Language Models',
        icon: '🤖',
        category: 'AI',
        pricing: '$0.50/hour',
        enabled: true
    },
    {
        id: 'fineTuning',
        name: 'Fine-Tuning as a Service',
        description: 'Fine-tune models with your custom data',
        icon: '⚙️',
        category: 'AI',
        pricing: '$1.20/hour',
        enabled: true
    },
    {
        id: 'cv',
        name: 'Computer Vision as a Service',
        description: 'Image and video processing with AI',
        icon: '👁️',
        category: 'AI',
        pricing: '$0.80/hour',
        enabled: true
    },
    {
        id: 'byom',
        name: 'Bring Your Own Model',
        description: 'Deploy your custom trained models',
        icon: '📦',
        category: 'AI',
        pricing: '$0.40/hour',
        enabled: true
    },
    {
        id: 'rag',
        name: 'RAG as a Service',
        description: 'Retrieval Augmented Generation',
        icon: '🔍',
        category: 'AI',
        pricing: '$0.90/hour',
        enabled: true
    },
    {
        id: 'agentic',
        name: 'Agentic AI as a Service',
        description: 'Deploy autonomous AI agents',
        icon: '🤝',
        category: 'AI',
        pricing: '$1.50/hour',
        enabled: true
    },
    {
        id: 'buildAI',
        name: 'Build Your Own AI',
        description: 'Create custom AI solutions',
        icon: '🛠️',
        category: 'AI',
        pricing: '$2.00/hour',
        enabled: true
    },
    {
        id: 'bareMetal',
        name: 'Bare Metal as a Service',
        description: 'Dedicated physical servers',
        icon: '🖥️',
        category: 'Infrastructure',
        pricing: '$3.50/hour',
        enabled: true
    },
    {
        id: 'gpuVM',
        name: 'GPU VM as a Service',
        description: 'Virtual machines with GPU acceleration',
        icon: '💻',
        category: 'Infrastructure',
        pricing: '$2.20/hour',
        enabled: true
    }
];

// Consumption Data (for charts)
const mockConsumptionData = [
    { month: 'Jan', consumption: 65 },
    { month: 'Feb', consumption: 72 },
    { month: 'Mar', consumption: 68 },
    { month: 'Apr', consumption: 78 },
    { month: 'May', consumption: 85 },
    { month: 'Jun', consumption: 82 },
    { month: 'Jul', consumption: 88 },
    { month: 'Aug', consumption: 92 },
    { month: 'Sep', consumption: 90 },
    { month: 'Oct', consumption: 95 }
];

// Logs
const mockLogs = [
    { timestamp: '2024-10-28 10:30:15', tenant: 'tenant-001', action: 'GPU Allocated', gpu: 'gpu-002', user: 'admin@techcorp.com' },
    { timestamp: '2024-10-28 10:25:42', tenant: 'tenant-002', action: 'Service Deployed', service: 'llm', user: 'user@financeai.com' },
    { timestamp: '2024-10-28 10:20:33', tenant: 'tenant-003', action: 'User Added', username: 'newuser@healthtech.com', user: 'admin@healthtech.com' },
    { timestamp: '2024-10-28 10:15:18', tenant: 'tenant-001', action: 'Service Enabled', service: 'fineTuning', user: 'admin@techcorp.com' },
    { timestamp: '2024-10-28 10:10:05', tenant: 'tenant-002', action: 'GPU Allocated', gpu: 'gpu-004', user: 'admin@financeai.com' }
];

// Helper functions
function getAllGPUs() {
    return [...mockGPUs.nvidia, ...mockGPUs.amd];
}

function getAvailableGPUs() {
    return getAllGPUs().filter(gpu => gpu.status === 'available');
}

function getAllocatedGPUs() {
    return getAllGPUs().filter(gpu => gpu.status === 'allocated' || gpu.status === 'in-use');
}

function getGPUsByTenant(tenantId) {
    return getAllGPUs().filter(gpu => gpu.tenant === tenantId);
}

function getTenantById(tenantId) {
    return mockTenants.find(t => t.id === tenantId);
}

function getServiceById(serviceId) {
    return mockServices.find(s => s.id === serviceId);
}
