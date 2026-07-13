const { test, expect } = require("@playwright/test");

test("Dialog", async ({ page }) => {
  await page.goto("https://testautomationpractice.blogspot.com/");

  page.once("dialog", async (dialog) => {
    await page.waitForTimeout(1000);

    expect(dialog.message()).toEqual("I am an alert box!");
    await dialog.accept();
  });

  await page.getByRole("button", { name: "Simple Alert" }).click();
  // await page.getByRole('button', { name: 'Confirmation Alert' }).click();

  page.once("dialog", async (dialog) => {
    await page.waitForTimeout(1000);
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss();
  });
  await page.getByRole("button", { name: "Confirmation Alert" }).click();
});

test("testConfirmation", async ({ page }) => {
  await page.goto("https://testautomationpractice.blogspot.com/");

  page.once("dialog", async (dialog) => {
    await page.waitForTimeout(1000);
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss();
  });
  await page.getByRole("button", { name: "Confirmation Alert" }).click();

  await page.waitForTimeout(5000);
});

test.only("testPrompt", async ({ page }) => {
    await page.goto("https://testautomationpractice.blogspot.com/");
  
    page.once("dialog", async (dialog) => {
      await page.waitForTimeout(1000);
      
      console.log(dialog.type())
      console.log(`Dialog message: ${dialog.message()}`);

    //   await dialog.dismiss();
    //   expect(page.locator('#demo')).toHaveText('User cancelled the prompt.')

    //   await dialog.accept();
    //   expect(page.locator('#demo')).toHaveText('Hello Harry Potter! How are you today?.')

      await dialog.accept('asdasd');
      expect(page.locator('#demo')).toHaveText('Hello asdasd! How are you today?')
    });

    await page.getByRole("button", { name: "Prompt Alert" }).click();
    await page.waitForTimeout(2000);
  });

test("Dialog1", async ({ page }) => {
  await page.goto("https://testautomationpractice.blogspot.com/");

  // Single dialog handler
  page.on("dialog", async (dialog) => {
    const message = dialog.message();
    await page.waitForTimeout(500); // just to observe

    if (message === "I am an alert box!") {
      console.log("Simple Alert:", message);
      expect(message).toBe("I am an alert box!");
      await dialog.accept();
    } else if (message === "Press a button!") {
      console.log("Confirmation Alert:", message);
      expect(message).toBe("Press a button!");
      await dialog.dismiss();
    } else {
      console.warn("Unexpected dialog:", message);
      await dialog.dismiss(); // Safe fallback
    }
  });

  // Trigger both dialogs
  await page.getByRole("button", { name: "Simple Alert" }).click();
  await page.getByRole("button", { name: "Confirmation Alert" }).click();
});
