import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto('http://localhost:8000/#projects')
        
        # Check if cards are stacked or absolute
        cards = await page.locator('.playing-card').all()
        for i, card in enumerate(cards):
            box = await card.bounding_box()
            pos = await card.evaluate('el => window.getComputedStyle(el).position')
            print(f"Card {i+1}: position={pos}, bounding_box={box}")
            
        await browser.close()

asyncio.run(main())
