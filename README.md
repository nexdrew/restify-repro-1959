## Intro

This repo contains code to demonstrate how restify can crash the Node process when the normal `restify.pre.sanitizePath()` is used and an unexpected request is received by the server.

## Setup

To test this repo locally, please do the following:

1. Clone this repo to your local machine
2. Install restify v11.1.0 and other dependencies via `npm ci`

## Reproduce Error

To reproduce the crash/error, do the following:

1. Run the "normal" server via `node server.js`
2. Send an expected request and get back a "hello" response:

    ```sh
    curl http://localhost:3000
    ```

3. Send an unexpected request and crash the server:

    ```sh
    curl http://localhost:3000//
    ```

## Test Workaround 1

One option to fix the potential error and avoid crashing the process is to use a custom router that avoids the lookup when `req.getUrl().pathname` is an empty string.

You can test this option by running the server with `node server.js router` and repeating the curl requests above.

## Test Workaround 2

Another option is to use a custom `sanitizePath` pre plugin that returns a default `/` url when the stripped url results in an empty string.

You can test this option by running the server with `node server.js sanitize` and repeating the curl requests above.

## Proposal

Workaround 1 seems more robust, but workaround 2 is simpler/more straightforward.

Perhaps we should use both to "fix" this problem within restify.
