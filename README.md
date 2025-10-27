# Cisco Cloud Management Platform Portal

## Overview
This is a comprehensive cloud management platform portal for managing GPU resources, tenants, and AI services with Cisco branding.

## Features

### Three User Personas
1. **CSP Admin** - Cloud Service Provider Administrator
   - Create and manage tenants
   - Allocate and manage GPUs
   - View Cisco Nexus fabric discovery
   - Monitor UCS servers
   - View consumption metrics and logs
   - Analytics and reporting

2. **Tenant Admin** - Tenant Administrator
   - Enable/disable services for their tenant
   - Manage tenant users
   - Monitor resource usage
   - View billing information

3. **Tenant User** - End User
   - Deploy and consume AI services
   - Monitor personal usage
   - Access documentation and support

### AI Services Offered
- LLM as a Service
- Fine-Tuning as a Service
- Computer Vision as a Service
- Bring Your Own Model (BYOM)
- RAG as a Service
- Agentic AI as a Service
- Build Your Own AI
- Bare Metal as a Service
- GPU VM as a Service

### Multi-Language Support
- English
- Japanese (日本語)
- Bahasa Indonesia
- Hindi (हिंदी)
- Marathi (मराठी)

### Key Features
- **GPU Discovery**: Automatic discovery of NVIDIA and AMD GPUs on Cisco UCS servers
- **Nexus Fabric Integration**: Visualization of Cisco Nexus fabric connectivity
- **Real-time Monitoring**: Live consumption rates, GPU utilization, and logs
- **AI Chat Agent**: Natural language interface to create tenants, allocate GPUs, and manage resources
- **AWS Amplify Integration**: Backend powered by AWS Amplify with DynamoDB for data persistence

## Project Structure

```
cmp-portal/
├── index.html                  # Login page with role selection
├── csp-admin.html             # CSP Admin dashboard
├── tenant-admin.html          # Tenant Admin dashboard (to be created)
├── tenant-user.html           # Tenant User dashboard (to be created)
├── css/
│   └── global.css            # Global styles with Cisco branding
├── js/
│   ├── i18n.js               # Multi-language support
│   ├── mock-data.js          # Mock data for GPUs, tenants, services
│   ├── csp-admin.js          # CSP Admin logic
│   ├── ai-agent.js           # AI chat agent (to be created)
│   └── amplify-config.js     # AWS Amplify configuration (to be created)
├── api/
│   └── graphql/              # GraphQL schemas for Amplify (to be created)
├── assets/
│   ├── images/               # Images and logos
│   └── icons/                # Cisco icons
└── amplify.yml               # AWS Amplify deployment config (to be created)
```

## Technologies Used
- **Frontend**: Pure HTML, CSS, JavaScript (no frameworks)
- **Backend**: AWS Amplify with AppSync (GraphQL)
- **Database**: Amazon DynamoDB
- **Charts**: Chart.js
- **Icons**: Font Awesome
- **Hosting**: AWS Amplify

## AWS Amplify Setup

### Prerequisites
- AWS Account
- AWS CLI configured with profile: `runon-sept2025-profile`
- Git repository

### DynamoDB Tables
1. **Tenants** - Store tenant information
2. **GPUs** - GPU inventory and allocation
3. **UCSServers** - Cisco UCS server information
4. **NexusFabric** - Nexus switch information
5. **Services** - AI services catalog
6. **Logs** - System activity logs
7. **Users** - User management

### GraphQL Schema
- Tenant CRUD operations
- GPU allocation/deallocation
- Service enablement
- User management
- Logging operations

## Deployment

### Local Development
1. Open `index.html` in a web browser
2. Select a role (CSP Admin, Tenant Admin, or Tenant User)
3. Sign in with any credentials (authentication will be added via Amplify)

### AWS Amplify Deployment
```bash
# Initialize Amplify
amplify init

# Add API (AppSync + DynamoDB)
amplify add api

# Add Hosting
amplify add hosting

# Deploy
amplify push
```

## Features Implementation Status

### Completed ✓
- [x] Multi-language support (5 languages)
- [x] Cisco branding and color scheme
- [x] Login page with role selection
- [x] CSP Admin dashboard structure
- [x] GPU discovery and visualization
- [x] Nexus fabric display
- [x] Mock data for development
- [x] Responsive design
- [x] Charts and analytics
- [x] Tenant management UI

### In Progress 🔄
- [ ] AI chat agent integration
- [ ] AWS Amplify backend setup
- [ ] DynamoDB integration
- [ ] Tenant Admin dashboard
- [ ] Tenant User dashboard

### Pending ⏳
- [ ] Authentication with Amplify Cognito
- [ ] Real-time data sync
- [ ] Service deployment workflows
- [ ] Billing integration
- [ ] Advanced logging and monitoring
- [ ] Email notifications
- [ ] Role-based access control (RBAC)

## AI Chat Agent Features

The AI agent will support natural language commands such as:
- "Create a new tenant called TechCorp with budget $50,000"
- "Allocate 2 NVIDIA A100 GPUs to TechCorp"
- "Show me GPU utilization for tenant-001"
- "Remove GPU gpu-005 from FinanceAI Solutions"
- "Enable LLM service for TechCorp"
- "Show me consumption logs for today"

## Color Scheme (Cisco Branding)

- Primary Blue: `#049FD9`
- Dark Blue: `#0073A8`
- Light Blue: `#00BCEB`
- Accent Green: `#00ff88`
- Background: `#000`, `#0a0a0a`, `#1a1a1a`
- Text: `#ffffff`, `#e0e0e0`, `#b0b0b0`

## Support

For issues and questions:
- Check the documentation
- Review logs in CSP Admin dashboard
- Contact support team

## License

Cisco Proprietary - Internal Use Only

---

## Next Steps

1. Complete Tenant Admin dashboard
2. Complete Tenant User dashboard
3. Integrate AI chat agent
4. Set up AWS Amplify backend
5. Configure DynamoDB tables
6. Implement authentication
7. Deploy to AWS Amplify
8. Test all workflows
9. Production release
