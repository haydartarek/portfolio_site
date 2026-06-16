import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const html = await readFile(
  new URL("../index.html", import.meta.url),
  "utf8",
);

test("includes a persistent theme toggle", () => {
  assert.match(html, /id="themeToggle"/);
  assert.match(html, /localStorage\.setItem\("portfolio-theme"/);
});

test("mobile menu button exposes animated icon lines", () => {
  assert.match(html, /class="menu-icon"/);
  assert.match(html, /menuBtn\.classList\.toggle\("is-open"/);
});

test("featured projects include role, challenge, and result summaries", () => {
  assert.equal((html.match(/class="case-study-grid"/g) || []).length, 3);
  assert.equal((html.match(/<dt>My Role<\/dt>/g) || []).length, 3);
  assert.equal((html.match(/<dt>Main Challenge<\/dt>/g) || []).length, 3);
  assert.equal((html.match(/<dt>Result<\/dt>/g) || []).length, 3);
});

test("top small projects include visual previews and live status badges", () => {
  for (const asset of [
    "intec-clone-preview.svg",
    "layangarage-preview.svg",
    "helpertje-preview.svg",
  ]) {
    assert.match(html, new RegExp(`assets/${asset}`));
  }

  assert.ok((html.match(/project-badge live/g) || []).length >= 3);
});

test("project previews expose hover actions", () => {
  assert.ok((html.match(/class="project-cover-actions"/g) || []).length >= 3);
});

test("about section shows recruiter proof metrics", () => {
  assert.match(html, />4\+<\/p>\s*<p class="stat-label">Years Technical IT Experience/);
  assert.match(html, />2026<\/p>\s*<p class="stat-label">Enterprise Java Certificate/);
  assert.match(html, />7<\/p>\s*<p class="stat-label">Professional-Rated Competencies/);
  assert.match(html, />3<\/p>\s*<p class="stat-label">Live Web Projects/);
});
