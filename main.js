function generate() {
    let polynomial = document.getElementById('polynomial').value;
    let chain = document.getElementById('chain').value;
    let initialValue = parseInt(document.getElementById('initialValue').value);

    var byte_array = chain.split('').map(function(x) {return x.charCodeAt(0)});
    var polynomial_byte_array = polynomial.split('').map(function(x) {return parseInt(x)});
    let polynomial_byte = arrayToInt(polynomial_byte_array);

    let crc8Values = CRC8(polynomial_byte, initialValue);

    let CRCsum = checkSum(crc8Values, byte_array);

    document.getElementById('CRCsum').value = CRCsum;
}

function arrayToInt(array) {

    let int = 0;

    for (var i = 0; i < array.length; i++ )
        int += Math.pow(2, array.length-1-i)*array[i];

    return int;
}

function CRC8(polynomial, initial_value) { // constructor takes an optional polynomial type from CRC8.POLY
    if (polynomial == null) polynomial = CRC8.POLY.CRC8_CCITT
    let valuesToReturn = [];
    valuesToReturn['table'] = generateTable(polynomial);
    valuesToReturn['initial_value'] = initial_value;

    return valuesToReturn;
};

function checkSum(crc8Values, byte_array) {
    var c = crc8Values['initial_value'];

    for (var i = 0; i < byte_array.length; i++ )
        c = crc8Values['table'][(c ^ byte_array[i]) % 256];

    return c;
};

generateTable =function(polynomial)
{
    var csTable = [] // 256 max len byte array

    for ( var i = 0; i < 256; ++i ) {
        var curr = i
        for ( var j = 0; j < 8; ++j ) {
            if ((curr & 0x80) !== 0) {
                curr = ((curr << 1) ^ polynomial) % 256
            } else {
                curr = (curr << 1) % 256
            }
        }
        csTable[i] = curr
    }

    return csTable
};

CRC8.POLY = {
    CRC8 : 0xd5,
    CRC8_CCITT : 0x07,
    CRC8_DALLAS_MAXIM : 0x31,
    CRC8_SAE_J1850 : 0x1D,
    CRC_8_WCDMA : 0x9b,
};