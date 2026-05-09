import jsPDF from "jspdf";

/** Strips markdown to plain text suitable for PDF body. */
function stripMd(md: string): string {
  return md
    .replace(/```chart[\s\S]*?```/g, "")
    .replace(/```[\s\S]*?```/g, (b) => b.replace(/```\w*\n?|```/g, ""))
    .replace(/\{\{CHART:\d+\}\}/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[([^\]]+)\]\(.*?\)/g, "$1");
}

// Bee AI brand palette
const BEE_YELLOW: [number, number, number] = [255, 200, 0];
const BEE_AMBER: [number, number, number] = [255, 158, 0];
const BEE_BLUE: [number, number, number] = [60, 170, 255];
const BEE_DEEP_BLUE: [number, number, number] = [10, 22, 48];
const BEE_INK: [number, number, number] = [245, 245, 250];
const BEE_MUTED: [number, number, number] = [170, 180, 200];

function paintHeader(doc: jsPDF, title: string, pageWidth: number) {
  // Deep gradient-ish band (simulate gradient with two stacked rects)
  doc.setFillColor(...BEE_DEEP_BLUE);
  doc.rect(0, 0, pageWidth, 110, "F");
  // Yellow accent bar
  doc.setFillColor(...BEE_YELLOW);
  doc.rect(0, 110, pageWidth, 6, "F");
  doc.setFillColor(...BEE_AMBER);
  doc.rect(0, 116, pageWidth, 2, "F");

  // Hex bee dots — decorative
  doc.setFillColor(...BEE_YELLOW);
  for (let i = 0; i < 6; i++) {
    doc.circle(pageWidth - 30 - i * 14, 30, 3, "F");
  }
  doc.setFillColor(...BEE_BLUE);
  for (let i = 0; i < 4; i++) {
    doc.circle(pageWidth - 44 - i * 14, 50, 2, "F");
  }

  // Title
  doc.setTextColor(...BEE_YELLOW);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("BEE AI · QUANTUM BEE", 36, 36);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  const wrapped = doc.splitTextToSize(title, pageWidth - 200);
  doc.text(wrapped, 36, 64);

  doc.setTextColor(...BEE_MUTED);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(new Date().toLocaleString(), 36, 96);
}

function paintFooter(doc: jsPDF, pageWidth: number, pageHeight: number, page: number, total: number) {
  doc.setFillColor(...BEE_DEEP_BLUE);
  doc.rect(0, pageHeight - 28, pageWidth, 28, "F");
  doc.setFillColor(...BEE_YELLOW);
  doc.rect(0, pageHeight - 30, pageWidth, 2, "F");
  doc.setTextColor(...BEE_MUTED);
  doc.setFontSize(8);
  doc.text("Bee AI · quantumbee.ai", 36, pageHeight - 11);
  doc.setTextColor(...BEE_YELLOW);
  doc.text(`Page ${page} / ${total}`, pageWidth - 36, pageHeight - 11, { align: "right" });
}

export function generatePlanPdf(title: string, content: string): void {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const maxWidth = pageWidth - margin * 2;
  let y = 145;

  paintHeader(doc, title, pageWidth);

  const lines = stripMd(content).split("\n");
  doc.setFontSize(11);

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - 50) {
      doc.addPage();
      // light page background tint
      doc.setFillColor(252, 250, 244);
      doc.rect(0, 0, pageWidth, pageHeight, "F");
      // small top accent
      doc.setFillColor(...BEE_YELLOW);
      doc.rect(0, 0, pageWidth, 4, "F");
      y = 40;
    }
  };

  // Page background tint on page 1 below header
  doc.setFillColor(252, 250, 244);
  doc.rect(0, 118, pageWidth, pageHeight - 118 - 30, "F");

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      y += 8;
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    const bullet = line.match(/^\s*[-*•]\s+(.*)$/);
    const numbered = line.match(/^\s*(\d+)\.\s+(.*)$/);
    const callout = line.match(/^\s*>\s+(.*)$/);

    if (heading) {
      ensureSpace(34);
      const level = heading[1].length;
      const size = level === 1 ? 17 : level === 2 ? 14 : 12;
      // Yellow underline accent
      doc.setFillColor(...BEE_YELLOW);
      doc.rect(margin, y - 10, 18, 3, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(size);
      doc.setTextColor(...BEE_DEEP_BLUE);
      const wrapped = doc.splitTextToSize(heading[2], maxWidth);
      doc.text(wrapped, margin + 26, y);
      y += wrapped.length * (size + 4) + 8;
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
    } else if (callout) {
      ensureSpace(28);
      const wrapped = doc.splitTextToSize(callout[1], maxWidth - 22);
      const h = wrapped.length * 14 + 12;
      // Blue tinted callout box with yellow left bar
      doc.setFillColor(232, 244, 255);
      doc.roundedRect(margin, y - 10, maxWidth, h, 6, 6, "F");
      doc.setFillColor(...BEE_YELLOW);
      doc.rect(margin, y - 10, 4, h, "F");
      doc.setTextColor(20, 60, 100);
      doc.text(wrapped, margin + 14, y);
      y += h + 4;
    } else if (bullet) {
      ensureSpace(18);
      // Bee yellow hex dot
      doc.setFillColor(...BEE_YELLOW);
      doc.circle(margin + 4, y - 3, 2.6, "F");
      doc.setTextColor(40, 40, 60);
      const wrapped = doc.splitTextToSize(bullet[1], maxWidth - 18);
      doc.text(wrapped, margin + 16, y);
      y += wrapped.length * 14 + 3;
    } else if (numbered) {
      ensureSpace(18);
      // Blue number badge
      doc.setFillColor(...BEE_BLUE);
      doc.roundedRect(margin, y - 10, 22, 14, 3, 3, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.text(`${numbered[1]}`, margin + 11, y, { align: "center" });
      doc.setFont("helvetica", "normal");
      doc.setTextColor(40, 40, 60);
      const wrapped = doc.splitTextToSize(numbered[2], maxWidth - 28);
      doc.text(wrapped, margin + 28, y);
      y += wrapped.length * 14 + 4;
    } else {
      ensureSpace(16);
      doc.setTextColor(45, 50, 70);
      const wrapped = doc.splitTextToSize(line, maxWidth);
      doc.text(wrapped, margin, y);
      y += wrapped.length * 14 + 2;
    }
  }

  // Footers + page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    paintFooter(doc, pageWidth, pageHeight, i, pageCount);
  }

  const safeTitle = title.replace(/[^a-z0-9]+/gi, "-").toLowerCase().slice(0, 40) || "plan";
  doc.save(`bee-ai-${safeTitle}.pdf`);
}
