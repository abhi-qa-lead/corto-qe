import type { Reporter, TestCase, TestResult, FullResult, Suite } from '@playwright/test/reporter';

export type ReporterStyle = 'mocha' | 'jest';

class SpecReporter implements Reporter {
  private printedSuites = new Set<string>();
  private fileResults = new Map<string, { test: TestCase; result: TestResult }[]>();
  private fileTotalTests = new Map<string, number>();
  private flushedFiles = new Set<string>();
  private allResults: { test: TestCase; result: TestResult }[] = [];
  private style: ReporterStyle;

  constructor(options?: { style?: ReporterStyle }) {
    this.style = options?.style ?? 'mocha';
  }

  onBegin(_config: unknown, suite: Suite) {
    for (const project of suite.suites) {
      for (const fileSuite of project.suites) {
        const fileKey = `${project.title} › ${fileSuite.title}`;
        this.fileTotalTests.set(fileKey, fileSuite.allTests().length);
      }
    }
  }

  onTestEnd(test: TestCase, result: TestResult) {
    this.allResults.push({ test, result });

    const parts = test.titlePath().filter(Boolean);
    const projectName = parts[0];
    const fileName = parts[1];
    const fileKey = `${projectName} › ${fileName}`;

    if (!this.fileResults.has(fileKey)) {
      this.fileResults.set(fileKey, []);
    }
    this.fileResults.get(fileKey)!.push({ test, result });

    const completedCount = this.fileResults.get(fileKey)!.length;
    const totalCount = this.fileTotalTests.get(fileKey) ?? 0;

    if (completedCount >= totalCount && !this.flushedFiles.has(fileKey)) {
      this.flushFile(fileKey);
    }
  }

  private flushFile(fileKey: string) {
    this.flushedFiles.add(fileKey);
    const results = this.fileResults.get(fileKey) ?? [];

    results.sort((a, b) => {
      const pathA = a.test.titlePath().join(' › ');
      const pathB = b.test.titlePath().join(' › ');
      return pathA.localeCompare(pathB);
    });

    for (const { test, result } of results) {
      this.printTest(test, result);
    }
  }

  private printSuiteHeader(parts: string[], projectName: string | undefined) {
    const suiteKey = [projectName, ...parts].join(' › ');
    if (this.printedSuites.has(suiteKey)) return;
    this.printedSuites.add(suiteKey);
    console.log();
    if (projectName) console.log(`  [${projectName}]`);
    for (let i = 0; i < parts.length; i++) {
      console.log(`${'  '.repeat(i + 2)}${parts[i]}`);
    }
  }

  private printTest(test: TestCase, result: TestResult) {
    const parts = test.titlePath().filter(Boolean);
    const projectName = parts.shift();
    const testTitle = parts.pop()!;

    this.printSuiteHeader(parts, projectName);

    const indent = '  '.repeat(parts.length + 2);
    const duration = `(${result.duration}ms)`;
    const isRetry = result.retry > 0;
    const retryLabel = isRetry ? ` [retry #${result.retry}]` : '';
    const reset = '\x1b[0m';
    const dim = '\x1b[2m';
    let status: string;

    if (this.style === 'jest') {
      status =
        result.status === 'passed'
          ? '\x1b[42m\x1b[30m PASS \x1b[0m'
          : result.status === 'skipped'
            ? '\x1b[43m\x1b[30m SKIP \x1b[0m'
            : '\x1b[41m\x1b[37m FAIL \x1b[0m';
    } else {
      const icon = result.status === 'passed' ? '✓' : result.status === 'skipped' ? '-' : '✗';
      const color =
        result.status === 'passed'
          ? '\x1b[32m'
          : result.status === 'skipped'
            ? '\x1b[36m'
            : '\x1b[31m';
      status = `${color}${icon}${reset}`;
    }

    console.log(`${indent}${status} ${testTitle}${dim}${retryLabel} ${duration}${reset}`);

    if (result.status === 'failed' || result.status === 'timedOut') {
      const errorIndent = indent + '  ';
      for (const error of result.errors) {
        const message = error.message ?? error.stack ?? 'Unknown error';
        for (const line of message.split('\n')) {
          console.log(`${errorIndent}\x1b[31m${line}\x1b[0m`);
        }
      }
    }
  }

  onEnd(fullResult: FullResult) {
    const finalResults = new Map<string, TestResult>();
    for (const { test, result } of this.allResults) {
      finalResults.set(test.id, result);
    }

    const passed = [...finalResults.values()].filter((r) => r.status === 'passed').length;
    const failed = [...finalResults.values()].filter(
      (r) => r.status === 'failed' || r.status === 'timedOut' || r.status === 'interrupted',
    ).length;
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
