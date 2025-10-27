// Tenant User Dashboard Logic

// Check authentication
if (!sessionStorage.getItem('role') || sessionStorage.getItem('role') !== 'tenant-user') {
    window.location.href = 'index.html';
}

// Mock deployed services for this user
const userDeployedServices = [
    { id: 'deploy-001', serviceId: 'llm', name: 'LLM-Production', status: 'running', uptime: '15 days', cost: '$234' },
    { id: 'deploy-002', serviceId: 'cv', name: 'CV-ImageAnalysis', status: 'running', uptime: '8 days', cost: '$156' }
];

// Service deployment forms for each service type
const serviceDeploymentForms = {
    llm: {
        title: 'Deploy LLM Service',
        fields: [
            { name: 'serviceName', label: 'Service Name', type: 'text', required: true, placeholder: 'e.g., MyLLM-Production' },
            { name: 'model', label: 'Model', type: 'select', required: true, options: [
                { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet' },
                { value: 'claude-3-haiku', label: 'Claude 3 Haiku' },
                { value: 'gpt-4', label: 'GPT-4' },
                { value: 'llama-2-70b', label: 'Llama 2 70B' }
            ]},
            { name: 'region', label: 'Region', type: 'select', required: true, options: [
                { value: 'ap-south-1', label: 'Mumbai (ap-south-1)' },
                { value: 'us-east-1', label: 'N. Virginia (us-east-1)' },
                { value: 'eu-west-1', label: 'Ireland (eu-west-1)' }
            ]},
            { name: 'maxTokens', label: 'Max Tokens', type: 'number', required: true, default: 2000 },
            { name: 'temperature', label: 'Temperature', type: 'range', min: 0, max: 1, step: 0.1, default: 0.7 },
            { name: 'apiKey', label: 'API Key Access', type: 'checkbox', default: true },
            { name: 'rateLimitl', label: 'Rate Limit (requests/minute)', type: 'number', default: 100 }
        ]
    },
    fineTuning: {
        title: 'Deploy Fine-Tuning Service',
        fields: [
            { name: 'serviceName', label: 'Service Name', type: 'text', required: true },
            { name: 'baseModel', label: 'Base Model', type: 'select', required: true, options: [
                { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
                { value: 'claude-instant', label: 'Claude Instant' },
                { value: 'llama-2-13b', label: 'Llama 2 13B' }
            ]},
            { name: 'trainingData', label: 'Training Data (S3 URI)', type: 'text', required: true, placeholder: 's3://bucket/training-data.jsonl' },
            { name: 'validationData', label: 'Validation Data (S3 URI)', type: 'text', placeholder: 's3://bucket/validation-data.jsonl' },
            { name: 'epochs', label: 'Training Epochs', type: 'number', default: 3 },
            { name: 'batchSize', label: 'Batch Size', type: 'number', default: 32 },
            { name: 'learningRate', label: 'Learning Rate', type: 'number', step: 0.0001, default: 0.0001 },
            { name: 'gpuType', label: 'GPU Type', type: 'select', options: [
                { value: 'a100', label: 'NVIDIA A100 (80GB)' },
                { value: 'v100', label: 'NVIDIA V100 (32GB)' },
                { value: 't4', label: 'NVIDIA T4 (16GB)' }
            ]}
        ]
    },
    cv: {
        title: 'Deploy Computer Vision Service',
        fields: [
            { name: 'serviceName', label: 'Service Name', type: 'text', required: true },
            { name: 'task', label: 'CV Task', type: 'select', required: true, options: [
                { value: 'object-detection', label: 'Object Detection' },
                { value: 'image-classification', label: 'Image Classification' },
                { value: 'face-recognition', label: 'Face Recognition' },
                { value: 'ocr', label: 'Optical Character Recognition' },
                { value: 'image-segmentation', label: 'Image Segmentation' }
            ]},
            { name: 'model', label: 'Model', type: 'select', options: [
                { value: 'yolov8', label: 'YOLOv8' },
                { value: 'resnet-50', label: 'ResNet-50' },
                { value: 'efficientnet', label: 'EfficientNet' }
            ]},
            { name: 'inputFormat', label: 'Input Format', type: 'select', options: [
                { value: 'jpeg', label: 'JPEG' },
                { value: 'png', label: 'PNG' },
                { value: 'both', label: 'Both' }
            ]},
            { name: 'resolution', label: 'Max Resolution', type: 'select', options: [
                { value: '1920x1080', label: '1920x1080 (Full HD)' },
                { value: '1280x720', label: '1280x720 (HD)' },
                { value: '640x480', label: '640x480 (SD)' }
            ]},
            { name: 'batchProcessing', label: 'Enable Batch Processing', type: 'checkbox', default: false }
        ]
    },
    byom: {
        title: 'Deploy Your Own Model',
        fields: [
            { name: 'serviceName', label: 'Service Name', type: 'text', required: true },
            { name: 'modelUri', label: 'Model URI (S3/Container)', type: 'text', required: true, placeholder: 's3://bucket/model.tar.gz or ecr://repo/model:v1' },
            { name: 'runtime', label: 'Runtime', type: 'select', required: true, options: [
                { value: 'python-3.10', label: 'Python 3.10' },
                { value: 'python-3.11', label: 'Python 3.11' },
                { value: 'pytorch', label: 'PyTorch' },
                { value: 'tensorflow', label: 'TensorFlow' },
                { value: 'custom-container', label: 'Custom Container' }
            ]},
            { name: 'instanceType', label: 'Instance Type', type: 'select', options: [
                { value: 'gpu-small', label: 'GPU Small (1x T4)' },
                { value: 'gpu-medium', label: 'GPU Medium (1x V100)' },
                { value: 'gpu-large', label: 'GPU Large (1x A100)' }
            ]},
            { name: 'minInstances', label: 'Min Instances', type: 'number', default: 1 },
            { name: 'maxInstances', label: 'Max Instances', type: 'number', default: 5 },
            { name: 'healthCheckPath', label: 'Health Check Path', type: 'text', default: '/health' },
            { name: 'environmentVars', label: 'Environment Variables (JSON)', type: 'textarea', placeholder: '{"KEY": "value"}' }
        ]
    },
    rag: {
        title: 'Deploy RAG Service',
        fields: [
            { name: 'serviceName', label: 'Service Name', type: 'text', required: true },
            { name: 'llmModel', label: 'LLM Model', type: 'select', required: true, options: [
                { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet' },
                { value: 'gpt-4', label: 'GPT-4' },
                { value: 'llama-2-70b', label: 'Llama 2 70B' }
            ]},
            { name: 'embeddingModel', label: 'Embedding Model', type: 'select', options: [
                { value: 'titan-embeddings', label: 'Amazon Titan Embeddings' },
                { value: 'openai-ada-002', label: 'OpenAI Ada-002' }
            ]},
            { name: 'vectorDb', label: 'Vector Database', type: 'select', required: true, options: [
                { value: 'pinecone', label: 'Pinecone' },
                { value: 'weaviate', label: 'Weaviate' },
                { value: 'opensearch', label: 'OpenSearch' }
            ]},
            { name: 'dataSource', label: 'Data Source (S3 URI)', type: 'text', required: true, placeholder: 's3://bucket/documents/' },
            { name: 'chunkSize', label: 'Chunk Size', type: 'number', default: 1000 },
            { name: 'chunkOverlap', label: 'Chunk Overlap', type: 'number', default: 200 },
            { name: 'topK', label: 'Top K Results', type: 'number', default: 5 }
        ]
    },
    agentic: {
        title: 'Deploy Agentic AI Service',
        fields: [
            { name: 'serviceName', label: 'Service Name', type: 'text', required: true },
            { name: 'agentType', label: 'Agent Type', type: 'select', required: true, options: [
                { value: 'conversational', label: 'Conversational Agent' },
                { value: 'task-automation', label: 'Task Automation' },
                { value: 'data-analysis', label: 'Data Analysis' },
                { value: 'code-generation', label: 'Code Generation' }
            ]},
            { name: 'llmModel', label: 'LLM Model', type: 'select', required: true, options: [
                { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet' },
                { value: 'gpt-4', label: 'GPT-4' }
            ]},
            { name: 'tools', label: 'Available Tools', type: 'multiselect', options: [
                { value: 'web-search', label: 'Web Search' },
                { value: 'calculator', label: 'Calculator' },
                { value: 'code-interpreter', label: 'Code Interpreter' },
                { value: 'file-access', label: 'File Access' },
                { value: 'api-calls', label: 'API Calls' }
            ]},
            { name: 'memory', label: 'Enable Memory', type: 'checkbox', default: true },
            { name: 'maxIterations', label: 'Max Iterations', type: 'number', default: 10 },
            { name: 'systemPrompt', label: 'System Prompt', type: 'textarea', placeholder: 'You are a helpful AI assistant...' }
        ]
    },
    buildAI: {
        title: 'Build Your Own AI',
        fields: [
            { name: 'serviceName', label: 'Project Name', type: 'text', required: true },
            { name: 'projectType', label: 'Project Type', type: 'select', required: true, options: [
                { value: 'chatbot', label: 'Chatbot' },
                { value: 'text-classification', label: 'Text Classification' },
                { value: 'sentiment-analysis', label: 'Sentiment Analysis' },
                { value: 'named-entity-recognition', label: 'Named Entity Recognition' },
                { value: 'custom', label: 'Custom AI Solution' }
            ]},
            { name: 'framework', label: 'Framework', type: 'select', options: [
                { value: 'langchain', label: 'LangChain' },
                { value: 'huggingface', label: 'Hugging Face' },
                { value: 'custom', label: 'Custom' }
            ]},
            { name: 'trainingData', label: 'Training Data (S3 URI)', type: 'text', placeholder: 's3://bucket/training/' },
            { name: 'notebook', label: 'Use Jupyter Notebook', type: 'checkbox', default: true },
            { name: 'gitRepo', label: 'Git Repository (optional)', type: 'text', placeholder: 'https://github.com/user/repo' }
        ]
    },
    bareMetal: {
        title: 'Deploy Bare Metal Server',
        fields: [
            { name: 'serviceName', label: 'Server Name', type: 'text', required: true },
            { name: 'serverType', label: 'Server Type', type: 'select', required: true, options: [
                { value: 'ucs-c240-m6', label: 'Cisco UCS C240 M6' },
                { value: 'ucs-c480-m5', label: 'Cisco UCS C480 M5' },
                { value: 'ucs-c220-m6', label: 'Cisco UCS C220 M6' }
            ]},
            { name: 'os', label: 'Operating System', type: 'select', required: true, options: [
                { value: 'ubuntu-22.04', label: 'Ubuntu 22.04 LTS' },
                { value: 'rhel-8', label: 'Red Hat Enterprise Linux 8' },
                { value: 'centos-stream-9', label: 'CentOS Stream 9' },
                { value: 'windows-server-2022', label: 'Windows Server 2022' }
            ]},
            { name: 'gpuCount', label: 'GPU Count', type: 'number', min: 0, max: 8, default: 0 },
            { name: 'gpuType', label: 'GPU Type', type: 'select', options: [
                { value: 'a100', label: 'NVIDIA A100' },
                { value: 'h100', label: 'NVIDIA H100' },
                { value: 'v100', label: 'NVIDIA V100' }
            ]},
            { name: 'storage', label: 'Storage (TB)', type: 'number', default: 1 },
            { name: 'network', label: 'Network Speed', type: 'select', options: [
                { value: '10gbps', label: '10 Gbps' },
                { value: '25gbps', label: '25 Gbps' },
                { value: '100gbps', label: '100 Gbps' }
            ]}
        ]
    },
    gpuVM: {
        title: 'Deploy GPU Virtual Machine',
        fields: [
            { name: 'serviceName', label: 'VM Name', type: 'text', required: true },
            { name: 'instanceType', label: 'Instance Type', type: 'select', required: true, options: [
                { value: 'gpu.t4.medium', label: 'T4 Medium (1 GPU, 8 vCPU, 32 GB RAM)' },
                { value: 'gpu.v100.large', label: 'V100 Large (1 GPU, 16 vCPU, 64 GB RAM)' },
                { value: 'gpu.a100.xlarge', label: 'A100 XLarge (1 GPU, 32 vCPU, 128 GB RAM)' },
                { value: 'gpu.h100.2xlarge', label: 'H100 2XLarge (2 GPU, 64 vCPU, 256 GB RAM)' }
            ]},
            { name: 'os', label: 'Operating System', type: 'select', required: true, options: [
                { value: 'ubuntu-22.04-cuda', label: 'Ubuntu 22.04 + CUDA' },
                { name: 'deep-learning-ami', label: 'Deep Learning AMI' },
                { value: 'pytorch-ami', label: 'PyTorch AMI' },
                { value: 'tensorflow-ami', label: 'TensorFlow AMI' }
            ]},
            { name: 'storage', label: 'Storage (GB)', type: 'number', default: 100 },
            { name: 'autoScaling', label: 'Enable Auto Scaling', type: 'checkbox', default: false },
            { name: 'minInstances', label: 'Min Instances', type: 'number', default: 1 },
            { name: 'maxInstances', label: 'Max Instances', type: 'number', default: 5 }
        ]
    }
};

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

    if (sectionId === 'myServices') {
        loadDeployedServices();
    } else if (sectionId === 'deploy') {
        loadAvailableServices();
    } else if (sectionId === 'usage') {
        loadUsageStats();
    }
}

// Load overview
function loadOverview() {
    const userEmail = sessionStorage.getItem('email') || 'user@example.com';
    document.getElementById('userName').textContent = userEmail.split('@')[0];

    document.getElementById('activeServices').textContent = userDeployedServices.length;
    document.getElementById('usageHours').textContent = '142';
    document.getElementById('monthlyCost').textContent = '$390';

    // Create usage chart
    createUsageChart();

    // Load recent activity
    loadRecentActivity();
}

// Create usage chart
function createUsageChart() {
    const ctx = document.getElementById('usageChart').getContext('2d');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Usage Hours',
                data: [18, 22, 19, 25, 28, 15, 20],
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

// Load recent activity
function loadRecentActivity() {
    const activities = [
        { icon: 'check-circle', text: 'LLM-Production deployed successfully', time: '2 hours ago', color: 'green' },
        { icon: 'sync', text: 'CV-ImageAnalysis restarted', time: '5 hours ago', color: 'blue' },
        { icon: 'upload', text: 'Training data uploaded', time: '1 day ago', color: 'yellow' },
        { icon: 'dollar-sign', text: 'Monthly bill generated: $390', time: '2 days ago', color: 'blue' }
    ];

    document.getElementById('recentActivity').innerHTML = activities.map(activity => `
        <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem 0; border-bottom: 1px solid var(--border-primary);">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: rgba(4, 159, 217, 0.2); display: flex; align-items: center; justify-content: center; color: var(--${activity.color});">
                <i class="fas fa-${activity.icon}"></i>
            </div>
            <div style="flex: 1;">
                <div>${activity.text}</div>
                <div class="text-muted text-sm">${activity.time}</div>
            </div>
        </div>
    `).join('');
}

// Load deployed services
function loadDeployedServices() {
    const grid = document.getElementById('deployedServicesGrid');

    grid.innerHTML = userDeployedServices.map(service => {
        const serviceInfo = mockServices.find(s => s.id === service.serviceId);
        return `
            <div class="card">
                <div style="text-align: center; font-size: 3rem; margin-bottom: 1rem;">${serviceInfo.icon}</div>
                <h4 style="margin-bottom: 0.5rem;">${service.name}</h4>
                <p class="text-muted text-sm">${serviceInfo.name}</p>
                <div style="margin: 1rem 0;">
                    <span class="badge badge-success">
                        <i class="fas fa-circle"></i> ${service.status}
                    </span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.875rem;">
                    <span class="text-muted">Uptime:</span>
                    <strong>${service.uptime}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; font-size: 0.875rem;">
                    <span class="text-muted">Cost:</span>
                    <strong>${service.cost}</strong>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn btn-sm btn-secondary" onclick="manageService('${service.id}')" style="flex: 1;">
                        <i class="fas fa-cog"></i> Manage
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="stopService('${service.id}')">
                        <i class="fas fa-stop"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Load available services
function loadAvailableServices() {
    const grid = document.getElementById('availableServicesGrid');

    grid.innerHTML = mockServices.map(service => `
        <div class="card hover-lift" style="text-align: center; cursor: pointer;" onclick="openDeployModal('${service.id}')">
            <div style="font-size: 3rem; margin-bottom: 1rem;">${service.icon}</div>
            <h4 style="margin-bottom: 0.5rem;">${service.name}</h4>
            <p class="text-muted text-sm" style="margin-bottom: 1rem;">${service.description}</p>
            <p style="margin-bottom: 1rem;"><strong>${service.pricing}</strong></p>
            <button class="btn btn-primary" style="width: 100%;">
                <i class="fas fa-rocket"></i> Deploy
            </button>
        </div>
    `).join('');
}

// Open deploy modal with service-specific form
function openDeployModal(serviceId) {
    const modal = document.getElementById('deployModal');
    const formConfig = serviceDeploymentForms[serviceId];

    if (!formConfig) {
        alert('Deployment form not available for this service');
        return;
    }

    const formHTML = `
        <h4 style="margin-bottom: 1.5rem;">${formConfig.title}</h4>
        <form id="deployForm" onsubmit="deployService(event, '${serviceId}')">
            ${formConfig.fields.map(field => createFormField(field)).join('')}
            <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                <button type="submit" class="btn btn-primary" style="flex: 1;">
                    <i class="fas fa-rocket"></i> Deploy Service
                </button>
                <button type="button" class="btn btn-secondary" onclick="closeModal('deployModal')">
                    Cancel
                </button>
            </div>
        </form>
    `;

    document.getElementById('deployModalContent').innerHTML = formHTML;
    modal.classList.add('active');
}

// Create form field HTML
function createFormField(field) {
    let fieldHTML = '<div class="form-group">';
    fieldHTML += `<label class="form-label">${field.label}${field.required ? ' *' : ''}</label>`;

    switch (field.type) {
        case 'text':
        case 'number':
            fieldHTML += `<input type="${field.type}" class="form-input" name="${field.name}"
                placeholder="${field.placeholder || ''}"
                ${field.required ? 'required' : ''}
                ${field.default ? `value="${field.default}"` : ''}
                ${field.min !== undefined ? `min="${field.min}"` : ''}
                ${field.max !== undefined ? `max="${field.max}"` : ''}
                ${field.step ? `step="${field.step}"` : ''}>`;
            break;

        case 'select':
            fieldHTML += `<select class="form-select" name="${field.name}" ${field.required ? 'required' : ''}>`;
            if (!field.required) {
                fieldHTML += '<option value="">-- Select --</option>';
            }
            field.options.forEach(opt => {
                fieldHTML += `<option value="${opt.value}" ${field.default === opt.value ? 'selected' : ''}>${opt.label}</option>`;
            });
            fieldHTML += '</select>';
            break;

        case 'textarea':
            fieldHTML += `<textarea class="form-textarea" name="${field.name}" rows="4"
                placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''}>${field.default || ''}</textarea>`;
            break;

        case 'checkbox':
            fieldHTML += `<label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                <input type="checkbox" name="${field.name}" ${field.default ? 'checked' : ''}>
                <span>Enable</span>
            </label>`;
            break;

        case 'range':
            fieldHTML += `<div style="display: flex; align-items: center; gap: 1rem;">
                <input type="range" name="${field.name}" min="${field.min}" max="${field.max}"
                    step="${field.step}" value="${field.default}" style="flex: 1;"
                    oninput="this.nextElementSibling.value = this.value">
                <output>${field.default}</output>
            </div>`;
            break;

        case 'multiselect':
            field.options.forEach(opt => {
                fieldHTML += `<label style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; cursor: pointer;">
                    <input type="checkbox" name="${field.name}[]" value="${opt.value}">
                    <span>${opt.label}</span>
                </label>`;
            });
            break;
    }

    fieldHTML += '</div>';
    return fieldHTML;
}

// Deploy service
function deployService(event, serviceId) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {};

    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }

    console.log('Deploying service:', serviceId, data);

    // Simulate deployment
    const newDeployment = {
        id: 'deploy-' + Date.now(),
        serviceId: serviceId,
        name: data.serviceName,
        status: 'deploying',
        uptime: '0 minutes',
        cost: '$0'
    };

    userDeployedServices.push(newDeployment);

    closeModal('deployModal');
    alert(`Deploying ${data.serviceName}...\n\nYour service is being deployed and will be available in a few minutes.`);

    // Switch to My Services section
    showSection('myServices');
}

// Manage service
function manageService(deployId) {
    const service = userDeployedServices.find(s => s.id === deployId);
    alert(`Manage ${service.name}\n\nFeatures:\n- View logs\n- Update configuration\n- Scale resources\n- Monitor metrics\n\n(Coming soon)`);
}

// Stop service
function stopService(deployId) {
    if (confirm('Are you sure you want to stop this service?')) {
        const index = userDeployedServices.findIndex(s => s.id === deployId);
        if (index > -1) {
            userDeployedServices.splice(index, 1);
            loadDeployedServices();
            alert('Service stopped successfully!');
        }
    }
}

// Load usage stats
function loadUsageStats() {
    // Service usage chart
    const serviceCtx = document.getElementById('serviceUsageChart').getContext('2d');
    new Chart(serviceCtx, {
        type: 'bar',
        data: {
            labels: ['LLM', 'CV', 'RAG', 'Fine-Tuning'],
            datasets: [{
                label: 'Hours Used',
                data: [85, 42, 15, 0],
                backgroundColor: '#049FD9'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
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

    // Cost trend chart
    const costCtx = document.getElementById('costTrendChart').getContext('2d');
    new Chart(costCtx, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
                label: 'Weekly Cost ($)',
                data: [85, 92, 105, 108],
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

// Submit support ticket
function submitSupport() {
    const subject = document.getElementById('supportSubject').value;
    const message = document.getElementById('supportMessage').value;

    if (!subject || !message) {
        alert('Please fill in all fields');
        return;
    }

    alert(`Support ticket submitted!\n\nSubject: ${subject}\n\nOur team will respond within 24 hours.`);

    document.getElementById('supportSubject').value = '';
    document.getElementById('supportMessage').value = '';
}

// Close modal
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
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
