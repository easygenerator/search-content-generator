# search-content-generator
service that generates search content for the requested course

## Getting started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Installing

1. Clone this repository locally
2. Run `npm install` in the root directory
3. Configure several environment variables:

* S3_CACHE_BUCKET_NAME - AWS bucket name to cache generated files 

* S3_ACCESS_KEY_ID - AWS access key to access the cache bucket

* S3_SECRET_ACCESS_KEY - AWS access secret to access the cache bucket 

    optional environment variables:

* S3_REGION - AWS bucket region. Default is `us-east-1`

* IP - IP for the express app. Default is `127.0.0.1`

* PORT - Port for the express app. Default is `3036`

4. Run `npm start` to run application locally

## Developing

> Use `node.js 10.x or higher` to develop and run the app.

### Run with serverless

You need to create branch `development` and it will be deployed to AWS using `serverless`

Also you can [run it with serverless CLI locally](https://serverless.com/framework/docs/providers/aws/cli-reference/invoke-local/).

### Run with Visual Studio Code

If you are using Visual Studio Code you can use two existing launch configurations. To launch tests you can use `Run tests` configuration without any changes. If you want to run the app use `Launch Program` configuration but first you have to fill proper values for the next environment variables:
```
"env": {
    "S3_ACCESS_KEY_ID": "accessKey",
    "S3_SECRET_ACCESS_KEY": "accessSecret",
    "S3_CACHE_BUCKET_NAME": "bucketName"
}
```

### Tests running

To run tests execute `npm run test`

## Usage

To get course search content you have to use `/search-content` path and to specify course url in the query string. For instance: 
```
http://localhost:3036/search-content?url=https://elearning.easygenerator.com/bf9a6632-9ce7-4007-92ca-0cb6fd1f7e29/
```

If you are using deployed AWS lambda app, you have to add `x-api-key` (AWS Lambda API Key) header to the request with the proper API Key.

> **API Key** and **Service url** will be generated during the serverless deployment and can be checked in AWS for you Lambda function.

## Deployment

### Regular deployment

Application can be deployed as regular `express.js` app. Don't forget to specify needed environment variables.

### Deployment with serverless

Application can be deployed as AWS Lambda function. You have to have serverless.js installed globally. To do this execute next command:
```
npm install -g serverless
```

Next use following command to deploy the app:

Windows PowerShell:
```
    $env:AWS_BUCKET_SUFFIX="[AWS_BUCKET_SUFFIX]"; `
    $env:AWS_DEFAULT_ROLE_ARN="[AWS_DEFAULT_ROLE_ARN]"; `
    $env:AWS_REGION="[AWS_REGION]"; `
    $env:AWS_ACCESS_KEY_ID="[AWS_ACCESS_KEY_ID]"; `
    $env:AWS_SECRET_ACCESS_KEY="[AWS_SECRET_ACCESS_KEY]"; serverless deploy
```    

Unix:
```
    env AWS_BUCKET_SUFFIX="[AWS_BUCKET_SUFFIX]" \
    env AWS_DEFAULT_ROLE_ARN="[AWS_DEFAULT_ROLE_ARN]" \
    env AWS_REGION="[AWS_REGION]" \
    env AWS_ACCESS_KEY_ID="[AWS_ACCESS_KEY_ID]" \
    env AWS_SECRET_ACCESS_KEY="[AWS_SECRET_ACCESS_KEY]" \
    serverless deploy
```

where:

* AWS_BUCKET_SUFFIX - is a bucket suffix to make it unique. May be your organization's domain, like `.example.com`

* AWS_DEFAULT_ROLE_ARN - AWS role that will be used by the function

* AWS_REGION - AWS region that will be used by the serverless framework to deploy your function and create/access all needed infrastructure

* AWS_ACCESS_KEY_ID - AWS access key that will be used by the serverless framework to deploy your function and create/access all needed infrastructure

* AWS_SECRET_ACCESS_KEY - AWS access secret that will be used by the serverless framework to deploy your function and create/access all needed infrastructure

IMPORTANT: when deploying with serverless you can skip S3_CACHE_BUCKET_NAME, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY  environment variables they will be initialized with variables listed above. You should also grant needed permissions to the user you are using for the deployment. For more information check [serverless.js AWS credentials guide](https://serverless.com/framework/docs/providers/aws/guide/credentials/).

More information about serverless deployment you can find in the [serverless.js documentation](https://serverless.com/framework/docs/). 

Deploying with serverless you can also specify build options. For instance you can specify stage you deploying to:
```
serverless deploy --stage production
```

or in case you don't want to output API Key to the console (usefull for builds with external CI tools) you should add `--conceal` option:
```
serverless deploy --conceal --stage production
```

### CI/CD

After merge any changes to `master` they will be automatically deployed to staging instance on AWS using **serverless**

To deploy changes to production run `npm version {major|minor|patch}`