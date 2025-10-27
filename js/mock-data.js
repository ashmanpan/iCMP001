// Mock Data for Cisco CMP Portal

// GPU Data - Latest Datacenter Models
const mockGPUs = {
    nvidia: [
        // H200 - Latest NVIDIA GPU (141GB HBM3e)
        { id: 'gpu-001', model: 'H200', memory: '141GB', ucsServer: 'UCS-001', status: 'available', tenant: null },
        { id: 'gpu-002', model: 'H200', memory: '141GB', ucsServer: 'UCS-001', status: 'allocated', tenant: 'tenant-001' },
        { id: 'gpu-003', model: 'H200', memory: '141GB', ucsServer: 'UCS-002', status: 'available', tenant: null },
        { id: 'gpu-004', model: 'H200', memory: '141GB', ucsServer: 'UCS-002', status: 'allocated', tenant: 'tenant-002' },
        { id: 'gpu-005', model: 'H200', memory: '141GB', ucsServer: 'UCS-003', status: 'available', tenant: null },

        // H100 - High-performance AI training (80GB HBM3)
        { id: 'gpu-006', model: 'H100', memory: '80GB', ucsServer: 'UCS-003', status: 'available', tenant: null },
        { id: 'gpu-007', model: 'H100', memory: '80GB', ucsServer: 'UCS-004', status: 'allocated', tenant: 'tenant-001' },
        { id: 'gpu-008', model: 'H100', memory: '80GB', ucsServer: 'UCS-004', status: 'available', tenant: null },
        { id: 'gpu-009', model: 'H100', memory: '80GB', ucsServer: 'UCS-005', status: 'allocated', tenant: 'tenant-002' },
        { id: 'gpu-010', model: 'H100', memory: '80GB', ucsServer: 'UCS-005', status: 'available', tenant: null },
        { id: 'gpu-011', model: 'H100', memory: '80GB', ucsServer: 'UCS-006', status: 'allocated', tenant: 'tenant-003' },
        { id: 'gpu-012', model: 'H100', memory: '80GB', ucsServer: 'UCS-006', status: 'available', tenant: null },

        // B200 - Next-gen Blackwell Architecture
        { id: 'gpu-013', model: 'B200', memory: '192GB', ucsServer: 'UCS-007', status: 'available', tenant: null },
        { id: 'gpu-014', model: 'B200', memory: '192GB', ucsServer: 'UCS-007', status: 'allocated', tenant: 'tenant-001' },
        { id: 'gpu-015', model: 'B200', memory: '192GB', ucsServer: 'UCS-008', status: 'available', tenant: null },

        // A100 - Proven AI workhorse (80GB)
        { id: 'gpu-016', model: 'A100', memory: '80GB', ucsServer: 'UCS-008', status: 'available', tenant: null },
        { id: 'gpu-017', model: 'A100', memory: '80GB', ucsServer: 'UCS-009', status: 'allocated', tenant: 'tenant-002' },
        { id: 'gpu-018', model: 'A100', memory: '80GB', ucsServer: 'UCS-009', status: 'available', tenant: null },
        { id: 'gpu-019', model: 'A100', memory: '80GB', ucsServer: 'UCS-010', status: 'allocated', tenant: 'tenant-003' },
        { id: 'gpu-020', model: 'A100', memory: '80GB', ucsServer: 'UCS-010', status: 'available', tenant: null },
        { id: 'gpu-021', model: 'A100', memory: '80GB', ucsServer: 'UCS-011', status: 'available', tenant: null },
        { id: 'gpu-022', model: 'A100', memory: '80GB', ucsServer: 'UCS-011', status: 'allocated', tenant: 'tenant-001' },
        { id: 'gpu-023', model: 'A100', memory: '80GB', ucsServer: 'UCS-012', status: 'available', tenant: null },

        // L40S - AI Inference optimized (48GB)
        { id: 'gpu-024', model: 'L40S', memory: '48GB', ucsServer: 'UCS-012', status: 'available', tenant: null },
        { id: 'gpu-025', model: 'L40S', memory: '48GB', ucsServer: 'UCS-013', status: 'allocated', tenant: 'tenant-002' },
        { id: 'gpu-026', model: 'L40S', memory: '48GB', ucsServer: 'UCS-013', status: 'available', tenant: null },
        { id: 'gpu-027', model: 'L40S', memory: '48GB', ucsServer: 'UCS-014', status: 'allocated', tenant: 'tenant-003' },

        // L4 - Cost-effective inference (24GB)
        { id: 'gpu-028', model: 'L4', memory: '24GB', ucsServer: 'UCS-014', status: 'available', tenant: null },
        { id: 'gpu-029', model: 'L4', memory: '24GB', ucsServer: 'UCS-015', status: 'allocated', tenant: 'tenant-001' },
        { id: 'gpu-030', model: 'L4', memory: '24GB', ucsServer: 'UCS-015', status: 'available', tenant: null }
    ],
    amd: [
        // MI300X - Latest AMD GPU (192GB HBM3)
        { id: 'gpu-031', model: 'MI300X', memory: '192GB', ucsServer: 'UCS-016', status: 'available', tenant: null },
        { id: 'gpu-032', model: 'MI300X', memory: '192GB', ucsServer: 'UCS-016', status: 'allocated', tenant: 'tenant-001' },
        { id: 'gpu-033', model: 'MI300X', memory: '192GB', ucsServer: 'UCS-017', status: 'available', tenant: null },
        { id: 'gpu-034', model: 'MI300X', memory: '192GB', ucsServer: 'UCS-017', status: 'allocated', tenant: 'tenant-002' },
        { id: 'gpu-035', model: 'MI300X', memory: '192GB', ucsServer: 'UCS-018', status: 'available', tenant: null },

        // MI300A - APU with integrated CPU+GPU (128GB)
        { id: 'gpu-036', model: 'MI300A', memory: '128GB', ucsServer: 'UCS-018', status: 'available', tenant: null },
        { id: 'gpu-037', model: 'MI300A', memory: '128GB', ucsServer: 'UCS-019', status: 'allocated', tenant: 'tenant-003' },
        { id: 'gpu-038', model: 'MI300A', memory: '128GB', ucsServer: 'UCS-019', status: 'available', tenant: null },

        // MI250X - Dual-GPU package (128GB per package)
        { id: 'gpu-039', model: 'MI250X', memory: '128GB', ucsServer: 'UCS-020', status: 'available', tenant: null },
        { id: 'gpu-040', model: 'MI250X', memory: '128GB', ucsServer: 'UCS-020', status: 'allocated', tenant: 'tenant-001' },
        { id: 'gpu-041', model: 'MI250X', memory: '128GB', ucsServer: 'UCS-021', status: 'available', tenant: null },
        { id: 'gpu-042', model: 'MI250X', memory: '128GB', ucsServer: 'UCS-021', status: 'allocated', tenant: 'tenant-002' },

        // MI210 - Previous generation (64GB)
        { id: 'gpu-043', model: 'MI210', memory: '64GB', ucsServer: 'UCS-022', status: 'available', tenant: null },
        { id: 'gpu-044', model: 'MI210', memory: '64GB', ucsServer: 'UCS-022', status: 'maintenance', tenant: null },
        { id: 'gpu-045', model: 'MI210', memory: '64GB', ucsServer: 'UCS-023', status: 'available', tenant: null }
    ]
};

