/**
 * [MODEL]
 * @type {Array}
 */
let data = [
	{
		descricao: "Campos Confecções",
		cod: "1ae",
		obs: "observação",
		nodes: [
			{
				descricao: "Bermudas",
				cod: "asw2",
				obs: "observação"
			},
			{
				descricao: "Calças",
				cod: "fgty",
				obs: "observação",
				nodes: [
					{
						descricao: "Sarja (m)",
						cod: "ghjki",
						obs: "observação"
					},
					{
						descricao: "Social",
						cod: "dcft",
						obs: "observação"
					}
				]
			},
			{
				descricao: "Camisas",
				cod: "adre",
				obs: "observação",
				nodes: [
					{
						descricao: "Esporte",
						cod: "cvghj",
						obs: "observação"
					},
					{
						descricao: "Gola Polo",
						cod: "klou",
						obs: "observação"
					},
					{
						descricao: "Grife",
						cod: "nmkl",
						obs: "observação"
					},
					{
						descricao: "Social",
						cod: "1235g",
						obs: "observação"
					}
				]
			},
			{
				descricao: "Terno",
				cod: "65fg",
				obs: "observação"
			}
		]
	}
];

const wrapper = document.querySelector("#treeview");
const searchInput = document.querySelector("#search");
const collapseButton = document.querySelector('#expandir');
const modalNode = document.querySelector('.modal-node');
const closeModalNode = document.querySelector('.close-modal');
const formModalNode = document.querySelector('.modal-node form');

let tooltipTemplate = document.querySelector('.tooltip');
let modalData = {};
let template;
let searchResult;
let search = "";
let newNode = {};
let newData;
let searchInputValue;


/**
 * [Search input]
 */
searchInput.addEventListener('input', e => {
	searchInputValue = e.target.value;
	doSearch(searchInputValue);
})

/**
 * [VIEW template]
 * @param  {[Array]} nodeItem [data model]
 * @return {[String]}          [template html string]
 */
function treeview(nodeItem) { return `
<div class="treeview-node">
    <span data-codigo="${nodeItem.cod}" data-observacao="${nodeItem.obs}" data-descricao="${nodeItem.descricao}" class="${nodeItem.nodes
		? " isTreeNode treeview-active "
		: " "}">${nodeItem.descricao}<i class='fa fa-plus-square-o addButton'></i><i class="fa fa-trash-o deleteButton"></i></span> ${nodeItem.nodes ? `
    <ul>
        <li>
            ${nodeItem.nodes.map(treeview).join("")}
        </li>
    </ul>` : ""}
</div>`; }

/**
 * [Filtro da árvore para o Search]
 * @param  {[Object]} item   [objeto do iterator]
 * @param  {[String]} search [string do search]
 * @return {[String]}        [String do match do search]
 */
function filterTree(item, search) {
  if (item.nodes) item.nodes = item.nodes.filter(item => filterTree(item, search));
  return matches(item.descricao, search) || (item.nodes && item.nodes.length);
}

/**
 * [match para a função de filterTree]
 * @param  {[String]} string [item.descricao]
 * @param  {[String]} search [search string]
 * @return {[String]}        [match]
 */
function matches(string, search) {
	return string && string.toLowerCase().includes(search.toLowerCase());
}

/**
 * [filtro para match de items deletados]
 * @param  {[String]} string [item.descricao]
 * @param  {[String]} search [search string]
 * @return {[String]}        [match]
 */
function filterDelete(string, search) {
	return string !== search;
}

/**
 * [Adicona novo node na tree]
 * @param  {[Object]} item [item a ser adicionado na tree]
 * @param  {[String]} search [search string]
 * @return {[Object]}        [node]
 */
function addNode(item, search) {
	if(item.descricao == search){
		if(!item.nodes) {
			item.nodes = [{
				cod: newNode.cod,
				descricao: newNode.desc,
				obs: newNode.obs
			}]
		}else{
			item.nodes.push({
				cod: newNode.cod,
				descricao: newNode.desc,
				obs: newNode.obs
			})
		}
	}
  	if (item.nodes) item.nodes = item.nodes.map(item => addNode(item, search));
  	return item;
}

/**
 * [Deletar node da tree]
 * @param  {[Object]} item [item]
 * @param  {[String]} search [search string]
 * @return {[String]}        [filtro para deletar o node]
 */
function deleteNode(item, search) {
  	if (item.nodes) item.nodes = item.nodes.filter(item => deleteNode(item, search));
  	return filterDelete(item.descricao, search);
}

/**
 * [Função que faz a busca na tree]
 * @param  {[String]} searchString [search string]
 */
function doSearch(searchString){
	let dataRef = JSON.parse(JSON.stringify(data)); // deep clone
	searchResult = dataRef.filter(item => filterTree(item, searchString));
	render(searchResult);
}

/**
 * [bind da função de adicionar node]
 * @param  {[Element]} addNodeButton [html element]
 */
