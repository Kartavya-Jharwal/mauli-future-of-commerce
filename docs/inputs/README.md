# Supplied evidence archive

All 17 original files remain at the repository root, including the duplicate challenge brief. `inventory.json` records original filenames, SHA-256 hashes, extraction paths and limitations. The owner authorized their inclusion in the public repository.

Run `scripts/ingest_sources.py` with Python and `pypdf` available to refresh text extractions. PDF page and PowerPoint slide headings provide locators. HTML exports and embedded HTML in Markdown are normalized to readable text. Images, charts, slide notes and layout are not represented reliably by these text extracts; return to the original before interpreting a visual claim. Originals are the authority if an extract differs.

## Evidence hierarchy

1. Brand deck: supplied brand claims, with page locators; not independently audited performance data.
2. Instructor challenge brief: teaching synthesis of founder Q&A and brand deck. Source scope and reported figures matter; the underlying video/transcript is not present as a separate authoritative transcript.
3. Team notes in `Mauli Rituals.md`: working progress, personal notes, role allocations and drafts; preserve disagreement and uncertain recollections.
4. Personal strategy dossier: evolving student recommendations, superseded arguments and assumptions.
5. Agentic AI PRD: aspirational architecture and experience concept. Performance, clinical efficacy and commercial results are not proven.
6. Lecture slides: course frameworks and examples; contextual support rather than proof of Mauli outcomes.

The two challenge PDFs have identical SHA-256 hashes. Keep both as received, but count them as one underlying source. Dates embedded in filenames or decks describe the source, not a later verification date.
