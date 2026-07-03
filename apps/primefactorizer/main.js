document.getElementById("number-input").addEventListener("keydown", (event) => 
{
	if (event.key == "Enter")
		newtask();
});

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

function newtask()
{
	let n;
	try
	{
		n = BigInt(document.getElementById("number-input").value);
		if (n <= 0n)
			throw (null);
	}
	catch (err)
	{
		showError("请输入正整数", "red");
		return;
	}
	let list = document.getElementById("factorizing-list");
	let p = document.createElement("p");
	list.appendChild(p);

	let worker = new Worker("/apps/primefactorizer/worker.js");
	worker.onmessage = (e) =>
	{
		const result = e.data;
		let string = "", last = 0n, laststate = false, cnt = 0;
		for (let i = 0; i < result.length; ++i)
		{
			let x = result[i].number;
			let state = result[i].state;
			if (x == last)
				++cnt;
			else
			{
				if (cnt == 1)
					string += (laststate ? `${last}` : `<span style="color: red">${last}</span>`) + ` * `;
				else if (cnt != 0)
					string += (laststate ? `${last}` : `<span style="color: red">${last}</span>`) + `<sup>${cnt}</sup> * `;
				last = x;
				laststate = state;
				cnt = 1;
			}
		}
		if (cnt == 1)
			string += laststate ? `${last}` : `<span style="color: red">${last}</span>`;
		else
			string += (laststate ? `${last}` : `<span style="color: red">${last}</span>`) + `<sup>${cnt}</sup>`;
		p.innerHTML = `${n} = ${string}`;
	};
	worker.postMessage(n);
}