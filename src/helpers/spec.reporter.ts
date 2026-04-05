import type { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';

class SpecReporter implements Reporter {
  private printedSuites = new Set<string>();
  private results: { test: TestCase; result: TestResult }[] = [];

  onTestEnd(test: TestCase, result: TestResult) {
    this.results.push({ test, result });
  }

  private printSuiteHeader(parts: string[], projectName: string | undefined) {
    const suiteKey = parts.join(' › ');
    if (this.printedSuites.has(suiteKey)) return;
    this.printedSuites.add(suiteKey);
    console.log();
    if (projectName) console.log(`  [${projectName}]`);
    for (let i = 0; i < parts.length; i++) {
      console.log(`${'  '.repeat(i + 2)}${parts[i]}`);
    }
  }

  onEnd(fullResult: FullResult) {
    const finalIds = new Set<string>();
    for (const entry of this.results) {
      finalIds.add(entry.test.id);
    }

    for (const { test, result } of this.results) {
      const parts = test.titlePath().filter(Boolean);
      const projectName = parts.shift();
      const testTitle = parts.pop()!;

      this.printSuiteHeader(parts, projectName);

      const indent = '  '.repeat(parts.length + 2);
      const duration = `(${result.duration}ms)`;
      const isRetry = result.retry > 0;
      const retryLabel = isRetry ? ` [retry #${result.retry}]` : '';
      const icon = result.status === 'passed' ? '✓' : result.status === 'skipped' ? '-' : '✗';
      const color =
        result.status === 'passed'
          ? '\x1b[32m'
          : result.status === 'skipped'
            ? '\x1b[36m'
            : '\x1b[31m';
      const reset = '\x1b[0m';
      const dim = '\x1b[2m';

      console.log(
        `${indent}${color}${icon}${reset} ${testTitle}${dim}${retryLabel} ${duration}${reset}`,
      );
    }

    const finalResults = new Map<string, TestResult>();
    for (const { test, result } of this.results) {
      finalResults.set(test.id, result);
    }

    const passed = [...finalResults.values()].filter((r) => r.status === 'passed').length;
    const failed = [...finalResults.values()].filter((r) => r.status === 'failed').length;
    const skipped = [...finalResults.values()].filter((r) => r.status === 'skipped').length;
    const duration = (fullResult.duration / 1000).toFixed(1);

    console.log();
    const summary = [];
    if (passed) summary.push(`\x1b[32m${passed} passed\x1b[0m`);
    if (failed) summary.push(`\x1b[31m${failed} failed\x1b[0m`);
    if (skipped) summary.push(`\x1b[36m${skipped} skipped\x1b[0m`);
    console.log(`  ${summary.join(', ')} \x1b[2m(${duration}s)\x1b[0m`);
    console.log();
  }
}

export default SpecReporter;
