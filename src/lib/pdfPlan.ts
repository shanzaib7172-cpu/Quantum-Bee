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

export function generatePlanPdf(title: string, content: string): void {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 48;
  const maxWidth = pageWidth - margin * 2;
  let y = margin;

  // Header band
  doc.setFillColor(15, 30, 50);
  doc.rect(0, 0, pageWidth, 70, "F");
  doc.setTextColor(255, 200, 0); // bee yellow
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Bee AI — Plan", margin, 44);
  doc.setTextColor(180, 220, 255);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(new Date().toLocaleString(), pageWidth - margin, 44, { align: "right" });

  y = 100;

  // Title
  doc.setTextColor(60, 170, 255); // blue heading
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  const titleLines = doc.splitTextToSize(title, maxWidth);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 20 + 10;

  // Body, line-by-line so we can color headings/bullets
  const lines = stripMd(content).split("\n");
  doc.setFontSize(11);

  for (const raw of lines) {
    const line = raw.trimEnd();

    if (y > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }

    if (!line.trim()) {
      y += 8;
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    const bullet = line.match(/^\s*[-*•]\s+(.*)$/);
    const numbered = line.match(/^\s*(\d+)\.\s+(.*)$/);

    if (heading) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(heading[1].length === 1 ? 15 : 13);
      doc.setTextColor(60, 170, 255); // blue
      const wrapped = doc.splitTextToSize(heading[2], maxWidth);
      doc.text(wrapped, margin, y);
      y += wrapped.length * 18 + 4;
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
    } else if (bullet) {
      doc.setTextColor(255, 200, 0); // yellow bullet
      doc.text("•", margin, y);
      doc.setTextColor(245, 245, 245);
      const wrapped = doc.splitTextToSize(bullet[1], maxWidth - 14);
      doc.text(wrapped, margin + 14, y);
      y += wrapped.length * 14 + 2;
    } else if (numbered) {
      doc.setTextColor(255, 200, 0);
      doc.text(`${numbered[1]}.`, margin, y);
      doc.setTextColor(245, 245, 245);
      const wrapped = doc.splitTextToSize(numbered[2], maxWidth - 22);
      doc.text(wrapped, margin + 22, y);
      y += wrapped.length * 14 + 2;
    } else {
      doc.setTextColor(245, 245, 245);
      const wrapped = doc.splitTextToSize(line, maxWidth);
      doc.text(wrapped, margin, y);
      y += wrapped.length * 14 + 2;
    }
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text(`Bee AI • Page ${i} / ${pageCount}`, pageWidth / 2, pageHeight - 20, {
      align: "center",
    });
  }

  const safeTitle = title.replace(/[^a-z0-9]+/gi, "-").toLowerCase().slice(0, 40) || "plan";
  doc.save(`bee-ai-${safeTitle}.pdf`);
}
