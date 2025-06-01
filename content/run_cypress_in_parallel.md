---
title: Run Cypress in Parallel
---

Recently, I was looking for a way to run all my cypress tests in parallel in GitHub actions. The tests were running one after the other and it was taking too long.

So, here is what I did.

## 🔠 Basics

By default, all jobs run in parallel in GitHub Actions unless you put the need statement and make one job dependent on the other. But, if you need to run all tasks of a job in parallel then you need to use matrix feature of GitHub action.

Matrix allows you to run a set of variable values and each combination of those values will result in a different job or step that runs in parallel.

For example,

```yaml
jobs:
  build:
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macOS-latest]
        node-version: [10.x, 12.x, 14.x]
```

This would create 9 separate jobs, one for each combination of OS. More information in the Github Action Docs.

⚙️ Creating Parallel Jobs for Each Cypress Test

We need to create a matrix for each spec of Cypress tests so all tests run in parallel. Here, each spec represents all the tests contained in one file.

## 1️⃣ Create a JS File to Locate All Cypress Specs.

This file is later used in the .github/workflows folder. I created this file inside the cypress/support folder. But, you can choose to put this in the root or anywhere you like.

file name: `locateCypressSpecsToRun.js`

```js
const fs = require("fs");
const path = require("path");
const getAllFiles = (dirPath, arrayOfFiles = []) => {
  const files = fs.readdirSync(dirPath, { withFileTypes: true });

  files.forEach((file) => {
    if (file.isDirectory()) {
      arrayOfFiles = getAllFiles(`${dirPath}/${file.name}`, arrayOfFiles);
    } else {
      arrayOfFiles.push(`${path.join(dirPath, "/", file.name)}`);
    }
  });
  return arrayOfFiles;
};

const specs = getAllFiles("cypress/e2e");
process.stdout.write(`${JSON.stringify(specs)}\n`);
```

> [!NOTE]
> Pleaes note: You can't use .ts file extension here even if you are using typescript for your cypress because we need to run this file directly with node.

Inside the `getAllFiles()` I have put cypress/e2e path where all my tests are located. Modify this as needed.

If you run this file with the command node locateCypressSpecsToRun.js you should see,

//pretty version

```js
specs = [
  "cypress/e2e/test1.cy.ts",
  "cypress/e2e/test2.cy.ts",
  "cypress/e2e/test3.cy.ts",
  "cypress/e2e/test4.cy.ts",
  "cypress/e2e/test5.cy.ts",
];
```

## 2️⃣ Building the Matrix

After creating the strings of spec locations, it’s time to build a cypress matrix. The cypress matrix needs to be inside the job in yaml file.

```yaml
jobs:
build-cypress-matrix:
runs-on: ubuntu-latest
steps: - name: checkout code
uses: actions/checkout@v3 - id: set-matrix
run: echo "specs=$(node cypress/support/locateCypressSpecsToRun.js)" >> $GITHUB_OUTPUT
outputs:
specs: ${{ steps.set-matrix.outputs.specs }}
```

Explaining: `run` and `specs`

`run: echo "specs=$(node cypress/support/locateCypressSpecsToRun.js)" >> $GITHUB_OUTPUT`:

This line uses the run key to specify a shell command to run. In this case, the command is `echo` followed by a string that runs a Node.js script located in `cypress/support/locateCypressSpecsToRun.js`. The output of the script is captured by surrounding the command with `$()` and stored in a shell variable called specs. The `>>` operator appends the output of the command to a file called, `$GITHUB_OUTPUT` which is a predefined environment variable in GitHub Actions that captures the output of a step.
You can read more about `$GITHUB_OUTPUT` [here](https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/passing-information-between-jobs).

`outputs`: `specs: ${{ steps.set-matrix.outputs.specs }}`

This line uses the outputs key to define an output for the step called set-matrix. The output is called specs, and its value is set to the value of the specs variable that was set in the run command using the `${{ steps.set-matrix.outputs.specs }}` syntax. This allows subsequent steps in the workflow to access the value of the specs variable.
To simplify, we are assigning `specs: specs`.

## 3️⃣ Make Matrix Required for Other Jobs.

Make sure `build-cypress-matrix` job is completed before you run your tests. So, use Action’s needs statement. For example, you can do something like this.

```yaml
regression:
needs: [notify-slack-on-start, build-cypress-matrix]
# rest of the config ......
```

In this case, `notify-slack-on-start` is also required to run the `regression` job

## 4️⃣ Define Matrix

Inside the job you want to run in parallel, add your pre-built cypress test matrix. See the last specs: line.

