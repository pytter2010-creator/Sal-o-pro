let usuarios=[{user:'admin',pass:'123',perfil:'admin'}];
let produtos=JSON.parse(localStorage.getItem('produtos'))||[];
let servicos=JSON.parse(localStorage.getItem('servicos'))||[];
let clientes=JSON.parse(localStorage.getItem('clientes'))||[];
let vendas=JSON.parse(localStorage.getItem('vendas'))||[];
let caixa=JSON.parse(localStorage.getItem('caixa'))||[];
let agenda=JSON.parse(localStorage.getItem('agenda'))||[];

function salvar(){
localStorage.setItem('produtos',JSON.stringify(produtos));
localStorage.setItem('servicos',JSON.stringify(servicos));
localStorage.setItem('clientes',JSON.stringify(clientes));
localStorage.setItem('vendas',JSON.stringify(vendas));
localStorage.setItem('caixa',JSON.stringify(caixa));
localStorage.setItem('agenda',JSON.stringify(agenda));
}

function entrar(){
let u=usuarios.find(x=>x.user==usuario.value&&x.pass==senha.value);
if(u){login.style.display='none';app.style.display='block';mostrar('agenda');listar();}
else alert('Login inválido');}

function mostrar(id){document.querySelectorAll('.tela').forEach(t=>t.style.display='none');document.getElementById(id).style.display='block';listar();}

function addProduto(){produtos.push({nome:pNome.value,qtd:+pQtd.value,preco:+pPreco.value});salvar();listar();}
function addServico(){servicos.push({nome:sNome.value,preco:+sPreco.value});salvar();listar();}
function addCliente(){clientes.push({nome:cNome.value});salvar();listar();}

function finalizarVenda(){
let total=0;
if(vProduto.value){let p=produtos[vProduto.value];p.qtd--;total+=p.preco;}
if(vServico.value){total+=servicos[vServico.value].preco;}
vendas.push({data:new Date(),total,pag:vPagamento.value});caixa.push({valor:total});salvar();listar();}

function addAgenda(){agenda.push({data:agData.value,cliente:clientes[agCliente.value].nome,servico:servicos[agServico.value].nome});salvar();listar();}

function listar(){
listaProdutos.innerHTML=produtos.map(p=>`<li>${p.nome} - ${p.qtd}${p.qtd<3?' ⚠️':''}</li>`).join('');
listaServicos.innerHTML=servicos.map(s=>`<li>${s.nome} - R$${s.preco}</li>`).join('');
listaClientes.innerHTML=clientes.map(c=>`<li>${c.nome}</li>`).join('');
listaAgenda.innerHTML=agenda.map(a=>`<li>${a.data} - ${a.cliente} (${a.servico})</li>`).join('');
let saldoAtual=caixa.reduce((s,c)=>s+c.valor,0);saldo.innerText='Saldo: R$ '+saldoAtual;
relDia.innerText='Hoje: R$ '+vendas.filter(v=>new Date(v.data).toDateString()==new Date().toDateString()).reduce((s,v)=>s+v.total,0);
relMes.innerText='Mês: R$ '+vendas.reduce((s,v)=>s+v.total,0);
relPag.innerText='Pix: R$ '+vendas.filter(v=>v.pag=='Pix').reduce((s,v)=>s+v.total,0);

vCliente.innerHTML=clientes.map((c,i)=>`<option value=${i}>${c.nome}</option>`).join('');
vProduto.innerHTML=produtos.map((p,i)=>`<option value=${i}>${p.nome}</option>`).join('');
vServico.innerHTML=servicos.map((s,i)=>`<option value=${i}>${s.nome}</option>`).join('');
agCliente.innerHTML=vCliente.innerHTML;agServico.innerHTML=vServico.innerHTML;
}

function exportar(){let d={produtos,servicos,clientes,vendas,caixa,agenda};let a=document.createElement('a');a.href='data:text/json,'+JSON.stringify(d);a.download='backup.json';a.click();}
function importar(i){let r=new FileReader();r.onload=()=>{let d=JSON.parse(r.result);({produtos,servicos,clientes,vendas,caixa,agenda}=d);salvar();listar();};r.readAsText(i.files[0]);}