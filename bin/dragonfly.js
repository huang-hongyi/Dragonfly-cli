#!/usr/bin/env node

try {
  require('../domain/index');
} catch (err) {
  require('../dist/domain/index');
}