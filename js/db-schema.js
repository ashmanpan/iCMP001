/**
 * Cisco CMP Portal - Database Schema Definitions
 * Complete schema structure for all service deployments
 */

// ============================================
// 1. LLM AS A SERVICE - Deployed Instances
// ============================================
const llmServiceSchema = {
    tableName: 'deployed_llm_services',
    description: 'Stores LLM service deployment instances',
    primaryKey: 'deploymentId',
    indexes: ['tenantId', 'userId', 'status', 'createdAt'],
    schema: {
        // Identity & Ownership
        deploymentId: { type: 'string', required: true, unique: true },
        tenantId: { type: 'string', required: true, indexed: true },
        userId: { type: 'string', required: true, indexed: true },
        userName: { type: 'string', required: true },

        // Service Configuration
        serviceName: { type: 'string', required: true },
        modelProvider: { type: 'string', required: true, enum: ['openai', 'anthropic', 'google', 'meta', 'mistral', 'cohere'] },
        modelName: { type: 'string', required: true },
        modelVersion: { type: 'string', required: false },

        // Resource Allocation
        gpuType: { type: 'string', required: true, enum: ['T4', 'L4', 'A100-40GB', 'A100-80GB', 'H100'] },
        gpuCount: { type: 'integer', required: true, min: 1, max: 8 },
        cpuCores: { type: 'integer', required: true },
        memoryGB: { type: 'integer', required: true },
        storageGB: { type: 'integer', required: true },

        // Scaling Configuration
        autoScalingEnabled: { type: 'boolean', default: false },
        minReplicas: { type: 'integer', default: 1 },
        maxReplicas: { type: 'integer', default: 10 },
        targetConcurrency: { type: 'integer', default: 100 },

        // API Configuration
        apiEndpoint: { type: 'string', required: true },
        apiKey: { type: 'string', required: true, encrypted: true },
        apiProtocol: { type: 'string', default: 'https' },
        rateLimitPerMin: { type: 'integer', default: 1000 },

        // Model Parameters
        maxTokens: { type: 'integer', default: 2048 },
        temperature: { type: 'float', default: 0.7, min: 0, max: 2 },
        topP: { type: 'float', default: 1.0, min: 0, max: 1 },
        frequencyPenalty: { type: 'float', default: 0, min: -2, max: 2 },
        presencePenalty: { type: 'float', default: 0, min: -2, max: 2 },

        // Features
        streamingEnabled: { type: 'boolean', default: true },
        functionCallingEnabled: { type: 'boolean', default: false },
        visionEnabled: { type: 'boolean', default: false },

        // Operational Status
        status: { type: 'string', required: true, enum: ['provisioning', 'active', 'stopped', 'failed', 'terminated'] },
        healthStatus: { type: 'string', enum: ['healthy', 'degraded', 'unhealthy'] },
        lastHealthCheck: { type: 'timestamp' },

        // Usage Metrics
        totalRequests: { type: 'bigint', default: 0 },
        totalTokensIn: { type: 'bigint', default: 0 },
        totalTokensOut: { type: 'bigint', default: 0 },
        totalCost: { type: 'decimal', default: 0.00 },

        // Billing
        billingPlan: { type: 'string', enum: ['pay-per-use', 'hourly', 'monthly'] },
        hourlyRate: { type: 'decimal' },
        monthlyBudget: { type: 'decimal' },
        alertThreshold: { type: 'integer', default: 80 },

        // Timestamps
        createdAt: { type: 'timestamp', required: true },
        updatedAt: { type: 'timestamp', required: true },
        startedAt: { type: 'timestamp' },
        terminatedAt: { type: 'timestamp' }
    }
};

