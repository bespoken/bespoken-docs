---
title: Test Page
permalink: /dashboard/test-page
sidebarDepth: 3
---

# Test Page

Now that you have created a test suite and your virtual devices, you are ready to work on the test page.

::: tip Important
In this article, we'll learn about aspects of this page that are common to all the platforms Bespoken supports. Platform-specific guides can be found [here](/guides/).
:::

The test page is divided into two main areas that work together to help you build comprehensive tests:

1. **Configuration Panel** (left sidebar):
    - Test Suite Settings: Basic configuration for running your test suite
    - Test Cases: Management of different test scenarios  
    - Monitoring: Automated test scheduling and failure notifications

2. **Test Editor** (main area): 
    - Visual or YAML editing of test steps and assertions
    - Test execution and results viewing
    - Real-time validation of your conversational flows

<br>

![Test Page sections](../assets/images/dashboard/test-page-sections.png)

## Configuration

For any platform you are working with, this configuration section will contain the minimum required parameters to start a test. These could include a locale, a voice, a URL, a phone number, etc. Common to all platforms, you'll need to specify the Virtual Device you want to use for testing.

## Test Case Management

![Test Options](../assets/images/dashboard/test-options.gif)

In this section of the page, you'll find all the test cases available for your current test suite. You can:
- Add a new test
- Rename a test
- Delete a test
- Clone a test
- Flag a test as "only" (more on this [here](#running-your-tests))
- Flag a test as "skip" (more on this [here](#running-your-tests))
- Reorder existing tests by dragging and dropping them in the desired order

## Test Script

The main area for your test scripts is composed of three columns: Input, Expected, and Actual. You'll use this section to add steps or interactions to your currently selected test case, configure them, and finally run your current test case.

### Test Script Structure

#### Input Column

The Input column contains what we will say to the platform we are testing. This could represent text that we will send to a messaging system, text that will be converted to audio (using a specified locale and voice), a URL containing pre-recorded audio to send, or even jQuery instructions to execute against a webpage.

#### Expected Column

In this column, we'll define the expected value for the current test interaction that, if received as part of the response, would make the assertion pass. The structure for each assertion is:

`[property] [operator] [value]`

A default assertion would look like this:

`[prompt] [contains] [value]`

Where `prompt` is the property that returns the main response content from the platform being tested: a transcription, a text message, a chatbot reply, etc., and `contains` represents a partial equality operator or, in other words, a substring search. In YAML format, the contains operator is represented by `:`. E.g., `prompt : "expected value"` would be valid if the response we get is "expected value" or "this is the expected value I got."

<!-- Other available operators are:
- != Not equal to
- \> Greater than
- \>= Greater than or equal
- < Less than
- <= Less than or equal -->

#### Actual Column

As you might expect, the Actual column contains the response that comes back from the platform being tested. This column will only appear when a test is running and will be populated sequentially as the responses come back.

#### Test Steps

You can add more test steps (also known as interactions) to your test case by clicking the "Add step" button below the last step on your test, or by clicking the "plus" sign to the right of each step. 

![Test Options](../assets/images/dashboard/test-page-interactions.gif)

Note that the plus sign will "insert" a new step below the current one, while the "Add step" button will always add an interaction at the end. Similarly, if you want to remove a step, you can click on the "x" icon to its right.

## Running Your Tests

Once you have configured and created all the steps for your test case, simply click on the "Run" button, and Bespoken will start running your tests. Responses will start populating the "Actual" column one by one as the test progresses. Be aware, if you leave the page at this moment, you won't be able to see your test results.

![Single test run](../assets/images/dashboard/test-page-run.gif)

If you want to run all test cases within your test suite, click on the "Run all tests" option button on the dropdown menu next to the "Run" button.
- If you only want to run a subset of tests, you can specify which ones to run by adding the "only" flag to them, by opening the three-dot menu on each test.
- Similarly, you can decide which tests to ignore altogether by selecting the "Skip" flag.

![Setting the "Only" flag](../assets/images/dashboard/test-page-only.gif)

::: warning Note
Running a whole test suite can take a while. Tests are run sequentially, and you won't be able to see all the results until all tests have completed running. You should also not leave the page while the test suite is running.
:::

## Interpreting the Results

As each response comes back, Bespoken will evaluate the assessments for the current interaction and will highlight in green the interactions that were successful and in red the interactions that failed. Moreover, Bespoken will highlight and format in bold the parts of the response that made the assertion pass. From our previous example where we looked for `expected value`, the response would look like: "this is the **expected value** I got."

![Test page results](../assets/images/dashboard/test-page-results.png)

## Other Options

### YAML Editor

All our tests are saved in YAML. You can directly edit your test suite in text format by clicking on the YAML editor toggle at the top right corner of the page. A typical test suite might look like this:

```yaml
---
- test: Test 1
- open my skill: welcome to my skill

---
- test: Test 2
- open my skill: welcome to my skill
- what is on my list: you have the following items on your list
```

Where:
- `---` is the start of a new test case
- `- test: Test 1` represents the name of your first test
- `open my skill: welcome to my skill` represents a first interaction in the form of `[input] [operator] [expected value]`

You can safely toggle between the regular editor and the YAML editor, and changes will be reflected on both sides.

### Skipping Input (Mute Mode)
For certain platforms (phone, webchat, and Watson), you may want to test scenarios where no input is sent to the system. This is useful for testing reprompts, timeout handling, or any situation where the bot should respond without receiving user input. To do this:

- Hover over any input field to reveal the mute icon.
- Click the icon to enable mute mode
- The input field will display "No input will be sent." in italic text
- Click the icon again to disable and return to normal input mode

When mute mode is enabled:

- The input field becomes read-only 
- The mute icon remains visible with a blue highlight to indicate the active state
- For phone tests: Silent audio is sent to the system (simulating a user not speaking)
- For webchat/Watson tests: No message is sent (simulating a user not typing)

![Mute input](../assets/images/dashboard/test-page-skipinput.gif)

In YAML format, muted steps are represented with the $MUTE keyword:

``` yaml
- $MUTE: I didn't hear that, could you repeat?
```

### Monitoring

![Advanced settings](../assets/images/dashboard/test-page-monitoring.gif)

You can enable Monitoring for your test suite by clicking on the Enable Monitoring toggle on the configuration panel. You can read more about how monitoring can help you ensure that your system remains stable by clicking [here](/monitoring/).

### Advanced Settings

![Advanced settings](../assets/images/dashboard/test-page-advanced.gif)

The "Advanced settings" window, which you can access by clicking on "Show advanced settings" link on the Test Suite Settings panel, contains parameters that can further modify the behavior or evaluation of a test run. Common parameters are:

| Property | Description | Default Value |
|---|---|---|
| Assertion fuzzy threshold | A decimal number from 0 to 1 that represents the threshold applied when using fuzzy matching to verify a prompt assertion. Setting this property to 1 means the values have to match exactly. | 0.8 |
| Max. response wait time | Interval in milliseconds to wait for a response. | 120000 |
| Stop tests on first failure | Stop the current test as soon as the first error is detected, saving time between runs| false |
| Lenient Mode | Removes common punctuation signs and extra white spaces from the transcript. | false |

Additionally, each platform has its own set of unique properties that will be explained in the [platform-specific guides](/guides/) section of these docs.

