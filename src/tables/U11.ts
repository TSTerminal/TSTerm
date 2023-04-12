/*
    This program and the accompanying materials are
    made available under the terms of the Eclipse Public License v2.0 which accompanies
    this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html

    SPDX-License-Identifier: EPL-2.0

    Copyright Contributors to the Zowe Project.
    Copyright Contributors to the Open Mainframe Project's TSTerm Project
*/

import { U037 } from './U00';
import { U273, U277, U278, U280, U284, U297 } from './U02';
import { U500 } from './U05'
import { U870 } from './U08';

const U1112 = {
    encoding: '1112',
    name : 'Baltic Multilingual',
    font: null,
    isDBCS: false,
    CGCSGIDBase: null,
    CGCSGIDExtended: null,
    unicodeEuro: 0,
    unicodeEuroDBCS: null,
    baseTable: [
        0, 1, 2, 3, 156, 9, 134, 127, 151, 141, 142, 11, 12, 13, 14, 15,
        16, 17, 18, 19, 157, 10, 8, 135, 24, 25, 146, 143, 28, 29, 30, 31,
        128, 129, 130, 131, 132, 10, 23, 27, 136, 137, 138, 139, 140, 5, 6, 7,
        144, 145, 22, 147, 148, 149, 150, 4, 152, 153, 154, 155, 20, 21, 158, 26,
        32, 160, 353, 228, 261, 303, 363, 229, 275, 382, 162, 46, 60, 40, 43, 124,
        38, 233, 281, 279, 269, 371, 8222, 8220, 291, 223, 33, 36, 42, 41, 59, 172,
        45, 47, 352, 196, 260, 302, 362, 197, 274, 381, 166, 44, 37, 95, 62, 63,
        248, 201, 280, 278, 268, 370, 298, 315, 290, 96, 58, 35, 64, 39, 61, 34,
        216, 97, 98, 99, 100, 101, 102, 103, 104, 105, 171, 187, 257, 380, 324, 177,
        176, 106, 107, 108, 109, 110, 111, 112, 113, 114, 342, 343, 230, 311, 198, 164,
        181, 126, 115, 116, 117, 118, 119, 120, 121, 122, 8221, 378, 256, 379, 323, 174,
        94, 163, 299, 183, 169, 167, 182, 188, 189, 190, 91, 93, 377, 310, 316, 215,
        123, 65, 66, 67, 68, 69, 70, 71, 72, 73, 45, 333, 246, 326, 243, 245,
        125, 74, 75, 76, 77, 78, 79, 80, 81, 82, 185, 263, 252, 322, 347, 8217,
        92, 247, 83, 84, 85, 86, 87, 88, 89, 90, 178, 332, 214, 325, 211, 213,
        48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 179, 262, 220, 321, 346, 159
    ],
    extendedTable: null
}

const U1137 = {
    encoding: '1137',
    name : 'Devanagari',
    font: null,
    isDBCS: false,
    CGCSGIDBase: null,
    CGCSGIDExtended: null,
    unicodeEuro: 0,
    unicodeEuroDBCS: null,
    baseTable: [
            0, 1, 2, 3, 156, 9, 134, 127, 151, 141, 142, 11, 12, 13, 14, 15,
            16, 17, 18, 19, 157, 10, 8, 135, 24, 25, 146, 143, 28, 29, 30, 31,
            128, 129, 130, 131, 132, 10, 23, 27, 136, 137, 138, 139, 140, 5, 6, 7,
            144, 145, 22, 147, 148, 149, 150, 4, 152, 153, 154, 155, 20, 21, 158, 26,
            32, 160, 2305, 2306, 2307, 2309, 2310, 2311, 2312, 2313, 2314, 46, 60, 40, 43, 124,
            38, 2315, 2316, 2317, 2318, 2319, 2320, 2321, 2322, 2323, 33, 36, 42, 41, 59, 94,
            45, 47, 2324, 2325, 2326, 2327, 2328, 2329, 2330, 2331, 2332, 44, 37, 95, 62, 63,
            2333, 2334, 2335, 2336, 2337, 2338, 2339, 2340, 2341, 96, 58, 35, 64, 39, 61, 34,
            2342, 97, 98, 99, 100, 101, 102, 103, 104, 105, 2343, 2344, 2346, 2347, 2348, 2349,
            2350, 106, 107, 108, 109, 110, 111, 112, 113, 114, 2351, 2352, 2354, 2355, 2357, 2358,
            8204, 126, 115, 116, 117, 118, 119, 120, 121, 122, 2359, 2360, 2361, 91, 2364, 2365,
            2366, 2367, 2368, 2369, 2370, 2371, 2372, 2373, 2374, 2375, 2376, 2377, 2378, 93, 2379, 2380,
            123, 65, 66, 67, 68, 69, 70, 71, 72, 73, 2381, 2384, 2385, 2386, 8377, 65533,
            125, 74, 75, 76, 77, 78, 79, 80, 81, 82, 2400, 2401, 2402, 2403, 2404, 2405,
            92, 8205, 83, 84, 85, 86, 87, 88, 89, 90, 2406, 2407, 2408, 2409, 2410, 2411,
            48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 2412, 2413, 2414, 2415, 2416, 65533,
    ],
    extendedTable: null
}

