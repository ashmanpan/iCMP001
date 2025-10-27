# Cisco CMP Portal - AWS Amplify Deployment Guide

## Target Deployment
- **URL**: https://icmp.ciscoaidemo.com
- **Domain**: ciscoaidemo.com (Personal AWS Account)
- **Region**: ap-south-1 (AWS Mumbai) **⚠️ IMPORTANT: Always use Mumbai region**

## Prerequisites

### 1. AWS CLI Configuration
```bash
# Configure AWS CLI with the new profile
aws configure --profile ciscoaidemo-profile

# You'll be prompted for:
AWS Access Key ID: [provided by account owner]
AWS Secret Access Key: [provided by account owner]
Default region name: ap-south-1
Default output format: json
```

### 2. Install Amplify CLI
```bash
npm install -g @aws-amplify/cli

# Configure Amplify with the profile
amplify configure
```

## Step-by-Step Deployment

### Step 1: Initialize Git Repository
```bash
cd /home/kpanse/wsl-myprojects/Cisco_AI_CMP/cmp-portal

# Initialize git if not already done
git init

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/cisco-cmp-portal.git

# Add all files
git add .
git commit -m "Initial commit: Cisco CMP Portal"
git push -u origin main
```

### Step 2: Initialize Amplify
```bash
# Initialize Amplify project
amplify init

# Answer the prompts:
? Enter a name for the project: ciscoCMPPortal
? Initialize the project with the above configuration? Yes
? Select the authentication method you want to use: AWS profile
? Please choose the profile you want to use: ciscoaidemo-profile
```

### Step 3: Add API (AppSync + DynamoDB)
```bash
# Add GraphQL API
amplify add api

# Answer the prompts:
? Select from one of the below mentioned services: GraphQL
? Here is the GraphQL API that we will create. Select a setting to edit or continue: Continue
? Choose a schema template: Single object with fields
? Do you want to edit the schema now? Yes
```

Use the schema below (save to `amplify/backend/api/ciscoCMPAPI/schema.graphql`):

```graphql
type Tenant @model @auth(rules: [{allow: public}]) {
  id: ID!
  name: String!
  status: String!
  created: AWSDateTime!
  allocatedGPUs: Int!
  consumptionRate: Float!
  services: [String]
  users: Int!
  monthlyBudget: Int!
  currentSpend: Int!
}

type GPU @model @auth(rules: [{allow: public}]) {
  id: ID!
  model: String!
  memory: String!
  ucsServer: String!
  status: String!
  tenant: String
  vendor: String!
}

type UCSServer @model @auth(rules: [{allow: public}]) {
  id: ID!
  name: String!
  rack: String!
  nexusSwitch: String!
  status: String!
  gpuCount: Int!
}

type NexusFabric @model @auth(rules: [{allow: public}]) {
  id: ID!
  model: String!
  ports: Int!
  connectedServers: Int!
  status: String!
}

type Service @model @auth(rules: [{allow: public}]) {
  id: ID!
  name: String!
  description: String!
  icon: String
  category: String!
  pricing: String!
  enabled: Boolean!
}

type Log @model @auth(rules: [{allow: public}]) {
  id: ID!
  timestamp: AWSDateTime!
  tenantId: String
  action: String!
  details: String
  user: String!
}

type User @model @auth(rules: [{allow: public}]) {
  id: ID!
  email: String!
  role: String!
  tenantId: String
  name: String
  created: AWSDateTime!
}
```

### Step 4: Add Authentication (Cognito)
```bash
amplify add auth

# Answer the prompts:
? Do you want to use the default authentication and security configuration? Default configuration
? How do you want users to be able to sign in? Email
? Do you want to configure advanced settings? No, I am done.
```

### Step 5: Add Lambda Function
```bash
# Add Lambda function for AI Agent
amplify add function

# Answer the prompts:
? Select which capability you want to add: Lambda function
? Provide an AWS Lambda function name: ciscoCMPAIAgent
? Choose the runtime that you want to use: Python
? Choose the function template: Hello World
? Do you want to configure advanced settings? Yes
? Do you want to access other resources in this project from your Lambda function? Yes
? Select the categories you want this function to have access to: API, Storage
? Do you want to invoke this function on a recurring schedule? No
? Do you want to enable Lambda layers for this function? No
? Do you want to configure environment variables for this function? Yes
```

Copy the Lambda code from `api/lambda/ai-agent.py` to `amplify/backend/function/ciscoCMPAIAgent/src/index.py`

### Step 6: Configure Lambda Permissions
Add Bedrock permissions to the Lambda:

```bash
# Edit amplify/backend/function/ciscoCMPAIAgent/ciscoCMPAIAgent-cloudformation-template.json
# Add this to the Lambda execution role policies:
```

```json
{
  "Effect": "Allow",
  "Action": [
    "bedrock:InvokeModel"
  ],
  "Resource": [
    "arn:aws:bedrock:*::foundation-model/anthropic.claude-3-sonnet-20240229-v1:0"
  ]
}
```

