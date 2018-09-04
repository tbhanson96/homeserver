function parseName(filename: string): string {
    let arr = filename.split('.');
    arr.splice(-1);
    return arr.join('.');
}

function getFileExt(filename: string): string {
    return filename.split('.').slice(-1)[0];
}

export { parseName, getFileExt };