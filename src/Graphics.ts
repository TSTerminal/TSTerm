/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
  Copyright Contributors to the Open Mainframe Project's TSTerm Project
*/

import { Utils } from "./Utils";

/*
  References

  https://www.afpconsortium.org/uploads/1/1/8/4/118458708/afp-goca-reference-03.pdf
  https://www.afpconsortium.org/uploads/1/1/8/4/118458708/linedata-reference-05.pdf

  The data stream for graphics usually called GDDM by mainframe programmers is
  called GOCA (Graphics Object Content Architecture) by device and emulator builders.

  Always Clear and useful:

  http://www.prycroft6.com.au/misc/3270eds.html

  Info on instructions and a few other things:
    https://www.ibm.com/docs/en/host-on-demand/12.0?topic=SSS9FA_12.0.0/com.ibm.hod.doc/help/nativegraph.html

    https://priorart.ip.com/IPCOM/000113872/Extended-Graphical-Cursor-Support
      Mentions "GOCA-DR3 device" 

  What's an Object Data?
     https://priorart.ip.com/first-page/IPCOM000113872D

  OIA and the Graphics Cursor Mentioned Here
     https://archive.org/details/IbmPersonalSystemsDeveloperMagazines/IbmPsd-Spring1992/page/n79/mode/2up?q=gddm

  OS/2 had GOCA-ish stuff
     https://archive.org/details/ToolkitDocs1/GPI%20Guide%20and%20Reference%20/page/n997/mode/2up?q=gbimg    
     https://archive.org/stream/OS21.xTechnicalDocumentation/64F0277_OS2_V1_2_PTI_Presentation_Manager_Programming_Reference_Vol_2_djvu.txt

  Overlapping Defintions of PSF/IPD/AFP
    https://www.ibm.com/docs/en/zos/2.4.0?topic=messages-aps400i
     - in here begin segment has the same meaning
     https://www.afpconsortium.org/uploads/1/1/8/4/118458708/ioca-reference-07.pdf

  IBM 5080 was part of this mess at one point:

    https://sharktastica.co.uk/resources/docs/IBM_GA23-0134-0_5080_84_1.pdf
    - but seems to have different code space for orders
  
  GDDM Exits:
    https://www.ibm.com/docs/it/gddm?topic=gddm-specifying-user-exits#HDREXITS

  TSO/VTA/TCAS Exits:
    ZOWEDVCE - how to support cleaning and do tunnelling
    VTAM TCAS or TSO exits would be needed to implement
      See https://www.ibm.com/docs/en/zos/2.1.0?topic=routines-tsovtam-exit
      Could IKT3270I demultiplex the data and IKTIDSX1 multiplex it


  Web Integration:
    https://docs.microsoft.com/en-us/javascript/api/excel?view=excel-js-preview

  GDDM Order list
    https://www.ibm.com/docs/ja/gddm?topic=descriptions-gdf-orders-summary

  IDEA 
    dynamically getting plib to find tables and auto import/export to excel with structure
    or BMS Map

  GSUWIN 
    only as uniform as the reported geometry 
    24x80 with 16*9 box is 24x16   384x720 ->   32x60 8x15->

    62x132 16x9   960 120

  Destination/Origin
    Works with structured fields to multiplex the outbound data to multi-device receivers
    and inbound to say who is saying what back to the host
    0000 is the default/primary display 

    This is why ReadPartitionQuery is preceded by a destination/origin thingy in GDDM's negotation IFF
     The PCLK aux device was shown

    See this reply from PCOMM:

         Reply 0x99 means - indicates direct access support of one or more aux devices (IBM or OEM).
           That also means Dest/Origin can be used, and RPQ query list can be used (i thought it was always OK)

     Does DOID work only in one WSF unit, and not persist across?

     
Reply 0x99: AUXILIARY_DEVICE, len=0x6:
00000000  00068199 0000                                                            |..ar..|

Reply 0x95: DISTRIBUTED_DATA_MANAGEMENT, len=0xc:
00000000  000C8195 00001F40 1F400101                                               |..an... . ..|

   - 1F40 bytes per input and output 
     01   Subsets supported
     01   Subset ID

Reply 0x9E: IBM_AUXILIARY_DEVICE, len=0x13:
00000000  0013819E 80000300 0E000104 01810104  03000F                              |..a..........a.....|

    819E  (This comes from PCOMM book)
    80    Flags supports query/queryList
    00    reserved
    0300  max inbound DDM bytes
    0E00  max outbound DDM bytes
    01    device type 01-display, 02-printer
    // the param below is an SDP (with ID=0x01)
    04    parameter length
    01    direct access (what about it?? a flag??)
    8101  The DOID for use in Destination/Origin ID !!


Reply 0x95: DISTRIBUTED_DATA_MANAGEMENT, len=0x1d:
00000000  001D8195 00000300 0E000101 04018102  0902D7C3 D3D20110 80040300 03       |..an..........a...PCLK.......|

  SPD 09 02 PCLK011080 DDM application name

Reply 0x9E: IBM_AUXILIARY_DEVICE, len=0x21:
00000000  0021819E 80000300 0E000204 01810304  0300030E 0202B901 F4D7C3E2 E6C7D7D9 |..a..........a..........4PCSWGPR|
00000020  E3     

    819E
    80
    00
    0300
    0E00 
    02   Device Type printer
    SDP #1 
    04 01
    8103   (DOID)  
    SDP #2
    04 03 (PCLK protocol controls - allows 1013)
    0003   PCKL Version   (0001 is said to be version 1.1)  how high can this go, how does it affect graphics, vs other qreps
    SDP #3
    0E 02 (what the fnuk is this)?
    02 B9 01 F4
    D7C3E2E6C7D7E3  PCSWGPRT  (PC software graphical printer????) sounds promising

   Think about characters sets and graphics char sets

Reply 0x85: CHARACTER_SETS, len=0x29:
00000000  00298185 F2400910 60000000 07000000  02B90025 0100F103 C3013602 80FF0000 |..ae2 ..-.............1.C.......|
00000020  00000380 FF000000 00
    F2  GE support Multiple LCID, Load PSSF support Load PS Extended support CGCSGID present.
    40  LOAD PS slot size match not required, CCSID not present.
    09  Char slot width
    10  Char slot height (16 in decimal)
    60000000  (formats 2 and 3 supported in a bit mask)
    07 bytes per char set identifier
    PS Store number
    flags

  Gotta Build an AuxDeviceMap when querying

  Gotta Give an aux device (maybe) when running Term.  Basically, does GDDM even see our device's higher-level
  capabilities if not under right aux device.                

  What's a 3270 Alphanumeric Partition, and how does it get fed from the host?

  Begin Segment, per AFP

    0x70
    <headerLength> 1 byte
    name           4 bytes - often zeros
    flag1          1 ignored
    flag2         80 unchaied (what does chaining mean in this context, anything to do with frag/reassembly??)
    
    ------

    Control example
    30 0a 00 00 00 00 00 00 00 10 00 00 21 06 03 18  is the length of header 0x0A in correspondence with "70 0C"
    00 8f 02 ee 21 06 00 30 00 8f 02 05 

  0000   00 05 9a 3c 7a 00 00 11 22 33 44 55 08 00 45 00
  0010   00 fd 43 ce 00 00 3f 06 02 ee ac 1d 7a a4 ac 1d
  0020   61 60 02 6f fa 51 0a 0a a8 5c 52 8a 92 33 50 18
  0030   0f ff c1 ec 00 00 00 01 02 00 31 f3 00 04 03 80
  0040   00 1e 0c 00 00 00 00 3c 00 84 00 00 00 00 00 3c
  0050   00 84 00 00 00 00 00 00 00 00 00 09 00 0d 00 31
  0060   0f 11 00 c0 00 30 0a 00 00 00 00 00 00 00 1e 00  - control here
  0070   00 21 06 03 18 00 8f 02 ee 21 06 00 30 00 8f 02    3 set defaults
  0080   05 21 0c 05 f0 00 8f fd ab 02 54 fe 7a 01 85 00
  0090   2d 0f 10 00 c0 00 70 0c 00 00 00 00 54 00 00 18  - picture here
  00a0   00 00 00 00 c1 04 00 00 00 00 81 04 00 ec 00 00
  00b0   81 04 00 ec 00 9b 81 04 00 00 00 00 00 1b 0f 11
  00c0   00 c0 00 30 0a 00 00 00 00 00 00 00 08 00 00 21  - control here
  00d0   06 03 18 00 8f 00 ee 00 31 40 00 f1 f3 11 01 58    one set default
  00e0   1d f0 11 01 07 29 02 c0 40 46 ff ff d9 c9 c7 c8
  00f0   e3 60 c1 d5 c7 d3 c5 c4 40 e3 d9 c9 c1 d5 c7 d3
  0100   c5 3c 01 58 00 11 00 00 13 ff ef




    Picture Example
    70 0c 00 00 00 00 54 00 00 18 00 00 00 00 c1 04   - 54 is ignored 00 segment props, length 0x0018 | data starts at c1 04
    00 00 00 00 81 04 00 8f 00 00 81 04 00 8f 00 4c 
    81 04 00 00 00 00

    orders in picture example:
    C1 04 00 00 00 00  -- line at pos
    81 04 00 8f 00 00  -- line from pos
    81 04 00 8f 00 4c  -- line from pos
    81 04 00 00 00 00  -- back to start

1-byte X'00' GNOP1 No-Operation
Long X'01' GCOMT Comment
Long X'04' GSGCH Segment Characteristics
2-byte X'08' GSPS Set Pattern Set
2-byte X'0A' GSCOL Set Color
2-byte X'0C' GSMX Set Mix
2-byte X'0D' GSBMX Set Background Mix
Long X'11' GSFLW Set Fractional Line Width
2-byte X'18' GSLT Set Line Type
2-byte X'19' GSLW Set Line Width
2-byte X'1A' GSLE Set Line End
2-byte X'1B' GSLJ Set Line Join
Long X'20' GSCLT Set Custom Line Type
Long X'21' GSCP Set Current Position
Long X'22' GSAP Set Arc Parameters
Long X'26' GSECOL Set Extended Color
2-byte X'28' GSPT Set Pattern Symbol
2-byte X'29' GSMT Set Marker Symbol
Long X'33' GSCC Set Character Cell
Long X'34' GSCA Set Character Angle
Long X'35' GSCH Set Character Shear
Long X'37' GSMC Set Marker Cell
2-byte X'38' GSCS Set Character Set
2-byte X'39' GSCR Set Character Precision
2-byte X'3A' GSCD Set Character Direction
2-byte X'3B' GSMP Set Marker Precision 
2-byte X'3C' GSMS Set Marker Set
2-byte X'3E' GEPROL End Prolog
2-byte X'5E' GECP End Custom Pattern
Long X'60' GEAR End Area
2-byte X'68' GBAR Begin Area
Long X'80' GCBOX Box at Current Position
Long X'81' GCLINE Line at Current Position
Long X'82' GCMRK Marker at Current Position
Long X'83' GCCHST Character String at Current Position
Long X'85' GCFLT Fillet at Current Position
Long X'87' GCFARC Full Arc at Current Position
Long X'91' GCBIMG Begin Image at Current Position
Long X'92' GIMD Image Data
Long X'93' GEIMG End Image
Long X'A0' GSPRP Set Pattern Reference Point
Long X'A1' GCRLINE Relative Line at Current Position
Long X'A3' GCPARC Partial Arc at Current Position
Long X'A5' GCCBEZ Cubic Bezier Curve at Current Position
Long X'B2' GSPCOL Set Process Color
Long X'C0' GBOX Box at Given Position
Long X'C1' GLINE Line at Given Position
Long X'C2' GMRK Marker at Given Position
Long X'C3' GCHST Character String at Given Position
Long X'C5' GFLT Fillet at Given Position
Long X'C7' GFARC Full Arc at Given Position
Long X'D1' GBIMG Begin Image at Given Position
Long X'DE' GBCP Begin Custom Pattern
Long X'DF' GDPT Delete Pattern
Long X'E1' GRLINE Relative Line at Given Position
Long X'E3' GPARC Partial Arc at Given Position
Long X'E5' GCBEZ Cubic Bezier Curve at Given Position
Extended X'FEDC' GLGD Linear Gradient
Extended X'FEDD' GRGD Radial Gradien

  Which QReplies permit and specify graphics support

   -- Usable Area seems to give dimension information
   -- buildCodeSummaryReply says which QReply's the terminal will talk about at all
   -- picture, segment, graphics colors, linetype, etc are the qReplies that allow GOCA

   ==> use 3270_IPDS to pretend to be a printer !!
 

  Dimensions and transforms

  XLATE : the origin must be translated to midpoint (active NON-OIA height|width / 2)
  SCALE : y must be inverted scaled by GraphicsHW (from usable area reply) / h|w used for above calculation

  In TSTERM the create partition and field creation seem to be in sync - ield starts at 264 an goes 80 bytes to 344
     which matches the REX program and the (132x60) logical screen size.

  Worry about similarCharRun.   Does it never find similar char runs??

  What effect does CREATE_PARTITION have?

  16-bit screen SBA's (256x256) 4 pixels (if monochrome 16 possibilities)  3^3^4->3^12 -> 729 posibilities 
  24-bit color 4 pixels 12 bytes 96 bits of info  2^96 possibilities

  How many symbol can we have sets at once?  


*/
export class GraphicsConstants {
    static WRAPPER_FLAG_IS_FIRST = 0x80;
    static WRAPPER_FLAG_IS_LAST  = 0x40;

