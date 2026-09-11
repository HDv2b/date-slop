import { type Page, expect, test } from "@playwright/test";

const greeting = "Tell me something that helps me find your date of birth.";

async function mockGuessApi(
  page: Page,
  options: { greetingStatus?: number } = {},
) {
  await page.route("**/api/guess**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());

    if (request.method() === "GET") {
      if (url.searchParams.has("keepalive")) {
        await route.fulfill({
          contentType: "application/json",
          body: JSON.stringify({ warmed: true }),
        });
        return;
      }

      const status = options.greetingStatus ?? 200;
      await route.fulfill({
        status,
        contentType: "application/json",
        body:
          status === 200
            ? JSON.stringify({ assistant: greeting })
            : JSON.stringify({ error: "Upstream failure" }),
      });
      return;
    }

    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        assistant: "I have made a very confident guess.",
        confirmedGuess: "1990-01-02",
      }),
    });
  });
}

test("validates the required form fields", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Proceed" }).click();

  await expect(page.getByText("We need a name!", { exact: true })).toBeVisible();
  await expect(
    page.getByText("We need a location!", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("We need a date!", { exact: true })).toBeVisible();
});

test("completes the date assistant flow", async ({ page }) => {
  await mockGuessApi(page);
  await page.goto("/");

  await page.getByLabel("Name").fill("Ada Lovelace");
  await page.getByLabel("Location").fill("London");
  await page.getByLabel("Date of Birth").click();

  const chatDialog = page.getByRole("dialog");
  await expect(chatDialog).toBeVisible();
  await expect(chatDialog.getByText(greeting)).toBeVisible();

  await chatDialog.getByPlaceholder("Reply").fill("A clue about computing");
  await chatDialog.getByRole("button", { name: "Reply" }).click();

  await expect(page.getByLabel("Date of Birth")).toHaveValue("1990-01-02");
  await expect(chatDialog).not.toBeVisible();

  await page.getByRole("button", { name: "Proceed" }).click();

  const endDialog = page.getByRole("dialog");
  await expect(endDialog).toContainText("Name: Ada Lovelace");
  await expect(endDialog).toContainText("Location: London");
  await expect(endDialog).toContainText("DoB:");

  await endDialog.getByRole("button", { name: "Go again?" }).click();
  await expect(page.getByLabel("Name")).toHaveValue("");
  await expect(page.getByLabel("Location")).toHaveValue("");
  await expect(page.getByLabel("Date of Birth")).toHaveValue("");
});

test("shows an error when the assistant cannot be reached", async ({ page }) => {
  await mockGuessApi(page, { greetingStatus: 502 });
  await page.goto("/");

  await page.getByLabel("Date of Birth").click();

  await expect(
    page
      .getByRole("alert")
      .filter({ hasText: "The agent could not be reached." }),
  ).toHaveText(
    "The agent could not be reached. Close this and try again.",
  );
});