const U1140 = {
    encoding: '1140',
    name : 'International',
    font: null,
    isDBCS: false,
    CGCSGIDBase: null,
    CGCSGIDExtended: null,
    unicodeEuro: 159,
    unicodeEuroDBCS: null,
    baseTable: U037.baseTable,
    extendedTable: null
}

const U1141 = {
    encoding: '1141',
    name : 'German/Austrian',
    font: null,
    isDBCS: false,
    CGCSGIDBase: null,
    CGCSGIDExtended: null,
    unicodeEuro: 159,
    unicodeEuroDBCS: null,
    baseTable: U273.baseTable,
    extendedTable: null
}

const U1142 = {
    encoding: '1142',
    name : 'Danish/Norwegian',
    font: null,
    isDBCS: false,
    CGCSGIDBase: null,
    CGCSGIDExtended: null,
    unicodeEuro: 90,
    unicodeEuroDBCS: null,
    baseTable: U277.baseTable,
    extendedTable: null
}

const U1143 = {
    encoding: '1143',
    name : 'Finnish/Swedish',
    font: null,
    isDBCS: false,
    CGCSGIDBase: null,
    CGCSGIDExtended: null,
    unicodeEuro: 90,
    unicodeEuroDBCS: null,
    baseTable: U278.baseTable,
    extendedTable: null
}

const U1144 = {
    encoding: '1144',
    name : 'Italian',
    font: null,
    isDBCS: false,
    CGCSGIDBase: null,
    CGCSGIDExtended: null,
    unicodeEuro: 159,
    unicodeEuroDBCS: null,
    baseTable: U280.baseTable,
    extendedTable: null
}

const U1145 = {
    encoding: '1145',
    name : 'Spain/Latin America',
    font: null,
    isDBCS: false,
    CGCSGIDBase: null,
    CGCSGIDExtended: null,
    unicodeEuro: 159,
    unicodeEuroDBCS: null,
    baseTable: U284.baseTable,
    extendedTable: null
}

const U1147 = {
    encoding: '1147',
    name : 'French',
    font: null,
    isDBCS: false,
    CGCSGIDBase: null,
    CGCSGIDExtended: null,
    unicodeEuro: 159,
    unicodeEuroDBCS: null,
    baseTable: U297.baseTable,
    extendedTable: null
}

const U1148 = {
    encoding: '1148',
    name : 'International',
    font: null,
    isDBCS: false,
    CGCSGIDBase: null,
    CGCSGIDExtended: null,
    unicodeEuro: 159,
    unicodeEuroDBCS: null,
    baseTable: U500.baseTable,
    extendedTable: null
}

const U1153 = {
    encoding: '1153',
    name : 'Croat/Czech/Polish/Serbian/Slovak',
    font: null,
    isDBCS: false,
    CGCSGIDBase: null,
    CGCSGIDExtended: null,
    unicodeEuro: 159,
    unicodeEuroDBCS: null,
    baseTable: U870.baseTable,
    extendedTable: null
}

export { U1112, U1137, U1140, U1141, U1142, U1143, U1144, U1145, U1147, U1148, U1153 };

/*
    This program and the accompanying materials are
    made available under the terms of the Eclipse Public License v2.0 which accompanies
    this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html

    SPDX-License-Identifier: EPL-2.0

    Copyright Contributors to the Zowe Project.
    Copyright Contributors to the Open Mainframe Project's TSTerm Project
*/
