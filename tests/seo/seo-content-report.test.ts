import { readBuiltPages } from "./lib/distReader";
import { buildContentReport, writeContentReport } from "./lib/contentReport";

describe("SEO content visibility report", () => {
  it("writes the current live-page CMS content gap report", () => {
    const report = buildContentReport(readBuiltPages());

    writeContentReport(report);

    expect(report.activePageCount).toBeGreaterThan(0);
    expect(report.pages.length).toBe(report.activePageCount);
    expect(report.unclassifiedGeneratedPages).toEqual([]);
    for (const page of report.pages) {
      expect(page.url).toBeTruthy();
      expect(page.kind).toBeTruthy();
      expect(page.schemaTypes.length).toBeGreaterThan(0);
      for (const gap of page.gaps) {
        expect(gap.owner).toBe("copywriter");
        expect(gap.field).toBeTruthy();
        expect(gap.source).toBeTruthy();
        expect(gap.note).toBeTruthy();
      }
    }
  });
});
