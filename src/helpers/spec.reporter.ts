import type { Reporter, TestCase, TestResult, Suite } from '@playwright/test/reporter';

class SpecReporter implements Reporter {
  private printedSuites = new Set<string>();

  onTestEnd(test: TestCase, result: TestResult) {
    const parts = test.titlePath().filter(Boolean);
    const projectName = parts.shift(); // e.g. "ui-tests" or "api-tests"
    const testTitle = parts.pop()!;
    const suiteKey = parts.join(' › ');

    if (!this.printedSuites.has(suiteKey)) {
      this.printedSuites.add(suiteKey);
      console.log();
      if (projectName) console.log(`  [${projectName}]`);
      for (let i = 0; i < parts.length; i++) {
        console.log(`${'  '.repeat(i + 2)}${parts[i]}`);
      }
    }

    const indent = '  '.repeat(parts.length + 2);
    const duration = `(${result.duration}ms)`;
    const icon = result.status === 'passed' ? '✓' : result.status === 'skipped' ? '-' : '✗';
    const color =
      result.status === 'passed'
        ? '\x1b[32m'
        : result.status === 'skipped'
          ? '\x1b[36m'
          : '\x1b[31m';
    const reset = '\x1b[0m';
    const dim = '\x1b[2m';

    console.log(`${indent}${color}${icon}${reset} ${testTitle} ${dim}${duration}${reset}`);
  }

  onEnd() {
    console.log();
  }
}

export default SpecReporter;
