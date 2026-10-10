import fs from 'node:fs/promises';
import {Workbook, SpreadsheetFile} from '@oai/artifact-tool';

const out=new URL('./',import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1');
const wb=Workbook.create();
const sheets={}; for(const n of ['Summary','Assumptions','Forecast','Actual inputs','Review']) sheets[n]=wb.worksheets.add(n);
const s=sheets.Summary,a=sheets.Assumptions,f=sheets.Forecast,x=sheets['Actual inputs'],q=sheets.Review;
const ink='#283A32',sage='#E9EEE7',amber='#FFF1CC',num='#,##0;(#,##0);"-"',money='"£"#,##0;("£"#,##0);"-"',pct='0.0%;(0.0%);"-"';
const val=(sh,c,v)=>sh.getRange(c).values=[[v]],form=(sh,c,v)=>{sh.getRange(c).formulas=[[v]];sh.getRange(c).format.font.color=sh===s?'#202820':v.includes('!')?'#008040':'#000000';};
const col=n=>{let z='';for(;n;n=Math.floor((n-1)/26))z=String.fromCharCode(65+(n-1)%26)+z;return z;};
function setup(sh,title,end='L45'){sh.showGridLines=false;sh.getRange(`A1:${end}`).format.font={name:'Arial',size:10,color:'#202820'};sh.getRange(`A1:${end}`).format.rowHeight=21;sh.getRange('A:B').format.columnWidth=2;sh.getRange('C:C').format.columnWidth=46;sh.getRange('D:AA').format.columnWidth=15;val(sh,'C2',title);sh.getRange('C2').format.font={size:16,bold:true};sh.getRange('C3:L3').format.borders={bottom:{style:'thin',color:ink}};}
function header(sh,r,labels){sh.getRange(`C${r}:${col(labels.length+2)}${r}`).values=[labels];sh.getRange(`C${r}:${col(labels.length+2)}${r}`).format={fill:ink,font:{color:'#FFFFFF',bold:true},horizontalAlignment:'center'};}
function input(sh,ref,value,format=num){val(sh,ref,value);sh.getRange(ref).format.fill=amber;sh.getRange(ref).format.font.color='#0000FF';sh.getRange(ref).setNumberFormat(format);}
function total(sh,row,end='AA'){sh.getRange(`C${row}:${end}${row}`).format.fill=sage;sh.getRange(`C${row}:${end}${row}`).format.font.bold=true;}
setup(s,'Mauli | Incremental investment case','L57');setup(a,'Scenario controls | illustrative, not Mauli actuals','M167');setup(f,'24-month forecast | baseline and intervention','AA86');setup(x,'Client actual inputs | blank until validated','H35');setup(q,'Forecast review | reconciliations','G20');
s.tabColor=ink;a.tabColor='#718674';x.tabColor='#D8C9A9';
val(a,'C4','Scenario: 1 Low / 2 Base / 3 High');input(a,'D4',2);a.getRange('D4').dataValidation={rule:{type:'list',values:['1','2','3']}};
val(a,'C5','Benefit multiplier | sensitivity input');input(a,'D5',1,'0.00x');val(a,'C6','Cost multiplier | sensitivity input');input(a,'D6',1,'0.00x');
val(a,'C7','Required baseline input status');val(a,'C8','Data mode: 1 Demo / 2 Client inputs');input(a,'D8',1);a.getRange('D8').dataValidation={rule:{type:'list',values:['1','2']}};
val(a,'C9','Assumed first forecast month');input(a,'D9',new Date('2026-11-01T00:00:00Z'),'mmm-yy');val(a,'C10','Selected case');form(a,'D10','=CHOOSE(D4,"Low","Base","High")');
val(a,'G4','All scenario values are illustrative planning assumptions.');val(a,'G5','Change one selector; forecast and summary update together.');val(a,'G6','Blue = editable. Green = linked. Amber = input.');
const baseline=[
 ['Eligible non-customer sessions / month',10000,num,'Acquisition visits excluding existing customers; deduplicate audience.'],
 ['Monthly session growth',0,pct,'Flat demo; replace with agreed seasonality/growth.'],
 ['New-buyer conversion',0.02,pct,'First buyers / eligible non-customer sessions, not all site sessions.'],
 ['Opening active prior-buyer pool',1000,num,'Unique prior buyers eligible to order, not all historic customers.'],
 ['Monthly repeat orders / active buyer',0.04,pct,'Order frequency; not 90-day repeat probability.'],
 ['Monthly active-pool attrition',0.02,pct,'Simplified active-pool decay; validate with cohorts.'],
 ['D2C basket after discounts, before refunds',80,money,'Ex-VAT merchandise only. Same new and repeat basket assumption.'],
 ['Merchandise refund fraction',0.04,pct,'Applied to merchandise revenue; orders are not deleted.'],
 ['Product cost / gross merchandise',0.30,pct,'COGS on ordered merchandise; conservative no refund stock recovery.'],
 ['Fulfilment / order',5,money,'Packaging + pick/pack + delivery; shipping income excluded.'],
 ['Payment + commission / gross merchandise',0.03,pct,'Fees assumed unrecovered on refunds.'],
 ['Variable service / order',1,money,'Human support etc; excludes optional incremental voice.'],
 ['Baseline monthly acquisition spend',2000,money,'Recognised once below contribution. Includes relevant acquisition costs.'],
 ['Baseline fixed monthly operating costs',6000,money,'Scope estimate, not enterprise audited overhead.'],
 ['Baseline B2B monthly net sales',5000,money,'Sell-in only, ex-VAT after returns/discounts. No retailer sell-through.'],
 ['B2B contribution margin',0.45,pct,'After products, fulfilment, commission and variable service.'],
 ['B2B collection delay, whole months',1,num,'0 to 6 months; opening legacy AR assumed steady-state.'],
 ['Cost funding buffer, months',0.5,'0.0','D2C incremental COGS + all B2B incremental variable costs. Cash reserve proxy, not inventory valuation.'],
 ['Annual discount rate',0.12,pct,'Illustrative hurdle rate; no WACC claim.'],
 ];
header(a,12,['Baseline driver','Active','Demo','']);header(x,6,['Baseline driver','Client value','Source / period / owner']);x.getRange('E:E').format.columnWidth=88;
baseline.forEach(([label,demo,fmt,note],i)=>{const r=13+i;val(a,`C${r}`,label);input(a,`E${r}`,demo,fmt);form(a,`D${r}`,`=IF($D$8=1,IF(ISNUMBER(E${r}),E${r},"Not supplied"),IF(ISNUMBER('Actual inputs'!D${7+i}),'Actual inputs'!D${7+i},"Not supplied"))`);a.getRange(`D${r}`).setNumberFormat(fmt);val(a,`G${r}`,note);val(x,`C${7+i}`,label);input(x,`D${7+i}`,null,fmt);val(x,`E${7+i}`,'Not supplied — client finance / analytics owner to validate');});
form(a,'D7',`=IF(COUNT(D13:D31)=19,"Ready","Incomplete")`);
val(x,'C4','Blank means unknown; observed zero is a valid numeric input.');val(x,'C28','Source context: supplied brief PDF pp. 3–4, 7, 9–10; unaudited classroom synthesis.');val(x,'C29','£87 AOV / 61% D2C are unverified references only; neither drives this model.');val(x,'C30','See docs/metrics/data-request-and-baseline.md and docs/brief/decision-assumption-ledger.md (10 Oct 2026).');
const defs=[
 ['Launch month',[5,3,2],num,'First month in 1–24. Beyond 24 = no launch in horizon.','launch'],
 ['Ramp months to maximum adoption',[6,4,3],num,'At least one month; linear ramp from launch.','ramp'],
 ['Maximum eligible adoption',[0.35,0.6,0.8],pct,'Fraction reached at saturation, not all visitors.','adopt'],
 ['Traffic relative lift at full adoption',[0,0.06,0.12],pct,'Incremental eligible sessions; no causal prediction.','traffic'],
 ['Conversion relative lift at full adoption',[-0.03,0.08,0.15],pct,'A 10% lift on 2% = 2.2%, not 12%.','cvr'],
 ['Repeat frequency increase, percentage points',[0,0.005,0.01],pct,'Additive monthly order frequency increment.','repeat'],
 ['Basket relative lift',[0,0.02,0.04],pct,'No compulsory bundle assumption.','aov'],
 ['Cannibalisation / non-incrementality',[0.35,0.2,0.1],pct,'Reduces all benefit channels including partner sales.','cannib'],
 ['One-off design / research',[2000,1600,1200],money,'Illustrative cash cost; include internal time at opportunity cost.','design'],
 ['One-off Shopify / tracking integration',[3000,2000,1500],money,'Existing store enhancement only. Validate agency quote.','integration'],
 ['One-off educational content',[1600,1200,900],money,'Production, rights and review.','content'],
 ['One-off training / QA',[900,600,400],money,'Accessibility, wellness content review and training.','training'],
 ['Monthly tools / apps',[150,100,80],money,'Starts at launch; no vendor price claim.','tools'],
 ['Monthly support / analyst labour',[500,350,250],money,'Starts at launch; include opportunity cost.','support'],
 ['Monthly ongoing content',[400,300,250],money,'Starts at launch.','ongoing'],
 ['Monthly incremental paid marketing',[800,600,500],money,'Starts at launch; do not also include this in CAC cost.','media'],
 ['Voice enabled: 0 No / 1 Yes',[0,0,0],num,'Optional; no API integration or vendor commitment.','voice'],
 ['Voice sessions / reached visitor',[0.1,0.1,0.1],pct,'Only relevant when enabled.','voiceuse'],
 ['Voice cost / session',[0.6,0.4,0.3],money,'All-in assumed vendor + oversight unit cost.','voicecost'],
 ['Incremental partner accounts at saturation',[0,2,4],num,'Distinct new partner-equivalent accounts; optional.','partners'],
 ['Monthly orders / incremental partner',[1,1,1],num,'Wholesale sell-in only.','partnerorders'],
 ['Net wholesale basket',[250,350,400],money,'After discount/refund, ex-VAT.','partneraov'],
 ];
const rows={};let rr=35;defs.forEach(([label,vals,fmt,note,key])=>{rows[key]=rr;val(a,`C${rr}`,`${label} | Active`);form(a,`D${rr}`,`=IF(CHOOSE($D$4,ISNUMBER(D${rr+1}),ISNUMBER(D${rr+2}),ISNUMBER(D${rr+3})),CHOOSE($D$4,D${rr+1},D${rr+2},D${rr+3}),"Not supplied")`);a.getRange(`D${rr}:D${rr+3}`).setNumberFormat(fmt);total(a,rr,'E');val(a,`G${rr}`,note);['Low','Base','High'].forEach((n,j)=>{val(a,`C${rr+1+j}`,n);input(a,`D${rr+1+j}`,vals[j],fmt)});rr+=5;});
val(a,'C7','Required inputs / bounds status');
const activeRefs=Object.values(rows).map(r=>`D${r}`).join(',');
const bounds=['D13>=0','D14>-1','D15>=0','D15<=1','D16>=0','D17>=0','D18>=0','D18<=1','D19>=0','D20>=0','D20<=1','D21>=0','D21<=1','D22>=0','D23>=0','D23<=1','D24>=0','D25>=0','D26>=0','D27>=0','D28>=0','D28<=1','D29>=0','D29<=6','D29=INT(D29)','D30>=0','D31>-1','D5>=0','D6>=0',`D${rows.launch}>=1`,`D${rows.launch}=INT(D${rows.launch})`,`D${rows.ramp}>=1`,`D${rows.adopt}>=0`,`D${rows.adopt}<=1`,`D${rows.cannib}>=0`,`D${rows.cannib}<=1`,`D${rows.voice}=INT(D${rows.voice})`,`D${rows.voice}>=0`,`D${rows.voice}<=1`,`D${rows.voiceuse}>=0`,`D${rows.voiceuse}<=1`];
for(const k of ['design','integration','content','training','tools','support','ongoing','media','voicecost','partners','partnerorders','partneraov'])bounds.push(`D${rows[k]}>=0`);
form(a,'D7',`=IF(AND(COUNT(D13:D31)=19,COUNT(${activeRefs})=22),IF(AND(${bounds.join(',')}),"Ready","Invalid bounds"),"Incomplete")`);
const A=k=>`'Assumptions'!$D$${rows[k]}`,B=i=>`'Assumptions'!$D$${13+i}`;
for(const sh of [s,f,q,x]){val(sh,'C5','Case selected:');form(sh,'D5',"='Assumptions'!D10");sh.getRange('D5').format.font.color='#008040';}
val(s,'C4','Illustrative demo — replace inputs before client decisions.');form(s,'F5','=IF(\'Assumptions\'!D8=1,"DEMO: fictional inputs","CLIENT INPUT MODE")');
const labels={7:'Forecast month',8:'Period index',10:'WITHOUT recommendations | continuing business',11:'Eligible acquisition sessions',12:'New buyers / first orders',13:'Opening active buyer pool',14:'Repeat orders',15:'Total D2C orders',16:'Closing active buyer pool',17:'Gross D2C merchandise',18:'Refunds',19:'D2C net sales',20:'B2B net sales',21:'Total net sales',22:'Product costs',23:'Fulfilment',24:'Payment / commission',25:'Variable service',26:'B2B variable costs',27:'Contribution before acquisition',28:'Baseline acquisition',29:'Baseline fixed operations',30:'Operating contribution',32:'WITH recommendations | selected case',33:'Adoption fraction',34:'Effective benefit multiplier',35:'Eligible acquisition sessions',36:'New-buyer conversion',37:'New buyers / first orders',38:'Opening active buyer pool',39:'Repeat order frequency',40:'Repeat orders',41:'Total D2C orders',42:'Closing active buyer pool',43:'D2C basket',44:'Gross D2C merchandise',45:'Refunds',46:'D2C net sales',47:'Incremental B2B net sales',48:'Total B2B net sales',49:'Total net sales',50:'Product costs',51:'Fulfilment',52:'Payment / commission',53:'Variable service',54:'B2B variable costs',55:'Contribution before acquisition',56:'Baseline acquisition',57:'Baseline fixed operations',58:'Incremental paid marketing',59:'Tools / content / support',60:'Optional voice service',61:'Operating contribution before setup',63:'INCREMENTAL investment and cash',64:'Incremental net sales',65:'Incremental contribution before fixed pilot spend',66:'Incremental operating contribution',67:'One-off setup cash / expense',68:'Incremental cost funding reserve',69:'Incremental B2B receivables balance',70:'Change in incremental working capital',71:'Incremental operating cash proxy',72:'Cumulative incremental cash',73:'Discounted incremental cash',74:'Cumulative pilot investment',75:'Payback candidate month',76:'No-benefit operating cash downside',77:'Cumulative no-benefit cash',78:'Cumulative baseline operating contribution',79:'Cumulative intervention contribution after setup',80:'First-year / second-year not tax forecasts'};
for(const [r,label] of Object.entries(labels))val(f,`C${r}`,label);
for(const r of [10,32,63]){f.getRange(`C${r}:AA${r}`).format={fill:ink,font:{bold:true,color:'#FFFFFF'}};}
for(const r of [21,27,30,49,55,61,64,66,71,72,74,77])total(f,r);
f.freezePanes.freezeRows(8);f.freezePanes.freezeColumns(3);a.freezePanes.freezeRows(12);
for(let m=1;m<=24;m++){
 const c=col(m+3),p=col(m+2),v=r=>`${c}${r}`,pv=r=>`${p}${r}`,go=(r,expr)=>form(f,v(r),`=IF('Assumptions'!$D$7<>"Ready","Not supplied",${expr})`);
 form(f,v(7),`=EDATE('Assumptions'!$D$9,${m-1})`);val(f,v(8),m);f.getRange(v(7)).setNumberFormat('mmm-yy');
 go(11,`${B(0)}*(1+${B(1)})^(${v(8)}-1)`);go(12,`${v(11)}*${B(2)}`);go(13,m===1?B(3):pv(16));go(14,`${v(13)}*${B(4)}`);go(15,`SUM(${v(12)},${v(14)})`);go(16,`SUM(${v(13)},${v(12)})*(1-${B(5)})`);go(17,`${v(15)}*${B(6)}`);go(18,`${v(17)}*${B(7)}`);go(19,`${v(17)}-${v(18)}`);go(20,B(14));go(21,`SUM(${v(19)}:${v(20)})`);go(22,`${v(17)}*${B(8)}`);go(23,`${v(15)}*${B(9)}`);go(24,`${v(17)}*${B(10)}`);go(25,`${v(15)}*${B(11)}`);go(26,`${v(20)}*(1-${B(15)})`);go(27,`${v(21)}-SUM(${v(22)}:${v(26)})`);go(28,B(12));go(29,B(13));go(30,`${v(27)}-SUM(${v(28)}:${v(29)})`);
 go(33,`IF(${v(8)}<${A('launch')},0,MIN(1,(${v(8)}-${A('launch')}+1)/MAX(1,${A('ramp')}))*${A('adopt')})`);go(34,`${v(33)}*(1-${A('cannib')})*'Assumptions'!$D$5`);go(35,`${v(11)}*MAX(0,1+${A('traffic')}*${v(34)})`);go(36,`MAX(0,MIN(1,${B(2)}*(1+${A('cvr')}*${v(34)})))`);go(37,`${v(35)}*${v(36)}`);go(38,m===1?B(3):pv(42));go(39,`MAX(0,${B(4)}+${A('repeat')}*${v(34)})`);go(40,`${v(38)}*${v(39)}`);go(41,`SUM(${v(37)},${v(40)})`);go(42,`SUM(${v(38)},${v(37)})*(1-${B(5)})`);go(43,`${B(6)}*MAX(0,1+${A('aov')}*${v(34)})`);go(44,`${v(41)}*${v(43)}`);go(45,`${v(44)}*${B(7)}`);go(46,`${v(44)}-${v(45)}`);go(47,`${A('partners')}*${A('partnerorders')}*${A('partneraov')}*${v(34)}`);go(48,`SUM(${v(20)},${v(47)})`);go(49,`SUM(${v(46)},${v(48)})`);go(50,`${v(44)}*${B(8)}`);go(51,`${v(41)}*${B(9)}`);go(52,`${v(44)}*${B(10)}`);go(53,`${v(41)}*${B(11)}`);go(54,`${v(48)}*(1-${B(15)})`);go(55,`${v(49)}-SUM(${v(50)}:${v(54)})`);go(56,v(28));go(57,v(29));go(58,`IF(${v(8)}>=${A('launch')},${A('media')}*'Assumptions'!$D$6,0)`);go(59,`IF(${v(8)}>=${A('launch')},SUM(${A('tools')},${A('support')},${A('ongoing')})*'Assumptions'!$D$6,0)`);go(60,`${A('voice')}*${v(35)}*${v(33)}*${A('voiceuse')}*${A('voicecost')}*'Assumptions'!$D$6`);go(61,`${v(55)}-SUM(${v(56)}:${v(60)})`);
 go(64,`${v(49)}-${v(21)}`);go(65,`${v(55)}-${v(27)}`);go(66,`${v(61)}-${v(30)}`);const setupCost=`SUM(${A('design')},${A('integration')},${A('content')},${A('training')})*'Assumptions'!$D$6`;go(67,`${setupCost}*(IF(${v(8)}=1,0.5,0)+IF(${v(8)}=${A('launch')},0.5,0))`);go(68,`MAX(0,${v(50)}-${v(22)}+(${v(54)}-${v(26)}))*${B(17)}`);go(69,`${B(16)}*0+SUM($D47:${v(47)})-IF(${v(8)}<=${B(16)},0,SUM($D47:INDEX($D47:$AA47,1,${v(8)}-${B(16)})))`);go(70,`SUM(${v(68)}:${v(69)})-${m===1?'0':`SUM(${pv(68)}:${pv(69)})`}`);go(71,`${v(66)}-${v(67)}-${v(70)}`);go(72,`${v(71)}+${m===1?'0':pv(72)}`);go(73,`${v(71)}/(1+${B(18)})^(${v(8)}/12)`);go(74,`SUM(${v(58)}:${v(60)},${v(67)})+${m===1?'0':pv(74)}`);go(75,`IF(AND(${v(72)}>=0,${v(74)}>0),${v(8)},999)`);go(76,`-SUM(${v(58)}:${v(60)},${v(67)})`);go(77,`${v(76)}+${m===1?'0':pv(77)}`);go(78,`${v(30)}+${m===1?'0':pv(78)}`);go(79,`${v(61)}-${v(67)}+${m===1?'0':pv(79)}`);
}
// Downside voice demand follows the baseline audience: lifted traffic is removed with benefits.
for(let m=1;m<=24;m++){const c=col(m+3);form(f,`${c}76`,`=IF('Assumptions'!$D$7<>"Ready","Not supplied",-SUM(${c}58:${c}59,${c}67)-${A('voice')}*${c}11*${c}33*${A('voiceuse')}*${A('voicecost')}*'Assumptions'!$D$6)`);}
f.getRange('D11:AA79').setNumberFormat(num);for(const r of [33,34,36,39]){f.getRange(`D${r}:AA${r}`).setNumberFormat(pct);f.getRange(`C${r}:AA${r}`).format.font.italic=true;}for(const r of [21,30,49,61,64,66,71,72,74,77])f.getRange(`D${r}:AA${r}`).setNumberFormat(money);
header(s,7,['24-month decision view','Without','With','Incremental']);
const summary=[['Net sales',21,49],['Contribution before acquisition',27,55],['Operating contribution before setup',30,61],['One-off setup',null,67],['Operating contribution after setup',30,null]];
summary.forEach(([label,b,w],i)=>{let r=8+i;val(s,`C${r}`,label);form(s,`D${r}`,b?`=IF('Assumptions'!D7="Ready",SUM('Forecast'!D${b}:AA${b}),"Not supplied")`:'=0');form(s,`E${r}`,w?`=IF('Assumptions'!D7="Ready",SUM('Forecast'!D${w}:AA${w}),"Not supplied")`:'=IF(ISNUMBER(E10),E10-E11,"Not supplied")');form(s,`F${r}`,`=IF(ISNUMBER(E${r}),E${r}-D${r},"Not supplied")`)});s.getRange('D8:F12').setNumberFormat(money);total(s,12,'F');
const sums={15:['Incremental operating cash, 24 months',"='Forecast'!AA72"],16:['Peak incremental funding required','=IF(ISNUMBER(\'Forecast\'!AA72),MAX(0,-MIN(\'Forecast\'!D72:AA72)),"Not supplied")'],17:['NPV of incremental cash','=IF(ISNUMBER(\'Forecast\'!AA72),SUM(\'Forecast\'!D73:AA73),"Not supplied")'],18:['First non-negative cumulative month','=IF(ISNUMBER(\'Forecast\'!AA72),IF(MIN(\'Forecast\'!D75:AA75)=999,"Not reached",MIN(\'Forecast\'!D75:AA75)),"Not supplied")'],19:['Pilot investment, excluding working capital',"='Forecast'!AA74"],20:['Cash ROI = net incremental cash / investment','=IF(ISNUMBER(D19),IF(D19=0,"n.a.",D15/D19),"Not supplied")'],21:['No-benefit funding downside','=IF(ISNUMBER(\'Forecast\'!AA77),-MIN(0,\'Forecast\'!D77:AA77),"Not supplied")'],22:['Monthly break-even benefit at month 24','=IF(ISNUMBER(\'Forecast\'!AA61),SUM(\'Forecast\'!AA58:AA60),"Not supplied")'],23:['Month 24 contribution benefit',"='Forecast'!AA65"]};
for(const [r,[l,fo]] of Object.entries(sums)){val(s,`C${r}`,l);form(s,`D${r}`,fo);s.getRange(`D${r}`).setNumberFormat(r==='20'?pct:r==='18'?num:money)}
val(s,'F15','Pre-tax operating cash proxy; no terminal value.');val(s,'F16','Largest cumulative cash deficit, starting at zero.');val(s,'F18','First crossing; later reversals remain visible in cash chart.');val(s,'F20','Not ROAS; denominator includes setup and all pilot running costs.');val(s,'F21','Same spend, all commercial benefits removed.');val(s,'F22','Recurring incremental costs to cover before setup recovery.');
header(s,27,['Month','Baseline net sales','With net sales','Cumulative cash']);for(let m=1;m<=24;m++){const r=27+m,c=col(m+3);form(s,`C${r}`,`=TEXT('Forecast'!${c}7,"mmm-yy")`);form(s,`D${r}`,`='Forecast'!${c}21`);form(s,`E${r}`,`='Forecast'!${c}49`);form(s,`F${r}`,`='Forecast'!${c}72`)}s.getRange('D28:F51').setNumberFormat(money);
const chart=s.charts.add('line',s.getRange('C27:F51'));chart.title='Revenue and cumulative incremental cash (£)';chart.setPosition('H27','P45');chart.hasLegend=true;chart.legend={position:'bottom'};
val(s,'C54','Decision: replace demo assumptions, validate costs and design a controlled pilot before asserting impact.');val(s,'C55','Actual results, client budget and approvals remain unknown. Model does not forecast a causal outcome.');
val(a,'G9','Sensitivity | 24-month incremental cash (£)');val(a,'G10','Benefit across; cost multiplier down');form(a,'G11',"='Summary'!D15");a.getRange('H11:L11').values=[[0,0.5,1,1.5,2]];a.getRange('G12:G16').values=[[0.5],[0.75],[1],[1.25],[1.5]];a.dataTables.add('G11:L16',{rowInput:'D5',columnInput:'D6'});a.getRange('H12:L16').setNumberFormat(money);a.getRange('G11:L11').format.fill=sage;a.getRange('G12:G16').format.fill=sage;val(a,'G18','Inputs are multipliers on selected scenario benefits and pilot costs.');val(a,'G19','0 benefit includes no traffic, conversion, repeat, basket or B2B lift.');val(a,'G20','Excel: Automatic calculation (including Data Tables) to refresh sensitivity.');
// Notes moved below sensitivity to avoid overlap with baseline source notes.
baseline.forEach((b,i)=>{val(a,`G${13+i}`,null);val(a,`G${148+i}`,b[3]);val(a,`C${148+i}`,b[0]);});
// Restore the native-table input axes overwritten by the note cleanup.
a.getRange('G12:G16').values=[[0.5],[0.75],[1],[1.25],[1.5]];val(a,'G18','Benefit multiplier across; cost multiplier down.');val(a,'G19','No benefit (0) eliminates every assumed commercial uplift.');val(a,'G20','Refresh in Excel with Automatic calculation, including Data Tables.');
header(q,7,['Check','Difference','Meaning']);const checks=[['Net-sales bridge',"=SUM('Forecast'!D49:AA49)-SUM('Forecast'!D21:AA21)-SUM('Forecast'!D64:AA64)",'Expected 0'],['Contribution less spending bridge',"=SUM('Forecast'!D65:AA65)-SUM('Forecast'!D58:AA60)-SUM('Forecast'!D66:AA66)",'Expected 0'],['Cash versus profit and funding',"='Summary'!F12-SUM('Forecast'!D70:AA70)-'Summary'!D15",'Expected 0'],['D2C orders = first + repeat',"=SUM('Forecast'!D41:AA41)-SUM('Forecast'!D37:AA37)-SUM('Forecast'!D40:AA40)",'Expected 0'],['End receivables are uncollected B2B',"='Forecast'!AA69",'Balance retained; no terminal release'],['End cost funding reserve',"='Forecast'!AA68",'Balance retained; no terminal release']];checks.forEach(([l,fo,n],i)=>{const r=8+i;val(q,`C${r}`,l);form(q,`D${r}`,`=IF('Assumptions'!D7="Ready",${fo.slice(1)},"Not supplied")`);val(q,`E${r}`,n)});q.getRange('D8:D13').setNumberFormat('0.00;(0.00);0.00');q.getRange('D8:D11').conditionalFormats.add('cellIs',{operator:'notBetween',formula:[-0.01,0.01],format:{fill:'#FCE3DF',font:{bold:true,color:'#A00000'}}});q.getRange('E:E').format.columnWidth=55;
val(q,'C16','Validation remains separate from forecast calculations.');val(q,'C17','Demo and fixture checks: see docs/finance/model-guide.md.');
// Input validation: meaningful domain boundaries, zero is preserved.
for(const i of [2,5,7,8,10,15]){a.getRange(`E${13+i}`).dataValidation={rule:{type:'decimal',operator:'between',formula1:0,formula2:1}};x.getRange(`D${7+i}`).dataValidation={rule:{type:'decimal',operator:'between',formula1:0,formula2:1}};}
for(const key of ['adopt','cannib','voice','voiceuse'])a.getRange(`D${rows[key]+1}:D${rows[key]+3}`).dataValidation={rule:{type:'decimal',operator:'between',formula1:0,formula2:1}};
for(const sh of Object.values(sheets)){sh.getUsedRange().format.verticalAlignment='center';}a.getRange('G:L').format.columnWidth=18;a.getRange('C:C').format.columnWidth=55;f.getRange('C:C').format.columnWidth=49;s.getRange('C:C').format.columnWidth=55;s.getRange('D:F').format.columnWidth=18;a.getRange('G11').setNumberFormat(money);q.getRange('D8:D11').format.font.color='#202820';s.getRange('C20:D20').format.font.italic=true;
// A second, ordinary JavaScript implementation checks numerical results without reading Excel formulas.
function independent(caseId,benefit=1,cost=1,base=baseline.map(b=>b[1])){
 const d=Object.fromEntries(defs.map(v=>[v[4],v[1][caseId-1]]));
 let pool0=base[3],pool1=base[3],wc0=0,cum=0,peak=0,npv=0,investment=0,sales0=0,sales1=0,benefits=0,payback=null;const partner=[];const monthly=[];
 for(let m=1;m<=24;m++){
  const adoption=m<d.launch?0:Math.min(1,(m-d.launch+1)/Math.max(1,d.ramp))*d.adopt;
  const effect=adoption*(1-d.cannib)*benefit,traffic=base[0]*(1+base[1])**(m-1),new0=traffic*base[2];
  const orders0=new0+pool0*base[4],gross0=orders0*base[6],rev0=gross0*(1-base[7])+base[14];
  const contrib0=gross0*(1-base[7]-base[8]-base[10])-orders0*(base[9]+base[11])+base[14]*base[15];
  const visits=traffic*Math.max(0,1+d.traffic*effect),new1=visits*Math.max(0,Math.min(1,base[2]*(1+d.cvr*effect)));
  const orders1=new1+pool1*Math.max(0,base[4]+d.repeat*effect),gross1=orders1*base[6]*Math.max(0,1+d.aov*effect),b2b=d.partners*d.partnerorders*d.partneraov*effect;
  partner.push(b2b);const rev1=gross1*(1-base[7])+base[14]+b2b;
  const contrib1=gross1*(1-base[7]-base[8]-base[10])-orders1*(base[9]+base[11])+(base[14]+b2b)*base[15];
  const recurring=m>=d.launch?(d.media+d.tools+d.support+d.ongoing)*cost:0,voice=d.voice*visits*adoption*d.voiceuse*d.voicecost*cost;
  const setup=(d.design+d.integration+d.content+d.training)*cost*((m===1?.5:0)+(m===d.launch?.5:0));
  const inventory=Math.max(0,(gross1-gross0)*base[8]+b2b*(1-base[15]))*base[17];
  const ar=partner.slice(Math.max(0,m-base[16]),m).reduce((p,v)=>p+v,0),wc=inventory+ar;
  const cf=contrib1-contrib0-recurring-voice-setup-(wc-wc0);cum+=cf;peak=Math.max(peak,-cum);npv+=cf/(1+base[18])**(m/12);investment+=recurring+voice+setup;
  if(payback===null&&cum>=0&&investment>0)payback=m;
  monthly.push({cf,cum,rev0,rev1,orders0,orders1});sales0+=rev0;sales1+=rev1;benefits+=contrib1-contrib0;
  pool0=(pool0+new0)*(1-base[5]);pool1=(pool1+new1)*(1-base[5]);wc0=wc;
 }
 return {cum,peak,npv,investment,sales0,sales1,benefits,payback,monthly};
}
const tests=[];function close(actual,expected,label){if(typeof actual!=='number'||Math.abs(actual-expected)>0.00001)throw new Error(`${label}: ${actual} != ${expected}`);tests.push({label,actual,expected,pass:true});}
for(const caseId of [1,2,3]){val(a,'D4',caseId);wb.recalculate();const expected=independent(caseId);close(s.getRange('D15').values[0][0],expected.cum,`Scenario ${caseId}: cash`);close(s.getRange('D16').values[0][0],expected.peak,`Scenario ${caseId}: funding`);close(s.getRange('D17').values[0][0],expected.npv,`Scenario ${caseId}: NPV`);close(s.getRange('E8').values[0][0],expected.sales1,`Scenario ${caseId}: sales`);}
val(a,'D4',2);val(a,'D5',0);wb.recalculate();close(s.getRange('D15').values[0][0],-independent(2,0).investment,'No benefit: cash equals negative pilot spend');
val(a,'D6',0);wb.recalculate();close(s.getRange('D15').values[0][0],0,'Zero cost and benefit: cash delta zero');
val(a,'D5',1);val(a,'D6',1);
const fixtures=[{name:'Zero sessions and opening buyer pool',cells:[['E13',0],['E16',0]],changes:{0:0,3:0}},{name:'100% refunds',cells:[['E20',1]],changes:{7:1}},{name:'Immediate B2B collections',cells:[['E29',0]],changes:{16:0}},{name:'Six-month B2B collections',cells:[['E29',6]],changes:{16:6}}];
for(const t of fixtures){const bas=baseline.map(b=>b[1]);for(const [i,v] of Object.entries(t.changes))bas[Number(i)]=v;for(const [c,v] of t.cells)val(a,c,v);wb.recalculate();close(s.getRange('D15').values[0][0],independent(2,1,1,bas).cum,t.name);for(const [i] of Object.entries(t.changes))val(a,`E${13+Number(i)}`,baseline[Number(i)][1]);}
val(a,'D8',2);wb.recalculate();if(s.getRange('D15').values[0][0]!=='Not supplied')throw new Error('Missing actual inputs did not propagate');tests.push({label:'Blank client actuals produce Not supplied',pass:true});val(a,'D8',1);wb.recalculate();
const blankCell=`D${rows.traffic+1}`;val(a,blankCell,null);wb.recalculate();close(s.getRange('D15').values[0][0],independent(2).cum,'Blank unselected case does not block selected case');val(a,'D4',1);wb.recalculate();if(s.getRange('D15').values[0][0]!=='Not supplied')throw new Error('Blank selected case not gated');tests.push({label:'Blank selected scenario exposes missing input',pass:true});val(a,blankCell,0);val(a,'D4',2);
val(a,'E20',1.1);wb.recalculate();if(a.getRange('D7').values[0][0]!=='Invalid bounds')throw new Error('Invalid refund bound not blocked');tests.push({label:'Refund above 100% blocked',pass:true});val(a,'E20',baseline[7][1]);wb.recalculate();
for(const [key,value,label] of [['launch',1,'Month-one launch pays full setup once'],['voice',1,'Optional voice enabled']]){const def=defs.find(d=>d[4]===key),old=def[1][1];def[1][1]=value;val(a,`D${rows[key]+2}`,value);wb.recalculate();close(s.getRange('D15').values[0][0],independent(2).cum,label);if(key==='voice'){val(a,'D5',0);wb.recalculate();close(s.getRange('D21').values[0][0],-independent(2,0).cum,'No-benefit voice downside uses baseline demand');val(a,'D5',1);}def[1][1]=old;val(a,`D${rows[key]+2}`,old);}
val(a,'E13',null);wb.recalculate();if(s.getRange('D15').values[0][0]!=='Not supplied')throw new Error('Blank demo baseline not gated');tests.push({label:'Blank demo baseline produces Not supplied',pass:true});val(a,'E13',baseline[0][1]);wb.recalculate();
// Compare native data-table cells to an independently evaluated model at the base and no-lift boundaries.
close(a.getRange('J14').values[0][0],independent(2,1,1).cum,'Native sensitivity base');close(a.getRange('H14').values[0][0],independent(2,0,1).cum,'Native sensitivity no benefit');
await fs.writeFile(`${out}/fixture-validation.json`,JSON.stringify({testedAt:'2026-10-10',engine:'Artifact Tool; independent JavaScript fixture oracle',nativeExcelTested:false,tests,illustrativeCases:[1,2,3].map(i=>({case:['Low','Base','High'][i-1],...independent(i),monthly:undefined}))},null,2));
console.log((await wb.inspect({kind:'region',sheetId:'Summary',range:'C7:F23',maxChars:4000,tableMaxRows:18,tableMaxCols:4})).ndjson);
await fs.writeFile(`${out}/model-metadata.json`,JSON.stringify({baseline,defs,rows},null,2));
await fs.writeFile(`${out}/verification.json`,JSON.stringify({summary:s.getRange('C7:F23').values,checks:q.getRange('C8:E13').values,sensitivity:a.getRange('G11:L16').values},null,2));
console.log((await wb.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!',options:{useRegex:true,maxResults:20},summary:'Formula error scan'})).ndjson);
await (await SpreadsheetFile.exportXlsx(wb)).save(`${out}/mauli-financial-scenarios.xlsx`);
for(const [name,range] of [['Summary','C2:L23'],['Summary','C27:P51'],['Assumptions','C2:L20'],['Assumptions','C85:L110'],['Forecast','C32:I61'],['Actual inputs','C2:F15'],['Review','C2:F17']]){const png=await wb.render({sheetName:name,range,scale:1.3,format:'png'});await fs.writeFile(`${out}/preview-${name.replaceAll(' ','-')}-${range.split(':')[0]}.png`,new Uint8Array(await png.arrayBuffer()));}
