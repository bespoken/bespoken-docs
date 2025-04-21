---
title: Integrations
permalink: /api/integration
---

# Bespoken Integrations
We offer a variety of integations with external systems. The integrations come in three basic forms:
* Generating Tests from Flow Definitions
* Generating Tests from Test Plans
* Publishing Results

For generating tests, our system will analyze flows or test plans in the source system and turn these into automated tests. This can be useful for getting started faster with your automated testing.

For generating tests from flow definitions, we support the following Conversational AI systems:
* Amazon Lex
* Genesys Cloud CX
* Google Dialogflow
* VoiceFlow

For generating tests from test plans, we support the following testing tools:
* CSV/Excel
* QTest
* TestRail

For publishing test results, we support the following reporting/issue-tracking tools:
* [Amazon CloudWatch](#amazon-cloudwatch)
* DataDog
* Jira
* Splunk
* [Webhook](#webhook-integration)

To enable any of these integrations, simply drop us a line at [support@bespoken.io](mailto:support@bespoken.io).

## Amazon CloudWatch
### Integration Behavior
The CloudWatch Integration will publish metrics to Amazon CloudWatch Metrics using the [PutMetricData API](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_PutMetricData.html).

Two metrics will be published for each test that is run:
* TEST_PASSED - 0 or 1
* TEST_FAILED - 0 or 1

Additionally, the following dimensions will be published for each metric:
* TEST_SUITE_NAME
* TEST_NAME

The test results will all be published under the namespace `BESPOKEN`

### Integration Configuration
Follow these steps to setup the Amazon CloudWatch integration.

**Get your API key from the Dashboard**
* Go to the three dots on the top-right
* Click on My Account
* Copy the API key from the field on the lower-left of the page

**Add the integration**  
Call our integration API, as described [here](https://test-api.bespoken.io/api/docs/#/Integration%20Management/post_integration).

The payload should look like this:
```
{
    "credentials": {
        "AWS_ACCESS_KEY_ID": "<AWS_ACCESS_KEY_ID>",
        "AWS_SECRET_ACCESS_KEY": "<AWS_SECRET_ACCESS_KEY>",
        "REGION": "<AWS_REGION>"
    },
    "type": "CLOUDWATCH"
}
```

**Example call with CURL**
```
curl --location 'https://monolith.bespoken.io/api/integration?api-key=api-gSHR22xOIETAopGS8EufCX5M7TM2' \
    --header 'Content-Type: application/json' \
    --data '{
        "credentials": {
            "AWS_ACCESS_KEY_ID": "ACCESS_KEY_ID",
            "AWS_SECRET_ACCESS_KEY": "AWS_SECRET_ACCESS_KEY",
            "REGION": "us-east-1"
     },
    "type": "CLOUDWATCH"
}'
```

## Webhook Integration
### Webhook Behavior
The webhook will be called at the end of each test. It will call the registered webhook with the following payload:
```
{
    "event": "EVENT_NAME",
    "payload": "PAYLOAD"
}
```

The follwing events are currently sent:
* AFTER_DEVICE_RESPONSE - Sent after an interaction completes with the [DeviceRequest](https://test-api.bespoken.io/sdk/DeviceResponseDTO.html) 
* AFTER_TEST - Sent after a test completes with the [TestResult](https://test-api.bespoken.io/sdk/TestResultDTO.html) payload
* BEFORE_DEVICE_REQUEST - Sent before an interaction occurs with the [DeviceRequest](https://test-api.bespoken.io/sdk/DeviceRequestDTO.html) payload
* BEFORE_TEST - Sent before a test starts with the [Test](https://test-api.bespoken.io/sdk/TestDTO.html) payload

In the case of the AFTER_TEST event, the payload will look like this:
```
{
    "error": {
        message: "ERROR_MESSAGE"
    },
    "interactions": [
        {
            "actualValue": "ACTUAL_VALUE",
            "expectedValue": "EXPECTED_VALUE",
            "status": "PASS | FAIL"
        },
    ]
    "status": "PASS | FAIL",
    "test": {
        "name": "TEST_NAME",
        "testSuite": {
            "TEST_SUITE_NAME"
        }
    }
}
```

The [TestResult class](https://test-api.bespoken.io/sdk/TestResultDTO.html), part of the [Bespoken Node.js SDK](https://test-api.bespoken.io/sdk), can be used to parse the payload.

### Integration Configuration
Follow these steps to setup the Webhook integration.

**Get your API key from the Dashboard**
* Go to the three dots on the top-right
* Click on My Account
* Copy the API key from the field on the lower-left of the page

**Add the integration**  
Call our integration API, as described [here](https://test-api.bespoken.io/api/docs/#/Integration%20Management/post_integration).

The payload should look like this:
```
{
    "settings": {
        "URL": "WEBHOOK_URL"
    },
    "type": "WEBHOOK"
}
```