    static OBJECT_NO_TYPE = -1;
    static OBJECT_DATA = 0x0F0F;  
    static OBJECT_PICTURE = 0x0F10; 
    static OBJECT_CONTROL = 0x0F11; 
    
    static COMMAND_BEGIN_PROCEDURE = 0x30;
    static COMMAND_BEGIN_DATA_UNIT = 0x40;
    static COMMAND_BEGIN_SEGMENT = 0x70;
    
    // orders here
    // some omissions suggested by OS2 PM doc at (Google it)
    // These docs vary in their OCR errors
    // https://archive.org/stream/OS21.xTechnicalDocumentation/64F0277_OS2_V1_2_PTI_Presentation_Manager_Programming_Reference_Vol_2_djvu.txt
    // https://archive.org/stream/OS22.xTechnicalDocumentation/os2-2.0-pmref-vol3-1992_djvu.txt
    // https://archive.org/stream/ToolkitDocs1/Presentation%20Manager%20Programming%20Guide%20and%20Reference_djvu.txt
    // More definitional stuff https://github.com/bitwiseworks/os2tk45/blob/master/h/pmgpi.h
    // In particular this include file
    //   https://github.com/bitwiseworks/os2tk45/blob/master/h/pmord.h
    // https://www.ibm.com/docs/en/gddm?topic=psc-picture-prolog-process-specific-control-orders
    static ORDER_GNOP1 = 0x00;  // No-Operation
    static ORDER_GCOMT = 0x01;  // Comment
    static ORDER_GSGCH = 0x04;  // Segment Characteristics (https://www.ibm.com/docs/it/gddm?topic=descriptions-segment-characteristics)
    // Gap 0x5 GSCBE Set Character Break Extra (push is 0x45) - what does it mean
    // Gap 0x7 GSCALL/GCALLS Call Segment - Very interesting
    /* I bet this works
      1 X'07'   Call Segment order code                       
      1 X'06'     Length of following data                      
      2 X'0000' reserved
      4 SEGID   Identifier of segment to be called    
    */
    static ORDER_GSPS = 0x08;   // Set Pattern Set (push and set exists, is it 0x48)
    // push and set pattern symbol GPSPT at 0x09, maybe
    static ORDER_GSCOL = 0x0A;  // Set Color
    static ORDER_GSMX = 0x0C;   // Set Mix
    static ORDER_GSBMX = 0x0D;  // Set Background Mix (push and set is 0x4D)
    static ORDER_GSFLW = 0x11;  // Set Fractional Line Width
    // Gap 0x14 GSIA (push and) set individual attribute (push is 0x54)
    // Gap 0x15 GSSLW set stroke line width (push at 0x55)
    // Gap 0x17 GSCE Set Character Extra (push at 0x57) 
    static ORDER_GSLT = 0x18;   // Set Line Type
    static ORDER_GSLW = 0x19;   // Set Line Width (push and set line join is 0x59)
    static ORDER_GSLE = 0x1A;   // Set Line End
    static ORDER_GSLJ = 0x1B;   // Set Line Join (push and set line join is 0x5B) 
    static ORDER_GSCLT = 0x20;  // Set Custom Line Type
    static ORDER_GSCP = 0x21;   // Set Current Position
    static ORDER_GSAP = 0x22;   // Set Arc Parameters (push and set at 0x62)
    // Gap 0x23 push and set pick identifier GPSPIK 
    // Gap 0x24 GSTM - set model transform (also push-and-set at 0x64)
    // Gap 0x25 GSBCOL - set background color (push and set at 0x65)
    static ORDER_GSECOL = 0x26; // Set Extended Color
    // Gap 0x27 GSVW - set viewing window (push and set viewing window is 0x67)
    /* https://www.ibm.com/docs/it/gddm?topic=descriptions-segment-viewing-window */
    static ORDER_GSPT = 0x28;   // Set Pattern Symbol
    static ORDER_GSMT = 0x29;   // Set Marker Symbol
    // Gao 0x31 Set Viewing Transform
    // Gap 0x32 Set Segment Boundary 
    static ORDER_GSCC = 0x33;   // Set Character Cell
    static ORDER_GSCA = 0x34;   // Set Character Angle (push and set at 0x74)
    static ORDER_GSCH = 0x35;   // Set Character Shear
    // Gap 0x36 GSTA - Set Text Alignment (push and set is 0x76)
    static ORDER_GSMC = 0x37;   // Set Marker Cell   (push and set is 0x77)
    static ORDER_GSCS = 0x38;   // Set Character Set
    static ORDER_GSCR = 0x39;   // Set Character Precision
    static ORDER_GSCD = 0x3A;   // Set Character Direction
    static ORDER_GSMP = 0x3B;   // Set Marker Precision  (push and set is 0x7B)
    static ORDER_GSMS = 0x3C;   // Set Marker Set        (push and set is 0x7C)
    // Gap 0x43 GSPIK set pick identifier
    static ORDER_GEPROL = 0x3E; // End Prolog
    // Maybe 0x3F Pop
    // Maybe 0x43 Set Pick Tag GSTAG
    // Gap 0x49 GEEL End Element
    // Gap 0x4C push and set mix GPSMIX
    // Gap 0x51 Push and set Fractional line width
    // Gap 0x53 GSSPOS Segment position
    /* len x,y,ID https://www.ibm.com/docs/it/gddm?topic=descriptions-segment-position */
    static ORDER_GECP = 0x5E;   // End Custom Pattern
    static ORDER_GEAR = 0x60;   // End Area
    static ORDER_GBAR = 0x68;   // Begin Area
    // Gap 0x70 GCLFIG Close figure
    // Gap 0x72 Segment Attributes GSSATI (https://www.ibm.com/docs/it/gddm?topic=descriptions-segment-attribute)
    // Gap 0x73 Segment Attribute Modify (https://www.ibm.com/docs/it/gddm?topic=descriptions-segment-attribute-modify)
    // Gap 0x7E begin picture prolog (maybe)
    // Gap 0x7F GEPTH (end path) 
    static ORDER_GCBOX = 0x80;  // Box at Current Position
    static ORDER_GCLINE = 0x81; // Line at Current Position
    static ORDER_GCMRK = 0x82;  // Marker at Current Position
    static ORDER_GCCHST = 0x83; // Character String at Current Position
    static ORDER_GCFLT = 0x85;  // Fillet at Current Position
    static ORDER_GCFARC = 0x87; // Full Arc at Current Position
    // maybe 8C begin tile, 8D end tile
    static ORDER_GCBIMG = 0x91; // Begin Image at Current Position
    static ORDER_GIMD = 0x92;   // Image Data
    static ORDER_GEIMG = 0x93;  // End Image
    // maybe 0x94 (image size)
    // maybe 0x95 (image encoding paameter)
    static ORDER_GSPRP = 0xA0;  // Set Pattern Reference Point (push and set at 0xE0)
    static ORDER_GCRLINE = 0xA1;// Relative Line at Current Position
    static ORDER_GCPARC = 0xA3; // Partial Arc at Current Position
    // Gap 0xA4 sharp fillet at current position
    static ORDER_GCCBEZ = 0xA5; // Cubic Bezier Curve at Current Position
    // Gap 0xA6 GSICOL (set indexed color) 0xA6, also push and set indexed color is 0xE6
    // Gap 0xA7 GSBICOL set background index color (push at 0xE7)
    static ORDER_GSPCOL = 0xB2; // Set Process Color
    // Gap 0xB4 GSCPTH - set clip path
    static ORDER_GBOX = 0xC0;   // Box at Given Position
    static ORDER_GLINE = 0xC1;  // Line at Given Position
    static ORDER_GMRK = 0xC2;   // Marker at Given Position
    static ORDER_GCHST = 0xC3;  // Character String at Given Position
    static ORDER_GFLT = 0xC5;   // Fillet at Given Position
    static ORDER_GFARC = 0xC7;  // Full Arc at Given Position
    // Gap 0xD0 GBPTH Begin Path
    static ORDER_GBIMG = 0xD1;  // Begin Image at Given Position
    // Gap 0xD2 GBEL Begin Element  (line|char|marker|area bundle) 
    // Gap 0xD3 GLBL Label within a segment
    // Gap 0xD4 GOPTH Outline Path
    // Gap 0xD5 GESCP Escape Functions - "registered and unregistered" says the OS/2 book
    //   includes 0x01 Set Pel
    //            0x02 Bit Blt
    //            0x03 Flood Fill
    //            0x04 Draw Bits
    // Gap 0xD6 GBBLT Bitblt 
    // Gap 0xD7 GFPTH - Fill Path
    // Gap 0xD8 GMPTH - Modify Path
    static ORDER_GBCP = 0xDE;   // Begin Custom Pattern
    static ORDER_GDPT = 0xDF;   // Delete Pattern
    static ORDER_GRLINE = 0xE1; // Relative Line at Given Position
    static ORDER_GPARC = 0xE3;  // Partial Arc at Given Position
    // gap 0xE4 GSFLT - Sharp Fillet at Given Position
    static ORDER_GCBEZ = 0xE5;  // Cubic Bezier Curve at Given Position
    // Gap 0xF3 Polygons
    // maybe 0xFE92
    // gap 0xFED5 - GEESCP - Extended Escape    
    static ORDER_GLGD = 0xFEDC; // Linear Gradient
    static ORDER_GRGD = 0xFEDD; // Radial Gradient
    // gap 0xFEB0 and FEF0 GCHSTE GCCHSTE - Character string extended at Given/Current Position
    // gap 0xFEF4 GTCHSPA Tabbed Char String at 
    // gap 0xFF end of symbol definition (used in font definition)

