/*
    This program and the accompanying materials are
    made available under the terms of the Eclipse Public License v2.0 which accompanies
    this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html

    SPDX-License-Identifier: EPL-2.0

    Copyright Contributors to the Zowe Project.
    Copyright Contributors to the Open Mainframe Project's TSTerm Project
*/

import { U290 } from './U02';
import { U939 } from './U09';
import { EXTENDED_930 } from './Extended930';

const U1390 = {
    encoding: '1390',
    name : 'Japanese',
    font: 'NSimSun',
    isDBCS: true,
    CGCSGIDBase: [255, 255, 33, 34],
    CGCSGIDExtended: [255, 255, 65, 44],
    unicodeEuro: 225,
    unicodeEuroDBCS: [66, 225],
    baseTable: U290.baseTable,
    extendedTable: EXTENDED_930
}

const U1399 = {
    encoding: '1399',
    name : 'Japanese',
    font: 'NSimSun',
    isDBCS: true,
    CGCSGIDBase: [255, 255, 20, 3],
    CGCSGIDExtended: [255, 255, 65, 44],
    unicodeEuro: 225,
    unicodeEuroDBCS: [66, 225],
    baseTable: U939.baseTable,
    extendedTable: EXTENDED_930
}

export { U1390, U1399 };

/*
    This program and the accompanying materials are
    made available under the terms of the Eclipse Public License v2.0 which accompanies
    this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html

    SPDX-License-Identifier: EPL-2.0

    Copyright Contributors to the Zowe Project.
    Copyright Contributors to the Open Mainframe Project's TSTerm Project
*/
