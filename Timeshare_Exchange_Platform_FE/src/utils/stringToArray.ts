export default function stringToArray(str : string) {
    const array = str.split(',').map(item => item.trim());
    return array;
}