    // Instructions (OBJECT_CONTROL) defs
    //   https://www.ibm.com/docs/en/host-on-demand/12.0?topic=SSS9FA_12.0.0/com.ibm.hod.doc/help/nativegraph.html
    static INSTRUCTION_ERASE_GRAPHIC_PS = 0x0A;
    static INSTRUCTION_STOP_DRAW        = 0x0F;
    static INSTRUCTION_ATTACH_GRAPHIC_CURSOR = 0x08;
    static INSTRUCTION_DETACH_GRAPHIC_CURSOR = 0x09;
    static INSTRUCTION_SET_GRAPHIC_CURSOR_POS = 0x31;
    static INSTRUCTION_SCD = 0x21;  // SET_CURRENT_DEFAULTS = 0x21;  // AFP doc has this one fully laid out
    
    static INSTRUCTION_NO_OPERATION = 0x00;
    static INSTRUCTION_COMMENT = 0x01;

    static LINE_TYPE_DEFAULT = 0; // what's our default?
    static LINE_TYPE_DOTTED = 1;  // duty cycle in line width unis 0,2
    static LINE_TYPE_SHORT_DASH = 2; // 3,3
    static LINE_TYPE_DASH_DOT = 3;   // 6,4,0,4
    static LINE_TYPE_DOUBLE_DOT = 4; // 0,3,0,7
    static LINE_TYPE_LONG_DASHED = 5; // 8,3
    static LINE_TYPE_DASH_DOUBLE_DOT = 6; // 6,3,0,3,0,3
    static LINE_TYPE_SOLID = 7;
    static LINE_TYPE_INVISIBLE = 8;

    // join types
    static LINE_JOIN_DEFAULT = 0; // grab from setCurrentDefaults instruction
    static LINE_JOIN_BEVEL = 1
    static LINE_JOIN_ROUND = 2;
    static LINE_JOIN_MITER = 3;

    // end types
    static LINE_END_DEFAULT = 0; // grab from SetCurrentDefaults value
    static LINE_END_FLAT = 1;
    static LINE_END_SQUARE = 2;
    static LINE_END_ROUND = 3;

    // mix modes
    // https://www.ibm.com/docs/it/gddm?topic=descriptions-foreground-color-mix
    static MIX_DEFAULT = 0;
    static MIX_MIX = 1; // what does this mean?  (Does this mean OR) 
    static MIX_OVERPAINT = 2;  // AFP GOCA doc says only LEAVE_ALONE is allowed
    static MIX_UNDERPAINT = 3;
    static MIX_XOR = 4; // wow
    static MIX_LEAVE_ALONE = 5;

    // markers

    static MARKER_DEFAULT = 0; // grab from setCurrentDefaults
    static MARKER_CROSS   = 1;  // 'X' not '+'
    static MARKER_PLUS    = 2;
    static MARKER_OUTLINE_DIAMOND = 3;
    static MARKER_OUTLINE_SQUARE  = 4;
    static MARKER_ASTERISK_6   = 5;
    static MARKER_ASTERISK_8   = 6;
    static MARKER_FILLED_DIAMOND = 7;
    static MARKER_FILLED_SQUARE  = 8;
    static MARKER_DOT            = 9;
    static MARKER_OUTLINE_CIRCLE = 0xA;
    static MARKER_BLANK = 0x40;

    static COLOR_MODE_STANDARD = 0;
    static COLOR_MODE_EXTENDED = 1;
    static COLOR_MODE_PROCESS  = 2;

    static LINE_MODE_WHOLE = 0;
    static LINE_MODE_FRACTIONAL = 1;
    // process color constants
}

class GraphicsData {
    data:Uint8Array;
    offset:number;

    constructor(data:Uint8Array,
		offset:number){
	this.data = data;
	this.offset = offset;
    }

    getU8(offset:number):number {
	return this.data[offset]&0xFF;
    }

    getU16(offset:number):number{
	let hi = this.data[offset]&0xFF;
	let lo = this.data[offset+1]&0xFF;
	return (hi<<8)|lo;
    }

    getS16(offset:number):number{
	let hi = this.data[offset]&0xFF;
	let lo = this.data[offset+1]&0xFF;
	let value = (hi<<8)|lo;
	if (value & 0x8000){
	    return -(0x10000-value);
	} else {
	    return value;
	}
    }
}

class Command extends GraphicsData {
    
    
    constructor(data:Uint8Array,
		offset:number){
	super(data,offset);
    }
}

class Coordinate {
    x:number;
    y:number;

    constructor(x:number, y:number){
	this.x = x;
	this.y = y;
    }

    toString(){
	return "("+this.x+","+this.y+")";
    }
}

class Instruction extends GraphicsData implements Renderable {
    instructionCode:number;
    headerLength:number;
    dataLength:number;
    
    constructor(instructionCode:number,
		headerLength:number,
		dataLength:number,
		data:Uint8Array,
		offset:number){
	super(data,offset);
	this.instructionCode = instructionCode;
	this.headerLength = headerLength;
	this.dataLength = dataLength;
	this.offset = offset;
    }

    getSetName(){
	let setCode:number = this.data[this.offset+2]&0xFF;
	switch (setCode){
	    case 0x00: return "Drawing";
	    case 0x01: return "Line";
	    case 0x02: return "Character";
	    case 0x03: return "Marker";
	    case 0x04: return "Pattern";
	    case 0x0B: return "Arc";
	    case 0x10: return "ProcessColor";
	    case 0x11: return "NormalLineWidth";
	    default: return "Reserved_"+Utils.hexString(setCode);
	}
    }

    getU8(pos:number):number{
	return super.getU8(this.offset+pos);
    }

    getU16(pos:number):number{
	return super.getU16(this.offset+pos);
    }

    getS16(pos:number):number{
	return super.getS16(this.offset+pos);
    }


