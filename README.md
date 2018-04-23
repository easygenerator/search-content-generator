# search-content-generator
service that generates search content for the requested course

## Getting started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Installing

1. Clone this repository locally
2. Run `npm install` or `yarn` in the root directory
3. Configure several environment variables:

* S3_CACHE_BUCKET_NAME - AWS bucket name to cache generated files 

* S3_ACCESS_KEY_ID - AWS access key to access the cache bucket

* S3_SECRET_ACCESS_KEY - AWS access secret to access the cache bucket 

optional environment variables:

* S3_REGION - AWS bucket region. Default is `us-east-1`

* IP - IP for the express app. Default is `127.0.0.1`

* PORT - Port for the express app. Default is `3036`

4. Run `npm start` or `yarn start` to run application locally

### Run with serverless

Application is wrapped as a serverless function (check [serverless.js](https://serverless.com/framework/docs/)). That's why you can also [run it with serverless CLI locally](https://serverless.com/framework/docs/providers/aws/cli-reference/invoke-local/).

## Developing

Use `node.js 7.x or higher` to develop and run the app. 

NOTE: The application is an express app wrapped with serverless framework. If you are going to deploy an app as lambda function do not use `node.js` higher than `8.10`. At the moment of writing `8.10` is the latest version supported by AWS lambda.

### Tests running

To run test execute `npm run test` or `yarn test`

## Deployment

### Regular deployment

Application can be deployed as regular `express.js` app. Don't forget to specify needed environment variables.

### Deployement with serverless

Application can be deployed as AWS Lambda function. Use next command to deploy an app:

Windows PowerShell:
```
    $env:AWS_BUCKET_SUFFIX="[AWS_BUCKET_SUFFIX]";$env:AWS_DEFAULT_ROLE_ARN="[AWS_DEFAULT_ROLE_ARN]";$env:AWS_ACCESS_KEY_ID="[AWS_ACCESS_KEY_ID]"; $env:AWS_SECRET_ACCESS_KEY="[AWS_SECRET_ACCESS_KEY]"; serverless deploy
```    

Unix:
```
    env AWS_BUCKET_SUFFIX="[AWS_BUCKET_SUFFIX]" \
    env AWS_DEFAULT_ROLE_ARN="[AWS_DEFAULT_ROLE_ARN]" \
    env AWS_ACCESS_KEY_ID="[AWS_ACCESS_KEY_ID]" \
    env AWS_SECRET_ACCESS_KEY="[AWS_SECRET_ACCESS_KEY]" \
    serverless deploy
```

where:

* AWS_BUCKET_SUFFIX - is a bucket suffix to make it unique. May be your organization's domain, like `.example.com`

* AWS_DEFAULT_ROLE_ARN - AWS role that will be used by the function

* AWS_ACCESS_KEY_ID - AWS access key that will be used by the serverless framework to deploy your funation and create all needed infrastructure

* AWS_SECRET_ACCESS_KEY - AWS access secret that will be used by the serverless framework to deploy your funation and create all needed infrastructure

more information about serverless deployment you can find in the ([serverless.js documentation](https://serverless.com/framework/docs/)).

Deploying with serverless you can also specify build options. For instance you can specify stage you deploying to:

```
serverless deploy --stage production
```
