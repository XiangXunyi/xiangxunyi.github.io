function levenshtein(s1, s2)
{
	const matrix = [];
	for (let i = 0; i <= s1.length; i++)
	{
		matrix[i] = [i];
	}
	for (let j = 1; j <= s2.length; j++)
	{
		matrix[0][j] = j;
	}
	for (let i = 1; i <= s1.length; i++)
	{
		for (let j = 1; j <= s2.length; j++)
		{
			if (s1.charAt(i - 1) === s2.charAt(j - 1))
				matrix[i][j] = matrix[i - 1][j - 1];
			else
				matrix[i][j] = Math.min(
					matrix[i - 1][j - 1] + 2, // replace
					matrix[i][j - 1] + 1, // insert
					matrix[i - 1][j] + 1 // delete
				);
		}
	}
	let res = matrix[s1.length][s2.length];
	let flag = true;
	for (let i = 0; i < s2.length; ++i)
		flag &= i < s1.length && s1.charAt(i) === s2.charAt(i);
	console.log(flag);
	if (flag)
		res -= 114514;
	return res;
}

function removeError()
{
	let list = document.getElementById("error-list");
	list.removeChild(list.firstElementChild);
}

function showError(msg, color)
{
	let list = document.getElementById("error-list");
	let p = document.createElement("p");
	p.innerHTML = msg;
	p.style.color = color;
	list.appendChild(p);
	setTimeout(removeError, 3000);
}

let contest = [];
fetch("/apps/oiersearch/data.json")
	.then(response => 
	{
		if (!response.ok)
			throw new Error(`网络请求失败，HTTP 响应代码为 ${response.status}`);
		return response.json();
	})
	.then(data => { contest = data; })
	.catch(error => { showError(error.message, "red"); });

class limit
{
	constructor()
	{
		this.flag = false;
		this.score = -1;
		this.level = "";
	}
}
let lim = [];
for (let i = 0; i < contests.length; ++i)
	lim.push(new limit());

function updateContestList()
{
	let list = document.getElementById("contest-list");
	list.innerHTML = "";
	let header = document.createElement("tr");
	let nameHeader = document.createElement("th");
	nameHeader.innerHTML = "比赛名称";
	nameHeader.style.width = "40%";
	let scoreHeader = document.createElement("th");
	scoreHeader.innerHTML = "得分";
	scoreHeader.style.width = "20%";
	let levelHeader = document.createElement("th");
	levelHeader.innerHTML = "奖项";
	levelHeader.style.width = "20%";
	let removeHeader = document.createElement("th");
	removeHeader.innerHTML = "操作";
	removeHeader.style.width = "20%";
	header.appendChild(nameHeader);
	header.appendChild(scoreHeader);
	header.appendChild(levelHeader);
	header.appendChild(removeHeader);
	list.appendChild(header);
	for (let i = 0; i < contests.length; ++i)
		if (lim[i].flag)
		{
			let item = document.createElement("tr");
			let name = document.createElement("td");
			name.innerHTML = contests[i];
			let score = document.createElement("td");
			let div = document.createElement("div");
			div.innerHTML = lim[i].score == -1 ? "不限" : lim[i].score;
			div.onclick = () => { inputScore_start(i); };
			score.id = `score${i}`;
			score.appendChild(div);
			let level = document.createElement("td");
			div = document.createElement("div");
			div.innerHTML = lim[i].level == "" ? "不限" : lim[i].level;
			div.onclick = () => { inputLevel_start(i); };
			level.id = `level${i}`;
			level.appendChild(div);
			let removeButton = document.createElement("td");
			removeButton.innerHTML = `<button onclick="removeContest(${i})">删除</button>`;
			item.appendChild(name);
			item.appendChild(score);
			item.appendChild(level);
			item.appendChild(removeButton);
			list.appendChild(item);
		}
}
updateContestList();

function removeContest(id)
{
	lim[id].flag = false;
	updateContestList();
}

