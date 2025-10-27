import json
import boto3
import os
from datetime import datetime

# Initialize AWS clients
bedrock = boto3.client('bedrock-runtime', region_name='ap-south-1')  # Mumbai region
dynamodb = boto3.resource('dynamodb', region_name='ap-south-1')  # Mumbai region

# DynamoDB tables
tenants_table = dynamodb.Table('cisco-cmp-tenants')
gpus_table = dynamodb.Table('cisco-cmp-gpus')
logs_table = dynamodb.Table('cisco-cmp-logs')
services_table = dynamodb.Table('cisco-cmp-services')

def lambda_handler(event, context):
    """
    AI Agent for Cisco CMP Portal
    Uses Anthropic Claude on AWS Bedrock
    """
    try:
        body = json.loads(event['body']) if isinstance(event.get('body'), str) else event
        user_message = body.get('message', '')
        user_email = body.get('user_email', 'unknown')
        role = body.get('role', 'tenant-user')
        tenant_id = body.get('tenant_id', None)

        # Get context data
        context_data = get_context_data(role, tenant_id)

        # Build system prompt based on role
        system_prompt = build_system_prompt(role, context_data)

        # Call Claude via Bedrock
        response = call_claude(system_prompt, user_message, context_data)

        # Parse response and execute actions if needed
        action_result = execute_actions(response, user_email, tenant_id)

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'response': response,
                'action_result': action_result
            })
        }

    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }

def get_context_data(role, tenant_id=None):
    """Fetch relevant context data from DynamoDB"""
    context = {}

    try:
        if role == 'csp-admin':
            # Get all tenants
            context['tenants'] = tenants_table.scan()['Items']
            # Get all GPUs
            context['gpus'] = gpus_table.scan()['Items']
            # Get recent logs
            context['recent_logs'] = logs_table.scan(Limit=20)['Items']

        elif role == 'tenant-admin' and tenant_id:
            # Get tenant details
            context['tenant'] = tenants_table.get_item(Key={'id': tenant_id})['Item']
            # Get tenant GPUs
            gpu_response = gpus_table.scan(
                FilterExpression='tenant = :tid',
                ExpressionAttributeValues={':tid': tenant_id}
            )
            context['gpus'] = gpu_response.get('Items', [])
            # Get tenant services
            context['services'] = get_tenant_services(tenant_id)

        elif role == 'tenant-user' and tenant_id:
            # Get limited tenant info
            context['tenant'] = tenants_table.get_item(Key={'id': tenant_id})['Item']
            context['services'] = get_tenant_services(tenant_id)

    except Exception as e:
        print(f"Error fetching context: {str(e)}")

    return context

def get_tenant_services(tenant_id):
    """Get services enabled for a tenant"""
    try:
        tenant = tenants_table.get_item(Key={'id': tenant_id})['Item']
        service_ids = tenant.get('services', [])

        services = []
        for service_id in service_ids:
            service = services_table.get_item(Key={'id': service_id})
            if 'Item' in service:
                services.append(service['Item'])

        return services
    except:
        return []

