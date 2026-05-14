const test = require("node:test");
const assert = require("node:assert/strict");
const { readSiteContent } = require("../siteContent");

test("readSiteContent returns API message keys", () => {
  const content = readSiteContent();

  assert.ok(content);
  assert.equal(typeof content, "object");
  assert.ok(content.apiMessages);
  assert.equal(
    content.apiMessages.subscribeNameEmailRequired,
    "Імʼя та email обовʼязкові"
  );
});
