import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const html = await readFile(
  new URL("../index.html", import.meta.url),
  "utf8",
);

function relativeLuminance(hex) {
  const rgb = hex
    .replace("#", "")
    .match(/.{2}/g)
    .map((value) => Number.parseInt(value, 16) / 255)
    .map((value) =>
      value <= 0.03928
        ? value / 12.92
        : ((value + 0.055) / 1.055) ** 2.4,
    );

  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

function contrastRatio(foreground, background) {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

test("dark theme defines one semantic high-contrast palette", () => {
  for (const token of [
    "--dark-bg:",
    "--dark-surface:",
    "--dark-surface-raised:",
    "--dark-text-primary:",
    "--dark-text-secondary:",
    "--dark-text-muted:",
    "--dark-border:",
    "--dark-accent:",
  ]) {
    assert.match(html, new RegExp(token));
  }
});

test("dark theme covers every major content group", () => {
  for (const selector of [
    ".hero-meta",
    ".stat-label",
    ".strength-card",
    ".skill-card",
    ".project-card",
    ".timeline-card",
    ".panel",
    ".contact-link",
    ".footer-wrap",
  ]) {
    assert.match(
      html,
      new RegExp(`html\\[data-theme="dark"\\][\\s\\S]*?${selector.replace(".", "\\.")}`),
    );
  }
});

test("dark theme unifies controls, tags, and interactive states", () => {
  assert.match(html, /html\[data-theme="dark"\] :is\([\s\S]*?\.btn-ghost/);
  assert.match(html, /html\[data-theme="dark"\] :is\([\s\S]*?\.pill/);
  assert.match(html, /html\[data-theme="dark"\] :is\([\s\S]*?\.contact-link/);
  assert.match(html, /html\[data-theme="dark"\] :is\([\s\S]*?:hover/);
});

test("dark theme fixes terminal and project overlay readability", () => {
  assert.match(html, /html\[data-theme="dark"\] \.hero-terminal/);
  assert.match(html, /html\[data-theme="dark"\] \.terminal-screen/);
  assert.match(html, /html\[data-theme="dark"\] \.project-cover-actions a/);
});

test("dark theme fully styles education cards and section counters", () => {
  assert.match(
    html,
    /html\[data-theme="dark"\] :is\(\s*\.edu-item,\s*\.lang-item\s*\) \{[\s\S]*?border-color: var\(--dark-border\);[\s\S]*?background: rgba\(23, 42, 64, 0\.9\);/,
  );
  assert.match(
    html,
    /html\[data-theme="dark"\] \.edu-item strong \{[\s\S]*?color: var\(--dark-text-primary\);/,
  );
  assert.match(
    html,
    /html\[data-theme="dark"\] :is\(\s*\.hero-kicker,\s*\.section-counter\s*\) \{[\s\S]*?border-color: var\(--dark-border\);[\s\S]*?background: rgba\(19, 36, 56, 0\.92\);/,
  );
  assert.match(
    html,
    /html\[data-theme="dark"\] :is\(\s*\.hero-kicker,\s*\.section-counter\s*\)::before \{[\s\S]*?background: var\(--dark-accent-strong\);/,
  );
});

test("dark theme semantic text colors meet WCAG AA contrast", () => {
  assert.ok(contrastRatio("#f5f8fc", "#07111d") >= 7);
  assert.ok(contrastRatio("#c4cfdd", "#0d1b2a") >= 4.5);
  assert.ok(contrastRatio("#9eacc0", "#0d1b2a") >= 4.5);
  assert.ok(contrastRatio("#9bdcf4", "#07111d") >= 4.5);
});