// ============================================
// 2. FINE-TUNING AS A SERVICE - Jobs
// ============================================
const fineTuningJobSchema = {
    tableName: 'deployed_finetuning_jobs',
    description: 'Stores fine-tuning job records',
    primaryKey: 'jobId',
    indexes: ['tenantId', 'userId', 'status', 'baseModel', 'createdAt'],
    schema: {
        // Identity & Ownership
        jobId: { type: 'string', required: true, unique: true },
        tenantId: { type: 'string', required: true, indexed: true },
        userId: { type: 'string', required: true, indexed: true },
        userName: { type: 'string', required: true },

        // Job Configuration
        jobName: { type: 'string', required: true },
        baseModel: { type: 'string', required: true, enum: ['gpt-3.5-turbo', 'gpt-4', 'llama-2-7b', 'llama-2-13b', 'llama-2-70b', 'mistral-7b', 'mixtral-8x7b'] },
        taskType: { type: 'string', required: true, enum: ['instruction-following', 'chat', 'completion', 'classification', 'summarization', 'translation', 'custom'] },

        // Dataset Configuration
        datasetSource: { type: 'string', required: true, enum: ['upload', 's3', 'gcs', 'azure', 'minio', 'url'] },
        datasetPath: { type: 'string', required: true },
        datasetFormat: { type: 'string', required: true, enum: ['jsonl', 'csv', 'parquet', 'txt'] },
        datasetSize: { type: 'bigint' },
        trainingExamples: { type: 'integer' },
        validationExamples: { type: 'integer' },
        validationSplit: { type: 'float', default: 0.1 },

        // Training Configuration
        epochs: { type: 'integer', required: true, default: 3, min: 1, max: 100 },
        batchSize: { type: 'integer', default: 8 },
        learningRate: { type: 'float', default: 0.0001 },
        warmupSteps: { type: 'integer', default: 100 },
        weightDecay: { type: 'float', default: 0.01 },
        optimizer: { type: 'string', default: 'adamw', enum: ['adamw', 'adam', 'sgd', 'adafactor'] },
        scheduler: { type: 'string', default: 'linear', enum: ['linear', 'cosine', 'constant', 'polynomial'] },

        // Resource Allocation
        gpuType: { type: 'string', required: true, enum: ['T4', 'L4', 'A100-40GB', 'A100-80GB', 'H100'] },
        gpuCount: { type: 'integer', required: true, min: 1, max: 8 },
        estimatedDuration: { type: 'integer' }, // minutes

        // Advanced Options
        loraEnabled: { type: 'boolean', default: true },
        loraRank: { type: 'integer', default: 8 },
        loraAlpha: { type: 'integer', default: 16 },
        quantization: { type: 'string', enum: ['none', 'int8', 'int4', 'nf4'] },
        gradientCheckpointing: { type: 'boolean', default: true },
        mixedPrecision: { type: 'string', default: 'fp16', enum: ['no', 'fp16', 'bf16'] },

        // Output Configuration
        outputModel: { type: 'string', required: true },
        outputPath: { type: 'string', required: true },
        checkpointStrategy: { type: 'string', default: 'epoch', enum: ['no', 'epoch', 'steps'] },
        checkpointSteps: { type: 'integer', default: 500 },
        saveTotal: { type: 'integer', default: 3 },

        // Job Status
        status: { type: 'string', required: true, enum: ['queued', 'preparing', 'running', 'completed', 'failed', 'cancelled'] },
        progress: { type: 'integer', default: 0, min: 0, max: 100 },
        currentEpoch: { type: 'integer', default: 0 },
        currentStep: { type: 'integer', default: 0 },

        // Training Metrics
        trainingLoss: { type: 'float' },
        validationLoss: { type: 'float' },
        accuracy: { type: 'float' },
        perplexity: { type: 'float' },

        // Logs & Monitoring
        logsPath: { type: 'string' },
        tensorboardUrl: { type: 'string' },
        mlflowRunId: { type: 'string' },

        // Billing
        estimatedCost: { type: 'decimal' },
        actualCost: { type: 'decimal' },

        // Timestamps
        createdAt: { type: 'timestamp', required: true },
        updatedAt: { type: 'timestamp', required: true },
        startedAt: { type: 'timestamp' },
        completedAt: { type: 'timestamp' }
    }
};

// ============================================
// 3. COMPUTER VISION AS A SERVICE
// ============================================
const cvServiceSchema = {
    tableName: 'deployed_cv_services',
    description: 'Computer Vision service deployments',
    primaryKey: 'deploymentId',
    indexes: ['tenantId', 'userId', 'status', 'taskType'],
    schema: {
        // Identity & Ownership
        deploymentId: { type: 'string', required: true, unique: true },
        tenantId: { type: 'string', required: true, indexed: true },
        userId: { type: 'string', required: true, indexed: true },
        userName: { type: 'string', required: true },

        // Service Configuration
        serviceName: { type: 'string', required: true },
        taskType: { type: 'string', required: true, enum: ['object-detection', 'classification', 'segmentation', 'face-recognition', 'ocr', 'pose-estimation', 'video-analysis', 'custom'] },
        modelProvider: { type: 'string', required: true, enum: ['yolo', 'detectron2', 'tensorflow', 'pytorch', 'opencv', 'custom'] },
        modelName: { type: 'string', required: true },

        // Input Configuration
        inputSource: { type: 'string', required: true, enum: ['upload', 'rtsp', 's3', 'gcs', 'azure', 'url', 'webcam'] },
        inputFormat: { type: 'string', enum: ['image', 'video', 'stream'] },
        supportedFormats: { type: 'array', items: 'string' },
        maxResolution: { type: 'string', default: '1920x1080' },
        fps: { type: 'integer', default: 30 },

        // Processing Configuration
        batchProcessing: { type: 'boolean', default: false },
        batchSize: { type: 'integer', default: 1 },
        confidenceThreshold: { type: 'float', default: 0.5, min: 0, max: 1 },
        nmsThreshold: { type: 'float', default: 0.45, min: 0, max: 1 },

        // Resource Allocation
        gpuType: { type: 'string', required: true, enum: ['T4', 'L4', 'A100-40GB'] },
        gpuCount: { type: 'integer', required: true, default: 1 },
        cpuCores: { type: 'integer', required: true },
        memoryGB: { type: 'integer', required: true },

        // Scaling & Performance
        autoScalingEnabled: { type: 'boolean', default: false },
        minReplicas: { type: 'integer', default: 1 },
        maxReplicas: { type: 'integer', default: 5 },
        maxConcurrentRequests: { type: 'integer', default: 10 },

        // API Configuration
        apiEndpoint: { type: 'string', required: true },
        apiKey: { type: 'string', required: true, encrypted: true },
        webhookUrl: { type: 'string' },

        // Output Configuration
        outputFormat: { type: 'string', default: 'json', enum: ['json', 'xml', 'csv'] },
        includeVisualization: { type: 'boolean', default: true },
        saveResults: { type: 'boolean', default: true },
        outputPath: { type: 'string' },

        // Operational Status
        status: { type: 'string', required: true, enum: ['provisioning', 'active', 'stopped', 'failed', 'terminated'] },
        healthStatus: { type: 'string', enum: ['healthy', 'degraded', 'unhealthy'] },

        // Usage Metrics
        totalRequests: { type: 'bigint', default: 0 },
        totalFramesProcessed: { type: 'bigint', default: 0 },
        totalObjectsDetected: { type: 'bigint', default: 0 },
        avgProcessingTime: { type: 'float' },
        totalCost: { type: 'decimal', default: 0.00 },

        // Billing
        billingPlan: { type: 'string', enum: ['pay-per-request', 'hourly', 'monthly'] },
        hourlyRate: { type: 'decimal' },

        // Timestamps
        createdAt: { type: 'timestamp', required: true },
        updatedAt: { type: 'timestamp', required: true },
        startedAt: { type: 'timestamp' },
        terminatedAt: { type: 'timestamp' }
    }
};

