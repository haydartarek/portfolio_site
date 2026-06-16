import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const html = await readFile(
  new URL("../index.html", import.meta.url),
  "utf8",
);

test("hero presents the verified Java developer positioning", () => {
  assert.match(
    html,
    /Junior Java Developer \| VDAB-Certified Enterprise Java Developer/,
  );
  assert.match(html, /17 March 2025 to 13 March 2026/);
});

test("portfolio includes a recruiter-focused value proposition", () => {
  assert.match(html, /id="strengths"/);
  assert.match(html, /What I Bring/);
  assert.match(html, /Java Development \+ Technical IT Operations/);
});

test("verified competency levels are clearly presented", () => {
  assert.match(html, /Verified Competencies/);
  assert.match(html, /Professional Level/);
  assert.match(html, /Java · Spring Framework · OOP/);
  assert.match(html, /Strong Working Level/);
  assert.match(html, /SQL · Angular · Web API · TDD/);
});

test("recruiter proof metrics and certification facts are accurate", () => {
  assert.match(html, />4\+<\/p>\s*<p class="stat-label">Years Technical IT Experience/);
  assert.match(html, />2026<\/p>\s*<p class="stat-label">Enterprise Java Certificate/);
  assert.match(html, />7<\/p>\s*<p class="stat-label">Professional-Rated Competencies/);
  assert.match(html, />3<\/p>\s*<p class="stat-label">Live Web Projects/);
});

test("official CV and recruiter links are updated", () => {
  assert.match(html, /assets\/Haydar_Tarek_Java_Developer\.pdf/);
  assert.match(html, /linkedin\.com\/in\/haydartarek-dev/);
  assert.match(html, /View Credentials/);
});

test("sensitive competency report is not publicly linked", () => {
  assert.doesNotMatch(html, /Competentierapport\.pdf/);
  assert.doesNotMatch(html, /contractnummer|inschrijvings-ID|12726423/);
});
