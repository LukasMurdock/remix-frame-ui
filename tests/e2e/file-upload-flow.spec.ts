import { expect, test } from "@playwright/test"

test("file upload accepts multiple files", async ({ page }) => {
  await page.setContent(`
    <label for="files">Upload files</label>
    <input id="files" type="file" name="files" accept="image/*,.pdf" multiple />
    <p id="state"></p>
    <script>
      const input = document.querySelector('#files');
      const state = document.querySelector('#state');
      input.addEventListener('change', () => {
        const files = input.files;
        state.textContent = files ? String(files.length) : '0';
      });
    </script>
  `)

  const files = page.locator("#files")
  await files.setInputFiles([
    {
      name: "avatar.png",
      mimeType: "image/png",
      buffer: Buffer.from("fake-png"),
    },
    {
      name: "notes.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("fake-pdf"),
    },
  ])

  await expect(page.locator("#state")).toHaveText("2")
})
