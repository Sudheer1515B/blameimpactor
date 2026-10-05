'use strict';
const demo = window.SIH_DEMO;
const main = document.querySelector('#main');
const paths = {
  grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>',
  users:'<circle cx="9" cy="7" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 5v2"/>',
  layers:'<path d="m12 3 10 5-10 5L2 8zM2 12l10 5 10-5M2 16l10 5 10-5"/>',
  search:'<circle cx="10" cy="10" r="6.5"/><path d="m15 15 6 6"/>',
  expand:'<path d="M8 3H3v5M16 3h5v5M21 16v5h-5M8 21H3v-5"/>',
  code:'<path d="m8 6-6 6 6 6M16 6l6 6-6 6M14 3l-4 18"/>',
  shield:'<path d="m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6z"/><path d="m8 12 3 3 5-6"/>',
  check:'<path d="m5 12 4 4L19 6"/>',
  lock:'<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0v4M12 14v3"/>',
  arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',
  play:'<path d="m8 4 12 8-12 8z"/>',
  server:'<rect x="3" y="3" width="18" height="7" rx="2"/><rect x="3" y="14" width="18" height="7" rx="2"/><path d="M7 6.5h.01M7 17.5h.01M14 6.5h3M14 17.5h3"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/>',
  download:'<path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4"/>',
  upload:'<path d="M12 16V3m-5 5 5-5 5 5M4 17v4h16v-4"/>',
  fingerprint:'<path d="M5 17v-5a7 7 0 0 1 14 0v4M8 19v-7a4 4 0 0 1 8 0v6M11 21v-9a1 1 0 0 1 2 0v9M2 13a10 10 0 0 1 20 0"/>',
  eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'
};
const icon = name => `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.file}</svg>`;
const short = (value, count=10) => value.slice(0,count)+'…'+value.slice(-5);
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const tag = (text, color='') => `<span class="tag ${color}">${text}</span>`;
const detail = (label,value,mono=false) => `<div class="detail-row"><span>${label}</span><strong ${mono?'class="mono"':''}>${value}</strong></div>`;
let currentView='overview', replayToken=0, flowStage=5, recipientIndex=0, verificationToken=0;
let toastTimer, returnFocus;
document.querySelectorAll('[data-icon]').forEach(node => node.innerHTML=icon(node.dataset.icon));

