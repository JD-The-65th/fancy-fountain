// Source - https://stackoverflow.com/a/74800019
// Posted by Vincent Maret, modified by community. See post 'Timeline' for change history
// Retrieved 2026-05-24, License - CC BY-SA 4.0

export function getCurrentPageNumber(document) {
    const pageBuffer = document._pageBuffer;
    const currentPage = document.page;
    let currentPageNumber = null;
    pageBuffer.forEach((page, i) => {
        if (page === currentPage) {
            currentPageNumber = i;
        }
    })
    if (currentPageNumber === null) {
        throw new Error('Unable to get current page number');
    }
    return currentPageNumber;
}