// ============================================
// 4. BYOM (BRING YOUR OWN MODEL)
// ============================================
const byomServiceSchema = {
    tableName: 'deployed_byom_services',
    description: 'Custom model deployment instances',
    primaryKey: 'deploymentId',
    indexes: ['tenantId', 'userId', 'status', 'framework'],
    schema: {
        // Identity & Ownership
        deploymentId: { type: 'string', required: true, unique: true },
        tenantId: { type: 'string', required: true, indexed: true },
        userId: { type: 'string', required: true, indexed: true },
        userName: { type: 'string', required: true },

        // Service Configuration
        serviceName: { type: 'string', required: true },
        description: { type: 'text' },
        framework: { type: 'string', required: true, enum: ['pytorch', 'tensorflow', 'onnx', 'huggingface', 'scikit-learn', 'xgboost', 'lightgbm', 'custom'] },

        // Model Source
        modelSource: { type: 'string', required: true, enum: ['upload', 's3', 'gcs', 'azure', 'huggingface', 'github', 'docker'] },
        modelPath: { type: 'string', required: true },
        modelSize: { type: 'bigint' },
        modelFormat: { type: 'string', enum: ['pytorch', 'onnx', 'tensorflow', 'pickle', 'joblib', 'h5', 'savedmodel'] },

        // Container Configuration
        dockerImage: { type: 'string' },
        dockerTag: { type: 'string', default: 'latest' },
        customDockerfile: { type: 'text' },

        // Inference Configuration
        inferenceType: { type: 'string', required: true, enum: ['rest-api', 'grpc', 'websocket', 'batch'] },
        inputSchema: { type: 'json' },
        outputSchema: { type: 'json' },

        // Resource Allocation
        computeType: { type: 'string', required: true, enum: ['cpu-only', '1xT4', '1xL4', '2xL4', '1xA100', '2xA100', '1xH100', '2xH100'] },
        cpuCores: { type: 'integer', required: true },
        memoryGB: { type: 'integer', required: true },
        storageGB: { type: 'integer', required: true },

        // Scaling Configuration
        autoScalingEnabled: { type: 'boolean', default: false },
        minReplicas: { type: 'integer', default: 1 },
        maxReplicas: { type: 'integer', default: 10 },
        targetLatency: { type: 'integer', default: 100 }, // ms

        // API Configuration
        apiEndpoint: { type: 'string', required: true },
        apiKey: { type: 'string', required: true, encrypted: true },
        apiVersion: { type: 'string', default: 'v1' },

        // Health & Monitoring
        healthCheckPath: { type: 'string', default: '/health' },
        healthCheckInterval: { type: 'integer', default: 30 }, // seconds
        metricsPath: { type: 'string', default: '/metrics' },

        // Environment Variables
        environmentVariables: { type: 'json' },
        secrets: { type: 'json', encrypted: true },

        // Dependencies
        requirements: { type: 'text' },
        systemPackages: { type: 'array', items: 'string' },

        // Operational Status
        status: { type: 'string', required: true, enum: ['building', 'provisioning', 'active', 'stopped', 'failed', 'terminated'] },
        healthStatus: { type: 'string', enum: ['healthy', 'degraded', 'unhealthy'] },
        buildLogs: { type: 'text' },

        // Usage Metrics
        totalRequests: { type: 'bigint', default: 0 },
        avgLatency: { type: 'float' },
        p95Latency: { type: 'float' },
        p99Latency: { type: 'float' },
        errorRate: { type: 'float' },
        totalCost: { type: 'decimal', default: 0.00 },

        // Billing
        billingPlan: { type: 'string', enum: ['hourly', 'monthly'] },
        hourlyRate: { type: 'decimal' },

        // Timestamps
        createdAt: { type: 'timestamp', required: true },
        updatedAt: { type: 'timestamp', required: true },
        startedAt: { type: 'timestamp' },
        terminatedAt: { type: 'timestamp' }
    }
};