function addContest(id)
{
	if (lim[id].flag)
		showError("该比赛已经添加到列表中了", "red");
	else
		lim[id].flag = true;
	updateContestList();
}

function inputScore_start(id)
{
	let element = document.getElementById(`score${id}`);
	let input = document.createElement("input");
	input.type = "number";
	input.value = lim[id].score;
	input.style.width = "100%";
	input.onblur = () => { inputScore_end(id, (Number)(input.value)); };
	element.innerHTML = "";
	element.appendChild(input);
	input.focus();
}

function inputScore_end(id, score)
{
	lim[id].score = score;
	updateContestList();
}

function inputLevel_start(id)
{
	let element = document.getElementById(`level${id}`);
	let select = document.createElement("select");
	let option = document.createElement("option");
	option.value = "";
	option.innerHTML = "不限";
	select.appendChild(option);
	option = document.createElement("option");
	option.value = "金牌";
	option.innerHTML = "金牌";
	select.appendChild(option);
	option = document.createElement("option");
	option.value = "银牌";
	option.innerHTML = "银牌";
	select.appendChild(option);
	option = document.createElement("option");
	option.value = "铜牌";
	option.innerHTML = "铜牌";
	select.appendChild(option);
	option = document.createElement("option");
	option.value = "一等奖";
	option.innerHTML = "一等奖";
	select.appendChild(option);
	option = document.createElement("option");
	option.value = "二等奖";
	option.innerHTML = "二等奖";
	select.appendChild(option);
	option = document.createElement("option");
	option.value = "三等奖";
	option.innerHTML = "三等奖";
	select.appendChild(option);

	element.innerHTML = "";
	element.appendChild(select);
	select.onblur = () => { inputLevel_end(id, select.value); };
	select.value = lim[id].level;
	select.style.width = "100%";
	select.focus();
}

function inputLevel_end(id, level)
{
	lim[id].level = level;
	updateContestList();
}

function searchContest()
{
	const input = document.getElementById("contest-input").value.trim().toUpperCase();
	let result = [];
	for (let i = 0; i < contests.length; ++i)
		result.push({ name: contests[i], id: i });
	result.sort((a, b) => levenshtein(a.name, input) - levenshtein(b.name, input));
	let list = document.getElementById("search-result");
	list.innerHTML = "";
	for (let i = 0; i < 10; ++i)
	{
		let item = document.createElement("li");
		item.innerHTML = `${result[i].name}&nbsp;&nbsp;`;
		let button = document.createElement("button");
		button.innerHTML = "Add";
		button.onclick = () => { addContest(result[i].id); };
		item.appendChild(button);
		list.appendChild(item);
	}
}

function generate()
{
	let information = [];
	for (let i = 0; i < lim.length; ++i)
		if (lim[i].flag)
			information.push({ id: i, score: lim[i].score, level: lim[i].level });
	let element = document.getElementById("code");
	element.style.display = "block";
	element.innerHTML = `/** @param {OIerDb} db */
export default (db) =&gt
{
	return db.oiers.filter((oier) =&gt
	{
		const information = JSON.parse(\`${JSON.stringify(information)}\`);
		let res = true;
		for (let each of information)
		{
			let exist = false;
			for (let record of oier.records)
				if (record.contest.id === each.id)
					if (each.score === -1 || record.score === each.score)
						if (each.level === "" || record.level === each.level)
							exist = true;
			if (!exist)
				res = false;
		}
		return res;
	}).sort((a, b) =&gt a.records.length - b.records.length);
};`;
}

async function copyCode()
{
	try
	{
		await navigator.clipboard.writeText(document.getElementById("code").innerHTML.replace(/&gt;/g, ">"));
		showError("代码已复制到剪贴板", "green");
	}
	catch (e)
	{
		showError(`复制失败，请手动复制。错误信息：${e}`, "red");
	}
}

function openOierDB()
{
	window.open(`https://www.xn--vuqs4zq3d.com/custom-search`);
}