function parsePerms(perms: string): string {
    return perms.slice(-3).split('').map(value => [
        '---',
        '--x',
        '-w-',
        '-wx',
        'r--',
        'r-x',
        'rw-',
        'rwx',
    ][parseInt(value, 10)]).join('');
}

function parseTimestamp(stamp: string): string {
    return stamp.split('.')[0].split('T').join(' ');
}

function parseFileType(fileType: string): string {
    return fileType.split('.').slice(-1)[0];
}

export {parsePerms, parseTimestamp}