def build_system_prompt(role, context_data):
    """Build system prompt based on user role and context"""

    base_prompt = """You are an AI assistant for the Cisco Cloud Management Platform (CMP).
You help users manage GPU resources, tenants, AI services, and infrastructure.

Your capabilities include:
- Answering questions about tenants, GPUs, services, billing, and usage
- Creating new tenants (CSP Admin only)
- Allocating and deallocating GPUs (CSP Admin only)
- Enabling services for tenants (Tenant Admin only)
- Providing usage statistics and analytics
- Explaining service pricing and consumption rates

IMPORTANT: When asked to perform actions (create tenant, allocate GPU, enable service),
respond in this JSON format:
{
  "message": "Your natural language response to the user",
  "action": "action_name",
  "parameters": {
    "param1": "value1",
    "param2": "value2"
  }
}

Available actions:
- CREATE_TENANT: Create a new tenant
- ALLOCATE_GPU: Allocate GPU to a tenant
- DEALLOCATE_GPU: Remove GPU from a tenant
- ENABLE_SERVICE: Enable a service for a tenant
- DISABLE_SERVICE: Disable a service for a tenant

"""

    if role == 'csp-admin':
        prompt = base_prompt + f"""
You are assisting a Cloud Service Provider Administrator.

Current System Status:
- Total Tenants: {len(context_data.get('tenants', []))}
- Total GPUs: {len(context_data.get('gpus', []))}
- Available GPUs: {len([g for g in context_data.get('gpus', []) if g.get('status') == 'available'])}

Tenants: {json.dumps(context_data.get('tenants', []), indent=2)}
GPUs: {json.dumps(context_data.get('gpus', []), indent=2)}

You can help with:
- Creating new tenants
- Allocating/deallocating GPUs
- Viewing tenant consumption and billing
- Analyzing system-wide metrics
- Viewing logs and activity
"""

    elif role == 'tenant-admin':
        tenant = context_data.get('tenant', {})
        prompt = base_prompt + f"""
You are assisting a Tenant Administrator.

Tenant Details:
- Name: {tenant.get('name', 'N/A')}
- Allocated GPUs: {tenant.get('allocatedGPUs', 0)}
- Monthly Budget: ${tenant.get('monthlyBudget', 0):,}
- Current Spend: ${tenant.get('currentSpend', 0):,}
- Consumption Rate: {tenant.get('consumptionRate', 0):.1f}%

Available Services: {json.dumps(context_data.get('services', []), indent=2)}

You can help with:
- Enabling/disabling services
- Managing tenant users
- Viewing resource usage and billing
- Monitoring consumption rates
"""

    else:  # tenant-user
        tenant = context_data.get('tenant', {})
        prompt = base_prompt + f"""
You are assisting a Tenant User.

Your Tenant: {tenant.get('name', 'N/A')}
Available Services: {json.dumps(context_data.get('services', []), indent=2)}

You can help with:
- Deploying and using AI services
- Viewing your usage statistics
- Understanding service pricing
- Getting support and documentation
"""

    return prompt

def call_claude(system_prompt, user_message, context_data):
    """Call Anthropic Claude via AWS Bedrock"""

    try:
        # Prepare the request for Claude 3
        request_body = {
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 2000,
            "temperature": 0.7,
            "system": system_prompt,
            "messages": [
                {
                    "role": "user",
                    "content": user_message
                }
            ]
        }

        # Call Bedrock
        response = bedrock.invoke_model(
            modelId='anthropic.claude-sonnet-4-5-20250929-v1:0',  # Claude Sonnet 4.5
            body=json.dumps(request_body)
        )

        # Parse response
        response_body = json.loads(response['body'].read())
        assistant_message = response_body['content'][0]['text']

        return assistant_message

    except Exception as e:
        print(f"Error calling Claude: {str(e)}")
        return f"I apologize, but I encountered an error processing your request: {str(e)}"

def execute_actions(response, user_email, tenant_id=None):
    """Parse Claude's response and execute any actions"""

    try:
        # Try to parse JSON from response
        if '{' in response and '}' in response:
            start = response.index('{')
            end = response.rindex('}') + 1
            json_str = response[start:end]
            action_data = json.loads(json_str)

            action = action_data.get('action')
            params = action_data.get('parameters', {})

            if action == 'CREATE_TENANT':
                return create_tenant_action(params, user_email)

            elif action == 'ALLOCATE_GPU':
                return allocate_gpu_action(params, user_email)

            elif action == 'DEALLOCATE_GPU':
                return deallocate_gpu_action(params, user_email)

            elif action == 'ENABLE_SERVICE':
                return enable_service_action(params, user_email, tenant_id)

            elif action == 'DISABLE_SERVICE':
                return disable_service_action(params, user_email, tenant_id)

        return None

    except Exception as e:
        print(f"Error executing action: {str(e)}")
        return {'error': str(e)}

def create_tenant_action(params, user_email):
    """Create a new tenant in DynamoDB"""
    try:
        tenant_id = f"tenant-{datetime.now().timestamp()}"

        tenant_data = {
            'id': tenant_id,
            'name': params.get('name'),
            'status': 'active',
            'created': datetime.now().isoformat(),
            'allocatedGPUs': 0,
            'consumptionRate': 0.0,
            'services': [],
            'users': 0,
            'monthlyBudget': int(params.get('budget', 0)),
            'currentSpend': 0
        }

        tenants_table.put_item(Item=tenant_data)

        # Log the action
        log_action(tenant_id, 'Tenant Created', f"Created tenant: {tenant_data['name']}", user_email)

        return {'success': True, 'tenant_id': tenant_id}

    except Exception as e:
        return {'success': False, 'error': str(e)}

