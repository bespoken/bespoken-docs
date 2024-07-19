---
title: History
permalink: /dashboard/history
---

# The History Page
The History page is where you'll find all the historic results for your test runs. By default, you'll see results for the last two weeks on all your test suites and across the different Bespoken clients (API, CLI, Dashboard, Monitoring). Among the charts and data you can find are: 

![History page](../assets/images/dashboard/history-numbered.png)

1. Test runs evolution over time: Line graphic that shows the number of executed tests, number of successful and failed tests per day.
2. Number of executed tests
3. Success and failure rate for the selected dates
4. Average execution time per test
5. Test run results: Tabular data with information about the number of test suites and tests executed on a run.
6. Test runs by platform: Donut chart that shows the percentage of tests executed across different platforms available.
7. Test runs by client: Donut chart that shows the percentage of tests executed across different Bespoken clients.

All data can be filtered by Project Name, Platform, Locale, and Dates by changing these values and clicking on the "Refresh" button at the top of the page. Additionally, you can export your results by clicking on the "Download CSV" link at the top.

## Test Run Results and Details
The test run results table at the bottom of the screen is where you'll find detailed information about each run with Bespoken. It comprises the following columns:
- Date and time of the test run
- Client used to run your tests (Dashboard, CLI, HTTP)
- Project Name associated with one or more test suites
- Platform that was tested
- Number of test suites executed
- Number of tests executed
- Success percentage. This column is color-coded based on the results, where green represents a success level above 80%, yellow represents a success level above 50%, and red represents any value below that.

![History details](../assets/images/dashboard/history-details.gif)

Clicking on any of the rows within the table will open a detailed view of said run with the following sections:

- Summary of all test suites and test cases and their results
- Test suite and tests success percentage as charts.
- Detailed results for all test suites and test cases

The detailed results will show you all the steps executed per test including utterances, expected results, and actual results. Steps that were successful will have a green icon next to them, while failed steps will have a red one.

Finally, for each executed IVR and Webchat tests, recorded evidence is available to view, listen, and download.