// ============================================
// 5. RAG (RETRIEVAL AUGMENTED GENERATION)
// ============================================
const ragServiceSchema = {
    tableName: 'deployed_rag_services',
    description: 'RAG service deployments',
    primaryKey: 'deploymentId',
    indexes: ['tenantId', 'userId', 'status', 'llmProvider', 'vectorDB'],
    schema: {
        // Identity & Ownership
        deploymentId: { type: 'string', required: true, unique: true },
        tenantId: { type: 'string', required: true, indexed: true },
        userId: { type: 'string', required: true, indexed: true },
        userName: { type: 'string', required: true },

        // Service Configuration
        serviceName: { type: 'string', required: true },
        description: { type: 'text' },

        // LLM Configuration
        llmProvider: { type: 'string', required: true, enum: ['openai-gpt4', 'anthropic-claude', 'meta-llama', 'mistral-mixtral', 'google-gemini'] },
        llmModel: { type: 'string', required: true },
        temperature: { type: 'float', default: 0.7 },
        maxTokens: { type: 'integer', default: 1024 },

        // Vector Database
        vectorDB: { type: 'string', required: true, enum: ['pinecone', 'weaviate', 'qdrant', 'milvus', 'chroma', 'pgvector'] },
        vectorDBEndpoint: { type: 'string' },
        vectorDBApiKey: { type: 'string', encrypted: true },
        indexName: { type: 'string', required: true },

        // Embedding Configuration
        embeddingModel: { type: 'string', required: true, enum: ['openai-ada-002', 'cohere-embed-v3', 'bge-large', 'e5-large', 'instructor-xl', 'sentence-transformers'] },
        embeddingDimension: { type: 'integer' },

        // Document Sources
        documentSources: { type: 'array', items: 'object' }, // [{type, path, credentials}]
        supportedFormats: { type: 'array', items: 'string', default: ['pdf', 'docx', 'txt', 'md', 'html'] },
        totalDocuments: { type: 'integer', default: 0 },
        totalChunks: { type: 'integer', default: 0 },

        // Chunking Strategy
        chunkingStrategy: { type: 'string', required: true, enum: ['fixed', 'recursive', 'semantic', 'markdown-aware'] },
        chunkSize: { type: 'integer', default: 512 },
        chunkOverlap: { type: 'integer', default: 50 },

        // Retrieval Configuration
        topK: { type: 'integer', default: 5, min: 1, max: 20 },
        similarityThreshold: { type: 'float', default: 0.7, min: 0, max: 1 },
        hybridSearchEnabled: { type: 'boolean', default: false },
        rerankingEnabled: { type: 'boolean', default: false },
        rerankingModel: { type: 'string' },

        // Advanced Features
        cachingEnabled: { type: 'boolean', default: true },
        citationsEnabled: { type: 'boolean', default: true },
        conversationMemory: { type: 'boolean', default: true },
        maxHistoryMessages: { type: 'integer', default: 10 },

        // Update Strategy
        updateStrategy: { type: 'string', required: true, enum: ['manual', 'scheduled', 'real-time', 'incremental'] },
        updateSchedule: { type: 'string' }, // cron format
        lastIndexed: { type: 'timestamp' },

        // Resource Allocation
        gpuType: { type: 'string', enum: ['T4', 'L4', 'A100'] },
        cpuCores: { type: 'integer', required: true },
        memoryGB: { type: 'integer', required: true },

        // API Configuration
        apiEndpoint: { type: 'string', required: true },
        apiKey: { type: 'string', required: true, encrypted: true },
        webhookUrl: { type: 'string' },

        // Operational Status
        status: { type: 'string', required: true, enum: ['provisioning', 'indexing', 'active', 'stopped', 'failed', 'terminated'] },
        healthStatus: { type: 'string', enum: ['healthy', 'degraded', 'unhealthy'] },
        indexingProgress: { type: 'integer', default: 0, min: 0, max: 100 },

        // Usage Metrics
        totalQueries: { type: 'bigint', default: 0 },
        avgResponseTime: { type: 'float' },
        avgRelevanceScore: { type: 'float' },
        totalCost: { type: 'decimal', default: 0.00 },

        // Billing
        billingPlan: { type: 'string', enum: ['pay-per-query', 'hourly', 'monthly'] },
        hourlyRate: { type: 'decimal' },

        // Timestamps
        createdAt: { type: 'timestamp', required: true },
        updatedAt: { type: 'timestamp', required: true },
        startedAt: { type: 'timestamp' },
        terminatedAt: { type: 'timestamp' }
    }
};

// ============================================
// 6. AGENTIC AI SERVICE
// ============================================
const agenticAISchema = {
    tableName: 'deployed_agentic_ai',
    description: 'Agentic AI service instances',
    primaryKey: 'deploymentId',
    indexes: ['tenantId', 'userId', 'status', 'agentType', 'framework'],
    schema: {
        // Identity & Ownership
        deploymentId: { type: 'string', required: true, unique: true },
        tenantId: { type: 'string', required: true, indexed: true },
        userId: { type: 'string', required: true, indexed: true },
        userName: { type: 'string', required: true },

        // Service Configuration
        serviceName: { type: 'string', required: true },
        description: { type: 'text' },
        agentType: { type: 'string', required: true, enum: ['conversational', 'task-automation', 'research', 'coding', 'data-analyst', 'creative', 'multi-agent'] },

        // LLM Configuration
        baseLLM: { type: 'string', required: true, enum: ['gpt-4-turbo', 'claude-3-opus', 'gemini-pro', 'llama-3-70b'] },
        temperature: { type: 'float', default: 0.7 },
        maxTokens: { type: 'integer', default: 4096 },

        // Framework Configuration
        framework: { type: 'string', required: true, enum: ['langchain', 'autogen', 'crewai', 'haystack', 'semantic-kernel', 'custom'] },
        frameworkVersion: { type: 'string' },

        // Tools & Integrations
        enabledTools: { type: 'array', items: 'string' }, // ['web-search', 'calculator', 'python', 'sql', 'api-calls', etc.]
        toolConfigurations: { type: 'json' },
        apiIntegrations: { type: 'json', encrypted: true },

        // Knowledge Base
        knowledgeBaseEnabled: { type: 'boolean', default: false },
        knowledgeBasePath: { type: 'string' },
        vectorStoreType: { type: 'string', enum: ['pinecone', 'weaviate', 'chroma'] },

        // System Prompt & Behavior
        systemPrompt: { type: 'text', required: true },
        customInstructions: { type: 'text' },
        guardrailsEnabled: { type: 'boolean', default: true },
        safetyFilters: { type: 'array', items: 'string' },

        // Memory Configuration
        memoryType: { type: 'string', required: true, enum: ['none', 'conversation', 'persistent', 'summary'] },
        memoryWindow: { type: 'integer', default: 10 },
        persistentMemoryPath: { type: 'string' },

        // Execution Configuration
        maxIterations: { type: 'integer', default: 10, min: 1, max: 20 },
        timeout: { type: 'integer', default: 300 }, // seconds
        humanInLoopEnabled: { type: 'boolean', default: false },
        approvalRequired: { type: 'boolean', default: false },

        // Multi-Agent Configuration (if multi-agent type)
        agentCount: { type: 'integer', default: 1 },
        agentRoles: { type: 'json' },
        coordinationStrategy: { type: 'string', enum: ['sequential', 'hierarchical', 'collaborative'] },

        // Resource Allocation
        gpuType: { type: 'string', enum: ['none', 'L4', 'A100'] },
        cpuCores: { type: 'integer', required: true },
        memoryGB: { type: 'integer', required: true },

        // API Configuration
        apiEndpoint: { type: 'string', required: true },
        apiKey: { type: 'string', required: true, encrypted: true },
        webhookUrl: { type: 'string' },
        streamingEnabled: { type: 'boolean', default: true },

        // Rate Limiting
        rateLimitPerMin: { type: 'integer', default: 60 },
        maxConcurrentUsers: { type: 'integer', default: 10 },

        // Logging & Monitoring
        loggingEnabled: { type: 'boolean', default: true },
        logsPath: { type: 'string' },
        traceEnabled: { type: 'boolean', default: true },

        // Operational Status
        status: { type: 'string', required: true, enum: ['provisioning', 'active', 'stopped', 'failed', 'terminated'] },
        healthStatus: { type: 'string', enum: ['healthy', 'degraded', 'unhealthy'] },

        // Usage Metrics
        totalSessions: { type: 'bigint', default: 0 },
        totalMessages: { type: 'bigint', default: 0 },
        totalToolCalls: { type: 'bigint', default: 0 },
        avgResponseTime: { type: 'float' },
        successRate: { type: 'float' },
        totalCost: { type: 'decimal', default: 0.00 },

        // Billing
        billingPlan: { type: 'string', enum: ['pay-per-use', 'hourly', 'monthly'] },
        hourlyRate: { type: 'decimal' },

        // Timestamps
        createdAt: { type: 'timestamp', required: true },
        updatedAt: { type: 'timestamp', required: true },
        startedAt: { type: 'timestamp' },
        terminatedAt: { type: 'timestamp' }
    }
};