    render(env:GOCAEnvironment,
	   ctx:CanvasRenderingContext2D):void{
	let logger = Utils.graphicsLogger;
	let instr = this;
	let code = this.instructionCode;
	let gc = GraphicsConstants;
	let data = this.data;
	switch (code){
	    case gc.INSTRUCTION_SCD:
		let flags = this.getU8(5);
		let setCode:number = this.data[this.offset+2]&0xFF;
		let mask = this.getU16(3);
		let pos = 6;
		switch (setCode){
		    case 0x00: // Drawing
			{
			    if (mask & 0x8000){
				let colorValue = this.getU16(pos);
				env.extendedColor = colorValue;
				env.colorMode = gc.COLOR_MODE_EXTENDED;
				pos+=2;
			    }
			    if (mask & 0x2000){
				env.mix = this.getU8(pos++);
			    }
			    if (mask & 0x1000){
				let backgroundMixValue = this.getU8(pos++);
			    }
			}
			break;
		    case 0x01: // Line
			if (mask & 0x8000){
			    env.lineType = this.getU8(pos++);
			}
			if (mask & 0x4000){
			    env.lineWidth = this.getU8(pos++);
			}
			if (mask & 0x2000){
			    env.lineEndType = this.getU8(pos++);
			}
			if (mask & 0x1000){
			    env.lineJoinType = this.getU8(pos++);
			}
			break;
		    case 0x02: // Character
			logger.warn("need to handle character SCD");
			break;
		    case 0x03: // Marker
			if (mask & 0x4000){
			    let markerCellWidth = this.getU16(pos);
			    let markerCellHeight = this.getU16(pos+2);
			    pos++;
			}
			if (mask & 0x1000){
			    let markerPrecision = this.getU8(pos++);
			}
			if (mask & 0x0800){
			    env.markerSetID = this.getU8(pos++);
			}
			if (mask & 0x0100){
			    env.markerSymbol = this.getU8(pos++);
			}
			break;
		    case 0x04: // Pattern
			logger.warn("need to handle pattern SCD");
			break;
		    case 0x0B: // Arc"
		    case 0x10: 
			logger.warn("need to processColor character SCD");
			break;
		    case 0x11: 
			logger.warn("need to processColor character SCD");
			break;
		    default:
			logger.warn("surprising SCD defaults set=0x"+Utils.hexString(setCode));
			break;
		}
		 /*
		   Here monday - settings to env + 
		   upgrade graphics test to have more objects per above 
		   worry about default color (green/standard)
		 */
		break;
	    default:
		// ignore other instruction for now
		break;
	}
    }

    toString():string{
	let instr = this;
	let code = this.instructionCode;
	let gc = GraphicsConstants;
	let data = this.data;
	let offset = this.offset;
	let coordinateAt = function(pos:number) {
	    let x = instr.getS16(pos);
	    let y = instr.getS16(pos+2);
	    return new Coordinate(x,y);
	}
	switch (code){
	    case gc.INSTRUCTION_SCD:
		{
		    let flags = this.getU8(5);
		    let text = "<SCD:SetCurDefaults "+this.getSetName()+" mask=0x"+Utils.hexString(this.getU16(3));
		    if ((flags & 0x80) === 0){
			text += " to default";
		    }
		   
		    return text+">";
		}
	    default:
		return "<Instruction unknown code "+Utils.hexString(code)+">";
	}
    }
		
}

class Order extends GraphicsData implements Renderable {
    orderCode:number;
    headerLength:number;
    dataLength:number;
    
    constructor(orderCode:number,
		headerLength:number,
		dataLength:number,
		data:Uint8Array,
		offset:number){
	super(data,offset);
	this.orderCode = orderCode;
	this.headerLength = headerLength;
	this.dataLength = dataLength;
	this.offset = offset;
    }

    getColorspaceName(){
	let spaceCode:number = this.data[this.offset+2]&0xFF;
	switch (spaceCode){
	    case 0x01: return "RGB";
	    case 0x04: return "CMYK";
	    case 0x06: return "Highlight";
	    case 0x08: return "CIELAB";
	    case 0x40: return "Standard(G)OCA";
	    default: return "Unknown_"+Utils.hexString(spaceCode);
	}
    }

    getU8(pos:number):number{
	return super.getU8(this.offset+pos);
    }

    getU16(pos:number):number{
	return super.getU16(this.offset+pos);
    }

    getS16(pos:number):number{
	return super.getS16(this.offset+pos);
    }

    coordinateAt(pos:number):Coordinate {
	let x = this.getS16(pos);
	let y = this.getS16(pos+2);
	return new Coordinate(x,y);
    }

    beginArea(env:GOCAEnvironment,
	      ctx:CanvasRenderingContext2D):void {
	let flags = this.getU8(1);
	env.areaHasOutline = ((flags & 0x40) === 0x40);
	env.areaFillRule = (flags & 0x20) ? "nonzero" : "evenodd";
	env.areaPath = new Path2D();
	console.log("JOEG BEGIN AREA "+env.areaPath);
    }

    static p2Start = 10;

    static boxTest = false;

    endArea(env:GOCAEnvironment,
	    ctx:CanvasRenderingContext2D):void {
	let logger = Utils.graphicsLogger;
	ctx.globalAlpha = 1.0;
	if (env.areaPath){
	    console.log("JOEG fill Mk3 "+env.areaPath+" rule="+env.areaFillRule);
	    env.areaPath.closePath();
	    ctx.fill(env.areaPath,"nonzero"); // env.areaFillRule);
	    if (env.areaHasOutline){
		ctx.stroke(env.areaPath);
	    }
	} else {
	    console.log("JOEG No area set for EndArea");
	    logger.warn("No area set for EndArea");
	}
	if (Order.boxTest){
	    let p2 = new Path2D();
	    let p2Start = Order.p2Start;
	    ctx.beginPath();
	    ctx.moveTo(p2Start,150);
	    ctx.lineTo(p2Start,180);
	    ctx.stroke();
	    let y = 70;
	    let size = 8;
	    console.log("JOEG p2Start="+p2Start);
	    p2.moveTo(p2Start,     y);
	    p2.lineTo(p2Start,     y+size);
	    p2.lineTo(p2Start+size,y+size);
	    p2.lineTo(p2Start+size,y);
	    p2.lineTo(p2Start,     y);
	    p2.closePath();
	    Order.p2Start = p2Start+30;
	    ctx.fillStyle = "yellow";
	    ctx.strokeStyle = "white";
	    ctx.fill(p2,"evenodd");
	    ctx.stroke(p2);
	    y = 90;
	    ctx.beginPath();
	    ctx.moveTo(p2Start,     y);
	    ctx.lineTo(p2Start,     y+size);
	    ctx.lineTo(p2Start+size,y+size);
	    ctx.lineTo(p2Start+size,y);
	    ctx.lineTo(p2Start,     y);
	    ctx.closePath();
	    ctx.fillStyle = "red";
	    ctx.strokeStyle = "blue";
	    ctx.fill("nonzero");
	    ctx.stroke();
	}
	env.areaPath = null;
    }
	    
    /* if new line move to is fine
       but if area, there should only be one

       We move if 
         area ? first
         ! firstPoint and not in area

         case          area   notArea
           LINE a,b       M         M
           CLINE c,d      L         L
           CLINE d,e      L         L
    */
    
    polyline(env:GOCAEnvironment,
	     ctx:CanvasRenderingContext2D,
	     pointsAreDeltas:boolean,
	     useCurrent:boolean,
	     dataStart:number):void{
	// if not path and useCurrent
	let path:Path2D = env.areaPath ? env.areaPath : new Path2D();
	let len = this.headerLength + this.dataLength;
	if (!env.areaPath){
	    console.log("JOEG no area move to "+env.currentPos);
	    path.moveTo(env.currentPos.x,env.currentPos.y);
	}
	if (!useCurrent){
	    let firstPointOrDelta = this.coordinateAt(2);
	    let firstPointX = (pointsAreDeltas ? env.currentPos.x + firstPointOrDelta.x : firstPointOrDelta.x);
	    let firstPointY = (pointsAreDeltas ? env.currentPos.y + firstPointOrDelta.y : firstPointOrDelta.y);
	    env.currentPos = new Coordinate(firstPointX,firstPointY);
	    console.log("JOEG firstPoint move "+firstPointX,firstPointY);
	    path.moveTo(firstPointX,firstPointY);
	}
	let anyLines:boolean = false;
	for (let pos = dataStart; pos<len; pos+=4){
	    let pointOrDelta = this.coordinateAt(pos);
	    let pointX = (pointsAreDeltas ? env.currentPos.x + pointOrDelta.x : pointOrDelta.x);
	    let pointY = (pointsAreDeltas ? env.currentPos.y + pointOrDelta.y : pointOrDelta.y);
	    let newPoint = new Coordinate(pointX,pointY);
	    console.log("JOEG poly line was "+env.currentPos+" to "+newPoint);
	    env.currentPos = newPoint;
	    path.lineTo(pointX,pointY);
	    anyLines = true;
	}
	if (!env.areaPath && anyLines){
	    ctx.stroke(path);
	}
    }

    bezier(env:GOCAEnvironment,
	  ctx:CanvasRenderingContext2D,
	   useCurrent:boolean,
	  dataStart:number):void{
	
    }

