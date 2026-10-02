const express=require('express');
const app=express(); app.use(express.json());
const PORT=process.env.PORT||8787;
const cache=new Map();
function dayBounds(){const d=new Date();const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),da=String(d.getDate()).padStart(2,'0');const n=new Date(d);n.setDate(d.getDate()+2);return [`${y}-${m}-${da}`,`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,'0')}-${String(n.getDate()).padStart(2,'0')}`]}
async function fetchPrices(area){const key=area;const c=cache.get(key);if(c&&Date.now()-c.at<10*60e3)return c.data;const [start,end]=dayBounds();const filter=encodeURIComponent(JSON.stringify({PriceArea:[area]}));const urls=[`https://api.energidataservice.dk/dataset/DayAheadPrices?start=${start}&end=${end}&filter=${filter}&sort=TimeDK`, `https://api.energidataservice.dk/dataset/DayAheadPrices15Min?start=${start}&end=${end}&filter=${filter}`];let records=[];for(const url of urls){try{const r=await fetch(url);if(!r.ok)continue;const j=await r.json();records=j.records||j.Records||[];if(records.length)break;}catch{}}
if(!records.length)throw new Error('Day-ahead data unavailable');const slots=records.map(x=>{const start=x.TimeDK||x.Minutes15DK||x.HourDK||x.TimeUTC||x.Minutes15UTC||x.HourUTC;const dkkMwh=Number(x.DayAheadPriceDKK??x.SpotPriceDKK??x.PriceDKK??0);return {start,total:dkkMwh/1000,spot:dkkMwh/1000,source:'Energinet'};}).filter(x=>x.start&&Number.isFinite(x.total)).sort((a,b)=>new Date(a.start)-new Date(b.start));cache.set(key,{at:Date.now(),data:slots});return slots;}
app.get('/api/plan',async(req,res)=>{try{const area=req.query.area==='DK1'?'DK1':'DK2';const slots=await fetchPrices(area);res.json({area,slots,priceMode:'spot-only',note:'Spotpris fra Energinet. Samlet pris kræver net-/leverandørprofil.',source:'Energinet / Energi Data Service'});}catch(e){res.status(503).json({error:e.message});}});
app.get('/health',(req,res)=>res.json({ok:true}));
app.listen(PORT,()=>console.log(`StrømPlan API ${PORT}`));