```yaml
regression:
needs: [notify-slack-on-start, build-cypress-matrix]
runs-on: ubuntu-latest
strategy:
fail-fast: false
max-parallel: 64
matrix:
  config:
    [{ type: "desktop", config: "viewportWidth=1920,viewportHeight=1080" }]
  browser: [chrome, firefox, edge, safari]
  specs: ${{ fromJson(needs.build-cypress-matrix.outputs.specs) }}
```

In this case, I have three matrix defined.

- `browser`: All the browsers I want test
- One for `config`: the size of the browser
- finally `specs`:

fromJson: This function converts a JSON string to an object, read more about this github action function here. It is used to convert the output from the build-cypress-matrix job into an object.

needs: This function is used to indicate that the current job depends on the output from another job. In this case, it is used to indicate that the regression job needs the output from the build-cypress-matrix job.

So, `${{fromJson(needs.build-cypress-matrix.outputs.specs).specs}}` is first getting the output of the `build-cypress-matrix` job using `needs`. The `fromJson` function then converts this output from a JSON string to an object, which has a property called `specs` that contains the list of Cypress spec files to run. Finally, the `specs` property is extracted from the object and used as the value for the `specs` field in the `matrix` strategy for the `regression` job.

## 5️⃣ Use The Matrix

Finally, use the spec matrix just like you would for browsers or operating systems.

```yaml

- name: My Awesome Cypress Tests
        uses: cypress-io/github-action@v5
        with:
          browser: ${{ matrix.browser }}
          config: ${{ matrix.config.config }}
          spec: ${{ matrix.specs }}
```

## 💡Example

This is what a complete workflow could look like. Here is a live example:

```yaml

# sample document.
  name: Testing Parallel Runs

on:
  workflow_dispatch:

env:
  SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK_URL_CYPRESS }}
  SLACK_ICON: https://github.githubassets.com/images/modules/site/features/actions-icon-actions.svg
  SLACK_CHANNEL: cypress-notifications

jobs:
  notify-slack-on-start:
    runs-on: ubuntu-latest
    steps:
      - uses: rtCamp/action-slack-notify@v2.0.2
        name: notify slack on run start
        env:
          SLACK_TITLE: My Awesome Cypress Tests
          SLACK_COLOR: good
          SLACK_MESSAGE: 'Automation has started :white_check_mark:'

  build-cypress-matrix:
    runs-on: ubuntu-latest
    steps:
      - name: checkout code
        uses: actions/checkout@v3
      - id: set-matrix
        run: echo "specs=$(node cypress/support/locateCypressSpecsToRun.js)" >> $GITHUB_OUTPUT
    outputs:
      specs: ${{ steps.set-matrix.outputs.specs }}

  regression:
    needs: [notify-slack-on-start, build-cypress-matrix]
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      max-parallel: 64
      matrix:
        config:
          [
            {
              type: 'desktop',
              config: 'viewportWidth=1920,viewportHeight=1080',
            },
          ]
        browser: [chrome]
        specs: ${{ fromJson(needs.build-cypress-matrix.outputs.specs) }}
    env:
      NPM_TOKEN: ${{secrets.NPM_TOKEN}}
      CYPRESS_PASSWORD: ${{secrets.CYPRESS_PASSWORD}}
      CYPRESS_configFile: prod
# add other env as necessary

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: copy npmtoken to npmrc
        run: cp .npmtoken .npmrc
# this step is only necessary if you are using private npm packages and need to provide .npmrc to github runner.

      - name: My Awesome Cypress Tests
        uses: cypress-io/github-action@v5
        with:
          browser: ${{ matrix.browser }}
          config: ${{ matrix.config.config }}
          spec: ${{ matrix.specs }}

      - name: Generate report
        if: failure()
        uses: actions/upload-artifact@v2
        with:
          name: Failed on ${{matrix.browser}}-${{matrix.config.type}}
          path: |
            cypress/report/*
            cypress/screenshots/*
            cypress/videos/*

      - uses: rtCamp/action-slack-notify@v2.0.2
        name: notify slack on failure
        if: failure()
        env:
          SLACK_TITLE: Test(s) failed while running on ${{matrix.config.type}}
          SLACK_COLOR: danger
          SLACK_MESSAGE: ':failed: :computer-rage: Automation Failure on Prod! <${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}>'

  notify-slack-on-completion:
    needs: regression
    runs-on: ubuntu-latest
    steps:
      - uses: rtCamp/action-slack-notify@v2.0.2
        name: notify slack on run completion
        env:
          SLACK_TITLE: My Awesome Cypress Tests
          SLACK_COLOR: good
          SLACK_MESSAGE: ':pass: :white_check_mark: Automation Successful on Prod! <${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}>'
```

## 🏆 Conclusion

Finally, I want to share that this pattern can be used for any framework like Puppeteer, Jest, and others. The main benefit of this approach is that you don't have to pay for parallel running ability if it is behind the paywall. Also, it helps reduce the time you need to wait for all the jobs to complete.