    drawMark(env:GOCAEnvironment,
	     ctx:CanvasRenderingContext2D,
	     center:Coordinate):void{
	console.log("JOEG mark at "+center);
	let gc = GraphicsConstants;
	let logger = Utils.graphicsLogger;
	let width = 4;
	let height = 4;
	let halfWidth = width/2;
	let halfHeight = height/2;
	switch (env.markerSymbol){
	    case gc.MARKER_DEFAULT: 
	    case gc.MARKER_CROSS:  // 'X' not '+'
		{
		    let path = new Path2D();
		    path.moveTo(center.x-halfWidth,center.y-halfHeight);
		    path.lineTo(center.x+halfWidth,center.y+halfHeight);
		    ctx.stroke(path);
		    path = new Path2D();
		    path.moveTo(center.x-halfWidth,center.y+halfHeight);
		    path.lineTo(center.x+halfWidth,center.y-halfHeight);
		    ctx.stroke(path);
		}
		break;
	    case gc.MARKER_PLUS:
		{
		    let path = new Path2D();
		    path.moveTo(center.x+halfWidth,center.y);
		    path.lineTo(center.x-halfWidth,center.y);
		    ctx.stroke(path);
		    path = new Path2D();
		    path.moveTo(center.x,center.y+halfHeight);
		    path.lineTo(center.x,center.y-halfHeight);
		    ctx.stroke(path);
		}
		break;
	    case gc.MARKER_OUTLINE_DIAMOND:
		{
		    let path = new Path2D();
		    path.moveTo(center.x+halfWidth,center.y);
		    path.lineTo(center.x,center.y+halfHeight);
		    path.lineTo(center.x-halfWidth,center.y);
		    path.lineTo(center.x,center.y-halfHeight);
		    path.closePath();
		    ctx.stroke(path);
		}
		break;
	    case gc.MARKER_OUTLINE_SQUARE:		
		ctx.strokeRect(center.x-halfWidth,center.y-halfHeight,height,width);
		break;
	    case gc.MARKER_ASTERISK_6:
	    case gc.MARKER_ASTERISK_8:
		{
		    let path = new Path2D();
		    path.moveTo(center.x-halfWidth,center.y-halfHeight);
		    path.lineTo(center.x+halfWidth,center.y+halfHeight);
		    ctx.stroke(path);
		    path = new Path2D();
		    path.moveTo(center.x-halfWidth,center.y+halfHeight);
		    path.lineTo(center.x+halfWidth,center.y-halfHeight);
		    ctx.stroke(path);
		    // only do the horizontal line if in the 8-point asterisk
		    if (env.markerSymbol == gc.MARKER_ASTERISK_8){
			path = new Path2D();
			path.moveTo(center.x+halfWidth,center.y);
			path.lineTo(center.x-halfWidth,center.y);
			ctx.stroke(path);
		    }
		    path = new Path2D();
		    path.moveTo(center.x,center.y+halfHeight);
		    path.lineTo(center.x,center.y-halfHeight);
		    ctx.stroke(path);
		}
	    case gc.MARKER_FILLED_DIAMOND:
		{
		    let path = new Path2D();
		    path.moveTo(center.x+halfWidth,center.y);
		    path.lineTo(center.x,center.y+halfHeight);
		    path.lineTo(center.x-halfWidth,center.y);
		    path.lineTo(center.x,center.y-halfHeight);
		    path.closePath();
		    ctx.fill(path);
		}
		break;
	    case gc.MARKER_FILLED_SQUARE:
		ctx.strokeRect(center.x-halfWidth,center.y-halfHeight,height,width);
		break;
	    case gc.MARKER_DOT:
		{
		    let path = new Path2D();
		    path.arc(center.x, center.y, 2, 0, 2 * Math.PI);
		    ctx.fill(path);
		}
		break;
	    case gc.MARKER_OUTLINE_CIRCLE:
		{
		    let path = new Path2D();
		    path.arc(center.x, center.y, halfWidth, 0, 2 * Math.PI);
		    ctx.stroke(path);
		}
		break;
	    case gc.MARKER_BLANK:
		break;
	    default:
		logger.warn("unknown marker symbol 0x"+Utils.hexString(env.markerSymbol));
	}
    }

    marks(env:GOCAEnvironment,
	  ctx:CanvasRenderingContext2D,
	  useCurrent:boolean,
	  dataStart:number):void{
	let len = this.headerLength + this.dataLength;
	console.log("JOEG marks useCur="+useCurrent+" len="+len+" dataStart="+dataStart);
	if (!useCurrent && len < 6){ // might not ever happen
	    return;
	}
	let firstPoint = (useCurrent? env.currentPos : this.coordinateAt(2));
	console.log("JOEG mark first "+firstPoint);
	this.drawMark(env,ctx,firstPoint);
	env.currentPos = firstPoint;
	for (let pos = dataStart; pos<len; pos+=4){
	    let newPoint = this.coordinateAt(pos);
	    this.drawMark(env,ctx,newPoint);
	    env.currentPos = newPoint;
	}
    }

    box(env:GOCAEnvironment,
	ctx:CanvasRenderingContext2D,
	useCurrent:boolean,
	dataStart:number):void{

    }

    text(env:GOCAEnvironment,
	 ctx:CanvasRenderingContext2D,
	 useCurrent:boolean,
	 dataStart:number):void{

    }

    fullArc(env:GOCAEnvironment,
	    ctx:CanvasRenderingContext2D,
	    useCurrent:boolean,
	    dataStart:number):void{
	
    }

    beginImage(env:GOCAEnvironment,
	       ctx:CanvasRenderingContext2D,
	       useCurrent:boolean,
	       dataStart:number):void{
	
    }

    addImageData(env:GOCAEnvironment,
		 ctx:CanvasRenderingContext2D):void {

    }

    endImage(env:GOCAEnvironment,
	     ctx:CanvasRenderingContext2D):void {

    }

    setMarkerCell(env:GOCAEnvironment,
		  ctx:CanvasRenderingContext2D){
	let logger = Utils.graphicsLogger;
	logger.warn("need to handle set marker cell someday");
    }

    static getComponentByteWidth(bits:number):number {
	let byteWidth = Math.ceil(bits/8);
	// we allow up to 48 bit color, but please
	if (byteWidth === 1 || byteWidth === 2){
	    return byteWidth;
	}
	return -1;
    }

    setProcessColor(env:GOCAEnvironment,
		    ctx:CanvasRenderingContext2D):void {
	let logger = Utils.graphicsLogger;
	let spaceCode:number = this.data[this.offset+2]&0xFF;
	let component1Bits = this.getU8(8);
	let component2Bits = this.getU8(9);
	let component3Bits = this.getU8(10);
	let component4Bits = this.getU8(11);
	switch (spaceCode){
	    case 0x01: // RGB
		{
		    let component1Bytes = Order.getComponentByteWidth(component1Bits/8);
		    let component2Bytes = Order.getComponentByteWidth(component2Bits/8);
		    let component3Bytes = Order.getComponentByteWidth(component3Bits/8);
		    if (component1Bytes === -1 ||
			component2Bytes === -1 ||
			component3Bytes === -1 ){
			logger.warn("RGB Process color component not in 1 or 2 bytes");
			return;
		    }
		    let pos = 12;
		    let rData:number = 0;
		    let gData:number = 0;
		    let bData:number = 0;
		    if (component1Bytes == 1){
			rData = this.getU8(pos);
			pos++;
		    } else {
			rData = this.getU16(pos);
			pos+=2;
		    }
		    if (component1Bytes == 1){
			gData = this.getU8(pos);
			pos++;
		    } else {
			gData = this.getU16(pos);
			pos+=2;
		    }
		    if (component1Bytes == 1){
			bData = this.getU8(pos);
			pos++;
		    } else {
			bData = this.getU16(pos);
			pos+=2;
		    }
		    env.rFraction = rData/Math.pow(2,component1Bits);
		    env.gFraction = gData/Math.pow(2,component2Bits);
		    env.bFraction = bData/Math.pow(2,component3Bits);
		    logger.debug("Process color is "+env.rFraction+","+env.gFraction+","+env.bFraction);
		}
		break;
	    default:
		logger.warn("No Support yet for colorSpace="+this.getColorspaceName());
	}
    }
    
