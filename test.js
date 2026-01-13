const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function testWebsite() {
    console.log('Starting website test...');
    
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    const pages = ['index.html', 'about.html', 'services.html', 'contact.html'];
    let hasErrors = false;
    
    // Collect console errors
    const errors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') {
            errors.push(`Console Error: ${msg.text()}`);
        }
    });
    
    page.on('pageerror', err => {
        errors.push(`Page Error: ${err.message}`);
    });
    
    for (const pageName of pages) {
        const filePath = path.join(__dirname, pageName);
        
        if (fs.existsSync(filePath)) {
            console.log(`\nTesting ${pageName}...`);
            
            try {
                await page.goto(`file://${filePath}`, { waitUntil: 'networkidle' });
                
                // Check if page loaded successfully
                const title = await page.title();
                console.log(`✓ ${pageName} loaded successfully`);
                console.log(`  Title: ${title}`);
                
                // Check for key elements
                const header = await page.$('.header');
                const footer = await page.$('.footer');
                
                if (header) {
                    console.log('  ✓ Header found');
                } else {
                    console.log('  ✗ Header missing');
                    hasErrors = true;
                }
                
                if (footer) {
                    console.log('  ✓ Footer found');
                } else {
                    console.log('  ✗ Footer missing');
                    hasErrors = true;
                }
                
                // Check if CSS loaded
                const bodyStyles = await page.evaluate(() => {
                    return window.getComputedStyle(document.body).fontFamily;
                });
                
                if (bodyStyles && bodyStyles !== '') {
                    console.log('  ✓ CSS loaded successfully');
                } else {
                    console.log('  ✗ CSS may not be loaded');
                }
                
            } catch (error) {
                console.log(`✗ Error loading ${pageName}: ${error.message}`);
                hasErrors = true;
            }
        } else {
            console.log(`✗ ${pageName} not found`);
            hasErrors = true;
        }
    }
    
    await browser.close();
    
    console.log('\n--- Test Results ---');
    if (errors.length > 0) {
        console.log('Console/Page Errors:');
        errors.forEach(err => console.log(`  - ${err}`));
    } else {
        console.log('✓ No console errors detected');
    }
    
    if (hasErrors) {
        console.log('\n✗ Some tests failed');
        process.exit(1);
    } else {
        console.log('\n✓ All tests passed!');
        process.exit(0);
    }
}

testWebsite().catch(err => {
    console.error('Test failed:', err);
    process.exit(1);
});