// UCS GPU Servers - AI-Optimized Models
const mockUCSServers = [
    // UCS C225 M8 - Up to 3 GPUs (1RU, single socket)
    { id: 'UCS-001', name: 'UCS-C225-M8', rack: 'Rack-1', nexusSwitch: 'Nexus-9332D-GX2B-01', status: 'online', gpuCount: 2, gpuModel: 'NVIDIA H100 NVL' },
    { id: 'UCS-002', name: 'UCS-C225-M8', rack: 'Rack-1', nexusSwitch: 'Nexus-9332D-GX2B-01', status: 'online', gpuCount: 3, gpuModel: 'NVIDIA L40S' },

    // UCS C845A M8 - 2-8 GPUs (AI Inference Optimized)
    { id: 'UCS-003', name: 'UCS-C845A-M8', rack: 'Rack-2', nexusSwitch: 'Nexus-9332D-GX2B-02', status: 'online', gpuCount: 4, gpuModel: 'NVIDIA H200 NVL' },
    { id: 'UCS-004', name: 'UCS-C845A-M8', rack: 'Rack-2', nexusSwitch: 'Nexus-9332D-GX2B-02', status: 'online', gpuCount: 8, gpuModel: 'NVIDIA H100 NVL' },
    { id: 'UCS-005', name: 'UCS-C845A-M8', rack: 'Rack-3', nexusSwitch: 'Nexus-9332D-GX2B-01', status: 'online', gpuCount: 2, gpuModel: 'AMD MI210' },

    // UCS C885A M8 - 8 GPUs (AI Training Optimized)
    { id: 'UCS-006', name: 'UCS-C885A-M8', rack: 'Rack-3', nexusSwitch: 'Nexus-9332D-GX2B-02', status: 'online', gpuCount: 8, gpuModel: 'NVIDIA H200' },
    { id: 'UCS-007', name: 'UCS-C885A-M8', rack: 'Rack-4', nexusSwitch: 'Nexus-9332D-GX2B-02', status: 'maintenance', gpuCount: 8, gpuModel: 'AMD MI300X' }
];

