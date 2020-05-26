#!/bin/bash

set -e

service nginx start

node prod.js