    render(env:GOCAEnvironment,
	   ctx:CanvasRenderingContext2D):void{
	let logger = Utils.graphicsLogger;
	let order = this;
	let code = this.orderCode;
	let gc = GraphicsConstants;
	let data = this.data;
	switch (code){
	    case gc.ORDER_GNOP1:
	    case gc.ORDER_GCOMT:
		break;
	    case gc.ORDER_GSPS:   // Set Pattern Set
		env.patternSetID = this.getU8(1);
		break;
	    case gc.ORDER_GSCOL:  // Set Color
		{
		    let colorArg = this.getU8(1);
		    env.extendedColor = 0xFF00 | colorArg;
		    logger.debug("JOEG GSCOL arg=0x"+Utils.hexString(colorArg)+" extCol= 0x"+Utils.hexString(env.extendedColor));
		    env.colorMode = gc.COLOR_MODE_EXTENDED;
		    env.setColors(ctx);
		}
		break;
	    case gc.ORDER_GSMX:   // Set Mix
		env.mix = this.getU8(1);
		break;
	    case gc.ORDER_GSLT:   // Set Line Type
		env.lineType = this.getU8(1);
		break;
	    case gc.ORDER_GSLW:   // Set Line Width
		env.lineWidth = this.getU8(1);
		ctx.lineWidth = env.lineWidth;
		env.lineMode = gc.LINE_MODE_WHOLE;
		break;
	    case gc.ORDER_GSLE:   // Set Line End
		env.setLineEndType(ctx,this.getU8(1));
		break;
	    case gc.ORDER_GSLJ:   // Set Line Join
		env.setLineJoinType(ctx,this.getU8(1));
		break;
	    case gc.ORDER_GSCP:   // Set Current Position
		env.currentPos = this.coordinateAt(2);
		break;
	    case gc.ORDER_GSAP:   // Set Arc Parameters
		// arcs take a unit circle and map it to any ellipse
		// skewed to any angle
		env.arcTransform = [ this.getU16(2), this.getU16(2), this.getU16(2), this.getU16(2)];
		break;
	    case gc.ORDER_GSECOL: // Set Extended Color
		env.extendedColor = this.getU16(2);
		env.colorMode = gc.COLOR_MODE_EXTENDED;
		env.setColors(ctx);
		break;
	    case gc.ORDER_GSPT:   // Set Pattern Symbol
		env.patternSymbol = this.getU8(1);
		break;
	    case gc.ORDER_GSMT:   // Set Marker Symbol
		env.markerSymbol = this.getU8(1);
		break;
	    case gc.ORDER_GSMC:   // Set Marker Cell
		order.setMarkerCell(env,ctx);
		break;
	    case gc.ORDER_GSMS:   // Set Marker Set
		env.markerSetID = this.getU8(1);
		break;
	    case gc.ORDER_GEPROL: // End Prolog
		env.inProlog = false;
		break;
	    case gc.ORDER_GEAR:   // End Area
		order.endArea(env,ctx);
		break;
	    case gc.ORDER_GBAR:   // Begin Area
		order.beginArea(env,ctx);
		break;
	    case gc.ORDER_GIMD:   // Image Data
		// length must be ceil(<imageWidth>/8)
		// a single scanline
		order.addImageData(env,ctx);
		break;
	    case gc.ORDER_GEIMG:  // End Image
		order.endImage(env,ctx);
		break;
	    case gc.ORDER_GSPCOL: // Set Process Color
		order.setProcessColor(env,ctx);
		break;
	    case gc.ORDER_GCBOX:  // Box at Current Position
		order.box(env,ctx,true,4);
		break;
	    case gc.ORDER_GBOX:   // Box at Given Position
		order.box(env,ctx,false,8);
		break;
	    case gc.ORDER_GCLINE: // (Poly)Line at Current Position
		order.polyline(env,ctx,false,true,2);
		break;
	    case gc.ORDER_GLINE:  // (Poly)Line at Given Position
		order.polyline(env,ctx,false,false,6);
		break;
	    case gc.ORDER_GCMRK:  // Marker at Current Position
		order.marks(env,ctx,true,2);
		break;
	    case gc.ORDER_GMRK:   // Marker at Given Position
		order.marks(env,ctx,false,6);
		break;
            case gc.ORDER_GCCHST: // Character String at Current Position
		order.text(env,ctx,true,2);
		break;
	    case gc.ORDER_GCHST:  // Character String at Given Position
		order.text(env,ctx,true,2);
		break;
	    case gc.ORDER_GCFARC: // Full Arc at Current Position
		order.fullArc(env,ctx,false,6);
		break;
	    case gc.ORDER_GFARC:  // Full Arc at Given Position
		order.fullArc(env,ctx,false,6);
		break;
	    case gc.ORDER_GCBIMG: // Begin Image at Current Position
		order.beginImage(env,ctx,true,4);
		break;
	    case gc.ORDER_GBIMG:  // Begin Image at Given Position
		order.beginImage(env,ctx,false,8);
		break;
	    case gc.ORDER_GCRLINE:// Relative (Poly)Line at Current Position
		order.polyline(env,ctx,true,true,2);
		break;
	    case gc.ORDER_GRLINE: // Relative (Poly)Line at Given Position
		order.polyline(env,ctx,true,false,6);
		break;
	    case gc.ORDER_GCCBEZ: // Cubic Bezier Curve at Current Position
		order.bezier(env,ctx,true,2);
		break;
	    case gc.ORDER_GCBEZ:  // Cubic Bezier Curve at Given Position
		order.bezier(env,ctx,false,6);
		break;
            default:
		throw "Render failure: unsuppoted order "+this;
	}
    }

    toString():string{
	let order = this;
	let code = this.orderCode;
	let gc = GraphicsConstants;
	let data = this.data;
	let hLen = this.headerLength;
	let dLen = this.dataLength;
	let len = hLen+dLen;
	let offset = this.offset;
	let getU8 = function(pos:number):number { return data[offset+pos]&0xff };
	let d1 = (dLen >= 1 ? data[offset+hLen+0] : 0);
	let d2 = (dLen >= 2 ? data[offset+hLen+1] : 0);
	let getS16 = function(pos:number):number { return order.getS16(pos); };
	let getU16 = function(pos:number):number { return order.getU16(pos); };
	let coordinateAt = function(pos:number) {
	    let x = getS16(pos);
	    let y = getS16(pos+2);
	    return new Coordinate(x,y);
	}
	switch (code){
	    case gc.ORDER_GNOP1:
		return "<Order: GNOP1>";
	    case gc.ORDER_GCOMT:
		return "<Order: GCOMT: >";
	    case gc.ORDER_GSGCH:  // Segment Characteristics
		return "<Order GSGCH>";
	    case gc.ORDER_GSPS:   // Set Pattern Set
		{
		    let text = "<Order GSPS lcid="+Utils.hexString(getU8(1))+">";
		    return text;
		}
	    case gc.ORDER_GSCOL:  // Set Color
		return "<Order GSCOL color="+Utils.hexString(getU8(1))+">";
	    case gc.ORDER_GSMX:   // Set Mix
		return "<Order GSMX mix="+Utils.hexString(getU8(1))+">";
	    case gc.ORDER_GSBMX:  // Set Background Mix
		return "<Order GSBMX>";
	    case gc.ORDER_GSFLW:  // Set Fractional Line Width
		return "<Order GSFLW>";
	    case gc.ORDER_GSLT:   // Set Line Type
		return "<Order GSLT lineType="+Utils.hexString(getU8(1))+">";
	    case gc.ORDER_GSLW:   // Set Line Width
		return "<Order GSLW mult="+getU8(1)+">";
	    case gc.ORDER_GSLE:   // Set Line End
		return "<Order GSLE endType="+Utils.hexString(getU8(1))+">";
	    case gc.ORDER_GSLJ:   // Set Line Join
		return "<Order GSLJ joinType="+Utils.hexString(getU8(1))+">";
	    case gc.ORDER_GSCLT:  // Set Custom Line Type
		return "<Order GSCLT>";
	    case gc.ORDER_GSCP:   // Set Current Position
		return "<Order GSCP pos="+coordinateAt(2)+">";
	    case gc.ORDER_GSAP:   // Set Arc Parameters
		// arcs take a unit circle and map it to any ellipse
		// skewed to any angle
		return "<Order GSAP arc xform=["+getU16(2)+" "+getU16(2)+
		    " "+getU16(2)+" "+getU16(2)+"]>";
	    case gc.ORDER_GSECOL: // Set Extended Color
		return "<Order GSECOL color="+Utils.hexString(getU16(2))+">";  // applies to char/image/line/marker/pat
	    case gc.ORDER_GSPT:   // Set Pattern Symbol
		return "<Order GSPT pat="+Utils.hexString(getU8(1))+">";
	    case gc.ORDER_GSMT:   // Set Marker Symbol
		return "<Order GSMT mrkr="+Utils.hexString(getU8(1))+">";
	    case gc.ORDER_GSCC:   // Set Character Cell
		return "<Order GSCC>";
	    case gc.ORDER_GSCA:   // Set Character Angle
		return "<Order GSCA>";
	    case gc.ORDER_GSCH:   // Set Character Shear
		return "<Order GSCH>";
	    case gc.ORDER_GSMC:   // Set Marker Cell
		return "<Order GSMC>";
	    case gc.ORDER_GSCS:   // Set Character Set
		return "<Order GSCS lcid="+Utils.hexString(getU8(1))+">";
	    case gc.ORDER_GSCR:   // Set Character Precision
		return "<Order GSCR>";
	    case gc.ORDER_GSCD:   // Set Character Direction
		return "<Order GSCD>";
	    case gc.ORDER_GSMP:   // Set Marker Precision
		return "<Order GSMP>";
	    case gc.ORDER_GSMS:   // Set Marker Set
		return "<Order GSMS lcd="+Utils.hexString(getU8(1))+">";
	    case gc.ORDER_GEPROL: // End Prolog
		return "<Order GEPROL>";
	    case gc.ORDER_GECP:   // End Custom Pattern
		return "<Order GECP>";
	    case gc.ORDER_GEAR:   // End Area
		return "<Order GEAR (End Area)>";
	    case gc.ORDER_GBAR:   // Begin Area
		return "<Order GBAR (Begin Area) stroke="+
		    (d1&0x40 ? "F" : "T")+" winding="+
		    (d1&0x20 ? "Alternate" : "NonZero")+
		    ">";
	    case gc.ORDER_GIMD:   // Image Data
		// length must be ceil(<imageWidth>/8)
		// a single scanline
		return "<Order GIMD image line len="+d1+">";
	    case gc.ORDER_GEIMG:  // End Image
		return "<Order GEIMG>";
	    case gc.ORDER_GSPRP:  // Set Pattern Reference Point
		return "<Order GSPRP>";
	    case gc.ORDER_GSPCOL: // Set Process Color
		return "<Order GSPCOL colorspace="+this.getColorspaceName()+">";
	    case gc.ORDER_GCBOX:  // Box at Current Position
	    case gc.ORDER_GBOX:   // Box at Given Position
		{
		    // counter-clockwise if first/current (x1-x2/ y1-y2) > 0
		    let text = (code === gc.ORDER_GCBOX ?
			"<Order GCBOX start=(cur)" :
			"<Order GBOX start="+coordinateAt(4));
		    let pos = (code === gc.ORDER_GCBOX ? 4 : 8);
		    text += " to "+coordinateAt(pos);
		    pos += 4;
		    if (len > pos){ // has rounded corners
			text += " rounding ellipse.x="+getU16(pos)+" .y="+getU16(pos+2);
		    }
		    return text+">";
		}
	    case gc.ORDER_GCLINE: // (Poly)Line at Current Position
	    case gc.ORDER_GLINE:  // (Poly)Line at Given Position
		{
		    let text = (code === gc.ORDER_GCLINE ?
			"<Order GCLINE start=(cur)" :
			"<Order GLINE start="+coordinateAt(2));
		    let pos = (code === gc.ORDER_GCLINE ? 2 : 6);
		    for (;pos<len; pos+=4){
			text += (" "+coordinateAt(pos));
		    }
		    return text+">";
		}
	    case gc.ORDER_GCMRK:  // Marker at Current Position
	    case gc.ORDER_GMRK:   // Marker at Given Position
		{
		    let text = (code === gc.ORDER_GCMRK ?
			"<Order GCMRK start=(cur)" :
			"<Order GMRK start="+coordinateAt(2));
		    let pos = (code === gc.ORDER_GCMRK ? 2 : 6);
		    for (;pos<len; pos+=4){
			text += (" "+coordinateAt(pos));
		    }
		    return text+">";
		}
            case gc.ORDER_GCCHST: // Character String at Current Position
	    case gc.ORDER_GCHST:  // Character String at Given Position
		{
		    let text = (code === gc.ORDER_GCCHST?
			"<Order GCCHST at (cur)" :
			"<Order GCHST at "+coordinateAt(2));
		    return text + " len=0x"+(d1-4)+">";
		}
	    case gc.ORDER_GCFLT:  // Fillet at Current Position
	    case gc.ORDER_GFLT:   // Fillet at Given Position
		{
		    let text = (code === gc.ORDER_GCFLT ?
			"<Order GCFLT (fillet) at (cur)" :
			"<Order GFLT (fillet) at "+coordinateAt(2));
		    // there's a run of (cp1, cp2, endPoint) - 12 bytes each 
		    return text + " len=0x"+(d1-4)+">";
		}
	    case gc.ORDER_GCFARC: // Full Arc at Current Position
	    case gc.ORDER_GFARC:  // Full Arc at Given Position
		{
		    // meaningless w/o Set Arc Parameters order preceding it
		    let text = (code === gc.ORDER_GCFARC ?
			"<Order GCFARC center at (cur)" :
			"<Order GFARC center at "+coordinateAt(2));
		    let pos = (code === gc.ORDER_GCFARC ? 2 : 6);
		    return text + " scale="+getU8(pos)+"."+(getU8(pos+1))/256+">";
		}
	    case gc.ORDER_GCBIMG: // Begin Image at Current Position
	    case gc.ORDER_GBIMG:  // Begin Image at Given Position
		{
		    let text = (code === gc.ORDER_GCBIMG ?
			"<Order GCBIMG at (cur)" :
			"<Order GBIMG at "+coordinateAt(2));
		    let pos = (code === gc.ORDER_GCBIMG ? 4 : 8);
		    return text+" w="+getU16(pos)+" h="+getU16(pos+2)+">";
		}
	    case gc.ORDER_GBCP:   // Begin Custom Pattern
		return "<Order GBCP>";
	    case gc.ORDER_GDPT:   // Delete Pattern
		return "<Order GDPT>";
	    case gc.ORDER_GCRLINE:// Relative (Poly)Line at Current Position
	    case gc.ORDER_GRLINE: // Relative (Poly)Line at Given Position
		{
		    let text = (code === gc.ORDER_GCRLINE ?
			"<Order GCRLINE start=(cur)" :
			"<Order GRLINE start="+coordinateAt(2));
		    let pos = (code === gc.ORDER_GCLINE ? 2 : 6);
		    for (;pos<len; pos+=4){
			text += (" dxy="+coordinateAt(pos));
		    }
		    return text+">";
		}
	    case gc.ORDER_GCPARC: // Partial Arc at Current Position
	    case gc.ORDER_GPARC:  // Partial Arc at Given Position
		return "<Order Partial Arc (what a mess!)>";
	    case gc.ORDER_GCCBEZ: // Cubic Bezier Curve at Current Position
	    case gc.ORDER_GCBEZ:  // Cubic Bezier Curve at Given Position
		{
		    let text = (code === gc.ORDER_GCCBEZ ?
			"<Order GCCBEZ at (cur)" :
			"<Order GCBEZ at "+coordinateAt(2));
		    // there's a run of (cp1, cp2, endPoint) - 12 bytes each 
		    return text + " len=0x"+(d1-4)+">";
		}
		// Gradients support process color
	    case gc.ORDER_GLGD: // Linear Gradient
		return "<Order GLGD (lin grad)>";
	    case gc.ORDER_GRGD: // Radial Gradient
		return "<Order GRGD (rad grad)>";
            default:
		return "<Order unknown code "+Utils.hexString(this.orderCode)+">";
	}
    }
}

