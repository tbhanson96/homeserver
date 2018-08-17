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
    let temp = stamp.split('.')[0].split('T');
    if (temp.length > 1) {
        return 'T' + temp[1];
    }
    else return temp[0];
}

function splitDir(path: string): string[] {
    let temp = path.split('/');
    let ret = []
    for (let piece of temp) {
        if (piece !== '') {
            ret.push(piece);
        }
    }

    return ret
}

export {parsePerms, parseTimestamp, splitDir };
