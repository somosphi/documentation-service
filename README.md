# Documentation Service

## Permissões

### IAM de leitura

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "VisualEditor0",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "sns:ConfirmSubscription",
        "sns:Unsubscribe",
        "s3:ListBucket",
        "cloudfront:CreateInvalidation"
      ],
      "Resource": [
        "arn:aws:sns:{regiao}:{conta}:{topico}",
        "arn:aws:s3:::{bucket}",
        "arn:aws:s3:::{bucket}/*",
        "arn:aws:cloudfront::*:distribution/{distributionId}"
      ]
    }
  ]
}
```

### IAM de escrita

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "VisualEditor0",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:AbortMultipartUpload",
        "s3:ListBucket",
        "s3:DeleteObject",
        "s3:GetObjectVersion",
        "s3:ListMultipartUploadParts"
      ],
      "Resource": [
        "arn:aws:s3:::{bucket}",
        "arn:aws:s3:::{bucket}/*"
      ]
    }
  ]
}
```

### SNS

Política de acesso do serviço SNS

```json
{
  "Version": "2008-10-17",
  "Id": "__default_policy_ID",
  "Statement": [
    {
      "Sid": "__default_statement_ID",
      "Effect": "Allow",
      "Principal": {
        "AWS": "*"
      },
      "Action": "SNS:Publish",
      "Resource": "arn:aws:sns:{regiao}:{conta}:{topico}",
      "Condition": {
        "ArnLike": {
          "aws:SourceArn": "arn:aws:s3:*:*:{bucket}"
        }
      }
    }
  ]
}
```

## Variáveis de Ambiente

### Requerido

|Variável|Descrição|
|--------|---------|
|AWS_ACCESS_KEY_ID|Especifica uma chave de acesso da AWS associada a um usuário.|
|AWS_SECRET_ACCESS_KEY|Especifica a chave secreta associada à chave de acesso.|
|AWS_REGION|Especifica a região da AWS para a qual enviar a solicitação.|
|AWS_BUCKET|Bucket onde fica localizando a documentação|
|AWS_SNS_ARN|ARN do serviço SNS, exemplo: `arn:aws:sns:{regiao}:{conta}:{topico}`|

### Opcional

|Variável|Padrão|Descrição|
|--------|------|---------|
|AWS_CLOUDFRONT_ID|`null`|ID do CloudFront para invaluidação de cache.|
|CORS_ORIGIN|`*`|Configura a origin do CORS.|
|SNS_LOG|`false`|Habilita o log das requests do SNS.|
|PORT|`3000`|Porta do serviço.
|ROUTE|`/`|Prefixo das rotas do serviço.

### APM

> REF: [APM Node.js Agent Reference](https://www.elastic.co/guide/en/apm/agent/nodejs/current/configuration.html#configuration)

Para ativar o APM é necessário configurar no mínimo a variável `ELASTIC_APM_SERVICE_NAME`.