class Segment extends GraphicsData implements Renderable {
    orders:Order[] = [];
    

    constructor(data:Uint8Array,
		offset:number){
	super(data,offset);
    }

    toString():string {
	return "<Segment: order.ct="+this.orders.length+">";
    }

    render(env:GOCAEnvironment,
	   ctx:CanvasRenderingContext2D):void{
	let logger = Utils.graphicsLogger;
	let flag2 = this.data[this.offset+7];
	let unchained = flag2 & 0x80;
	if (unchained){
	    logger.warn("unchained segment will not be drawn");
	    return;
	}
	let isAppendedData = ((flag2 & 0x6)>>1) === 0x3;
	if (isAppendedData){
	    logger.warn("appended segment data not yet handled");
	    return;
	}
	let segmentEnv:GOCAEnvironment = env.mycopy(); // { ... env } as GOCAEnvironment; // idiomatic for clone with Type
	segmentEnv.inProlog = ((flag2 & 0x10) != 0);
	try {
	    ctx.save();
	    segmentEnv.setColors(ctx);
	    let orderArray = this.orders;
	    for (let i=0; i<orderArray.length; i++){
		let order = this.orders[i];
		console.log("JOEG render order loop "+order);
		order.render(segmentEnv,ctx);
	    }
	} catch (e){
	    logger.warn("Segment render failed "+e);
	} finally {
	    console.log("JOEG Segment Restore");
	    ctx.restore();
	}
    }
}

class Procedure extends GraphicsData implements Renderable {
    instructions:Instruction[] = [];

    constructor(data:Uint8Array,
		offset:number){
	super(data,offset);
    }

    toString():string {
	return "<Procedure: instr.ct="+this.instructions.length+">";
    }

    render(env:GOCAEnvironment,
	   ctx:CanvasRenderingContext2D):void{
	let logger = Utils.graphicsLogger;
	this.instructions.forEach( instr => instr.render(env,ctx) );
    }
}

export class GraphicsFragment {
    objectType:number;
    data:Uint8Array;
    
    constructor(objectType:number,
		source:number[],
		offset:number, // in source
		length:number){
	this.objectType = objectType;
	this.data = new Uint8Array(length);
	for (let i=0; i<length; i++){
	    this.data[i] = source[offset+i]&0xFF;
	}
    }
		
}

export interface Renderable {
    render(env:GOCAEnvironment,
	   ctx:CanvasRenderingContext2D):void;
}


// The binding environment 
class GOCAEnvironment {

    lineMode:number = GraphicsConstants.LINE_MODE_WHOLE;
    lineType:number = GraphicsConstants.LINE_TYPE_DEFAULT;
    lineEndType:number = GraphicsConstants.LINE_END_DEFAULT;
    lineJoinType:number = GraphicsConstants.LINE_JOIN_DEFAULT;
    lineWidth:number = 1;       // x/256 of normal line width
    normalLineWidth:number = 1;  // 1/1440 of an inch (wow!)
    colorMode:number = GraphicsConstants.COLOR_MODE_EXTENDED;
    standardColor:number = 0;
    extendedColor:number = 0;
    rFraction:number = 0;
    gFraction:number = 0;
    bFraction:number = 0;
    mix:number = GraphicsConstants.MIX_DEFAULT;
    backgroundMix:number = GraphicsConstants.MIX_DEFAULT;

    markerSetID = 0;
    markerSymbol = 0;
    
    patternSetID = 0; // means default
    patternSymbol = 0;
    arcTransform = [1, 0, 0, 1]; // I think
    
    // more fast-moving stuff 
    currentPos:Coordinate = new Coordinate(0,0);
    inProlog = false;
    areaPath:Path2D|null = null;
    areaFillRule:CanvasFillRule = "evenodd";
    areaHasOutline:boolean = false;
    
    constructor(){
	
    }

    mycopy():GOCAEnvironment{
	let copy = new GOCAEnvironment();
	Object.assign(copy,this);
	return copy;
    }
   

    toString():string {
	return "<GOCAEnvironment>";
    }

    setLineJoinType(ctx:CanvasRenderingContext2D,
		    newJoinType:number):void{
	let logger = Utils.graphicsLogger;
	let gc = GraphicsConstants;
	switch (newJoinType){
	    case gc.LINE_JOIN_DEFAULT:
	    case gc.LINE_JOIN_ROUND:
		ctx.lineJoin = "round";
		break;
	    case gc.LINE_JOIN_BEVEL:
		ctx.lineJoin = "bevel"
		break;
	    case gc.LINE_JOIN_MITER:
		ctx.lineJoin = "miter";
		break;
	    default:
		logger.warn("unknown line join type "+Utils.hexString(newJoinType));
		ctx.lineJoin = "round";
		newJoinType = gc.LINE_JOIN_ROUND;
		break;
	}
	this.lineJoinType = newJoinType;
    }

    setLineEndType(ctx:CanvasRenderingContext2D,
		   newEndType:number):void{
	let logger = Utils.graphicsLogger;
	let gc = GraphicsConstants;
	switch (newEndType){
	    case gc.LINE_END_ROUND:
		ctx.lineCap = "round";
		break;
	    case gc.LINE_END_FLAT:
		ctx.lineCap = "butt"
		break;
	    case gc.LINE_END_SQUARE:
		ctx.lineCap = "square";
		break;
	    default:
		logger.warn("unknown line end type "+Utils.hexString(newEndType));
		ctx.lineJoin = "round";
		newEndType = gc.LINE_END_ROUND;
		break;
	}
	this.lineEndType = newEndType;
    }

    
    setColors(ctx:CanvasRenderingContext2D):void{
	let canvasColor = this.getCanvasColor();
	ctx.fillStyle = canvasColor; // "rgb(100,200,100)";
	ctx.strokeStyle = canvasColor;
    }

    /*
      All Colors start with 0xF or 0x0
      So, any color from 0x1000->EFFF is "open season"

      a 15-bit color space is proposed at 
      32 levels per 
     */

