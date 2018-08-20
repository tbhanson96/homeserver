function parsePerms(perms: number): string {
    let permsBuffer = [];
    const modes = ['---', '--x', '-w-', '-wx', 'r--', 'r-x', 'rw-', 'rwx'];
    let octal = perms & 777;
    do {
        let dig = octal % 8;
        permsBuffer.unshift(modes[dig])
        octal = (octal - (octal % 8)) / 8; //shift decimal over one in octal
    } while (octal > 0);
    let ret = '';
    for (let str of permsBuffer) {
        ret += str;
    }
    return ret;
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

function parseSize(filesize: number): string {
    const suffix = ['bytes', 'kB', 'mB', 'gB'];
    let ind = -1; //initialize to -1 to correct index, consequence of do-while loop
    do {
        ind++;
        filesize /= 1024;
    } while (filesize > 1);

    filesize *= 1024;
    if (ind !== 0) {
        return filesize.toFixed(2).toString() + ' ' + suffix[ind];
    } else {
        return filesize.toString() + ' ' + suffix[ind];
    }
}

export {parsePerms, parseTimestamp, splitDir, parseSize };
