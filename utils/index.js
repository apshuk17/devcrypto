export const capitalizeString = str => {
    return str ? str.split(' ').map(item => `${item[0].toUpperCase()}${item.substring(1)}`).join('') : null;
}