// Nexus Fabric - AI-Optimized Spine-Leaf Architecture
const mockNexusFabric = [
    // Spine Switches (Core Layer) - 800G/400G for AI Workloads
    { id: 'Nexus-9364E-SG2-01', model: 'Nexus 9364E-SG2', type: 'Spine', ports: 64, speed: '800G', connectedServers: 2, status: 'healthy' },
    { id: 'Nexus-9364E-SG2-02', model: 'Nexus 9364E-SG2', type: 'Spine', ports: 64, speed: '800G', connectedServers: 1, status: 'warning' },

    // Leaf Switches (Access Layer) - 400G for GPU Connectivity
    { id: 'Nexus-9332D-GX2B-01', model: 'Nexus 9332D-GX2B', type: 'Leaf', ports: 32, speed: '400G', connectedServers: 2, status: 'healthy' },
    { id: 'Nexus-9332D-GX2B-02', model: 'Nexus 9332D-GX2B', type: 'Leaf', ports: 32, speed: '400G', connectedServers: 2, status: 'healthy' }
];

// Link Utilization between Spine and Leaf Switches (in %)
const mockFabricLinks = [
    { from: 'Nexus-9332D-GX2B-01', to: 'Nexus-9364E-SG2-01', utilization: 45, status: 'healthy' },
    { from: 'Nexus-9332D-GX2B-01', to: 'Nexus-9364E-SG2-02', utilization: 72, status: 'warning' },
    { from: 'Nexus-9332D-GX2B-02', to: 'Nexus-9364E-SG2-01', utilization: 38, status: 'healthy' },
    { from: 'Nexus-9332D-GX2B-02', to: 'Nexus-9364E-SG2-02', utilization: 28, status: 'healthy' }
];

// Tenants - 10 total with varying GPU allocations
const mockTenants = [
    {
        id: 'tenant-001',
        name: 'TechCorp AI Division',
        status: 'active',
        created: '2024-01-15',
        allocatedGPUs: 45,
        consumptionRate: 85.5,
        services: ['llm', 'fineTuning', 'cv', 'rag', 'agentic'],
        users: 85,
        monthlyBudget: 280000,
        currentSpend: 239200
    },
    {
        id: 'tenant-002',
        name: 'Global Bank Analytics',
        status: 'active',
        created: '2023-11-20',
        allocatedGPUs: 120,
        consumptionRate: 92.7,
        services: ['llm', 'rag', 'byom', 'fineTuning', 'buildAI'],
        users: 240,
        monthlyBudget: 750000,
        currentSpend: 695250
    },
    {
        id: 'tenant-003',
        name: 'HealthTech Research Institute',
        status: 'active',
        created: '2024-03-05',
        allocatedGPUs: 35,
        consumptionRate: 68.4,
        services: ['cv', 'agentic', 'llm', 'rag'],
        users: 65,
        monthlyBudget: 220000,
        currentSpend: 150480
    },
    {
        id: 'tenant-004',
        name: 'RetailAI Corporation',
        status: 'active',
        created: '2024-02-14',
        allocatedGPUs: 28,
        consumptionRate: 74.2,
        services: ['cv', 'llm', 'rag'],
        users: 42,
        monthlyBudget: 175000,
        currentSpend: 129850
    },
    {
        id: 'tenant-005',
        name: 'AutoDrive Technologies',
        status: 'active',
        created: '2023-09-10',
        allocatedGPUs: 180,
        consumptionRate: 95.8,
        services: ['cv', 'llm', 'fineTuning', 'byom', 'agentic', 'buildAI', 'rag', 'bareMetal'],
        users: 320,
        monthlyBudget: 1200000,
        currentSpend: 1149600
    },
    {
        id: 'tenant-006',
        name: 'PharmaTech AI Labs',
        status: 'active',
        created: '2024-01-08',
        allocatedGPUs: 55,
        consumptionRate: 81.5,
        services: ['llm', 'fineTuning', 'rag', 'agentic', 'byom'],
        users: 125,
        monthlyBudget: 340000,
        currentSpend: 277100
    },
    {
        id: 'tenant-007',
        name: 'MediaStream Analytics',
        status: 'active',
        created: '2024-04-02',
        allocatedGPUs: 22,
        consumptionRate: 56.3,
        services: ['cv', 'llm'],
        users: 28,
        monthlyBudget: 140000,
        currentSpend: 78820
    },
    {
        id: 'tenant-008',
        name: 'SecurityAI Systems',
        status: 'active',
        created: '2023-12-15',
        allocatedGPUs: 65,
        consumptionRate: 88.9,
        services: ['cv', 'agentic', 'llm', 'fineTuning', 'rag'],
        users: 95,
        monthlyBudget: 410000,
        currentSpend: 364490
    },
    {
        id: 'tenant-009',
        name: 'CloudNative Startup Hub',
        status: 'active',
        created: '2024-05-20',
        allocatedGPUs: 18,
        consumptionRate: 42.7,
        services: ['llm', 'buildAI'],
        users: 15,
        monthlyBudget: 95000,
        currentSpend: 40565
    },
    {
        id: 'tenant-010',
        name: 'Enterprise AI Platform',
        status: 'active',
        created: '2023-08-05',
        allocatedGPUs: 200,
        consumptionRate: 97.2,
        services: ['llm', 'fineTuning', 'cv', 'rag', 'agentic', 'byom', 'buildAI', 'bareMetal', 'gpuVM'],
        users: 450,
        monthlyBudget: 1500000,
        currentSpend: 1458000
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
