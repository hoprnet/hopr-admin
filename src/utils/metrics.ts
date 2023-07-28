/**
 * Parses Node metrics to Apex charts ready data.
 * @param data The string of metrics from HOPRd.
 * @returns Apex chart ready {}.
 */
export const parseMetrics = (data: string) => {
    let parsed:any = {};
    let tmp = data.split('\n');
    let lastKey = '';
    for (let i = 0; i < tmp.length; i++) {
        let key, type, name;
        let string = tmp[i].split(' ');

        if(string[0] === '#' && string[1] === 'HELP') {
            key = lastKey = string[2];
            name = tmp[i].replace(`# HELP ${key} `, '');
            parsed[key] = { name, data: [], categories: [], length: 0 };
        } else if (string[0] === '#' && string[1] === 'TYPE') {
            key = string[2];
            type = tmp[i].replace(`# TYPE ${key} `, '');
            parsed[key].type = type;
        } else {
            parsed[lastKey].data.push(parseInt(string[1]))
            let category = string[0].replace(lastKey, '');
            if (category[0] === '_') category.replace('_', '');
            parsed[lastKey].categories.push(category);
            parsed[lastKey].length++;
        }
        
    }
    console.log(parsed)
    return parsed;
};