def allocate_gpu_action(params, user_email):
    """Allocate GPU to tenant"""
    try:
        gpu_id = params.get('gpu_id')
        tenant_id = params.get('tenant_id')

        # Update GPU
        gpus_table.update_item(
            Key={'id': gpu_id},
            UpdateExpression='SET #status = :status, tenant = :tenant',
            ExpressionAttributeNames={'#status': 'status'},
            ExpressionAttributeValues={':status': 'allocated', ':tenant': tenant_id}
        )

        # Update tenant GPU count
        tenants_table.update_item(
            Key={'id': tenant_id},
            UpdateExpression='SET allocatedGPUs = allocatedGPUs + :inc',
            ExpressionAttributeValues={':inc': 1}
        )

        # Log the action
        log_action(tenant_id, 'GPU Allocated', f"Allocated GPU {gpu_id}", user_email)

        return {'success': True}

    except Exception as e:
        return {'success': False, 'error': str(e)}

def deallocate_gpu_action(params, user_email):
    """Deallocate GPU from tenant"""
    try:
        gpu_id = params.get('gpu_id')

        # Get GPU to find tenant
        gpu = gpus_table.get_item(Key={'id': gpu_id})['Item']
        tenant_id = gpu.get('tenant')

        # Update GPU
        gpus_table.update_item(
            Key={'id': gpu_id},
            UpdateExpression='SET #status = :status, tenant = :tenant',
            ExpressionAttributeNames={'#status': 'status'},
            ExpressionAttributeValues={':status': 'available', ':tenant': None}
        )

        # Update tenant GPU count
        if tenant_id:
            tenants_table.update_item(
                Key={'id': tenant_id},
                UpdateExpression='SET allocatedGPUs = allocatedGPUs - :dec',
                ExpressionAttributeValues={':dec': 1}
            )

        # Log the action
        log_action(tenant_id, 'GPU Deallocated', f"Deallocated GPU {gpu_id}", user_email)

        return {'success': True}

    except Exception as e:
        return {'success': False, 'error': str(e)}

def enable_service_action(params, user_email, tenant_id):
    """Enable service for tenant"""
    try:
        service_id = params.get('service_id')

        # Update tenant services
        tenant = tenants_table.get_item(Key={'id': tenant_id})['Item']
        services = tenant.get('services', [])

        if service_id not in services:
            services.append(service_id)
            tenants_table.update_item(
                Key={'id': tenant_id},
                UpdateExpression='SET services = :services',
                ExpressionAttributeValues={':services': services}
            )

        # Log the action
        log_action(tenant_id, 'Service Enabled', f"Enabled service {service_id}", user_email)

        return {'success': True}

    except Exception as e:
        return {'success': False, 'error': str(e)}

def disable_service_action(params, user_email, tenant_id):
    """Disable service for tenant"""
    try:
        service_id = params.get('service_id')

        # Update tenant services
        tenant = tenants_table.get_item(Key={'id': tenant_id})['Item']
        services = tenant.get('services', [])

        if service_id in services:
            services.remove(service_id)
            tenants_table.update_item(
                Key={'id': tenant_id},
                UpdateExpression='SET services = :services',
                ExpressionAttributeValues={':services': services}
            )

        # Log the action
        log_action(tenant_id, 'Service Disabled', f"Disabled service {service_id}", user_email)

        return {'success': True}

    except Exception as e:
        return {'success': False, 'error': str(e)}

def log_action(tenant_id, action, details, user_email):
    """Log an action to DynamoDB"""
    try:
        log_id = f"log-{datetime.now().timestamp()}"
        logs_table.put_item(Item={
            'id': log_id,
            'timestamp': datetime.now().isoformat(),
            'tenantId': tenant_id,
            'action': action,
            'details': details,
            'user': user_email
        })
    except Exception as e:
        print(f"Error logging action: {str(e)}")
