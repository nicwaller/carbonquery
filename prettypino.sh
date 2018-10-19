#!/usr/bin/env bash
source $(brew --prefix nvm)/nvm.sh
nvm use --delete-prefix v8.12.0
yarn exec node $@ 2>&1 | ./node_modules/.bin/pino-pretty
exit ${PIPESTATUS[0]}
