# Quick Deployment to AWS Amplify

## Step 1: Push to GitHub

```bash
cd /home/kpanse/wsl-myprojects/Cisco_AI_CMP/cmp-portal

# If you don't have a GitHub repo yet, create one at github.com
# Then add it as remote:
git remote add origin https://github.com/YOUR_USERNAME/cisco-cmp-portal.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy via AWS Amplify Console

### Option A: Via AWS Console (Recommended)

1. Go to AWS Amplify Console: https://console.aws.amazon.com/amplify/
2. Click "New app" → "Host web app"
3. Select "GitHub" as repository provider
4. Authorize AWS Amplify to access your GitHub
5. Select repository: `cisco-cmp-portal`
6. Select branch: `main`
7. Build settings are auto-detected (amplify.yml)
8. Click "Save and deploy"

### Option B: Via AWS CLI

```bash
# Configure AWS credentials
aws configure --profile ciscoaidemo-profile
# Region: ap-south-1 (Mumbai)

# Create Amplify app
aws amplify create-app \
  --name cisco-cmp-portal \
  --repository https://github.com/YOUR_USERNAME/cisco-cmp-portal \
  --region ap-south-1 \
  --profile ciscoaidemo-profile

# Connect branch
aws amplify create-branch \
  --app-id YOUR_APP_ID \
  --branch-name main \
  --region ap-south-1 \
  --profile ciscoaidemo-profile

# Start deployment
aws amplify start-job \
  --app-id YOUR_APP_ID \
  --branch-name main \
  --job-type RELEASE \
  --region ap-south-1 \
  --profile ciscoaidemo-profile
```

## Step 3: Configure Custom Domain

1. In Amplify Console, go to "Domain management"
2. Click "Add domain"
3. Enter: `icmp.ciscoaidemo.com`
4. Follow DNS configuration steps in Route 53

## Step 4: Test the Portal

Once deployed, Amplify will provide a URL like:
`https://main.d1234567890.amplifyapp.com`

Test all three personas:
- CSP Admin
- Tenant Admin
- Tenant User

## URLs to Test

- Login: https://YOUR_AMPLIFY_URL/
- CSP Admin: https://YOUR_AMPLIFY_URL/csp-admin.html
- Tenant Admin: https://YOUR_AMPLIFY_URL/tenant-admin.html
- Tenant User: https://YOUR_AMPLIFY_URL/tenant-user.html

## What's Included

✅ All 3 dashboards (CSP Admin, Tenant Admin, Tenant User)
✅ Full service catalog with deployment forms for all 9 services:
  - LLM as a Service
  - Fine-Tuning as a Service
  - Computer Vision as a Service
  - Bring Your Own Model
  - RAG as a Service
  - Agentic AI as a Service
  - Build Your Own AI
  - Bare Metal as a Service
  - GPU VM as a Service

✅ AI Chat Agent UI (backend needs Lambda/Bedrock setup)
✅ Multi-language support (5 languages)
✅ Cisco branding throughout
✅ Mock data for testing

## Note on Backend Services

The portal frontend is fully functional with mock data.

For full functionality with real data, you need to set up:
1. DynamoDB tables
2. Lambda function for AI agent
3. Bedrock access

These can be added later using AWS Amplify CLI or CloudFormation.

---

**Ready to deploy!** Just push to GitHub and connect to Amplify.