function bindAddNode(addNodeButton){
	Array.from(addNodeButton).map((item) => {
				item.addEventListener('click', (e) => {
					let ref = e.target.closest('span').textContent;
					openModal(ref, item);
				})
	})
}

/**
 * [bind da função que veririca se o no da tree contem nodes]
 */
function isTreeNode(){
	let items = document.querySelectorAll('.treeview-node');
		Array.from(items).map( item => {
			let checkItem = item.querySelector('ul .treeview-node');
			if(!checkItem) {
				let findSpan = item.querySelector('.isTreeNode');
				if(findSpan){
					findSpan.classList.remove('isTreeNode');
				}
			}
		})
}

/**
 * [bind da função de deletar node]
 * @param  {[Element]} deleteNodeButton [html element]
 */
function bindDeleteNode(deleteNodeButton){
	 Array.from(deleteNodeButton).map((item) => {
	 			item.addEventListener('click', (e) => {
						if(confirm("Deseja realmente excluir?")){
							let ref = e.target.closest('span').textContent;
							data = data.filter(item => deleteNode(item, ref));
							render(data);
							isTreeNode();
							tooltipTemplate.classList.remove('active');
						}
	 			})
	 })
}

/**
 * [bind da função collapse]
 * @param  {[Element]} treeNode [html Element]
 */
function bindToggleCollapse(treeNode){
	let arrayFrom = Array.from(treeNode);
	let checkAllItemsCollapse;
	 arrayFrom.map((item) => {
	 			item.addEventListener('click', (e) => {
						e.stopPropagation();
						item.classList.toggle('treeview-active');
						checkAllItemsCollapse = arrayFrom.map(item => item.classList.contains('treeview-active'))
						checkCollapseAll(checkAllItemsCollapse);
	 			})
	 })
}

/**
 * [verifica se todos os items foram collapsados ou se pelo menos um está aberto]
 * @param  {[Array]} checkCollapse [array de booleans]
 */
function checkCollapseAll(checkCollapse){
	let check = checkCollapse.filter(item => item);
	check.length == 0 ? collapseButton.classList.remove('active') : collapseButton.classList.add('active');
}

/**
 * [collapseAll function para fechar todos nos]
 */
function collapseAll(){
	let check = collapseButton.classList.contains('active');
	check ? collapseButton.classList.remove('active') : collapseButton.classList.add('active');
	Array.from(document.querySelectorAll('.isTreeNode')).map(item => {
		check ? item.classList.remove('treeview-active') : item.classList.add('treeview-active');
	});
}
collapseButton.addEventListener('click', collapseAll);

/**
 * [CONTROLLER render function para renderizar cada data model passado]
 * @param  {[Array]} model [data model]
 */
function render(model){
	template = `${model.map(treeview).join("")}`;
	wrapper.innerHTML = template;
	bindAddNode(document.querySelectorAll('.addButton'));
	bindDeleteNode(document.querySelectorAll('.deleteButton'));
	bindToggleCollapse(document.querySelectorAll('.isTreeNode'));
	tooltip();
}

/**
 * [closeModal function]
 */
function closeModal(){
	modalNode.classList.remove('active');
	formModalNode.reset();
}

/**
 * [openModal function]
 */
function openModal(ref){
	modalNode.classList.add('active');
	modalData.nodeName = ref; // guarda referencia do node que foi clicado
}

/**
 * [function que adiciona um node no na tree baseado no form preenchido]
 */
function addNewNode(){
	let formData = new FormData(formModalNode);
	for (let [key, value] of formData.entries()) {
		newNode[key] = value;
	}
	data = data.map(item => addNode(item, modalData.nodeName));
	render(data);
	closeModal();
}
closeModalNode.addEventListener('click', closeModal);

/**
 * [submit do form de adicionar novo no]
 */
formModalNode.addEventListener('submit', e => {
	e.preventDefault();
	addNewNode();
})

/**
 * [populateTooltip info]
 * @param  {[Object]} args [data.set object]
 */
function populateTooltip(args){
	tooltipTemplate.querySelector('#cod').textContent = args.codigo;
	tooltipTemplate.querySelector('#desc').textContent = args.descricao;
	tooltipTemplate.querySelector('#obs').textContent = args.observacao;
}

/**
 * [tooltip function que adiciona a posição do tooltip e chama a função de populateTooltip]
 */
function tooltip(){
	const tooltipHoverElement = document.querySelectorAll('.treeview-node > span');
	Array.from(tooltipHoverElement).map(item => {
		item.addEventListener('mouseover', e => {
        let target = item;
		let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
		let targetPosition = item.getBoundingClientRect();
		populateTooltip(target.dataset);
		tooltipTemplate.style.left = targetPosition.left + 'px';
		tooltipTemplate.style.top = (targetPosition.top + scrollTop) + 'px';
		tooltipTemplate.classList.add('active');
		})
		item.addEventListener('mouseleave', e => {
			tooltipTemplate.classList.remove('active');
		})
	})
}

/**
 * [first load]
 */
window.onload = render(data);
