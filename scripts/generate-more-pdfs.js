const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function mdToHtml(inputFile, outputFile) {
  const { execSync } = require('child_process');
  const cmd = `pandoc "${inputFile}" -o "${outputFile}" --standalone --css=/dev/null`;
  execSync(cmd);
  console.log(`✅ Converted: ${inputFile} → ${outputFile}`);
}

async function htmlToPdf(inputFile, outputFile, options = {}) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const filePath = path.resolve(inputFile);
  await page.goto('file://' + filePath, { waitUntil: 'networkidle' });
  
  await page.addStyleTag({
    content: `
      @page {
        size: A4;
        margin: 20mm 15mm 25mm 15mm;
      }
      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        line-height: 1.6;
        color: #1a1a2e;
        max-width: 100%;
      }
      h1, h2, h3 { 
        color: #00D4FF; 
        page-break-after: avoid;
      }
      h1 { 
        font-size: 28px; 
        border-bottom: 3px solid #00D4FF; 
        padding-bottom: 10px;
        margin-top: 40px;
      }
      h2 { 
        font-size: 22px; 
        color: #B829DD; 
        margin-top: 30px;
        page-break-after: avoid;
      }
      h3 {
        font-size: 18px;
        color: #1a1a2e;
        margin-top: 20px;
      }
      table { 
        width: 100%; 
        border-collapse: collapse; 
        margin: 15px 0;
        page-break-inside: avoid;
        font-size: 13px;
      }
      th, td { 
        border: 1px solid #ddd; 
        padding: 8px; 
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
        font-size: 12px;
      }
      pre {
        background: #1a1a2e;
        color: #00D4FF;
        padding: 15px;
        border-radius: 8px;
        overflow-x: auto;
        page-break-inside: avoid;
        font-size: 12px;
      }
      blockquote {
        border-left: 4px solid #00D4FF;
        margin: 15px 0;
        padding: 10px 20px;
        background: #f8f9fa;
        font-style: italic;
      }
      ul, ol { margin: 10px 0; padding-left: 25px; }
      li { margin: 5px 0; }
      a { color: #00D4FF; text-decoration: none; }
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
  console.log(`✅ Created PDF: ${outputFile}`);
}

async function main() {
  const docsDir = '/Users/hyp3r/.openclaw/workspace/fuseiq/docs';
  const pdfsDir = path.join(docsDir, 'pdfs');
  
  if (!fs.existsSync(pdfsDir)) {
    fs.mkdirSync(pdfsDir, { recursive: true });
  }
  
  const conversions = [
    { md: 'FLORIDA_BUSINESS_SETUP.md', pdf: 'FLORIDA_BUSINESS_SETUP.pdf', title: 'Florida Business Setup' },
    { md: '../LAUNCH_STRATEGY.md', pdf: 'FUSEIQ_LAUNCH_STRATEGY.pdf', title: 'Launch Strategy' },
  ];
  
  for (const conv of conversions) {
    const mdPath = path.join(docsDir, conv.md);
    const htmlPath = path.join(pdfsDir, conv.pdf.replace('.pdf', '.html'));
    const pdfPath = path.join(pdfsDir, conv.pdf);
    
    if (fs.existsSync(mdPath)) {
      try {
        // Convert MD to HTML first
        const { execSync } = require('child_process');
        execSync(`pandoc "${mdPath}" -o "${htmlPath}" --standalone`);
        
        // Convert HTML to PDF
        await htmlToPdf(htmlPath, pdfPath, { title: conv.title });
        
        // Clean up temp HTML
        fs.unlinkSync(htmlPath);
      } catch (err) {
        console.error(`❌ Failed to convert ${conv.md}: ${err.message}`);
      }
    } else {
      console.log(`⚠️  Skipped (not found): ${conv.md}`);
    }
  }
  
  console.log('\n🎉 Additional PDF conversions complete!');
}

main().catch(console.error);