### Step 7: Add Hosting
```bash
amplify add hosting

# Answer the prompts:
? Select the plugin module to execute: Amazon CloudFront and S3
? Select the environment setup: PROD
? hosting bucket name: cisco-cmp-portal-hosting
```

### Step 8: Deploy to AWS
```bash
# Push all changes to AWS
amplify push

# This will:
# - Create DynamoDB tables
# - Set up AppSync GraphQL API
# - Deploy Lambda functions
# - Configure Cognito authentication
# - Set up S3 + CloudFront hosting
```

### Step 9: Configure Custom Domain
```bash
# Add custom domain
amplify add hosting

# Follow prompts to add custom domain: icmp.ciscoaidemo.com
```

Or configure manually in AWS Amplify Console:
1. Go to AWS Amplify Console
2. Select your app
3. Go to "Domain management"
4. Click "Add domain"
5. Enter: icmp.ciscoaidemo.com
6. Follow DNS configuration steps

### Step 10: Update Frontend Configuration
After deployment, update the configuration files with the generated endpoints:

```javascript
// Update js/amplify-config.js with values from:
amplify status
```

Copy the AppSync endpoint, Cognito User Pool ID, and API Gateway endpoint to the config file.

### Step 11: Deploy Frontend
```bash
# Publish the site
amplify publish

# This will build and deploy your frontend to S3/CloudFront
```

## Post-Deployment Configuration

### 1. Populate Initial Data
Use the AWS DynamoDB console or run a data migration script to populate:
- Initial GPU inventory
- UCS Servers
- Nexus Fabric switches
- Services catalog

### 2. Create Admin User
```bash
# Create first admin user in Cognito
aws cognito-idp admin-create-user \
  --user-pool-id YOUR_USER_POOL_ID \
  --username admin@ciscoaidemo.com \
  --user-attributes Name=email,Value=admin@ciscoaidemo.com Name=email_verified,Value=true \
  --temporary-password TempPassword123! \
  --profile ciscoaidemo-profile
```

### 3. Configure Lambda Environment Variables
Set these in Lambda console:
- `LAMBDA_ENDPOINT`: Your API Gateway endpoint
- `AWS_REGION`: us-east-1 (or your region)

### 4. Test AI Agent
Ensure Bedrock access is enabled in your AWS account:
```bash
# Enable Bedrock model access
aws bedrock put-model-invocation-logging-configuration \
  --region us-east-1 \
  --profile ciscoaidemo-profile
```

## Monitoring & Maintenance

### View Logs
```bash
# View Amplify logs
amplify console

# View Lambda logs
aws logs tail /aws/lambda/ciscoCMPAIAgent --follow --profile ciscoaidemo-profile

# View API logs
aws logs tail /aws/appsync/apis/YOUR_API_ID --follow --profile ciscoaidemo-profile
```

### Update Application
```bash
# After making changes
git add .
git commit -m "Update: description"
git push

# Deploy changes
amplify publish
```

### Backup Data
```bash
# Backup DynamoDB tables
aws dynamodb create-backup \
  --table-name Cisco-CMP-Tenants \
  --backup-name cisco-cmp-tenants-backup-$(date +%Y%m%d) \
  --profile ciscoaidemo-profile
```

## Troubleshooting

### Issue: Amplify CLI not using correct profile
```bash
export AWS_PROFILE=ciscoaidemo-profile
amplify push
```

### Issue: Bedrock access denied
Ensure your AWS account has Bedrock enabled and model access granted:
1. Go to AWS Bedrock Console
2. Click "Model access"
3. Enable Anthropic Claude models

### Issue: CORS errors
Update API Gateway to allow your domain:
```bash
amplify update api
# Select "Configure additional API settings"
# Enable CORS with your domain
```

### Issue: Domain not resolving
Check Route 53 DNS records:
1. Ensure icmp.ciscoaidemo.com CNAME points to Amplify domain
2. Wait for DNS propagation (up to 48 hours)
3. Use `dig icmp.ciscoaidemo.com` to verify

## Security Checklist

- [ ] Enable MFA for admin users
- [ ] Configure WAF rules for CloudFront
- [ ] Enable CloudTrail logging
- [ ] Set up CloudWatch alarms
- [ ] Configure VPC for Lambda (if needed)
- [ ] Enable encryption at rest for DynamoDB
- [ ] Enable S3 bucket encryption
- [ ] Configure API rate limiting
- [ ] Set up backup policies

## Cost Optimization

- Monitor usage with AWS Cost Explorer
- Set up billing alerts
- Use DynamoDB On-Demand pricing for variable workloads
- Consider Reserved Capacity for predictable loads
- Clean up unused resources regularly

## Support

For issues:
1. Check CloudWatch logs
2. Review Amplify Console logs
3. Test API endpoints with Postman
4. Verify IAM permissions

---

## Quick Commands Reference

```bash
# Deploy everything
amplify push && amplify publish

# View status
amplify status

# Open AWS Console
amplify console

# Open Amplify Console
amplify console hosting

# Delete all resources (CAREFUL!)
amplify delete
```
