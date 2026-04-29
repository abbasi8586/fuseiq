const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function htmlToPdf(inputFile, outputFile, options = {}) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const filePath = path.resolve(inputFile);
  await page.goto('file://' + filePath, { waitUntil: 'networkidle' });
  
  // Add professional styling
  await page.addStyleTag({
    content: `
      @page {
        size: A4;
        margin: 20mm 15mm 25mm 15mm;
        @bottom-center {
          content: counter(page);
          font-family: 'Inter', -apple-system, sans-serif;
          font-size: 10px;
          color: #666;
        }
      }
      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        line-height: 1.6;
        color: #1a1a2e;
      }
      h1, h2, h3 { 
        color: #00D4FF; 
        page-break-after: avoid;
      }
      h1 { font-size: 28px; border-bottom: 3px solid #00D4FF; padding-bottom: 10px; }
      h2 { font-size: 22px; color: #B829DD; margin-top: 30px; }
      table { 
        width: 100%; 
        border-collapse: collapse; 
        margin: 15px 0;
        page-break-inside: avoid;
      }
      th, td { 
        border: 1px solid #ddd; 
        padding: 10px; 
        text-align: left; 
      }
      th { 
        background: linear-gradient(135deg, #00D4FF 0%, #B829DD 100%);
        color: white;
        font-weight: 600;
      }
      tr:nth-child(even) { background: #f8f9fa; }
      code { 
        background: #f4f4f4; 
        padding: 2px 6px; 
        border-radius: 3px;
        font-family: 'Monaco', 'Consolas', monospace;
      }
      pre {
        background: #1a1a2e;
        color: #00D4FF;
        padding: 15px;
        border-radius: 8px;
        overflow-x: auto;
        page-break-inside: avoid;
      }
      blockquote {
        border-left: 4px solid #00D4FF;
        margin: 15px 0;
        padding: 10px 20px;
        background: #f8f9fa;
        font-style: italic;
      }
      img { max-width: 100%; height: auto; }
      .cover-page {
        text-align: center;
        padding: 100px 0;
        background: linear-gradient(135deg, #06070A 0%, #1a1a2e 100%);
        color: white;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      .cover-page h1 {
        color: #00D4FF;
        font-size: 42px;
        border: none;
        margin-bottom: 20px;
      }
      .cover-page .subtitle {
        color: #B829DD;
        font-size: 20px;
        margin-bottom: 40px;
      }
      .cover-page .meta {
        color: #888;
        font-size: 14px;
      }
    `
  });
  
  await page.pdf({
    path: outputFile,
    format: 'A4',
    printBackground: true,
    margin: { top: '20mm', right: '15mm', bottom: '25mm', left: '15mm' },
    displayHeaderFooter: true,
    headerTemplate: `
      <div style="font-size:9px; width:100%; text-align:center; color:#666; padding:5px 0; font-family:Inter,sans-serif;">
        FuseIQ v3.0 — ${options.title || 'Documentation'}
      </div>
    `,
    footerTemplate: `
      <div style="font-size:9px; width:100%; text-align:center; color:#666; padding:5px 0; font-family:Inter,sans-serif;">
        <span class="pageNumber"></span> / <span class="totalPages"></span>
      </div>
    `,
    ...options
  });
  
  await browser.close();
  console.log(`✅ Created: ${outputFile}`);
}

async function main() {
  const docsDir = '/Users/hyp3r/.openclaw/workspace/fuseiq/docs';
  
  // Ensure pdfs directory exists
  const pdfsDir = path.join(docsDir, 'pdfs');
  if (!fs.existsSync(pdfsDir)) {
    fs.mkdirSync(pdfsDir, { recursive: true });
  }
  
  const conversions = [
    { input: 'pdfs/platform_doc.html', output: 'pdfs/FUSEIQ_PLATFORM_DOCUMENTATION.pdf', title: 'Platform Documentation' },
    { input: 'pdfs/user_guide.html', output: 'pdfs/FUSEIQ_USER_GUIDE.pdf', title: 'User Guide' },
    { input: 'prelaunch/INVESTOR_ONE_PAGER.html', output: 'pdfs/FUSEIQ_INVESTOR_ONE_PAGER.pdf', title: 'Investor One-Pager' },
    { input: 'prelaunch/PITCH_DECK.html', output: 'pdfs/FUSEIQ_PITCH_DECK.pdf', title: 'Pitch Deck' },
    { input: 'prelaunch/PRESS_KIT.html', output: 'pdfs/FUSEIQ_PRESS_KIT.pdf', title: 'Press Kit' },
    { input: 'prelaunch/SOCIAL_MEDIA_KIT.html', output: 'pdfs/FUSEIQ_SOCIAL_MEDIA_KIT.pdf', title: 'Social Media Kit' },
    { input: 'prelaunch/COMPETITIVE_ANALYSIS.html', output: 'pdfs/FUSEIQ_COMPETITIVE_ANALYSIS.pdf', title: 'Competitive Analysis' },
    { input: 'prelaunch/FINANCIAL_MODEL.html', output: 'pdfs/FUSEIQ_FINANCIAL_MODEL.pdf', title: 'Financial Model' },
  ];
  
  for (const conv of conversions) {
    const inputPath = path.join(docsDir, conv.input);
    const outputPath = path.join(docsDir, conv.output);
    
    if (fs.existsSync(inputPath)) {
      try {
        await htmlToPdf(inputPath, outputPath, { title: conv.title });
      } catch (err) {
        console.error(`❌ Failed to convert ${conv.input}: ${err.message}`);
      }
    } else {
      console.log(`⚠️  Skipped (not found): ${conv.input}`);
    }
  }
  
  console.log('\n🎉 All PDF conversions complete!');
}

main().catch(console.error);