// ============================================
// 7. BUILD YOUR OWN AI
// ============================================
const buildAISchema = {
    tableName: 'deployed_buildai_environments',
    description: 'Custom AI development environments',
    primaryKey: 'deploymentId',
    indexes: ['tenantId', 'userId', 'status', 'solutionType'],
    schema: {
        // Identity & Ownership
        deploymentId: { type: 'string', required: true, unique: true },
        tenantId: { type: 'string', required: true, indexed: true },
        userId: { type: 'string', required: true, indexed: true },
        userName: { type: 'string', required: true },

        // Environment Configuration
        environmentName: { type: 'string', required: true },
        description: { type: 'text' },
        solutionType: { type: 'string', required: true, enum: ['mlops-platform', 'jupyter-workspace', 'training-cluster', 'inference-cluster', 'data-pipeline', 'experiment-tracking', 'custom'] },

        // Framework Configuration
        developmentFrameworks: { type: 'array', items: 'string' }, // ['pytorch', 'tensorflow', 'jax', 'mxnet']
        frameworkVersions: { type: 'json' },

        // MLOps Tools
        mlopsTools: { type: 'array', items: 'string' }, // ['mlflow', 'kubeflow', 'wandb', 'dvc', etc.]
        toolConfigurations: { type: 'json' },

        // Data Storage
        objectStorage: { type: 'boolean', default: true },
        objectStorageSize: { type: 'integer' }, // GB
        databaseType: { type: 'string', enum: ['postgresql', 'mongodb', 'redis', 'none'] },
        databaseSize: { type: 'integer' },

        // Compute Configuration
        computeTier: { type: 'string', required: true, enum: ['small', 'medium', 'large', 'xlarge', 'multi-node'] },
        isMultiNode: { type: 'boolean', default: false },
        workerNodes: { type: 'integer', default: 1 },
        gpusPerNode: { type: 'integer', default: 0 },
        gpuType: { type: 'string', enum: ['T4', 'L4', 'A100', 'H100'] },
        cpuCoresPerNode: { type: 'integer' },
        memoryGBPerNode: { type: 'integer' },

        // Development Access
        accessMethods: { type: 'array', items: 'string' }, // ['jupyter', 'vscode', 'ssh', 'rstudio']
        jupyterUrl: { type: 'string' },
        vscodeUrl: { type: 'string' },
        rstudioUrl: { type: 'string' },
        sshEndpoint: { type: 'string' },
        sshKeys: { type: 'json', encrypted: true },

        // Collaboration Features
        sharedFilesystem: { type: 'boolean', default: false },
        gitIntegration: { type: 'boolean', default: true },
        gitRepositories: { type: 'array', items: 'string' },
        multiUserEnabled: { type: 'boolean', default: false },
        maxUsers: { type: 'integer', default: 1 },

        // Pre-installed Packages
        packageProfile: { type: 'string', required: true, enum: ['minimal', 'data-science', 'deep-learning', 'nlp', 'computer-vision', 'custom'] },
        customPackages: { type: 'text' },
        systemPackages: { type: 'array', items: 'string' },

        // Auto-shutdown Configuration
        autoShutdownEnabled: { type: 'boolean', default: true },
        autoShutdownInactivity: { type: 'string', enum: ['never', '1h', '4h', '24h'] },

        // Persistent Storage
        persistentStorageEnabled: { type: 'boolean', default: true },
        persistentStorageGB: { type: 'integer', default: 500 },
        persistentStoragePath: { type: 'string' },

        // Networking
        publicAccess: { type: 'boolean', default: true },
        vpcId: { type: 'string' },
        subnetId: { type: 'string' },
        securityGroupId: { type: 'string' },

        // Operational Status
        status: { type: 'string', required: true, enum: ['provisioning', 'active', 'stopped', 'failed', 'terminated'] },
        healthStatus: { type: 'string', enum: ['healthy', 'degraded', 'unhealthy'] },
        lastActivity: { type: 'timestamp' },

        // Usage Metrics
        cpuUtilization: { type: 'float' },
        memoryUtilization: { type: 'float' },
        gpuUtilization: { type: 'float' },
        storageUsed: { type: 'bigint' },
        totalUptime: { type: 'bigint' }, // hours
        totalCost: { type: 'decimal', default: 0.00 },

        // Billing
        billingPlan: { type: 'string', enum: ['hourly', 'monthly'] },
        hourlyRate: { type: 'decimal' },

        // Timestamps
        createdAt: { type: 'timestamp', required: true },
        updatedAt: { type: 'timestamp', required: true },
        startedAt: { type: 'timestamp' },
        terminatedAt: { type: 'timestamp' },
        lastAccessedAt: { type: 'timestamp' }
    }
};

