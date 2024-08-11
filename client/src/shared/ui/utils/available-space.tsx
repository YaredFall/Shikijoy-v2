export function calculateAvailableSpace(element: HTMLElement, boundary: HTMLElement | Window, offset: number = 6) {
    const elRect = element.getBoundingClientRect();

    let boundaryRect;
    if (boundary instanceof Window) {
        boundaryRect = {
            left: 0,
            top: 0,
            right: boundary.innerWidth,
            bottom: boundary.innerHeight,
        };
    } else {
        boundaryRect = boundary.getBoundingClientRect();
    }

    return {
        availableLeft: elRect.left - offset - boundaryRect.left,
        availableTop: elRect.top - offset - boundaryRect.top,
        availableRight: boundaryRect.right - offset - elRect.right,
        availableBottom: boundaryRect.bottom - offset * 2 - elRect.bottom,
    };
}