    getCanvasColor():string{
	switch (this.colorMode){
	    case GraphicsConstants.COLOR_MODE_EXTENDED:
		{
		    let defaultColor = "rgb(0,255,0)";
		    let color = this.extendedColor;
		    console.log("JOEG getCanvasColor extended=0x"+Utils.hexString(color));
		    switch (color){
			case 0x0000:
			case 0xFF00:
			    return defaultColor;
			case 0x0001:
			case 0xFF01:
			    return "rgb(0,0,255)";
			case 0x0002:
			case 0xFF02:
			    return "rgb(255,0,0)";
			case 0x0003: // Magenta/Pink
			case 0xFF03:
			    return "rgb(255,0,255)";
			case 0x0004: // Green 
			case 0xFF04:
			    return "rgb(0,255,0)";
			case 0x0005: // Cyan
			case 0xFF05:
			    return "rgb(0,255,255)";
			case 0x0006: // Yellow
			case 0xFF06:
			    return "rgb(255,255,0)";
			case 0x0007: // White
			case 0xFF07:
			    return "rgb(255,255,255)";
			case 0x0008: // Black
			case 0xFF08:
			    return "rgb(0,0,0)";
			case 0x0009: // Dark Blue
			    return "rgb(0,0,170)";
			case 0x000A: // Orange
			    return "rgb(255,128,0)";
                        case 0x000B: // Purple
			    return "rgb(170,0,160)";
			case 0x000C: // Dark Green
			    return "rgb(0,146,0)";
			case 0x000D: // Dark Turquoise/Cyan
			    return "rgb(0,146,170)";
			case 0x000E: // Mustard
			    return "rgb(196,160,32)";
			case 0x000F: // Gray
			    return "rgb(131,131,131)";
			case 0x0010: // Brown
			    return "rgb(144,48,0)";
			default:
			    if (color >= 0x1000 && color <= 0x8FFF){
				let rgb15 = (color-0x1000)&0x7FFF;
				let rgbSpec = ("rgb("+(((rgb15>>10)&0x1F)<<3)+","+
				    (((rgb15>>5)&0x1F)<<3)+","+((rgb15&0x1F)<<3)+")");
				console.log("JOEG made extended ECOL "+rgbSpec);
				return rgbSpec;
			    } else {
				return defaultColor;
			    }
		    }
		}
	    case GraphicsConstants.COLOR_MODE_PROCESS:
		return "rgb(40,60,100)"; // weird color for now
	    default:
		throw "Unexpected color mode "+this.colorMode;
	}
    }
}

export class GraphicsObject {
    objectType:number;
    data:Uint8Array;

    constructor(objectType:number,
		data:Uint8Array){
	this.objectType = objectType;
	this.data = data;
    }

    getU16(offset:number):number{
	let hi = this.data[offset]&0xFF;
	let lo = this.data[offset+1]&0xFF;
	return (hi<<8)|lo;
    }

    getS16(offset:number):number{
	let hi = this.data[offset]&0xFF;
	let lo = this.data[offset+1]&0xFF;
	let value = (hi<<8)|lo;
	if (value & 0x8000){
	    return -(0x10000-value);
	} else {
	    return value;
	}
    }

    /* NB: 
       "Note that a drawing order may start in one segment and be completed in an appended segment."
       
       - AFP GOCA Reference.  Note that this is not yet handled.

       Sunday standalone test of GOCA rendering 
    */
    
    parse(graphicsState:GraphicsState):void{
	let constants = GraphicsConstants;
	let commandByte:number = this.data[0];
	switch (commandByte){
	    case constants.COMMAND_BEGIN_PROCEDURE: // 0x30
		{
		    let procedure = new Procedure(this.data,0); 
		    let procedureDataLength = this.getU16(8);
		    let pos = (this.data[1]&0xFF)+2;
		    console.log("JOE pos="+pos);
		    let end = pos+procedureDataLength;
		    while (pos < end){
			let b1:number = this.data[pos]&0xff;
			console.log("proc parse loop 0x"+Utils.hexString(b1)+" at pos="+pos);
			if (b1 == 0){
			    // a no-op
			} else if (b1 === constants.INSTRUCTION_SCD){
			    let dataLength = this.data[pos+1]&0xFF;
			    procedure.instructions.push(new Instruction(b1,2,dataLength,this.data,pos));
			    pos += (2 + dataLength);
			} else {
			    throw "unhandled instruction 0x"+Utils.hexString(b1)+" 2ndByte=0x"+Utils.hexString(this.data[pos+1]);
			}
		    }
		    console.log("procedure parse result");
		    procedure.instructions.forEach(instr => console.log("    "+instr));
		    graphicsState.renderables.push(procedure);
		}
		break;
	    case constants.COMMAND_BEGIN_DATA_UNIT: // 0x40
		{
		}
		break;
	    case constants.COMMAND_BEGIN_SEGMENT: // 0x70
		{
		    let segment = new Segment(this.data,0); 
		    let segmentDataLength = this.getU16(8);
		    let pos = 0xE; // should this be data[1]+2, more accurately
		    let end = pos+segmentDataLength;
		    while (pos < end){
			let b1:number = this.data[pos]&0xff;
			// console.log("seg parse loop 0x"+Utils.hexString(b1)+" at pos="+pos);
			if (b1 === 0){
			    // no op order
			    segment.orders.push(new Order(0,1,0,this.data,pos));
			    pos++;
			} else if ((b1 & 0x88) === 0x08){ // really, it's in the book!
			    // two-byte order
			    segment.orders.push(new Order(b1,1,1,this.data,pos));
			    pos += 2;
			} else if (b1 === 0xFE){
			    let extendedOrder = this.getU16(pos);
			    let dataLength = this.getU16(pos+2);			    
			    segment.orders.push(new Order(extendedOrder,4,dataLength,this.data,pos));
			    pos += (4 + dataLength);
			} else {
			    // it's a long form order
			    let dataLength = this.data[pos+1]&0xFF;
			    segment.orders.push(new Order(b1,2,dataLength,this.data,pos));
			    pos += (2 + dataLength);
			}
		    }
		    console.log("segment parse result");
		    segment.orders.forEach(order => console.log("    "+order));
		    graphicsState.renderables.push(segment);
		}
		break;
	    default:
		throw "unexpected command byte "+Utils.hexString(commandByte);
	}
    }
}

export class GraphicsState {
    outstandingFragmentType:number = GraphicsConstants.OBJECT_NO_TYPE;
    fragments:GraphicsFragment[];
    objects:GraphicsObject[];
    renderables:Renderable[];
    hasError:boolean = false;

    constructor(){
	this.fragments = [];
	this.objects = [];
	this.renderables = [];
    }

    render(ctx:CanvasRenderingContext2D,
	   graphicsWidth:number,
	   graphicsHeight:number,
	   activeWidth:number,
	   activeHeight:number):void{
	ctx.translate(activeWidth/2,activeHeight/2);
	let widthRatio = graphicsWidth/activeWidth;
	let heightRatio = graphicsHeight/activeHeight;
	ctx.scale(1.0 / widthRatio , - (1.0 / heightRatio));
	let env:GOCAEnvironment = new GOCAEnvironment();
	console.log("JOEG: renderables "+this.renderables);
	this.renderables.forEach(function(renderable:Renderable){
	    renderable.render(env,ctx);
	});
	// ctx has save() and restore()
	// segments should always save restore
	// SCD instruction makes permanent changes that don't restore
    }

    ingestFragment(fragFlags:number,
	           objectType:number,
		   source:number[],
		   offset:number, // in source
		   length:number):void {
	if (this.hasError){
	    return;
	}
	let constants = GraphicsConstants;
	let logger = Utils.graphicsLogger;
	let isFirst:boolean = ((fragFlags) & constants.WRAPPER_FLAG_IS_FIRST) != 0;
	let isLast:boolean = ((fragFlags) & constants.WRAPPER_FLAG_IS_LAST) != 0;
	let fragment:GraphicsFragment = new GraphicsFragment(objectType,source,offset,length);

	if (isFirst && isLast){
	    // illegal state if outstanding frag
	    if (this.outstandingFragmentType === constants.OBJECT_NO_TYPE){
		let graphicsObject = new GraphicsObject(fragment.objectType,fragment.data);
		this.objects.push(graphicsObject);
		logger.debug("graphicsObject");
		Utils.hexDumpU8(graphicsObject.data,logger);
		graphicsObject.parse(this);
	    } else {
		logger.warn("unexpected first/last GOCA fragment");
		this.hasError = true;
		return;
	    }
	} else if (isFirst){
	    if (this.outstandingFragmentType === constants.OBJECT_NO_TYPE){
		this.fragments.push(fragment);
		this.outstandingFragmentType === fragment.objectType;
	    } else {
		logger.warn("received first GOCA fragment with non-empty fragment list");
		this.hasError = true;
		return;
	    }
	} else {
	    if (this.outstandingFragmentType !== fragment.objectType){
		logger.warn("subsequence GOCA fragment does not match predecessors");
		this.hasError = true;
		return;
	    } else {
		this.fragments.push(fragment);
	    }
	    if (isLast){
		let graphicsObject = this.combineFragments();
		this.objects.push(graphicsObject);
		this.outstandingFragmentType = constants.OBJECT_NO_TYPE;
		this.fragments = [];
		graphicsObject.parse(this);
	    }
	}
    }

    combineFragments(){
	let totalSize = 0;
	this.fragments.forEach(fragment => totalSize += fragment.data.length);
	let combinedArray = new Uint8Array(totalSize);
	let pos = 0;
	this.fragments.forEach(fragment => { combinedArray.set(fragment.data,pos); pos+= fragment.data.length;});
	return new GraphicsObject(this.outstandingFragmentType,combinedArray);
    }
}
