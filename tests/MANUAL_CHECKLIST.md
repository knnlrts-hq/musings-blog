# Manual Testing Checklist

Run through this before each release.

## Home Page
- [ ] Posts appear in reverse chronological order
- [ ] Date format is readable (e.g., "February 4, 2026")
- [ ] Tags are clickable and go to tag page
- [ ] No JavaScript errors in console

## Single Post
- [ ] Title, date, and tags display correctly
- [ ] Images load and are responsive
- [ ] Code blocks have syntax highlighting
- [ ] External links open in same tab (or new tab if configured)
- [ ] Long posts are scrollable

## Archive
- [ ] Posts grouped by year
- [ ] Most recent year first
- [ ] Dates shown in MM-DD format

## Tags
- [ ] All tags displayed
- [ ] Tag counts are correct
- [ ] Clicking tag shows only posts with that tag

## About
- [ ] Page loads without error

## Mobile (test in Chrome DevTools device mode)
- [ ] Text is readable without horizontal scroll
- [ ] Navigation works
- [ ] Images scale down appropriately

## Performance
- [ ] Page loads in < 2 seconds on localhost
- [ ] No visible layout shift after load
