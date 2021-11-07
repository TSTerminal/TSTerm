import { Utils } from "./utils.js";

/*
  References

  https://www.afpconsortium.org/uploads/1/1/8/4/118458708/afp-goca-reference-03.pdf

  The data stream for graphics usually called GDDM by mainframe programmers is
  called GOCA (Graphics Object Content Architecture) by device and emulator builders.

  Always Clear and useful:

  http://www.prycroft6.com.au/misc/3270eds.html
  
  Tuesday
    Calin
    Java repos
    Meeting Thursday (or when, look at Mertic Slack)
    Irek/Rob merge
    when resumed, coordinate mapping
    

    Begin Segment, per AFP

    0x70
    <headerLength> 1 byte
    name           4 bytes - often zeros
    flag1          1 ignored
    flag2         80 unchaied (what does chaining mean in this context, anything to do with frag/reassembly??)
    
    ------

    Control example
    30 0a 00 00 00 00 00 00 00 10 00 00 21 06 03 18 
    00 8f 02 ee 21 06 00 30 00 8f 02 05 

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

  Saturday just run the REXX exec with Wireshark on and see what happens.   
    ingestFragment is wired in.
    if it works more colors and shapes



  tsterm qreply fail, packet 247 with stream selected 

  worry about any 255's in query replies.

  Why is "RIGHT-ANGLED-TRIANGLE" mis-rendered?
    Should be on line 2 (0 based), I think.   REXX Program calls ASCPUT in an ASDFLD field at row=3 col1 (1-based)
    
    In TSTERM the create partition and field creation seem to be in sync - ield starts at 264 an goes 80 bytes to 344
    which matches the REX program and the (132x60) logical screen size.

  Worry about similarCharRun.   Does it never find similarity in unminified2.js

  What effect does CREATE_PARTITION have?

  16-bit screen SBA's (256x256) 4 pixels (if monochrome 16 possibilities)  3^3^4->3^12 -> 729 posibilities 
  24-bit color 4 pixels 12 bytes 96 bits of info  2^96 possibilities

  How many symbol sets at once?  


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
    static ORDER_GNOP1 = 0x00;  // No-Operation
    static ORDER_GCOMT = 0x01;  // Comment
    static ORDER_GSGCH = 0x04;  // Segment Characteristics
    static ORDER_GSPS = 0x08;   // Set Pattern Set
    static ORDER_GSCOL = 0x0A;  // Set Color
    static ORDER_GSMX = 0x0C;   // Set Mix
    static ORDER_GSBMX = 0x0D;  // Set Background Mix
    static ORDER_GSFLW = 0x11;  // Set Fractional Line Width
    static ORDER_GSLT = 0x18;   // Set Line Type
    static ORDER_GSLW = 0x19;   // Set Line Width
    static ORDER_GSLE = 0x1A;   // Set Line End
    static ORDER_GSLJ = 0x1B;   // Set Line Join
    static ORDER_GSCLT = 0x20;  // Set Custom Line Type
    static ORDER_GSCP = 0x21;   // Set Current Position
    static ORDER_GSAP = 0x22;   // Set Arc Parameters
    static ORDER_GSECOL = 0x26; // Set Extended Color
    static ORDER_GSPT = 0x28;   // Set Pattern Symbol
    static ORDER_GSMT = 0x29;   // Set Marker Symbol
    static ORDER_GSCC = 0x33;   // Set Character Cell
    static ORDER_GSCA = 0x34;   // Set Character Angle
    static ORDER_GSCH = 0x35;   // Set Character Shear
    static ORDER_GSMC = 0x37;   // Set Marker Cell
    static ORDER_GSCS = 0x38;   // Set Character Set
    static ORDER_GSCR = 0x39;   // Set Character Precision
    static ORDER_GSCD = 0x3A;   // Set Character Direction
    static ORDER_GSMP = 0x3B;   // Set Marker Precision 
    static ORDER_GSMS = 0x3C;   // Set Marker Set
    static ORDER_GEPROL = 0x3E; // End Prolog
    static ORDER_GECP = 0x5E;   // End Custom Pattern
    static ORDER_GEAR = 0x60;   // End Area
    static ORDER_GBAR = 0x68;   // Begin Area
    static ORDER_GCBOX = 0x80;  // Box at Current Position
    static ORDER_GCLINE = 0x81; // Line at Current Position
    static ORDER_GCMRK = 0x82;  // Marker at Current Position
    static ORDER_GCCHST = 0x83; // Character String at Current Position
    static ORDER_GCFLT = 0x85;  // Fillet at Current Position
    static ORDER_GCFARC = 0x87; // Full Arc at Current Position
    static ORDER_GCBIMG = 0x91; // Begin Image at Current Position
    static ORDER_GIMD = 0x92;   // Image Data
    static ORDER_GEIMG = 0x93;  // End Image
    static ORDER_GSPRP = 0xA0;  // Set Pattern Reference Point
    static ORDER_GCRLINE = 0xA1;// Relative Line at Current Position
    static ORDER_GCPARC = 0xA3; // Partial Arc at Current Position
    static ORDER_GCCBEZ = 0xA5; // Cubic Bezier Curve at Current Position
    static ORDER_GSPCOL = 0xB2; // Set Process Color
    static ORDER_GBOX = 0xC0;   // Box at Given Position
    static ORDER_GLINE = 0xC1;  // Line at Given Position
    static ORDER_GMRK = 0xC2;   // Marker at Given Position
    static ORDER_GCHST = 0xC3;  // Character String at Given Position
    static ORDER_GFLT = 0xC5;   // Fillet at Given Position
    static ORDER_GFARC = 0xC7;  // Full Arc at Given Position
    static ORDER_GBIMG = 0xD1;  // Begin Image at Given Position
    static ORDER_GBCP = 0xDE;   // Begin Custom Pattern
    static ORDER_GDPT = 0xDF;   // Delete Pattern
    static ORDER_GRLINE = 0xE1; // Relative Line at Given Position
    static ORDER_GPARC = 0xE3;  // Partial Arc at Given Position
    static ORDER_GCBEZ = 0xE5;  // Cubic Bezier Curve at Given Position
    static ORDER_GLGD = 0xFEDC; // Linear Gradient
    static ORDER_GRGD = 0xFEDD; // Radial Gradient
}

class GraphicsData {
    data:Uint8Array;
    offset:number;

    constructor(data:Uint8Array,
		offset:number){
	this.data = data;
	this.offset = offset;
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

class Order extends GraphicsData {
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

    toString():string{
	let order = this;
	let code = this.orderCode;
	let gc = GraphicsConstants;
	let data = this.data;
	let hLen = this.headerLength;
	let dLen = this.dataLength;
	let len = hLen+dLen;
	let offset = this.offset;
	let d1 = (dLen >= 1 ? data[offset+hLen+0] : 0);
	let d2 = (dLen >= 2 ? data[offset+hLen+1] : 0);
	let getS16 = function(pos:number):number { return order.getS16(offset+pos); };
	let coordinateString = function(pos:number) {
	    let x = getS16(pos);
	    let y = getS16(pos+2);
	    return "("+x+","+y+")";
	}
	switch (code){
	    case gc.ORDER_GNOP1:
		return "<Order: GNOP1>";
	    case gc.ORDER_GCOMT:
		return "<Order: GCOMT: >";
	    case gc.ORDER_GSGCH:  // Segment Characteristics
		return "";
	    case gc.ORDER_GSPS:   // Set Pattern Set
		return "";
	    case gc.ORDER_GSCOL:  // Set Color
		return "";
	    case gc.ORDER_GSMX:   // Set Mix
		return "";
	    case gc.ORDER_GSBMX:  // Set Background Mix
		return "";
	    case gc.ORDER_GSFLW:  // Set Fractional Line Width
		return "";
	    case gc.ORDER_GSLT:   // Set Line Type
		return "";
	    case gc.ORDER_GSLW:   // Set Line Width
		return "";
	    case gc.ORDER_GSLE:   // Set Line End
		return "";
	    case gc.ORDER_GSLJ:   // Set Line Join
		return "";
	    case gc.ORDER_GSCLT:  // Set Custom Line Type
		return "";
	    case gc.ORDER_GSCP:   // Set Current Position
		return "";
	    case gc.ORDER_GSAP:   // Set Arc Parameters
		return "";
	    case gc.ORDER_GSECOL: // Set Extended Color
		return "";
	    case gc.ORDER_GSPT:   // Set Pattern Symbol
		return "";
	    case gc.ORDER_GSMT:   // Set Marker Symbol
		return "";
	    case gc.ORDER_GSCC:   // Set Character Cell
		return "";
	    case gc.ORDER_GSCA:   // Set Character Angle
		return "";
	    case gc.ORDER_GSCH:   // Set Character Shear
		return "";
	    case gc.ORDER_GSMC:   // Set Marker Cell
		return "";
	    case gc.ORDER_GSCS:   // Set Character Set
		return "";
	    case gc.ORDER_GSCR:   // Set Character Precision
		return "";
	    case gc.ORDER_GSCD:   // Set Character Direction
		return "";
	    case gc.ORDER_GSMP:   // Set Marker Precision
		return "";
	    case gc.ORDER_GSMS:   // Set Marker Set
		return "";
	    case gc.ORDER_GEPROL: // End Prolog
		return "";
	    case gc.ORDER_GECP:   // End Custom Pattern
		return "";
	    case gc.ORDER_GEAR:   // End Area
		return "";
	    case gc.ORDER_GBAR:   // Begin Area
		return "<Order GBAR (Begin Area) stroke="+
		    (d1&0x40 ? "F" : "T")+" winding="+
		    (d1&0x20 ? "Alternate" : "NonZero")+
		    ">";
	    case gc.ORDER_GCBOX:  // Box at Current Position
		return "<Order GCBOX>";
	    case gc.ORDER_GCMRK:  // Marker at Current Position
		return "";
	    case gc.ORDER_GCCHST: // Character String at Current Position
		{
		    return "<Order GCCHST (cur) len=0x"+(d1-4)+">";
		}
	    case gc.ORDER_GCFLT:  // Fillet at Current Position
		return "";
	    case gc.ORDER_GCFARC: // Full Arc at Current Position
		return "";
	    case gc.ORDER_GCBIMG: // Begin Image at Current Position
		return "";
	    case gc.ORDER_GIMD:   // Image Data
		return "";
	    case gc.ORDER_GEIMG:  // End Image
		return "";
	    case gc.ORDER_GSPRP:  // Set Pattern Reference Point
		return "";
	    case gc.ORDER_GCRLINE:// Relative Line at Current Position
		return "";
	    case gc.ORDER_GCPARC: // Partial Arc at Current Position
		return "";
	    case gc.ORDER_GCCBEZ: // Cubic Bezier Curve at Current Position
		return "";
	    case gc.ORDER_GSPCOL: // Set Process Color
		return "";
	    case gc.ORDER_GBOX:   // Box at Given Position
		return "";
	    case gc.ORDER_GCLINE: // Line at Current Position
	    case gc.ORDER_GLINE:  // Line at Given Position
		{
		    let text = (code === gc.ORDER_GCLINE ?
			"<Order GCLINE start=(cur) " :
			"<Order GLINE start="+coordinateString(2));
		    let pos = (code === gc.ORDER_GCLINE ? 2 : 6);
		    for (;pos<len; pos+=4){
			text += (" "+coordinateString(pos));
		    }
		    return text+">";
		}
	    case gc.ORDER_GMRK:   // Marker at Given Position
		return "";
	    case gc.ORDER_GCHST:  // Character String at Given Position
		{
		    let x = getS16(2);
		    let y = getS16(4);
		    return "<Order GCHST at ("+x+","+y+") len=0x"+(d1-4)+">";
		}
	    case gc.ORDER_GFLT:   // Fillet at Given Position
		return "";
	    case gc.ORDER_GFARC:  // Full Arc at Given Position
		return "";
	    case gc.ORDER_GBIMG:  // Begin Image at Given Position
		return "";
	    case gc.ORDER_GBCP:   // Begin Custom Pattern
		return "";
	    case gc.ORDER_GDPT:   // Delete Pattern
		return "";
	    case gc.ORDER_GRLINE: // Relative Line at Given Position
		return "";
	    case gc.ORDER_GPARC:  // Partial Arc at Given Position
		return "";
	    case gc.ORDER_GCBEZ:  // Cubic Bezier Curve at Given Position
		return "";
	    case gc.ORDER_GLGD: // Linear Gradient
		return "";
	    case gc.ORDER_GRGD: // Radial Gradient
		return "";
            default:
		return "<Order unknown code "+Utils.hexString(this.orderCode)+">";
	}
    }
}

class Segment extends GraphicsData {
    orders:Order[] = [];

    constructor(data:Uint8Array,
		offset:number){
	super(data,offset);
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

export interface GraphicsRenderable {
    renderMe(ctx:CanvasRenderingContext2D):void;
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
    */
    
    parse():void{
	let constants = GraphicsConstants;
	let commandByte:number = this.data[0];
	switch (commandByte){
	    case constants.COMMAND_BEGIN_PROCEDURE: // 0x30
		break;
	    case constants.COMMAND_BEGIN_DATA_UNIT: // 0x40
		{
		}
		break;
	    case constants.COMMAND_BEGIN_SEGMENT: // 0x70
		{
		    let segment = new Segment(this.data,0); 
		    let segmentDataLength = this.getU16(8);
		    let pos = 0xE;
		    let end = pos+segmentDataLength;
		    while (pos < end){
			let b1:number = this.data[pos]&0xff;
			console.log("seg parse loop 0x"+Utils.hexString(b1)+" at pos="+pos);
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
    renderables:GraphicsRenderable[];
    hasError:boolean = false;

    constructor(){
	this.fragments = [];
	this.objects = [];
	this.renderables = [];
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
	let logger = Utils.protocolLogger;
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
		graphicsObject.parse();
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
		graphicsObject.parse();
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
