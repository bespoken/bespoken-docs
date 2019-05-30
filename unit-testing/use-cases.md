<!-- ---
# Unit-Testing Use-Cases
layout: default
keywords:
comments: false

# Hero section
title: Unit-Testing Use-Cases
description: Guide to Common Unit-Testing Use-Cases

# Micro navigation
micro_nav: true
--- -->
# Guide to Common Unit-Testing Use-Cases

## Common Use-Cases And How To Handle Them

* [Testing State With Dynamo](#testing-with-dynamo)
* [Testing The Address API](#testing-with-the-address-api)

## Testing With Dynamo
Dynamo can be tricky to test with locally, because there is lots of setup to be done to work with Dynamo locally on your laptop.

To bypass this, simple enable our mock dynamo in your testing configuration:
```
configuration:
  dynamo: mock
  userId: MyUserID
```

With this enabled, a local in-memory version of Dynamo will be used instead.

You can also specifiy values for `userId` and `deviceId` in the configuration.
In this way, different user scenarios can be worked on.

The mock Dynamo DB will maintain it's state for the execution of the entire test suite (a single file).
It will be **reset** between test file executions, so it will be wiped clean when a new test file begins running.

In that way, the state can be modified from test to test and checked.

More information on [how it works here](https://github.com/bespoken/virtual-alexa/blob/master/docs/Externals.md#dynamodb).

## Testing With The Address API
The Address API can also be mocked, and specified to reply with a specific value.

To set the address to be returned from the Address API via mock, just enter a configuration like so:
```
configuration:
  address:
    addressLine1: 1600 Pennsylvania Avenue, NW
    city: Washington
    countryCode: US
    postalCode: 20816
    stateOrRegion: DC
```

That will return a full address when the Alexa Address API is called.

To emulate just the countryAndPostalCode permission, enter an address with just those values:
```
configuration:
  address:
    countryCode: US
    postalCode: 20816
```

This will return the country and postal code when requested - **NOTE** it will return a 403 if the full address is requested. The other address fields must be provided to emulate the user providing the full permission.

If no address information is provided, the Address API will return a 403 - which indicates no permission was received from the user.

