function pow(b, e, m)
{
	let res = 1n;
	while (e != 0)
	{
		if (e & 1n)
		{
			res *= b;
			res %= m;
		}
		b = b * b % m;
		e >>= 1n;
	}
	return res;
}
function bigrandom(n)
{
	let tmp = n, cnt = 0;
	while (tmp != 0n)
	{
		++cnt;
		tmp >>= 4n;
	}
	let res = 0n;
	while (cnt-- != 0)
	{
		res <<= 4n;
		res += BigInt(Math.floor(Math.random() * 16));
	}
	res %= n;
	return res;
}
function isPrime(n)
{
	if (n <= 100n)
	{
		for (let i = 2n; i <= 10n; ++i)
			if (n % i == 0n && n != i)
				return false;
		return true;
	}
	if (n % 2n == 0n || n % 3n == 0n)
		return false;
	let u = n - 1n, t = 0;
	while ((u & 1n) != 0n)
	{
		u >>= 1n;
		++t;
	}
	let test_cast = 16;
	while (test_cast != 0)
	{
		--test_cast;
		let a = bigrandom(n - 3n) + 2n;
		let v = pow(a, u, n);
		if (v == 1)
			continue;
		let flag = false;
		for (let i = 0; i < t; ++i)
		{
			if (v == -1n)
			{
				flag = true;
				break;
			}
			v = v * v % n;
		}
		if (!flag)
			return false;
	}
	return true;
}
function gcd(x, y) { return y == 0n ? x : gcd(y, x % y); }
function factorize(n)
{
	if (n == 4n)
		return 2n;
	if (isPrime(n))
		return -1n;
	while (true)
	{
		let c = bigrandom(n - 1n) + 1n;
		let single = c, double = (c * c + c) % n;
		while (single != double)
		{
			let g = gcd(single < double ? double - single : single - double, n);
			if (g != 1n)
				if (g == n)
					break;
				else
					return g;
			single = (single * single + c) % n;
			double = (double * double + c) % n;
			double = (double * double + c) % n;
		}
	}
}
self.onmessage = e =>
{
	let list = [{ number: e.data, state: false }];
	let cnt = 1;
	self.postMessage(list);
	while (cnt != 0)
	{
		let pos = 0;
		while (list[pos].state)
			++pos;
		let g = factorize(list[pos].number);
		if (g == -1n)
		{
			list[pos].state = true;
			--cnt;
		}
		else
		{
			list[pos].number /= g;
			list.push({ number: g, state: false });
			++cnt;
		}
		list.sort((a, b) => (a.number < b.number ? -1 : 1));
		self.postMessage(list);
	}
	self.close();
};