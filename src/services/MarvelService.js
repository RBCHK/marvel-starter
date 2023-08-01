class MarvelService {
	_apiBase = 'https://gateway.marvel.com:443/';
	_apiPath = 'v1/public/characters';
	_apiKey = `apikey=9ff21ab744d0cb1f19d1a75ecfc91b3f`;
	//_offset = 110;

	getResource = async url => {
		let res = await fetch(url);

		if (!res.ok) {
			throw new Error(`Could not fetch ${url}, status: ${res.status}`);
		}

		return await res.json();
	};

	getAllCharacters = async offset => {
		const res = await this.getResource(
			`${this._apiBase}${this._apiPath}?limit=9&offset=${offset}&${this._apiKey}`
		);
		return res.data.results.map(this._transformCharacter);
	};

	getCharacter = async id => {
		const res = await this.getResource(
			`${this._apiBase}${this._apiPath}/${id}?${this._apiKey}`
		);
		return this._transformCharacter(res.data.results[0]);
	};

	_transformCharacter = character => {
		const { name, id, description, thumbnail, urls, comics } = character;

		return {
			name,
			id,
			description,
			thumbnail: `${thumbnail.path}.${thumbnail.extension}`,
			homepage: urls[0].url,
			wiki: urls[1].url,
			comics: comics.items,
		};
	};
}

export default MarvelService;
