class MarvelService {
	_apiBase = 'https://gateway.marvel.com:443/';
	_apiPath = 'v1/public/characters';
	_apiKey = `apikey=9ff21ab744d0cb1f19d1a75ecfc91b3f`;

	getResource = async url => {
		let res = await fetch(url);

		if (!res.ok) {
			throw new Error(`Could not fetch ${url}, status: ${res.status}`);
		}

		return await res.json();
	};

	getAllCharacters = () => this.getResource(`${this._apiBase}${this._apiPath}?${this._apiKey}`);

	getCharacter = async id => {
		const res = await this.getResource(`${this._apiBase}${this._apiPath}/${id}?${this._apiKey}`);
		return this._transformCharacter(res);
	};

	_transformCharacter = res => {
		const { name, description, thumbnail, urls } = res.data.results[0];

		return {
			name,
			description,
			thumbnail: `${thumbnail.path}.${thumbnail.extension}`,
			homepage: urls[0].url,
			wiki: urls[1].url,
		};
	};
}

export default MarvelService;