function heading(title, description, action='') {
  return `<div class="page-heading"><div><div class="eyebrow">SECURE DOCUMENT WORKSPACE</div><h1>${title}</h1><p>${description}</p></div>${action || `<span class="date-pill">${icon('calendar')}05 Oct 2026 · Recorded run</span>`}</div>`;
}
function metrics() {
  const items=[['lock','Content ciphertext','1','Encrypted once'],['file','Recipient copies','2','Distinct session marks'],['server','Validator approvals','4 / 4','Durable evidence'],['fingerprint','Authenticated copies','2 / 2','Recorded verification']];
  return `<section class="metrics" aria-label="Recorded run summary">${items.map(([i,label,value,note])=>`<div class="metric"><span class="metric-icon">${icon(i)}</span><div><div class="metric-label">${label}</div><div class="metric-value">${value}</div><small ${i==='fingerprint'?'class="tiny-green"':''}>${note}</small></div></div>`).join('')}</section>`;
}
function nodes() {
  return `<div class="node-grid">${[1,2,3,4].map(i=>`<div class="node"><span>${icon('server')}</span><div><h3>Validator 0${i}</h3><small>Durable ACK recorded</small></div><i class="status-dot"></i></div>`).join('')}</div><div class="quorum">${icon('shield')}<strong>4 of 4 approved</strong> · Independent key per process</div>`;
}
function flow() {
  const steps=[['lock','Encrypt once','Single ciphertext'],['users','Request access','Recipient signature'],['fingerprint','Prepare copy','Unique session mark'],['layers','Certify evidence','4 validator ACKs'],['download','Release copy','Consume, then stream']];
  return `<section class="card"><div class="card-heading"><div><h2>From document to delivered copy</h2><p>A complete recorded workflow, step by step</p></div><button class="text-link" data-action="replay" id="replay-button">${icon('play')}Replay walkthrough</button></div><div class="flow">${steps.map(([i,title,note],index)=>`<div class="flow-step ${index<flowStage?'done':''} ${index===flowStage?'current':''}" data-step="${index}"><div class="flow-icon">${icon(i)}</div><h3>${title}</h3><p>${note}</p></div>`).join('')}</div><div class="flow-caption"><span id="flow-message" aria-live="polite">${icon('check')} Both recipients completed the recorded workflow.</span><span>SIH26237 · Test-only demonstration</span></div></section>`;
}
function overview() {
  return heading('Workspace overview','One encrypted document. Every issued copy has a verifiable history.')+
  `<section class="hero"><div class="hero-copy"><div class="eyebrow">OFFLINE DOCUMENT PROVENANCE</div><h2>Secure delivery.<br><span>Traceable copies.</span></h2><p>Distribute one encrypted package. Bind each marked copy to a recipient-approved session and certified evidence.</p><div class="hero-actions"><button class="button lime" data-action="replay">${icon('play')}Show the workflow</button><button class="text-link" data-view="investigate">Investigate a copy ${icon('arrow')}</button></div></div><div class="hero-graphic" aria-hidden="true"><div class="illustration"><div class="paper-doc"><span class="pdf-label">ENCRYPTED PACKAGE</span><h4>Training<br>briefing.pdf</h4>${Array.from({length:7},()=>'<div class="paper-line"></div>').join('')}<div class="doc-foot">ONE SOURCE · TWO RECIPIENTS</div><div class="doc-seal">${icon('lock')}</div></div><div class="branch"></div><div class="recipient-stack"><div class="mini-recipient"><span>${icon('users')}</span><span>Recipient 07<small>Distinct approved copy</small></span><span class="check">✓</span></div><div class="mini-recipient"><span>${icon('users')}</span><span>Recipient 08<small>Distinct approved copy</small></span><span class="check">✓</span></div></div></div></div></section>`+
  metrics()+flow()+`<div class="bottom-grid"><section class="card"><div class="card-heading"><div><h2>Issued recipient copies</h2><p>Two sessions. The same encrypted package.</p></div><button class="text-link" data-view="recipient">View all ${icon('arrow')}</button></div><table><thead><tr><th>Recipient</th><th>Session</th><th>Status</th><th>Copy</th></tr></thead><tbody>${demo.sessions.map((session,i)=>`<tr><td><div class="recipient-cell"><span class="avatar">0${i+7}</span><span>Recipient 0${i+7}<small>Approved exact output</small></span></div></td><td class="mono">${short(session.session_id,8)}</td><td>${tag('Certified')}</td><td><a class="text-link" href="sample-data/recipient-${i+7}.pdf" target="_blank" rel="noopener">${icon('eye')}Open</a></td></tr>`).join('')}</tbody></table></section><section class="card"><div class="card-heading"><div><h2>Evidence network</h2><p>Four validators · actual recorded consensus</p></div>${tag('Certified')}</div>${nodes()}</section></div>`;
}
function documents() {
  return heading('Document vault','Package once, authorize recipients, preserve the evidence.',`<button class="button" data-action="package">${icon('file')}New package demo</button>`)+
  `<div class="intro-banner">${icon('shield')}<span><strong>One content ciphertext.</strong> Separate ML-KEM envelopes authorize both recipients without encrypting the source again.</span></div><div class="document-card"><span class="big-file">${icon('file')}</span><div><div class="eyebrow">SYNTHETIC TRAINING DOCUMENT</div><h2>Training briefing.pdf</h2><p>1 page · Sender 05 · 2 authorized recipients</p>${tag('Package certified')} ${tag('Offline','neutral')}</div><button class="text-link" style="margin-left:auto" data-action="package">Details ${icon('arrow')}</button></div><div class="two-col section-gap"><section class="card"><div class="card-heading"><div><h2>Package identity</h2><p>Public bindings from the executed backend run</p></div>${icon('lock')}</div><div class="card-body"><div class="detail-list">${detail('Document ID',short(demo.document_id,15),true)}${detail('Package ID',short(demo.package_id,15),true)}${detail('Content ciphertexts','1')}${detail('Recipient envelopes','2')}${detail('Recipients','Recipient 07, Recipient 08')}${detail('Key establishment','ML-KEM-768')}${detail('Content protection','AES-256-GCM')}</div><p class="hint">The public manifest carries a keyed source commitment. A plaintext-source fingerprint is not published.</p></div></section><section class="card"><div class="card-heading"><div><h2>Recipient-specific delivery</h2><p>Bound to the approved bytes of each copy</p></div></div><div class="card-body"><div class="detail-list">${demo.sessions.map((s,i)=>detail(`Recipient 0${i+7}`,`${tag('Approved')} <span class="mono">${short(s.output_sha384,8)}</span>`)).join('')}</div><div class="copy-actions"><button class="button teal" data-view="recipient">Open recipient desk ${icon('arrow')}</button></div><p class="hint">Each copy is marked inside the appliance, approved by the recipient signer, certified and consumed before streaming.</p></div></section></div><div class="disclaimer"><strong>Presentation fixture.</strong> “Training briefing.pdf” is the friendly display name for the existing synthetic one-page document. This interface replays a recorded run; creating new packages uses the working Python/Go prototype.</div>`;
}
function recipient() {
  return heading('Recipient desk','Review the exact copy, approve its binding, and follow its evidence.')+
  `<div class="copy-cards">${demo.sessions.map((s,i)=>`<section class="card copy-card"><div class="copy-card-top"><span class="avatar">0${i+7}</span>${tag('Approved in recorded run')}</div><div class="eyebrow">RECIPIENT 0${i+7}</div><h2>Your training briefing</h2><p>An individually marked copy approved through the restricted signer.</p><div class="detail-list">${detail('Session',short(s.session_id,13),true)}${detail('Output size',`${(s.output_bytes/1024).toFixed(1)} KB`)}${detail('Output hash',short(s.output_sha384,14),true)}${detail('Session / claim heights',`${s.session_height} / ${s.claim_height}`)}${detail('Validator acknowledgements','4 of 4')}${detail('One-use release',tag('Consumed'))}</div><div class="copy-actions"><button class="button" data-action="consent" data-index="${i}">${icon('shield')}Replay approval</button><a class="button light" href="sample-data/recipient-${i+7}.pdf" download>${icon('download')}Download copy</a></div></section>`).join('')}</div><div class="two-col section-gap"><section class="card"><div class="card-heading"><div><h2>What your signature binds</h2><p>Approval is for this session and these exact bytes.</p></div>${icon('fingerprint')}</div><div class="card-body"><div class="detail-list">${detail('Recipient identity','Registered signing key')}${detail('Session identity','Fresh independent session ID')}${detail('Prepared output','Exact SHA-384 and output length')}${detail('Appliance','Authorized issuer and KEM custodian')}</div></div></section><div class="terminal"><div class="terminal-label"><i></i><i></i><i></i><span>RECORDED RELEASE CHECKS</span></div><span class="green">✓</span> restricted signer approves exact output<br><span class="green">✓</span> session and live claim certified<br><span class="green">✓</span> native TLS exporter matches claim<br><span class="green">✓</span> SQLite consumes before first write<br><span class="green">✓</span> exact received length / hash match<br><span class="green">✓</span> duplicate transfer refused before payload</div></div><div class="disclaimer"><strong>Demo consent.</strong> The replay buttons demonstrate the intended approval flow. They do not produce a new signature. Trusted human consent UI and independently installed signer identities remain development work.</div>`;
}
function ledger() {
  const blocks=demo.sessions.flatMap((session,index)=>[{kind:'Session commit',height:session.session_height,index,file:`session-${index+7}-proof.json`},{kind:'Release claim',height:session.claim_height,index,file:`claim-${index+7}-proof.json`}]);
  return heading('Evidence ledger','Ordered records, actual consensus certificates, durable acknowledgements.',`<a class="button light" href="sample-data/public-evidence.zip" download>${icon('download')}Export evidence</a>`)+
  `<div class="intro-banner">${icon('layers')}<span><strong>4 certified transactions.</strong> Each record was independently checked by the original Go proof verifier after all four validators acknowledged it.</span></div><div class="ledger-blocks">${blocks.map(block=>`<section class="ledger-block"><div class="block-number">BLOCK HEIGHT / 0${block.height}</div><h3>${block.kind}</h3><p>Recipient 0${block.index+7}</p>${tag('4 durable ACKs')}<span class="mono">${short(demo.sessions[block.index].session_id,9)}</span><button class="text-link" data-action="proof" data-index="${block.index}" data-kind="${block.kind==='Session commit'?'session':'claim'}">Inspect evidence ${icon('arrow')}</button></section>`).join('')}</div><div class="two-col section-gap"><section class="card"><div class="card-heading"><div><h2>Validator network</h2><p>Four separate Go processes and signing keys</p></div></div>${nodes()}<div class="card-body"><p class="hint">Recorded on one development host using real native PQ TCP, separate SQLite stores, engine WALs and fences. Independent Linux custodians are a deployment milestone.</p></div></section><div class="terminal"><div class="terminal-label"><i></i><i></i><i></i><span>NATIVE VERIFICATION / RECORDED</span></div><span class="dim">chain</span> ${short(demo.chain_id,18)}<br><span class="green">✓</span> ML-DSA-65 signatures verified<br><span class="green">✓</span> proposal and transaction hashes bound<br><span class="green">✓</span> ACK validators [1, 2, 3, 4]<br><span class="green">✓</span> complete certified pre-claim prefix<br><span class="green">✓</span> consumed transfers = 2<br><span class="green">✓</span> replay payload bytes = 0</div></div><div class="disclaimer"><strong>What a claim proves.</strong> Ordered authorization for a prepared copy and its original live connection. A persisted claim cannot recreate a grant after restart or reconnection.</div>`;
}
function investigate() {
  return heading('Copy investigation','Associate a recovered copy with its approved recipient session.')+
  `<div class="two-col"><section class="card"><div class="card-heading"><div><h2>Start with a recovered document</h2><p>Use a recorded sample or compare a local file.</p></div>${icon('search')}</div><div class="card-body"><label class="upload-zone" id="drop-zone"><span>${icon('upload')}</span><h3>Drop a copy here</h3><p>or click to select a file · up to 1 MiB</p><input type="file" id="leak-input" accept="application/pdf,.pdf" aria-label="Select recovered copy"></label><div class="sample-buttons"><button class="button light" data-action="sample" data-index="0">Recipient 07 sample</button><button class="button light" data-action="sample" data-index="1">Recipient 08 sample</button></div><div class="detail-list">${detail('Check location','Your browser · file stays local')}${detail('Sample evidence','Actual native backend results')}${detail('Local file check','Exact SHA-384 comparison only')}</div><p class="hint">This browser compares exact bytes. Signature/certificate verification and transformed-copy detection belong to the native forensic backend; the results below are from its recorded execution.</p></div></section><section class="card"><div class="card-heading"><div><h2>Association result</h2><p>Evidence identifies an issued session, not a human leaker.</p></div>${tag('Recorded evidence','neutral')}</div><div class="card-body"><div id="verification-result" class="verdict pending" aria-live="polite"><div class="verdict-icon">${icon('search')}</div><h3>Ready to examine a copy</h3><p>Choose a sample to explore its recorded forensic result, or select a local file for an exact-byte comparison.</p></div><div class="sample-buttons"><button class="text-link" data-action="rewrite">View metadata-rewrite test ${icon('arrow')}</button><button class="text-link" data-action="mismatch">View mismatched-evidence test ${icon('arrow')}</button></div></div></section></div><div class="disclaimer"><strong>Known carrier limit.</strong> The experimental contour mark survives the recorded metadata rewrite but can be removed by readable reconstruction. Production carrier acceptance and human invisibility testing remain open. “Associated recipient session” does not establish who physically leaked a copy.</div>`;
}
const renderers={overview,documents,recipient,ledger,investigate};
const labels={overview:'Overview',documents:'Document vault',recipient:'Recipient desk',ledger:'Evidence ledger',investigate:'Investigation'};
function render(view) {
  if (!renderers[view]) view='overview';
  currentView=view;
  document.querySelector('#breadcrumb').textContent=labels[view];
  document.querySelectorAll('nav [data-view]').forEach(button=>{button.classList.toggle('active',button.dataset.view===view);button.setAttribute('aria-current',button.dataset.view===view?'page':'false');});
  main.innerHTML=renderers[view]();
  document.title=`${labels[view]} · Blame Impactor`;
  if(view==='investigate') setupUpload();
}
function navigate(view) {replayToken++;verificationToken++;flowStage=5;history.replaceState(null,'',`#${view}`);render(view);window.scrollTo({top:0});}
function toast(message) {const node=document.querySelector('#toast');node.textContent=message;node.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>node.classList.remove('show'),3500);}
function openModal(content) {returnFocus=document.activeElement;document.querySelector('#modal-content').innerHTML=content;const title=document.querySelector('#modal-content h2');if(title)title.id='modal-title';document.querySelector('#modal').hidden=false;document.querySelector('#modal-close').focus();}
function closeModal() {document.querySelector('#modal').hidden=true;returnFocus?.focus();}
function consent(index) {
  recipientIndex=index;const s=demo.sessions[index];
  openModal(`<div class="eyebrow">RESTRICTED SIGNER · VISUAL REPLAY</div><h2>Approve your prepared copy</h2><div class="intro-banner">${icon('shield')}<span>The approval binds this exact output to Recipient 0${index+7}.</span></div><div class="detail-list">${detail('Document','Training briefing.pdf')}${detail('Recipient',`Recipient 0${index+7}`)}${detail('Session ID',s.session_id,true)}${detail('Prepared output SHA-384',s.output_sha384,true)}${detail('Output bytes',s.output_bytes.toLocaleString())}${detail('Coverage','1 page · complete')}</div><p class="hint">This dialog replays consent for the recorded run. It does not invoke the signer or produce a new cryptographic signature.</p><div class="modal-footer"><button class="button light" data-action="deny">Decline demo</button><button class="button teal" data-action="approve">${icon('check')}Approve demo</button></div>`);
}
function proof(index,kind) {
  const s=demo.sessions[index], isSession=kind==='session';
  openModal(`<div class="eyebrow">NATIVE BACKEND · RECORDED PROOF</div><h2>${isSession?'Session commit':'Release claim'} evidence</h2><div class="detail-list">${detail('Recipient',`Recipient 0${index+7}`)}${detail('Certified height',isSession?s.session_height:s.claim_height)}${detail('Session ID',s.session_id,true)}${detail('Output SHA-384',s.output_sha384,true)}${detail('Durable ACK validators','1, 2, 3, 4')}${detail('Proof verification','Original Go certificate / ACK verifier')}${detail('Duplicate transfer','Refused by SQLite before payload')}${detail('Historical checkpoint','Recorded execution · not a live tip')}</div><div class="modal-footer"><a class="button" href="sample-data/${kind}-${index+7}-proof.json" download>${icon('download')}Download actual proof</a></div>`);
}
function packageModal() {openModal(`<div class="eyebrow">SENDER WORKFLOW · PRESENTATION FIXTURE</div><h2>Encrypt once. Authorize two recipients.</h2><div class="document-card"><span class="big-file">${icon('file')}</span><div><h3>Training briefing.pdf</h3><p>Trusted synthetic source · 1 page</p></div></div><div class="detail-list section-gap">${detail('Sender','Registered Sender 05')}${detail('Recipient 07',tag('Authorized'))}${detail('Recipient 08',tag('Authorized'))}${detail('Content encryption','One AES-256-GCM ciphertext')}${detail('Recipient envelopes','Two ML-KEM-768 wraps')}${detail('Plaintext source hash','Not published')}</div><p class="hint">The existing backend created this package and delivered both copies. This screen previews the sender experience using that completed run.</p><div class="modal-footer"><button class="button teal" data-action="package-flow">${icon('play')}Replay package delivery</button></div>`);}
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function replay() {
  navigate('overview');const token=++replayToken;flowStage=-1;
  const messages=['Sender created one ciphertext and two recipient envelopes.','Restricted recipient signers approved fresh access requests.','Appliance marked, self-checked and obtained exact-copy approvals.','Four native-TLS validators certified both sessions and live claims.','Go consumed each grant before native TLS delivered the approved bytes.'];
  document.querySelectorAll('[data-action="replay"]').forEach(b=>b.disabled=true);
  for(let i=0;i<5;i++) {
    if(token!==replayToken)return;
    flowStage=i;
    document.querySelectorAll('[data-step]').forEach(node=>{node.classList.toggle('done',+node.dataset.step<i);node.classList.toggle('current',+node.dataset.step===i);});
    document.querySelector('#flow-message').textContent=messages[i];
    await wait(1050);
  }
  if(token!==replayToken)return;
  flowStage=5;render('overview');toast('Recorded workflow complete · two copies, four ACKs, zero replay bytes');
}
function sample(index) {
  const s=demo.sessions[index];
  document.querySelector('#verification-result').className='verdict';
  document.querySelector('#verification-result').innerHTML=`<div class="verdict-icon">${icon('check')}</div><div class="eyebrow">RECORDED NATIVE VERDICT</div><h3>Authenticated copy associated</h3><p>The native verifier authenticated this exact saved output against the signed session and actual ledger proof.</p><div class="detail-list">${detail('Associated recipient',`Recipient 0${index+7}`)}${detail('Session',short(s.session_id,13),true)}${detail('Output hash',short(s.output_sha384,15),true)}${detail('Evidence status',tag('Exact authenticated copy'))}${detail('Human leaker','Not established')}${detail('Delivery proof','Not established')}</div><div class="copy-actions"><button class="button small light" data-action="proof" data-index="${index}" data-kind="session">Inspect evidence</button><a class="button small light" href="sample-data/recipient-${index+7}.pdf" target="_blank" rel="noopener">Open sample PDF</a></div>`;
}
function rewrite() {const s=demo.sessions[0];document.querySelector('#verification-result').className='verdict';document.querySelector('#verification-result').innerHTML=`<div class="verdict-icon">${icon('fingerprint')}</div><div class="eyebrow">RECORDED TRANSFORMATION TEST</div><h3>Session recovered after rewrite</h3><p>The actual backend rewrote PDF metadata and resource names. It recovered the session blindly, verified the native evidence, and confirmed full-page render equality.</p><div class="detail-list">${detail('Recovered recipient','Recipient 07')}${detail('Recovered session',short(s.session_id,13),true)}${detail('Byte equality','Changed')}${detail('Rendered page equality','Exact under pinned renderer')}${detail('Verdict','Render-equivalent authenticated copy')}${detail('Human leaker','Not established')}</div>`;}
function mismatch() {document.querySelector('#verification-result').className='verdict pending';document.querySelector('#verification-result').innerHTML=`<div class="verdict-icon">${icon('shield')}</div><div class="eyebrow">RECORDED NEGATIVE TEST</div><h3>Inconclusive · evidence does not match</h3><p>The backend was given Recipient 07’s exact copy with Recipient 08’s session evidence. It refused to authenticate the association.</p><div class="detail-list">${detail('Associated recipient','None')}${detail('Associated session','None')}${detail('Verdict',tag('Inconclusive','amber'))}${detail('Human leaker','Not established')}</div>`;}
function setupUpload() {
  const input=document.querySelector('#leak-input'),zone=document.querySelector('#drop-zone');
  input.addEventListener('change',()=>{if(input.files[0])compareFile(input.files[0]);});
  zone.addEventListener('dragover',e=>{e.preventDefault();zone.classList.add('dragging');});
  zone.addEventListener('dragleave',()=>zone.classList.remove('dragging'));
  zone.addEventListener('drop',e=>{e.preventDefault();zone.classList.remove('dragging');if(e.dataTransfer.files[0])compareFile(e.dataTransfer.files[0]);});
}
async function compareFile(file) {
  const token=++verificationToken;
  if(!file.size || file.size>1048576) {toast('Choose a non-empty file no larger than 1 MiB.');return;}
  if(!window.crypto?.subtle) {toast('Local hashing needs a modern browser or a localhost preview.');return;}
  const node=document.querySelector('#verification-result');node.className='verdict pending';node.innerHTML=`<div class="verdict-icon">${icon('clock')}</div><h3>Comparing exact bytes…</h3><p>The file stays in your browser.</p>`;
  try {
    const bytes=await file.arrayBuffer();const digest=await crypto.subtle.digest('SHA-384',bytes);const hash=Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');
    if(token!==verificationToken || currentView!=='investigate')return;
    const index=demo.sessions.findIndex(s=>s.output_sha384===hash);
    if(index>=0) {sample(index);document.querySelector('#verification-result').insertAdjacentHTML('afterbegin',`<p class="screen-label">LOCAL BYTE MATCH / ${escape(file.name)}</p>`);toast('Exact bytes match a recorded, backend-authenticated sample.');}
    else {node.className='verdict pending';node.innerHTML=`<div class="verdict-icon">${icon('search')}</div><div class="eyebrow">LOCAL EXACT-BYTE COMPARISON</div><h3>No exact sample match</h3><p>${escape(file.name)} differs from both recorded copies. A transformed copy needs the native forensic backend; this browser cannot determine its session.</p><div class="detail-list">${detail('SHA-384',short(hash,17),true)}${detail('Associated session','Not determined')}${detail('Cryptographic verification','Not performed in browser')}</div>`;}
  } catch {if(token===verificationToken && currentView==='investigate'){node.innerHTML='<h3>File comparison failed</h3><p>Please select the file again.</p>';}}
}
document.addEventListener('click',e=>{
  const button=e.target.closest('[data-view], [data-action]');if(!button)return;
  if(button.dataset.view){navigate(button.dataset.view);return;}
  const index=Number(button.dataset.index||0);if(![0,1].includes(index))return;
  const action=button.dataset.action;
  if(action==='replay')replay();
  else if(action==='package')packageModal();
  else if(action==='package-flow'){closeModal();replay();}
  else if(action==='consent')consent(index);
  else if(action==='proof')proof(index,button.dataset.kind==='claim'?'claim':'session');
  else if(action==='approve'){closeModal();toast(`Recipient 0${recipientIndex+7}: demo approval acknowledged. No new signature created.`);}
  else if(action==='deny'){closeModal();toast('Demo request declined. No signing operation performed.');}
  else if(action==='sample'){verificationToken++;sample(index);}
  else if(action==='rewrite'){verificationToken++;rewrite();}
  else if(action==='mismatch'){verificationToken++;mismatch();}
});
document.querySelector('#modal-close').addEventListener('click',closeModal);
document.querySelector('#modal').addEventListener('click',e=>{if(e.target.id==='modal')closeModal();});
document.addEventListener('keydown',e=>{
  const modal=document.querySelector('#modal');
  if(e.key==='Escape')closeModal();
  if(e.key==='Tab'&&!modal.hidden){const focusable=[...modal.querySelectorAll('button,a[href],input,select')];const first=focusable[0],last=focusable.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}
});
document.querySelector('#presentation').addEventListener('click',()=>{const enabled=document.body.classList.toggle('presentation');document.querySelector('#presentation span:last-child').textContent=enabled?'Exit presentation':'Present';});
window.addEventListener('hashchange',()=>navigate(location.hash.slice(1)));
render(location.hash.slice(1)||'overview');