// ============================================
// 8. BARE METAL AS A SERVICE
// ============================================
const bareMetalSchema = {
    tableName: 'deployed_bare_metal_servers',
    description: 'Bare metal server allocations',
    primaryKey: 'serverId',
    indexes: ['tenantId', 'userId', 'status', 'serverType', 'location'],
    schema: {
        // Identity & Ownership
        serverId: { type: 'string', required: true, unique: true },
        tenantId: { type: 'string', required: true, indexed: true },
        userId: { type: 'string', required: true, indexed: true },
        userName: { type: 'string', required: true },

        // Server Configuration
        serverName: { type: 'string', required: true },
        serverType: { type: 'string', required: true, enum: ['gpu-server', 'cpu-server', 'storage-server', 'custom'] },
        purpose: { type: 'string', required: true },

        // Hardware Specifications
        cpuModel: { type: 'string', required: true },
        cpuCores: { type: 'integer', required: true },
        cpuThreads: { type: 'integer', required: true },
        ramGB: { type: 'integer', required: true },

        // GPU Configuration
        gpuCount: { type: 'integer', default: 0 },
        gpuModel: { type: 'string', enum: ['NVIDIA-T4', 'NVIDIA-L4', 'NVIDIA-A100-40GB', 'NVIDIA-A100-80GB', 'NVIDIA-H100'] },
        gpuMemoryPerCard: { type: 'integer' },
        totalGpuMemory: { type: 'integer' },

        // Storage Configuration
        storageType: { type: 'string', required: true, enum: ['ssd', 'nvme', 'hdd', 'mixed'] },
        storageGB: { type: 'integer', required: true },
        storageLayout: { type: 'string' }, // e.g., "2x 1TB NVMe + 4x 4TB SSD"
        raidConfig: { type: 'string', enum: ['none', 'raid0', 'raid1', 'raid5', 'raid6', 'raid10'] },

        // Network Configuration
        networkInterfaces: { type: 'integer', required: true },
        networkSpeed: { type: 'string', required: true }, // e.g., "10Gbps", "25Gbps", "100Gbps"
        publicIPv4: { type: 'string' },
        publicIPv6: { type: 'string' },
        privateIP: { type: 'string' },
        vlanId: { type: 'string' },

        // Operating System
        osType: { type: 'string', required: true, enum: ['ubuntu-22.04', 'ubuntu-20.04', 'centos-8', 'rhel-9', 'debian-12', 'rocky-linux-9', 'windows-server-2022', 'esxi-8', 'proxmox', 'custom'] },
        osVersion: { type: 'string' },
        customISOUrl: { type: 'string' },

        // Access Configuration
        sshEnabled: { type: 'boolean', default: true },
        sshPort: { type: 'integer', default: 22 },
        sshPublicKey: { type: 'text', required: true },
        rootPassword: { type: 'string', encrypted: true },

        // IPMI/BMC Access
        ipmiEnabled: { type: 'boolean', default: true },
        ipmiAddress: { type: 'string' },
        ipmiUsername: { type: 'string', encrypted: true },
        ipmiPassword: { type: 'string', encrypted: true },
        ipmiUrl: { type: 'string' },

        // Serial Console
        serialConsoleEnabled: { type: 'boolean', default: true },
        serialConsoleUrl: { type: 'string' },

        // UCS Manager (if Cisco UCS)
        isUCSServer: { type: 'boolean', default: false },
        ucsManagerUrl: { type: 'string' },
        ucsServiceProfile: { type: 'string' },

        // Physical Location
        datacenter: { type: 'string', required: true },
        rack: { type: 'string' },
        rackUnit: { type: 'string' },
        location: { type: 'string', required: true }, // e.g., "us-west-1", "eu-central-1"

        // Provisioning Configuration
        autoProvision: { type: 'boolean', default: true },
        provisioningScript: { type: 'text' },
        ansiblePlaybook: { type: 'text' },

        // Monitoring
        monitoringEnabled: { type: 'boolean', default: true },
        prometheusExporter: { type: 'boolean', default: true },
        snmpEnabled: { type: 'boolean', default: false },

        // Operational Status
        status: { type: 'string', required: true, enum: ['provisioning', 'installing-os', 'configuring', 'active', 'maintenance', 'stopped', 'failed', 'terminated'] },
        healthStatus: { type: 'string', enum: ['healthy', 'degraded', 'unhealthy', 'offline'] },
        powerState: { type: 'string', enum: ['on', 'off', 'rebooting'] },
        lastHealthCheck: { type: 'timestamp' },

        // Hardware Monitoring
        cpuTemperature: { type: 'float' },
        gpuTemperatures: { type: 'array', items: 'float' },
        fanSpeeds: { type: 'array', items: 'integer' },
        powerConsumption: { type: 'float' }, // watts

        // Usage Metrics
        uptime: { type: 'bigint' }, // seconds
        cpuUtilization: { type: 'float' },
        ramUtilization: { type: 'float' },
        gpuUtilization: { type: 'array', items: 'float' },
        networkTxBytes: { type: 'bigint' },
        networkRxBytes: { type: 'bigint' },
        storageUsedGB: { type: 'bigint' },
        totalCost: { type: 'decimal', default: 0.00 },

        // Billing
        billingPlan: { type: 'string', enum: ['hourly', 'monthly', 'annual'] },
        hourlyRate: { type: 'decimal' },
        monthlyRate: { type: 'decimal' },
        setupFee: { type: 'decimal' },

        // Maintenance
        maintenanceWindows: { type: 'json' },
        lastMaintenanceDate: { type: 'timestamp' },
        nextMaintenanceDate: { type: 'timestamp' },

        // Timestamps
        createdAt: { type: 'timestamp', required: true },
        updatedAt: { type: 'timestamp', required: true },
        provisionedAt: { type: 'timestamp' },
        terminatedAt: { type: 'timestamp' }
    }
};

