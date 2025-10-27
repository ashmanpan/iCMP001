# AWS Region Configuration

## ⚠️ IMPORTANT: Always Use Mumbai Region

**Region Code**: `ap-south-1`
**Region Name**: Asia Pacific (Mumbai)

---

## Why Mumbai Region?

All Cisco CMP Portal resources must be deployed to AWS Mumbai region (ap-south-1) for:
- Proximity to users
- Compliance requirements
- Data sovereignty
- Lower latency

---

## Configuration Files Updated

### 1. Lambda Function (`api/lambda/ai-agent.py`)
```python
bedrock = boto3.client('bedrock-runtime', region_name='ap-south-1')
dynamodb = boto3.resource('dynamodb', region_name='ap-south-1')
```

### 2. Amplify Config (`js/amplify-config.js`)
```javascript
Auth: {
    region: 'ap-south-1',
    // ...
},
API: {
    endpoints: [{
        region: 'ap-south-1'
    }],
    GraphQL: {
        region: 'ap-south-1'
    }
}
```

### 3. Deployment Guide (`DEPLOYMENT_GUIDE.md`)
- AWS CLI default region: `ap-south-1`
- All resource creation in Mumbai
- CloudFormation stacks in Mumbai
- DynamoDB tables in Mumbai
- Lambda functions in Mumbai
- Bedrock model access in Mumbai

---

## AWS CLI Commands with Mumbai Region

### Configure AWS CLI
```bash
aws configure --profile ciscoaidemo-profile
# When prompted:
# Default region name: ap-south-1
```

### Amplify Commands
```bash
# Initialize with Mumbai region
amplify init
# Select region: ap-south-1

# Add API in Mumbai
amplify add api
# Region will default to ap-south-1

# Add hosting in Mumbai
amplify add hosting
# CloudFront edge locations will route to ap-south-1 origin
```

### Direct AWS CLI Commands
```bash
# Always specify --region ap-south-1
aws dynamodb list-tables --region ap-south-1 --profile ciscoaidemo-profile

aws lambda list-functions --region ap-south-1 --profile ciscoaidemo-profile

aws bedrock list-foundation-models --region ap-south-1 --profile ciscoaidemo-profile
```

---

## Bedrock Availability in Mumbai

### Available Claude Models in ap-south-1
✅ anthropic.claude-3-sonnet-20240229-v1:0
✅ anthropic.claude-3-haiku-20240307-v1:0
✅ anthropic.claude-v2:1
✅ anthropic.claude-v2
✅ anthropic.claude-instant-v1

**Note**: Verify model availability in Mumbai region before deployment:
```bash
aws bedrock list-foundation-models \
  --region ap-south-1 \
  --profile ciscoaidemo-profile \
  --query 'modelSummaries[?contains(modelId, `anthropic`)]'
```

---

## DynamoDB in Mumbai

All tables will be created in ap-south-1:
- Cisco-CMP-Tenants
- Cisco-CMP-GPUs
- Cisco-CMP-UCSServers
- Cisco-CMP-NexusFabric
- Cisco-CMP-Services
- Cisco-CMP-Logs
- Cisco-CMP-Users

**Table ARN Format**: `arn:aws:dynamodb:ap-south-1:ACCOUNT_ID:table/TABLE_NAME`

---

## CloudFront and S3

### S3 Bucket
- **Region**: ap-south-1
- **Name**: cisco-cmp-portal-mumbai
- **Access**: Via CloudFront only

### CloudFront Distribution
- **Origin Region**: ap-south-1
- **Edge Locations**: Global (including India)
- **Custom Domain**: icmp.ciscoaidemo.com

---

## Lambda Configuration

### Runtime
- Python 3.11 (available in ap-south-1)

### VPC (Optional)
If using VPC:
- **VPC Region**: ap-south-1
- **Availability Zones**: ap-south-1a, ap-south-1b, ap-south-1c

### Environment Variables
```json
{
  "AWS_REGION": "ap-south-1",
  "DYNAMODB_REGION": "ap-south-1",
  "BEDROCK_REGION": "ap-south-1"
}
```

---

## Monitoring and Logs

### CloudWatch Logs
- **Log Groups**: /aws/lambda/* in ap-south-1
- **Retention**: 7 days (recommended)

### CloudWatch Metrics
- **Namespace**: AWS/Lambda, AWS/DynamoDB, AWS/Bedrock
- **Region**: ap-south-1

### X-Ray Tracing
- Enable tracing for Lambda functions in Mumbai

---

## Backup and DR

### DynamoDB Backups
- **Point-in-time Recovery**: Enable in ap-south-1
- **On-demand Backups**: Store in ap-south-1
- **Cross-region Replication** (Optional): ap-south-1 → us-east-1

### S3 Backups
- **Versioning**: Enabled
- **Cross-region Replication** (Optional): ap-south-1 → us-west-2

---

## Cost Optimization for Mumbai Region

### Pricing Considerations
- DynamoDB: On-demand pricing
- Lambda: 1M free requests/month
- S3: First 50 TB @ $0.023/GB
- Data Transfer: Within Mumbai region is free
- CloudFront: Edge locations pricing varies

### Cost Monitoring
```bash
# View costs for Mumbai region
aws ce get-cost-and-usage \
  --region ap-south-1 \
  --profile ciscoaidemo-profile \
  --time-period Start=2024-10-01,End=2024-10-31 \
  --granularity MONTHLY \
  --metrics BlendedCost \
  --group-by Type=SERVICE
```

---

## Troubleshooting

### Issue: Bedrock not available in Mumbai
**Solution**: Verify model access is enabled in AWS Console → Bedrock → Model access

### Issue: Higher latency than expected
**Solution**:
- Check CloudFront edge location routing
- Verify resources are in ap-south-1, not another region
- Use `traceroute` to check network path

### Issue: DynamoDB throughput limits
**Solution**:
- Use on-demand billing mode
- Request quota increase for Mumbai region

---

## Verification Checklist

Before deployment, verify all configurations use Mumbai region:

- [ ] AWS CLI profile default region: ap-south-1
- [ ] Amplify backend region: ap-south-1
- [ ] DynamoDB tables region: ap-south-1
- [ ] Lambda functions region: ap-south-1
- [ ] Bedrock client region: ap-south-1
- [ ] S3 bucket region: ap-south-1
- [ ] CloudWatch logs region: ap-south-1
- [ ] Amplify app region: ap-south-1

---

## Quick Reference

| Service | Region Code | Region Name |
|---------|-------------|-------------|
| All Services | `ap-south-1` | Asia Pacific (Mumbai) |

**Environment Variable**: `AWS_REGION=ap-south-1`
**AWS CLI Flag**: `--region ap-south-1`
**SDK Config**: `region='ap-south-1'`

---

**Last Updated**: 2024-10-28
**Reviewed By**: Development Team
**Status**: ✅ All configurations updated for Mumbai region
