# Environment Configuration

## Quick Setup

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit your settings:**
   ```bash
   nano .env
   ```

3. **Run the application:**
   ```bash
   uv run dev
   ```

## Configuration Options

### **AWS Configuration**
```bash
AWS_REGION=us-east-1                    # AWS region for Bedrock
BEDROCK_MODEL_ID=us.anthropic.claude-3-7-sonnet-20250219-v1:0
```

### **Application Configuration**
```bash
ENVIRONMENT=development                  # development | production
```

### **Logging Configuration**
```bash
LOG_LEVEL=INFO                          # DEBUG | INFO | WARNING | ERROR
CLOUDWATCH_LOG_GROUP=/aws/lambda/writers-block-service/application
ENABLE_CLOUDWATCH_LOGGING=true          # true | false
LOG_PROMPTS_ONLY=true                   # true | false (security setting)
```

### **Security Configuration**
```bash
CORS_ORIGINS=*                          # Comma-separated origins for CORS
```

## Environment Examples

### **Development (.env)**
```bash
AWS_REGION=us-east-1
BEDROCK_MODEL_ID=us.anthropic.claude-3-7-sonnet-20250219-v1:0
ENVIRONMENT=development
LOG_LEVEL=DEBUG
CLOUDWATCH_LOG_GROUP=/aws/lambda/writers-block-service/dev
ENABLE_CLOUDWATCH_LOGGING=false         # Disable to avoid AWS costs locally
LOG_PROMPTS_ONLY=true
CORS_ORIGINS=http://localhost:3000,chrome-extension://*
```

### **Production (Lambda Environment Variables)**
```bash
AWS_REGION=us-east-1
BEDROCK_MODEL_ID=us.anthropic.claude-3-7-sonnet-20250219-v1:0
ENVIRONMENT=production
LOG_LEVEL=WARNING
CLOUDWATCH_LOG_GROUP=/aws/lambda/writers-block-service/production
ENABLE_CLOUDWATCH_LOGGING=true
LOG_PROMPTS_ONLY=true
CORS_ORIGINS=https://yourdomain.com
```

## Commands

### **Development:**
```bash
uv run dev          # Development server with auto-reload
```

### **Production:**
```bash
uv run start        # Production server
```

### **Override Environment Variables:**
```bash
LOG_LEVEL=DEBUG uv run dev                    # Override log level
ENABLE_CLOUDWATCH_LOGGING=true uv run dev    # Enable CloudWatch locally
```

## Security Notes

- **Never commit `.env` files** - they're in `.gitignore`
- **LOG_PROMPTS_ONLY=true** ensures user content is never logged
- **CORS_ORIGINS** should be specific domains in production
- **ENABLE_CLOUDWATCH_LOGGING=false** for local development to avoid AWS costs
