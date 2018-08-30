function parseName(filename: string): string {
    return filename.split('.').slice(-1).join('');
}

export { parseName };