// ============================================
// 9. GPU VM AS A SERVICE
// ============================================
const gpuVMSchema = {
    tableName: 'deployed_gpu_vms',
    description: 'GPU virtual machine instances',
    primaryKey: 'vmId',
    indexes: ['tenantId', 'userId', 'status', 'gpuType', 'location'],
    schema: {
        // Identity & Ownership
        vmId: { type: 'string', required: true, unique: true },
        tenantId: { type: 'string', required: true, indexed: true },
        userId: { type: 'string', required: true, indexed: true },
        userName: { type: 'string', required: true },

        // VM Configuration
        vmName: { type: 'string', required: true },
        vmType: { type: 'string', required: true, enum: ['general', 'compute', 'memory', 'gpu'] },
        purpose: { type: 'string', required: true },

        // Compute Resources
        vCPUs: { type: 'integer', required: true },
        ramGB: { type: 'integer', required: true },

        // GPU Configuration
        gpuType: { type: 'string', required: true, enum: ['T4', 'L4', 'A100-40GB', 'A100-80GB', 'H100'] },
        gpuCount: { type: 'integer', required: true, min: 1, max: 8 },
        gpuMemoryPerCard: { type: 'integer' },

        // Storage Configuration
        bootDiskType: { type: 'string', required: true, enum: ['ssd', 'nvme'] },
        bootDiskSizeGB: { type: 'integer', required: true },
        additionalDisks: { type: 'array', items: 'object' }, // [{type, sizeGB, mountPoint}]
        totalStorageGB: { type: 'integer' },

        // Operating System
        osType: { type: 'string', required: true, enum: ['ubuntu-22.04', 'ubuntu-20.04', 'centos-8', 'rocky-linux-9', 'debian-12', 'windows-server-2022', 'custom'] },
        osImage: { type: 'string' },
        customImageUrl: { type: 'string' },

        // CUDA & Drivers
        cudaVersion: { type: 'string', default: '12.2' },
        cudnnVersion: { type: 'string', default: '8.9' },
        nvidiaDriverVersion: { type: 'string' },
        dockerEnabled: { type: 'boolean', default: true },

        // Network Configuration
        networkType: { type: 'string', default: 'public', enum: ['public', 'private', 'both'] },
        publicIP: { type: 'string' },
        privateIP: { type: 'string' },
        vpcId: { type: 'string' },
        subnetId: { type: 'string' },
        securityGroupId: { type: 'string' },
        firewallRules: { type: 'json' },

        // SSH Access
        sshEnabled: { type: 'boolean', default: true },
        sshPort: { type: 'integer', default: 22 },
        sshKeyName: { type: 'string', required: true },
        sshPublicKey: { type: 'text' },
        sshPrivateKey: { type: 'text', encrypted: true },
        sshUsername: { type: 'string', default: 'ubuntu' },

        // Additional Access Methods
        vncEnabled: { type: 'boolean', default: false },
        vncPort: { type: 'integer' },
        vncPassword: { type: 'string', encrypted: true },
        rdpEnabled: { type: 'boolean', default: false },
        rdpPort: { type: 'integer' },

        // Pre-installed Software
        developmentTools: { type: 'array', items: 'string' }, // ['pytorch', 'tensorflow', 'jupyter', etc.]
        customSoftware: { type: 'array', items: 'string' },
        startupScript: { type: 'text' },

        // Auto-scaling (if enabled)
        autoScalingEnabled: { type: 'boolean', default: false },
        minInstances: { type: 'integer', default: 1 },
        maxInstances: { type: 'integer', default: 10 },

        // Auto-shutdown
        autoShutdownEnabled: { type: 'boolean', default: false },
        autoShutdownTime: { type: 'string' }, // cron format or time
        inactivityShutdown: { type: 'integer' }, // minutes

        // Backup Configuration
        backupEnabled: { type: 'boolean', default: false },
        backupSchedule: { type: 'string' }, // cron format
        retentionDays: { type: 'integer', default: 7 },
        lastBackup: { type: 'timestamp' },

        // Location
        region: { type: 'string', required: true },
        availabilityZone: { type: 'string' },
        datacenter: { type: 'string' },

        // Operational Status
        status: { type: 'string', required: true, enum: ['creating', 'starting', 'running', 'stopping', 'stopped', 'rebooting', 'failed', 'terminated'] },
        healthStatus: { type: 'string', enum: ['healthy', 'degraded', 'unhealthy'] },
        lastHealthCheck: { type: 'timestamp' },

        // Monitoring Metrics
        cpuUtilization: { type: 'float' },
        ramUtilization: { type: 'float' },
        gpuUtilization: { type: 'array', items: 'float' },
        gpuMemoryUsed: { type: 'array', items: 'integer' },
        gpuTemperatures: { type: 'array', items: 'float' },
        diskUsedGB: { type: 'bigint' },
        networkTxBytes: { type: 'bigint' },
        networkRxBytes: { type: 'bigint' },
        uptime: { type: 'bigint' }, // seconds

        // Usage Metrics
        totalRunningHours: { type: 'float' },
        totalCost: { type: 'decimal', default: 0.00 },

        // Billing
        billingPlan: { type: 'string', enum: ['on-demand', 'reserved', 'spot'] },
        hourlyRate: { type: 'decimal' },
        spotBidPrice: { type: 'decimal' },

        // Tags & Metadata
        tags: { type: 'json' },
        labels: { type: 'json' },
        metadata: { type: 'json' },

        // Timestamps
        createdAt: { type: 'timestamp', required: true },
        updatedAt: { type: 'timestamp', required: true },
        launchedAt: { type: 'timestamp' },
        stoppedAt: { type: 'timestamp' },
        terminatedAt: { type: 'timestamp' },
        lastAccessedAt: { type: 'timestamp' }
    }
};

// ============================================
// SUPPORTING TABLES
// ============================================

// Service Usage Logs - Track all API calls and usage across all services
const serviceUsageLogsSchema = {
    tableName: 'service_usage_logs',
    description: 'Detailed usage logs for all services',
    primaryKey: 'logId',
    indexes: ['tenantId', 'userId', 'serviceId', 'serviceType', 'timestamp'],
    partitionKey: 'timestamp', // Partition by day/month for better query performance
    schema: {
        logId: { type: 'string', required: true, unique: true },
        tenantId: { type: 'string', required: true, indexed: true },
        userId: { type: 'string', required: true, indexed: true },
        serviceId: { type: 'string', required: true, indexed: true },
        serviceType: { type: 'string', required: true, enum: ['llm', 'finetuning', 'cv', 'byom', 'rag', 'agentic', 'buildai', 'baremetal', 'gpuvm'] },

        // Usage Details
        action: { type: 'string', required: true }, // e.g., 'api_call', 'inference', 'training_step', etc.
        requestId: { type: 'string' },

        // Metrics
        tokensIn: { type: 'integer', default: 0 },
        tokensOut: { type: 'integer', default: 0 },
        latencyMs: { type: 'integer' },
        success: { type: 'boolean', required: true },
        errorMessage: { type: 'text' },

        // Cost Tracking
        costCents: { type: 'integer', default: 0 }, // Store in cents for precision

        // Timestamps
        timestamp: { type: 'timestamp', required: true },

        // Additional Context
        metadata: { type: 'json' }
    }
};

// Token Consumption Per User - For tracking token usage by individual users within a tenant
const tokenConsumptionSchema = {
    tableName: 'token_consumption_per_user',
    description: 'Track token consumption per user for all LLM services',
    primaryKey: 'consumptionId',
    indexes: ['tenantId', 'userId', 'serviceId', 'date'],
    schema: {
        consumptionId: { type: 'string', required: true, unique: true },
        tenantId: { type: 'string', required: true, indexed: true },
        userId: { type: 'string', required: true, indexed: true },
        userName: { type: 'string', required: true },
        serviceId: { type: 'string', required: true, indexed: true },
        serviceName: { type: 'string', required: true },

        // Daily aggregation
        date: { type: 'date', required: true, indexed: true },

        // Token metrics
        totalRequests: { type: 'bigint', default: 0 },
        tokensIn: { type: 'bigint', default: 0 },
        tokensOut: { type: 'bigint', default: 0 },
        totalTokens: { type: 'bigint', default: 0 },

        // Cost tracking
        totalCostCents: { type: 'bigint', default: 0 },

        // Timestamps
        createdAt: { type: 'timestamp', required: true },
        updatedAt: { type: 'timestamp', required: true }
    }
};

// Export all schemas
const databaseSchemas = {
    // Service Deployments
    llmService: llmServiceSchema,
    fineTuningJob: fineTuningJobSchema,
    cvService: cvServiceSchema,
    byomService: byomServiceSchema,
    ragService: ragServiceSchema,
    agenticAI: agenticAISchema,
    buildAI: buildAISchema,
    bareMetal: bareMetalSchema,
    gpuVM: gpuVMSchema,

    // Supporting Tables
    serviceUsageLogs: serviceUsageLogsSchema,
    tokenConsumption: tokenConsumptionSchema
};

// Database initialization guidance
const databaseImplementationNotes = {
    recommendedDatabase: 'DynamoDB',
    reasoning: [
        'Serverless and fully managed',
        'Excellent for multi-tenant applications with tenant-based partitioning',
        'Strong consistency for critical data',
        'Time-series data support with TTL for logs',
        'Cost-effective with pay-per-use pricing',
        'Built-in backup and point-in-time recovery'
    ],

    alternativeOptions: {
        postgres: 'For complex queries and ACID compliance',
        mongodb: 'For flexible document schema and rapid iteration',
        cassandra: 'For massive scale and multi-region deployment'
    },

    indexingStrategy: [
        'Primary indexes on tenantId for tenant isolation',
        'Secondary indexes on userId for user-specific queries',
        'Composite indexes on tenantId+status for dashboard queries',
        'Time-based indexes for usage logs and metrics'
    ],

    securityConsiderations: [
        'Encrypt all sensitive fields (API keys, passwords, SSH keys) at rest',
        'Use AWS KMS or similar for key management',
        'Implement row-level security for tenant isolation',
        'Enable audit logging for all database operations',
        'Regular automated backups with encryption'
    ],

    scalabilityPatterns: [
        'Partition large tables by tenantId for horizontal scaling',
        'Use time-series partitioning for logs (daily/weekly partitions)',
        'Implement read replicas for dashboard queries',
        'Cache frequently accessed data (active deployments, user profiles)',
        'Archive old logs to S3/Glacier for cost optimization'
    ]
};

console.log('Database schemas loaded successfully');
console.log('Total schemas defined:', Object.keys(databaseSchemas).length);
